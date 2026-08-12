import {computed, reactive} from 'vue';
import {defineStore} from 'pinia';
import type {MusicItemType} from '@/types/global';
import {
	type ChangeTrackReason,
	PLAY_MODE_ORDER,
	type PlayMode,
	type PlayQueueItem,
	type PlayQueueResponse,
	type PlayQueueState,
	type QueueSourceType,
} from '@/types/playQueue';
import {
	addQueueItemToEnd,
	addQueueItemToNext,
	clearPlayQueue,
	getPlayQueue,
	removeQueueItem,
	updateCurrentQueue,
	updatePlayQueueMode,
} from '@/api/playQueue';
import {getData, setData} from '@/util/localStorage';
import {TOKEN} from '@/config';
import {useGlobalStore} from '@/store/global';

const PLAY_QUEUE_STORAGE_KEY = 'BEETHOVEN_PLAY_QUEUE';
const MAX_RANDOM_HISTORY = 2000;

function isPlayMode(value: unknown): value is PlayMode {
	return typeof value === 'string' && PLAY_MODE_ORDER.includes(value as PlayMode);
}

function normalizePlayMode(value: unknown, fallback: PlayMode = 'LOOP'): PlayMode {
	return isPlayMode(value) ? value : fallback;
}

function createQueueItem(music: MusicItemType, sourceType?: QueueSourceType | string, sourceId?: string): PlayQueueItem {
	const musicId = music.id ?? '';
	return {
		queueItemId: crypto.randomUUID ? crypto.randomUUID() : `${musicId}-${Date.now()}-${Math.random()}`,
		musicId,
		music,
		sourceType,
		sourceId,
	};
}

function sortItemsByPlayOrder(items: PlayQueueItem[]): PlayQueueItem[] {
	if (!items.every(item => Number.isFinite(item.sortNo))) return [...items];
	return items
		.map((item, index) => ({item, index}))
		.sort((left, right) => {
			return left.item.sortNo! - right.item.sortNo! || left.index - right.index;
		})
		.map(({item}) => item);
}

export const usePlayQueueStore = defineStore('playQueue', () => {
	const queue = reactive<PlayQueueState>({
		id: undefined,
		items: [],
		currentIndex: -1,
		currentMusicId: undefined,
		currentTime: 0,
		playMode: 'LOOP',
		randomOrder: [],
		randomCursor: -1,
		sourceType: undefined,
		sourceId: undefined,
		version: 0,
	});

	const currentItem = computed(() => {
		if (queue.currentIndex < 0) return undefined;
		return queue.items[queue.currentIndex];
	});

	function setQueue(items: PlayQueueItem[], startMusicId?: string, sourceType?: QueueSourceType | string, sourceId?: string) {
		queue.id = undefined;
		queue.items = sortItemsByPlayOrder(items.filter(item => item.musicId));
		queue.sourceType = sourceType;
		queue.sourceId = sourceId;
		queue.currentIndex = resolveStartIndex(queue.items, startMusicId);
		queue.currentMusicId = queue.items[queue.currentIndex]?.musicId;
		queue.currentTime = 0;
		queue.randomOrder = [];
		queue.randomCursor = -1;
		if (queue.playMode === 'RANDOM') {
			resetRandomOrder();
		}
		queue.version++;
		persistQueue();
	}

	function setQueueFromMusicList(musicList: MusicItemType[], startMusicId?: string, sourceType?: QueueSourceType | string, sourceId?: string) {
		const items = musicList.map(music => createQueueItem(music, sourceType, sourceId));
		setQueue(items, startMusicId, sourceType, sourceId);
	}

	function applyRemoteQueue(remoteQueue?: PlayQueueResponse) {
		if (!remoteQueue) return;
		const previousMode = queue.playMode;
		const previousRandomOrder = [...queue.randomOrder];
		const previousRandomCursorId = queue.randomOrder[queue.randomCursor];
		const remoteItems = remoteQueue.items ?? [];
		const remoteCurrentItem = remoteItems[remoteQueue.currentIndex ?? -1];
		queue.id = remoteQueue.id;
		queue.items = sortItemsByPlayOrder(remoteItems);
		queue.currentIndex = resolveRemoteCurrentIndex(
			queue.items,
			remoteCurrentItem?.queueItemId,
			remoteQueue.currentMusicId,
			remoteQueue.currentIndex,
		);
		queue.currentMusicId = queue.items[queue.currentIndex]?.musicId ?? remoteQueue.currentMusicId;
		queue.currentTime = remoteQueue.currentTime ?? 0;
		queue.playMode = normalizePlayMode(remoteQueue.playMode, queue.playMode);
		queue.sourceType = remoteQueue.sourceType;
		queue.sourceId = remoteQueue.sourceId;
		queue.randomOrder = [];
		queue.randomCursor = -1;
		if (queue.playMode === 'RANDOM') {
			const currentQueueItemId = queue.items[queue.currentIndex]?.queueItemId;
			const validIds = new Set(queue.items.map(item => item.queueItemId));
			const retainedOrder = previousMode === 'RANDOM'
				? previousRandomOrder.filter(queueItemId => validIds.has(queueItemId))
				: [];
			const retainedIds = new Set(retainedOrder);
			const newIds = queue.items
				.map(item => item.queueItemId)
				.filter(queueItemId => !retainedIds.has(queueItemId));
			queue.randomOrder = [...retainedOrder, ...newIds];
			const currentCursor = currentQueueItemId ? queue.randomOrder.lastIndexOf(currentQueueItemId) : -1;
			if (currentCursor >= 0 && previousMode === 'RANDOM' && previousRandomCursorId === currentQueueItemId) {
				queue.randomCursor = currentCursor;
			} else {
				resetRandomOrder();
			}
		}
		queue.version = remoteQueue.version ?? queue.version + 1;
		persistQueue();
	}

	function playAt(index: number, alignRandom = true) {
		if (index < 0 || index >= queue.items.length) return false;
		queue.currentIndex = index;
		queue.currentMusicId = queue.items[index].musicId;
		queue.currentTime = 0;
		if (queue.playMode === 'RANDOM' && alignRandom) alignRandomCursorToCurrent();
		queue.version++;
		persistQueue();
		syncCurrent();
		return true;
	}

	function next(reason: ChangeTrackReason = 'manual-next') {
		const index = getNextIndex(reason);
		if (index === undefined) return false;
		return playAt(index, false);
	}

	function prev(reason: ChangeTrackReason = 'manual-prev') {
		const index = getPrevIndex(reason);
		if (index === undefined) return false;
		return playAt(index, false);
	}

	function findMusicIndex(musicId?: string) {
		if (!musicId) return -1;
		return queue.items.findIndex(item => item.musicId === musicId);
	}

	function refreshExistingMusic(index: number, music: MusicItemType) {
		if (index < 0) return;
		queue.items[index].music = {
			...queue.items[index].music,
			...music,
		};
		persistQueue();
	}

	function insertLocalItem(music: MusicItemType, insertIndex: number, sourceType?: QueueSourceType | string, sourceId?: string) {
		const item = createQueueItem(music, sourceType, sourceId);
		queue.items.splice(insertIndex, 0, item);
		if (queue.currentIndex < 0) {
			queue.currentIndex = 0;
			queue.currentMusicId = music.id;
		}
		if (queue.playMode === 'RANDOM') {
			if (queue.randomOrder.length > 0) queue.randomOrder.push(item.queueItemId);
			else resetRandomOrder();
		} else {
			queue.randomOrder = [];
			queue.randomCursor = -1;
		}
		queue.version++;
		persistQueue();
		return item;
	}

	function rollbackLocalItem(queueItemId: string) {
		const index = queue.items.findIndex(item => item.queueItemId === queueItemId);
		if (index < 0) return;
		const globalStore = useGlobalStore();
		queue.items.splice(index, 1);
		if (index < queue.currentIndex) queue.currentIndex--;
		if (queue.items.length === 0) {
			queue.currentIndex = -1;
			queue.currentMusicId = undefined;
			globalStore.global.canPlay = false;
		} else {
			queue.currentIndex = normalizeIndex(queue.currentIndex, queue.items.length);
			queue.currentMusicId = queue.items[queue.currentIndex]?.musicId;
		}
		queue.randomOrder = [];
		queue.randomCursor = -1;
		queue.version++;
		persistQueue();
	}

	async function addToNext(music: MusicItemType, sourceType?: QueueSourceType | string, sourceId?: string) {
		if (!music.id) return;
		const existingIndex = findMusicIndex(music.id);
		if (existingIndex >= 0) {
			refreshExistingMusic(existingIndex, music);
			return;
		}
		const insertIndex = Math.max(queue.currentIndex + 1, 0);
		const optimisticItem = insertLocalItem(music, insertIndex, sourceType, sourceId);
		if (getData(TOKEN)) {
			try {
				const response = await addQueueItemToNext({musicId: music.id, sourceType, sourceId});
				applyRemoteQueue(response.data);
			} catch (error) {
				rollbackLocalItem(optimisticItem.queueItemId);
				throw error;
			}
		}
	}

	async function addToEnd(music: MusicItemType, sourceType?: QueueSourceType | string, sourceId?: string) {
		if (!music.id) return;
		const existingIndex = findMusicIndex(music.id);
		if (existingIndex >= 0) {
			refreshExistingMusic(existingIndex, music);
			return;
		}
		const optimisticItem = insertLocalItem(music, queue.items.length, sourceType, sourceId);
		if (getData(TOKEN)) {
			try {
				const response = await addQueueItemToEnd({musicId: music.id, sourceType, sourceId});
				applyRemoteQueue(response.data);
			} catch (error) {
				rollbackLocalItem(optimisticItem.queueItemId);
				throw error;
			}
		}
	}

	async function remove(queueItemId: string) {
		if (getData(TOKEN) && queue.id) {
			const response = await removeQueueItem(queueItemId);
			applyRemoteQueue(response.data);
			return;
		}
		const index = queue.items.findIndex(item => item.queueItemId === queueItemId);
		if (index < 0) return;
		queue.items.splice(index, 1);
		if (index < queue.currentIndex) {
			queue.currentIndex--;
		} else if (index === queue.currentIndex) {
			queue.currentIndex = Math.min(queue.currentIndex, queue.items.length - 1);
		}
		queue.currentMusicId = queue.items[queue.currentIndex]?.musicId;
		if (queue.items.length === 0) {
			queue.currentIndex = -1;
			queue.currentMusicId = undefined;
		}
		queue.randomOrder = [];
		queue.randomCursor = -1;
		if (queue.playMode === 'RANDOM') resetRandomOrder();
		queue.version++;
		persistQueue();
		syncCurrent();
	}

	async function clear() {
		if (getData(TOKEN) && queue.id) {
			const response = await clearPlayQueue();
			applyRemoteQueue(response.data);
			return;
		}
		queue.id = undefined;
		queue.items = [];
		queue.currentIndex = -1;
		queue.currentMusicId = undefined;
		queue.currentTime = 0;
		queue.randomOrder = [];
		queue.randomCursor = -1;
		queue.version++;
		persistQueue();
	}

	async function setPlayMode(playMode: PlayMode) {
		if (!PLAY_MODE_ORDER.includes(playMode)) return;
		queue.playMode = playMode;
		queue.randomOrder = [];
		queue.randomCursor = -1;
		if (playMode === 'RANDOM') resetRandomOrder();
		queue.version++;
		persistQueue();
		if (getData(TOKEN) && queue.id) {
			try {
				// Keep the local random sequence intact. The endpoint is used for
				// persistence only; applying its full queue response here would
				// unnecessarily reshuffle the current device.
				await updatePlayQueueMode(playMode);
			} catch { /* local mode already updated */
			}
		}
	}

	function cyclePlayMode() {
		const index = PLAY_MODE_ORDER.indexOf(queue.playMode);
		void setPlayMode(PLAY_MODE_ORDER[(index + 1) % PLAY_MODE_ORDER.length]);
	}

	function updateCurrentTime(currentTime: number) {
		queue.currentTime = Math.max(Math.floor(currentTime), 0);
		persistQueue();
		if (getData(TOKEN) && queue.id) {
			updateCurrentQueue({
				musicId: queue.currentMusicId,
				currentIndex: queue.currentIndex,
				currentTime: queue.currentTime,
			}).catch(() => undefined);
		}
	}

	async function restoreQueue() {
		if (getData(TOKEN)) {
			try {
				const response = await getPlayQueue();
				if (response.data?.items?.length) {
					applyRemoteQueue(response.data);
					return;
				}
			} catch { /* fall back to local queue */
			}
		}

		const raw = getData(PLAY_QUEUE_STORAGE_KEY);
		if (!raw) return;
		try {
			const localQueue = JSON.parse(raw) as PlayQueueState;
			const localItems = localQueue.items ?? [];
			const localCurrentItem = localItems[localQueue.currentIndex];
			Object.assign(queue, localQueue);
			queue.playMode = normalizePlayMode(localQueue.playMode);
			queue.items = sortItemsByPlayOrder(localItems);
			queue.currentIndex = resolveRemoteCurrentIndex(
				queue.items,
				localCurrentItem?.queueItemId,
				localQueue.currentMusicId,
				localQueue.currentIndex,
			);
			queue.currentMusicId = queue.items[queue.currentIndex]?.musicId;
			queue.randomOrder = Array.isArray(queue.randomOrder)
				? queue.randomOrder.filter((queueItemId): queueItemId is string => typeof queueItemId === 'string')
				: [];
			queue.randomCursor = Number.isInteger(queue.randomCursor) ? queue.randomCursor : -1;
			if (queue.playMode === 'RANDOM') ensureRandomOrder();
			else {
				queue.randomOrder = [];
				queue.randomCursor = -1;
			}
			persistQueue();
		} catch {
			localStorage.removeItem(PLAY_QUEUE_STORAGE_KEY);
		}
	}

	function getNextIndex(reason: ChangeTrackReason): number | undefined {
		if (queue.items.length === 0 || queue.currentIndex < 0) return undefined;
		if (queue.playMode === 'RANDOM') return getNextRandomIndex();
		if (queue.playMode === 'SINGLE_LOOP' && reason === 'ended') return queue.currentIndex;

		const nextIndex = queue.currentIndex + 1;
		if (nextIndex < queue.items.length) return nextIndex;
		if (queue.playMode === 'LOOP' || queue.playMode === 'SINGLE_LOOP') return 0;
		return undefined;
	}

	function getPrevIndex(_reason: ChangeTrackReason): number | undefined {
		if (queue.items.length === 0 || queue.currentIndex < 0) return undefined;
		if (queue.playMode === 'RANDOM') return getPrevRandomIndex();

		const prevIndex = queue.currentIndex - 1;
		if (prevIndex >= 0) return prevIndex;
		if (queue.playMode === 'LOOP' || queue.playMode === 'SINGLE_LOOP') return queue.items.length - 1;
		return undefined;
	}

	function getNextRandomIndex(): number | undefined {
		ensureRandomOrder();
		if (queue.randomCursor < queue.randomOrder.length - 1) {
			queue.randomCursor++;
			return findQueueIndexByItemId(queue.randomOrder[queue.randomCursor]);
		}

		const previousLength = queue.randomOrder.length;
		appendRandomCycle();
		if (queue.randomOrder.length === previousLength) return undefined;
		queue.randomCursor++;
		return findQueueIndexByItemId(queue.randomOrder[queue.randomCursor]);
	}

	function getPrevRandomIndex(): number | undefined {
		ensureRandomOrder();
		if (queue.randomCursor <= 0) return undefined;
		queue.randomCursor--;
		return findQueueIndexByItemId(queue.randomOrder[queue.randomCursor]);
	}

	function resetRandomOrder() {
		const currentQueueItemId = queue.items[queue.currentIndex]?.queueItemId;
		const otherIds = queue.items
			.map(item => item.queueItemId)
			.filter(queueItemId => queueItemId !== currentQueueItemId);
		shuffle(otherIds);
		queue.randomOrder = currentQueueItemId ? [currentQueueItemId, ...otherIds] : otherIds;
		queue.randomCursor = currentQueueItemId ? 0 : -1;
	}

	function appendRandomCycle() {
		const currentQueueItemId = queue.items[queue.currentIndex]?.queueItemId;
		if (!currentQueueItemId) return;
		const ids = queue.items
			.map(item => item.queueItemId)
			.filter(queueItemId => queue.items.length === 1 || queueItemId !== currentQueueItemId);
		shuffle(ids);
		queue.randomOrder.push(...ids);
		trimRandomHistory();
	}

	function ensureRandomOrder() {
		const validIds = new Set(queue.items.map(item => item.queueItemId));
		queue.randomOrder = queue.randomOrder.filter(queueItemId => validIds.has(queueItemId));
		const currentQueueItemId = queue.items[queue.currentIndex]?.queueItemId;
		if (!currentQueueItemId) {
			queue.randomOrder = [];
			queue.randomCursor = -1;
			return;
		}
		if (!queue.randomOrder.length || !queue.randomOrder.includes(currentQueueItemId)) {
			resetRandomOrder();
			return;
		}
		const cursorId = queue.randomOrder[queue.randomCursor];
		if (cursorId !== currentQueueItemId) alignRandomCursorToCurrent();
	}

	function alignRandomCursorToCurrent() {
		const currentQueueItemId = queue.items[queue.currentIndex]?.queueItemId;
		if (!currentQueueItemId) return;
		ensureRandomOrderWithoutAlignment();
		const cursor = queue.randomOrder.lastIndexOf(currentQueueItemId);
		if (cursor >= 0) {
			queue.randomCursor = cursor;
			return;
		}
		queue.randomOrder.push(currentQueueItemId);
		queue.randomCursor = queue.randomOrder.length - 1;
		trimRandomHistory();
	}

	function ensureRandomOrderWithoutAlignment() {
		const validIds = new Set(queue.items.map(item => item.queueItemId));
		queue.randomOrder = queue.randomOrder.filter(queueItemId => validIds.has(queueItemId));
		const currentQueueItemId = queue.items[queue.currentIndex]?.queueItemId;
		if (!currentQueueItemId || !queue.randomOrder.length) resetRandomOrder();
	}

	function trimRandomHistory() {
		if (queue.randomCursor <= MAX_RANDOM_HISTORY) return;
		const removeCount = queue.randomCursor - MAX_RANDOM_HISTORY;
		queue.randomOrder.splice(0, removeCount);
		queue.randomCursor -= removeCount;
	}

	function findQueueIndexByItemId(queueItemId?: string): number | undefined {
		if (!queueItemId) return undefined;
		const index = queue.items.findIndex(item => item.queueItemId === queueItemId);
		return index >= 0 ? index : undefined;
	}

	function shuffle<T>(items: T[]) {
		for (let index = items.length - 1; index > 0; index--) {
			const swapIndex = Math.floor(Math.random() * (index + 1));
			[items[index], items[swapIndex]] = [items[swapIndex], items[index]];
		}
	}

	function syncCurrent() {
		if (!getData(TOKEN) || !queue.id) return;
		updateCurrentQueue({
			musicId: queue.currentMusicId,
			currentIndex: queue.currentIndex,
			currentTime: queue.currentTime,
		}).catch(() => undefined);
	}

	function persistQueue() {
		setData(PLAY_QUEUE_STORAGE_KEY, JSON.stringify(queue));
	}

	function resolveStartIndex(items: PlayQueueItem[], startMusicId?: string) {
		if (items.length === 0) return -1;
		if (!startMusicId) return 0;
		const index = items.findIndex(item => item.musicId === startMusicId);
		return index >= 0 ? index : 0;
	}

	function normalizeIndex(index: number, length: number) {
		if (length === 0) return -1;
		if (index < 0) return 0;
		if (index >= length) return length - 1;
		return index;
	}

	function resolveRemoteCurrentIndex(
		items: PlayQueueItem[],
		queueItemId?: string,
		musicId?: string,
		fallbackIndex = -1,
	) {
		if (queueItemId) {
			const index = items.findIndex(item => item.queueItemId === queueItemId);
			if (index >= 0) return index;
		}
		if (musicId) {
			const index = items.findIndex(item => item.musicId === musicId);
			if (index >= 0) return index;
		}
		return normalizeIndex(fallbackIndex, items.length);
	}

	return {
		queue,
		currentItem,
		setQueue,
		setQueueFromMusicList,
		applyRemoteQueue,
		playAt,
		next,
		prev,
		addToNext,
		addToEnd,
		remove,
		clear,
		setPlayMode,
		cyclePlayMode,
		updateCurrentTime,
		restoreQueue,
	};
});

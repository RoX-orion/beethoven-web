import { computed, reactive } from 'vue';
import { defineStore } from 'pinia';
import type { MusicItemType } from '@/types/global';
import type { PlayMode, PlayQueueItem, PlayQueueResponse, PlayQueueState, QueueSourceType } from '@/types/playQueue';
import {
	addQueueItemToEnd,
	addQueueItemToNext,
	clearPlayQueue,
	getPlayQueue,
	removeQueueItem,
	updateCurrentQueue,
	updatePlayQueueMode,
} from '@/api/playQueue';
import { getData, setData } from '@/util/localStorage';
import { TOKEN } from '@/config';

const PLAY_QUEUE_STORAGE_KEY = 'BEETHOVEN_PLAY_QUEUE';

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
		queue.items = items.filter(item => item.musicId);
		queue.sourceType = sourceType;
		queue.sourceId = sourceId;
		queue.currentIndex = resolveStartIndex(queue.items, startMusicId);
		queue.currentMusicId = queue.items[queue.currentIndex]?.musicId;
		queue.currentTime = 0;
		queue.randomOrder = [];
		queue.randomCursor = -1;
		queue.version++;
		persistQueue();
	}

	function setQueueFromMusicList(musicList: MusicItemType[], startMusicId?: string, sourceType?: QueueSourceType | string, sourceId?: string) {
		const items = musicList.map(music => createQueueItem(music, sourceType, sourceId));
		setQueue(items, startMusicId, sourceType, sourceId);
	}

	function applyRemoteQueue(remoteQueue?: PlayQueueResponse) {
		if (!remoteQueue) return;
		queue.id = remoteQueue.id;
		queue.items = remoteQueue.items ?? [];
		queue.currentIndex = normalizeIndex(remoteQueue.currentIndex ?? -1, queue.items.length);
		queue.currentMusicId = queue.items[queue.currentIndex]?.musicId ?? remoteQueue.currentMusicId;
		queue.currentTime = remoteQueue.currentTime ?? 0;
		queue.playMode = remoteQueue.playMode ?? queue.playMode;
		queue.sourceType = remoteQueue.sourceType;
		queue.sourceId = remoteQueue.sourceId;
		queue.randomOrder = [];
		queue.randomCursor = -1;
		queue.version = remoteQueue.version ?? queue.version + 1;
		persistQueue();
	}

	function playAt(index: number) {
		if (index < 0 || index >= queue.items.length) return false;
		queue.currentIndex = index;
		queue.currentMusicId = queue.items[index].musicId;
		queue.currentTime = 0;
		queue.version++;
		persistQueue();
		syncCurrent();
		return true;
	}

	function next() {
		const index = getNextIndex();
		if (index === undefined) return false;
		return playAt(index);
	}

	function prev() {
		const index = getPrevIndex();
		if (index === undefined) return false;
		return playAt(index);
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

	async function addToNext(music: MusicItemType, sourceType?: QueueSourceType | string, sourceId?: string) {
		if (!music.id) return;
		const existingIndex = findMusicIndex(music.id);
		if (existingIndex >= 0) {
			refreshExistingMusic(existingIndex, music);
			return;
		}
		if (getData(TOKEN)) {
			const response = await addQueueItemToNext({ musicId: music.id, sourceType, sourceId });
			applyRemoteQueue(response.data);
			return;
		}
		const insertIndex = Math.max(queue.currentIndex + 1, 0);
		queue.items.splice(insertIndex, 0, createQueueItem(music, sourceType, sourceId));
		if (queue.currentIndex < 0) {
			queue.currentIndex = 0;
			queue.currentMusicId = music.id;
		}
		queue.version++;
		persistQueue();
	}

	async function addToEnd(music: MusicItemType, sourceType?: QueueSourceType | string, sourceId?: string) {
		if (!music.id) return;
		const existingIndex = findMusicIndex(music.id);
		if (existingIndex >= 0) {
			refreshExistingMusic(existingIndex, music);
			return;
		}
		if (getData(TOKEN)) {
			const response = await addQueueItemToEnd({ musicId: music.id, sourceType, sourceId });
			applyRemoteQueue(response.data);
			return;
		}
		queue.items.push(createQueueItem(music, sourceType, sourceId));
		if (queue.currentIndex < 0) {
			queue.currentIndex = 0;
			queue.currentMusicId = music.id;
		}
		queue.version++;
		persistQueue();
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
		queue.playMode = playMode;
		queue.randomOrder = [];
		queue.randomCursor = -1;
		queue.version++;
		persistQueue();
		if (getData(TOKEN) && queue.id) {
			try {
				const response = await updatePlayQueueMode(playMode);
				applyRemoteQueue(response.data);
			} catch { /* local mode already updated */
			}
		}
	}

	function cyclePlayMode() {
		const modes: PlayMode[] = ['LOOP', 'SEQUENCE', 'RANDOM', 'SINGLE_LOOP'];
		const index = modes.indexOf(queue.playMode);
		setPlayMode(modes[(index + 1) % modes.length]);
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
			Object.assign(queue, localQueue);
			queue.currentIndex = normalizeIndex(queue.currentIndex, queue.items.length);
			queue.currentMusicId = queue.items[queue.currentIndex]?.musicId;
		} catch {
			localStorage.removeItem(PLAY_QUEUE_STORAGE_KEY);
		}
	}

	function getNextIndex(): number | undefined {
		if (queue.items.length === 0 || queue.currentIndex < 0) return undefined;
		if (queue.playMode === 'SINGLE_LOOP') return queue.currentIndex;
		if (queue.playMode === 'RANDOM') return getNextRandomIndex();

		const nextIndex = queue.currentIndex + 1;
		if (nextIndex < queue.items.length) return nextIndex;
		if (queue.playMode === 'LOOP') return 0;
		return undefined;
	}

	function getPrevIndex(): number | undefined {
		if (queue.items.length === 0 || queue.currentIndex < 0) return undefined;
		if (queue.playMode === 'RANDOM') return getPrevRandomIndex();

		const prevIndex = queue.currentIndex - 1;
		if (prevIndex >= 0) return prevIndex;
		if (queue.playMode === 'LOOP') return queue.items.length - 1;
		return undefined;
	}

	function getNextRandomIndex(): number | undefined {
		if (queue.randomOrder.length !== queue.items.length) {
			resetRandomOrder();
		}
		queue.randomCursor++;
		if (queue.randomCursor >= queue.randomOrder.length) {
			resetRandomOrder();
			queue.randomCursor = 0;
		}
		return queue.randomOrder[queue.randomCursor];
	}

	function getPrevRandomIndex(): number | undefined {
		if (queue.randomOrder.length !== queue.items.length) {
			resetRandomOrder();
		}
		queue.randomCursor--;
		if (queue.randomCursor < 0) {
			queue.randomCursor = queue.randomOrder.length - 1;
		}
		return queue.randomOrder[queue.randomCursor];
	}

	function resetRandomOrder() {
		queue.randomOrder = queue.items.map((_, index) => index);
		for (let i = queue.randomOrder.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[queue.randomOrder[i], queue.randomOrder[j]] = [queue.randomOrder[j], queue.randomOrder[i]];
		}
		queue.randomCursor = queue.randomOrder.indexOf(queue.currentIndex);
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


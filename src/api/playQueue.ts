import request from '@/util/request';
import type {
	AddQueueItemDTO,
	BuildQueueFromMusicListDTO,
	BuildQueueFromPlaylistDTO,
	PlayMode,
} from '@/types/playQueue';

export function getPlayQueue() {
	return request({
		url: '/queue',
		method: 'get',
	});
}

export function buildQueueFromPlaylist(data: BuildQueueFromPlaylistDTO) {
	return request({
		url: '/queue/fromPlaylist',
		method: 'post',
		data,
	});
}

export function buildQueueFromMusicList(data: BuildQueueFromMusicListDTO) {
	return request({
		url: '/queue/fromMusicList',
		method: 'post',
		data,
	});
}

export function addQueueItemToEnd(data: AddQueueItemDTO) {
	return request({
		url: '/queue/items',
		method: 'post',
		data,
	});
}

export function addQueueItemToNext(data: AddQueueItemDTO) {
	return request({
		url: '/queue/items/next',
		method: 'post',
		data,
	});
}

export function reorderPlayQueue(queueItemIds: string[]) {
	return request({
		url: '/queue/reorder',
		method: 'put',
		data: { queueItemIds },
	});
}

export function updateCurrentQueue(data: { musicId?: string; currentIndex?: number; currentTime?: number }) {
	return request({
		url: '/queue/current',
		method: 'put',
		data,
	});
}

export function updatePlayQueueMode(playMode: PlayMode) {
	return request({
		url: '/queue/playMode',
		method: 'put',
		data: { playMode },
	});
}

export function removeQueueItem(queueItemId: string) {
	return request({
		url: `/queue/items/${queueItemId}`,
		method: 'delete',
	});
}

export function clearPlayQueue() {
	return request({
		url: '/queue',
		method: 'delete',
	});
}

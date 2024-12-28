import request from '@/util/request';
import type { PlaylistInfoType } from '@/types/global';
import type { Page } from '@/api/params/query';

export async function getPlaylist(query: Page) : Promise<any> {
	return request({
		url: '/playlist/getPlaylist',
		method: 'get',
		params: query
	});
}

export async function addPlaylist(playlistInfo: PlaylistInfoType): Promise<any> {
	return request({
		url: '/playlist/addPlaylist',
		method: 'post',
		data: playlistInfo,
	});
}

export function getPlaylistMusic(playlistId: string) {
	return request({
		url: '/playlist/music',
		method: 'get',
		params: {
			playlistId,
		},
	});
}

export function getPlaylistInfo(playlistId: string) {
	return request({
		url: '/playlist/info',
		method: 'get',
		params: {
			playlistId,
		},
	});
}

import request from '@/util/request';
import type { Page, SearchPageParam } from '@/api/params/query';
import type { AddMusicFormType, PlaylistType } from '@/types/playlist';
import type { ApiResponse } from '@/types/global';

export async function getPlaylist(params: Page): Promise<any> {
	return request({
		url: '/playlist/getPlaylist',
		method: 'get',
		params,
	});
}

export async function addPlaylist(playlistInfo: PlaylistType): Promise<any> {
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

export function updatePlaylist(playlistData: FormData): Promise<ApiResponse> {
	return request({
		url: '/playlist/updatePlaylist',
		method: 'put',
		data: playlistData,
	});
}

export function addMusicToPlaylist(addMusicForm: AddMusicFormType) {
	return request({
		url: '/playlist/addMusic',
		method: 'post',
		data: addMusicForm,
	});
}

export function getHomePlaylist(params: SearchPageParam) {
	return request({
		url: '/playlist/home/playlist',
		method: 'get',
		params,
	})
}

export function removeMusic(playlistId: string, musicId: string) {
	return request({
		url: `/playlist/removeMusic/${playlistId}/${musicId}`,
		method: 'delete',
	});
}

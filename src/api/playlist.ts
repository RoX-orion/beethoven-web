import request from '@/util/request';
import type { PlaylistInfo } from '@/types/global';
import { Page } from '@/api/params/query';

export async function getPlaylist(query: Page) : Promise<any> {
	return request({
		url: '/playlist/getPlaylist',
		method: 'get',
		params: query
	});
}

export async function addPlaylist(playlistInfo: PlaylistInfo) : Promise<any> {
	return request({
		url: '/playlist/addPlaylist',
		method: 'post',
		data: playlistInfo,
	});
}

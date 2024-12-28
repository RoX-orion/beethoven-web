import request from '@/util/request';
import type { SearchMusicParam } from '@/api/params/query';

export function uploadMusic(data: FormData) {
	return request({
		method: 'post',
		url: '/music/uploadMusic',
		data,
	})
}

export function fetchMusic(url: string) {
	return request({
		method: 'get',
		url: url
	});
}

export async function searchMusic(param: SearchMusicParam) : Promise<any> {
	return request({
		url: '/music/searchMusic',
		method: 'get',
		params: param,
	});
}

export function getMusicInfo(id: string) {
	return request({
		url: `/music/info/${id}`,
		method: 'get',
	})
}

export function getManageMusicList(param: SearchMusicParam) {
	return request({
		url: '/music/manage/getManageMusicList',
		method: 'get',
		params: param,
	});
}

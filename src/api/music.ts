import request from '@/util/request';
import type { SearchPageParam } from '@/api/params/query';

export function uploadMusic(data: FormData) {
	return request({
		method: 'post',
		url: '/music/uploadMusic',
		data,
		timeout: 1000 * 60 * 60 * 5, // 5 hours
	})
}

export function fetchMusic(url: string) {
	return request({
		method: 'get',
		url: url
	});
}

export async function searchMusic(params: SearchPageParam): Promise<any> {
	return request({
		url: '/music/searchMusic',
		method: 'get',
		params
	});
}

export function getMusicInfo(id: string) {
	return request({
		url: `/music/info/${id}`,
		method: 'get',
	});
}

export function getManageMusicList(params: SearchPageParam) {
	return request({
		url: '/music/manage/getManageMusicList',
		method: 'get',
		params,
	});
}

export function deleteMusic(musicId: number) {
	return request({
		url: `/music/manage/deleteMusic/${musicId}`,
		method: 'delete'
	});
}

export function updateMusic(data: FormData) {
	return request({
		url: '/music/manage/updateMusic',
		method: "put",
		data,
		timeout: 1000 * 60 * 60 * 5, // 5 hours
	});
}

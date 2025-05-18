import request from '@/util/request';
import type { SearchPageParam } from '@/api/params/query';

export function getVideoInfo(videoId: number) {
	return request({
		url: `/video/info/${videoId}`,
		method: 'get',
	});
}

export function getManageVideoList(params: SearchPageParam) {
	return request({
		url: '/video/manage/getManageVideoList',
		method: 'get',
		params,
	});
}

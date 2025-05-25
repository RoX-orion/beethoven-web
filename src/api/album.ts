import request from '@/util/request';
import type { SearchPageParam } from '@/api/params/query';
import { AddAlbumType } from '@/types/album';

export function getManageAlbumList(params: SearchPageParam) {
	return request({
		url: '/album/manage/getManageAlbumList',
		method: 'get',
		params,
	});
}

export function addAlbum(data: AddAlbumType) {
	return request({
		url: '/album/addAlbum',
		method: 'post',
		data,
	});
}

import request from '@/util/request';
import type { SearchPageParam } from '@/api/params/query';

export function getManageAlbumList(params: SearchPageParam) {
	return request({
		url: '/album/manage/getManageAlbumList',
		method: 'get',
		params,
	});
}

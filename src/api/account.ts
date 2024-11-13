import request from '@/util/request';

export function getAccountInfo(userId: number) {
	return request({
		url: `/account/info/${userId}`,
		method: 'get',
	});
}

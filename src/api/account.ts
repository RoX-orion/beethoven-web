import request from '@/util/request';

export function getAccountInfo(userId: string) {
	return request({
		url: `/account/info/${userId}`,
		method: 'get',
	});
}

export function getAccountInfoByToken() {
	return request({
		url: '/account/info/token',
		method: 'get',
	});
}

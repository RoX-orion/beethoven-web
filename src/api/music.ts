import request from '@/util/request';

export function fetchMusic(url: string) {
	return request({
		method: 'get',
		url: url
	});
}

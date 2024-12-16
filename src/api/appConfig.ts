import request from '@/util/request';

export function getMusicConfig() {
	return request({
		url: '/app/musicConfig',
		method: 'get',
	});
}

export function updateMusicConfig(musicConfigData: FormData) {
	return request({
		url: '/app/musicConfig',
		method: 'put',
		data: musicConfigData,
	});
}

export function getAppConfig() {
	return request({
		url: '/app/appConfig',
		method: 'get',
	});
}

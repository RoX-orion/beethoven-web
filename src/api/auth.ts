import request from '@/util/request';
import type { OAuth2LoginType } from '@/types/global';

export function getOAuth2Info(type: string) {
	return request({
		url: '/auth/oauth2/info',
		method: 'get',
		params: {
			type,
		},
	});
}

export function handleOAuth2Login(data: OAuth2LoginType) {
	return request({
		url: '/auth/oauth2/login',
		method: 'post',
		data,
	});
}

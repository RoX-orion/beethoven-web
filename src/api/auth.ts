import request from '@/util/request';
import type { ApiResponse, OAuth2LoginType } from '@/types/global';

export function getOAuth2Info(type: string) {
	return request({
		url: '/auth/oauth2/info',
		method: 'get',
		params: {
			type,
		},
	});
}

export function handleOAuth2Login(data: OAuth2LoginType): Promise<ApiResponse> {
	return request({
		url: '/auth/oauth2/login',
		method: 'post',
		data,
	}) as unknown as Promise<ApiResponse>;
}

export function logout() {
	return request({
    url: '/auth/logout',
    method: 'post'
  })
}

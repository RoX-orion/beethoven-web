import request from '@/util/request';
import { SearchMusicParam } from '@/api/params/query';

export function fetchMusic(url: string) {
	return request({
		method: 'get',
		url: url
	});
}

export async function searchMusic(param: SearchMusicParam) : Promise<any> {
	return request({
		url: 'music/searchMusic',
		method: 'get',
		params: param,
	});
}

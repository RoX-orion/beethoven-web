import request from "@/util/request";
import type { SettingType } from '@/types/global';

export function getSetting() {
	return request({
		url: '/setting/getSetting',
		method: 'get'
	});
}

export function updateSetting(setting: SettingType) {
	return request({
		url: '/setting/updateSetting',
		method: 'put',
		data: setting,
	});
}

import request from "@/util/request";

export function getAppSetting() {
	return request({
		url: '/setting/getSetting',
		method: 'get'
	});
}

import request from "@/util/request";

export function getAppConfig() {
	return request({
		url: '/config/getConfig',
		method: 'get'
	});
}

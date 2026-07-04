import axios from 'axios';
import { deleteData, getData } from '@/util/localStorage';
import { TOKEN } from '@/config';
import router from '@/router';
import { notification } from 'ant-design-vue';

// create an axios instance
const service = axios.create({
	baseURL: import.meta.env.VITE_BASE_API,
	// withCredentials: true, // send cookies when cross-domain requests
	timeout: 1000 * 30, // request timeout
})

// request interceptor
service.interceptors.request.use(
	config => {
		// do something before request is sent

		const token = getData(TOKEN);
		if (token) {
			config.headers['Authorization'] = token;
		}
		return config
	},
	error => {
		console.error('[Request] interceptor error:', error)
		return Promise.reject(error)
	}
)

// response interceptor
service.interceptors.response.use(
	async response => {
		const res = response.data

		if (res.code !== 200) {
			if (res.code === 401) {
				deleteData(TOKEN);
				notification.warning({
					message: '登录已过期',
					description: res.msg || '请重新登录',
				});
				await router.push('/auth');
				return Promise.reject(new Error(res.msg || '未授权'));
			}
			if (res.code === 400) {
				notification.warning({
					message: '失败',
					description: res.msg,
				});
			} else if (res.code === 500) {
				notification['error']({
					message: '错误',
					description: res.msg,
				});
			}
			return Promise.reject(new Error(res.msg || 'Error'));
		} else {
			return res;
		}
	},
	error => {
		if (error.response) {
			const status = error.response.status;
			console.error('[Response] error:', status, error.response.data);
			if (status === 401) {
				deleteData(TOKEN);
				notification.warning({
					message: '登录已过期',
					description: '请重新登录',
				});
				router.push('/auth');
			}
		} else {
			console.error('[Response] error:', error.message)
		}
		return Promise.reject(error)
	}
)

export default service;

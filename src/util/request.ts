import axios from 'axios';
import { deleteData, getData } from '@/util/localStorage';
import { TOKEN } from '@/config';

// create an axios instance
const service = axios.create({
	baseURL: import.meta.env.VITE_BASE_API,
	// withCredentials: true, // send cookies when cross-domain requests
	timeout: 1000 * 30 // request timeout
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
		// do something with request error
		console.log(error) // for debug
		return Promise.reject(error)
	}
)

// response interceptor
service.interceptors.response.use(

	response => {
		const res = response.data

		if (res.code !== 200) {
			console.log(res.message || 'Error');

			// if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
			// 	// to re-login
			// 	MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
			// 		confirmButtonText: 'Re-Login',
			// 		cancelButtonText: 'Cancel',
			// 		type: 'warning'
			// 	}).then(() => {
			// 		store.dispatch('user/resetToken').then(() => {
			// 			location.reload()
			// 		})
			// 	})
			// }
			if (res.code === 401) {
				deleteData(TOKEN);
			}
			return Promise.reject(new Error(res.message || 'Error'));
		} else {
			return res
		}
	},
	error => {
		console.log('err' + error) // for debug
		return Promise.reject(error)
	}
)

export default service;

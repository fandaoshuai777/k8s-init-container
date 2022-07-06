import store from '@/store';
import router, { resetRouter } from '@/router/index';
import axios from 'axios';
import { Message, MessageBox } from 'element-ui';
import { Local,Session } from '@/utils/storage';

function baseURLEnv() {
	if (process.env.NODE_ENV === 'development') {
	  return 'https://internal.dev.op-api-gateway.wonder-link.net'
	} else if (window.location.hostname.indexOf('ciecdev') !== -1) { // 居家办公dev环境连测试环境
	  return 'https://internal.fat.op-api-gateway.wonder-link.net'
	} else if (window.location.hostname.indexOf('test') !== -1) {
	  // return 'http://operation-server-test.c29dd69ffd4404f389adfa283b540267b.cn-hangzhou.alicontainer.com/'
	  return 'https://internal.fat.op-api-gateway.wonder-link.net'
	} else if (window.location.hostname.indexOf('test') !== -1) {
	  return 'https://internal.fat.op-api-gateway.wonder-link.net'
	} else {
	  return 'https://operation-server.ciecinfo.com'
	}
  }
// 创建 axios 实例
const service = axios.create({
	baseURL: baseURLEnv(),
	timeout: 10000,
	headers: { 'Content-Type': 'application/json;charset=UTF-8' },
});

// 添加请求拦截器
service.interceptors.request.use(
	(config) => {
		if (Local) {
			// 在发送请求之前做些什么 token
			if (Local.get('token')) {
				config.headers.common['merchant-server-token'] = `${Local.get('token')}`;
			} else {
				// 在发送请求之前做些什么 token
				if (Session.get('token')) {
					config.headers.common['merchant-server-token'] = `${Session.get('token')}`;
				}
			}
		}

		return config;
	},
	(error) => {
		// 对请求错误做些什么
		return Promise.reject(error);
	}
);

// 添加响应拦截器
service.interceptors.response.use(
	(response) => {
		// 对响应数据做点什么
		const res = response.data;
		if (res.code == 0 || res.code == 200) {
			return res;
		} else {
			Message.error(res.message || res.msg);
		}
		// if (res.code && res.code !== 0) {
		// 	// `token` 过期或者账号已在别处登录
		// 	if (res.code === 401 || res.code === 4001) {
		// 		// 清除浏览器全部临时缓存
		// 		Session.clear();
		// 		router.push('/login');
		// 		store.commit('setMenuData', {});
		// 		resetRouter(); // 重置路由
		// 		MessageBox.alert('你已被登出，请重新登录', '提示', {})
		// 			.then(() => {})
		// 			.catch(() => {});
		// 	}
		// 	return Promise.reject(service.interceptors.response.error);
		// } else {
		// return response.data;
		// }
	},
	(error) => {
		// 对响应错误做点什么
		if (error.message.indexOf('timeout') != -1) {
			Message.error('网络超时');
		} else if (error.message == 'Network Error') {
			Message.error('网络连接错误');
		} else {
			Message.error(error.response.data.message);
		}
		return Promise.reject(error);
	}
);

// 导出 axios 实例
export default service;

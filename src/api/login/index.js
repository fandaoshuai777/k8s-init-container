import request from '@/utils/request';

// 账号密码登录
export function account(params) {
	return request({
		url: '/oilUser/login',
		method: 'post',
		data: params,
	});
}
// 发送验证码
export function sendCode(userPhone) {
	return request({
		url: `/oilUser/sendCode/${userPhone}`,
		method: 'post',
	});
}
//验证码登录
export function verificationCodeLogin(userPhone,code) {
	return request({
		url: `/oilUser/verificationCodeLogin/${userPhone}/${code}`,
		method: 'post'
	});
}
//用户信息
export function user() {
	return request({
		url: `/oilUser/userInfo`,
		method: 'post'
	});
}

// // 用户退出登录
// export function signOut(params) {
// 	return request({
// 		url: '/user/signOut',
// 		method: 'post',
// 		data: params,
// 	});
// }

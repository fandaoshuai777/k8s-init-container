<template>
	<el-form size="large" class="login-content-form" :model="form" :rules="rules" ref="Userform">
		<el-form-item class="login-animation1" prop="userPhone">
			<el-input type="text" clearable autocomplete="off" placeholder="请输入手机号" v-model.number="form.userPhone">
				<template #prefix>
					<i class="el-icon-mobile-phone left"></i>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item class="login-animation2" prop="code">
			<el-col :span="15">
				<el-input type="text" maxlength="6" clearable autocomplete="off" placeholder="请输入验证码" v-model.number="form.code">
					<template #prefix>
						<i class="el-icon-position left"></i>
					</template>
				</el-input>
			</el-col>
			<el-col :span="1"></el-col>
			<el-col :span="8">
				<el-button class="login-content-code" @click="gain" :disabled="!show"
					>获取验证码
					<span v-show="!show" class="count">({{ count }}s)</span>
				</el-button>
			</el-col>
		</el-form-item>
		<el-form-item class="login-animation3 item"> <el-checkbox label="" v-model="volunt">自动登录</el-checkbox></el-form-item>
		<el-form-item class="login-animation4 center" prop="type">
			<el-checkbox-group v-model="form.type" style="margin-right: 5px; height: 30px">
				<el-checkbox name="type"></el-checkbox>
			</el-checkbox-group>
			<div style="margin-right: 5px; height: 30px">
				<span>我已阅读并同意</span>
				<span class="color" @click="platform()">《平台服务协议》</span>

				和<span class="color" @click="commercial()">《商户隐私协议》</span>
			</div>
		</el-form-item>
		<el-form-item class="login-animation5">
			<el-button round type="primary" class="login-content-submit" @click="register('form')">
				<span>登录</span>
			</el-button>
		</el-form-item>
		<div class="font12 mt30 login-animation4 login-msg"></div>
	</el-form>
</template>

<script>
import { sendCode, verificationCodeLogin } from '@/api/login/index.js';
import { Local, Session } from '@/utils/storage.js';

import { PrevLoading } from '@/utils/loading.js';

export default {
	data() {
		// 验证手机号的规则
		const Phone = (rule, value, cb) => {
			const regMobile = /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/;
			if (regMobile.test(value)) {
				// 合法的输入
				return cb();
			}
			cb(new Error('清输入合法的手机号!'));
		};

		return {
			show: true, // 初始启用按钮
			count: '', // 初始化次数
			radio: '1',
			timer: null,
			volunt: true,
			form: {
				userPhone: '',
				code: '',
				type: [],
			},
			rules: {
				code: [
					{ required: true, message: '验证码不能为空' },
					{ type: 'number', message: '输入错误' },
				],
				userPhone: [
					{ required: true, message: '请输入手机号', trigger: 'blur' },
					{ validator: Phone, trigger: 'blur' },
				],
				type: [{ type: 'array', required: true, message: '登录前,请阅读并勾选相关协议', trigger: 'change' }],
			},
		};
	},
	methods: {
		gain() {
			this.$refs.Userform.validateField('userPhone', (val) => {
				if (!val) {
					sendCode(this.form.userPhone).then((res) => {
						if (res.code == 200) {
							this.$message.success('验证码发送成功');
							const TIME_COUNT = 60; //更改倒计时时间
							if (!this.timer) {
								this.count = TIME_COUNT;
								this.show = false;
								this.timer = setInterval(() => {
									if (this.count > 0 && this.count <= TIME_COUNT) {
										this.count--;
									} else {
										this.show = true;
										clearInterval(this.timer); // 清除定时器
										this.timer = null;
									}
								}, 1000);
							}
						} else {
							this.$message.error(res.msg);
						}
					});
				} else {
					return false;
				}
			});
		},
		register() {
			this.$refs.Userform.validate((valid) => {
				if (valid) {
					verificationCodeLogin(this.form.userPhone, this.form.code).then((res) => {
						if (res.code == 200) {
							let userName = 'admin';
							setTimeout(() => {
								Local.remove('users')
								let defaultRoles = [];
								let defaultAuthBtnList = [];
								// admin 页面权限标识，对应路由 meta.roles
								let adminRoles = ['admin'];
								// admin 按钮权限标识
								let adminAuthBtnList = ['btn.add', 'btn.del', 'btn.edit', 'btn.link'];
								// common 页面权限标识，对应路由 meta.roles
								let testAuthPageList = ['common'];
								// test 按钮权限标识
								let testAuthBtnList = ['btn.add', 'btn.link'];
								if (userName === 'admin') {
									defaultRoles = adminRoles;
									defaultAuthBtnList = adminAuthBtnList;
								} else {
									defaultRoles = testAuthPageList;
									defaultAuthBtnList = testAuthBtnList;
								}
								const userInfos = {
									userName: userName === 'admin' ? 'admin' : 'test',
									photo:
										userName === 'admin'
											? 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1813762643,1914315241&fm=26&gp=0.jpg'
											: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=317673774,2961727727&fm=26&gp=0.jpg',
									time: new Date().getTime(),
									roles: defaultRoles,
									authBtnList: defaultAuthBtnList,
									token: res.result,
								};
								if (this.volunt == true) {
									// 存储 token 到浏览器缓存
									Local.set('token', res.result);
									// 存储用户信息到浏览器缓存
									Local.set('userInfo', userInfos);
									// 存储用户信息到vuex
									this.$store.dispatch('userInfos/setUserInfos', userInfos);
									PrevLoading.start();
									window.location.href = `${window.location.origin}${window.location.pathname}`;
									setTimeout(() => {
										this.$message.success(`${this.$t('message.login.signInText')}`);
									}, 300);
								} else {
									// 存储 token 到浏览器缓存
									Session.set('token', res.result);
									// 存储用户信息到浏览器缓存
									Session.set('userInfo', userInfos);
									// 存储用户信息到vuex
									this.$store.dispatch('userInfos/setUserInfos', userInfos);
									PrevLoading.start();
									window.location.href = `${window.location.origin}${window.location.pathname}`;
									setTimeout(() => {
										this.$message.success(`${this.currentTime}`);
									}, 300);
								}
							}, 300);
						}
					});
				} else {
					return false;
				}
			});
		},
		platform() {
			this.$router.push('/platform');
			Local.set('users', this.form);
		},
	},
	created() {
		if (Local.get('users')) {
			this.form.userPhone = Local.get('users').userPhone;
			this.form.code = Local.get('users').code;
		} else {
		}
	},
};
</script>
<style scoped lang="scss">
.login-content-form {
	margin-top: 20px;
	@for $i from 1 through 5 {
		.login-animation#{$i} {
			opacity: 0;
			animation-name: error-num;
			animation-duration: 0.5s;
			animation-fill-mode: forwards;
			animation-delay: calc($i/10) + s;
		}
	}
	.login-content-code {
		width: 100%;
		padding: 0;
	}
	.login-content-submit {
		width: 100%;
		letter-spacing: 2px;
		font-weight: 300;
	}
	.login-msg {
		color: var(--el-text-color-placeholder);
	}
	::v-deep {
		.el-form-item__content {
			display: flex !important;
		}
		.el-button {
			display: flex !important;
			align-items: center;
			width: 100%;
			justify-content: space-around;
			height: 100%;
		}
	}
}
::v-deep .center {
	> .el-form-item__content {
		display: flex;
		align-items: center;
	}
	.el-radio {
		margin: 0;
	}
}
.left {
	margin-left: 5px;
}
::v-deep .el-radio__inner {
	border-radius: 0% !important;
}
.color {
	color: #87cefa;
	cursor: pointer;
}
</style>

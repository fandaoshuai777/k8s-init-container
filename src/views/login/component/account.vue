<template>
	<el-form size="large" class="login-content-form" :model="form">
		<el-form-item class="login-animation1">
			<el-input type="text" clearable autocomplete="off" placeholder="请输入账号" v-model="form.userPhone">
				<template #prefix>
					<i class="el-icon-user left"></i>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item class="login-animation2">
			<el-input autocomplete="off" placeholder="请输入密码" v-model="form.userPassword">
				<template #prefix>
					<i class="el-icon-lock left"></i>
				</template>
				<template #suffix>
					<i> </i>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item class="login-animation3"> <el-radio v-model="radio" label="">自动登录</el-radio></el-form-item>
		<el-form-item class="login-animation4 center">
			<el-radio v-model="radio" label=""></el-radio>
			<div>
				<span>我已阅读并同意</span>
				<span class="color" @click="platform()">《平台服务协议》</span>

				和<span class="color" @click="commercial()">《商户隐私协议》</span>
			</div>
		</el-form-item>
		<el-form-item class="login-animation4">
			<el-button type="primary" class="login-content-submit" @click="register" round>
				<span>登录</span>
			</el-button>
		</el-form-item>
	</el-form>
</template>
<script>
import { PrevLoading } from '@/utils/loading.js';
import { account } from '@/api/login/index.js';
import { Session } from '@/utils/storage.js';
export default {
	data() {
		return {
			radio: '1',
			form: {
				userPhone: '',
				userPassword: '',
			},
			submit: {
				loading: false,
			},
		};
	},
	methods: {
		register() {
			account(this.form).then((res) => {
				if (res.code == 200) {
					this.submit.loading = true;
					let userName = 'admin';
					setTimeout(() => {
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
						};
						// 存储 token 到浏览器缓存
						Session.set('token', Math.random().toString(36).substr(0));
						// 存储用户信息到浏览器缓存
						Session.set('userInfo', userInfos);
						// 存储用户信息到vuex
						this.$store.dispatch('userInfos/setUserInfos', userInfos);
						// PrevLoading.start();
						// window.location.href = `${window.location.origin}${window.location.pathname}`;
						setTimeout(() => {
							this.$message.success(`${this.currentTime}，${this.$t('message.login.signInText')}`);
						}, 300);
					}, 300);
				}
			});
		},
		platform() {
			this.$router.push('/platform');
		},
		commercial() {
			this.$router.push('/commercial');
		},
	},
};
</script>
<style scoped lang="scss">
.login-content-form {
	margin-top: 20px;
	@for $i from 1 through 4 {
		.login-animation#{$i} {
			opacity: 0;
			animation-name: error-num;
			animation-duration: 0.5s;
			animation-fill-mode: forwards;
			animation-delay: calc($i/10) + s;
		}
	}
	.login-content-password {
		display: inline-block;
		width: 20px;
		cursor: pointer;
		&:hover {
			color: #909399;
		}
	}
	.login-content-code {
		width: 100%;
		padding: 0;
		font-weight: bold;
		letter-spacing: 5px;
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

	.login-content-submit {
		width: 100%;
		letter-spacing: 2px;
		font-weight: 300;
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

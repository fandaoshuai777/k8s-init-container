<template>
	<el-form size="large" class="login-content-form">
		<el-form-item class="login-animation1">
			<el-input type="text" clearable autocomplete="off" placeholder="请输入手机号">
				<template #prefix>
					<i class="el-icon-mobile-phone left"></i>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item class="login-animation2">
			<el-col :span="15">
				<el-input type="text" maxlength="4" clearable autocomplete="off" placeholder="请输入验证码">
					<template #prefix>
						<i class="el-icon-position left"></i>
					</template>
				</el-input>
			</el-col>
			<el-col :span="1"></el-col>
			<el-col :span="8">
				<el-button class="login-content-code">点击获取验证码</el-button>
			</el-col>
		</el-form-item>
		<el-form-item class="login-animation3"> <el-radio v-model="radio" label="自动登录"></el-radio></el-form-item>
		<el-form-item class="login-animation4 center">
			<el-radio v-model="radio"></el-radio>
			<div>
				<span>我已阅读并同意</span>
				<span class="color">《平台服务协议》</span>

				和<span  class="color">《商户隐私协议》</span>
			</div>
		</el-form-item>
		<el-form-item class="login-animation5">
			<el-button round type="primary" class="login-content-submit">
				<span>登录</span>
			</el-button>
		</el-form-item>
		<div class="font12 mt30 login-animation4 login-msg"></div>
	</el-form>
</template>

<script>
export default {
	data(){
		return{
			 radio: '1'
		}
	}
}
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
.color{
	color:#87CEFA;
	cursor:pointer
}
</style>

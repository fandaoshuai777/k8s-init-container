<template>
	<div>
		<el-card shadow="hover">
			<div class="card">
				<div>账户总额：</div>
				<div>123456.09元</div>
			</div>
			<div class="card">
				<div>可提现金额：</div>
				<div>123456.09元</div>
			</div>
			<div class="card">
				<div>冻结总额：</div>
				<div>123456.09元</div>
			</div>
			<el-button @click="withdrawDeposit">提现</el-button>
		</el-card>
		<!-- 添加提现账户 -->
		<SysDialgoEdit
			:title="assignDialog.title"
			:width="assignDialog.width"
			:visible="assignDialog.visible"
			:display="assignDialog.display"
			@onClone="onClose"
			@onComfig="onComfig"
		>
			<div slot="content">
				<el-form ref="form" :model="form" label-width="100px" size="small">
					<el-form-item label="提现编码" prop="driverTel">
						<el-input v-model="form.driverTel" clearable />
					</el-form-item>
					<el-form-item label="可提现金额" prop="driverTel">
						<el-input v-model="form.driverTel" clearable />
					</el-form-item>
					<el-form-item label="提现账户" prop="driverTel">
						<el-input v-model="form.driverTel" clearable />
					</el-form-item>
					<el-form-item label="开户行" prop="driverTel">
						<el-input v-model="form.driverTel" clearable />
					</el-form-item>
					<el-form-item label="提现金额" prop="driverTel">
						<el-input v-model="form.driverTel" clearable />
					</el-form-item>
				</el-form>
			</div>
		</SysDialgoEdit>
	</div>
</template>
<script>
import SysDialgoEdit from '@/components/system/SysDialogEdit.vue';

export default {
	components: {
		SysDialgoEdit,
	},
	data() {
		return {
			// 设置弹窗组件所需数据
			assignDialog: {
				title: '添加提现账户',
				width: 700,
				height: 550,
				visible: false,
				display: true,
			},
			form: {},
		};
	},
	methods: {
		withdrawDeposit() {
			this.$confirm('尊敬的客户，您尚未添加提现账户，请添加后再试', '提示', {
				confirmButtonText: '添加提现账户',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(async () => {
					await this.open();
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消',
					});
				});
		},
		open() {
			this.assignDialog.visible = true;
		},
		onClose() {
			this.assignDialog.visible = false;
		},
		onComfig() {
			this.assignDialog.visible = false;
			this.$refs.pictureUpload.submit();
		},
	},
};
</script>
<style scoped>
.card {
	display: flex;
	height: 30px;
}
</style>

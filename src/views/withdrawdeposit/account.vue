<template>
	<div>
		<el-card shadow="hover">
			<div style="margin-bottom: 10px"><el-button type="primary" @click="add">添加提现账户</el-button></div>

			<el-table :data="tableData" border style="width: 100%">
				<el-table-column prop="date" label="编号" width="180" align="center"> </el-table-column>
				<el-table-column prop="name" label="提现账户名" width="180" align="center"> </el-table-column>
				<el-table-column prop="address" label="账户类型" align="center"> </el-table-column>
				<el-table-column prop="address" label="账户状态" align="center"> </el-table-column>
				<el-table-column prop="address" label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="text" @click="editForm(scope.row)"> 详情 </el-button>
						<el-button type="text" @click="editForm(scope.row)"> 再次提交 </el-button>
						<el-button type="text" @click="editForm(scope.row)"> 删除 </el-button>
					</template>
				</el-table-column>
			</el-table>
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
					<el-form-item label="账户名" prop="driverTel">
						<el-input v-model="form.driverTel" clearable />
					</el-form-item>
					<el-form-item label="账户类型" prop="driverTel">
						<el-input v-model="form.driverTel" clearable />
					</el-form-item>
					<el-form-item label="身份证号" prop="driverTel">
						<el-input v-model="form.driverTel" clearable />
					</el-form-item>
					<el-form-item label="身份证正面" prop="driverTel">
						<el-upload
							action="#"
							list-type="picture-card"
							:http-request="upload"
             :on-success="beforeAvatarUpload"
						>
							<i slot="default" class="el-icon-plus"></i>
							<div slot="file" slot-scope="{ file }">
								<img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
								<span class="el-upload-list__item-actions">
									<span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
										<i class="el-icon-zoom-in"></i>
									</span>
									<span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
										<i class="el-icon-delete"></i>
									</span>
								</span>
							</div>
						</el-upload>
						<div style="color: red">请上传JPG、PNG格式文件</div>
					</el-form-item>
					<el-form-item prop="driverTel">
						<el-checkbox v-model="checked">最多添加5个账户，添加成功后，暂不支持修改与删除，请谨慎操作！</el-checkbox>
					</el-form-item>
				</el-form>
			</div>
		</SysDialgoEdit>
		<el-dialog :visible.sync="dialogVisible">
			<img width="100%" :src="dialogImageUrl" alt="" />
		</el-dialog>
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
			tableData: [
				{
					date: '2016-05-02',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1518 弄',
				},
			],
			checked: false,
			form: {},
			// 设置弹窗组件所需数据
			assignDialog: {
				title: '添加提现账户',
				width: 700,
				height: 550,
				visible: false,
				display: true,
			},
			upDisabled: false,
			dialogImageUrl: '',
			dialogVisible: false,
			disabled: false,
		};
	},
	methods: {
		add() {
			this.assignDialog.visible = true;
		},
		onClose() {
			this.assignDialog.visible = false;
		},
		onComfig() {
			this.assignDialog.visible = false;
			this.$refs.pictureUpload.submit()
		},
		handleRemove(file) {
			const uploadFiles = this.$refs.pictureUpload.uploadFiles;
			for (let i = 0; i < uploadFiles.length; i++) {
				if (uploadFiles[i]['url'] === file.url) {
					uploadFiles.splice(i, 1);
				}
			}
		},
		handlePictureCardPreview(file) {
      console.log(file)
			this.dialogImageUrl = file.url;
			this.dialogVisible = true;
		},
    beforeAvatarUpload(file){
      console.log(123,file)
    },
		upload(item) {
			// console.log(item);
		},
	},
};
</script>
<style scoped>
::v-deep .el-dialog .el-dialog__body {
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>

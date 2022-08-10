<template>
	<div class="diolog" v-if="show">
		<el-dialog
			:title="type === 'add' ? '添加提现账户' : type === 'compile' ? '编辑提现账户' : type === 'particulars' ? '详情' : type"
			:visible.sync="dialogVisible"
			:before-close="onClose"
			:close-on-click-modal="false"
			width="25%"
		>
			<el-form ref="formInfo" :rules="rules" :model="formInfo" label-width="100px" size="small" :disabled="disabled" :inline="true">
				<el-row>
					<el-col>
						<el-form-item label="账户名" prop="supplierName">
							<el-input v-model="formInfo.supplierName" clearable maxlength="50" style="width: 217px" />
							<!-- <div class="username" style="color: red; font-size: 12px">最多添加3个对公、5个对私账户名(添加成功后，暂不支持修改与删除，请谨慎操作!)</div> -->
						</el-form-item>
					</el-col>

					<el-col>
						<el-form-item label="账户类型" prop="supplierType">
							<el-select v-model="formInfo.supplierType" placeholder="请选择账户类型" @change="selectChange">
								<el-option label="个人" value="PERSON"></el-option>
								<el-option label="企业" value="BUSINESS"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col>
						<div>
							<el-form-item v-if="formInfo.supplierType == 'PERSON'" label="身份证号" prop="supplierLicenceNo">
								<el-input v-model="formInfo.supplierLicenceNo" clearable maxlength="18" style="width: 217px" />
							</el-form-item>
							<el-form-item v-if="formInfo.supplierType == 'BUSINESS'" label="营业执照号" prop="license">
								<el-input v-model="formInfo.license" clearable maxlength="15" style="width: 217px" />
							</el-form-item>
						</div>
					</el-col>
					<el-col>
						<el-form-item :label="formInfo.supplierType == 'PERSON' ? '身份证正面' : '营业执照'" prop="supplierLicenceUrl">
							<el-upload
								class="el-uploads"
								:show-file-list="false"
								action="#"
								:http-request="uploadAvatar"
								:headers="{ token: token }"
								:before-upload="beforeAvatarUpload"
							>
								<img v-if="formInfo.supplierLicenceUrl" :src="formInfo.supplierLicenceUrl" class="avatar" />
								<i v-else class="el-icon-plus avatar-uploader-icon"></i>
							</el-upload>
							<div style="color: red; font-size: 12px">请上传JPG、PNG格式文件不超过2M</div>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<el-form ref="listCard" :model="formList" label-width="90px" size="small" :inline="true" class="border" :rules="rulesCard">
				<el-card class="box-card" v-for="(item, index) in formList.bankInfos" :key="index" style="margin-top: 5px">
					<div slot="header" class="clearfix">
						<span>提现卡</span>
						<el-button
							style="float: right; padding: 3px 0"
							type="text"
							icon="el-icon-close"
							circle
							:disabled="type == 'compile' ? false : disabled"
							@click="delDept(index)"
						></el-button>
					</div>
					<el-row class="row">
						<el-col>
							<el-form-item label="银行账号" :prop="'bankInfos.' + index + '.accountNumber'" :rules="rulesCard.accountNumber">
								<el-input
									:disabled="forbidden"
									v-model="item.accountNumber"
									clearable
									maxlength="50"
									style="width: 217px"
									placeholder="请输入银行账号"
								/>
							</el-form-item>
						</el-col>
						<el-col>
							<el-form-item label="开户行" :prop="'bankInfos.' + index + '.bankName'" :rules="[{ required: true, message: '开户行不能为空' }]">
								<el-select
									:disabled="forbidden"
									v-model="item.bankName"
									placeholder="请选择开户行"
									value-key="id"
									:remote-method="remoteMethod"
									filterable
									remote
									reserve-keyword
									clearable
									:loading="loadings"
									@change="bankNameChange"
								>
									<el-option v-for="item in selectList" :key="item.value" :label="item.bankName" :value="item" style="width: 200px"> </el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col>
							<el-form-item label="卡类型" :prop="'bankInfos.' + index + '.cardType'" :rules="[{ required: true, message: '卡类型不能为空' }]">
								<el-select
									v-if="prohibited === true"
									:disabled="type === 'particulars' ? (forbidden = true) : (forbidden = false)"
									v-model="item.cardType"
									placeholder="请选择卡类型"
								>
									<el-option label="借记卡" :value="1"></el-option>
									<el-option label="贷记卡" :value="2"></el-option>
									<el-option label="存折" :value="4"></el-option>
								</el-select>
								<el-select v-else v-model="item.cardType" placeholder="请选择卡类型">
									<el-option label="对公卡" :value="6"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
				</el-card>
				<el-form-item style="margin-top: 20px; text-align: right">
					<div style="display: flex">
						<div style="color: red; width: 217px; font-size: 12px">每个账户名最多可添加10张提现卡。</div>

						<el-button type="success" icon="el-icon-plus" circle @click="increase" :disabled="type == 'compile' ? false : disabled"></el-button>
					</div>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button v-if="type == 'compile' ? true : !disabled" type="primary" :loading="loading" @click="submitForm('formInfo')">确定</el-button>
				<el-button @click="resetForm()">取消</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
import { Local } from '@/utils/storage';
import { createUser, detailUser, uploadPhoto, query_bank_info, delete_by_merchant_id, editCard } from '@/api/withdrawdeposit';

export default {
	data() {
		var checkSUP = (rule, value, callback) => {
			var reg = /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/;
			if (!value) {
				return callback(new Error('请填写身份证号'));
			}
			if (!reg.test(value)) {
				callback(new Error('请填写正确的身份证号'));
			} else {
				callback();
			}
		};
		var checkYHK = (rule, value, callback) => {
			var reg = /^([1-9]{1})(\d{15}|\d{16}|\d{18})$/;
			if (!value) {
				return callback(new Error('请填写银行卡号'));
			}
			if (!reg.test(value)) {
				callback(new Error('请填写正确的银行卡号'));
			} else {
				callback();
			}
		};
		return {
			dialogVisible: true,
			token: Local.get('token'),
			dialogFormVisible: true,
			formInfo: {
				supplierName: '', // 账户名
				supplierType: 'PERSON', // 账户类型 PERSON：个人, BUSINESS:企业
				supplierLicenceNo: '', // 身份证号
				supplierLicenceUrl: '', // 身份证图片地址
				// type: [],
				license: '',
			},
			formList: {
				bankInfos: [],
			},
			loading: false,
			loadings: false,
			rules: {
				supplierName: [{ required: true, message: '请输入账户名', trigger: 'blur' }],
				supplierLicenceNo: [{ required: true, validator: checkSUP, trigger: 'blur' }],
				license: [{ required: true, message: '请选择营业执照', trigger: 'change' }],
				supplierType: [{ required: true, message: '请选择账户类型', trigger: 'change' }],
				supplierLicenceUrl: [{ required: true, message: '请选择图片', trigger: 'change' }],
				// type: [{ type: 'array', required: true, message: '请选择', trigger: 'change' }],
			},
			rulesCard: {
				accountNumber: [{ required: true, validator: checkYHK, trigger: 'blur' }],
				accountHolderName: [{ required: true, message: '开户行不能为空', trigger: 'blur' }],
				cardType: [{ required: true, message: '请选择卡类型', trigger: 'change' }],
			},
			selectList: [],
			forbidden: false,
			prohibited: true,

			id: '',
		};
	},
	props: {
		show: {
			type: Boolean,
			default: false,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		type: {
			type: String,
			default: false,
		},
	},
	created() {},
	mounted() {},
	methods: {
		getDetail(id) {
			detailUser({ id: id }).then((res) => {
				if (res.code == 0) {
					this.formInfo = {
						supplierName: res.data.supplierName, // 账户名
						supplierType: res.data.supplierType, // 账户类型 PERSON：个人, BUSINESS:企业
						supplierLicenceNo: res.data.supplierLicenceNo, // 身份证号
						supplierLicenceUrl: res.data.supplierLicenceUrl, // 身份证图片地址
						// type: ['A'],
						license: res.data.supplierLicenceNo, // 营业执照
					};
					this.formList.bankInfos = res.data.bankInfos;
					this.formList.bankInfos.forEach((n) => {
						console.log(n.cardType);
						if (n.cardType === 6) {
							this.prohibited = false;
						} else {
							this.prohibited = true;
						}
					});
					this.id = res.data.id;
				}
			});
		},
		onClose() {
			this.$emit('update:show', false);
			this.$refs['formInfo'].resetFields();
			this.formList = {
				bankInfos: [],
			};
		},
		submitForm(formName) {
			if (this.type === 'compile') {
				this.edit();
			} else {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.$refs['listCard'].validate((valid) => {
							if (valid) {
								const h = this.$createElement;
								let text = '';
								console.log(this.formList.bankInfos.length);
								if (this.formList.bankInfos.length <= 0) {
									text = h('p', null, [
										h('span', { style: 'font-size: 18px' }, '您尚未添加提现卡，确定保存吗? '),
										h('p', { style: 'color: red' }, '最多添加3个对公、5个对私账户名'),
										h('p', { style: 'color: red' }, '(添加成功后，暂不支持修改与删除，请谨慎操作!)'),
									]);
								} else {
									text = h('p', null, [
										h('span', { style: 'font-size: 18px' }, '确定保存吗? '),
										h('p', { style: 'color: red' }, '最多添加3个对公、5个对私账户名'),
										h('p', { style: 'color: red' }, '(添加成功后，暂不支持修改与删除，请谨慎操作!)'),
									]);
								}
								this.$msgbox({
									title: '系统提示',
									message: text,
									showCancelButton: true,
									confirmButtonText: '确定',
									cancelButtonText: '取消',
									beforeClose: (action, instance, done) => {
										if (action === 'confirm') {
											instance.confirmButtonLoading = true;
											instance.confirmButtonText = '执行中...';
											setTimeout(() => {
												done();
												setTimeout(() => {
													instance.confirmButtonLoading = false;
												}, 300);
											}, 2000);
										} else {
											done();
											this.$message('取消操作');
										}
									},
								})
									.then(async (action) => {
										console.log(action);
										await this.craete();
									})
									.catch(() => {});
							}
						});
					}
				});
			}
		},
		craete() {
			this.loading = true;
			const { userId, userName } = JSON.parse(sessionStorage.getItem('loginUser'));
			const { supplierLicenceNo, supplierLicenceUrl, supplierName, supplierType, license } = this.formInfo;
			let data = {
				merchantId: sessionStorage.getItem('merchantId'), // 商户ID
				operatorId: userId, // 操作人ID
				operatorName: userName, // 操作人姓名
				supplierLicenceNo: supplierType == 'PERSON' ? supplierLicenceNo : license, // 身份证号或者营业执照号
				supplierLicenceUrl: supplierLicenceUrl, //身份证地址
				supplierName: supplierName, // 账户名称
				supplierType: supplierType, // 账户类型 PERSON：个人, BUSINESS:企业
			};

			let arr = this.formList.bankInfos.map((n, index) => {
				return {
					accountNumber: n.accountNumber,
					cardType: n.cardType,
					bankName: n.bankName.bankName,
					bankCode: n.bankName.bankCode,
					accountHolderName: supplierName,
				};
			});
			const list = { ...data, bankInfos: arr };
			createUser(list).then((res) => {
				console.log(res, 'resresres');
				if (res.code == 0) {
					this.$message.success('添加成功');
					this.$emit('update:show', false);
					this.$emit('change');
					this.$refs['formInfo'].resetFields();
					this.loading = false;
					this.formList = {
						bankInfos: [],
					};
				} else if (res.code === '660073') {
					this.$message.error(res.message);
					this.$emit('update:show', false);
					this.$emit('change');
					this.$refs['formInfo'].resetFields();
					this.loading = false;
					this.formList = {
						bankInfos: [],
					};
				}
			});
			setTimeout(() => {
				this.loading = false;
			}, 4000);
		},
		edit() {
			this.loading = true;
			const { supplierName } = this.formInfo;

			let arr = this.formList.bankInfos.map((n, index) => {
				console.log(n);
				return {
					accountNumber: n.accountNumber,
					cardType: n.cardType,
					bankName: n.bankName.bankName,
					bankCode: n.bankName.bankCode,
					accountHolderName: supplierName,
					id: n.id ? n.id : '',
				};
			});
			const list = { id: this.id, bankInfos: arr };
			editCard(list).then((res) => {
				if (res.code === '0') {
					this.$message.success('编辑成功');
					this.$emit('update:show', false);
					this.$emit('change');
					this.$refs['formInfo'].resetFields();
					this.loading = false;
					this.formList = {
						bankInfos: [],
					};
				} else if (res.code === '660073') {
					this.$message.error(res.message);
					this.$emit('update:show', false);
					this.$emit('change');
					this.$refs['formInfo'].resetFields();
					this.loading = false;
					this.formList = {
						bankInfos: [],
					};
				}
			});
			setTimeout(() => {
				this.loading = false;
			}, 4000);
		},
		resetForm() {
			this.$refs['formInfo'].resetFields();
			this.formInfo = {
				supplierName: '', // 账户名
				supplierType: 'PERSON', // 账户类型 PERSON：个人, BUSINESS:企业
				supplierLicenceNo: '', // 身份证号
				supplierLicenceUrl: '', // 身份证图片地址
				// type: [],
				license: '',
			};
			this.$emit('update:show', false);
			this.formList = {
				bankInfos: [],
			};
		},
		uploadAvatar(item) {
			const formData = new FormData();
			formData.append('multipartFile', item.file);

			uploadPhoto(formData)
				.then((res) => {
					this.formInfo.supplierLicenceUrl = res.data;
					this.$message.success('上传图片成功！');
				})
				.catch(() => {
					this.$message.error('上传图片失败');
				});
		},
		beforeAvatarUpload(file) {
			const isTypeTrue = /^image\/(jpeg|png|jpg)$/.test(file.type);
			const isLt2M = file.size / 1024 / 1024 < 2;

			if (!isTypeTrue) {
				this.$message.error('上传头像图片只能是 JPG 格式和PNG 格式');
			}
			if (!isLt2M) {
				this.$message.error('上传头像图片大小不能超过 2MB!');
			}
			return isTypeTrue && isLt2M;
		},
		selectChange() {
			this.formInfo.supplierLicenceNo = '';
			this.formInfo.license = '';

			if (this.formInfo.supplierType === 'BUSINESS') {
				this.prohibited = false;
				this.formList.bankInfos.map((n) => {
					n.cardType = 6;
					return {
						...n,
					};
				});
			} else {
				this.prohibited = true;
				this.formList.bankInfos.map((n) => {
					n.cardType = 1;
					return {
						...n,
					};
				});
			}
		},
		increase() {
			this.$refs['listCard'].validate((valid) => {
				if (valid) {
					if (this.formList.bankInfos.length > 9) {
						this.$message.error('最多添加10张提现卡');
						return false;
					} else {
						const data = {
							accountNumber: '',
							accountHolderName: '',
							cardType: '',
							bankName: '',
							bankCode: '',
						};
						this.formList.bankInfos.push(data);
					}
				}
			});
		},
		delDept(index) {
			if (this.formList.bankInfos[index].id) {
				this.$confirm('此操作将永久删除结算卡, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				})
					.then(async () => {
						await delete_by_merchant_id(this.formList.bankInfos[index].id).then((res) => {
							if (res.code === '0') {
								this.formList.bankInfos.splice(index, 1);
								this.$message.success('删除成功');
							}
						});
					})
					.catch(() => {
						this.$message({
							type: 'info',
							message: '已取消删除',
						});
					});
			} else {
				this.formList.bankInfos.splice(index, 1);
			}
		},
		remoteMethod(query) {
			if (query !== '') {
				this.loadings = true;
				setTimeout(() => {
					this.loadings = false;
					query_bank_info({ name: query }).then((res) => {
						this.selectList = res.data.list;
					});
				}, 200);
			} else {
				this.selectList = [];
			}
		},
		bankNameChange() {
			this.selectList = [];
		},
	},
};
</script>

<style scoped>
::v-deep .el-uploads {
	border: 1px solid #d9d9d9;
	border-radius: 6px;
	position: relative;
	overflow: hidden;
}

.el-uploads:hover {
	border-color: #409eff;
}
.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 178px;
	height: 178px;
	line-height: 178px;
	text-align: center;
}
.avatar {
	width: 178px;
	height: 178px;
	display: block;
}
.row {
	margin: 0 auto;
	width: 500px;
	padding-top: 10px;
}
.el-form--inline .el-form-item {
	display: block;
}
.username {
	width: 241px;
}
</style>

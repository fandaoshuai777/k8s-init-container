<template>
	<div>
		<el-card class="box-card" shadow="hover">
			<div class="card">
				<div style="width: 90px">账户总额：</div>
				<div>{{ totalAmount }}元</div>
			</div>
			<div class="card">
				<div style="width: 90px">可提现金额：</div>
				<div>{{ availableAmount }}元（已扣除{{ fee }}元手续费）</div>
			</div>
			<div class="card">
				<div style="width: 90px">冻结总额：</div>
				<div>{{ frozenAmount }}元</div>
			</div>
			<el-button @click="handleClick">提现</el-button>
		</el-card>

		<el-dialog title="提现申请" :visible.sync="dialogFormVisible" :before-close="onClose" :close-on-click-modal="false" class="dialog">
			<el-form ref="formInfo" :rules="rules" :model="formInfo" label-width="100px">
				<el-form-item label="可提现金额:">
					<span>{{ availableAmount }}元（已扣除{{ fee }}元手续费）</span>
				</el-form-item>
				<el-form-item label="提现金额:" prop="amount">
					<el-input v-model="formInfo.amount" autocomplete="off" type="number" style="width: 400px" @input="inputChange"></el-input>
				</el-form-item>
				<el-form-item label="提现账户名:" prop="payee">
					<el-select v-model="formInfo.payee" value-key="id" style="width: 400px" @change="accountName">
						<el-option v-for="(item, index) in payeeList" :key="index" :label="item.supplierName" :value="item"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="选择提现卡:" prop="merchantBankInfoId">
					<span style="color: red" v-if="JSON.stringify(options) === '[]'">尚未添加提现卡,请添加提现卡后再申请 !</span>
					<el-radio-group v-model="formInfo.merchantBankInfoId" v-else>
						<el-radio border v-for="item in options" :key="item.id" :label="item.id" >
							<div>开户行：{{ item.accountHolderName }}</div>
							<div style="margin-top: 12px">银行账号:{{ item.accountNumber }}</div>
							<span class="position">
								{{
									item.cardType === 1
										? '借记卡'
										: item.cardType === 2
										? '贷记卡'
										: item.cardType === 3
										? '准贷卡'
										: item.cardType === 4
										? '存折'
										: item.cardType === 5
										? '单位结算卡'
										: item.cardType === 6
										? '对公卡'
										: item.cardType
								}}
							</span>
						</el-radio>
					</el-radio-group>
				</el-form-item>
				<!-- <el-form-item label="提现账号:" prop="payeeAccount">
					<el-input v-model="formInfo.payeeAccount" autocomplete="off" type="number" maxlength="20" style="width: 400px"></el-input>
				</el-form-item>
				<el-form-item label="开户行:" prop="bankName">
					<el-select v-model="formInfo.bankName" value-key="id" filterable placeholder="请选择开户行" style="width: 400px">
						<el-option v-for="item in selectList" :key="item.value" :label="item.bankName" :value="item"> </el-option>
					</el-select>
				</el-form-item> -->
				<!-- <el-form-item label="卡类型" prop="cardType">
					<el-select v-model="formInfo.cardType" placeholder="请选择卡类型" style="width: 400px">
						<el-option label="借记卡" :value="1"></el-option>
						<el-option label="贷记卡" :value="2"></el-option> -->
				<!-- <el-option label="准贷卡" :value="3"></el-option> -->
				<!-- <el-option label="存折" :value="4"></el-option> -->
				<!-- <el-option label="单位结算卡" :value="5"></el-option> -->
				<!-- <el-option label="对公卡" :value="6"></el-option> -->
				<!-- </el-select> -->
				<!-- </el-form-item> -->

				<!-- <span style="font-size: 12px; color: red;">备注：提现将会产生手续费</span> -->
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitForm('formInfo')" :loading="loading" :disabled="JSON.stringify(options) === '[]'">确定</el-button>
				<el-button @click="resetForm('formInfo')">取消</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
import { getBalance, select_by_merchant_id, query_bank_info, withdrawl } from '@/api/withdrawdeposit';

export default {
	data() {
		return {
			frozenAmount: 0,
			availableAmount: 0,
			totalAmount: 0,
			dialogFormVisible: false,
			fee: 0,
			formInfo: {
				payee: '',
				payeeAccount: '',
				bankName: '',
				receiverBankCode: '',
				amount: '',
				cardType: 1,
				merchantBankInfoId: '',
			},
			radio:'',
			loading: false,
			rules: {
				payee: [{ required: true, message: '请输入提现账户', trigger: 'blur' }],
				payeeAccount: [{ required: true, message: '请输入提现账号', trigger: 'blur' }],
				bankName: [{ required: true, message: '请输入开户行', trigger: 'blur' }],
				amount: [{ required: true, message: '请输入提现金额', trigger: 'blur' }],
				merchantBankInfoId: [{ required: true, message: '请选择提现卡', trigger: 'blur' }],
			},
			selectList: [],
			payeeList: [],
			options: [
		
			],
		};
	},
	created() {
		this.init();
	},

	methods: {
		async init() {
			const res = await getBalance({ merchantId: sessionStorage.getItem('merchantId') });
			if (res) {
				this.frozenAmount = res.data.frozenAmount;
				this.availableAmount = res.data.availableAmount;
				this.totalAmount = res.data.totalAmount;
				this.fee = res.data.fee;
			}
		},
		async handleClick() {
			this.options=[]
			const res = await select_by_merchant_id({ merchantId: sessionStorage.getItem('merchantId') });
			if (res.code == 0 && res.data.length != 0) {
			this.dialogFormVisible = true;
			this.payeeList = res.data;
			query_bank_info().then((res) => {
				this.selectList = res.data.list;
			});
			} else {
				this.$confirm('尊敬的客户，您尚未添加提现账户，请添加后再试', '提示', {
					confirmButtonText: '添加提现账户',
					cancelButtonText: '取消',
					type: 'warning',
				}).then(() => {
					this.$router.push({ path: '/withdrawdeposit/account' });
				});
			}
		},
		accountName(val) {
			console.log(val.bankInfos)
			this.options = val.bankInfos;
		},
		onClose() {
			this.$refs['formInfo'].resetFields();
			this.dialogFormVisible = false;
		},
		submitForm(formName) {
			if (this.formInfo.amount <= 0) {
				this.$message.error('提现金额应大于0元');
				return false;
			}
			if (this.formInfo.amount > this.availableAmount) {
				this.$message.error('提现金额不足');
				return false;
			}
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.loading = true;
					const { payee, payeeAccount, bankName, amount, cardType,merchantBankInfoId } = this.formInfo;
					let data = {
						merchantId: sessionStorage.getItem('merchantId'), // 商户ID
						payee: payee.supplierName,
						supplierId: payee.supplierId,
						payeeAccount,
						bankName: bankName.bankName,
						receiverBankCode: bankName.bankCode,
						amount,
						customerType: payee.supplierType == 'PERSON' ? 1 : 0,
						cardType,
						merchantBankInfoId,
					};
					console.log(data)
					withdrawl(data).then((res) => {
						console.log(res, 'resresres');
						if (res.code == 0) {
							this.$message.success('提现成功');
							this.init();
							this.$refs[formName].resetFields();
							this.dialogFormVisible = false;
							this.loading = false;
						}
					});
					setTimeout(() => {
						this.loading = false;
					}, 4000);
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		resetForm(formName) {
			this.$refs[formName].resetFields();
			this.dialogFormVisible = false;
		},
		inputChange(val) {
			if (val > this.availableAmount) {
				this.formInfo.amount = this.availableAmount;
			} else {
				this.formInfo.amount = val;
			}
		},
	},
};
</script>
<style scoped>
.card {
	display: flex;
	height: 30px;
}
::v-deep .el-dialog {
	width: 600px !important;
}
::v-deep .el-radio.is-bordered {
	display: flex;
	align-items: center;

	height: 80px !important;
	margin-top: 20px;
}
::v-deep .el-radio.is-bordered + .el-radio.is-bordered {
	margin-left: 0;
	width: 400px;
}
::v-deep .el-radio-group {
	max-height: 400px;
	overflow-y: auto;
}
::v-deep .el-radio.is-bordered {
	padding: 0 0 0 10px;
	width: 400px;
}
::v-deep .el-radio {
	margin-right: 0;
}
::v-deep .el-radio-group :nth-child(1) {
	margin-top: 0;
}
.position {
	position: absolute;
	top: 0;
	right: 20px;
	/* display: flex;
	align-items: center;
	justify-content: center; */
	/* width: 25px; */
	word-wrap: break-word;
	/* height: 40px; */
	border-left: 1px solid #ccc;
	border-right: 1px solid #ccc;
	border-bottom: 1px solid #ccc;
}
</style>

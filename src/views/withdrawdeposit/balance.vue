<template>
	<div>
		<el-card class="box-card" shadow="hover">
			<div class="card">
				<div>账户总额：</div>
				<div>{{totalAmount}}元</div>
			</div>
			<div class="card">
				<div>可提现金额：</div>
				<div>{{availableAmount}}元</div>
			</div>
			<div class="card">
				<div>冻结总额：</div>
				<div>{{frozenAmount}}元</div>
			</div>
			<el-button @click="handleClick">提现</el-button>
		</el-card>

		<el-dialog title="提现申请" :visible.sync="dialogFormVisible" :before-close="onClose" :close-on-click-modal="false" width="30%">
			<el-form ref="formInfo" :rules="rules" :model="formInfo" label-width="100px">
				<el-form-item label="可提现金额:">
					<span>{{availableAmount}}元</span>
				</el-form-item>
				<el-form-item label="提现账户:" prop="payee">
					<el-select v-model="formInfo.payee" value-key="id">
						<el-option v-for="(item, index) in payeeList" :key="index" :label="item.supplierName" :value="item"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="提现账号:" prop="payeeAccount">
					<el-input v-model="formInfo.payeeAccount" autocomplete="off" type="number" maxlength="30" style="width: 217px;"></el-input>
				</el-form-item>
				<el-form-item label="开户行:" prop="bankName">
					<el-select v-model="formInfo.bankName" value-key="id" filterable placeholder="请选择开户行">
						<el-option
							v-for="item in selectList"
							:key="item.value"
							:label="item.bankName"
							:value="item">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="卡类型" prop="cardType">
          <el-select v-model="formInfo.cardType" placeholder="请选择卡类型">
            <el-option label="借记卡" :value="1"></el-option>
						<el-option label="贷记卡" :value="2"></el-option>
						<el-option label="准贷卡" :value="3"></el-option>
						<el-option label="存折" :value="4"></el-option>
						<el-option label="单位结算卡" :value="5"></el-option>
						<el-option label="对公卡" :value="6"></el-option>
          </el-select>
        </el-form-item>
				<el-form-item label="提现金额:" prop="amount">
					<el-input v-model="formInfo.amount" autocomplete="off" type="number" style="width: 217px;"></el-input>
				</el-form-item>
				<!-- <span style="font-size: 12px; color: red;">备注：提现将会产生手续费</span> -->
			</el-form>
			<span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('formInfo')">确定</el-button>
        <el-button @click="resetForm('formInfo')">取消</el-button>
      </span>
		</el-dialog>
	</div>
</template>
<script>
import { getBalance, select_by_merchant_id, query_bank_info, withdrawl } from "@/api/withdrawdeposit"

export default {
	data() {
		return {
			frozenAmount: 0,
			availableAmount: 0,
			totalAmount: 0,
			dialogFormVisible: false,
			formInfo: {
				payee: '',
				payeeAccount: '',
				bankName: '',
				receiverBankCode: '',
				amount: '',
				cardType: 1,
			},
			rules: {
				payee: [
					{ required: true, message: '请输入提现账户', trigger: 'blur' }
				],
				payeeAccount: [
					{ required: true, message: '请输入提现账号', trigger: 'blur' }
				],
				bankName: [
					{ required: true, message: '请输入开户行', trigger: 'blur' }
				],
				amount: [
					{ required: true, message: '请输入提现金额', trigger: 'blur' }
				],
			},
			selectList: [],
			payeeList: [],
		};
	},
	created() {
		this.init();
	},
	methods: {
		async init() {
			const res = await getBalance({merchantId: sessionStorage.getItem("merchantId")});
			if (res) {
				this.frozenAmount = res.data.frozenAmount;
				this.availableAmount = res.data.availableAmount;
				this.totalAmount = res.data.totalAmount;
			}
		},
		async handleClick() {
			const res = await select_by_merchant_id({merchantId: sessionStorage.getItem("merchantId")});
			if (res.code == 0 && res.data.length != 0) {
				this.dialogFormVisible = true;
				this.payeeList = res.data;
				query_bank_info().then( r => {
					this.selectList = r.data.list;
				})
			} else {
				this.$confirm('尊敬的客户，您尚未添加提现账户，请添加后再试', '提示', {
					confirmButtonText: '添加提现账户',
					cancelButtonText: '取消',
					type: 'warning',
				}).then(() => {
					this.$router.push({ path: '/withdrawdeposit/account' })
				})
			}
		},
		onClose() {
			this.$refs['formInfo'].resetFields();
			this.dialogFormVisible = false;
		},
		submitForm(formName) {
			if (this.formInfo.amount < 0) {
				this.$message.error('提现金额不能小于0元');
				return false;
			}
			if (this.formInfo.amount > this.availableAmount) {
				this.$message.error('提现金额不足');
				return false;
			}
			this.$refs[formName].validate((valid) => {
				if (valid) {
					const { payee, payeeAccount, bankName, amount, cardType } = this.formInfo;
					let data = {
						merchantId: sessionStorage.getItem("merchantId"),         // 商户ID
						payee: payee.supplierName,
						supplierId: payee.supplierId,
						payeeAccount,
						bankName: bankName.bankName,
						receiverBankCode: bankName.bankCode,
						amount,
						customerType: payee.supplierType == 'PERSON' ? 1 : 0,
						cardType,
					}
					console.log(data, 'aaaaaaaa')
					withdrawl(data).then( res => {
						console.log(res, 'resresres');
						if (res.code == 0) {
							this.$message.success('提现成功');
							this.init();
							this.$refs[formName].resetFields();
							this.dialogFormVisible = false;
						}
					})
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
	},
};
</script>
<style scoped>
.card {
	display: flex;
	height: 30px;
}
</style>

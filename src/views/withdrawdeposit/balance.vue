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
					<el-input v-model="formInfo.payeeAccount" autocomplete="off" type="number"  maxlength="30" style="width: 217px;"></el-input>
				</el-form-item>
				<el-form-item label="开户行:" prop="bankName">
					<el-select v-model="formInfo.bankName" filterable placeholder="请选择开户行">
						<el-option
							v-for="item in selectList"
							:key="item.value"
							:label="item.bankName"
							:value="item.bankCode">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="提现金额:" prop="amount">
					<el-input v-model="formInfo.amount" autocomplete="off" type="number" style="width: 217px;"></el-input>
				</el-form-item>
				<span>备注：提现会产生手续费</span>
			</el-form>
			<span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('formInfo')">确定</el-button>
        <el-button @click="resetForm('formInfo')">取消</el-button>
      </span>
		</el-dialog>
	</div>
</template>
<script>
import { getBalance, getmerList, query_bank_info, withdrawl } from "@/api/withdrawdeposit"

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
				amount: '',
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
			const res = await getBalance({stationId: 1111129709});
			if (res) {
				this.frozenAmount = res.data.frozenAmount;
				this.availableAmount = res.data.availableAmount;
				this.totalAmount = res.data.totalAmount;
			}
		},
		async handleClick() {
			const res = await getmerList({merchantId: 1111129709});
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
			if (this.formInfo.amount > this.availableAmount) {
				this.$message.error('提现金额不足');
				return false;
			}
			this.$refs[formName].validate((valid) => {
				if (valid) {
					const { enterpriseId } = JSON.parse(sessionStorage.getItem("loginUser"));
					const { payee, payeeAccount, bankName, amount, } = this.formInfo;
					let data = {
						merchantId: enterpriseId,         // 商户ID
						payee: payee.supplierName,
						payeeAccount,
						bankName,
						amount,
						customerType: payee.supplierType,
					}
					withdrawl(data).then( res => {
						console.log(res, 'resresres');
						if (res.code == 0) {
							this.$message.success('添加成功');
							this.$emit('change');
							this.$refs[formName].resetFields();
						}
						this.dialogFormVisible = false;
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

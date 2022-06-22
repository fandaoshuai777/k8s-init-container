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

		<el-dialog title="提现申请" :visible.sync="dialogFormVisible">
			<el-form ref="formInfo" :rules="rules" :model="formInfo" label-width="100px">
				<el-form-item label="可提现金额:">
					<span>{{availableAmount}}元</span>
				</el-form-item>
				<el-form-item label="提现账户:" prop="supplierType">
					<el-select v-model="formInfo.supplierType" placeholder="请选择活动区域">
						<el-option label="区域一" value="shanghai"></el-option>
						<el-option label="区域二" value="beijing"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="提现账号:" prop="supplierType">
					<el-input v-model="formInfo.supplierType" autocomplete="off" type="number"  maxlength="30"></el-input>
				</el-form-item>
				<el-form-item label="开户行:" prop="supplierType">
					<el-select v-model="formInfo.supplierType" filterable placeholder="请选择活动区域">
						<el-option
							v-for="item in selectList"
							:key="item.value"
							:label="item.bankName"
							:value="item.bankCode">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="提现金额:" prop="supplierType">
					<el-input v-model="formInfo.supplierType" autocomplete="off" type="number"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
import { getBalance, getmerList, query_bank_info } from "@/api/withdrawdeposit"

export default {
	data() {
		return {
			frozenAmount: 0,
			availableAmount: 0,
			totalAmount: 0,
			dialogFormVisible: false,
			formInfo: {
				supplierType: ''
			},
			rules: {
				supplierType: [
					{ required: true, message: '请输入账户名', trigger: 'blur' }
				],
			},
			selectList: []
		};
	},
	created() {
		this.init();
	},
	methods: {
		async init() {
			const res = await getBalance({stationId: sessionStorage.getItem("enterpriseId")});
			if (res.code == 0) {
				this.frozenAmount = res.data.frozenAmount;
				this.availableAmount = res.data.availableAmount;
				this.totalAmount = res.data.totalAmount;
			}
		},
		async handleClick() {
			const res = await getmerList({merchantId: sessionStorage.getItem("enterpriseId")});
			if (res.code == 0 && res.data.length != 0) {
				this.dialogFormVisible = true;
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
	},
};
</script>
<style scoped>
.card {
	display: flex;
	height: 30px;
}
</style>

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
		<add-dialog :show.sync="show"></add-dialog>
	</div>
</template>
<script>
import AddDialog from './components/AddDialog';
import { getBalance } from "@/api/withdrawdeposit"

export default {
	components: {
		AddDialog,
	},
	data() {
		return {
			show: false,
			frozenAmount: 0,
			availableAmount: 0,
			totalAmount: 0,
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
		handleClick() {
			this.$confirm('尊敬的客户，您尚未添加提现账户，请添加后再试', '提示', {
				confirmButtonText: '添加提现账户',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(() => {
				this.show = true;
			})
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

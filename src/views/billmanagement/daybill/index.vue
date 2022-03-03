<template>
	<div class="system-role-container">
		<el-card shadow="hover">
			<el-form :model="formInline" class="demo-form-inline">
				<div class="header">
					<el-form-item label="油站">
						<el-select v-model="formInline.region" placeholder="活动区域">
							<el-option label="区域一" value="shanghai"></el-option>
							<el-option label="区域二" value="beijing"></el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="账单状态">
						<el-select v-model="formInline.region" placeholder="活动区域">
							<el-option label="区域一" value="shanghai"></el-option>
							<el-option label="区域二" value="beijing"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="账单日期">
						<el-date-picker
							v-model="formInline.user"
							type="datetimerange"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							:default-time="['12:00:00']"
						>
						</el-date-picker>
					</el-form-item>
					<el-form-item>
						<div class="right">
							<el-button type="primary" @click="onSubmit">查询</el-button>
						</div>
					</el-form-item>
				</div>
			</el-form>
			<div style="margin-top: 20px">交易总金额（元）： 让利总金额（元）： 应结算总金额（元）： 实际结算总金额（元）： 商家承担直降总金额（元）：</div>
			<el-table style="width: 100%" :data=listData>
				<el-table-column label="账单编号" />
				<el-table-column prop="a" label="账单日期" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="a" label="油站名称" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="a" label="加油金额(元)" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="a" label="应结金额(元)" show-overflow-tooltip align="center" />
				<el-table-column prop="a" label="通道费(元)" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="a" label="商家承担直降金额(元）" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="a" label="商家承担平台优惠券金额(元)" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="a" label="实结金额(元)" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="a" label="升数" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="a" label="交易笔数" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="a" label="手续费(元)" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="a" label="账单状态" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column label="操作" align="center">
					<template #default="scope">
						<el-button size="small" type="text" @click="onOpenBill(scope.row)">账单明细</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="right">
				<el-pagination
					class="mt15"
					:pager-count="5"
					:page-sizes="[10, 20, 30]"
					background
					layout="total, sizes, prev, pager, next, jumper"
				></el-pagination>
			</div>
		</el-card>
	</div>
</template>
<script>
export default {
	data() {
		return {
			formInline: {
				user: '',
				region: '',
			},
			listData:[{a:1}]
		};
	},
	methods: {
		onSubmit() {
			console.log('submit!');
		},
		onOpenBill(row){
		console.log(row)
			this.$router.push({
				path:'detail',
				query:row
			})
		}
	},
};
</script>
<style scoped lang='scss'>
.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	.el-form-item {
		// width: 25%;
		display: flex;
	}
}
.right {
	text-align: right;
}
</style>


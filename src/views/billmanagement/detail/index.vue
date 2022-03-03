<template>
	<div class="system-role-container">
		<el-card shadow="hover">
			<el-form :model="formInline" class="demo-form-inline">
				<div class="header">
					<el-form-item label="订单号">
						<el-input v-model="formInline.user"></el-input>
					</el-form-item>
					<el-form-item label=" 支付时间">
						<el-date-picker
							v-model="formInline.user"
							type="datetimerange"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							:default-time="['12:00:00']"
						>
						</el-date-picker>
					</el-form-item>
					<el-form-item label="交易类型">
						<el-select v-model="formInline.region" placeholder="活动区域">
							<el-option label="区域一" value="shanghai"></el-option>
							<el-option label="区域二" value="beijing"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="油号">
						<el-select v-model="formInline.region" placeholder="活动区域">
							<el-option label="区域一" value="shanghai"></el-option>
							<el-option label="区域二" value="beijing"></el-option>
						</el-select>
					</el-form-item>
				</div>
				<div class="right">
					<el-form-item>
						<div class="right">
							<el-button type="primary" @click="onSubmit">查询</el-button>
						</div>
					</el-form-item>
				</div>
			</el-form>
			<el-table style="width: 100%">
				<el-table-column label="订单编号" />
				<el-table-column prop="roleName" label="司机手机号" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="roleSign" label="交易类型" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="sort" label="订单油机金额" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="status" label="应结算金额" show-overflow-tooltip align="center" />
				<el-table-column prop="describe" label="让利金额" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="createTime" label="通道费" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="createTime" label="商家承担直降金额" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="createTime" label="商家承担平台优惠券金额" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="createTime" label="结算单价" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="createTime" label="枪号" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="createTime" label="油品类型" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="createTime" label="加油量" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="createTime" label="订单状态" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="createTime" label="订单来源" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="createTime" label="创建时间" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="createTime" label="支付时间" show-overflow-tooltip align="center"></el-table-column>
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
		};
	},
	created() {
		console.log(this.$route.query);
	},
	methods: {
		onSubmit() {
			console.log('submit!');
		},
	},
};
</script>
<style scoped lang='scss'>
.header {
	display: flex;
	justify-content: space-between;
	.el-form-item {
		// width: 25%;
		display: flex;
	}
}
.right {
	text-align: right;
}
</style>

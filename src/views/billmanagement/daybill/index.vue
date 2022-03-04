<template>
	<div class="system-role-container">
		<el-card shadow="hover">
			<el-form :model="formInline" class="demo-form-inline">
				<div class="header">
					<el-form-item label="油站">
						<el-select v-model="formInline.stationName">
							<el-option label="全部" value="0"></el-option>
							<el-option label="昌平加油站" value="昌平加油站"></el-option>
							<el-option label="蓉电加油站" value="蓉电加油站"></el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="账单状态">
						<el-select v-model="formInline.billStatus">
							<el-option label="全部" value="0"></el-option>
							<el-option label="已生成" value="1"></el-option>
							<el-option label="已结算" value="3"></el-option>
							<el-option label="结算失败" value="2"></el-option>
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
							<el-button type="primary" @click="inquire">查询</el-button>
						</div>
					</el-form-item>
				</div>
			</el-form>
			<div style="margin-top: 20px">交易总金额（元）： 让利总金额（元）： 应结算总金额（元）： 实际结算总金额（元）： 商家承担直降总金额（元）：</div>
			<el-table style="width: 100%" :data="tableData">
				<el-table-column prop="billNo" label="账单编号" align="center" />
				<el-table-column prop="billTime" label="账单日期" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="stationName" label="油站名称" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="dieselEngineNum" label="加油金额(元)" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="money" label="应结金额(元)" show-overflow-tooltip align="center" />
				<el-table-column prop="slottingAllowanceMoney" label="通道费(元)" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="plummet" label="商家承担直降金额(元）" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="discount" label="商家承担平台优惠券金额(元)" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="oldSolidKnotAmount" label="实结金额(元)" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="a" label="升数" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="a" label="交易笔数" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="serviceCharge" label="手续费(元)" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="billStatus" label="账单状态" show-overflow-tooltip align="center"></el-table-column>
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
					:current-page.sync="pagination.pageNum"
					@size-change="pageSizeChange"
					@current-change="paginationChange"
					:total="total"
				></el-pagination>
			</div>
		</el-card>
	</div>
</template>
<script>
import { billList } from '@/api/bill/index.js';

export default {
	data() {
		return {
			formInline: {
				stationName: null,
				billStatus: null,
			},
			tableData: [],
			pagination: {
				pageSize: 10,
				pageNum: 1,
			},
			total: 0,
		};
	},
	computed: {
		paginationOption: function () {
			return { ...this.pagination, total: this.total };
		},
	},
	created() {
		this.getbillList();
	},
	methods: {
		inquire() {
			this.pagination.pageNum=1
			this.getbillList();
		},
		getbillList() {
			let date = { ...this.pagination, ...this.formInline };
			billList(date).then((res) => {
				this.tableData = res.result.data;
				this.total = res.result.totalNum;
			});
		},
		onOpenBill(row) {
			console.log(row);
			this.$router.push({
				path: 'detail',
				query: row,
			});
		},
		// 页码变化
		paginationChange(value) {
			this.pagination.pageNum = value;
			this.getbillList();
		},
		// 页数变化
		pageSizeChange(value) {
			this.pagination.pageSize = value;
			this.getbillList();
		},
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


<template>
	<div class="system-role-container">
		<el-card shadow="hover">
			<el-form :model="formInline" class="demo-form-inline">
				<div class="header">
					<el-form-item label="订单号">
						<el-input v-model="formInline.orderNo" placeholder="请输入订单号"></el-input>
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
						<el-select v-model="formInline.paymentType">
							<el-option label="全部" value=""></el-option>
							<el-option label="油卡支付" value="1"></el-option>
							<el-option label="余额支付" value="3"></el-option>
							<el-option label="微信支付" value="2"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="油号">
						<el-select v-model="formInline.oilType">
							<el-option label="全部" value=""></el-option>
							<el-option label="95#" value="95#"></el-option>
							<el-option label="92#" value="92#"></el-option>
						</el-select>
					</el-form-item>
				</div>
				<div class="right">
					<el-form-item>
						<div class="right">
							<el-button type="primary" @click="inquire">查询</el-button>
						</div>
					</el-form-item>
				</div>
			</el-form>
			<el-table style="width: 100%" :data="tableList">
				<el-table-column prop="orderNo" label="订单编号" align="center" />
				<el-table-column prop="driverTel" label="司机手机号" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="a" label="交易类型" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="fuelVolume" label="订单油机金额" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="solidKnotAmount" label="应结算金额" show-overflow-tooltip align="center" />
				<el-table-column prop="a" label="让利金额" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="slottingAllowanceMoney" label="通道费" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="a" label="商家承担直降金额" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="a" label="商家承担平台优惠券金额" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="platformSettleAmount" label="结算单价" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="gunno" label="枪号" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="oilType" label="油品类型" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="a" label="加油量" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="paymentStatus" label="订单状态" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="massState" label="订单来源" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="orderTime" label="创建时间" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="paymentTime" label="支付时间" show-overflow-tooltip align="center"></el-table-column>
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
import { billDetailList } from '@/api/bill/index.js';

export default {
	data() {
		return {
			formInline: {
				orderNo: null,
				paymentType: null,
				oilType: null,
			},
			tableList: [],
			total: 0,
			pagination: {
				pageSize: 10,
				pageNum: 1,
			},
		};
	},
	computed: {
		paginationOption: function () {
			return { ...this.pagination, total: this.total };
		},
	},
	created() {
		this.indentList();
	},
	methods: {
		inquire() {
			this.pagination.pageNum = 1;
			this.indentList();
		},
		indentList() {
			let date = { ...this.pagination, ...this.formInline };
			billDetailList(date, this.$route.query.stationId).then((res) => {
				this.tableList = res.result.data.map((n) => {
					return {
						...n,
						paymentType: n.paymentType == 1 ? '油卡支付' : n.paymentType == 2 ? '微信支付' : n.paymentType == 3 ? '余额支付' : n.paymentType,
					};
				});
				this.total = res.result.totalNum;
			});
		},

		// 页码变化
		paginationChange(value) {
			this.pagination.pageNum = value;
			this.indentList();
		},
		// 页数变化
		pageSizeChange(value) {
			this.pagination.pageSize = value;
			this.indentList();
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

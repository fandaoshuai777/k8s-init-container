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
							v-model="Time"
							type="datetimerange"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							:default-time="['00:00:00', '23:59:59']"
							value-format="yyyy-MM-dd HH:mm:ss"
							:picker-options="pickerOptions"
						>
						</el-date-picker>
					</el-form-item>
					<el-form-item label="交易类型">
						<el-select v-model="formInline.paymentType" clearable>
							<el-option v-for="(item, index) in billSta" :key="index" :label="item.label" :value="item.code"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="油号">
						<el-select v-model="formInline.oilType" clearable>
							<el-option v-for="(item, index) in billStas" :key="index" :label="item" :value="item"></el-option>
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
				<el-table-column prop="state" label="交易类型" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="fuelVolume" label="订单油机金额" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="solidKnotAmount" label="应结算金额" show-overflow-tooltip align="center" />
				<el-table-column prop="platformMoney" label="让利金额" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="slottingAllowanceMoney" label="通道费" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="channelPrice" label="结算单价" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="gunno" label="枪号" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="oilType" label="油品类型" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="fuelVolume" label="加油量" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="paymentStatus" label="订单状态" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="orderSource" label="订单来源" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="paymentTime" label="创建时间" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="orderTime" label="支付时间" show-overflow-tooltip align="center"></el-table-column>
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
import { billDetailList, payTypeDict } from '@/api/bill/index.js';
import { oilTypeDict } from '@/api/indentmanagement/index.js';

export default {
	data() {
		return {
			formInline: {
				orderNo: null,
				paymentType: null,
				oilType: null,
				startTime: null,
				endTime: null,
			},
			tableList: [],
			total: 0,
			pagination: {
				pageSize: 10,
				pageNum: 1,
			},
			Time: null,
			billSta: [],
			billStas: [],
			pickerOptions: {
				shortcuts: [
					{
						text: '最近一周',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', [start, end]);
						},
					},
					{
						text: '最近一个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
							picker.$emit('pick', [start, end]);
						},
					},
					{
						text: '最近三个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
							picker.$emit('pick', [start, end]);
						},
					},
				],
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
	mounted() {
		payTypeDict().then((res) => {
			this.billSta = res.result.map((n) => {
				return {
					...n,
					label: n.value,
				};
			});
		});
		oilTypeDict().then((res) => {
			this.billStas = res.result;
		});
	},
	methods: {

		inquire() {
			this.pagination.pageNum = 1;
			if (this.Time == null) {
				this.formInline.endTime = '';
				this.formInline.startTime = '';
			} else {
				this.formInline.endTime = this.Time[0];
				this.formInline.startTime = this.Time[1];
			}

			this.indentList();
		},
		indentList() {
			let date = { ...this.pagination, ...this.formInline, stationId: this.$route.query.stationId };
			billDetailList(date).then((res) => {
				this.tableList = res.result.data.map((n) => {
					return {
						...n,
						paymentType: n.paymentType == 1 ? '油卡支付' : n.paymentType == 2 ? '微信支付' : n.paymentType == 3 ? '余额支付' : n.paymentType,
						paymentStatus:
							n.paymentStatus == 1
								? '已付款'
								: n.paymentStatus == 2
								? '退款成功'
								: n.paymentStatus == 3
								? '付款中'
								: n.paymentStatus == 4
								? '待退款'
								: n.paymentStatus == 5
								? '退款失败'
								: n.paymentStatus,
						state: n.state == 1 ? '消费 ' : n.state == 2 ? '退款' : n.state,
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

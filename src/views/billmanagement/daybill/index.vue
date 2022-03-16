<template>
	<div class="system-role-container">
		<el-card shadow="hover">
			<el-form :model="formInline" label-width="40px">
				<el-row :gutter="12">
					<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="5" >
						<el-form-item label="油站"  >
							<el-select v-model="formInline.stationName" clearable>
								<el-option v-for="(item, index) in oilStations" :key="index" :label="item.label" :value="item.code"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="5" >
						<el-form-item label="账单状态"  label-width="70px">
							<el-select v-model="formInline.billStatus" clearable>
								<el-option v-for="(item, index) in billSta" :key="index" :label="item.label" :value="item.code"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="8" >
						<el-form-item label="账单日期"  label-width="70px">
							<el-date-picker
								v-model="Time"
								type="daterange"
								align="right"
								unlink-panels
								range-separator="至"
								start-placeholder="开始日期"
								end-placeholder="结束日期"
								value-format="yyyy-MM-dd"
							>
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="5"  >
						<el-form-item >
							<div class="right">
								<el-button type="primary" @click="inquire">查询</el-button>
							</div>
						</el-form-item>
					</el-col>
				</el-row>
		
			</el-form>
			<div class="center">
				<div>交易总金额(元)：{{ dieselEngineNumTotal }}</div>
				<div>让利总金额(元)：{{ platformMoneyTotal }}</div>
				<div>应结算总金额(元)：{{ settleAmountTotal }}</div>
				<div>实际结算总金额(元)：{{ solidKnotAmountTotal }}</div>
			</div>
			<el-table style="width: 100%" :data="tableData" border>
				<el-table-column prop="billNo" label="账单编号" min-width="210px"  align="center" />
				<el-table-column prop="billTime" label="账单日期"  min-width="150px"  align="center"></el-table-column>
				<el-table-column prop="stationName" label="油站名称" min-width="210px"  align="center"></el-table-column>
				<el-table-column prop="dieselEngineNum" label="加油金额(元)"  align="center"></el-table-column>
				<el-table-column prop="settleAmount" label="应结金额(元)"  align="center" />
				<el-table-column prop="slottingAllowanceMoney" label="通道费(元)"  align="center"></el-table-column>
				<el-table-column prop="plummet" label="商家承担直降金额(元）" min-width="130px"  align="center"></el-table-column>
				<el-table-column prop="discount" label="商家承担平台优惠券金额(元)" min-width="130px" align="center"></el-table-column>
				<el-table-column prop="oldSolidKnotAmount" label="实结金额(元)"  align="center"></el-table-column>
				<el-table-column prop="fuelVolume" label="升数"  align="center"></el-table-column>
				<el-table-column prop="orderNum" label="交易笔数"  align="center"></el-table-column>
				<el-table-column prop="serviceCharge" label="手续费(元)"  align="center"></el-table-column>
				<el-table-column prop="billStatus" label="账单状态"  align="center"></el-table-column>
				<el-table-column label="操作" align="center" fixed="right">
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
import { billList, billStatusDict } from '@/api/bill/index.js';
import { oilStationDict } from '@/api/indentmanagement/index.js';

export default {
	data() {
		return {
			formInline: {
				stationName: null,
				billStatus: null,
				startTime: null,
				endTime: null,
			},
			dieselEngineNumTotal: 0,
			platformMoneyTotal: 0,
			plummetTotal: 0,
			settleAmountTotal: 0,
			solidKnotAmountTotal: 0,
			tableData: [],
			pagination: {
				pageSize: 10,
				pageNum: 1,
			},
			total: 0,
			Time: null,
			billSta: [],
			oilStations: [],
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
	mounted() {
		billStatusDict().then((res) => {
			this.billSta = res.result.map((n) => {
				return {
					...n,
					label: n.value,
				};
			});
		});
		oilStationDict().then((res) => {
			console.log(res.result);
			this.oilStations = res.result.map((n) => {
				return {
					...n,
					label: n.value,
				};
			});
		});
	},
	methods: {
		inquire() {
			console.log(this.Time);
			this.pagination.pageNum = 1;
			if (this.Time == null) {
				this.formInline.endTime = '';
				this.formInline.startTime = '';
			} else {
				this.formInline.endTime = this.Time[1];
				this.formInline.startTime = this.Time[0];
			}
			this.getbillList();
		},
		getbillList() {
			let date = { ...this.pagination, ...this.formInline };
			billList(date).then((res) => {
				this.dieselEngineNumTotal = res.result.stationTotalVO.dieselEngineNumTotal.toFixed(2);
				this.platformMoneyTotal = res.result.stationTotalVO.platformMoneyTotal.toFixed(2);
				this.plummetTotal = res.result.stationTotalVO.plummetTotal;
				this.settleAmountTotal = res.result.stationTotalVO.settleAmountTotal.toFixed(2);
				this.solidKnotAmountTotal = res.result.stationTotalVO.solidKnotAmountTotal.toFixed(2);
				this.tableData = res.result.oilStationDailyBillPage.data.map((n) => {
					return {
						...n,
						billStatus: n.billStatus == 1 ? '未确认' : n.billStatus == 2 ? '已确认' : n.billStatus == 3 ? '已结算' : n.billStatus,
						billTime:n.billTime.slice(0,10)
					};
				});
				this.total = res.result.oilStationDailyBillPage.totalNum;
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
.center {
	margin: 20px 0;
	display: flex;
	> div {
		margin-right: 20px;
	}
}
::v-deep .el-date-editor .el-range-separator{
	width: auto;
}
::v-deep {
	.el-table {
		z-index: 0;
	}
}
::v-deep .el-range__close-icon {
	display: none;
}
</style>


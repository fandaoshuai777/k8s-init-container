<template>
	<div class="system-role-container">
		<el-card shadow="hover">
			<el-form :model="formInline"   label-width="100px" >
				<!-- <div class="header"> -->
					<el-row :gutter="12">
						<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="5" class="mb20">
							<el-form-item label="订单号">
								<el-input v-model="formInline.orderNo" placeholder="请输入订单号" @change="onVerifiyNumberInteger($event)"></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="8" class="mb20" >
							<el-form-item label=" 支付时间">
								<el-date-picker
									:disabled="this.$route.query.billTime == undefined ? false : true"
									v-model="Time"
									type="datetimerange"
									start-placeholder="开始日期"
									end-placeholder="结束日期"
									:default-time="['00:00:00', '23:59:59']"
									value-format="yyyy-MM-dd HH:mm:ss"
									@change="astrict"
									
								>
								</el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="5" class="mb20" >
							<el-form-item label="交易类型">
								<el-select v-model="formInline.state" clearable>
									<el-option v-for="(item, index) in billSta" :key="index" :label="item.label" :value="item.code"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="5" class="mb20">
							<el-form-item label="油号">
								<el-select v-model="formInline.oilType" clearable>
									<el-option v-for="(item, index) in billStas" :key="index" :label="item" :value="item"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
					<!-- <el-form-item label="订单号">
						<el-input v-model="formInline.orderNo" placeholder="请输入订单号" @change="onVerifiyNumberInteger($event)"></el-input>
					</el-form-item>
					<el-form-item label=" 支付时间">
						<el-date-picker
							:disabled="this.$route.query.billTime == undefined ? false : true"
							v-model="Time"
							type="datetimerange"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							:default-time="['00:00:00', '23:59:59']"
							value-format="yyyy-MM-dd HH:mm:ss"
							@change="arr"
						>
						</el-date-picker>
					</el-form-item>
					<el-form-item label="交易类型">
						<el-select v-model="formInline.state" clearable>
							<el-option v-for="(item, index) in billSta" :key="index" :label="item.label" :value="item.code"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="油号">
						<el-select v-model="formInline.oilType" clearable>
							<el-option v-for="(item, index) in billStas" :key="index" :label="item" :value="item"></el-option>
						</el-select>
					</el-form-item> -->
				<!-- </div> -->
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
				<el-table-column prop="driverTel" label="司机手机号" align="center"></el-table-column>
				<el-table-column prop="state" label="交易类型" align="center"></el-table-column>
				<el-table-column prop="dieselEngineNum" label="订单油机金额" align="center"></el-table-column>
				<el-table-column prop="settleAmount" label="应结算金额" align="center" />
				<el-table-column prop="platformMoney" label="让利金额" align="center"></el-table-column>
				<el-table-column prop="slottingAllowanceMoney" label="通道费" align="center"></el-table-column>
				<el-table-column prop="channelPrice" label="结算单价" align="center"></el-table-column>
				<el-table-column prop="gunno" label="枪号" align="center"></el-table-column>
				<el-table-column prop="oilType" label="油品类型" align="center"></el-table-column>
				<el-table-column prop="fuelVolume" label="加油量" align="center"></el-table-column>
				<el-table-column prop="paymentStatus" label="订单状态" align="center"></el-table-column>
				<el-table-column prop="orderSource" label="订单来源" align="center"></el-table-column>
				<el-table-column prop="paymentTime" label="创建时间" align="center"></el-table-column>
				<el-table-column prop="orderTime" label="支付时间" align="center"></el-table-column>
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
import { verifiyNumberInteger } from '@/utils/toolsValidate';

export default {
	data() {
		return {
			formInline: {
				orderNo: null,
				state: null,
				oilType: null,
				startTime: null,
				endTime: null,
			},
			timeBtn: false,
			tableList: [],
			total: 0,
			pagination: {
				pageSize: 10,
				pageNum: 1,
			},
			Time: [],
			billSta: [],
			billStas: [],
		};
	},
	computed: {
		paginationOption: function () {
			return { ...this.pagination, total: this.total };
		},
	},
	created() {
		if (this.$route.query.billTime == undefined) {
			var day = new Date();
			day.setTime(day.getTime() - 24 * 60 * 60 * 1000);
			var yesterday = day.getFullYear() + '-' + (day.getMonth() + 1) + '-' + day.getDate();
			this.formInline.startTime = yesterday + ' 00:00:00';
			this.formInline.endTime = yesterday + ' 23:59:59';
			this.Time[0] = this.formInline.startTime;
			this.Time[1] = this.formInline.endTime;
			this.indentList();
		} else {
			this.formInline.startTime = this.$route.query.billTime;
			this.formInline.endTime = this.$route.query.billTime.split(' ', 1) + ' 23:59:59';
			this.Time[0] = this.formInline.startTime;
			this.Time[1] = this.formInline.endTime;
			this.indentList();
		}
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
		onVerifiyNumberInteger(val) {
			if (verifiyNumberInteger(val) == false) {
				this.formInline.orderNo = '';
			}
		},
		astrict() {
			if (this.Time == null) {
				this.formInline.endTime = '';
				this.formInline.startTime = '';
				return;
			} else {
				let startDate = this.Time[0].replace(new RegExp('-', 'gm'), '/');
				let Sdata = new Date(startDate).getTime();
				let startDates = this.Time[1].replace(new RegExp('-', 'gm'), '/');
				let Sdatas = new Date(startDates).getTime();
				console.log(Sdata > Sdatas);
				if (Sdata + 86400000 > Sdatas) {
				} else {
					this.$message('只能选择某天24小时之内的');
					this.Time = '';
				}
				return;
			}
		},
		inquire() {
			this.pagination.pageNum = 1;
			if (this.Time == null) {
				this.formInline.endTime = '';
				this.formInline.startTime = '';
				this.Time = [];
			} else {
				this.formInline.endTime = this.Time[1];
				this.formInline.startTime = this.Time[0];
			}

			this.indentList();
		},
		indentList() {
			let date = { ...this.pagination, ...this.formInline };
			billDetailList(date).then((res) => {
				this.tableList = res.result.data.map((n) => {
					return {
						...n,
						paymentType: n.paymentType == 1 ? '油卡支付' : n.paymentType == 2 ? '微信支付' : n.paymentType == 3 ? '余额支付' : n.paymentType,
						orderSource:
							n.orderSource == 1
								? '小鹰加油'
								: n.orderSource == 2
								? '小鹰加油'
								: n.orderSource == 3
								? '小鹰加油'
								: n.orderSource == 4
								? '团油'
								: n.orderSource == 5
								? '宝能'
								: n.orderSource == 6
								? '小鹰加油'
								: n.orderSource == 8
								? '敬运'
								: n.orderSource,
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
						driverTel: n.driverTel.replace(/(\d{3})\d*(\d{4})/, '$1****$2'),
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
	z-index: 0;
}
.el-date-editor{
	width: 101%;
}
::v-deep {
	.el-table {
		z-index: 0;
	}
}
::v-deep .el-range__close-icon{
	display: none;
}
</style>

<template>
	<div class="system-role-container">
		<el-card shadow="hover">
			<div>
				<el-form label-width="95px" :inline="true" label-position="right" size="small">
					<el-form-item label="账单日期">
						<el-date-picker
							v-model="time"
							:picker-options="StartDatetions"
							type="daterange"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							value-format="yyyy-MM-dd"
						>
						</el-date-picker>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="inquire">查询</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div v-loading="loading" class="warp" ref="table_inner">
				<el-table
					class="table"
					border
					:style="flag ? 'width:' + errorWidth + 'px' : 'width:' + tableWidth + 'px'"
					:header-cell-style="{ background: '#e9f6ff' }"
				>
					<!-- <el-table class="table" border> -->
					<el-table-column prop="date" label="账单日期" align="center" :width="timeWidth"> </el-table-column>
					<el-table-column :width="With" label="渠道" align="center"> </el-table-column>
					<el-table-column :width="With" label="	订单类型" align="center"> </el-table-column>
					<el-table-column :width="With" label="	结算账户" align="center"> </el-table-column>
					<el-table-column :width="With" label="	订单金额" align="center"> </el-table-column>
					<el-table-column :width="With" label="	支付通道手续费" align="center"> </el-table-column>
					<el-table-column :width="With" label="	平台服务费" align="center"> </el-table-column>
					<el-table-column :width="With" label="	应结金额" align="center"> </el-table-column>
					<el-table-column :width="With" label="	结算服务费" align="center"> </el-table-column>
					<el-table-column :width="With" label="	采购折扣金额" align="center"> </el-table-column>
					<el-table-column :width="With" label="	实结金额" align="center"> </el-table-column>
					<el-table-column :width="With" label="	账单状态" align="center" v-if="flag === 0"> </el-table-column>
				</el-table>
				<el-table
					:style="flag ? 'width:' + errorWidth + 'px' : 'width:' + tableWidth + 'px'"
					:data="dataList"
					:show-header="false"
					border
					class="warptable"
				>
					<el-table-column prop="riqi" align="center">
						<el-table-column align="center" prop="riqi" :width="timeWidth"> </el-table-column>
						<el-table-column align="center" prop="lists">
							<template slot-scope="scopeDate">
								<el-table :show-header="false" :data="scopeDate.row.lists" class="warptable_inner">
									<el-table-column prop="channelName" :width="With" align="center">
										<template slot-scope="scope">
											{{ scope.row.channelName | filter }}
										</template>
									</el-table-column>
									<el-table-column prop="orderType" align="center">
										<template slot-scope="channelData">
											<el-table :show-header="false" :data="channelData.row.channelDate" class="tableNexine">
												<el-table-column align="center" prop="orderType" :width="With">
													<template slot-scope="scope">
														{{ scope.row.orderType | filter }}
													</template>
												</el-table-column>
												<el-table-column align="center" prop="orderType">
													<template slot-scope="orderData">
														<el-table :show-header="false" :data="orderData.row.detailsList" :row-class-name="tableRowClassName">
															<el-table-column align="center" prop="settlementAccountType" :width="With">
																<template slot-scope="scope">
																	{{ scope.row.settlementAccountType | filter }}
																</template>
															</el-table-column>
															<el-table-column align="center" :width="With" prop="orderAmount">
																<template slot-scope="scope">
																	{{ scope.row.orderAmount === 0 ? '--' : scope.row.orderAmount }}
																</template>
															</el-table-column>
															<el-table-column align="center" :width="With" prop="channelPoundage">
																<template slot-scope="scope">
																	{{ scope.row.channelPoundage === 0 ? '--' : scope.row.channelPoundage }}
																</template>
															</el-table-column>
															<el-table-column align="center" :width="With" prop="platformServiceFee">
																<template slot-scope="scope">
																	{{ scope.row.platformServiceFee === 0 ? '--' : scope.row.platformServiceFee }}
																</template>
															</el-table-column>
															<el-table-column align="center" :width="With" prop="settlementAmount">
																<template slot-scope="scope">
																	{{ scope.row.settlementAmount === 0 ? '--' : scope.row.settlementAmount }}
																</template>
															</el-table-column>
															<el-table-column align="center" :width="With" prop="settlementServiceFee">
																<template slot-scope="scope">
																	{{ scope.row.settlementServiceFee === 0 ? '--' : scope.row.settlementServiceFee }}
																</template>
															</el-table-column>
															<el-table-column align="center" :width="With" prop="purchaseDiscountAmount">
																<template slot-scope="scope">
																	{{ scope.row.purchaseDiscountAmount === 0 ? '--' : scope.row.purchaseDiscountAmount }}
																</template>
															</el-table-column>
															<el-table-column align="center" :width="With" prop="solidKnotAmount">
																<template slot-scope="scope">
																	{{ scope.row.solidKnotAmount === 0 ? '--' : scope.row.solidKnotAmount }}
																</template>
															</el-table-column>
															<el-table-column align="center" :width="With" prop="settlementStatus" v-if="flag === 0">
																<template slot-scope="scope">
																	{{ scope.row | filterStatus }}
																</template>
															</el-table-column>
														</el-table>
													</template>
												</el-table-column>
											</el-table>
										</template>
									</el-table-column>
								</el-table>
							</template>
						</el-table-column>
					</el-table-column>
				</el-table>
				<el-table
					border
					:show-header="false"
					:data="sum"
					:style="flag ? 'width:' + errorWidth + 'px' : 'width:' + tableWidth + 'px'"
					class="colorBack"
				>
					<el-table-column align="center" prop="settlementAccountType">
						<el-table-column align="center" prop="orderType" :width="timeWidth">
							<template slot-scope="scope">
								{{ (scope.row = '总计') }}
							</template>
						</el-table-column>
						<el-table-column align="center" prop="orderType">
							<template slot-scope="data">
								<el-table :show-header="false" :data="data.row.detailsList" border>
									<el-table-column align="center" :width="With" prop="settlementAccountType"> </el-table-column>
									<el-table-column align="center" :width="With" prop="settlementAccountType"> </el-table-column>
									<el-table-column align="center" :width="With" prop="settlementAccountType"> </el-table-column>
									<el-table-column align="center" :width="With" prop="orderAmount">
										<template slot-scope="scope">
											{{ scope.row.orderAmount === 0 ? '--' : scope.row.orderAmount }}
										</template>
									</el-table-column>
									<el-table-column align="center" :width="With" prop="channelPoundage">
										<template slot-scope="scope">
											{{ scope.row.channelPoundage === 0 ? '--' : scope.row.channelPoundage }}
										</template>
									</el-table-column>
									<el-table-column align="center" :width="With" prop="platformServiceFee">
										<template slot-scope="scope">
											{{ scope.row.platformServiceFee === 0 ? '--' : scope.row.platformServiceFee }}
										</template>
									</el-table-column>
									<el-table-column align="center" :width="With" prop="settlementAmount">
										<template slot-scope="scope">
											{{ scope.row.settlementAmount === 0 ? '--' : scope.row.settlementAmount }}
										</template>
									</el-table-column>
									<el-table-column align="center" :width="With" prop="settlementServiceFee">
										<template slot-scope="scope">
											{{ scope.row.settlementServiceFee === 0 ? '--' : scope.row.settlementServiceFee }}
										</template>
									</el-table-column>
									<el-table-column align="center" :width="With" prop="purchaseDiscountAmount">
										<template slot-scope="scope">
											{{ scope.row.purchaseDiscountAmount === 0 ? '--' : scope.row.purchaseDiscountAmount }}
										</template>
									</el-table-column>
									<el-table-column align="center" :width="With" prop="solidKnotAmount">
										<template slot-scope="scope">
											{{ scope.row.solidKnotAmount === 0 ? '--' : scope.row.solidKnotAmount }}
										</template>
									</el-table-column>
									<el-table-column align="center" :width="With" prop="settlementStatus" v-if="flag === 0">
										<template slot-scope="scope">
											{{ (scope.row.settlementStatus = ' ') }}
										</template>
									</el-table-column>
								</el-table>
							</template>
						</el-table-column>
					</el-table-column>
				</el-table>
			</div>
		</el-card>
	</div>
</template>
<script>
import { get_settle } from '@/api/settlement/index';
import { Session } from '@/utils/storage';

export default {
	data() {
		return {
			loading: true,
			lists: [],
			dataList: [],
			time: [],
			StartDatetions: {
				disabledDate: (time) => {
					return time.getTime() + 86400000 > new Date();
				},
			},
			sum: [],
			flag: 0,
			warpWith: 155,
			With: 133,
			errorWidth: 0,
			tableWidth: 0,
			screenWidth: 0,
			timeWidth: 0,
		};
	},
	computed: {},
	filters: {
		filterStatus(item) {
			if (item.settlementAccountType === 'SUM') {
				return '';
			} else {
				if (item.settlementStatus) {
					return '已结算';
				} else {
					return '未结算';
				}
			}
		},
		filter(item) {
			switch (item) {
				case 'YJJY':
					return '一键加油';
				case 'SFDD':
					return '闪付订单';
				case 'CZDD':
					return '储值订单';
				case 'XYJY':
					return '小鹰加油';
				case 'WCC':
					return '喂车车';
				case 'TY':
					return '团油';
				case 'DD':
					return '滴滴';
				case 'PUB':
					return '银行卡';
				case 'PRI':
					return '虚拟账户';
				case 'ZJC':
					return '渠道服务';

				case 'SUM':
					return '合计';
				case 1:
					return '已结算';
				case 2:
					return '未结算';

				default:
					break;
			}
		},
	},
	created() {
		const t = new Date();
		t.setDate(t.getDate() - 1);
		this.time = [t.toISOString().split('T')[0], t.toISOString().split('T')[0]];
		this.list();
	},
	watch: {
		screenWidth: function (n, o) {
			this.tableWidth = this.$refs.table_inner.clientWidth;
			const width = Math.ceil(this.tableWidth / 12);
			this.With = width - 5;
			this.timeWidth = width + 50;
			this.errorWidth = this.tableWidth - width;
		},
	},
	mounted() {
		//获取屏幕尺寸
		this.screenWidth = document.body.clientWidth;
		window.onresize = () => {
			//屏幕尺寸变化
			return (() => {
				this.screenWidth = document.body.clientWidth;
			})();
		};
	},

	methods: {
		tableRowClassName({ row, rowIndex }) {
			if (row.settlementAccountType === 'SUM') {
				return 'warning-row';
			}
		},

		// 查询
		inquire() {
			this.loading = true;
			this.list();
		},
		list() {
			const data = {
				startDate: this.time[0] + ' 00:00:00',
				// startDate: '2022-06-01 00:00:00',
				endDate: this.time[1] + ' 23:59:59',
				// endDate: '2022-08-16 23:59:59',
				stationId: Session.get('enterpriseId'),
				merchantId: Session.get('merchantId'),
			};

			get_settle(data).then((res) => {
				if (res.code === '0') {
					let list = [];

					if (res.data.length === 0) {
						this.dataList = [];
						if (new Date(this.time[1]).getTime() - new Date(this.time[0]).getTime() > 0) {
							this.flag = 1;
							this.dataList.push({
								riqi: `${this.time[0]}  -  ${this.time[1]}`,
							});
						} else {
							this.flag = 0;
							this.dataList.push({
								riqi: `${this.time[0]}`,
							});
						}
						this.loading = false;
						return false;
					} else {
						this.sum = [res.data[res.data.length - 1].channelDate[0]];
						res.data.map((n) => {
							if (n.channelName === 'XYJY') {
								list.unshift(n);
							} else if (n.channelName === 'WCC') {
								list.unshift(n);
							} else if (n.channelName === 'DD') {
								if (n.channelDate[0].detailsList[0].solidKnotAmount === 0) {
								} else {
									list.push(n);
								}
							} else if (n.channelName === 'TY') {
								if (n.channelDate[0].detailsList[0].solidKnotAmount === 0) {
								} else {
									list.push(n);
								}
							}
						});
						this.lists = list;
						this.dataList = [];

						if (new Date(this.time[1]).getTime() - new Date(this.time[0]).getTime() > 0) {
							this.flag = 1;
							this.dataList.push({
								riqi: `${this.time[0]}  -  ${this.time[1]}`,
								lists: this.lists,
							});
						} else {
							this.flag = 0;
							this.dataList.push({
								riqi: `${this.time[0]}`,
								lists: this.lists,
							});
						}
						this.loading = false;
					}
				} else {
					this.$message.error(res.message);
					this.loading = false;
				}
			});
		},
	},
};
</script>
<style scoped lang="scss">
.card {
	.el-card {
		margin: 10px;
		border-radius: 8px;
		border-color: #e2e5ec;
	}
}
::v-deep .el-table__body {
	width: 100%;
	// 使表格兼容safari，不错位
	table-layout: fixed !important;
}
::v-deep {
	.vue-mergeable-table td {
		text-align: center !important;
	}
	.header {
		width: 60px;
	}
	.width {
		width: 50px;
	}
}
::v-deep .table .el-table__empty-block {
	display: none;
}
::v-deep .tableNexine .el-table .cell {
	padding: 0;
}
::v-deep .el-table .cell,
.el-table--border .el-table__cell:first-child .cell {
	padding: 0 !important;
}
::v-deep .warptable .el-table .el-table__cell {
	padding: 0;
}
// .activeCls {
// 	width: 1482px;
// }
// .errorCls {
// 	width: 1612px;
// }
.system-role-container ::v-deep .el-table .el-table__cell {
	padding: 0 !important;
}
::v-deep .el-table--scrollable-x .el-table__body-wrapper {
	overflow: hidden;
}
.el-table .warning-row {
	background: oldlace;
}

.el-table .success-row {
	background: #f0f9eb;
}
::v-deep .warning-row {
	background-color: #e4e4e4;
}
::v-deep .warning {
	background-color: red;
}
.colorBack ::v-deep .el-table tr {
	background: #e9f6ff;
}
.colorBack ::v-deep .el-table__cell {
	background: #e9f6ff;
}
</style>

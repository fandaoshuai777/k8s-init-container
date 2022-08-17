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

			<el-table class="table" border>
				<el-table-column prop="date" label="账单日期" align="center" width="155"> </el-table-column>
				<el-table-column label="渠道" width="132" align="center"> </el-table-column>
				<el-table-column label="	订单类型" width="132" align="center"> </el-table-column>
				<el-table-column label="	结算账户" width="132" align="center"> </el-table-column>
				<el-table-column label="	订单金额" width="132" align="center"> </el-table-column>
				<el-table-column label="	支付通道手续费" width="132" align="center"> </el-table-column>
				<el-table-column label="	平台服务费" width="132" align="center"> </el-table-column>
				<el-table-column label="	应结金额" width="132" align="center"> </el-table-column>
				<el-table-column label="	结算服务费" width="132" align="center"> </el-table-column>
				<el-table-column label="	采购折扣金额" width="132" align="center"> </el-table-column>
				<el-table-column label="	实结金额" width="132" align="center"> </el-table-column>
				<el-table-column label="	账单状态" width="132" align="center" v-if="flag === 0"> </el-table-column>
			</el-table>
			<el-table style="width: 100%" :data="dataList" :show-header="false" border class="warptable">
				<el-table-column prop="riqi" width="155" align="center">
					<el-table-column align="center" prop="riqi" width="155"></el-table-column>
					<el-table-column align="center" prop="lists">
						<template slot-scope="scopeDate">
							<el-table :show-header="false" :data="scopeDate.row.lists" class="warptable_inner">
								<el-table-column prop="channelName" width="132" align="center">
									<template slot-scope="scope">
										{{ scope.row.channelName | filter }}
									</template>
								</el-table-column>
								<el-table-column prop="orderType" align="center">
									<template slot-scope="channelData">
										<el-table :show-header="false" :data="channelData.row.channelDate" class="tableNexine">
											<el-table-column align="center" prop="orderType" width="132">
												<template slot-scope="scope">
													{{ scope.row.orderType | filter }}
												</template>
											</el-table-column>
											<el-table-column align="center" prop="orderType">
												<template slot-scope="orderData">
													<el-table :show-header="false" :data="orderData.row.detailsList">
														<el-table-column align="center" prop="settlementAccountType" width="132">
															<template slot-scope="scope">
																{{ scope.row.settlementAccountType | filter }}
															</template>
														</el-table-column>
														<el-table-column align="center" width="132" prop="orderAmount"></el-table-column>
														<el-table-column align="center" width="132" prop="channelPoundage"></el-table-column>
														<el-table-column align="center" width="132" prop="platformServiceFee"></el-table-column>
														<el-table-column align="center" width="132" prop="settlementAmount"></el-table-column>
														<el-table-column width="132" align="center" prop="settlementServiceFee"></el-table-column>
														<el-table-column align="center" width="132" prop="purchaseDiscountAmount"></el-table-column>
														<el-table-column width="132" align="center" prop="solidKnotAmount"></el-table-column>
														<el-table-column align="center" prop="settlementStatus" width="132" v-if="flag === 0">
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
			<el-table style="width: 100%" class="table" border :show-header="false" :data="sum" :span-method="arraySpanMethod">
				<el-table-column align="center" prop="settlementAccountType"> </el-table-column>
				<el-table-column align="center" prop="settlementAccountType"> </el-table-column>
				<el-table-column align="center" prop="settlementAccountType"> </el-table-column>
				<el-table-column align="center" prop="settlementAccountType"> </el-table-column>
				<el-table-column align="center" prop="orderAmount"></el-table-column>
				<el-table-column align="center" prop="channelPoundage"></el-table-column>
				<el-table-column align="center" prop="platformServiceFee"></el-table-column>
				<el-table-column align="center" prop="settlementAmount"></el-table-column>
				<el-table-column align="center" prop="settlementServiceFee"></el-table-column>
				<el-table-column align="center" prop="purchaseDiscountAmount"></el-table-column>
				<el-table-column align="center" prop="solidKnotAmount"></el-table-column>
				<el-table-column align="center" prop="settlementStatus" v-if="flag === 0"></el-table-column>
			</el-table>
		</el-card>
	</div>
</template>
<script>
import { get_settle } from '@/api/settlement/index';
import { Session } from '@/utils/storage';

export default {
	data() {
		return {
			loading: false,
			lists: [],
			dataList: [],
			time: [],
			StartDatetions: {
				disabledDate: (time) => {
					return time.getTime() + 86400000 > new Date();
				},
			},
			sum: [],
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
	methods: {
		// 查询
		inquire() {
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
				stationId: 1111130249,
				merchantId: 13529,
			};

			get_settle(data).then((res) => {
				if (res.code === '0') {
					this.sum = res.data[res.data.length - 1].channelDate[0].detailsList;

					this.lists = res.data.map((n) => {
						delete res.data[res.data.length - 1];
						return {
							...n,
						};
					});
					this.dataList = [];

					if (new Date(this.time[1]).getTime() - new Date(this.time[0]).getTime() > 86400000) {
						this.flag = 1;
						this.dataList.push({
							riqi: `${this.time[0]}- ${this.time[1]}`,
							lists: this.lists,
						});
					} else {
						this.flag = 0;
						this.dataList.push({
							riqi: `${this.time[0]}`,
							lists: this.lists,
						});
					}

					console.log(this.dataList);
				} else {
					this.$message.error(res.message);
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
</style>

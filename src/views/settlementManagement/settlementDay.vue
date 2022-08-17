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

			<vue-mergeable-table style="width: 100%" :options="options" />
			<vue-mergeable-table style="width: 100%" :options="renderOptions" />
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
			options: {
				cols: 12,
				rows: 1,
				data: [],
			},
			renderOptions: {
				cols: 12,
				rows: 14,
				data: [],
			},
			XYJY: [],
			WCC: [],
			DD: [],
			TY: [],
			SUM: [],
			tableData: [],
			time: [],
			StartDatetions: {
				disabledDate: (time) => {
					return time.getTime() + 86400000 > new Date();
				},
			},
		};
	},
	computed: {},

	created() {
		const t = new Date();
		t.setDate(t.getDate() - 1);
		this.time = [t.toISOString().split('T')[0], t.toISOString().split('T')[0]];

		this.list();
	},
	methods: {
		// 查询
		inquire() {
			this.renderOptions.data = [];
			this.options.data = [];

			this.list();
		},
		list() {
			const data = {
				startDate: this.time[0] + ' 00:00:00',
				endDate: this.time[1] + ' 23:59:59',
				// stationId: Session.get('enterpriseId'),
				stationId: Session.get('enterpriseId'),
				merchantId: Session.get('merchantId'),
			};

			get_settle(data).then((res) => {
				if (res.code === '0') {
					this.XYJY = res.data.XYJY;
					this.WCC = res.data.WCC;
					this.DD = res.data.DD;
					this.TY = res.data.TY;
					this.SUM = res.data.SUM;

					this.listData();
					this.headerData();
				} else {
					this.$message.error(res.message);
				}
			});
		},
		listData() {
			this.renderOptions = {
				cols: 12,
				rows: 15,
				data: [],
			};
			if (new Date(this.time[1]).getTime() - new Date(this.time[0]).getTime() > 86400000) {
				this.renderOptions = {
					cols: 11,
					rows: 15,
					data: [],
				};
				//表头
				this.renderOptions.data.push({
					content: `${this.time[0]} - ${this.time[1]}`,
					class: 'time',
					merge: { row: 0, col: 0, rowspan: 14, colspan: 1 },
				});
			} else {
				this.renderOptions = {
					cols: 12,
					rows: 15,
					data: [],
				};
				//表头
				this.renderOptions.data.push({
					content: `${this.time[0]}`,
					class: 'time',
					merge: { row: 0, col: 0, rowspan: 14, colspan: 1 },
				});
			}

			this.renderOptions.data.push({
				content: '小鹰加油',
				class: 'time',
				merge: { row: 0, col: 1, rowspan: 3, colspan: 1 },
			});

			this.renderOptions.data.push({
				content: '喂车车',
				class: 'time',
				merge: { row: 3, col: 1, rowspan: 9, colspan: 1 },
			});

			this.renderOptions.data.push({
				content: '滴滴',
				class: 'time',
				merge: { row: 12, col: 1, rowspan: 1, colspan: 1 },
			});
			this.renderOptions.data.push({
				content: '资金池',
				class: 'time',
				merge: { row: 12, col: 2, rowspan: 1, colspan: 1 },
			});
			this.renderOptions.data.push({
				content: '虚拟账户',
				class: 'time',
				merge: { row: 12, col: 3, rowspan: 1, colspan: 1 },
			});

			this.renderOptions.data.push({
				content: '团油',
				class: 'time',
				merge: { row: 13, col: 1, rowspan: 1, colspan: 1 },
			});
			this.renderOptions.data.push({
				content: '资金池',
				class: 'time',
				merge: { row: 13, col: 2, rowspan: 1, colspan: 1 },
			});
			this.renderOptions.data.push({
				content: '虚拟账户',
				class: 'time',
				merge: { row: 13, col: 3, rowspan: 1, colspan: 1 },
			});

			//订单类型
			this.renderOptions.data.push({
				content: '一键加油',
				class: 'time',
				merge: { row: 0, col: 2, rowspan: 2, colspan: 1 },
			});
			//银行卡
			this.renderOptions.data.push({
				content: '银行卡',
				class: 'time',
				merge: { row: 0, col: 3, rowspan: 1, colspan: 1 },
			});
			//虚拟账户
			this.renderOptions.data.push({
				content: '虚拟账户',
				class: 'time',
				merge: { row: 1, col: 3, rowspan: 1, colspan: 1 },
			});
			//合计
			this.renderOptions.data.push({
				content: '合计',
				class: 'time',
				merge: { row: 2, col: 2, rowspan: 1, colspan: 2 },
			});

			this.renderOptions.data.push({
				content: '一键加油',
				class: 'time',
				merge: { row: 3, col: 2, rowspan: 2, colspan: 1 },
			});
			//银行卡
			this.renderOptions.data.push({
				content: '银行卡',
				class: 'time',
				merge: { row: 3, col: 3, rowspan: 1, colspan: 1 },
			});
			//虚拟账户
			this.renderOptions.data.push({
				content: '虚拟账户',
				class: 'time',
				merge: { row: 4, col: 3, rowspan: 1, colspan: 1 },
			});
			//合计
			this.renderOptions.data.push({
				content: '合计',
				class: 'time',
				merge: { row: 5, col: 2, rowspan: 1, colspan: 2 },
			});

			this.renderOptions.data.push({
				content: '闪付订单',
				class: 'time',
				merge: { row: 6, col: 2, rowspan: 2, colspan: 1 },
			});
			//银行卡
			this.renderOptions.data.push({
				content: '银行卡',
				class: 'time',
				merge: { row: 6, col: 3, rowspan: 1, colspan: 1 },
			});
			//虚拟账户
			this.renderOptions.data.push({
				content: '虚拟账户',
				class: 'time',
				merge: { row: 7, col: 3, rowspan: 1, colspan: 1 },
			});
			//合计
			this.renderOptions.data.push({
				content: '合计',
				class: 'time',
				merge: { row: 8, col: 2, rowspan: 1, colspan: 2 },
			});

			this.renderOptions.data.push({
				content: '储值订单',
				class: 'time',
				merge: { row: 9, col: 2, rowspan: 2, colspan: 1 },
			});
			//银行卡
			this.renderOptions.data.push({
				content: '银行卡',
				class: 'time',
				merge: { row: 9, col: 3, rowspan: 1, colspan: 1 },
			});
			//虚拟账户
			this.renderOptions.data.push({
				content: '虚拟账户',
				class: 'time',
				merge: { row: 10, col: 3, rowspan: 1, colspan: 1 },
			});
			//合计

			this.renderOptions.data.push({
				content: '合计',
				class: 'time',
				merge: { row: 11, col: 2, rowspan: 1, colspan: 2 },
			});
			this.renderOptions.data.push({
				content: '总计',
				class: 'time',
				merge: { row: 14, col: 0, rowspan: 1, colspan: 4 },
			});
			//动态数据,从第4列开始渲染
			if (new Date(this.time[1]).getTime() - new Date(this.time[0]).getTime() > 86400000) {
				if (this.XYJY === undefined) {
				} else {
					this.XYJY.forEach((info, index) => {
						//订单金额
						this.renderOptions.data.push({
							content: info.orderAmount?.toString(),
							class: 'time',
							merge: { row: index, col: 4, rowspan: 1, colspan: 1 },
						});
						//支付通道手续费
						this.renderOptions.data.push({
							content: info.channelPoundage?.toString(),
							class: 'time',
							merge: { row: index, col: 5, rowspan: 1, colspan: 1 },
						});
						//平台服务费
						this.renderOptions.data.push({
							content: info.platformServiceFee?.toString(),
							class: 'time',
							merge: { row: index, col: 6, rowspan: 1, colspan: 1 },
						});
						//应结金额
						this.renderOptions.data.push({
							content: info.settlementAmount?.toString(),
							class: 'time',
							merge: { row: index, col: 7, rowspan: 1, colspan: 1 },
						});
						//资金池结算服务费
						this.renderOptions.data.push({
							content: info.settlementServiceFee?.toString(),
							class: 'time',
							merge: { row: index, col: 8, rowspan: 1, colspan: 1 },
						});
						//采购折扣金额
						this.renderOptions.data.push({
							content: info.purchaseDiscountAmount?.toString(),
							class: 'time',
							merge: { row: index, col: 9, rowspan: 1, colspan: 1 },
						});
						//实结金额
						this.renderOptions.data.push({
							content: info.solidKnotAmount?.toString(),
							class: 'time',
							merge: { row: index, col: 10, rowspan: 1, colspan: 1 },
						});
					});
				}
				if (this.WCC === undefined) {
				} else {
					this.WCC.forEach((info, index) => {
						//订单金额
						this.renderOptions.data.push({
							content: info.orderAmount?.toString(),
							class: 'time',
							merge: { row: index + 3, col: 4, rowspan: 1, colspan: 1 },
						});
						//支付通道手续费
						this.renderOptions.data.push({
							content: info.channelPoundage?.toString(),
							class: 'time',
							merge: { row: index + 3, col: 5, rowspan: 1, colspan: 1 },
						});
						//平台服务费
						this.renderOptions.data.push({
							content: info.platformServiceFee?.toString(),
							class: 'time',
							merge: { row: index + 3, col: 6, rowspan: 1, colspan: 1 },
						});
						//应结金额
						this.renderOptions.data.push({
							content: info.settlementAmount?.toString(),
							class: 'time',
							merge: { row: index + 3, col: 7, rowspan: 1, colspan: 1 },
						});
						//资金池结算服务费
						this.renderOptions.data.push({
							content: info.settlementServiceFee?.toString(),
							class: 'time',
							merge: { row: index + 3, col: 8, rowspan: 1, colspan: 1 },
						});
						//采购折扣金额
						this.renderOptions.data.push({
							content: info.purchaseDiscountAmount?.toString(),
							class: 'time',
							merge: { row: index + 3, col: 9, rowspan: 1, colspan: 1 },
						});
						//实结金额
						this.renderOptions.data.push({
							content: info.solidKnotAmount?.toString(),
							class: 'time',
							merge: { row: index + 3, col: 10, rowspan: 1, colspan: 1 },
						});
					});
				}
				if (this.DD === undefined) {
				} else {
					this.DD.forEach((info, index) => {
						//订单金额
						this.renderOptions.data.push({
							content: info.orderAmount?.toString(),
							class: 'time',
							merge: { row: index + 12, col: 4, rowspan: 1, colspan: 1 },
						});
						//支付通道手续费
						this.renderOptions.data.push({
							content: info.channelPoundage?.toString(),
							class: 'time',
							merge: { row: index + 12, col: 5, rowspan: 1, colspan: 1 },
						});
						//平台服务费
						this.renderOptions.data.push({
							content: info.platformServiceFee?.toString(),
							class: 'time',
							merge: { row: index + 12, col: 6, rowspan: 1, colspan: 1 },
						});
						//应结金额
						this.renderOptions.data.push({
							content: info.settlementAmount?.toString(),
							class: 'time',
							merge: { row: index + 12, col: 7, rowspan: 1, colspan: 1 },
						});
						//资金池结算服务费
						this.renderOptions.data.push({
							content: info.settlementServiceFee?.toString(),
							class: 'time',
							merge: { row: index + 12, col: 8, rowspan: 1, colspan: 1 },
						});
						//采购折扣金额
						this.renderOptions.data.push({
							content: info.purchaseDiscountAmount?.toString(),
							class: 'time',
							merge: { row: index + 12, col: 9, rowspan: 1, colspan: 1 },
						});
						//实结金额
						this.renderOptions.data.push({
							content: info.solidKnotAmount?.toString(),
							class: 'time',
							merge: { row: index + 12, col: 10, rowspan: 1, colspan: 1 },
						});
					});
				}
				if (this.TY === undefined) {
				} else {
					this.TY.forEach((info, index) => {
						//订单金额
						this.renderOptions.data.push({
							content: info.orderAmount?.toString(),
							class: 'time',
							merge: { row: index + 13, col: 4, rowspan: 1, colspan: 1 },
						});
						//支付通道手续费
						this.renderOptions.data.push({
							content: info.channelPoundage?.toString(),
							class: 'time',
							merge: { row: index + 13, col: 5, rowspan: 1, colspan: 1 },
						});
						//平台服务费
						this.renderOptions.data.push({
							content: info.platformServiceFee?.toString(),
							class: 'time',
							merge: { row: index + 13, col: 6, rowspan: 1, colspan: 1 },
						});
						//应结金额
						this.renderOptions.data.push({
							content: info.settlementAmount?.toString(),
							class: 'time',
							merge: { row: index + 13, col: 7, rowspan: 1, colspan: 1 },
						});
						//资金池结算服务费
						this.renderOptions.data.push({
							content: info.settlementServiceFee?.toString(),
							class: 'time',
							merge: { row: index + 13, col: 8, rowspan: 1, colspan: 1 },
						});
						//采购折扣金额
						this.renderOptions.data.push({
							content: info.purchaseDiscountAmount?.toString(),
							class: 'time',
							merge: { row: index + 13, col: 9, rowspan: 1, colspan: 1 },
						});
						//实结金额
						this.renderOptions.data.push({
							content: info.solidKnotAmount?.toString(),
							class: 'time',
							merge: { row: index + 13, col: 10, rowspan: 1, colspan: 1 },
						});
					});
				}
				if (this.SUM === undefined) {
				} else {
					this.SUM.forEach((info, index) => {
						//订单金额
						this.renderOptions.data.push({
							content: info.orderAmount == 0 ? '--' : '',
							class: 'time',
							merge: { row: index + 14, col: 4, rowspan: 1, colspan: 0 },
						});
						//支付通道手续费
						this.renderOptions.data.push({
							content: info.channelPoundage == 0 ? '--' : info.channelPoundage,
							class: 'time',
							merge: { row: index + 14, col: 5, rowspan: 1, colspan: 1 },
						});
						//平台服务费
						this.renderOptions.data.push({
							content: info.platformServiceFee == 0 ? '--' : info.platformServiceFee,
							class: 'time',
							merge: { row: index + 14, col: 6, rowspan: 1, colspan: 1 },
						});
						//应结金额
						this.renderOptions.data.push({
							content: info.settlementAmount == 0 ? '--' : info.settlementAmount,
							class: 'time',
							merge: { row: index + 14, col: 7, rowspan: 1, colspan: 1 },
						});
						//资金池结算服务费
						this.renderOptions.data.push({
							content: info.settlementServiceFee == 0 ? '--' : info.settlementServiceFee,
							class: 'time',
							merge: { row: index + 14, col: 8, rowspan: 1, colspan: 1 },
						});
						//采购折扣金额
						this.renderOptions.data.push({
							content: info.purchaseDiscountAmount == 0 ? '--' : info.purchaseDiscountAmount,
							class: 'time',
							merge: { row: index + 14, col: 9, rowspan: 1, colspan: 1 },
						});
						//实结金额
						this.renderOptions.data.push({
							content: info.solidKnotAmount == 0 ? '--' : info.solidKnotAmount,
							class: 'time',
							merge: { row: index + 14, col: 10, rowspan: 1, colspan: 1 },
						});
					});
				}
			} else {
				if (this.XYJY === undefined) {
				} else {
					this.XYJY.forEach((info, index) => {
						//订单金额
						this.renderOptions.data.push({
							content: info.orderAmount?.toString(),
							class: 'time',
							merge: { row: index, col: 4, rowspan: 1, colspan: 1 },
						});
						//支付通道手续费
						this.renderOptions.data.push({
							content: info.channelPoundage?.toString(),
							class: 'time',
							merge: { row: index, col: 5, rowspan: 1, colspan: 1 },
						});
						//平台服务费
						this.renderOptions.data.push({
							content: info.platformServiceFee?.toString(),
							class: 'time',
							merge: { row: index, col: 6, rowspan: 1, colspan: 1 },
						});
						//应结金额
						this.renderOptions.data.push({
							content: info.settlementAmount?.toString(),
							class: 'time',
							merge: { row: index, col: 7, rowspan: 1, colspan: 1 },
						});
						//资金池结算服务费
						this.renderOptions.data.push({
							content: info.settlementServiceFee?.toString(),
							class: 'time',
							merge: { row: index, col: 8, rowspan: 1, colspan: 1 },
						});
						//采购折扣金额
						this.renderOptions.data.push({
							content: info.purchaseDiscountAmount?.toString(),
							class: 'time',
							merge: { row: index, col: 9, rowspan: 1, colspan: 1 },
						});
						//实结金额
						this.renderOptions.data.push({
							content: info.solidKnotAmount?.toString(),
							class: 'time',
							merge: { row: index, col: 10, rowspan: 1, colspan: 1 },
						});
						console.log(info.settlementStatus);
						//结算状态
						this.renderOptions.data.push({
							content: info.settlementStatus === 1 ? '已结算' : info.settlementStatus === 0 ? '未结算' : info.settlementStatus,
							class: 'time',
							merge: { row: index, col: 11, rowspan: 1, colspan: 1 },
						});
					});
				}
				if (this.WCC === undefined) {
				} else {
					this.WCC.forEach((info, index) => {
						console.log(info.settlementStatus);

						//订单金额
						this.renderOptions.data.push({
							content: info.orderAmount?.toString(),
							class: 'time',
							merge: { row: index + 3, col: 4, rowspan: 1, colspan: 1 },
						});
						//支付通道手续费
						this.renderOptions.data.push({
							content: info.channelPoundage?.toString(),
							class: 'time',
							merge: { row: index + 3, col: 5, rowspan: 1, colspan: 1 },
						});
						//平台服务费
						this.renderOptions.data.push({
							content: info.platformServiceFee?.toString(),
							class: 'time',
							merge: { row: index + 3, col: 6, rowspan: 1, colspan: 1 },
						});
						//应结金额
						this.renderOptions.data.push({
							content: info.settlementAmount?.toString(),
							class: 'time',
							merge: { row: index + 3, col: 7, rowspan: 1, colspan: 1 },
						});
						//资金池结算服务费
						this.renderOptions.data.push({
							content: info.settlementServiceFee?.toString(),
							class: 'time',
							merge: { row: index + 3, col: 8, rowspan: 1, colspan: 1 },
						});
						//采购折扣金额
						this.renderOptions.data.push({
							content: info.purchaseDiscountAmount?.toString(),
							class: 'time',
							merge: { row: index + 3, col: 9, rowspan: 1, colspan: 1 },
						});
						//实结金额
						this.renderOptions.data.push({
							content: info.solidKnotAmount?.toString(),
							class: 'time',
							merge: { row: index + 3, col: 10, rowspan: 1, colspan: 1 },
						});
						//结算状态
						this.renderOptions.data.push({
							content: info.settlementStatus === 1 ? '已结算' : info.settlementStatus === 0 ? '未结算' : info.settlementStatus,
							class: 'time',
							merge: { row: index + 3, col: 11, rowspan: 1, colspan: 1 },
						});
					});
				}
				if (this.DD === undefined) {
				} else {
					this.DD.forEach((info, index) => {
						//订单金额
						this.renderOptions.data.push({
							content: info.orderAmount?.toString(),
							class: 'time',
							merge: { row: index + 12, col: 4, rowspan: 1, colspan: 1 },
						});
						//支付通道手续费
						this.renderOptions.data.push({
							content: info.channelPoundage?.toString(),
							class: 'time',
							merge: { row: index + 12, col: 5, rowspan: 1, colspan: 1 },
						});
						//平台服务费
						this.renderOptions.data.push({
							content: info.platformServiceFee?.toString(),
							class: 'time',
							merge: { row: index + 12, col: 6, rowspan: 1, colspan: 1 },
						});
						//应结金额
						this.renderOptions.data.push({
							content: info.settlementAmount?.toString(),
							class: 'time',
							merge: { row: index + 12, col: 7, rowspan: 1, colspan: 1 },
						});
						//资金池结算服务费
						this.renderOptions.data.push({
							content: info.settlementServiceFee?.toString(),
							class: 'time',
							merge: { row: index + 12, col: 8, rowspan: 1, colspan: 1 },
						});
						//采购折扣金额
						this.renderOptions.data.push({
							content: info.purchaseDiscountAmount?.toString(),
							class: 'time',
							merge: { row: index + 12, col: 9, rowspan: 1, colspan: 1 },
						});
						//实结金额
						this.renderOptions.data.push({
							content: info.solidKnotAmount?.toString(),
							class: 'time',
							merge: { row: index + 12, col: 10, rowspan: 1, colspan: 1 },
						});
						//结算状态
						this.renderOptions.data.push({
							content: info.settlementStatus === 1 ? '已结算' : info.settlementStatus === 0 ? '未结算' : info.settlementStatus,

							class: 'time',
							merge: { row: index + 12, col: 11, rowspan: 1, colspan: 1 },
						});
					});
				}
				if (this.TY === undefined) {
				} else {
					this.TY.forEach((info, index) => {
						//订单金额
						this.renderOptions.data.push({
							content: info.orderAmount?.toString(),
							class: 'time',
							merge: { row: index + 13, col: 4, rowspan: 1, colspan: 1 },
						});
						//支付通道手续费
						this.renderOptions.data.push({
							content: info.channelPoundage?.toString(),
							class: 'time',
							merge: { row: index + 13, col: 5, rowspan: 1, colspan: 1 },
						});
						//平台服务费
						this.renderOptions.data.push({
							content: info.platformServiceFee?.toString(),
							class: 'time',
							merge: { row: index + 13, col: 6, rowspan: 1, colspan: 1 },
						});
						//应结金额
						this.renderOptions.data.push({
							content: info.settlementAmount?.toString(),
							class: 'time',
							merge: { row: index + 13, col: 7, rowspan: 1, colspan: 1 },
						});
						//资金池结算服务费
						this.renderOptions.data.push({
							content: info.settlementServiceFee?.toString(),
							class: 'time',
							merge: { row: index + 13, col: 8, rowspan: 1, colspan: 1 },
						});
						//采购折扣金额
						this.renderOptions.data.push({
							content: info.purchaseDiscountAmount?.toString(),
							class: 'time',
							merge: { row: index + 13, col: 9, rowspan: 1, colspan: 1 },
						});
						//实结金额
						this.renderOptions.data.push({
							content: info.solidKnotAmount?.toString(),
							class: 'time',
							merge: { row: index + 13, col: 10, rowspan: 1, colspan: 1 },
						});
						//结算状态
						this.renderOptions.data.push({
							content: info.settlementStatus === 1 ? '已结算' : info.settlementStatus === 0 ? '未结算' : info.settlementStatus,

							class: 'time',
							merge: { row: index + 13, col: 11, rowspan: 1, colspan: 1 },
						});
					});
				}
				if (this.SUM === undefined) {
				} else {
					this.SUM.forEach((info, index) => {
						//订单金额
						this.renderOptions.data.push({
							content: info.orderAmount == 0 ? '--' : '--',
							class: 'time',
							merge: { row: index + 13, col: 4, rowspan: 1, colspan: 0 },
						});
						//支付通道手续费
						this.renderOptions.data.push({
							content: info.channelPoundage == 0 ? '--' : info.channelPoundage,
							class: 'time',
							merge: { row: index + 14, col: 5, rowspan: 1, colspan: 1 },
						});
						//平台服务费
						this.renderOptions.data.push({
							content: info.platformServiceFee == 0 ? '--' : info.platformServiceFee,
							class: 'time',
							merge: { row: index + 14, col: 6, rowspan: 1, colspan: 1 },
						});
						//应结金额
						this.renderOptions.data.push({
							content: info.settlementAmount == 0 ? '--' : info.settlementAmount,
							class: 'time',
							merge: { row: index + 14, col: 7, rowspan: 1, colspan: 1 },
						});
						//资金池结算服务费
						this.renderOptions.data.push({
							content: info.settlementServiceFee == 0 ? '--' : info.settlementServiceFee,
							class: 'time',
							merge: { row: index + 14, col: 8, rowspan: 1, colspan: 1 },
						});
						//采购折扣金额
						this.renderOptions.data.push({
							content: info.purchaseDiscountAmount == 0 ? '--' : info.purchaseDiscountAmount,
							class: 'time',
							merge: { row: index + 14, col: 9, rowspan: 1, colspan: 1 },
						});
						//实结金额
						this.renderOptions.data.push({
							content: info.solidKnotAmount == 0 ? '--' : info.solidKnotAmount,
							class: 'time',
							merge: { row: index + 14, col: 10, rowspan: 1, colspan: 1 },
						});
					});
				}
			}
			// let all_orderAmount = 6;
			// this.XYJY.at(-1).orderAmount + this.WCC.at(-1).orderAmount + this.DD.at(-1).orderAmount + this.TY.at(-1).orderAmount;
			// let all_channelPoundage = 5;
			// 	this.XYJY.at(-1).channelPoundage + this.WCC.at(-1).channelPoundage + this.DD.at(-1).channelPoundage + this.TY.at(-1).channelPoundage;

			// let all_platformServiceFee = 4;
			// 	this.XYJY.at(-1).platformServiceFee +
			// 	this.WCC.at(-1).platformServiceFee +
			// 	this.DD.at(-1).platformServiceFee +
			// 	this.TY.at(-1).platformServiceFee;

			// let all_settlementAmount = 3;
			// 	this.XYJY.at(-1).settlementAmount + this.WCC.at(-1).settlementAmount + this.DD.at(-1).settlementAmount + this.TY.at(-1).settlementAmount;

			// let all_settlementServiceFee = 2;
			// 	this.XYJY.at(-1).settlementServiceFee +
			// 	this.WCC.at(-1).settlementServiceFee +
			// 	this.DD.at(-1).settlementServiceFee +
			// 	this.TY.at(-1).settlementServiceFee;
			// let all_purchaseDiscountAmount =7
			// 	this.XYJY.at(-1).purchaseDiscountAmount +
			// 	this.WCC.at(-1).purchaseDiscountAmount +
			// 	this.DD.at(-1).purchaseDiscountAmount +
			// 	this.TY.at(-1).purchaseDiscountAmount;

			// let all_solidKnotAmount = 1;
			// 	this.XYJY.at(-1).solidKnotAmount + this.WCC.at(-1).solidKnotAmount + this.DD.at(-1).solidKnotAmount + this.TY.at(-1).solidKnotAmount; //总计行

			// //订单金额
			// this.renderOptions.data.push({
			// 	content: all_orderAmount?.toFixed(2),
			// 	class: 'time',
			// 	merge: { row: 14, col: 4, rowspan: 1, colspan: 1 },
			// });
			// // //支付通道手续费
			// this.renderOptions.data.push({
			// 	content: all_channelPoundage?.toFixed(2),
			// 	class: 'time',
			// 	merge: { row: 14, col: 5, rowspan: 1, colspan: 1 },
			// });
			// // //平台服务费
			// this.renderOptions.data.push({
			// 	content: all_platformServiceFee?.toFixed(2),
			// 	class: 'time',
			// 	merge: { row: 14, col: 6, rowspan: 1, colspan: 1 },
			// });
			// // //应结金额
			// this.renderOptions.data.push({
			// 	content: all_settlementAmount?.toFixed(2),
			// 	class: 'time',
			// 	merge: { row: 14, col: 7, rowspan: 1, colspan: 1 },
			// });
			// // //资金池结算服务费
			// this.renderOptions.data.push({
			// 	content: all_settlementServiceFee?.toFixed(2),
			// 	class: 'time',
			// 	merge: { row: 14, col: 8, rowspan: 1, colspan: 1 },
			// });
			// // //采购折扣金额
			// this.renderOptions.data.push({
			// 	content: all_purchaseDiscountAmount?.toFixed(2),
			// 	class: 'time',
			// 	merge: { row: 14, col: 9, rowspan: 1, colspan: 1 },
			// });
			// // //实结金额
			// this.renderOptions.data.push({
			// 	content: all_solidKnotAmount?.toFixed(2),
			// 	class: 'time',
			// 	merge: { row: 14, col: 10, rowspan: 1, colspan: 1 },
			// });
		},
		headerData() {
			if (new Date(this.time[1]).getTime() - new Date(this.time[0]).getTime() > 86400000) {
				this.options = {
					cols: 11,
					rows: 1,
					data: [],
				};
			} else {
				this.options = {
					cols: 12,
					rows: 1,
					data: [],
				};
			}
			if (new Date(this.time[1]).getTime() - new Date(this.time[0]).getTime() > 86400000) {
				this.options.data.push(
					{ content: '账单日期', class: 'times', merge: { row: 0, col: 0, rowspan: 1 } },
					{ content: '渠道', class: 'channel', merge: { row: 0, col: 1, rowspan: 1 } },
					{ content: '订单类型', class: 'type', merge: { row: 0, col: 2, rowspan: 1 } },
					{ content: '结算账户', class: 'user', merge: { row: 0, col: 3, rowspan: 1 } },
					{ content: '订单金额', class: 'money', merge: { row: 0, col: 4, rowspan: 1 } },
					{
						content: '支付通道手续费',
						class: 'service',
						merge: { row: 0, col: 5, rowspan: 1 },
					},
					{ content: '平台服务费', class: 'cover', merge: { row: 0, col: 6, rowspan: 1 } },
					{ content: '应结金额', class: 'adhib', merge: { row: 0, col: 7, rowspan: 1 } },
					{
						content: '资金池结算服务费',
						class: 'capital',
						merge: { row: 0, col: 8, rowspan: 1 },
					},
					{
						content: '采购折扣金额',
						class: 'purchase',
						merge: { row: 0, col: 9, rowspan: 1 },
					},
					{
						content: '实结金额',
						class: 'actualperf',
						merge: { row: 0, col: 10, rowspan: 1 },
					}
				);
			} else {
				this.options.data.push(
					{ content: '账单日期', class: 'times', merge: { row: 0, col: 0, rowspan: 1 } },
					{ content: '渠道', class: 'channel', merge: { row: 0, col: 1, rowspan: 1 } },
					{ content: '订单类型', class: 'type', merge: { row: 0, col: 2, rowspan: 1 } },
					{ content: '结算账户', class: 'user', merge: { row: 0, col: 3, rowspan: 1 } },
					{ content: '订单金额', class: 'money', merge: { row: 0, col: 4, rowspan: 1 } },
					{
						content: '支付通道手续费',
						class: 'service',
						merge: { row: 0, col: 5, rowspan: 1 },
					},
					{ content: '平台服务费', class: 'cover', merge: { row: 0, col: 6, rowspan: 1 } },
					{ content: '应结金额', class: 'adhib', merge: { row: 0, col: 7, rowspan: 1 } },
					{
						content: '资金池结算服务费',
						class: 'capital',
						merge: { row: 0, col: 8, rowspan: 1 },
					},
					{
						content: '采购折扣金额',
						class: 'purchase',
						merge: { row: 0, col: 9, rowspan: 1 },
					},
					{
						content: '实结金额',
						class: 'actualperf',
						merge: { row: 0, col: 10, rowspan: 1 },
					},
					{
						content: '账单状态',
						class: 'statu',
						merge: { row: 0, col: 11, rowspan: 1 },
					}
				);
			}
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

	.times {
		width: 50.5px;
	}
	.channel {
		width: 50.5px;
	}
	.type {
		width: 50.5px;
	}
	.user {
		width: 50.5px;
	}
	.money {
		width: 50.5px;
	}
	.service {
		width: 50.5px;
	}
	.cover {
		width: 50.5px;
	}
	.adhib {
		width: 50.5px;
	}
	.capital {
		width: 50.5px;
	}
	.purchase {
		width: 50.5px;
	}
	.actualperf {
		width: 50.5px;
	}
	.statu {
		width: 50.5px;
	}
}
</style>

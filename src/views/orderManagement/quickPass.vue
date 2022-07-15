<template>
	<div class="system-role-container">
		<el-card shadow="hover">
			<div>
				<el-form :model="formInline" label-width="95px" :inline="true" label-position="right">
					<el-form-item label="订单号">
						<el-input v-model="formInline.thirdOrderId" placeholder="请输入订单号" clearable></el-input>
					</el-form-item>
					<el-form-item label="手机号">
						<el-input v-model="formInline.userPhone" placeholder="请输入订单号" clearable></el-input>
					</el-form-item>
					<el-form-item label="支付方式">
						<el-select v-model="formInline.payType" placeholder="请选择">
							<el-option label="全部" value />
							<el-option label="微信支付" :value="1" />
							<el-option label="支付宝支付" :value="2" />
							<el-option label="油卡支付" :value="3" />
							<el-option label="余额支付" :value="4" />
							<el-option label="现金支付" :value="5" />
							<el-option label="银行卡支付" :value="6" />
							<el-option label="其他支付" :value="7" />
						</el-select>
					</el-form-item>
					<el-form-item label="订单渠道" prop="channelId">
						<el-select v-model="formInline.channelId" placeholder="请选择">
							<el-option label="全部" value />
							<el-option label="喂车车" :value="'2'" />
							<el-option label="小鹰加油" :value="'1'" />
						</el-select>
					</el-form-item>
					<el-form-item label="订单状态">
						<el-select v-model="formInline.orderStatus" placeholder="请选择">
							<el-option label="全部" value />
							<el-option label="待支付" :value="1" />
							<el-option label="支付中" :value="2" />
							<el-option label="支付取消" :value="3" />
							<el-option label="支付成功" :value="4" />
							<el-option label="支付失败" :value="5" />
							<el-option label="已退款" :value="6" />
						</el-select>
					</el-form-item>
					<el-form-item label="退款状态">
						<el-select v-model="formInline.refundStatus" placeholder="请选择">
							<el-option label="全部" value />
							<el-option label="未退款" :value="0" />
							<el-option label="退款中" :value="1" />
							<el-option label="退款待审核" :value="2" />
							<el-option label="退款审核成功" :value="3" />
							<el-option label="退款审核失败" :value="4" />
							<el-option label="退款成功" :value="5" />
							<el-option label="退款失败" :value="6" />
						</el-select>
					</el-form-item>
					<el-form-item label="创建时间">
						<el-date-picker
							v-model="time"
							type="datetimerange"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							:default-time="['00:00:00', '23:59:59']"
							value-format="yyyy-MM-dd HH:mm:ss"
						>
						</el-date-picker>
					</el-form-item>

					<el-form-item>
						<el-button @click="reset">重置</el-button>
						<el-button type="primary" @click="inquire">查询</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div style="margin-left: 15px">
				<el-button type="primary" @click="today(1)">今日</el-button>
				<el-button type="primary" @click="today(2)">昨日</el-button>
				<el-button type="primary" @click="today(7)">近7日</el-button>
			</div>
			<el-row class="card" :gutter="12" style="margin: 20px 0">
				<el-col :span="4" style="width: 180px">
					<el-card shadow="always">
						<div>{{ statistics.rmbTotalAmount }}</div>
						<div>订单金额（元）</div>
					</el-card>
				</el-col>
				<el-col :span="4" style="width: 180px">
					<el-card shadow="always">
						<div>{{ statistics.rmbPayactualAmount }}</div>
						<div>实付金额（元）</div>
					</el-card>
				</el-col>
				<el-col :span="4" style="width: 180px">
					<el-card shadow="always">
						<div>{{ statistics.orderQuantity }}</div>
						<div>订单数量（单）</div>
					</el-card>
				</el-col>
			</el-row>
			<Table
				:loading="loading"
				:colums="colums"
				:data="tableData"
				:pagination-option="paginationOption"
				@currentChange="paginationChange"
				@sizeChange="pageSizeChange"
			>
				<template v-slot:done="{ row }">
					<el-button type="text" @click="particulars(row)">订单详情</el-button>
				</template>
			</Table>
		</el-card>
		<Dialog
			:title="assignDialog.title"
			:width="assignDialog.width"
			:visible="assignDialog.visible"
			:display="assignDialog.display"
			@onClone="assignClose"
		>
			<div slot="content" style="width: 98%">
				<el-descriptions class="margin-top" title="油站信息" :column="2" size="medium" border :contentStyle="{ 'min-width': '290px' }">
					<el-descriptions-item>
						<template slot="label"> 油站名称 </template>
						{{ payData.merchantName }}
					</el-descriptions-item>
				</el-descriptions>
				<el-descriptions class="margin-top" title="渠道信息" :column="1" size="medium" border :contentStyle="{ 'min-width': '290px' }">
					<el-descriptions-item>
						<template slot="label"> 订单渠道 </template>
						{{ payData.channelId === 1 ? '小鹰加油' : payData.channelId === 2 ? '喂车车' : payData.channelId }}
					</el-descriptions-item>
				</el-descriptions>
				<el-descriptions class="margin-top" title="用户信息" :column="1" size="medium" border :contentStyle="{ 'min-width': '230px' }">
					<el-descriptions-item>
						<template slot="label"> 用户ID </template>
						{{ payData.userPhone }}
					</el-descriptions-item>
				</el-descriptions>
				<el-descriptions class="margin-top" title="订单信息" :column="2" size="medium" border>
					<el-descriptions-item>
						<template slot="label"> 订单号 </template>
						{{ payData.id }}
					</el-descriptions-item>
					<el-descriptions-item>
						<template slot="label"> 渠道订单号 </template>
						{{ payData.thirdOrderId }}
					</el-descriptions-item>
					<el-descriptions-item>
						<template slot="label"> 订单金额 </template>
						{{ payData.rmbTotalAmount }}
					</el-descriptions-item>
					<el-descriptions-item>
						<template slot="label"> 优惠金额 </template>
						{{ payData.rmbDiscountAmount }}
					</el-descriptions-item>
					<el-descriptions-item>
						<template slot="label"> 实付金额 </template>
						{{ payData.rmbPayactualAmount }}
					</el-descriptions-item>
					<el-descriptions-item>
						<template slot="label"> 订单状态 </template>
						{{
							payData.orderStatus == 1
								? '待支付'
								: payData.orderStatus == 2
								? '支付中'
								: payData.orderStatus == 3
								? '支付取消'
								: payData.orderStatus == 4
								? '支付成功'
								: payData.orderStatus == 5
								? '支付失败'
								: payData.orderStatus == 6
								? '已退款'
								: payData.orderStatus
						}}
					</el-descriptions-item>
					<el-descriptions-item>
						<template slot="label"> 支付方式 </template>
						{{
							payData.payType == 1
								? '微信支付'
								: payData.payType == 2
								? '支付宝支付'
								: payData.payType == 3
								? '油卡支付'
								: payData.payType == 4
								? '余额支付'
								: payData.payType == 5
								? '现金支付'
								: payData.payType == 6
								? '银行卡支付'
								: payData.payType == 7
								? '其他支付'
								: payData.payType
						}}
					</el-descriptions-item>
					<el-descriptions-item>
						<template slot="label"> 创建时间 </template>
						{{ payData.createOrderTime    }}
					</el-descriptions-item>
					<el-descriptions-item>
						<template slot="label"> 支付时间 </template>
						{{ payData.paySuccessTime }}
					</el-descriptions-item>
				</el-descriptions>
				<el-descriptions class="margin-top" title="退款信息" :column="2" size="medium" border>
					<el-descriptions-item>
						<template slot="label"> 退款金额 </template>
						{{ payData.rmbRefundAmount }}
					</el-descriptions-item>
					<el-descriptions-item>
						<template slot="label"> 退款状态 </template>
						{{
							payData.refundStatus == 1
								? '退款中'
								: payData.refundStatus == 2
								? '退款待审核'
								: payData.refundStatus == 3
								? '退款审核成功'
								: payData.refundStatus == 4
								? '退款审核失败'
								: payData.refundStatus == 5
								? '退款成功'
								: payData.refundStatus == 6
								? '退款失败'
								: payData.refundStatus
						}}
					</el-descriptions-item>
					<el-descriptions-item>
						<template slot="label"> 退款申请时间 </template>
						{{ payData.createRefundTime }}
					</el-descriptions-item>
					<el-descriptions-item>
						<template slot="label"> 退款完成时间 </template>
						{{ payData.refundSuccessTime }}
					</el-descriptions-item>
				</el-descriptions>
				<el-descriptions class="margin-top" title="开票信息" :column="1" size="medium" border :contentStyle="{ 'min-width': '270px' }">
					<el-descriptions-item>
						<template slot="label"> 开票情况 </template>
						{{ payData.isInvoiced == 1 ? '已开票' : '未开票' }}
					</el-descriptions-item>
				</el-descriptions>
			</div>
		</Dialog>
	</div>
</template>
<script>
import Table from '@/components/table/index_detail';
import Dialog from '@/components/system/SysDialog';
import { quickPassOrderList, quickPassOrderCount, oneClickOrderDetails } from '@/api/oil/quickPass';
export default {
	components: {
		Table,
		Dialog,
	},
	data() {
		return {
			// table
			loading: false,
			tableData: [],
			colums: [
				{
					label: '油站名称',
					prop: 'merchantName',
					width: 150,
				},
				{
					label: '订单号',
					prop: 'thirdOrderId',
					width: 100,
				},
				{
					label: '订单金额',
					prop: 'rmbTotalAmount',
					width: 100,
				},
				{
					label: '优惠金额',
					prop: 'rmbDiscountAmount',
				},
				{
					label: '实付金额',
					prop: 'rmbPayactualAmount',
					width: 140,
				},
				{
					label: '订单渠道',
					prop: 'channelName',
					width: 120,
				},
				{
					label: '订单状态',
					prop: 'orderStatus',
					width: 90,
				},
				{
					label: '退款状态',
					prop: 'refundStatus',
					width: 170,
				},
				{
					label: '创建时间',
					prop: 'createOrderTime',
				},
				{
					label: '支付时间',
					prop: 'paySuccessTime',
					width: 130,
				},
				{
					label: '操作',
					prop: 'done',
					width: 300,
					fixed: 'right',
				},
			],
			pagination: {
				pageSize: 10,
				currPage: 1,
			},
			total: 0,
			// form
			formInline: {
				channelId: null,
				endTime: null,
				orderStatus: null,
				payType: null,
				refundStatus: null,
				startTime: null,
				thirdOrderId: null,
				userPhone: null,
				merchantId: sessionStorage.getItem('merchantId'),
			},
			time: [],
			// dialog
			// 设置弹窗组件所需数据
			assignDialog: {
				title: '订单详情',
				width: 900,
				height: 750,
				visible: false,
				display: false,
			},

			payData: [],
			statistics: [],
		};
	},
	computed: {
		paginationOption: function () {
			return { ...this.pagination, total: this.total };
		},
	},
	created() {
		const t = new Date();
		t.setDate(t.getDate() - 0);
		this.time = [t.toISOString().split('T')[0] + ' 00:00:00', t.toISOString().split('T')[0] + ' 23:59:59'];
	},
	mounted() {
		this.orderList();
		this.orderStatistics();
	},
	methods: {
		// 闪付订单列表
		orderList() {
			if (this.time) {
				this.formInline.endTime = this.time[1];
				this.formInline.startTime = this.time[0];
			} else {
				this.formInline.endTime = null;
				this.formInline.startTime = null;
			}
			const data = {
				...this.formInline,
				pageNo: this.pagination.currPage,
				pageSize: this.pagination.pageSize,
			};
			quickPassOrderList(data).then((res) => {
				this.total = Number(res.data.total);
				this.tableData = res.data.list.map((n) => {
					return {
						...n,
						orderStatus:
							n.orderStatus === 1
								? '待支付'
								: n.orderStatus === 2
								? '支付中'
								: n.orderStatus === 3
								? '支付取消'
								: n.orderStatus === 4
								? '支付成功'
								: n.orderStatus === 5
								? '支付失败'
								: n.orderStatus === 6
								? '已退款'
								: n.orderStatus,
						refundStatus:
							n.refundStatus === 0
								? '未退款'
								: n.refundStatus === 1
								? '退款中'
								: n.refundStatus === 2
								? '退款待审核'
								: n.refundStatus === 3
								? '退款审核成功'
								: n.refundStatus === 4
								? '退款审核失败'
								: n.refundStatus === 5
								? '退款成功'
								: n.refundStatus === 6
								? '退款失败'
								: n.refundStatus,
					};
				});
				console.log(res);
			});
		},
		// 统计
		orderStatistics() {
			const data = {
				...this.formInline,
			};
			quickPassOrderCount(data).then((res) => {
				this.statistics = res.data;
			});
		},
		// 页码变化
		paginationChange(value) {
			this.pagination.currPage = value.current;
			this.loading = false;
			this.orderList();
		},
		// 页数变化
		pageSizeChange(value) {
			this.pagination.pageSize = value.size;
			this.pagination.currPage = 1;
			this.loading = false;
			this.orderList();
		},
		// 查询
		inquire() {
			this.orderList();
			this.orderStatistics();
		},
		// 详情
		particulars(row) {
			this.assignDialog.visible = true;
			const data = {
				id: row.id,
			};
			oneClickOrderDetails(data).then((res) => {
				this.payData = res.data;
			});
		},
		// 补打
		reprint() {},
		// 重置
		reset() {
			this.formInline = {
				channelId: null,
				endTime: null,
				orderStatus: null,
				payType: null,
				refundStatus: null,
				startTime: null,
				thirdOrderId: null,
				userPhone: null,
				merchantId: sessionStorage.getItem('merchantId'),
			};
			this.time = [];
		},
		// 弹窗关闭
		assignClose() {
			this.assignDialog.visible = false;
		},
		today(day) {
			if (day === 1) {
				this.day(0);
			} else if (day === 2) {
				this.day(1);
			} else if (day === 7) {
				this.day(7);
			}
		},
		day(day) {
			if (day === 7) {
				const end = new Date();
				end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
				const t = new Date();
				t.setDate(t.getDate() - day);
				this.time = [t.toISOString().split('T')[0] + ' 00:00:00', this.formatDate(end) + ' 23:59:59'];
			} else {
				const t = new Date();
				t.setDate(t.getDate() - day);
				this.time = [t.toISOString().split('T')[0] + ' 00:00:00', t.toISOString().split('T')[0] + ' 23:59:59'];
			}
			this.orderList();
			this.orderStatistics();
		},
		/**
		 * 格式化时间
		 */
		formatDate(date) {
			var myyear = date.getFullYear();
			var mymonth = date.getMonth() + 1;
			var myweekday = date.getDate();

			if (mymonth < 10) {
				mymonth = '0' + mymonth;
			}
			if (myweekday < 10) {
				myweekday = '0' + myweekday;
			}
			return myyear + '-' + mymonth + '-' + myweekday;
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
.margin-top {
	margin-top: 25px;
}
</style>

<template>
	<div>
		<el-card shadow="hover">
			<el-form :model="formInline" label-width="95px" :inline="true" label-position="right" ref="reset" size="small">
				<el-form-item label="手机号:">
					<el-input v-model="formInline.driverTel" placeholder="请输入手机号" clearable> </el-input>
				</el-form-item>
				<el-form-item label="油品型号:">
					<el-select v-model="formInline.oilType" placeholder="请选择" clearable>
						<el-option label="全部" value />
						<el-option label="0#" value="0#" />
						<el-option label="-10#" value="-10#" />
						<el-option label="92#" value="92#" />
						<el-option label="95#" value="95#" />
						<el-option label="98#" value="98#" />
						<el-option label="101#" value="101#" />
						<el-option label="CNG" value="CNG" />
						<el-option label="LNG" value="LNG" />
					</el-select>
				</el-form-item>
				<el-form-item label="订单号:">
					<el-input v-model="formInline.orderNo" placeholder="请输入订单号" clearable> </el-input>
				</el-form-item>
				<el-form-item label="退款状态:">
					<el-select v-model="formInline.paymentStatus" placeholder="请选择" clearable>
						<el-option label="全部" value />
						<el-option label="退款成功" :value="2" />
						<el-option label="退款中" :value="10" />
						<el-option label="退款失败" :value="11" />
						<el-option label="退款审核中" :value="4" />
						<el-option label="退款审核失败" :value="5" />
					</el-select>
				</el-form-item>
				<el-form-item label="创建时间">
					<el-date-picker
						v-model="establishTime"
						type="datetimerange"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						:default-time="['00:00:00', '23:59:59']"
						value-format="yyyy-MM-dd HH:mm:ss"
					>
					</el-date-picker>
				</el-form-item>
				<el-form-item label="支付时间">
					<el-date-picker
						v-model="payTime"
						type="datetimerange"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						:default-time="['00:00:00', '23:59:59']"
						value-format="yyyy-MM-dd HH:mm:ss"
					>
					</el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="inquire">查询</el-button>
				</el-form-item>
			</el-form>
			<div style="margin-left: 15px; margin-bottom: 10px">
				<el-button @click="report" :disabled="displayed" size="small"
					><span>{{ displayed ? num + 's' : '导出' }}</span></el-button
				>
			</div>
			<Table
				:loading="loading"
				:colums="colums"
				:data="tableData"
				:pagination-option="paginationOption"
				@currentChange="paginationChange"
				@sizeChange="pageSizeChange"
			>
				<template v-slot:paymentStatus="{ row }">
					<span v-if="row.paymentStatus == 2">退款成功</span>
					<span v-else-if="row.paymentStatus == 4">退款审核中</span>
					<span v-else-if="row.paymentStatus == 5">退款审核失败</span>
					<span v-else-if="row.paymentStatus == 10">退款中</span>
					<span v-else-if="row.paymentStatus == 11">退款失败</span>
					<span v-else="row.paymentStatus">-</span>
				</template>
				<template v-slot:done="{ row }">
					<el-button type="text" @click="pass(row)">通过</el-button>
					<el-button style="color: red" type="text" @click="refuse(row)">拒绝</el-button>
				</template>
			</Table>
		</el-card>
	</div>
</template>
<script>
import Table from '@/components/table/index_detail';
import { list, refundOrder, rejectedRefundOrder, exportRefundOrder } from '@/api/oil/refund';
export default {
	components: {
		Table,
	},
	data() {
		return {
			displayed: false,

			formInline: {
				driverTel: '',
				oilType: '',
				orderNo: '',
				paymentStatus: '',
				endPayTime: '',
				startPayTime: '',
				startOrderTime: '',
				endOrderTime: '',
			},
			loading: false,
			tableData: [],
			colums: [
				{
					label: '订单编号',
					prop: 'orderNo',
				},
				{
					label: '司机手机号',
					prop: 'driverTel',
				},
				{
					label: '枪号',
					prop: 'oilGunNo',
				},
				{
					label: '油品类型',
					prop: 'oilType',
				},
				{
					label: '订单金额',
					prop: 'totlePrice',
				},
				{
					label: '实付金额',
					prop: 'driverTotal',
				},
				{
					label: '加油量',
					prop: 'fuelVolume',
				},
				{
					label: '支付方式',
					prop: 'paymentMode',
				},
				{
					label: '退款状态',
					prop: 'paymentStatus',
				},
				{
					label: '创建时间',
					prop: 'orderTime',
				},
				{
					label: '支付时间',
					prop: 'paymentTime',
				},
				{
					label: '操作',
					prop: 'done',
					fixed: 'right',
					width: 150,
				},
			],
			establishTime: [],
			payTime: [],
			pagination: {
				pageSize: 10,
				currPage: 1,
			},
			total: 0,
	
		};
	},
	created() {
		const t = new Date();
		t.setDate(t.getDate() - 0);
		this.establishTime = [t.toISOString().split('T')[0] + ' 00:00:00', t.toISOString().split('T')[0] + ' 23:59:59'];
		this.formInline.startOrderTime = this.establishTime[0];
		this.formInline.endOrderTime = this.establishTime[1];
	},
	computed: {
		paginationOption: function () {
			return { ...this.pagination, total: this.total };
		},
	},
	mounted() {
		this.inquire();
	},
	methods: {
		// 查询
		inquire() {

				this.pagination.currPage = 1;
				this.loading = true;
				this.downloadList();
		},
		report() {
			if (this.establishTime == null || this.establishTime.length === 0) {
				this.$message.error('时间不能为空,范围62天');
				return false;
			} else {
				var vm = this;
				vm.displayed = true;
				// 控制倒计时及按钮是否可以点击
				const TIME_COUNT = 60;
				vm.num = TIME_COUNT;
				const obj = {
					...this.formInline,
					merchantId: sessionStorage.getItem('merchantId'),
					stationId: sessionStorage.getItem('enterpriseId'),
					userName: JSON.parse(sessionStorage.getItem('loginUser')).userName,
					userId: JSON.parse(sessionStorage.getItem('loginUser')).userId,
				};
				exportRefundOrder(obj).then((res) => {
					if (res.code === '0') {
						this.$message.success('导出成功,请到下载中心 下载');
					} else {
						this.$message.error('导出失败');
					}
				});
				clearInterval(vm.timer);
				vm.timer = window.setInterval(() => {
					if (vm.num > 0 && vm.num <= TIME_COUNT) {
						// 倒计时时不可点击
						vm.displayed = true;
						// 计时秒数
						vm.num--;
						// 更新按钮的文字内容
					} else {
						vm.displayed = false;
					}
				}, 1000);
			}
		},
		// 拒绝
		refuse(row) {
			this.$confirm('确认审核拒绝', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this.reject(row.orderNo);
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消',
					});
				});
		},
		reject(orderNo) {
			rejectedRefundOrder({ orderNo: orderNo }).then((res) => {
				if (res.code === '0') {
					this.$message.success(res.result);
					this.downloadList();
				} else {
					this.$message.error(res.msg);
					this.downloadList();
				}
			});
		},
		// 通过
		pass(row) {
			this.$confirm('确认审核通过?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this.transit(row.orderNo);
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消',
					});
				});
		},
		transit(orderNo) {
			refundOrder({ orderNo: orderNo })
				.then((res) => {
					if (res.code === '0') {
						this.$message.success(res.result);
						this.downloadList();
					} else {
						this.$message.error(res.msg);
						this.downloadList();
					}
				})
				.finally(() => {
					this.downloadList();
				});
		},
		// 列表
		downloadList() {
			this.loading = true;
			if (this.establishTime) {
				this.formInline.startOrderTime = this.establishTime[0];
				this.formInline.endOrderTime = this.establishTime[1];
			} else {
				this.formInline.startOrderTime = '';
				this.formInline.endOrderTime = '';
			}
			if (this.payTime) {
				this.formInline.startPayTime = this.payTime[0];
				this.formInline.endPayTime = this.payTime[1];
			} else {
				this.formInline.startPayTime = '';
				this.formInline.endPayTime = '';
			}
			const data = { ...this.formInline, pageNum: this.pagination.currPage, pageSize: this.pagination.pageSize };

			list(data).then((res) => {
				if (res.code === '0') {
					this.tableData = res.result.oilOrderPage.map((n) => {
						return {
							...n,
							paymentMode: n.paymentMode == 1 ? '主动支付' : n.paymentMode == 2 ? '二维码支付' : n.paymentMode,
						};
					});
					this.total = res.result.totalNum;
					this.loading = false;
				}
			});
		},
		// 页码变化
		paginationChange(value) {
			this.pagination.currPage = value.current;
			this.loading = true;
			this.downloadList();
		},
		// 页数变化
		pageSizeChange(value) {
			this.pagination.pageSize = value.size;
			this.pagination.currPage = 1;
			this.loading = true;
			this.downloadList();
		},
	},
};
</script>

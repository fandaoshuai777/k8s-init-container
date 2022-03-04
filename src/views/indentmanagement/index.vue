<template>
	<div class="system-role-container">
		<el-card shadow="hover">
			<div class="system-user-search">
				<el-form :model="formInline" class="demo-form-inline">
					<div class="header">
						<el-form-item label="订单号">
							<el-input v-model="formInline.orderNo" placeholder="请输入订单号"></el-input>
						</el-form-item>
						<el-form-item label="手机号">
							<el-input v-model="formInline.driverTel" placeholder="请输入手机号"></el-input>
						</el-form-item>
						<el-form-item label="油号">
							<el-select v-model="formInline.oilType">
								<el-option label="全部" value=""></el-option>
								<el-option label="95#" value="95#"></el-option>
								<el-option label="92#" value="92#"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="订单状态">
							<el-select v-model="formInline.orderStatus">
								<el-option v-for="(item, index) in options" :key="index" :label="item.label" :value="item.label"></el-option>
							</el-select>
						</el-form-item>
					</div>
					<div class="header-buttom">
						<el-form-item label="支付时间">
							<el-date-picker
								v-model="formInline.timePayment"
								type="datetimerange"
								start-placeholder="开始日期"
								end-placeholder="结束日期"
								:default-time="['12:00:00']"
							>
							</el-date-picker>
						</el-form-item>
						<el-form-item label="油站">
							<el-select v-model="formInline.stationName">
								<el-option v-for="(item, index) in options" :key="index" :label="item.label" :value="item.label"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item>
							<div class="right">
								<el-button type="primary" @click="inquire">查询</el-button>
							</div>
						</el-form-item>
					</div>
				</el-form>
			</div>
			<div class="center">交易总金额：{} 订单数量：{}总升数：{}</div>
			<el-table style="width: 100%" :data="tableData" border>
				<el-table-column prop="orderNo" label="订单号" align="center" />
				<el-table-column prop="paymentStatus" label="订单状态" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="orderTime" label="下单时间" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="paymentTime" label="支付时间" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="stationName" label="所属油站" show-overflow-tooltip align="center" />
				<el-table-column prop="thumbnail" label="订单油机金额(元)" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="oilType" label="油号" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="oilGunNo" label="枪号" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="fuelVolume" label="升数(L)" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="driverTel" label="用户手机号" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column label="操作" width="200" align="center">
					<template #default="scope">
						<el-button size="small" type="text" @click="onOpenEditRole(scope.row)">查看</el-button>
						<el-button size="small" type="text" @click="onRowDel(scope.row)">发起退款</el-button>
						<el-button size="small" type="text" @click="receipt(scope.row)">补打小票</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="righ">
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
		<el-dialog title="订单详情" :visible.sync="compile" :close-on-click-modal="false" @close="close" custom-class="customWidth">
			<el-row :gutter="20" align="center">
				<el-col :span="6" style="text-algin: center"><div class="grid-content bg-purple">订单号</div></el-col>
				<el-col :span="6"
					><div class="grid-content bg-purple">{{ orderData.orderNo }}</div></el-col
				>
				<el-col :span="6"><div class="grid-content bg-purple">订单来源</div></el-col>
				<el-col :span="6"
					><div class="grid-content bg-purple">{{ orderData.stationName }}</div></el-col
				>
				<el-col :span="6" style="text-algin: center"><div class="grid-content bg-purple">下单时间</div></el-col>
				<el-col :span="6"
					><div class="grid-content bg-purple">{{ orderData.orderNo }}</div></el-col
				>
				<el-col :span="6"><div class="grid-content bg-purple">支付时间</div></el-col>
				<el-col :span="6"
					><div class="grid-content bg-purple">{{ orderData.stationName }}</div></el-col
				>
				<el-col :span="6" style="text-algin: center"><div class="grid-content bg-purple">订单状态</div></el-col>
				<el-col :span="6"
					><div class="grid-content bg-purple">{{ orderData.orderNo }}</div></el-col
				>
				<el-col :span="6"><div class="grid-content bg-purple">123</div></el-col>
				<el-col :span="6"
					><div class="grid-content bg-purple">{{ orderData.stationName }}</div></el-col
				>
				<el-col :span="6" style="text-algin: center"><div class="grid-content bg-purple">所属油站</div></el-col>
				<el-col :span="6"
					><div class="grid-content bg-purple">{{ orderData.orderNo }}</div></el-col
				>
				<el-col :span="6"><div class="grid-content bg-purple">123</div></el-col>
				<el-col :span="6"
					><div class="grid-content bg-purple">{{ orderData.stationName }}</div></el-col
				>
				<el-col :span="6" style="text-algin: center"><div class="grid-content bg-purple">退款时间</div></el-col>
				<el-col :span="6"
					><div class="grid-content bg-purple">{{ orderData.orderNo }}</div></el-col
				>
				<el-col :span="6"><div class="grid-content bg-purple">退款原因</div></el-col>
				<el-col :span="6"
					><div class="grid-content bg-purple">{{ orderData.stationName }}</div></el-col
				>
				<el-col :span="6"><div class="grid-content bg-purple">拒绝退款原因</div></el-col>
				<el-col :span="6"
					><div class="grid-content bg-purple">{{ orderData.stationName }}</div></el-col
				>
				<el-col :span="6"><div class="grid-content bg-purple">123</div></el-col>
				<el-col :span="6"
					><div class="grid-content bg-purple">{{ orderData.stationName }}</div></el-col
				>
				<el-col :span="6"><div class="grid-content bg-purple">油品</div></el-col>
				<el-col :span="6"
					><div class="grid-content bg-purple">{{ orderData.stationName }}</div></el-col
				>
				<el-col :span="6"><div class="grid-content bg-purple">油枪</div></el-col>
				<el-col :span="6"
					><div class="grid-content bg-purple">{{ orderData.stationName }}</div></el-col
				>
				<el-col :span="6"><div class="grid-content bg-purple">加油量</div></el-col>
				<el-col :span="6"
					><div class="grid-content bg-purple">{{ orderData.stationName }}</div></el-col
				>
				<el-col :span="6"><div class="grid-content bg-purple">订单油机金额</div></el-col>
				<el-col :span="6"
					><div class="grid-content bg-purple">{{ orderData.stationName }}</div></el-col
				>
				<el-col :span="6"><div class="grid-content bg-purple">序列号(撬装)</div></el-col>
				<el-col :span="6"
					><div class="grid-content bg-purple">{{ orderData.stationName }}</div></el-col
				>
				<el-col :span="6"><div class="grid-content bg-purple">123</div></el-col>
				<el-col :span="6"
					><div class="grid-content bg-purple">{{ orderData.stationName }}</div></el-col
				>
			</el-row>
		</el-dialog>
		<el-dialog title="退款" :visible.sync="refund" :close-on-click-modal="false" @close="close">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="退款原因" prop="region">
					<el-select v-model="ruleForm.region" style="width: 100%">
						<el-option label="错付油站" value="3"></el-option>
						<el-option label="错付金额" value="2"></el-option>
						<el-option label="付款未加油" value="1"></el-option>
						<el-option label="其他" value="0"></el-option>
					</el-select>
				</el-form-item>

				<el-form-item prop="name" :required="isHaveTo">
					<el-input type="textarea" placeholder="请输入内容" v-model="ruleForm.name" maxlength="20" show-word-limit resize="none" :rows="6">
					</el-input>
				</el-form-item>
				<el-form-item>
					<div class="Button">
						<el-button type="info" size="small" @click="close">取消</el-button>
						<el-button type="primary" size="small" @click="apply('ruleForm')">确认申请</el-button>
					</div>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>
<script>
import { orderPage, orderInfo, stamp, refundReview } from '@/api/indentmanagement/index.js';

export default {
	data() {
		// 验证活动名称的函数
		let validateName = (rule, value, callback) => {
			// 当活动名称为空值且为必填时，抛出错误，反之通过校验
			if (this.ruleForm.name === '' && this.isHaveTo) {
				callback(new Error('不能为空'));
			} else {
				callback();
			}
		};
		return {
			compile: false,
			refund: false,
			formInline: {
				orderNo: '',
				cellPhone: '',
				oilMark: null,
				orderStatus: null,
				timePayment: null,
				oilStation: null,
			},
			tableData: [],
			orderData: {},
			total: 0,
			pagination: {
				pageSize: 10,
				pageNum: 1,
			},
			textarea: '',
			serial: '',
			options: [
				{
					value: 1,
					label: '错付油站',
				},
				{
					value: 2,
					label: '错付金额',
				},
				{
					value: 3,
					label: '付款未加油',
				},
				{
					value: 4,
					label: '其他',
				},
			],
			ruleForm: {
				name: '',
				region: '0',
			},
			rules: {
				name: [{ validator: validateName }],
				region: [{ required: true, message: '请选择类型', trigger: 'blur' }],
			},
		};
	},
	computed: {
		paginationOption: function () {
			return { ...this.pagination, total: this.total };
		},
	},
	methods: {
		inquire() {
			this.pagination.pageNum = 1;
			this.indentList();
		},
		//列表
		indentList() {
			let date = { ...this.pagination, ...this.formInline };
			orderPage(date).then((res) => {
				this.tableData = res.result.data.map((n) => {
					return {
						...n,
						paymentStatus:
							n.paymentStatus == 1
								? '已付款'
								: n.paymentStatus == 2
								? '退款成功'
								: n.paymentStatus == 3
								? '付款中'
								: n.paymentStatus == 4
								? '待退款'
								: n.paymentStatus == 4
								? '退款失败'
								: n.paymentStatus == 5
								? '退款失败'
								: n.paymentStatus == 6
								? '已结算'
								: n.paymentStatus,
					};
				});
				this.total = res.result.totalNum;
			});
		},
		//查看详情
		onOpenEditRole(row) {
			orderInfo(row.orderNo).then((res) => {
				this.orderData = res.result;
				this.compile = true;
			});
		},
		//发起退款
		onRowDel(row) {
			this.refund = true;
			this.serial = row.orderNo;
		},
		//申请退款
		apply(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					refundReview(this.serial).then((res) => {
						console.log(res);
					});
				} else {
					return false;
				}
			});
		},
		//补打小票
		receipt(row) {
			stamp(row.orderNo).then((res) => {
				if (res.code == 200) {
					this.$message.success('打印成功');
				}
			});
		},
		// 新增关闭
		//退款关闭
		close() {
			this.compile = false;
			this.refund = false;
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
	mounted() {
		this.indentList();
	},
	computed: {
		isHaveTo: function () {
			return this.ruleForm.region !== `1` && this.ruleForm.region !== `2` && this.ruleForm.region !== `3`;
		},
	},
};
</script>
<style scoped lang="scss">
.header {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	.el-form-item {
		width: 25%;
		display: flex;
	}
}
.header-buttom {
	display: flex;
	align-items: center;
	justify-content: space-between;
	.el-form-item {
		display: flex;
	}
}
.right {
	margin-right: 125px;
}
.center {
	margin-top: 20px;
}
.righ {
	text-align: right;
}
.refund {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20px;
	.refundleft {
		width: 9%;
	}
}
.refundRight {
	display: flex;
	justify-content: right;
}
::v-deep .el-dialog {
	min-height: 30%;
}
.Button {
	margin-top: 70px;
	display: flex;
	justify-content: right;
}
.el-row {
	margin-bottom: 20px;
	&:last-child {
		margin-bottom: 0;
	}
}
.el-col {
	// border-radius: 4px;
	border: 0.5px solid #ccc;
	margin-left: -1px;
	margin-top: -1px;
}
.bg-purple-dark {
	// background: #99a9bf;
}
.bg-purple {
	// background: #d3dce6;
}
.bg-purple-light {
	// background: #e5e9f2;
}
.grid-content {
	border-radius: 4px;
	min-height: 36px;
	line-height: 36px;
	text-align: center;
}
.row-bg {
	padding: 10px 0;
	background-color: #f9fafc;
}

::v-deep {
	.customWidth {
		.el-dialog__header {
			text-align: center !important;
		}
	}
}
</style>


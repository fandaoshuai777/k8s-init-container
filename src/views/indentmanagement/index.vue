<template>
	<div class="system-role-container">
		<el-card shadow="hover">
			<div class="system-user-search">
				<el-form :model="formInline" class="demo-form-inline">
					<div class="header">
						<el-form-item label="订单号">
							<el-input v-model="formInline.orderNo" placeholder="请输入订单号" clearable></el-input>
						</el-form-item>
						<el-form-item label="手机号">
							<el-input v-model="formInline.driverTel" placeholder="请输入手机号" clearable></el-input>
						</el-form-item>
						<el-form-item label="油号" >
							<el-select v-model="formInline.oilType" clearable>
								<el-option label="全部" value=""></el-option>
								<el-option v-for="(item, index) in batchNum" :key="index" :label="item.index" :value="item"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="订单状态">
							<el-select v-model="formInline.paymentStatus" clearable>
								<el-option v-for="(item, index) in oilStatusDict" :key="index" :label="item.label" :value="item.code"></el-option>
							</el-select>
						</el-form-item>
					</div>
					<div class="header-buttom">
						<el-form-item label="支付时间">
							<el-date-picker
								v-model="Time"
								type="datetimerange"
								start-placeholder="开始日期"
								end-placeholder="结束日期"
								:default-time="['00:00:00', '23:59:59']"
								value-format="yyyy-MM-dd HH:mm:ss"
							>
							</el-date-picker>
						</el-form-item>
						<el-form-item label="油站">
							<el-select v-model="formInline.stationName" clearable>
								<el-option v-for="(item, index) in oilStations" :key="index" :label="item.label" :value="item.code"></el-option>
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
			<div class="center"><div> 交易总金额：{{ dieselEngineNumCount }} </div><div>订单数量：{{ orderNum }}</div> <div>总升数：{{ fuelVolumeTotal }}</div> </div>
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
						<el-button
							size="small"
							type="text"
							:disabled="scope.row.paymentStatus === '已付款' ? false : scope.row.paymentStatus === '退款失败' ? false : true"
							@click="onRowDel(scope.row)"
							>发起退款</el-button
						>
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
					><div class="grid-content bg-purple">{{ orderData.orderTime }}</div></el-col
				>
				<el-col :span="6"><div class="grid-content bg-purple">支付时间</div></el-col>
				<el-col :span="6"
					><div class="grid-content bg-purple">{{ orderData.paymentTime }}</div></el-col
				>
				<el-col :span="6" style="text-algin: center"><div class="grid-content bg-purple">订单状态</div></el-col>
				<el-col :span="6"
					><div class="grid-content bg-purple">
						{{ orderData.paymentStatus==1?'已付款':orderData.paymentStatus==1?'已付款':orderData.paymentStatus==2?'退款成功':orderData.paymentStatus==3?'付款中':orderData.paymentStatus==4?'待退款':orderData.paymentStatus==5?'退款失败':orderData.paymentStatus==6?'已结算':orderData.paymentStatus}}
					</div></el-col
				>
				<el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
				<el-col :span="6" style="text-algin: center"><div class="grid-content bg-purple">所属油站</div></el-col>
				<el-col :span="6"
					><div class="grid-content bg-purple">{{ orderData.stationName }}</div></el-col
				>
				<el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
				<el-col :span="6" style="text-algin: center"><div class="grid-content bg-purple">退款时间</div></el-col>
				<el-col :span="6"
					><div class="grid-content bg-purple">{{ orderData.orderNo }}</div></el-col
				>
				<el-col :span="6"><div class="grid-content bg-purple">退款原因</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">拒绝退款原因</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">油品</div></el-col>
				<el-col :span="6"
					><div class="grid-content bg-purple">{{ orderData.oilType }}</div></el-col
				>
				<el-col :span="6"><div class="grid-content bg-purple">油枪</div></el-col>
				<el-col :span="6"
					><div class="grid-content bg-purple">{{ orderData.oilGunNo }}</div></el-col
				>
				<el-col :span="6"><div class="grid-content bg-purple">加油量</div></el-col>
				<el-col :span="6"
					><div class="grid-content bg-purple">{{ orderData.fuelVolume }}</div></el-col
				>
				<el-col :span="6"><div class="grid-content bg-purple">订单油机金额</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">序列号(撬装)</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
			</el-row>
		</el-dialog>
		<el-dialog title="退款" :visible.sync="refund" :close-on-click-modal="false" @close="close">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="退款原因" prop="region">
					<el-select v-model="ruleForm.region" style="width: 100%">
						<el-option label="错付油站" value="错付油站"></el-option>
						<el-option label="错付金额" value="错付金额"></el-option>
						<el-option label="付款未加油" value="付款未加油"></el-option>
						<el-option label="其他" value="其他"></el-option>
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
import { orderPage, orderInfo, stamp, refundReview, oilTypeDict, oilStationDict, oilStatusDict } from '@/api/indentmanagement/index.js';

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
			disabled: true,
			formInline: {
				orderNo: '',
				cellPhone: '',
				oilMark: null,
				paymentStatus: null,
				oilStation: null,
				startTime: null,
				endTime: null,
			},
			Time: [],
			dieselEngineNumCount: 0,
			fuelVolumeTotal: 0,
			orderNum: 0,
			tableData: [],
			orderData: [],

			total: 0,
			rfndReason: '',
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
			batchNum: [],
			oilStations: [],
			oilStatusDict: [],
			ruleForm: {
				name: '',
				region: '其他',
			},
			flag: '',
			rules: {
				name: [{ validator: validateName }],
				region: [{ required: true, message: '请选择类型', trigger: 'blur' }],
			},
		};
	},
	created() {
		this.getTimeFn();
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
			if (this.Time == null) {
				this.formInline.endTime = '';
				this.formInline.startTime = '';
			} else {
				this.formInline.startTime = this.Time[0];
				this.formInline.endTime = this.Time[1];
			}
			let date = { ...this.pagination, ...this.formInline };
			orderPage(date).then((res) => {
				this.dieselEngineNumCount = res.result.orderPageTotal.dieselEngineNumCount.toFixed(2);
				this.fuelVolumeTotal = res.result.orderPageTotal.fuelVolumeTotal.toFixed(2);
				this.orderNum = res.result.orderPageTotal.orderNum.toFixed(2);
				this.tableData = res.result.orderVOPage.data.map((n) => {
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
								fuelVolume:n.fuelVolume.toFixed(2)
					};
				});
				this.flag = this.tableData.paymentStatus;
				this.total = res.result.orderVOPage.totalNum;
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
			console.log(row.orderNo);
			this.serial = row.orderNo;
		},
		//申请退款
		apply(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					if (this.ruleForm.name !== '') {
						this.rfndReason = this.ruleForm.name;
					} else {
						this.rfndReason = this.ruleForm.region;
					}
					let date = { rfndReason: this.rfndReason, orderNo: this.serial };
					refundReview(date).then((res) => {
						if (res.code == 200) {
							this.refund = false;
							this.$message.success('发起退款成功');
							this.$refs.ruleForm.resetFields();
							this.inquire()
						} else {
							// this.$refs.ruleForm.resetFields();
							this.$message.error(res.msg);
						}
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
				} else {
					this.$message.error(res.msg);
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
		/**
		 * 设置默认时间
		 */
		getTimeFn() {
			const end = new Date();
			const start = new Date();
			start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
			console.log(this.Time);
			this.Time[0] = this.formatDate(start) + ' 00:00:00';
			this.Time[1] = this.formatDate(end) + ' 23:59:59';
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
	mounted() {
		this.indentList();
		oilTypeDict().then((res) => {
			this.batchNum = res.result;
		});
		oilStationDict().then((res) => {
			this.oilStations = res.result.map((n) => {
				return {
					...n,
					label: n.value,
				};
			});
			// this.oilStations = res.result;
		});
		oilStatusDict().then((res) => {
			this.oilStatusDict = res.result.map((n) => {
				return {
					...n,
					label: n.value,
				};
			});
		});
	},
	computed: {
		isHaveTo: function () {
			return this.ruleForm.region !== `错付油站` && this.ruleForm.region !== `错付金额` && this.ruleForm.region !== `付款未加油`;
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
		margin-right: 80px;
	}
}
.right {
	margin-right: 125px;
}
.center {
	margin: 20px 0;
	display: flex;
	>div{
		margin-right: 20px;
	}
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
 

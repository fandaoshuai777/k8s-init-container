<template>
	<div class="system-role-container">
		<el-card shadow="hover">
			<div>
				<el-form :model="formInline" label-width="95px" :inline="true" label-position="right">
					<el-form-item label="订单号">
						<el-input v-model="formInline.orderNo" placeholder="请输入订单号" @change="onVerifiyNumberInteger($event)" clearable></el-input>
					</el-form-item>
					<el-form-item label="手机号" prop="driverTel">
						<el-input v-model="formInline.driverTel" placeholder="请输入手机号" @change="onVerifyPhone($event)" clearable> clearable></el-input>
					</el-form-item>
					<el-form-item label="油号">
						<el-select v-model="formInline.oilType" clearable>
							<el-option label="全部" value=""></el-option>
							<el-option v-for="(item, index) in oilMark" :key="index" :label="item.index" :value="item"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="订单状态">
						<el-select v-model="formInline.paymentStatus" clearable>
							<el-option v-for="(item, index) in orderFomr" :key="index" :label="item.label" :value="item.code"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="油站">
						<el-select v-model="formInline.stationName" clearable>
							<el-option v-for="(item, index) in oilStation" :key="index" :label="item.label" :value="item.code"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="支付时间">
						<el-date-picker
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
					<el-form-item>
						<el-button type="primary" @click="inquire">查询</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div class="center">
				<div>交易总金额(元)：{{ dieselEngineNumCount }}</div>
				<div>订单数量(单)：{{ orderNum }}</div>
				<div>总升数(升)：{{ fuelVolumeTotal }}</div>
			</div>
			<el-table style="width: 100%; z-index: 0" :data="tableData" stripe border v-loading="loading">
				<el-table-column prop="orderNo" label="订单号" align="center" min-width="160px" />
				<el-table-column prop="paymentStatus" label="订单状态" align="center" min-width="120px"></el-table-column>
				<el-table-column prop="orderTime" label="下单时间" align="center" min-width="240px"></el-table-column>
				<el-table-column prop="paymentTime" label="支付时间" align="center" min-width="240px"></el-table-column>
				<el-table-column prop="stationName" label="所属油站" align="center" min-width="220px" />
				<el-table-column prop="dieselEngineNum" label="订单油机金额(元)" align="center" min-width="140px"></el-table-column>
				<el-table-column prop="oilType" label="油号" align="center" min-width="120px"></el-table-column>
				<el-table-column prop="oilGunNo" label="枪号" align="center" min-width="120px"></el-table-column>
				<el-table-column prop="fuelVolume" label="升数(L)" align="center" min-width="120px"></el-table-column>
				<el-table-column prop="driverTel" label="用户手机号" align="center" min-width="180px"></el-table-column>
				<el-table-column label="操作" width="200" align="center" fixed="right">
					<template #default="scope">
						<el-button size="small" type="text" @click="onOpenEditRole(scope.row)">查看</el-button>
						<el-button
							size="small"
							type="text"
							v-if="scope.row.paymentStatus == '已付款' || scope.row.paymentStatus == '退款失败'"
							@click="onRowDel(scope.row)"
							>发起退款</el-button
						>
						<el-button size="small" type="text" v-if="scope.row.paymentStatus == '已付款'" @click="receipt(scope.row)">补打小票</el-button>
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
		<el-dialog title="订单详情" :visible.sync="compile" :close-on-click-modal="false" @close="close" custom-class="customWidth">
			<div class="warp">
				<div class="grid-content bg-purple">订单号</div>
				<div class="grid-content bg-purple">{{ orderData.orderNo }}</div>
				<div class="grid-content bg-purple">订单来源</div>
				<div class="grid-content bg-purple">
					{{
								orderData.orderSource == 1
								? '小鹰加油'
								: orderData.orderSource == 2
								? '小鹰加油'
								:orderData.orderSource == 3
								? '小鹰加油'
								: orderData.orderSource == 4
								? '团油'
								: orderData.orderSource == 5
								? '宝能'
								: orderData.orderSource == 6
								? '小鹰加油'
								: orderData.orderSource == 8
								? '敬运'
								: orderData.orderSource,
					}}
				</div>

				<div class="grid-content bg-purple">下单时间</div>
				<div class="grid-content bg-purple">{{ orderData.orderTime }}</div>

				<div class="grid-content bg-purple">支付时间</div>
				<div class="grid-content bg-purple">{{ orderData.paymentTime }}</div>

				<div class="grid-content bg-purple">订单状态</div>
				<div class="grid-content bg-purple">
					{{
						orderData.paymentStatus == 1
							? '已付款'
							: orderData.paymentStatus == 2
							? '退款成功'
							: orderData.paymentStatus == 3
							? '付款中'
							: orderData.paymentStatus == 4
							? '待退款'
							: orderData.paymentStatus == 5
							? '退款失败'
							: orderData.paymentStatus == 6
							? '已结算'
							: orderData.paymentStatus == 7
							? '退款中'
							: orderData.paymentStatus == 8
							? '已取消'
							: orderData.paymentStatus
					}}
				</div>

				<div class="grid-content bg-purple"></div>
				<div class="grid-content bg-purple"></div>
				<div class="grid-content bg-purple">所属油站</div>
				<div class="grid-content bg-purple">{{ orderData.stationName }}</div>

				<div class="grid-content bg-purple"></div>
				<div class="grid-content bg-purple"></div>
				<div class="grid-content bg-purple">退款时间</div>
				<div class="grid-content bg-purple">{{ orderData.rfndTime }}</div>

				<div class="grid-content bg-purple">退款原因</div>
				<div class="grid-content bg-purple">{{ orderData.rfndReason }}</div>

				<div class="grid-content bg-purple">拒绝退款原因</div>
				<div class="grid-content bg-purple"></div>
				<div class="grid-content bg-purple"></div>
				<div class="grid-content bg-purple"></div>
				<div class="grid-content bg-purple">油品</div>
				<div class="grid-content bg-purple">{{ orderData.oilType }}</div>

				<div class="grid-content bg-purple">油枪</div>
				<div class="grid-content bg-purple">{{ orderData.deviceImei ? '' : orderData.oilGunNo + '号枪' }}</div>

				<div class="grid-content bg-purple">加油量</div>
				<div class="grid-content bg-purple">{{ orderData.fuelVolume ? orderData.fuelVolume.toFixed(2) + 'L' : '' }}</div>

				<div class="grid-content bg-purple">订单油机金额</div>
				<div class="grid-content bg-purple">{{ orderData.dieselEngineNum ? '￥' + orderData.dieselEngineNum : '' }}</div>

				<div class="grid-content bg-purple">序列号(撬装)</div>
				<div class="grid-content bg-purple">{{ orderData.oilGunNo ? '' : orderData.deviceImei }}</div>

				<div class="grid-content bg-purple"></div>
				<div class="grid-content bg-purple"></div>
			</div>
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
					<div class="buttonSwitch">
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
import { verifyPhone, verifiyNumberInteger } from '@/utils/toolsValidate';
export default {
	data() {
		let validateName = (rule, value, callback) => {
			if (this.ruleForm.name === '' && this.isHaveTo) {
				callback(new Error('不能为空'));
			} else {
				callback();
			}
		};
		return {
			compile: false, //订单详情dialog
			refund: false, //退款dialog
			formInline: {
				//筛选
				orderNo: '',
				cellPhone: '',
				oilMark: null,
				paymentStatus: null,
				oilStation: null,
				startTime: null,
				endTime: null,
			},
			Time: [],
			dieselEngineNumCount: 0, //交易总金额
			fuelVolumeTotal: 0, //总升数
			orderNum: 0, //订单数量
			tableData: [], //数据表格
			orderData: [],
			loading: true, //table loading
			total: 0, //总条数
			rfndReason: '', //退款原因
			pagination: {
				//分页
				pageSize: 10,
				pageNum: 1,
			},
			serial: '', //退款数据号
			oilMark: [], //油号
			oilStation: [], //油站
			orderFomr: [], //订单详情
			ruleForm: {
				//退款form
				name: '',
				region: '其他',
			},
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
		// 搜索
		inquire() {
			this.pagination.pageNum = 1;
			this.loading = true;
			this.indentList();
		},
		// 时间限制
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
				if (Sdata + 7776000000 > Sdatas) {
				} else {
					this.$message('选择时间段不能超过90天');
					this.Time = '';
				}
				return;
			}
		},
		//列表
		indentList() {
			//请求之前，开启loading
			if (this.Time == null) {
				this.formInline.endTime = '';
				this.formInline.startTime = '';
			} else {
				this.formInline.startTime = this.Time[0];
				this.formInline.endTime = this.Time[1];
			}
			let date = { ...this.pagination, ...this.formInline };
			orderPage(date).then((res) => {
				this.loading = false;
				this.dieselEngineNumCount = res.result.orderPageTotal.dieselEngineNumCount.toFixed(2);
				this.fuelVolumeTotal = res.result.orderPageTotal.fuelVolumeTotal.toFixed(2);
				this.orderNum = res.result.orderPageTotal.orderNum;
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
								: n.paymentStatus == 7
								? '退款中'
								: n.paymentStatus == 8
								? '已取消'
								: n.paymentStatus,
						fuelVolume:n.fuelVolume===null?'': n.fuelVolume.toFixed(2),
						driverTel: n.driverTel.replace(/(\d{3})\d*(\d{4})/, '$1****$2'),
					};
				});
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
							this.inquire();
						} else {
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
					this.$message.success('补打成功');
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
		// 手机号码
		onVerifyPhone(val) {
			if (verifyPhone(val) == false) {
				this.formInline.driverTel = '';
			}
		},
		// 限制订单号不能为其他类型
		onVerifiyNumberInteger(val) {
			if (verifiyNumberInteger(val) == false) {
				this.formInline.orderNo = '';
			}
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
		//油号
		oilTypeDict().then((res) => {
			this.oilMark = res.result;
		});
		//油站
		oilStationDict().then((res) => {
			this.oilStation = res.result.map((n) => {
				return {
					...n,
					label: n.value,
					value: n.code,
				};
			});
		});
		//订单状态
		oilStatusDict().then((res) => {
			this.orderFomr = res.result.map((n) => {
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
::v-deep .el-range__close-icon {
	display: none;
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
::v-deep .el-dialog {
	min-height: 30%;
}
.buttonSwitch {
	margin-top: 70px;
	display: flex;
	justify-content: right;
}
.warp {
	display: flex;
	flex-wrap: wrap;
	.el-col {
		border: 0.5px solid #ccc !important;
		margin-left: -1px;
		margin-top: -1px;
	}
}
.grid-content {
	border: 1px solid #ccc;
	width: 25%;
	min-height: 30px;
	line-height: 30px;
	text-align: center;
	padding: 1px;
	margin-bottom: -1px;
	margin-left: -1px;
}
::v-deep {
	.customWidth {
		.el-dialog__header {
			text-align: center !important;
		}
	}
}
</style>
 

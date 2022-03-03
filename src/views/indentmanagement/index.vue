<template>
	<div class="system-role-container">
		<el-card shadow="hover">
			<div class="system-user-search">
				<el-form :model="formInline" class="demo-form-inline">
					<div class="header">
						<el-form-item label="订单号">
							<el-input v-model="formInline.orderNumber"></el-input>
						</el-form-item>
						<el-form-item label="手机号">
							<el-input v-model="formInline.cellPhone"></el-input>
						</el-form-item>
						<el-form-item label="油号">
							<el-select v-model="formInline.oilMark" placeholder="活动区域">
								<el-option v-for="(item, index) in options" :key="index" :label="item.label" :value="item.label"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="订单状态">
							<el-select v-model="formInline.orderStatus" placeholder="请选择">
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
							<el-select v-model="formInline.oilStation" placeholder="活动区域">
								<el-option v-for="(item, index) in options" :key="index" :label="item.label" :value="item.label"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item>
							<div class="right">
								<el-button type="primary" @click="onSubmit">查询</el-button>
							</div>
						</el-form-item>
					</div>
				</el-form>
			</div>
			<div class="center">交易总金额：{} 订单数量：{}总升数：{}</div>
			<el-table style="width: 100%">
				<el-table-column label="订单号" />
				<el-table-column prop="roleName" label="订单状态" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="roleSign" label="下单时间" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="sort" label="支付时间" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="status" label="所属油站" show-overflow-tooltip align="center" />
				<el-table-column prop="describe" label="订单油机金额(元)" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="createTime" label="油号" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="createTime" label="枪号" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="createTime" label="升数(L)" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="createTime" label="用户手机号" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column label="操作" width="200" align="center">
					<template #default="scope">
						<el-button size="small" type="text" @click="onOpenEditRole(scope.row)">查看</el-button>
						<el-button size="small" type="text" @click="onRowDel(scope.row)">发起退款</el-button>
						<el-button size="small" type="text" @click="onRowDel(scope.row)">补打小票</el-button>
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
				></el-pagination>
			</div>
		</el-card>
	</div>
</template>
<script>
export default {
	data() {
		return {
			formInline: {
				orderNumber: '',
				cellPhone: '',
				oilMark: '',
				orderStatus: '',
				timePayment: '',
				oilStation: '',
			},
			options: [
				{
					value: '选项1',
					label: '黄金糕',
				},
				{
					value: '选项2',
					label: '双皮奶',
				},
				{
					value: '选项3',
					label: '蚵仔煎',
				},
				{
					value: '选项4',
					label: '龙须面',
				},
				{
					value: '选项5',
					label: '北京烤鸭',
				},
			],
		};
	},
	methods: {
		onSubmit() {
			console.log(this.formInline);
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
</style>


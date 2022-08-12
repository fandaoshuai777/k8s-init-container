<template>
	<div>
		<el-card shadow="hover">
			<el-form :model="formInline" label-width="95px" :inline="true" label-position="right" ref="reset">
				<el-form-item label="手机号:">
					<el-input v-model="formInline.id" placeholder="请输入报表名称" clearable> </el-input>
				</el-form-item>
				<el-form-item label="油品型号:">
					<el-select v-model="formInline.refundStatus" placeholder="请选择">
						<el-option label="全部" value />
						<el-option label="退款中" :value="2" />
						<el-option label="退款成功" :value="5" />
						<el-option label="退款失败" :value="6" />
					</el-select>
				</el-form-item>
				<el-form-item label="订单号:">
					<el-input v-model="formInline.id" placeholder="请输入报表名称" clearable> </el-input>
				</el-form-item>
				<el-form-item label="退款状态:">
					<el-select v-model="formInline.refundStatus" placeholder="请选择">
						<el-option label="全部" value />
						<el-option label="退款中" :value="2" />
						<el-option label="退款成功" :value="5" />
						<el-option label="退款失败" :value="6" />
					</el-select>
				</el-form-item>
				<el-form-item label="创建时间">
					<el-date-picker
						v-model="times"
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
					<el-button type="primary" @click="inquire">查询</el-button>
				</el-form-item>
			</el-form>
			<Table
				:loading="loading"
				:colums="colums"
				:data="tableData"
				:pagination-option="paginationOption"
				@currentChange="paginationChange"
				@sizeChange="pageSizeChange"
			>
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
export default {
	components: {
		Table,
	},
	data() {
		return {
			formInline: {
				id: '',
			},
			loading: false,
			tableData: [
				{
					a: 243456,
					b: '134***1234',
					c: 1,
					d: '92#',
					e: 5,
					f: '109.01',
					g: 98,
					l: 1.23,
					m: '微信支付',
					n: '退款中',
					o: '2022-08-09 10:38:51',
					p: '2022-08-09 10:38:51',
				},
			],
			colums: [
				{
					label: '订单编号',
					prop: 'a',
				},
				{
					label: '司机手机号',
					prop: 'b',
				},
				{
					label: '枪号',
					prop: 'c',
				},
				{
					label: '油品类型',
					prop: 'd',
				},
				{
					label: '订单金额',
					prop: 'e',
				},
				{
					label: '实付金额',
					prop: 'f',
				},
				{
					label: '加油量',
					prop: 'g',
				},
				{
					label: '支付方式',
					prop: 'm',
				},
				{
					label: '退款状态',
					prop: 'n',
				},
				{
					label: '创建时间',
					prop: 'o',
				},
				{
					label: '支付时间',
					prop: 'p',
				},
				{
					label: '操作',
					prop: 'done',
					fixed: 'right',
				},
			],
			times: [],
			time: [],
		};
	},
	computed: {
		paginationOption: function () {
			return { ...this.pagination, total: this.total };
		},
	},
	methods: {
		// 查询
		inquire() {},
		// 拒绝
		refuse() {
			this.$confirm('确认审核拒绝', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消',
					});
				});
		},
		// 通过
		pass() {
			this.$confirm('确认审核通过?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消',
					});
				});
		},
		// 列表
		downloadList() {},
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

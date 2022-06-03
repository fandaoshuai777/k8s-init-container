<template>
	<div class="Main">
		<!-- 搜索 -->
		<el-form ref="searchForm" :model="searchForm" label-width="120px" :inline="true">
			<el-form-item label="账单日期" prop="billTime">
				<el-date-picker v-model="searchForm.billTime" type="date" placeholder="选择日期" />
			</el-form-item>
			<el-form-item label="数据是否为0" prop="amountFlag">
				<el-select v-model="searchForm.amountFlag">
					<el-option label="全部" :value="0" />
					<el-option label="数据不为0" :value="1" />
					<el-option label="数据为0" :value="2" />
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" class="adds" @click="doSearch">搜索</el-button>
			</el-form-item>
		</el-form>
		<!-- 表单 -->
		<el-table v-loading="loading" :data="tableData" border style="width: 100%">
			<el-table-column prop="ids" label="编号" width="180" />
			<el-table-column prop="stationId" label="商户编号" width="180" />
			<el-table-column prop="stationName" label="商户名称" />
			<el-table-column prop="billingAmount" label="订单总额" />
			<el-table-column prop="oneCardAmount" label="一卡通总额" />
			<el-table-column prop="employeeCardAmount" label="员工总额" />
			<el-table-column prop="couponsAmount" label="券总额" />
			<el-table-column prop="billTime" label="账单日期" />
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button type="text" @click="Associated(scope.row)">关联订单</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!-- 分页 -->
		<el-pagination
			:current-page="pagination.current"
			:page-sizes="[10, 20, 30, 40]"
			:page-size="pagination.pageSize"
			layout="total, sizes, prev, pager, next, jumper"
			:total="total"
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
		/>
		<!-- 弹窗 -->
		<Sysdialog ref="Associated" />
	</div>
</template>

<script>
import Sysdialog from './components/sysdialog.vue';
import { billList } from '@/api/billDj';
export default {
	components: {
		Sysdialog,
	},
	data() {
		return {
			searchForm: {
				billTime: '',
				amountFlag: 0,
			},
			loading: true,
			tableData: [{ billNo: 1 }], // 列表
			pagination: {
				pageSize: 10,
				currPage: 1,
			},
			total: 0,
		};
	},
	created() {
		this.init();
	},
	methods: {
		// 搜索
		doSearch() {
			this.init();
		},
		// 获取列表
		init() {
			const data = this.searchForm;
			// let stationId = window.sessionStorage.getItem('enterpriseId')
			// data.stationId = stationId
			data.stationId = 1;
			this.loading = true;
			billList(data).then((res) => {
				if (res.code === 200) {
					if (res.result.length > 0) {
						this.tableData = res.result.map((item) => {
							item.ids = this.pagination.currPage * this.pagination.pageSize - 9;
							return {
								...item,
							};
						});
					} else {
						this.tableData = [];
					}
					this.loading = false;
				}
			});
		},
		// 关联订单
		Associated(row) {
			this.$refs.Associated.billNo = row.billNo;
			this.$refs.Associated.dialogVisible = true;
			this.$refs.Associated.getList();
		},
		handleSizeChange() {
			//   console.log(`每页 ${val} 条`)
		},
		handleCurrentChange() {
			//   console.log(`当前页: ${val}`)
		},
	},
};
</script>

<style scoped>
::v-deep .el-pagination {
	text-align: center;
	padding-top: 20px;
}
</style>

<template>
	<div class="Main">
		<!-- 搜索 -->
		<el-form ref="searchForm" :model="searchForm" label-width="100px" :inline="true">
			<el-form-item label="账单日期" prop="billTime" style="margin-left: -20px">
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
			<el-table-column label="编号" width="90" align="center">
				<template slot-scope="scope">
					{{ scope.$index + 1 + (pagination.pageIndex - 1) * pagination.pageSize }}
				</template>
			</el-table-column>
			<el-table-column prop="stationId" label="商户编号" width="140" align="center" />
			<el-table-column prop="stationName" label="商户名称" align="center" width="140" />
			<el-table-column prop="billingAmount" label="订单总额" />
			<el-table-column prop="oneCardAmount" label="一卡通消费总额" />
			<el-table-column prop="employeeCardAmount" label="员工卡消费总额" />
			<el-table-column prop="couponsAmount" label="券消费总额" />
			<el-table-column prop="billTime" label="账单日期" width="180" align="center" />
			<el-table-column label="操作" align="center">
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
				amountFlag: 1,
			},
			loading: true,
			tableData: [], // 列表
			pagination: {
				pageSize: 10,
				pageIndex: 1,
			},
			total: 0,
		};
	},
	created() {
		this.init();
	},
	methods: {
		getData(str) {
			return str.split(' ')[0];
		},
		// 搜索
		doSearch() {
			this.init();
		},
		// 获取列表
		init() {
			const data = this.searchForm;
			let stationId = window.sessionStorage.getItem('enterpriseId');
			data.stationId = stationId;
			// data.stationId = 1111130551;
			this.loading = true;
			billList(data).then((res) => {
				if (res.code === 200) {
					if (res.result.list.length > 0) {
						this.tableData = res.result.list.map((item) => {
							item.billTime = this.getData(item.billTime);
							return {
								...item,
							};
						});
					} else {
						this.tableData = [];
					}
					this.loading = false;
					this.total = res.result.total
				}
			});
		},
		// 关联订单
		Associated(row) {
			this.$refs.Associated.billNo = row.billNo;
			this.$refs.Associated.dialogVisible = true;
			this.$refs.Associated.getList();
		},
		handleSizeChange(val) {
			this.pagination.pageSize = val;
			this.pagination.pageIndex = 1;
			this.init();
		},
		handleCurrentChange(val) {
			this.pagination.pageIndex = val;
			this.init();
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

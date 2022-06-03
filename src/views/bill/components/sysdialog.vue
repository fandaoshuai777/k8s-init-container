<template>
	<div>
		<el-dialog title="关联订单" :visible.sync="dialogVisible" width="80%" :before-close="handleClose">
			<el-form ref="searchForm" :model="searchForm" :inline="true">
				<el-form-item label="用户手机号" prop="driverTel">
					<el-input v-model="searchForm.driverTel" placeholder="" />
				</el-form-item>
				<el-form-item>
					<el-button type="primary" class="adds" @click="doSearch">搜索</el-button>
				</el-form-item>
			</el-form>
			<!-- 表单 -->
			<el-table v-loading="loading" :data="tableData" border :header-cell-style="{ background: '#eff3f6' }" style="width: 100%">
				<el-table-column prop="ids" label="编号" />
				<el-table-column prop="orderNo" label="订单编号" />
				<el-table-column prop="driverTel" label="付款用户" />
				<el-table-column prop="billingAmount" label="订单金额" />
				<el-table-column prop="oneCardAmount" label="一卡通金额" />
				<el-table-column prop="employeeCardAmount" label="员工卡金额" />
				<el-table-column prop="couponsAmount" label="优惠券面额" />
				<el-table-column prop="couponNo" label="优惠券类型编码" />
				<el-table-column prop="paymentTime" label="交易时间" />
			</el-table>
			<!-- 分页 -->
			<el-pagination
				:current-page="pagination.pageIndex"
				:page-sizes="[10, 20, 30, 40]"
				:page-size="pagination.pageSize"
				layout="total, sizes, prev, pager, next, jumper"
				:total="total"
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
			/>
		</el-dialog>
	</div>
</template>

<script>
import { commitOrder } from '@/api/billDj';
export default {
	data() {
		return {
			dialogVisible: false,
			searchForm: {
				driverTel: '',
			},
			billNo: null,
			loading: true,
			tableData: [], // 列表
			pagination: {
				pageSize: 10,
				pageIndex: 1,
			},
			total: 0,
		};
	},
	methods: {
		doSearch() {
      this.getList()
    },
		getList() {
			const data = { ...this.searchForm, ...this.pagination };
			data.billNo = this.billNo;
			this.loading = true;
			commitOrder(data).then((res) => {
				if (res.code === 200) {
					this.tableData = res.result.map((item) => {
						item.ids = this.pagination.pageIndex * this.pagination.pageSize - 9;
						return {
							...item,
						};
					});
					this.loading = false;
					this.total = res.data.stationDailyBillCardDto.totalCount;
				}
			});
		},
		handleClose() {
			this.dialogVisible = false;
		},
		handleSizeChange(val) {
			this.loading = true;
			this.pagination.pageSize = val;
			this.pagination.pageIndex = 1;
			this.getList();
		},
		handleCurrentChange(val) {
			this.loading = true;
			this.pagination.pageIndex = val;
			this.getList();
		},
	},
};
</script>

<style>
</style>

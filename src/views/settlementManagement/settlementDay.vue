<template>
	<div class="system-role-container">
		<el-card shadow="hover">
			<div>
				<el-form :model="formInline" label-width="95px" :inline="true" label-position="right" size="small">
					<el-form-item label="账单日期">
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
						<el-button type="primary" @click="inquire" >查询</el-button>
					</el-form-item>
				</el-form>
			</div>

			<el-table :data="tableData" border style="width: 100%">
				<el-table-column prop="id" label="账单编号" width="180" align="center" />
				<el-table-column prop="riqi" label="渠道" align="center" />
				<el-table-column prop="amount3" label="订单类型" align="center" />
				<el-table-column prop="amount3" label="结算账户" align="center" />
				<el-table-column prop="amount3" label="订单金额" align="center" />
				<el-table-column prop="amount3" label="支付通道手续费" align="center" width="160">
					<template slot="header">
						<span>支付通道手续费</span>
						<el-tooltip class="item" effect="light" content="收单模式收取支付通道手续费" placement="top">
							<i class="el-icon-info" style="color: #409eff" />
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column prop="amount3" label="平台服务费" align="center" width="120">
					<template slot="header">
						<span>平台服务费</span>
						<el-tooltip class="item" effect="light" content="引流模式收取平台服务费" placement="top">
							<i class="el-icon-info" style="color: #409eff" />
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column prop="amount3" label="应结金额" align="center" />
				<el-table-column prop="amount3" label="结算服务费" align="center" width="120" />
				<el-table-column prop="amount3" label="采购折扣金额" align="center" width="130" />
				<el-table-column prop="done" label="实结金额" align="center" />
				<el-table-column prop="done" label="账单状态" align="center" />
			</el-table>
		</el-card>
	</div>
</template>
<script>
import Table from '@/components/table/index_detail';
import { billList } from '@/api/settlement/index';

export default {
	components: {
		Table,
	},
	data() {
		return {
			// table
			loading: false,
			tableData: [
		
			],

			pagination: {
				pageSize: 10,
				currPage: 1,
			},
			total: 0,
			// form
			formInline: {},
			time: [],
		};
	},
	computed: {
		paginationOption: function () {
			return { ...this.pagination, total: this.total };
		},
	},
	created() {
		const t = new Date();
		t.setDate(t.getDate() - 1);
		this.time = [t.toISOString().split('T')[0] + ' 00:00:00', t.toISOString().split('T')[0] + ' 23:59:59'];
		billList().then((res) => {
			console.log(res);
		});
	},
	methods: {
		// 页码变化
		paginationChange(value) {
			this.pagination.currPage = value.current;
			this.loading = false;
		},
		// 页数变化
		pageSizeChange(value) {
			this.pagination.pageSize = value.size;
			this.pagination.currPage = 1;
			this.loading = false;
		},
		// 查询
		inquire() {
			console.log(this.time);
		},

		// arraySpanMethod({ row, column, rowIndex, columnIndex }) {
		// 	if (columnIndex === 0) {
		// 		if (rowIndex === 0) {
		// 			return [12, 1];
		// 		} else if (rowIndex <= 11) {
		// 			return [0, 0];
		// 		}
		// 	}
		// 	if (columnIndex === 1) {
		// 		if (rowIndex === 0) {
		// 			return [12, 1];
		// 		} else if (rowIndex <= 11) {
		// 			return [0, 0];
		// 		}
		// 	}
		// 	if (columnIndex === 2) {
		// 		if (rowIndex === 0) {
		// 			return [6, 1];
		// 		} else if (rowIndex === 6) {
		// 			return [6, 1];
		// 		} else {
		// 			return [0, 0];
		// 		}
		// 	}
		// 	if (columnIndex === 3) {
		// 		if (rowIndex === 0) {
		// 			return [2, 1];
		// 		} else if (rowIndex <= 1) {
		// 			return [0, 0];
		// 		}

		// 		if (rowIndex === 2) {
		// 			return [1, 2];
		// 		}

		// 		if (rowIndex === 3) {
		// 			return [2, 1];
		// 		} else if (rowIndex === 4) {
		// 			return [0, 0];
		// 		}

		// 		if (rowIndex === 5) {
		// 			return [1, 2];
		// 		}

		// 		if (rowIndex === 6) {
		// 			return [2, 1];
		// 		} else if (rowIndex === 7) {
		// 			return [0, 0];
		// 		}

		// 		if (rowIndex === 8) {
		// 			return [1, 2];
		// 		}
		// 		if (rowIndex === 9) {
		// 			return [2, 1];
		// 		} else if (rowIndex === 10) {
		// 			return [0, 0];
		// 		}

		// 		if (rowIndex === 11) {
		// 			return [1, 2];
		// 		}
		// 	}
		// },
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
</style>

<template>
	<div>
		<el-card shadow="hover">
			<!-- 搜索 -->
			<el-form ref="searchForm" :model="searchForm" label-width="120px" :inline="true">
				<el-form-item label="账单日期" prop="stationName">
					<el-date-picker v-model="searchForm.date" type="date" placeholder="选择日期" />
				</el-form-item>
				<el-form-item label="数据是否为0" prop="stationName">
					<el-select v-model="searchForm.select">
						<el-option label="数据不为0" :value="0" />
						<el-option label="全部" :value="1" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" class="adds" @click="doSearch">搜索</el-button>
				</el-form-item>
			</el-form>
			<!-- 表单 -->
			<el-table :data="tableData" border  style="width: 100%">
				<el-table-column prop="date" label="编号" width="180" />
				<el-table-column prop="name" label="商户编号" width="180" />
				<el-table-column prop="address" label="商户名称" />
				<el-table-column prop="address" label="订单总额" />
				<el-table-column prop="address" label="一卡通总额" />
				<el-table-column prop="address" label="员工总额" />
				<el-table-column prop="address" label="券总额" />
				<el-table-column prop="address" label="账单日期" />
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
		</el-card>
	</div>
</template>

<script>
import Sysdialog from './components/sysdialog.vue'
export default {
  components: {
    Sysdialog
  },
  data() {
    return {
      searchForm: {
        date: '',
        select: 0
      },
      loading: false,
      tableData: [{ billNo: 1 }], // 列表
      pagination: {
        pageSize: 10,
        currPage: 1
      },
      total: 0
    }
  },
  methods: {
    // 搜索
    doSearch() {},
    // 关联订单
    Associated() {
      this.$refs.Associated.dialogVisible = true
    },
    handleSizeChange() {
    //   console.log(`每页 ${val} 条`)
    },
    handleCurrentChange() {
    //   console.log(`当前页: ${val}`)
    }
  }
}
</script>

<style scoped>
::v-deep .el-pagination{
    text-align: center;
    padding-top: 20px;
}
</style>

<template>
  <div>
    <el-dialog
      title="关联订单"
      :visible.sync="dialogVisible"
      width="80%"
      :before-close="handleClose"
    >
      <el-form ref="searchForm" :model="searchForm" :inline="true">
        <el-form-item label="用户手机号" prop="stationName">
          <el-input v-model="searchForm.phone" placeholder="" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="adds" @click="doSearch">搜索</el-button>
        </el-form-item>
      </el-form>
      <!-- 表单 -->
      <el-table
        :data="tableData"
        border
        :header-cell-style="{ background: '#eff3f6' }"
        style="width: 100%"
      >
        <el-table-column
          prop="date"
          label="编号"
        />
        <el-table-column
          prop="name"
          label="订单编号"
        />
        <el-table-column
          prop="address"
          label="付款用户"
        />
        <el-table-column
          prop="address"
          label="订单金额"
        />
        <el-table-column
          prop="address"
          label="员工卡金额"
        />
        <el-table-column
          prop="address"
          label="优惠券面额"
        />
        <el-table-column
          prop="address"
          label="优惠券类型编码"
        />
        <el-table-column
          prop="address"
          label="交易时间"
        />
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
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      searchForm: {
        phone: ''
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
    doSearch() {

    },
    handleClose() {
      this.dialogVisible = false
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    }
  }
}
</script>

<style>
</style>

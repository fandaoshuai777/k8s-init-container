<template>
  <div class="tableComponent">
    <el-table
      v-loading="loading"
      class="tableComponent-table"
      :data="data"
      :cell-style="{ textAlign: 'center' }"
      border
    >
      <el-table-column v-for="item in colums" :key="item.prop" align="center" :prop="item.prop" :label="item.label" :width="item.width" :fixed="item.fixed">
        <template slot="header">
          <div class="table-header-label">
            <span>{{ item.label }}</span>
            <el-tooltip v-if="item.tips" effect="light" :content="item.tips" placement="top-start">
              <i class="el-icon-question label-question" />
            </el-tooltip>
          </div>
        </template>
        <template slot-scope="scope">
          <slot :name="item.prop" v-bind="scope" fixed="right">{{ scope.row[item.prop] }}</slot>
        </template>

      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        background
        :current-page.sync="paginationOption.currPage"
        :page-size="paginationOption.pageSize || 10"
        :pager-count="7"
        layout="total, sizes, prev, pager, next, jumper"
        :total="paginationOption.total || 0"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Array,
      default: function() {
        return []
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
    colums: {
      type: Array,
      required: true
    },
    paginationOption: {
      type: Object,
      default: function() {
        return {}
      }
    },
    height: {
      type: Number || String,
      default: 0
    }
  },
  data() {
    return {
      // tableHeight: 0
    }
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.tableHeight = window.innerHeight - this.height
    // })
  },
  methods: {
    handleCurrentChange: function(value) {
      this.$emit('currentChange', { current: value })
    },
    handleSizeChange: function(value) {
      this.$emit('sizeChange', { size: value })
    }
  }
}
</script>
<style scoped>
::v-deep .el-table thead{
  /* color: #fff; */
}
::v-deep .el-table th{
  /* background-color: #134e93; */
  /* font-size: 13px; */
}

  .tableComponent-table:hover{
    width: 100%;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
  }

  .tableComponent .pagination{
    margin: 16px 0;
    text-align: center;
  }
  .table-header-label{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .label-question{
    font-size: 14px;
    margin-left: 4px;
  }
</style>

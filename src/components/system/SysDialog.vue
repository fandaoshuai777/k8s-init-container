<template>
  <el-dialog
    top="5vh"
    :title="title"
    :visible.sync="visible"
    :width="width+'px'"
    :before-close="onClose"
    :close-on-click-modal="false"
  >
    <div class="containner">
      <slot name="content" />
    </div>
    <span v-if="display" slot="footer" class="dialog-footer">
      <el-button @click="onClose">取 消</el-button>
      <el-button type="primary" @click="onComfig">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '标题'
    },
    width: {
      type: Number,
      default: 250
    },
    height: {
      type: Number,
      default: 300
    },
    visible: {
      type: Boolean,
      default: false
    },
    display: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 点击取消
    onClose() {
      this.$emit('onClone')
    },
    // 点击确认
    onComfig() {
      this.$emit('onComfig')
    }
  }
}
</script>

<style lang="scss" scope>
.container {
  overflow-x: initial;
  overflow-y: auto;
}
/* .el-dialog {
  border-top-left-radius: 7px !important;
  border-top-right-radius: 7px !important;
  .el-dialog__header {
    border-top-left-radius: 7px !important;
    border-top-right-radius: 7px !important;
    background-color: #1890ff !important;
    .el-dialog__title {
      color: #fff;
      font-size: 16px;
      font-weight: 600;
    }
    .el-dialog__close {
      color: #fff;
    }
  }
  .el-dialog__body {
    padding: 10px;
  }
  .el-dialog__footer {
    border-top: 1px solid #e8eaec !important;
    padding: 10px;
    text-align: center;
  }
} */
</style>

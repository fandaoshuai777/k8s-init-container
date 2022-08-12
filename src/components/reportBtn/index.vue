<template>
  <div class="disp">
    <el-button
      plain
      type="primary"
      :disabled="displayed"
      @click="Report"
    ><span>{{ displayed ? num + "s" : "导出" }}</span></el-button>
  </div>
</template>
<script>
// import { downloadBlob } from '@/utils/downLoad'
export default {
  data() {
    return {
      num: 20,
      displayed: false,
      fileName: '',
      url: '',
      info: {}
    }
  },
  methods: {
    // // 导出
    Reports() {
      var vm = this
      vm.displayed = true
      // 控制倒计时及按钮是否可以点击
      const TIME_COUNT = 60
      vm.num = TIME_COUNT
      if (vm.displayed) {
        this.exportList(this.fileName, this.url, this.info)
      }
      clearInterval(vm.timer)

      vm.timer = window.setInterval(() => {
        if (vm.num > 0 && vm.num <= TIME_COUNT) {
          // 倒计时时不可点击
          vm.displayed = true
          // 计时秒数
          vm.num--
          // 更新按钮的文字内容
        } else {
          vm.displayed = false
        }
      }, 1000)
    },
    Report() {
      this.$emit('Report')
    }
  }
}
</script>

<style scoped>
.disp {
  display: inline-block;
  padding:  10px;
}
</style>

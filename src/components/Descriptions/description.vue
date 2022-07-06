<template>
  <div class="description_text">
    <div v-if="title" class="title">{{ title }}</div>
    <el-row :gutter="gutter">
      <el-col v-for="(item, key) in dataSource" :key="key" :span="+col" style="width:450px;marginLeft:100px" class="term-warp">
        <div class="term">{{ item.term }}</div>
        <div class="detail">{{ item.detail }}</div>

      </el-col>
    </el-row>
  </div>
</template>

<script>
const handleArrayObj = data => {
  return data
    .filter(item => item.tag === 'Description')
    .map(item => ({
      tag: item.tag,
      term: (item.data && item.data.attrs.term) || '暂无',
      detail: (item.children && item.children[0].text) || '暂无'
    }))
}

export default {
  name: 'Description',
  props: {
    title: String,
    content: [Object, Array],
    gutter: {
      type: [Number, String],
      default: 20
    },
    col: {
      type: [Number, String],
      default: 8
    }
  },

  data() {
    return {
      dataSource: handleArrayObj(this.$slots.default || [])
    }
  },
  watch: {
    content() {
      this.dataSource = handleArrayObj(this.$slots.default || [])
    } // 监听重渲染
  }
}
</script>

<style lang="scss" scoped>
.term-warp{
  display: flex;
}
.description_text {
  .title {
    font-weight: 700;
    font-size: 20px;
    line-height: 1.5;
    margin-bottom: 40px;
  }
  .term {
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    padding-bottom: 16px;
    margin-right: 8px;
    white-space: nowrap;
    border: 1px solid rgb(255, 255, 255);
    display: table-cell;
    &:after {
      content: ":";
      margin: 0 8px 0 2px;
      position: relative;
      top: -0.5px;
    }
  }
  .detail {
    font-size: 14px;
    line-height: 1.5;
    width: 100%;
    padding-bottom: 16px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    width: 50%;

  }
}

</style>

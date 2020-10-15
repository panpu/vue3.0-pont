<template>
  <div class="selectSvg">
    <el-dialog title="选择图标" :visible.sync="dialogVisible">
      <div class="svgBox">
        <span v-for="(item, index) of data" :key="index" @click="selectIcon(item)">
          <svg-icon :iconClass="item"></svg-icon>
        </span>
      </div>
    </el-dialog>
    <el-input placeholder="请输入内容" disabled v-model="val" class="input-with-select">
      <el-button slot="append" icon="el-icon-search" @click="dialogVisible = true"></el-button>
    </el-input>
  </div>
</template>

<script>
import svgData from '@/icons/svgData.js'
export default {
  name: 'SelectIcon',
  data() {
    return {
      dialogVisible: false,
      data: svgData,
      val: ''
    }
  },
  methods: {
    selectIcon(item) {
      this.val = item
      this.$emit('indexIcon', item)
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss">
.selectSvg .el-input-group__append {
  background-color: #fff;
}
.selectSvg .el-dialog__body {
  padding: 10px 20px 30px 20px;
}
.svgBox {
  display: flex;
  flex-wrap: wrap;
  & > span {
    border: 1px solid #ddd;
    width: 50px;
    height: 50px;
    box-sizing: border-box;
    justify-items: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.svgBox:after {
  content: '';
  display: table;
  clear: both;
}
</style>

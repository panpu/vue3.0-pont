<template>
  <div class="btn_list">
    <el-dropdown @command="handleCommand">
      <el-button class="t_btn" type="primary">
        <svg-icon iconClass="shaixuan"></svg-icon>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="1">待提交</el-dropdown-item>
        <el-dropdown-item command="a1">审核中</el-dropdown-item>
        <el-dropdown-item command="6">发布中</el-dropdown-item>
        <el-dropdown-item command="7">驳回</el-dropdown-item>
        <el-dropdown-item command="8">发布审核中</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-button class="t_btn" v-auth="'add'" type="primary" @click="() => this.$emit('add', 0)">
      <svg-icon iconClass="xinzengs"></svg-icon>
    </el-button>
    <!-- 删除 -->
    <el-button class="t_btn" v-auth="'del'" type="primary" @click="() => this.$emit('del')">
      <svg-icon iconClass="tree-del"></svg-icon>
    </el-button>
    <!-- 导入 -->
    <el-button class="t_btn" v-auth="'imp'" type="primary" @click="() => this.$emit('imp')">
      <svg-icon iconClass="tree-up"></svg-icon>
    </el-button>
    <!-- 导出 -->
    <el-button class="t_btn" v-auth="'export'" type="primary" @click="() => this.$emit('export')">
      <svg-icon iconClass="tree-down"></svg-icon>
    </el-button>
    <el-button class="t_btn f-r" v-auth="'submit'" type="warning" @click="() => this.$emit('sumbitCatalog')">
      <svg-icon iconClass="tree-tijiao"></svg-icon>
    </el-button>
  </div>
</template>

<script>
import { method } from 'lodash'
export default {
  name: 'actionBtns',
  methods: {
    add() {
      this.$emit('add', 0)
    },
    handleCommand(command) {
      console.log(11, command)
    }
  }
}
</script>

<style></style>

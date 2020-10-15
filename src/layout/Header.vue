<template>
  <el-header>
    <el-row type="flex">
      <el-row align="middle">
        <div class="logo">
          <img width="62" height="27" src="~@/assets/icons/logo.png" />
        </div>
      </el-row>
      <span style="margin-left:20px">|</span>
      <el-menu
        background-color="transparent"
        :default-active="activeMenu"
        :router="true"
        class="top-menu"
        mode="horizontal"
      >
        <template v-for="item of navDate">
          <el-menu-item :index="item.path" :key="item.path">{{ item.meta.title }}</el-menu-item>
        </template>
      </el-menu>
    </el-row>
    <el-row class="logout">
      <span>{{ userInfo.realName }}</span>
      |
      <span @click="logout">注销</span>
    </el-row>
  </el-header>
</template>

<script>
import { UserModule } from '@/store/modules/user'
export default {
  name: 'Header',
  data() {
    return {
      userInfo: UserModule.userInfo
    }
  },
  props: {
    navDate: Array
  },
  methods: {
    logout: UserModule.LogOut
  },
  computed: {
    activeMenu() {
      const { matched } = this.$route
      return matched[0].path
    }
  }
}
</script>

<style lang="scss" scoped>
.el-header {
  background-color: #20243d;
  line-height: 60px;
  color: #ffffff;
  display: flex;
  justify-content: space-between;
}
.logo {
  height: 60px;
  display: flex;
  align-items: center;
}
.logout {
  font-size: 12px;
  font-weight: 400;
  cursor: pointer;
}
::v-deep .el-menu.el-menu--horizontal {
  border: none;
  .el-menu-item {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    padding: 0;
    margin: 0 20px;
    color: #ffffff;
    height: 50px;
    line-height: 60px;
    &:hover,
    &:focus {
      background: transparent !important;
      color: #ffffff !important;
    }
  }

  .el-menu-item.is-active {
    border-bottom: 2px solid #ffffff;
    color: #ffffff;
  }
}
</style>

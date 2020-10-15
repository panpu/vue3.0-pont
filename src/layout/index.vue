<template>
  <div class="app-wrapper">
    <Header :navDate="menuData" />
    <el-container class="content-wrapper">
      <Silder :currentMenu="currentMenu" :currentActiveNav="currentActiveNav" :currentPath="currentPath" />
      <div class="content">
        <i-breadcrumb />
        <el-main :style="{ minWidth: isCollapse ? '1376px' : '1200px', width: width + 'px', height: height + 'px' }">
          <transition name="el-fade-in-linear">
            <router-view />
          </transition>
        </el-main>
      </div>
    </el-container>
  </div>
</template>

<script lang="ts">
import Header from './Header.vue'
import Silder from './Silder.vue'
import IBreadcrumb from '../components/Breadcrumb/index'
import { defineComponent } from '@vue/composition-api'
import { LayoutStore } from '@/store/modules/layout'

export default defineComponent({
  components: { Header, Silder, IBreadcrumb },
  data() {
    return {
      currentPath: '/home'
      // breadcrumbData: []
    }
  },
  computed: {
    isCollapse() {
      return LayoutStore.isCollapse
    },
    showEdit() {
      return this.$store.state.layout.showEdit
    },
    menuData(): any[] {
      return this.$store.state.permission.dynamicRoutes
    },
    currentMenu() {
      const matched = this.$route.matched
      return (this as any).menuData.filter(item => item.path === matched[0].path)
    },
    currentActiveNav() {
      return this.$route.matched[1].path
    },
    height() {
      const mainHeight = this.$store.getters.mainHeight
      return mainHeight
    },
    width() {
      return this.isCollapse ? this.$store.state.client.width - 64 : this.$store.state.client.width - 240
    }
  },
  mounted() {
    this.currentPath = this.$route.path
  },
  watch: {
    $route(to) {
      // LayoutStore.toggleEdit()
      this.$nextTick(() => {
        this.currentPath = to.fullPath
      })
    }
  }
})
</script>

<style lang="scss" scoped>
.app-wrapper {
  height: 100%;
  width: 100%;
}
.content-wrapper {
  height: calc(100% - 60px);
}
.content {
  display: flex;
  flex: auto;
  // overflow-x: scroll;
  flex-direction: column;
  // min-width: 1100px;
}

::v-deep .el-breadcrumb {
  height: 48px;
  background: #ffffff;
  padding-left: 16px;
  line-height: 48px;
  box-shadow: 1px 1px 12px rgba(33, 76, 217, 0.16);
  opacity: 1;
}
</style>

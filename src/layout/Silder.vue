<template>
  <el-menu
    :unique-opened="uniqueOpened"
    collapse-transition
    :default-openeds="uniqueOpened ? defaultOpeneds : null"
    :collapse="isCollapse"
    class="collapse"
    :default-active="currentPath"
  >
    <el-menu-item class="menu-title" :class="{ openS: isCollapse }">
      <span v-if="!isCollapse">{{ silderTitle }}</span>
      <div @click="toggle" v-if="!isCollapse">
        <svg-icon icon-class="open"></svg-icon>
      </div>
      <div @click="toggle" v-else><svg-icon icon-class="close"></svg-icon></div>

      <!-- <OpenSvg @click="toggle" style="width:24px" v-if="!isCollapse" />
      <CloseSvg @click="toggle" style="width:24px" v-else /> -->
    </el-menu-item>
    <el-scrollbar :style="{ height: height + 'px' }">
      <silder-item
        v-for="route of silderData"
        :key="parentPath + '/' + route.path"
        :item="route"
        :isCollapse="isCollapse"
        :basePath="parentPath === '/home' ? parentPath : parentPath + '/' + route.path"
      ></silder-item>
    </el-scrollbar>
  </el-menu>
</template>
<script lang="ts">
import SilderItem from './SilderItem.vue'
import { defineComponent, PropType } from '@vue/composition-api'
import config from '@/config/config'
import { LayoutStore } from '@/store/modules/layout'
export default defineComponent({
  components: {
    SilderItem
  },
  props: {
    currentMenu: Array as PropType<any[]>,
    currentActiveNav: String,
    currentPath: String
  },
  computed: {
    isCollapse() {
      return LayoutStore.isCollapse
    },
    silderTitle() {
      return this.currentMenu[0].meta.title
    },
    silderData() {
      return this.currentMenu[0].children
    },
    parentPath() {
      return this.currentMenu[0].path
    },
    defaultOpeneds() {
      return [this.currentActiveNav]
    },
    height() {
      return this.$store.state.client.height - 47
    }
  } as any,
  data() {
    return {
      uniqueOpened: config.uniqueOpened
      // defaultOpeneds: []
    }
  },
  methods: {
    toggle: LayoutStore.toggleCollaps
  }
})
</script>

<style lang="scss" scoped>
.collapse:not(.el-menu--collapse) {
  flex: 0 0 240px;
  width: 240px;
}
.el-menu--collapse {
  flex: 0 0 64px;
  > .el-menu-item {
    justify-content: center;
  }
}
.el-menu {
  transition: all 0.2s;
  box-shadow: 1px 1px 12px rgba(33, 76, 217, 0.16);
}
::v-deep .el-submenu__title {
  overflow: hidden;
}
.menu-title {
  color: #1e2b4d !important;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  &:hover,
  &:focus {
    background: transparent !important;
  }
  &::after {
    content: ' ';
    height: 1px;
    position: absolute;
    width: calc(100% - 40px);
    bottom: 0;
    background-color: #d8dce6; //#d8dce6;
  }
  &.openS {
    &::after {
      width: calc(100% - 20px);
    }
  }
}
</style>

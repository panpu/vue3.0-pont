<template>
  <div :class="isCollapse ? 'show-mode' : 'hide-mode'">
    <template v-if="!hasChild">
      <router-link :to="basePath">
        <el-menu-item :index="basePath">
          <svg-icon :iconClass="item.meta.icon"></svg-icon>
          <!-- <i-icon :name="item.meta.icon" /> -->
          <span slot="title">{{ title }}</span>
        </el-menu-item>
      </router-link>
    </template>
    <el-submenu v-if="hasChild" :index="basePath">
      <template slot="title">
        <svg-icon :iconClass="item.meta.icon"></svg-icon>
        <span slot="title">{{ item.meta.title }}</span>
      </template>
      <template v-if="item.children">
        <silder-item
          v-for="child of item.children"
          :key="basePath + '/' + child.path"
          :item="child"
          :is-collapse="isCollapse"
          :basePath="basePath + '/' + child.path"
        />
      </template>
    </el-submenu>
  </div>
</template>

<script>
export default {
  name: 'SilderItem',
  data() {
    return {}
  },
  props: {
    item: Object,
    basePath: String,
    isCollapse: {
      type: Boolean,
      defaule: false
    }
  },
  computed: {
    hasChild() {
      //判断是否有子导航
      return this.item.children.length > 0
    },
    index() {
      //判断是否有子导航
      return this.basePath
    },
    title() {
      return this.item.meta.title
    }
  }
}
</script>

<style lang="scss">
$w: 6px;

.show-mode {
  .el-submenu {
    overflow: hidden;
    &.is-active {
      & > .el-submenu__title {
        color: #4da1ff;
      }
    }
    & > .el-submenu__title {
      height: 44px;
      line-height: 44px;
      // color: #4da1ff;
      text-align: center;
      .el-submenu__icon-arrow {
        display: none;
      }
      & > span {
        display: none;
      }
    }
  }
  .el-menu-item {
    text-align: center;
    height: 44px;
    line-height: 44px;
    &.is-active {
      color: #4da1ff;
      background-color: #eff6ff;
      &::before {
        content: '';
        border-left: 4px solid #4da1ff;
        height: 44px;
        position: absolute;
        left: 0;
      }
    }
    & > span {
      margin-left: $w;
    }
  }
}
.hide-mode {
  .el-menu-item {
    height: 44px;
    line-height: 44px;
    &.is-active {
      color: #4da1ff;
      background-color: #eff6ff;
      &::before {
        content: '';
        border-left: 4px solid #4da1ff;
        height: 44px;
        position: absolute;
        left: 0;
      }
    }
    & > span {
      margin-left: $w;
    }
  }
  .el-submenu {
    & > .el-submenu__title {
      height: 44px;
      line-height: 44px;
      & > span {
        margin-left: $w;
      }
    }
    .el-menu-item {
      height: 44px;
      line-height: 44px;
      &.is-active {
        // border-left: 4px solid #4da1ff;
        color: #4da1ff;
        background-color: #eff6ff;
        &::before {
          content: '';
          border-left: 4px solid #4da1ff;
          height: 44px;
          position: absolute;
          left: 0;
        }
      }
      & > span {
        margin-left: $w;
      }
    }
  }
}
</style>

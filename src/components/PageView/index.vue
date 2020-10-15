<template>
  <el-row type="flex" class="page-view">
    <div v-if="$slots.left" class="page-left panel">
      <slot name="left" />
    </div>
    <div class="page-right panel" :style="{ width: mainWidth + 'px' }">
      <div v-show="!visible">
        <slot />
      </div>
      <slot name="common" v-if="visible" />
    </div>
  </el-row>
</template>

<script lang="tsx">
import { computed, defineComponent } from '@vue/composition-api'
import { LayoutStore } from '@/store/modules/layout'
export default defineComponent({
  name: 'PageView',
  props: { visible: Boolean },
  computed: {
    mainWidth() {
      const w = (this as any).$store.state.client.width
      return LayoutStore.isCollapse ? w - 64 - 32 : w - 240 - 32
    }
  }
})
</script>

<style lang="scss" scoped>
.page-view {
  height: 100%;
  .page-left {
    flex: 0 0 272px;
    background: #fff;
    margin-right: 16px;
  }
  .page-right {
    flex: 1;
  }
}
</style>

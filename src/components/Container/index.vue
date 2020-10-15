<template>
  <div class="l_container">
    <div ref="header" v-if="$slots.header" class="l_top">
      <slot name="header"></slot>
    </div>
    <div ref="section">
      <slot name="section" :height="height"></slot>
    </div>
    <div ref="footer" v-if="$slots.footer" class="l_footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'IContainer',
  data() {
    return {
      header_height: 0,
      footer_height: 0
    }
  },
  props: {},
  computed: {
    height() {
      return this.$store.getters.mainHeight - 60 - this.header_height - this.footer_height
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.header_height = this.$refs.header ? this.$refs.header.offsetHeight : 0
      this.footer_height = this.$refs.footer ? this.$refs.footer.offsetHeight : 0
    })
  }
})
</script>

<style lang="scss" scoped>
.l_container {
  padding: 30px 20px;
  .l_top {
    padding-bottom: 26px;
  }
  .l_footer {
    padding-top: 30px;
    float: right;
  }
}
</style>

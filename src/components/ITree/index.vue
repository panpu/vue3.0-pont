<script lang="tsx">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  setup(props, ctx) {
    return <el-tree props={ctx.attrs} on={ctx.listeners} />
  }
})
</script>
<style lang="scss" scoped></style>

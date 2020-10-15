<script lang="tsx">
import { defineComponent, reactive } from '@vue/composition-api'
export default defineComponent({
  name: 'review-tree',
  setup() {
    const state = reactive({
      type: '1'
    })
    return () => (
      <el-tabs class='tab_box' v-model={state.type}>
        <el-tab-pane label='部门' name='1'></el-tab-pane>
        <el-tab-pane label='主题' name='2'></el-tab-pane>
        <el-tab-pane label='行业' name='3'></el-tab-pane>
        <el-tab-pane label='服务' name='4'></el-tab-pane>
      </el-tabs>
    )
  }
})
</script>
<style lang="scss" scoped></style>

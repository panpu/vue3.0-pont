<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'contentHeader',
  functional: true,
  render: function(h, ctx) {
    const { props } = ctx
    const { search, actions } = ctx.scopedSlots
    if (search || actions) {
      return (
        <el-row type='flex' ref='header' justify='space-between'>
          <el-row type='flex' justify='start' gutter={5}>
            {actions && [...actions()]}
          </el-row>
          {search && (
            <el-row type='flex' class='query'>
              {search().map(node => (
                <el-col style='margin-right:10px'>{node}</el-col>
              ))}
              <el-button style='height:36px' type='primary' onClick={() => props.searchAction()}>
                查询
              </el-button>
              <el-button style='height:36px' onClick={() => props.cleanAction()}>
                重置
              </el-button>
            </el-row>
          )}
        </el-row>
      )
    }
  }
})
</script>

<style lang="scss">
.query .el-button--medium {
  padding: 10px 25px;
}
</style>

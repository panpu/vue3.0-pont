<script>
import { defineComponent } from '@vue/composition-api'

function defSlot(attrs, render) {
  return p => {
    let val = p.row[attrs.prop]
    switch (attrs.valType) {
      case 'date':
        val = day(val).format('YYYY-MM-DD HH:mm:ss')
        break
      default:
        break
    }
    const renderNode = render?.({ val, ...p })
    const Node = render ? renderNode : val
    return !attrs?.prop && render ? <el-row type='flex'>{[...renderNode]}</el-row> : Node
  }
}

export default defineComponent({
  name: 'TableLists',
  props: {
    data: Array,
    columns: Array,
    selection: {
      type: Boolean,
      default: false
    },
    loading: Boolean,
    count: {
      type: Object,
      default: () => {
        return {
          current: 1,
          pageSize: 10
        }
      }
    }
  },

  // functional: true,
  render: function(h) {
    let indexStatus = false

    const count = (this.count.current - 1) * this.count.pageSize

    const attrs = this.$attrs
    const selection = this.selection ? <el-table-column type='selection' align='center' /> : []
    const columns = this.columns?.map(({ render, ...attrs }) => {
      // const index = <el-table-column type='index' align='center' scopedSlots={{ header: () => '序号' }} />
      const index = (
        <el-table-column
          props={{ ...attrs }}
          scopedSlots={{
            header: () => '序号',
            default: ({ $index, row }) => {
              let index
              if (row.id === -1) {
                indexStatus = true
              }
              if (indexStatus) {
                if (row.id === -1) {
                  index = ''
                } else {
                  index = count + $index
                }
              } else {
                index = count + $index + 1
              }
              return index
            }
          }}
        />
      )
      return attrs.type === 'index' ? (
        index
      ) : (
        <el-table-column
          props={{ showOverflowTooltip: true, ...attrs }}
          scopedSlots={{ default: defSlot(attrs, render) }}
        />
      )
    })
    const tableColumn = [selection, ...(columns || [])]
    return (
      <el-table
        ref='table'
        stripe
        class='table-list'
        data={this.data}
        element-loading-text='数据拼命加载中'
        element-loading-spinner='el-icon-loading'
        element-loading-background='rgba(0, 0, 0, 0.8)'
        v-loading={this.loading}
        style={{ width: '100%' }}
        props={{ rowKey: 'id', ...attrs }}
      >
        {tableColumn}
      </el-table>
    )
  }
})
</script>

<style lang="scss">
.table-list {
  background: #ffffff;
  box-shadow: 0px 0px 6px rgba(20, 53, 162, 0.16);
  opacity: 1;
  border-radius: 10px;
  &.el-table--medium th {
    padding: 12px 0;
    background-color: #f7f8fe;
  }
  &.el-table--medium td {
    padding: 5px 0;
  }
  &.el-table--striped .el-table__body tr.el-table__row--striped td {
    background: #f8fbff;
  }
  &.el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #f7f8fe;
  }
  &.el-table th.is-leaf,
  &.el-table td {
    border-bottom: 1px solid #f0f3ff;
  }
}
</style>

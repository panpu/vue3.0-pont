import { defineComponent, PropType, ref } from '@vue/composition-api'
import { Message, MessageBox } from 'element-ui'

interface DelProps {
  render?: string | JSX.Element | (() => string | JSX.Element)
  fetch?: () => any
}

export default defineComponent<DelProps>({
  inheritAttrs: false,
  name: 'i-delete',
  props: {
    render: { type: [Function, String], default: '删除' },
    fetch: Function
  },
  setup(props, { emit, attrs, slots }) {
    const loading = ref(false)

    async function handle() {
      const res = await MessageBox.confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {})
      if (res) {
        loading.value = false
        props
          .fetch?.()
          ?.finally(() => (loading.value = false))
          ?.then(v => {
            if (v.code) {
              emit('ok')
              Message({ type: 'success', message: v.msg })
            }
          })
      }
    }
    return () => (
      <el-button onClick={handle} props={{ type: 'text', loding: loading.value, ...attrs }}>
        {typeof props.render == 'function' ? props.render?.() : props.render}
      </el-button>
    )
  }
})

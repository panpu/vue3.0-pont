import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'i-icon',
  props: { name: String },
  setup(props, { listeners }) {
    return () => <i on={listeners} class={`iconfont ali-icon-${props.name}`} />
  }
})

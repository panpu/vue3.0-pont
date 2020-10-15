<template>
  <i-form v-on="$listeners" :items="items" :model="model" />
</template>

<script lang="tsx">
import { IFormItem } from '@/components/Form/interface'
import { defineComponent, PropType } from '@vue/composition-api'

export default defineComponent({
  props: {
    info: {
      type: Object as PropType<{
        name: string
        age: string
      }>
    }
  },
  data() {
    return {
      model: { ...this.info },
      items: [
        { prop: 'name', label: 'name', col: { span: 24 }, required: true },
        { prop: 'age', label: 'age' }
      ] as IFormItem[]
    }
  }
})
</script>

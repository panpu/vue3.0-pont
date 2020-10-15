<script lang="tsx">
import IForm from '@/components/Form'
import { defineComponent, reactive, ref } from '@vue/composition-api'

export default defineComponent({
  setup(props, { emit }) {
    const state = reactive({
      formData: {
        updateStatus: ''
      }
    })
    const form = ref<any>(null)
    const rules = {
      updateStatus: [{ required: true, message: '请选择活动资源' }]
    }
    const formItems = [
      {
        prop: 'updateStatus',
        label: '用户昵称',
        required: true,
        render: () => (
          <el-radio-group v-model={state.formData.updateStatus}>
            <el-radio label='线上品牌商赞助'></el-radio>
            <el-radio label='线下场地免费'></el-radio>
          </el-radio-group>
        )
      }
    ]
    function changeUpdate(e) {
      state.formData.updateStatus = e
    }
    return () => (
      <IForm state={state.formData} rules={rules} formItems={formItems} onCancel={() => emit('cancel')}></IForm>
    )
  }
})
</script>

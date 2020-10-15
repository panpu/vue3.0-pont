<script lang="tsx">
import IForm from '@/components/Form'
import { ITable, TableRef } from '@/components/Table'
import { defineComponent, onMounted, reactive, ref } from '@vue/composition-api'
import { Row } from 'element-ui'

export default defineComponent({
  setup(props, { emit }) {
    const state = reactive({
      formData: {
        updateStatus: 1,
        period: '',
        time: '',
        origin: '',
        owner: '',
        table: '',
        filter: ''
      },
      select: []
    })
    // 可以有多个，是render执行完成后才执行
    // onMounted(() => {
    //   console.log('onM')
    // })
    let tableRef: null | TableRef = null
    const form = ref<any>(null)
    const rules = {
      updateStatus: [{ required: true, message: '请选择更新方式' }]
    }
    const formItems = [
      {
        prop: 'updateStatus',
        label: '更新方式',
        col: {
          span: 12
        },
        required: true,
        render: () => (
          <el-radio-group v-model={state.formData.updateStatus}>
            <el-radio label={1}>一次性提供</el-radio>
            <el-radio label={2}>指定周期更新</el-radio>
            <el-radio label={3}>间隔周期更新</el-radio>
          </el-radio-group>
        )
      },
      {
        prop: 'period',
        label: '调度周期',
        required: true,
        col: {
          span: 12
        },
        render: () => (
          <el-select v-model={state.formData.period}>
            <el-option value={1} label='1个月' />
            <el-option value={2} label='2个月' />
          </el-select>
        )
      },
      {
        prop: 'time',
        label: '指定时间',
        required: true,
        col: {
          span: 12
        },
        render: () => (
          <el-select v-model={state.formData.time}>
            <el-option value={1} label='部门开放' />
            <el-option value={2} label='社会开放' />
          </el-select>
        )
      },
      {
        prop: 'origin',
        label: '数据源',
        required: true,
        col: {
          span: 12
        },
        render: () => (
          <el-select v-model={state.formData.origin}>
            <el-option value={1} label='部门开放' />
            <el-option value={2} label='社会开放' />
          </el-select>
        )
      },
      {
        prop: 'owner',
        label: '所有者',
        required: true,
        col: {
          span: 12
        },
        render: () => (
          <el-select v-model={state.formData.owner}>
            <el-option value={1} label='部门开放' />
            <el-option value={2} label='社会开放' />
          </el-select>
        )
      },
      {
        prop: 'table',
        label: '表',
        required: true,
        col: {
          span: 12
        },
        render: () => (
          <el-select v-model={state.formData.table}>
            <el-option value={1} label='部门开放' />
            <el-option value={2} label='社会开放' />
          </el-select>
        )
      },
      {
        prop: 'filter',
        label: '过滤条件',
        col: {
          span: 12
        },
        render: () => (
          <el-select v-model={state.formData.filter}>
            <el-option value={1} label='部门开放' />
            <el-option value={2} label='社会开放' />
          </el-select>
        )
      }
    ]
    function changeUpdate(e) {
      state.formData.updateStatus = e
    }
    const columns = [
      { label: '字段名称', prop: 'id' },
      { label: '字段说明', prop: 'nikeName' },
      { label: '数据类型', prop: 'realName' },
      { label: '是否主键', prop: 'realName' },
      { label: '是否为空', prop: 'realName' },
      { label: '脱敏类型', prop: 'realName' },
      { label: '脱敏规则', prop: 'realName' }
    ]
    return () => (
      <IForm state={state.formData} rules={rules} formItems={formItems} onCancel={() => emit('cancel')}>
        <ITable
          noPagination
          selection={state.select}
          getRef={table => (tableRef = table)}
          columns={columns}
          fetch={API.manageCenterServer.user.list.request}
        />
      </IForm>
    )
  }
})
</script>
<style lang="scss" scoped>
::v-deep .el-form-item__label {
  font-weight: 500;
}
</style>

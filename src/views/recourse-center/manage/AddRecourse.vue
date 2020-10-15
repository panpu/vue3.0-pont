<script lang="tsx">
import { TreeSelect } from '@/components/components'
import IForm from '@/components/Form'
import { IFormItem } from '@/components/Form/interface'
import { defineComponent, reactive, ref } from '@vue/composition-api'
import { Message } from 'element-ui'
import { ITable, TableRef } from '@/components/Table'
import AddSql from './AddSql.vue'
import AddRestful from './AddRestful.vue'
import AddFile from './AddFile.vue'
export default defineComponent({
  name: 'AddRecourse',
  setup(props, { emit }) {
    const state = reactive({
      showEdit: false,
      isEdit: false,
      addType: ''
    })
    let formData = reactive({
      type: '',
      content: ''
    })
    let model = reactive({
      nikeName: '',
      realName: '',
      email: '',
      userType: null as any,
      password: '',
      phone: '',
      powerIdList: [],
      account: '',
      deptIdList: [],
      roleIdList: [],
      visibleIdList: []
    })
    const formItems: IFormItem[] = [
      {
        prop: 'nikeName',
        label: '标识符',
        required: true,
        col: {
          span: 8
        },
        render: () => <el-input v-model={model.nikeName} />
      },
      {
        prop: 'account',
        label: '资源名称',
        required: true,
        col: {
          span: 8
        },
        render: () => <el-input v-model={model.account} />
      },
      {
        prop: 'account',
        label: '关键字',
        required: true,
        col: {
          span: 8
        },
        render: () => <el-input v-model={model.account} />
      },
      {
        prop: 'account',
        label: '数据提供方',
        required: true,
        col: {
          span: 8
        },
        render: () => <el-input v-model={model.account} />
      },
      {
        prop: 'account',
        label: '数据维护方',
        required: true,
        col: {
          span: 8
        },
        render: () => <el-input v-model={model.account} />
      },
      {
        prop: 'userType',
        label: '开放范围',
        required: true,
        col: {
          span: 8
        },
        render: () => (
          <el-select v-model={model.userType}>
            <el-option value={1} label='部门开放' />
            <el-option value={2} label='社会开放' />
          </el-select>
        )
      },
      {
        prop: 'userType',
        label: '共享级别',
        required: true,
        col: {
          span: 8
        },
        render: () => (
          <el-select v-model={model.userType}>
            <el-option value={1} label='无条件共享' />
            <el-option value={2} label='有条件共享' />
            <el-option value={3} label='不给予共享' />
          </el-select>
        )
      },
      {
        prop: 'userType',
        label: '授权部门',
        required: true,
        col: {
          span: 8
        },
        render: () => (
          <el-select v-model={model.userType}>
            <el-option value={1} label='授权部门1' />
            <el-option value={2} label='授权部门2' />
            <el-option value={3} label='授权部门3' />
          </el-select>
        )
      },
      {
        prop: 'userType',
        label: '部门',
        col: {
          span: 8
        },
        render: () => (
          <el-select v-model={model.userType}>
            <el-option value={1} label='部门1' />
            <el-option value={2} label='部门2' />
            <el-option value={3} label='部门3' />
          </el-select>
        )
      },
      {
        prop: 'userType',
        label: '主题',
        col: {
          span: 8
        },
        render: () => (
          <el-select v-model={model.userType}>
            <el-option value={1} label='主题1' />
            <el-option value={2} label='主题2' />
            <el-option value={3} label='主题3' />
          </el-select>
        )
      },
      {
        prop: 'userType',
        label: '行业',
        col: {
          span: 8
        },
        render: () => (
          <el-select v-model={model.userType}>
            <el-option value={1} label='行业1' />
            <el-option value={2} label='行业2' />
            <el-option value={3} label='行业3' />
          </el-select>
        )
      },
      {
        prop: 'userType',
        label: '服务',
        col: {
          span: 8
        },
        render: () => (
          <el-select v-model={model.userType}>
            <el-option value={1} label='服务1' />
            <el-option value={2} label='服务2' />
            <el-option value={3} label='服务3' />
          </el-select>
        )
      },
      {
        prop: 'userType',
        label: '资源摘要',
        col: {
          span: 24
        },
        render: () => <el-input autosize={{ minRows: 3 }} type='textarea' v-model={model.userType}></el-input>
      }
    ]
    const addTypeItems: any[] = [
      {
        prop: 'type',
        label: '关联方式',
        required: true,
        col: {
          span: 12
        },
        render: () => (
          <el-select
            onChange={e => {
              state.addType = e
            }}
            v-model={formData.type}
          >
            <el-option value='sql' label='sql关联' />
            <el-option value='rest' label='数据库关联' />
            <el-option value='file' label='文件关联' />
          </el-select>
        )
      }
    ]
    let tableRef: null | TableRef = null

    const columns = [
      { label: '数据源', prop: 'id' },
      { label: '接入类型', prop: 'nikeName' },
      { label: '描述', prop: 'realName' },
      {
        label: '操作',
        width: 130,
        render: ({ row, getData }) => [
          <el-button type='text' onClick={() => toggleEdit(row.id, false)}>
            查看
          </el-button>,
          <el-button type='text' onClick={() => toggleEdit(row.id, true)}>
            编辑
          </el-button>
        ]
      }
    ]
    function submit() {
      Message.success('ok')
      emit('ok')
      return new Promise(() => {})
    }
    function toggleEdit(id, isEdit) {
      console.log(id)
      state.showEdit = !state.showEdit
      if (isEdit) {
        state.isEdit = isEdit
      }
    }
    function handleCommand(e) {
      state.addType = e ? e : ''
    }
    return () => (
      <div class='fullScreen'>
        <IForm state={model} ok={submit} onCancel={() => emit('cancel')} formItems={formItems}>
          <el-dropdown trigger='click' onCommand={handleCommand}>
            <el-button type='primary'>
              <i-icon name='tianjia' />
              新增关联
            </el-button>
            <el-dropdown-menu slot='dropdown'>
              <el-dropdown-item command='sql'>MySQL</el-dropdown-item>
              <el-dropdown-item command='rest'>restful</el-dropdown-item>
              <el-dropdown-item command='file'>文件</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <IForm state={formData} formItems={addTypeItems} footer={null}>
            <el-tabs v-model={state.addType} type='card' onClick={handleCommand}>
              <el-tab-pane disabled={formData.type !== 'rest'} label='MySQL' name='sql'>
                <AddSql onCancel={handleCommand} />
              </el-tab-pane>
              <el-tab-pane label='restful' name='rest'>
                <AddRestful onCancel={handleCommand} />
              </el-tab-pane>
              <el-tab-pane label='文件' name='file'>
                <AddFile onCancel={handleCommand} />
              </el-tab-pane>
            </el-tabs>
          </IForm>
        </IForm>
      </div>
    )
  }
})
</script>
<style lang="scss" scoped>
::v-deep .i-table {
  box-shadow: none;
  padding: 0;
  margin-top: 20px;
}
.fullScreen {
  height: 100%;
  width: 100%;
  overflow: auto;
}
</style>

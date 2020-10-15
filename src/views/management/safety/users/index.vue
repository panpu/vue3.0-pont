<script lang="tsx">
import { defineComponent, nextTick, onMounted, reactive, ref, watch } from '@vue/composition-api'
import Edit from './edit.vue'
import { ITableColumn } from '@/components/Table/interface'
import { ITable, PageView, TreeSelect } from '@/components/components'
import { TableRef } from '@/components/Table'

export default defineComponent({
  setup(props) {
    const state = reactive({
      role: [] as any,
      dept: [] as defs.manageCenterServer.DeptTreeDomain[],
      showEdit: false,
      currentId: ''
    })
    const queryParams = reactive<defs.manageCenterServer.ReqUserListDomain>({
      roleId: '',
      startTime: '',
      endTime: '',
      deptId: '',
      keywords: ''
    })
    let tableRef: null | TableRef = null
    const toggleEdit = (id?) => {
      state.currentId = id
      state.showEdit = !state.showEdit
    }

    onMounted(() => {
      API.manageCenterServer.role.list.request({}, {}).then(res => {
        state.role = res.data
      })
      API.manageCenterServer.dept.treeList.request({}).then(res => {
        state.dept = res.data!
      })
    })

    const columns: ITableColumn[] = [
      { label: '用户名', prop: 'id' },
      { label: '用户昵称', prop: 'nikeName' },
      { label: '真实姓名', prop: 'realName' },
      { label: '所属部门', prop: 'deptName' },
      { label: '角色', prop: 'realName' },
      { label: '邮箱', prop: 'email' },
      { label: '电话', prop: 'phone' },
      { label: '创建时间', prop: 'createTime', valType: 'date' },
      {
        label: '操作',
        width: 130,
        render: ({ row, getData }) => [
          <el-button type='text'>查看</el-button>,
          <el-button type='text' onClick={() => toggleEdit(row.id)}>
            编辑
          </el-button>
        ]
      }
    ]

    return () => (
      <PageView visible={state.showEdit}>
        <Edit
          onOk={() => {
            toggleEdit()
            tableRef!.getData?.()
          }}
          onCancel={toggleEdit}
          slot='common'
          id={state.currentId}
          list={state}
        />
        <ITable
          getRef={table => (tableRef = table)}
          state={queryParams}
          columns={columns}
          delFetch={API.manageCenterServer.user.delByIds.request}
          importFetch={API.manageCenterServer.user.excelImport.request}
          exportFetch={API.manageCenterServer.user.exportData.request}
          fetch={API.manageCenterServer.user.list.request}
          scopedSlots={{
            actions: () => (
              <el-button type='primary' onClick={() => toggleEdit()}>
                <i-icon name='xinzeng' /> 新增
              </el-button>
            ),
            query: () => {
              return [
                <el-input v-model={queryParams.keywords} placeholder='昵称/名称' />,
                <TreeSelect
                  renderContent={(h, { data }) => <span>{data.name}</span>}
                  v-model={queryParams.deptId}
                  selectParams={{ placeholder: '部门' }}
                  treeParams={{
                    data: state.dept,
                    props: {
                      children: 'deptTreeDomainList',
                      label: 'name',
                      value: 'id'
                    }
                  }}
                />,
                <el-select v-model={queryParams.roleId} placeholder='角色'>
                  {state.role?.map(v => (
                    <el-option label={v.name} value={v.id} />
                  ))}
                </el-select>
              ]
            }
          }}
        />
      </PageView>
    )
  }
})
</script>

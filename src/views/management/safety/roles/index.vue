<script lang="tsx">
import { defineComponent, nextTick, onMounted, reactive, ref } from '@vue/composition-api'
import Edit from './edit.vue'
import { ITableColumn } from '@/components/Table/interface'
import { ITable, PageView, TreeSelect } from '@/components/components'
import { TableRef } from '@/components/Table'

export default defineComponent({
  setup(props) {
    const state = reactive({
      showEdit: false,
      currentId: ''
    })
    const queryParams = reactive<defs.manageCenterServer.ReqListDomain>({
      startTime: '',
      endTime: '',
      roleName: ''
    })
    let tableRef: null | TableRef = null

    const toggleEdit = (id?) => {
      state.currentId = id
      state.showEdit = !state.showEdit
    }

    const columns: ITableColumn[] = [
      { label: 'id', prop: 'id' },
      { label: '名称', prop: 'roleName' },
      { label: '描述', prop: 'describe' },
      { label: '管理模块', prop: 'authorityNameList' },
      { label: '关联操作', prop: 'deptId' },
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
            tableRef!.getData()
          }}
          onCancel={toggleEdit}
          slot='common'
          id={state.currentId}
        />
        <ITable
          getRef={table => (tableRef = table)}
          state={queryParams}
          columns={columns}
          delFetch={API.manageCenterServer.role.delByIds.request}
          fetch={API.manageCenterServer.role.list.request}
          scopedSlots={{
            actions: () => (
              <el-button type='primary' onClick={() => toggleEdit()}>
                <i-icon name='xinzeng' /> 新增
              </el-button>
            ),
            query: () => [<el-input v-model={queryParams.roleName} placeholder='名称' />]
          }}
        />
      </PageView>
    )
  }
})
</script>

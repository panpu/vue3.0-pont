<!--
 * @Author: your name
 * @Date: 2020-09-23 19:13:46
 * @LastEditTime: 2020-09-27 16:07:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \exchange-management-web\src\views\management\notice\notice-group.vue
-->
<script lang="tsx">
import { defineComponent, reactive } from '@vue/composition-api'
import PageView from '@/components/PageView'
import GroupEdit from './group-edit.vue'
import { ITable } from '@/components/Table'
import { ITableColumn } from '@/components/Table/interface'
import { TableRef } from '@/components/Table'
import { Message, MessageBox } from 'element-ui'
export default defineComponent({
  setup() {
    const state = reactive({
      role: [] as any,
      dept: [] as defs.manageCenterServer.DeptTreeDomain[],
      showEdit: false,
      currentId: '',
      selection: []
    })
    let tableRef: null | TableRef = null
    // 请求参数接口
    const queryParams = reactive<defs.manageCenterServer.ReqNoticeGroupDomain>({
      endTime: '',
      groupName: '',
      startTime: ''
    })
    const columns: ITableColumn<defs.manageCenterServer.RespNoticeGroupDomain>[] = [
      { label: '通知组名称', prop: 'groupName' },
      { label: '通知类型', prop: 'groupType' },
      { label: '备注', prop: 'remark' },
      { label: '创建时间', prop: 'createTime', valType: 'date' },
      { label: '更新时间', prop: 'updateTime', valType: 'date' },
      { label: '创建人', prop: 'createBy' },
      {
        label: '操作',
        width: 130,
        render: ({ row, getData }) => [
          <el-button type='text' onClick={() => toggleEdit(row.id)}>
            查看
          </el-button>,
          <el-button type='text' onClick={() => toggleEdit(row.id)}>
            编辑
          </el-button>
        ]
      }
    ]
    return () => (
      <PageView visible={state.showEdit}>
        <GroupEdit
          onOk={() => {
            toggleEdit()
            tableRef!.getData?.()
          }}
          onCancel={toggleEdit}
          slot='common'
          id={state.currentId}
          list={state}
        ></GroupEdit>
        <ITable
          // selection={state.selection}
          getRef={table => (tableRef = table)}
          state={queryParams}
          columns={columns}
          fetch={API.manageCenterServer.noticeGroup.list.request}
          delFetch={API.manageCenterServer.noticeGroup.delByIds.request}
          scopedSlots={{
            actions: () => (
              <el-button type='primary' onClick={() => toggleEdit()}>
                <i-icon name='xinzeng' /> 新增
              </el-button>
            ),
            query: () => {
              return [<el-input v-model={queryParams.groupName} placeholder='通知组名称' />]
            }
          }}
        />
      </PageView>
    )
    function toggleEdit(id?) {
      state.currentId = id
      state.showEdit = !state.showEdit
    }
  }
})
</script>

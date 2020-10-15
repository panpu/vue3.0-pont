<script lang="tsx">
import { defineComponent, onMounted, reactive } from '@vue/composition-api'
import GroupEdit from './group-edit.vue'
import { ITable, PageView, TreeSelect } from '@/components/components'
import Delete from '@/components/Delete'
import { ITableColumn } from '@/components/Table/interface'
import { TableRef } from '@/components/Table'
import { Message } from 'element-ui'
export default defineComponent({
  setup() {
    const state = reactive({
      role: [] as any,
      x: [],
      dept: [] as defs.manageCenterServer.DeptTreeDomain[],
      showEdit: false,
      currentId: ''
    })
    let tableRef: null | TableRef = null
    // 请求参数接口
    const queryParams = reactive<defs.manageCenterServer.ReqNoticeUserListDomain>({
      deptId: '',
      endTime: '',
      startTime: '',
      fullName: ''
    })
    const columns: ITableColumn<defs.manageCenterServer.RespNoticeUserListDomain>[] = [
      {
        label: '姓名',
        prop: 'fullName',
        render: ({ val, row }) => {
          return row.__isEdit ? <el-input v-model={row.__data.fullName} /> : val
        }
      },
      {
        label: '部门',
        prop: 'deptName',
        render: ({ val, row }) => {
          return row.__isEdit ? (
            <TreeSelect
              collapse-tag
              renderContent={(h, { data }) => <span>{data.name}</span>}
              v-model={row.__data.deptId}
              selectParams={{ placeholder: '部门', multiple: true }}
              treeParams={{
                'check-strictly': true,
                data: state.dept,
                props: {
                  children: 'deptTreeDomainList',
                  label: 'name',
                  value: 'id'
                }
              }}
            />
          ) : (
            val
          )
        }
      },
      {
        label: '邮箱',
        prop: 'email',
        render: ({ val, row }) => {
          return row.__isEdit ? <el-input v-model={row.__data.email} /> : val
        }
      },
      {
        label: '电话',
        prop: 'phone',
        render: ({ val, row }) => {
          return row.__isEdit ? <el-input v-model={row.__data.phone} /> : val
        }
      },
      { label: '创建时间', prop: 'createTime', valType: 'date' },
      { label: '创建人', prop: 'createBy' },
      {
        label: '操作',
        width: 130,
        render: ({ row }) => {
          return [
            <el-button loading={row.__loading} type='text' onClick={() => saveEdit(row)}>
              {row.__isEdit ? '保存' : '编辑'}
            </el-button>,
            row.__isEdit ? (
              <el-button
                type='text'
                onClick={() => {
                  row.id ? (row.__isEdit = false) : tableRef!.data.splice(0, 1)
                }}
              >
                取消
              </el-button>
            ) : (
              <Delete fetch={() => delRow(row)} />
            )
          ]
        }
      }
    ]
    onMounted(() => {
      API.manageCenterServer.dept.treeList.request({}).then(res => {
        state.dept = res.data!
      })
    })
    return () => (
      <PageView visible={state.showEdit}>
        <ITable
          getRef={table => (tableRef = table)}
          state={queryParams}
          columns={columns}
          fetch={API.manageCenterServer.noticeUser.list.request}
          scopedSlots={{
            actions: () => (
              <el-button type='primary' onClick={() => tableRef!.data.unshift({ __isEdit: true })}>
                <i-icon name='xinzeng' /> 新增
              </el-button>
            ),
            query: () => {
              return [
                <el-input v-model={queryParams.fullName} placeholder='姓名' />,
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
                />
              ]
            }
          }}
        />
      </PageView>
    )
    function delRow(row) {
      return API.manageCenterServer.noticeUser.delByIds.request({}, [row.id]).then(res => {
        res.code && tableRef!.getData()
        return res
      })
    }
    async function saveEdit(row) {
      if (!row.__isEdit) {
        row.__isEdit = true
      } else {
        row.__loading = true
        // change
        row.__data.deptId = row.__data.deptId.toString()
        const res = await API.manageCenterServer.noticeUser.addOrUpdate
          .request({}, row.__data)
          .finally(() => (row.__loading = false))
        if (res.code) {
          tableRef!.getData()
          Message.success('保存成功。')
        }
      }
    }
  }
})
</script>

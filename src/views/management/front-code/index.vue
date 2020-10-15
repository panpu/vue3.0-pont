<script lang="tsx">
import { defineComponent, nextTick, onMounted, reactive, ref, set, watch } from '@vue/composition-api'
import Edit from './edit.vue'
import { ITableColumn } from '@/components/Table/interface'
import { ITable, PageView, TreeSelect } from '@/components/components'
import { TableRef } from '@/components/Table'
import Delete from '@/components/Delete'
import { Message } from 'element-ui'
import { cloneDeep } from 'lodash'

export default defineComponent({
  setup(props) {
    const queryParams = reactive<Partial<API.manageCenterServer.precedingCode.listPage.Params>>({
      status: undefined,
      startTime: '',
      endTime: ''
    })

    let tableRef: null | TableRef = null

    const saveEdit = row => async () => {
      if (!row.__isEdit) {
        row.__isEdit = true
      } else {
        row.__loading = true
        const { addPrecedingCode, updatePrecedingCode } = API.manageCenterServer.precedingCode
        const { request } = row.id ? updatePrecedingCode : addPrecedingCode
        const res = await request({}, row.__data).finally(() => (row.__loading = false))
        if (res.code) {
          tableRef!.getData()
          Message.success('保存成功。')
        }
      }
    }

    const delRow = row => {
      return API.manageCenterServer.precedingCode.delPrecedingCodes.request({}, [row.id]).then(res => {
        res.code && tableRef!.getData()
        return res
      })
    }

    const columns: ITableColumn<defs.manageCenterServer.PrecedingCodeListDomain>[] = [
      {
        label: '前段码',
        prop: 'code',
        render: ({ val, row }) => {
          return row.__isEdit ? <el-input v-model={row.__data.code} /> : val
        }
      },
      {
        label: '说明',
        prop: 'desc',
        render: ({ val, row }) => {
          return row.__isEdit ? <el-input v-model={row.__data.desc} /> : val
        }
      },
      { label: '状态', prop: 'status', render: ({ val }) => (val ? '已分配' : <span style='color:red'>未分配</span>) },
      { label: '部门', prop: 'deptName' },
      { label: '创建时间', prop: 'createTime', valType: 'date' },
      { label: '创建人', prop: 'createByName' },
      {
        label: '操作',
        width: 130,
        render: ({ row }) => {
          return [
            <el-button loading={row.__loading} type='text' onClick={saveEdit(row)}>
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

    return () => (
      <ITable
        methods='get'
        getRef={table => (tableRef = table)}
        state={queryParams}
        columns={columns}
        fetch={API.manageCenterServer.precedingCode.listPage.request}
        scopedSlots={{
          actions: () => (
            <el-button type='primary' onClick={() => tableRef!.data.unshift({ __isEdit: true })}>
              <i-icon name='xinzeng' /> 新增
            </el-button>
          ),
          query: () => {
            return [
              <el-input placeholder='前段码/关联部门' v-model={queryParams.keyword} />,
              <el-select placeholder='状态' v-model={queryParams.status}>
                <el-option value={20} label='未分配' />
                <el-option value={30} label='已分配' />
              </el-select>
            ]
          }
        }}
      />
    )
  }
})
</script>

<script lang="tsx">
import Delete from '@/components/Delete'
import {
  computed,
  defineComponent,
  getCurrentInstance,
  nextTick,
  onMounted,
  reactive,
  ref,
  set
} from '@vue/composition-api'
import { ITableColumn } from '@/components/Table/interface'
import { Message, Tree } from 'element-ui'
import { Data } from '@/shims-global'
import { ITable, PageView } from '@/components/components'
import { TableRef } from '@/components/Table'
import { delEmptyChild } from '@/utils'
import { cloneDeep, pull } from 'lodash'
type TreeItemData = defs.manageCenterServer.DeptTreeDomain

export default defineComponent({
  setup(props) {
    const state = reactive({
      /** 部门树是否正在批量编辑 */
      isEdit: false,
      currentId: '',
      currentData: {} as Data,
      currentExpandKeys: [] as string[],
      deptTree: [] as TreeItemData[],
      precedingCode: [] as defs.manageCenterServer.PrecedingCodeDomain[]
    })

    let tableRef: TableRef | null = null
    const treeRef = ref<null | Tree>(null)

    const queryParams = reactive<Partial<API.manageCenterServer.dept.list.Params>>({
      startTime: '',
      endTime: '',
      name: '',
      code: ''
    })

    const depTreeList = computed(() => {
      const result: any[] = []
      const fn = (arr: any[]) => {
        arr.forEach(v => {
          result.push(v)
          v.deptTreeDomainList && fn(v.deptTreeDomainList)
        })
      }
      fn(state.deptTree)
      return result
    })

    const stopEvents = (e: MouseEvent) => e.stopPropagation()

    onMounted(() => {
      getTreeData()
      tableRef!.getData()
      API.manageCenterServer.precedingCode.all.request({}).then(res => {
        if (res.code) {
          state.precedingCode = res.data!
        }
      })
    })

    const columns: ITableColumn<defs.manageCenterServer.DeptListDomain>[] = [
      {
        label: '部门名称',
        prop: 'name',
        render: ({ val, row }) => (row.__isEdit ? <el-input ref='' v-model={row.__data.name} /> : val)
      },
      {
        label: '部门编码',
        prop: 'deptNum',
        render: ({ val, row }) => (row.__isEdit ? <el-input v-model={row.__data.deptNum} /> : val)
      },
      {
        label: '部门路径',
        prop: 'path',
        render: ({ val, row }) => {
          if (typeof row.__data?.parentIds == 'string') {
            row.__data.parentIds = (row.__data.parentIds as any)
              .split(',')
              .filter(v => v)
              .map(v => Number(v))
          }
          return row.id && row.__isEdit ? (
            <el-cascader
              options={state.deptTree}
              v-model={row.__data.parentIds}
              props={{
                props: {
                  checkStrictly: true,
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
        label: '前段码',
        prop: 'code',
        render: ({ val, row }) => {
          return row.__isEdit ? (
            <el-select v-model={row.__data.precedingCodeId}>
              {state.precedingCode.map(v => (
                <el-option value={v.id} label={v.code} />
              ))}
            </el-select>
          ) : (
            val
          )
        }
      },

      {
        label: '描述',
        prop: 'describe',
        render: ({ val, row }) => (row.__isEdit ? <el-input v-model={row.__data.describe} /> : val)
      },
      { label: '创建时间', prop: 'createTime', valType: 'date' },
      {
        label: '操作',
        width: 130,
        render: ({ row, getData, $index }) => [
          <el-button loading={row.loading} type='text' onClick={() => saveEdit(row)}>
            {!row.__isEdit ? '编辑' : '保存'}
          </el-button>,
          !row.__isEdit ? (
            <Delete fetch={() => delListItem(row.id)} />
          ) : (
            <el-button type='text' onClick={() => (row.id ? (row.__isEdit = false) : tableRef!.data.splice($index, 1))}>
              取消
            </el-button>
          )
        ]
      }
    ]

    const renderContent = (h, { node, data, store }) => (
      <el-row type='flex' style='width:100%' align='middle' justify='space-between'>
        <span>{!data.isEdit ? data.name : <el-input nativeOnClick={stopEvents} v-model={data.name} />}</span>
        {data.id == state.currentId && (
          <div onClick={stopEvents}>
            <el-button type='text' onClick={addLIstItem}>
              <i-icon name='xinzeng1' />
            </el-button>
            <el-button type='text' loading={data.loading} onClick={() => updateTreeNode(data)}>
              <i-icon name={data.isEdit ? 'tijiao' : 'bianji'} />
            </el-button>
            {data.isEdit ? (
              <el-button type='text' onClick={() => (data.isEdit = false)}>
                <i-icon name='shanchu' />
              </el-button>
            ) : (
              <Delete render={() => <i-icon name='shanchu1' />} fetch={delTreeNode(data, node.parent.data)} />
            )}
          </div>
        )}
      </el-row>
    )

    return () => (
      <PageView>
        <el-card slot='left'>
          <div slot='header'>
            <el-button type='primary' size='mini' icon='el-icon-plus' circle onClick={addLIstItem} />
            <el-button
              type='primary'
              circle
              size='mini'
              icon={state.isEdit ? 'el-icon-check' : 'el-icon-edit'}
              onClick={batchUpdateName}
            />
            {state.isEdit ? (
              <el-button
                circle
                size='mini'
                type='primary'
                icon='el-icon-error'
                onClick={() => {
                  depTreeList.value.forEach(v => (v.isEdit = false))
                  state.isEdit = false
                }}
              />
            ) : (
              <Delete fetch={batchDelTreeNode} render='' size='mini' type='primary' circle icon='el-icon-delete' />
            )}
          </div>
          <el-tree
            draggable
            ref={treeRef}
            show-checkbox
            data={state.deptTree}
            default-expanded-keys={state.currentExpandKeys}
            on-node-drop={onNodeDrop}
            on-node-collapse={data => pull(state.currentExpandKeys, data.id)}
            on-node-expand={data => state.currentExpandKeys.push(data.id)}
            highlight-current
            node-key='id'
            props={{ props: { children: 'deptTreeDomainList', label: 'name' } }}
            render-content={renderContent}
            on-node-click={data => {
              state.currentData.isEdit = false
              state.currentId = data.id
              state.currentData = data
              tableRef!.getData({ id: data.id })
            }}
          />
        </el-card>
        <ITable
          methods='get'
          immediate={false}
          getRef={table => (tableRef = table)}
          state={queryParams}
          columns={columns}
          importFetch={API.manageCenterServer.dept.postImport.request}
          exportFetch={API.manageCenterServer.dept.importDept.request}
          fetch={API.manageCenterServer.dept.list.request}
          scopedSlots={{
            query: () => [
              <el-select v-model={queryParams.code} placeholder='前段码'>
                {state.precedingCode.map(v => (
                  <el-option value={v.code} label={v.code} />
                ))}
              </el-select>,
              <el-input v-model={queryParams.name} placeholder='名称' />
            ]
          }}
        />
      </PageView>
    )

    function addLIstItem() {
      if ((tableRef!.data[0] as any).id) {
        tableRef!.data.unshift({ __isEdit: true })
      }
    }

    function onNodeDrop(s, e) {
      const body = { sourceId: s.data.id, targetId: e.data.id }
      s.loading = true
      API.manageCenterServer.dept.moveDept
        .request({}, body)
        .finally(() => (s.loading = false))
        .then(getTreeData)
    }
    /** 获取部门树 */
    async function getTreeData() {
      const res = await API.manageCenterServer.dept.userVisibleTree.request({})
      if (res.code) {
        state.deptTree = delEmptyChild(res.data!, 'deptTreeDomainList')
      }
      return res.code
    }
    /**批量删除部门 */
    function batchDelTreeNode() {
      const ids = treeRef.value?.getCheckedKeys()
      if (!ids!.length) {
        Message.warning('请选择需要删除的部门！')
        return
      }
      return API.manageCenterServer.dept.delDept
        .request({}, ids || [])
        .finally(() => {})
        .then(res => {
          res.code && getTreeData()
          return res
        })
    }
    /** 批量修改部门名称 */
    function batchUpdateName() {
      if (!state.isEdit) {
        state.isEdit = true
        depTreeList.value.forEach(v => set(v, 'isEdit', true))
      } else {
        state.isEdit = true
        API.manageCenterServer.dept.updateDeptNames
          .request({}, depTreeList.value)
          .finally(() => {})
          .then(res => {
            if (res.code) {
              getTreeData()
            }
          })
      }
    }

    async function updateTreeNode(data) {
      if (data.isEdit) {
        set(data, 'loading', true)
        const res = await API.manageCenterServer.dept.updateDeptNames
          .request({}, [data])
          .finally(() => (data.loading = false))
          .then(res => {
            if (res.code) {
              data.isEdit = false
            }
          })
      } else {
        set(data, 'isEdit', true)
      }
    }

    async function delListItem(id) {
      const res = await API.manageCenterServer.dept.delDept.request({}, [id])
      if (res.code) {
        getTreeData()
        state.currentId = ''
        tableRef!.getData()
      }
      return res
    }

    /**table 编辑行 */
    async function saveEdit(row) {
      if (row.__isEdit) {
        const request = row.id
          ? API.manageCenterServer.dept.updateDept.request
          : API.manageCenterServer.dept.addDept.request
        row.__loading = true
        const { parentIds, ...data } = cloneDeep(row.__data)
        data.targetId = parentIds?.slice(-1)[0]
        data.parentId = state.currentId
        const res = await request({}, data).finally(() => (row.__loading = false))
        if (res.code) {
          getTreeData()
          tableRef!.getData({ id: state.currentId })
          Message.success('保存成功。')
          row.__isEdit = false
        }
      } else {
        row.__isEdit = true
      }
    }
    /**删除部门树某一项 */
    function delTreeNode(data: TreeItemData, parent: TreeItemData) {
      const { deptTreeDomainList } = parent
      return () => {
        if (!data.id) {
          deptTreeDomainList?.find((v: any, n) => {
            if (v.$treeNodeId == (data as any).$treeNodeId) {
              deptTreeDomainList?.splice(n, 1)
            }
          })
        } else {
          return delListItem(data.id)
        }
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.el-tree {
  font-size: 14px;
}
.el-card {
  height: 100%;
}
.el-button--mini.is-circle {
  padding: 3px;
}
::v-deep .el-tree-node__content {
  height: 40px;
}
::v-deep .el-card__header {
  height: 47px;
  line-height: 47px;
  padding: 0 20px;
}
</style>

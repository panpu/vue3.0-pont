<script lang="tsx">
import PageView from '@/components/PageView'
import { ITable, TableRef } from '@/components/Table'
import { ITableColumn } from '@/components/Table/interface'
import { defineComponent, onMounted, reactive, watchEffect } from '@vue/composition-api'
import { createModal } from '@/components/createModal'
import LeftTree from './leftTree.vue'
import { Message, Row } from 'element-ui'
import { Data } from '@/shims-global'
import { getFlowList } from '@/services/resourcesCenterServer/mods/catalogFlow'

/** 目录审核 */
export default defineComponent({
  name: 'Review',
  setup(props, ctx) {
    const queryParams = reactive<defs.resourcesCenterServer.FlowReqListDomain>({
      startTime: '',
      endTime: '',
      catalogName: '',
      status: undefined
    })

    const state = reactive({
      currentId: 0,
      catalogType: '1' as any,
      catalogStatus: undefined as any,
      selection: [] as any[],
      treeList: [] as defs.resourcesCenterServer.FlowRespDomain[],
      /**审核记录 */
      reviewRecord: '',
      auditModel: { opinion: undefined, status: undefined } as defs.resourcesCenterServer.FlowAddDomain
    })

    let tableRef: TableRef | null = null

    watchEffect(() => {
      API.resourcesCenterServer.catalogFlow.releaseTreeList
        .request({}, { catalogType: state.catalogType })
        .then(res => {
          if (res.code) {
            state.treeList = res.data!
          }
        })
    })

    const getList = () => tableRef?.getData({ parentId: state.currentId, catalogType: state.catalogType })

    onMounted(getList)

    const status = {
      1: ['待提交', '#895EFA'],
      2: ['审核中', '#4DA1FF'],
      7: ['驳回', '#FD5858'],
      6: ['待发布', '#FD5858'],
      8: ['发布审核中', '#F5D539'],
      10: ['已发布', '#BDBDBD']
    }

    const handleAutid = (ids, close: () => void, isEdit?: boolean) => async () => {
      const params = {
        catalogIdList: Array.isArray(ids) ? ids : [ids],
        operateType: 0,
        ...state.auditModel
      }
      const request = isEdit
        ? API.resourcesCenterServer.catalogFlow.examineUpdate.request
        : API.resourcesCenterServer.catalogFlow.examine.request

      const res = await request({}, params)
      if (res.code) {
        Message.success(isEdit ? '编辑成功' : '审核成功')
        getList()
      }
      close()
    }

    const reject = (data: defs.resourcesCenterServer.FlowRespDomain) => {
      const params = {
        catalogIdList: [data.catalogId!],
        operateType: 0,
        status: 5,
        opinion: state.auditModel.opinion
      }
      API.resourcesCenterServer.catalogFlow.releaseExamineReject.request({}, params)
    }

    const auditModal = (row: defs.resourcesCenterServer.FlowRespDomain, isEdit?: boolean) => () => {
      state.auditModel.opinion = undefined
      state.auditModel.status = undefined
      const params = { optType: 0, catalogId: row.catalogId! }
      API.resourcesCenterServer.catalogFlow.getFlowList.request(params).then(res => {
        if (res.code) {
          state.reviewRecord = res.data!.reduce((str, v) => str + v.opinion, '')
        }
      })

      createModal({
        title: () => (isEdit ? '编辑' : '审核'),
        footer: close => [
          <el-button onClick={() => reject(row)}>{isEdit ? '取消' : '驳回'}</el-button>,
          <el-button type='primary' onClick={handleAutid(row.catalogId, close, isEdit)}>
            {isEdit ? '保存' : '同意'}
          </el-button>,
          <div class='footer-line'></div>,
          <div class='footer-box '>
            <span style='color:#1f2d3d;font-size:14px'>审核记录：</span>
            <span class='footer-info'>{state.reviewRecord}</span>
          </div>
        ],
        render: () => (
          <div>
            <div class='modal-col'>目录路径：{row.catalogRoute} </div>
            <div class='modal-col'>待审核目录：{row.catalogName}</div>
            <div class='modal-col'>待发布目录编码：{row.catalogCode}</div>
            <div class='modal-col'>
              <div class='model-label'> 审核意见：</div>
              <el-input type='textarea' rows={3} placeholder='请输入内容' v-model={state.auditModel.opinion} />
            </div>
            {isEdit && (
              <div class='modal-col'>
                <div class='model-label'>审核状态：</div>
                <el-select placeholder='状态' clearable v-model={state.auditModel.status}>
                  {Object.keys(status).map(key => (
                    <el-option value={key} label={status[key][0]} />
                  ))}
                </el-select>
              </div>
            )}
          </div>
        )
      })
    }

    const columns: ITableColumn<defs.resourcesCenterServer.FlowRespDomain>[] = [
      { prop: 'catalogName', label: '目录名称' },
      { prop: 'catalogCode', label: '编码' },
      { prop: 'catalogRoute', label: '路径' },
      { prop: 'remark', label: '描述' },
      { prop: 'shareLevel', label: '共享级别' },
      { prop: 'status', label: '状态' },
      { prop: 'crateTime', label: '创建时间', valType: 'date' },
      {
        label: '操作',
        render: ({ row }) => [
          <el-button type='text' onClick={auditModal(row, true)}>
            编辑
          </el-button>,
          <el-button type='text' disabled={row.status !== '待审核'} onClick={auditModal(row)}>
            审核
          </el-button>
        ]
      }
    ]

    return () => (
      <PageView>
        <div slot='left'>
          <el-tabs class='tab_box' v-model={state.catalogType}>
            <el-tab-pane label='部门' name='1'></el-tab-pane>
            <el-tab-pane label='主题' name='2'></el-tab-pane>
            <el-tab-pane label='行业' name='3'></el-tab-pane>
            <el-tab-pane label='服务' name='4'></el-tab-pane>
          </el-tabs>
          <el-tree
            show-checkbox
            highlight-current
            data={state.treeList}
            node-key='id'
            on-node-click={data => {
              state.currentId = data.id
              getList()
            }}
            props={{ props: { children: 'catalogingTree', label: 'catalogName' } }}
          />
        </div>
        <ITable
          immediate={false}
          getRef={t => (tableRef = t)}
          columns={columns}
          selection={state.selection}
          fetch={API.resourcesCenterServer.catalogFlow.examineList.request}
          state={queryParams}
          scopedSlots={{
            query: () => [
              <el-input placeholder='编码/名称' clearable v-model={queryParams.catalogName} />,
              <el-select placeholder='状态' clearable v-model={queryParams.status}>
                <el-option value={1} label='待提交' />
                <el-option value={2} label='审核中' />
                <el-option value={7} label='驳回' />
                <el-option value={6} label='发布中' />
                <el-option value={8} label='发布审核' />
                <el-option value={10} label='已发布' />
              </el-select>
            ],
            actions: () => [
              <el-button icon='el-icon-user' type='primary' onClick={auditModal}>
                审核
              </el-button>,
              <el-button icon='el-icon-check' type='warning'>
                提交
              </el-button>
            ]
          }}
        />
      </PageView>
    )
  }
})
</script>

<style lang="scss">
.status-circle {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
}
.modal-col {
  margin-bottom: 12px;
}
.model-label {
  margin-bottom: 8px;
}
.footer-line {
  border-top: 1px dashed #ccc;
  margin-top: 20px;
  padding-top: 24px;
  margin-left: -40px;
  margin-right: -40px;
}
.footer-box {
  color: #6d7383;
  text-align: left;
}
.footer-info {
  font-size: 14px;
  color: #6d7383;
}
</style>

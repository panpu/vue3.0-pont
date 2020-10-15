<script lang="tsx">
import PageView from '@/components/PageView'
import { ITable } from '@/components/Table'
import { ITableColumn } from '@/components/Table/interface'
import { defineComponent, reactive } from '@vue/composition-api'
import { createModal } from '@/components/createModal'
/** 目录审计 */
export default defineComponent({
  name: 'Audit',
  setup(props, ctx) {
    const queryParams = reactive<defs.resourcesCenterServer.CatalogLogReqDomain>({
      startTime: '',
      endTime: '',
      catalogName: '',
      catalogType: undefined
    })
    const types = {
      1: '部门',
      2: '主题',
      3: '行业',
      4: '服务'
    }
    const operationDetails = data => {
      const row: defs.resourcesCenterServer.CatalogLogRespDomain = data.row
      const open = () => {
        if (row.operateType == 1) {
          const { postData, preData } = row

          const content = (title, val) => (
            <el-col span={12}>
              <div class='title'>{title}</div>
              <div class='item'>目录名称：{val.catalogName}</div>
              <div class='item'>目录类别：{types[val.catalogType]}</div>
              <div class='item'>前段码：{val.catalogCode} </div>
              <div class='item'>目录路径：</div>
              <div class='item'>描述：{val.remark} </div>
            </el-col>
          )
          return createModal({
            props: {
              customClass: 'audit-dialog'
            },
            title: () => <span>操作详情</span>,
            render: () => (
              <el-row>
                <div class='header'>
                  <el-col style='padding-left:40px' span={12}>
                    编辑人：{row.createByName}
                  </el-col>
                  <el-col span={12}>编辑时间：{row.createTime}</el-col>
                </div>
                {content('编辑前', JSON.parse(preData!))}
                {content('编辑后', JSON.parse(postData!))}
              </el-row>
            )
          })
        }
      }
      return row.operateType == 1 ? (
        <el-button type='text' onClick={open}>
          {data.val}
        </el-button>
      ) : (
        data.val
      )
    }

    const columns: ITableColumn<defs.resourcesCenterServer.CatalogLogRespDomain>[] = [
      { prop: 'catalogName', label: '目录名称' },
      { prop: 'catalogAllPath', label: '目录路径' },
      { prop: 'catalogTypeName', label: '目录类型' },
      { prop: 'operateName', label: '操作类型', render: operationDetails },
      { prop: 'createTime', label: '操作时间', valType: 'date' },
      { prop: 'createByName', label: '操作用户' }
    ]

    return () => (
      <ITable
        columns={columns}
        fetch={API.resourcesCenterServer.catalogLog.queryByPage.request}
        state={queryParams}
        exportFetch={API.resourcesCenterServer.catalogLog.exportData.request}
        scopedSlots={{
          query: () => [
            <el-input placeholder='目录名称/操作类型' clearable v-model={queryParams.queryMerge} />,
            <el-select placeholder='请选择目录类型别' clearable v-model={queryParams.catalogType}>
              {Object.keys(types).map(key => (
                <el-option value={key} label={types[key]} />
              ))}
            </el-select>
          ]
        }}
      />
    )
  }
})
</script>

<style lang="scss">
.audit-dialog {
  .header {
    height: 67px;
    line-height: 67px;
    border-bottom: 1px solid #d8dce6;
    margin: -30px -40px;
  }
  .title {
    font-weight: bold;
    color: #212a40;
    margin: 24px 0;
  }
  .item {
    margin-bottom: 24px;
  }
}
</style>

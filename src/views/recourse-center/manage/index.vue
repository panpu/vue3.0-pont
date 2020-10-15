<script lang="tsx">
import { defineComponent, getCurrentInstance, reactive, ref } from '@vue/composition-api'
import PageView from '@/components/PageView'
import { ITable } from '@/components/Table'
import { ITableColumn } from '@/components/Table/interface'
import AddRecourse from './AddRecourse.vue'
export default defineComponent({
  setup() {
    const state = reactive({
      statuList: [
        {
          key: '1',
          value: '提供方1'
        }
      ] as any,
      providerList: [
        {
          key: '1',
          value: '提供方1'
        }
      ] as any,
      shareTypeList: [
        {
          key: '1',
          value: '共享类型1'
        }
      ] as any,
      queryParams: {
        searchValue: '',
        status: '',
        provider: '',
        shareType: '',
        startTime: '',
        endTime: ''
      },
      showAdd: false,
      select: []
    })
    const columns: ITableColumn[] = [
      { label: '用户名', prop: 'id' },
      { label: '用户昵称', prop: 'nikeName' },
      { label: '真实姓名', prop: 'realName' },
      { label: '所属部门', prop: 'deptName' },
      { label: '角色', prop: 'deptId' },
      { label: '邮箱', prop: 'email' },
      { label: '电话', prop: 'phone' },
      { label: '创建时间', prop: 'createTime', valType: 'date' }
    ]
    // 相当于获取this
    // const vm = getCurrentInstance()!
    const tableRef = ref<any>(null)
    return () => {
      return (
        <PageView visible={state.showAdd}>
          <AddRecourse
            slot='add'
            onCancel={toggleAdd}
            onOk={() => {
              toggleAdd()
            }}
          />
          <ITable
            ref={tableRef}
            // 查询参数
            // state={queryParams}
            // table配置
            columns={columns}
            selection={state.select}
            onSelect={selectChange}
            delFetch={API.manageCenterServer.user.delByIds.request}
            importFetch={API.manageCenterServer.user.excelImport.request}
            exportFetch={API.manageCenterServer.user.exportData.request}
            fetch={API.manageCenterServer.user.list.request}
            renderActions={([x, y]) => [
              <el-button type='primary' onClick={() => toggleAdd()}>
                <i-icon name='xinzeng' /> 新增
              </el-button>,
              <el-button type='primary' icon='el-icon-delete' onClick={() => deleteData()}>
                删除
              </el-button>,
              y,
              x,
              <el-button class='' type='warning' icon='el-icon-check' onClick={() => deleteData()}>
                提交
              </el-button>
            ]}
            scopedSlots={{
              // actions: () => [
              //   <el-button type='primary' onClick={() => toggleAdd()}>
              //     <i-icon name='xinzeng' /> 新增
              //   </el-button>,
              //   <el-button type='primary' icon='el-icon-delete' onClick={() => deleteData()}>
              //     删除
              //   </el-button>,
              //   <el-button class='' type='warning' icon='el-icon-check' onClick={() => deleteData()}>
              //     提交
              //   </el-button>
              // ],
              query: () => {
                return [
                  <el-input v-model={state.queryParams.searchValue} placeholder='标识符/资源名称' />,
                  <el-select v-model={state.queryParams.status} placeholder='状态'>
                    {state.statuList.map(v => (
                      <el-option label={v.key} value={v.value} />
                    ))}
                  </el-select>,
                  <el-select v-model={state.queryParams.shareType} placeholder='共享级别'>
                    {state.shareTypeList.map(v => (
                      <el-option label={v.key} value={v.value} />
                    ))}
                  </el-select>,
                  <el-select v-model={state.queryParams.provider} placeholder='提供方'>
                    {state.providerList.map(v => (
                      <el-option label={v.key} value={v.value} />
                    ))}
                  </el-select>,
                  <el-date-picker
                    value-format='yyyy-MM-dd'
                    v-model={state.queryParams.startTime}
                    type='datetime'
                    placeholder='开始时间'
                  />,
                  <el-date-picker
                    value-format='yyyy-MM-dd'
                    v-model={state.queryParams.endTime}
                    type='datetime'
                    placeholder='结束时间'
                  />
                ]
              }
            }}
          />
        </PageView>
      )
    }
    // 查询数据
    function searchData(e) {
      console.log(e)
    }
    // 删除数据
    function deleteData() {
      console.log('删除')
    }
    // 切换提供方
    function changeProvider(e) {
      console.log(e)
    }
    function changeShareType(e) {
      console.log(e)
    }
    function toggleAdd() {
      state.showAdd = !state.showAdd
    }
    function selectChange(e) {
      console.log(e)
    }
  }
})
</script>
<style lang="scss" scoped>
.flr {
  float: right;
}
.ml10 {
  margin-left: 10px;
}
</style>

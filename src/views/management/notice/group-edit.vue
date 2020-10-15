<!--
 * @Author: your name
 * @Date: 2020-09-23 19:13:46
 * @LastEditTime: 2020-09-27 16:25:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \exchange-management-web\src\views\management\notice\group-edit.vue
-->
<script lang="tsx">
import IForm from '@/components/Form'
import { TransformTree } from '@/components/components'
import { treeList } from '@/services/manageCenterServer/mods/dept'
import { defineComponent, onMounted, reactive } from '@vue/composition-api'
import { Message } from 'element-ui'
export default defineComponent({
  name: 'group-edit',
  props: ['id'],

  setup(props, { emit }) {
    let model = reactive<defs.manageCenterServer.AddNoticeGroupDomain>({
      groupName: '',
      /** 通知组id(更新时候传) */
      id: undefined,
      /** 通知人员 */
      noticeUser: [],
      /** 备注 */
      remark: ''
    })
    onMounted(() => {
      if (props.id) {
        API.manageCenterServer.noticeGroup.queryGroupInfo.request({ id: props.id }).then(res => {
          if (res.code) {
            model.groupName = res.data!.groupName
            model.remark = res.data!.remark
            state.groupUserList = res.data!.groupUserList
          }
        })
      }
    })

    const state = reactive({
      treeList: [] as any,
      groupUserList: [] as any
    })
    return () => (
      <IForm
        state={model}
        ok={submit}
        onCancel={() => emit('cancel')}
        formItems={[
          {
            prop: 'groupName',
            label: '通知组名称',
            required: true,
            col: { span: 8 },
            render: () => <el-input v-model={model.groupName} />
          },
          {
            prop: 'remark',
            label: '备注',
            col: { span: 8 },
            render: () => <el-input v-model={model.remark} />
          },
          {
            prop: 'noticeUser',
            label: '关联人员',
            col: { span: 16 },
            required: true,
            render: () => (
              <TransformTree
                children={'children'}
                fetchDataApi={API.manageCenterServer.noticeUser.getDeptUserList.request}
                groupUserList={state.groupUserList}
                v-model={model.noticeUser}
              ></TransformTree>
            )
          }
        ]}
      />
    )
    function submit() {
      model.id = props.id
      return API.manageCenterServer.noticeGroup.addOrUpdate.request({}, { ...model }).then(res => {
        Message.success(res.msg!)
        emit('ok')
        return res
      })
    }
  }
})
</script>

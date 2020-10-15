<script lang="tsx">
import { IForm, TreeSelect } from '@/components/components'
import encrypt from '@/utils/rsa'
import { computed, defineComponent, getCurrentInstance, nextTick, onMounted, reactive, ref } from '@vue/composition-api'
import { Message, Tree } from 'element-ui'

export default defineComponent({
  props: { id: [Number, String] as any },
  setup(props, { emit }) {
    const model = reactive<defs.manageCenterServer.AddOrUpdateDomain>({
      authorityIdList: [],
      describe: '',
      roleName: ''
    })
    const state = reactive({
      roleList: [] as defs.manageCenterServer.AuthorityTreeListDomain[],
      rightRoleList: [] as defs.manageCenterServer.AuthorityTreeListDomain[]
    })

    const vm = getCurrentInstance()!

    onMounted(async () => {
      const res = await API.manageCenterServer.authority.selectTreeByUserId.request({}, {})
      if (res.code) {
        state.roleList = res.data!
      }
      if (props.id) {
        const res1 = await API.manageCenterServer.role.queryInfoById.request({ id: props.id })
        if (res.code) {
          Object.assign(model, res1.data)
          getTreeRef().setCheckedKeys(model.authorityIdList!)
        }
      }
      state.rightRoleList = res.data!
      setTimeout(appendToRight, 20)
    })

    async function submit() {
      const res = await API.manageCenterServer.role.addOrUpdate.request({}, model)
      if (res.code) {
        Message.success(res.msg!)
        emit('ok')
      }
    }
    function getTreeRef() {
      return vm.$children[0].$refs.treeRef as Tree
    }
    function getTreeRef1() {
      return vm.$children[0].$refs.treeRef1 as Tree
    }
    function checkChange(...arg) {
      model.authorityIdList = getTreeRef().getCheckedKeys()
    }
    function appendToRight() {
      const tree1 = getTreeRef1()
      tree1.filter(getTreeRef().getCheckedKeys())
    }
    function appendToLelt() {
      const tree = getTreeRef()
      const tree1 = getTreeRef1()
      const tree1Keys = tree1.getCheckedKeys()
      const treeKeys = tree.getCheckedKeys()
      tree1Keys.forEach(key => tree.setChecked(key, false, false))
      appendToRight()
    }
    function filterNode(checkedKeys: number[], data) {
      return checkedKeys!.includes(data.id)
    }

    const treeProps = {
      'show-checkbox': true,
      'node-key': 'id',
      props: {
        label: 'authorityName',
        children: 'treeList'
      }
    }

    const cardProps = {
      props: { bodyStyle: { padding: '10px 0', height: '100%', overflow: 'auto' } },
      style: 'width:360px;height:450px;'
    }

    return () => (
      <IForm
        state={model}
        ok={submit}
        onCancel={() => emit('cancel')}
        formItems={[
          {
            prop: 'roleName',
            label: '用户昵称',
            required: true,
            render: () => <el-input v-model={model.roleName} />
          },
          {
            prop: 'describe',
            label: '描述',
            required: true,
            render: () => <el-input v-model={model.describe} />
          },
          {
            prop: 'authorityIdList',
            label: '管理操作',
            col: { span: 24 },
            required: true,
            render: () => (
              <el-row type='flex' align='middle'>
                <el-card {...cardProps} header='操作列表'>
                  <el-tree ref='treeRef' on-check-change={checkChange} data={state.roleList} props={treeProps} />
                </el-card>
                <div class='tree-btn'>
                  <el-button type='primary' onClick={appendToRight}>
                    <i-icon name='you' /> 新增
                  </el-button>
                  <span style='margin:10px 0'></span>
                  <el-button style='color:#4DA1FF' onClick={appendToLelt}>
                    <i-icon name='zuo' />
                    删除
                  </el-button>
                </div>
                <el-card {...cardProps} header='已选列表'>
                  <el-tree
                    ref='treeRef1'
                    data={state.rightRoleList}
                    props={treeProps}
                    filter-node-method={filterNode}
                  />
                </el-card>
              </el-row>
            )
          }
        ]}
      />
    )
  }
})
</script>

<style lang="scss">
.tree-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 30px;
}
</style>

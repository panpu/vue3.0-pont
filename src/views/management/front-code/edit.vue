<script lang="tsx">
import { TreeSelect } from '@/components/components'
import { IFormItem } from '@/components/Form/interface'
import { LayoutStore } from '@/store/modules/layout'
import encrypt from '@/utils/rsa'
import { defineComponent, onMounted, PropType, reactive } from '@vue/composition-api'
import { Message } from 'element-ui'
import { merge } from 'lodash'

export default defineComponent({
  props: { list: Object, id: [Number, String] as any },
  setup(props, { listeners, emit }) {
    let model = reactive<defs.manageCenterServer.AddUserDomain>({
      nikeName: '',
      realName: '',
      email: '',
      userType: null as any,
      password: '',
      phone: '',
      powerIdList: [],
      account: '',
      deptIdList: [],
      roleIdList: [],
      visibleIdList: []
    })

    onMounted(() => {
      if (props.id) {
        API.manageCenterServer.user.queryInfoById.request({ userId: props.id! }).then(res => {
          const data = res.data!
          Object.keys(data!).forEach(key => data[key] || delete data![key])
          Object.assign(model, data)
        })
      }
    })

    function submit() {
      const password = props.id ? undefined : encrypt(model.password!)
      return API.manageCenterServer.user.addOrUpdate.request({}, { ...model, password }).then(res => {
        Message.success(res.msg!)
        emit('ok')
        return res
      })
    }

    const treeParams = {
      data: props.list!.dept,
      props: {
        children: 'deptTreeDomainList',
        label: 'name',
        value: 'id'
      }
    }
    const formItems: IFormItem[] = [
      {
        prop: 'nikeName',
        label: '用户昵称',
        required: true,
        render: () => <el-input v-model={model.nikeName} />
      },
      {
        prop: 'account',
        label: '用户名',
        required: true,
        render: () => <el-input v-model={model.account} />
      },
      {
        prop: 'userType',
        label: '用户类型',
        required: true,
        render: () => (
          <el-select v-model={model.userType}>
            <el-option value={1} label='超级管理员' />
            <el-option value={2} label='平台普通用户' />
            <el-option value={3} label='平台管理员' />
            <el-option value={4} label='部门普通用户' />
            <el-option value={5} label='部门管理员' />
            <el-option value={6} label='子部门管理员' />
          </el-select>
        )
      },
      {
        prop: 'realName',
        label: '真实姓名',
        required: true,
        render: () => <el-input v-model={model.realName} />
      },
      {
        prop: 'password',
        label: '密码',
        required: true,
        render: () => <el-input v-model={model.password} />
      },
      {
        prop: 'deptIdList',
        label: '所属部门',
        required: true,
        render: () => (
          <TreeSelect collapse-tag multiple placeholder='部门' v-model={model.deptIdList} treeParams={treeParams} />
        )
      },
      {
        prop: 'email',
        label: '邮箱',
        type: 'email',
        render: () => <el-input v-model={model.email} />
      },
      {
        prop: 'roleIdList',
        label: '角色',
        required: true,
        render: () => (
          <el-select v-model={model.roleIdList} multiple collapse-tags>
            {props.list?.role.map(v => (
              <el-option label={v.roleName} value={v.id} />
            ))}
          </el-select>
        )
      },
      {
        prop: 'phone',
        label: '电话',
        render: () => <el-input v-model={model.phone} />
      },
      {
        prop: 'powerIdList',
        label: '审核权限',
        render: () => <TreeSelect collapse-tags v-model={model.powerIdList} treeParams={treeParams} />
      },
      {
        prop: 'visibleIdList',
        label: '可见部门',
        render: () => <TreeSelect collapse-tags v-model={model.visibleIdList} treeParams={treeParams} />
      }
    ]

    return () => (
      <i-form
        class='user-edit'
        state={model}
        ok={submit}
        onCancel={() => emit('cancel')}
        formItems={formItems.filter(item => (props.id ? item.prop !== 'password' : true))}
      />
    )
  }
})
</script>

<style lang="scss" scoped>
.user-edit {
  height: 100%;
}
</style>

<template>
  <div class="home">
    首页
    <!-- <i-form :items="items" :model="model" /> -->
    <!-- <i-table :state="state" :columns="columns" :selection.sync="selection" :fetch="getList">
      <template>
        <div slot="actions">
          <el-button @click="edit">编辑</el-button>
          <el-button @click="add">新增</el-button>
        </div>
        <template slot="query">
          <el-input placeholder="名称" />
          <el-input placeholder="开始时间" />
          <el-input placeholder="结束时间" />
          <el-input placeholder="部门" />
          <el-input placeholder="角色" />
        </template>
      </template>
    </i-table> -->
  </div>
</template>

<script lang="tsx">
import { defineComponent } from '@vue/composition-api'
import Edit from './edit.vue'
import { PermissionModule } from '@/store/modules/permission'
export default defineComponent({
  methods: {
    getList(params) {
      return API.manageCenterServer.user.list.request({}, params)
    },
    add() {
      this.toggleEdit(<Edit onCancel={this.toggleEdit} />)

      // API.account.addAccount.request({}, { password: '', username: '' })
    },
    edit() {
      this.toggleEdit(<Edit info={{ name: 'zzz', age: '222' }} onCancel={this.toggleEdit} />)
    }
  },

  data() {
    return {
      selection: [],
      state: {} as defs.manageCenterServer.ReqUserListDomain,
      columns: [
        { label: '用户名', prop: 'id' },
        { label: '用户昵称', prop: 'nikeName' },
        { label: '真实姓名', prop: 'realName' },
        { label: '所属部门', prop: 'deptName' },
        { label: '角色', prop: 'deptId' },
        { label: '邮箱', prop: 'email' },
        { label: '电话', prop: 'phone' },
        { label: '创建时间', prop: 'createTime' },
        {
          label: '操作',
          prop: 'actions',
          render: () => [<el-button>查看</el-button>, <el-button>编辑</el-button>, <el-button>删除</el-button>]
        }
      ]
    }
  }
})
</script>
<style lang="scss" scoped>
.home {
  height: 100%;
}
</style>

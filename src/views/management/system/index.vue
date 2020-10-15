<template>
  <page-view :visible="isVisible">
    <i-container>
      <content-header slot="header" :searchAction="getLists" :cleanAction="handerClean">
        <template slot="actions">
          <el-button type="primary" v-if="isSystemAdd" @click="handerAdd">
            <svg-icon iconClass="xinzeng"></svg-icon>
            新增
          </el-button>
        </template>
        <template slot="search">
          <el-input v-model="query.authorityName" clearable placeholder="名称" />
          <el-select v-model="query.state" clearable placeholder="状态">
            <el-option label="正常" :value="0"></el-option>
            <el-option label="禁用" :value="1"></el-option>
          </el-select>
          <el-date-picker
            v-model="timeArr"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable
            @change="
              v => {
                query.startTime = v[0]
                query.endTime = v[1]
              }
            "
          ></el-date-picker>
        </template>
      </content-header>
      <table-lists
        slot="section"
        :height="height"
        slot-scope="{ height }"
        :data="menus"
        :columns="columns"
        row-key="id"
        default-expand-all
        :tree-props="{ children: 'childrenList' }"
        :loading="loading"
      ></table-lists>
    </i-container>

    <div slot="common" style="height:100%">
      <layout-form @clear="isVisible = false" @ok="getLists" :parentData="menus" :info="infoData"></layout-form>
      <layout-view @clear="isVisible = false" @ok="getLists" :parentData="menus"></layout-view>
    </div>
  </page-view>
</template>

<script>
import day from 'dayjs'
import ElTableTreeColumn from 'element-tree-grid'
import { SystemModule } from '@/store/modules/system'
import layoutForm from './layoutForm.vue'
import layoutView from './layoutView.vue'
import config from '@/config/config.ts'
import { defineComponent } from '@vue/composition-api'
export default defineComponent({
  components: { ElTableTreeColumn, layoutForm, layoutView },
  data() {
    return {
      //是否删除
      isSystemDel: config.isSystemDel,
      // 是否新增
      isSystemAdd: config.isSystemAdd,

      loading: false,
      // 页面显示
      isVisible: false,
      // 搜索时间字段
      timeArr: null,
      //搜素数据
      query: {},
      // 详情数据
      infoData: {},
      columns: [
        {
          label: '名称',
          prop: 'authorityName',
          width: 220
          // render: ({ val, row }) => (row.isEdit ? <el-input v-model={row.date} /> : val)
        },
        {
          label: '图标',
          prop: 'icon',
          width: 48,
          render: ({ val, row }) => <svg-icon icon-class={val}></svg-icon>
        },
        // {
        //   type: 'index',
        //   label: '序号',
        //   width: 48
        //   // index: index => index * 2
        // },
        {
          label: '排序',
          prop: 'seq',
          width: 48
        },
        {
          label: '编码',
          prop: 'code'
        },

        {
          label: '描述',
          prop: 'describe'
        },
        {
          label: '类型',
          prop: 'authorityType',
          width: 48,
          render: ({ val, row }) => {
            const type = {
              0: '目录',
              1: '模块',
              2: '操作'
            }
            return type[row.authorityType]
          }
        },
        {
          label: '父级节点',
          prop: 'parentName'
        },
        {
          label: 'URL',
          width: 100,
          prop: 'url'
        },
        {
          label: '路径',
          prop: 'routing'
        },
        {
          label: '状态',
          prop: 'state',
          width: 80,
          render: ({ val, row }) => (val === 1 ? <span style={{ color: 'red' }}>禁止</span> : '正常')
        },
        {
          label: '创建时间',
          prop: 'createTime',
          render: ({ val, row }) => day(val).format('YYYY-MM-DD HH:mm:ss')
        },
        {
          label: '操作',
          width: 130,
          render: ({ row }) => [
            <el-button type='text' v-auth='view'>
              查看
            </el-button>,
            <el-button type='text' v-auth='edit' onClick={() => this.handerEdit(row)}>
              编辑
            </el-button>,
            this.isSystemDel ? <i-delete v-auth='del' fetch={() => this.handerDel(row.id)}></i-delete> : null
          ]
        }
      ]
    }
  },
  computed: {
    menus() {
      return SystemModule.treeMenus
    }
  },
  created() {
    this.getLists(this.query)
  },
  methods: {
    getLists(query = this.query) {
      this.loading = true
      SystemModule.GetMenus(query).finally(() => {
        this.loading = false
      })
      this.isVisible = false
    },

    // 查看
    handerView() {
      this.isVisible = !this.isVisible
    },
    // 新增
    handerAdd() {
      this.isVisible = !this.isVisible
      this.infoData = {}
    },
    // 编辑
    handerEdit(row) {
      this.isVisible = !this.isVisible
      this.infoData = row
    },
    // 删除
    handerDel(ids) {
      return API.manageCenterServer.authority.delAuthorityBatchId.request({}, [ids]).then(res => {
        if (res.code) {
          this.getLists()
        }
        return res
      })
    },

    // 搜索清除
    handerClean() {
      this.query = {}
      this.timeArr = null
      this.getLists()
    }
  }
})
</script>

<style lang="scss">
@import '@/styles/_variables.scss';
.icon-file {
  padding-right: 7px;
  padding-left: 18px;
}

.icon-folder,
.icon-folder-open {
  padding-left: 7px;
  padding-right: 0px;
}
</style>

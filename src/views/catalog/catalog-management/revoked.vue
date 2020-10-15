<template>
  <page-view>
    <i-container>
      <content-header slot="header" class="content_header" :searchAction="getLists" :cleanAction="handerClean">
        <template slot="actions">
          <el-button type="primary">
            <svg-icon iconClass="chexiao"></svg-icon>
            导出
          </el-button>
        </template>
        <template slot="search">
          <el-input v-model="query.authorityName" clearable placeholder="名称" />
          <el-select v-model="query.state" clearable placeholder="共享级别">
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
        slot-scope="{ height }"
        :height="height"
        :columns="columns"
        :data="lists"
        :count="query"
        :selection="true"
      ></table-lists>
      <el-pagination
        slot="footer"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="query.current"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="query.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagetotal"
      ></el-pagination>
    </i-container>
  </page-view>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
import { CatalogStore } from '@/store/modules/catalog/cataloging'
export default defineComponent({
  data() {
    return {
      // 搜索时间字段
      timeArr: null,
      query: {
        catalogType: 1,
        current: 1,
        pageSize: 10
      },
      lists: [],
      pagetotal: 0,
      columns: [
        {
          label: '序号',
          type: 'index'
        },
        {
          label: '目录名称',
          prop: 'catalogName',
          render: ({ val, row }) => (row.isEdit ? <el-input v-model={row.catalogName} /> : val)
        },
        {
          label: '目录路径',
          prop: 'remark',
          render: ({ val, row }) => (row.isEdit ? <el-input v-model={row.deptNum} /> : val)
        },
        {
          label: '目录类别',
          prop: 'shareLevel',
          render: ({ val, row }) => (row.isEdit ? <el-input v-model={row.shareLevel} /> : val)
        },
        {
          label: '描述',
          prop: 'remark',
          render: ({ val, row }) => (row.isEdit ? <el-input v-model={row.deptNum} /> : val)
        },
        {
          label: '撤销时间',
          prop: 'catalogStatus',
          render: ({ val, row }) => (row.isEdit ? <el-input v-model={row.catalogStatus} /> : val)
        },
        {
          label: '状态',
          prop: 'catalogStatus',
          render: ({ val, row }) => (row.isEdit ? <el-input v-model={row.createTime} /> : val)
        },

        {
          label: '操作',
          width: 130,
          render: ({ row }) => [
            <el-button type='text'>查看</el-button>,
            <i-delete fetch={() => this.handerDel(row.id)}></i-delete>
          ]
        }
      ]
    }
  },

  computed: {
    catalogTreeData() {
      return CatalogStore.treeData
    }
  },
  created() {
    //发起列表请求
    this.getLists()
  },
  methods: {
    //获取列表
    getLists(query = this.query) {
      this.loading = true
      API.resourcesCenterServer.cataloging.listPage.request(query).then(res => {
        if (res.code) {
          this.lists = res.data.records
          this.pagetotal = res.data.total
          this.loading = false
        }
      })
      //   SystemModule.GetMenus(query).finally(() => {
      //     this.loading = false
      //   })
      //   this.isVisible = false
    },

    // 搜索清除
    handerClean() {
      this.query = {}
      this.timeArr = null
      this.getLists()
    },

    handleSizeChange(val) {
      this.query.pageSize = val
      this.getLists()
    },
    handleCurrentChange(val) {
      this.query.current = val
      this.getLists()
    }
  }
})
</script>
<style lang="scss" scoped></style>

<template>
  <page-view>
    <!-- <tab-tree slot="left" :treeData="treeDataObj" @getTreeData="getPublishedTree"></tab-tree> -->
    <el-tabs slot="left" v-model="activeTabName" class="tab_box" @tab-click="handleClick">
      <el-tab-pane label="部门" name="1" :style="{ height: tabHeight + 'px' }">
        <div class="btn_list">
          <el-button class="t_btn" type="primary">
            <svg-icon iconClass="tree-up"></svg-icon>
          </el-button>
          <el-button class="t_btn" type="primary">
            <svg-icon iconClass="tree-tijiao"></svg-icon>
          </el-button>
        </div>
        <el-scrollbar :style="{ height: tabHeight + 'px' }">
          <i-tree :data="treeDataObj['1']" @handleClick="handleTreeClick"></i-tree>
        </el-scrollbar>
      </el-tab-pane>
      <el-tab-pane label="主题" name="2" :style="{ height: tabHeight + 'px' }">
        <div class="btn_list">
          <el-button class="t_btn" type="primary">
            <svg-icon iconClass="tree-up"></svg-icon>
          </el-button>
          <el-button class="t_btn" type="primary">
            <svg-icon iconClass="tree-tijiao"></svg-icon>
          </el-button>
        </div>
        <el-scrollbar :style="{ height: tabHeight + 'px' }">
          <i-tree :data="treeDataObj['2']" @handleClick="handleTreeClick"></i-tree>
        </el-scrollbar>
      </el-tab-pane>
      <el-tab-pane label="行业" name="3" :style="{ height: tabHeight + 'px' }">
        <div class="btn_list">
          <el-button class="t_btn" type="primary">
            <svg-icon iconClass="tree-up"></svg-icon>
          </el-button>
          <el-button class="t_btn" type="primary">
            <svg-icon iconClass="tree-tijiao"></svg-icon>
          </el-button>
        </div>
        <el-scrollbar :style="{ height: tabHeight + 'px' }">
          <i-tree :data="treeDataObj['3']" @handleClick="handleTreeClick"></i-tree>
        </el-scrollbar>
      </el-tab-pane>
      <el-tab-pane label="主题" name="4" :style="{ height: tabHeight + 'px' }">
        <div class="btn_list">
          <el-button class="t_btn" type="primary">
            <svg-icon iconClass="tree-up"></svg-icon>
          </el-button>
          <el-button class="t_btn" type="primary">
            <svg-icon iconClass="tree-tijiao"></svg-icon>
          </el-button>
        </div>
        <el-scrollbar :style="{ height: tabHeight + 'px' }">
          <i-tree :data="treeDataObj['4']" @handleClick="handleTreeClick"></i-tree>
        </el-scrollbar>
      </el-tab-pane>
    </el-tabs>

    <i-container>
      <content-header slot="header" class="content_header" :searchAction="getLists" :cleanAction="handerClean">
        <template slot="actions">
          <el-button type="primary">
            <svg-icon iconClass="chexiao"></svg-icon>
            撤销
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
        :columns="columns"
        :data="lists"
        :selection="true"
        :height="height"
        :count="query"
      ></table-lists>
    </i-container>
  </page-view>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
import { PublishedStore } from '@/store/modules/catalog/published'
import { formatQuery } from '@/utils/format-query'
export default defineComponent({
  data() {
    return {
      activeTabName: '1',
      defaultProps: {
        children: 'catalogingTree',
        label: 'catalogName'
      },

      // 搜索时间字段
      timeArr: null,
      timeArr: null,
      query: {
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
          label: '部门名称',
          prop: 'catalogName',
          render: ({ val, row }) => (row.isEdit ? <el-input v-model={row.catalogName} /> : val)
        },
        {
          label: '部门编号',
          prop: 'catalogCode',
          render: ({ val, row }) => (row.isEdit ? <el-input v-model={row.catalogCode} /> : val)
        },
        {
          label: '部门路径',
          prop: 'remark',
          render: ({ val, row }) => (row.isEdit ? <el-input v-model={row.deptNum} /> : val)
        },
        {
          label: '描述',
          prop: 'remark',
          render: ({ val, row }) => (row.isEdit ? <el-input v-model={row.deptNum} /> : val)
        },
        {
          label: '共享级别',
          prop: 'shareLevel',
          render: ({ val, row }) => (row.isEdit ? <el-input v-model={row.shareLevel} /> : val)
        },
        {
          label: '状态',
          prop: 'catalogStatus',
          render: ({ val, row }) => (row.isEdit ? <el-input v-model={row.catalogStatus} /> : val)
        },
        {
          label: '发布时间',
          prop: 'createTime',
          render: ({ val, row }) => (row.isEdit ? <el-input v-model={row.createTime} /> : val)
        },
        {
          label: '创建人',
          prop: 'createByName',
          render: ({ val, row }) => (row.isEdit ? <el-input v-model={row.createByName} /> : val)
        },
        {
          label: '操作',
          width: 130,
          render: ({ row }) => [
            <el-button type='text'>查看</el-button>,
            <el-button type='text' onClick={() => this.handleEdit(row)}>
              撤销
            </el-button>
          ]
        }
      ]
    }
  },

  computed: {
    pages() {
      return PublishedStore.pages
    },
    tabHeight() {
      return this.$store.getters.mainHeight - 15
    },
    // catalogStatus() {
    //   return CatalogStore.catalogStatus
    // },
    // 部门数据
    treeDataObj() {
      return PublishedStore.treeData
    }
  },
  created() {
    //获取已发布的目录树
    this.getPublishedTree(1)
    // this.treeClick({ id: 0 })
  },
  methods: {
    // addCatalog() {},
    // 选项卡点击后请求数据
    handleClick(tab, event) {
      this.getPublishedTree(parseInt(tab.name))
    },

    getPublishedTree(type) {
      //请求目录树 数据
      PublishedStore.GetTree([
        {
          catalogType: type,
          catalogStatus: 10
        },
        type + ''
      ])
    },

    //部门树点击事件
    handleTreeClick(data) {
      this.query = {
        current: this.query.current,
        pageSize: this.query.pageSize,
        catalogType: parseInt(this.activeTabName),
        parentId: data.id
      }
      this.getLists()
    },

    //请求目录列表
    getLists(query = this.query) {
      console.log(1, query)
      if (query.parentId && query.catalogType) {
        this.loading = true
        API.resourcesCenterServer.cataloging.getPublishlistPage.request(formatQuery(query)).then(res => {
          if (res.code) {
            this.lists = res.data.records
            this.pagetotal = res.data.total
            this.loading = false
          }
        })
      }
    },

    // 搜索清除
    handerClean() {
      this.query = {}
      this.timeArr = null
      this.getLists()
    },

    // //  编辑列表数据
    // handleEdit(row) {
    //   this.$set(row, 'isEdit', !row.isEdit)
    // },

    // // 删除列表数据
    // handleDel(row) {
    //   console.log(555, row)
    // }

    handleSizeChange(val) {
      this.query.pageSize = val
      this.getLists()
    },
    handleCurrentChange(val) {
      this.query.current = val
      this.getLists()
    },
    handerClean() {
      this.query = {
        parentId: this.query.parentId,
        catalogType: this.query.catalogType,
        current: 1,
        pageSize: 10
      }

      this.timeArr = null
      this.getLists()
    }
  }
})
</script>
<style lang="scss" scoped>
.directions {
  padding: 10px 20px;
  margin: 0;
  dt,
  dd {
    padding: 6px 0;
    font-size: 12px;
  }
  dd {
    margin-inline-start: 0px;
    float: left;
    width: 33%;
    padding-left: 8px;
    &::before {
      content: ' ';
      position: absolute;
      width: 2px;
      height: 12px;
      background-color: #4da1ff;
      margin-left: -8px;
    }
    &.i10::before {
      background-color: #00bfb5;
    }
    &.i6::before {
      background-color: #fead3a;
    }
    &.i7::before {
      background-color: #fd5858;
    }
    &.i1::before {
      background-color: #bdbdbd;
    }
    &.i2::before {
      background-color: #4da1ff;
    }
    &.i8::before {
      background-color: #d06be4;
    }
  }
  &:after {
    content: '';
    display: table;
    clear: both;
  }
}
</style>

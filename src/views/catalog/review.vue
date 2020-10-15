<template>
  <page-view>
    <el-tabs slot="left" v-model="activeTabName" class="tab_box">
      <el-tab-pane label="部门" name="1">
        <div class="btn_list">
          <el-button class="t_btn" type="primary">
            <i-icon name="shuaixuan"></i-icon>
          </el-button>
          <el-button class="t_btn" type="primary" @click="addCatalog">
            <i-icon name="xinzengs"></i-icon>
          </el-button>
          <el-button class="t_btn" type="primary">
            <i-icon name="tree-del"></i-icon>
          </el-button>
          <el-button class="t_btn" type="primary">
            <i-icon name="tree-xiazai"></i-icon>
          </el-button>
          <el-button class="t_btn" type="warning">
            <i-icon name="tree-shangchuan"></i-icon>
          </el-button>
          <el-button class="t_btn" type="warning">
            <i-icon name="tree-tianjia"></i-icon>
          </el-button>
        </div>
        <div class="tree">
          <i-tree :treeData="catalogTreeData" :defaultProps="defaultProps" :hdClick="treeClick"></i-tree>
        </div>
        <dl class="directions">
          <dt>说明：</dt>
          <dd class="i10">已发布</dd>
          <dd class="i6">发布中</dd>
          <dd class="i7">驳回</dd>
          <dd class="i1">待提交</dd>
          <dd>审核中</dd>
          <dd class="i8">发布审核中</dd>
        </dl>
      </el-tab-pane>
      <el-tab-pane label="主题" name="2">
        <div class="tab_content"></div>
      </el-tab-pane>
      <el-tab-pane label="行业" name="3">
        行业
      </el-tab-pane>
      <el-tab-pane label="服务" name="4">
        服务
      </el-tab-pane>
    </el-tabs>
    <div class="layout_content">
      <content-header class="content_header">
        <template slot="actions">
          <el-button type="primary">
            新增
          </el-button>
          <el-button type="primary">
            新增
          </el-button>
        </template>
        <template slot="search">
          <el-input placeholder="昵称/名称" />
          <el-input placeholder="昵称/名称" />
        </template>
      </content-header>
      <table-lists :columns="columns" :tableData="catalogTreeData" :selection="true"></table-lists>
    </div>
  </page-view>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
import { CatalogStore } from '@/store/modules/catalog/cataloging'
export default defineComponent({
  data() {
    return {
      //tab选择项
      activeTabName: '2',
      defaultProps: {
        children: 'catalogingTree',
        label: 'catalogName'
      },
      queryParams: {
        catalogName: '',
        startTime: '',
        endTime: '',
        shareLevel: null,
        catalogStatus: null,
        parentId: null
      },
      columns: [
        {
          label: '部门编码',
          prop: 'catalogCode',
          render: ({ val, row }) => (row.isEdit ? <el-input v-model={row.catalogCode} /> : val)
        },
        {
          label: '部门名称',
          prop: 'catalogName',
          render: ({ val, row }) => (row.isEdit ? <el-input v-model={row.catalogName} /> : val)
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
          label: '创建时间',
          prop: 'createTime',
          render: ({ val, row }) => (row.isEdit ? <el-input v-model={row.createTime} /> : val)
        },
        {
          label: '更新时间',
          prop: 'updateTime',
          render: ({ val, row }) => (row.isEdit ? <el-input v-model={row.updateTime} /> : val)
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
            <el-button loading={row.loading} type='text'>
              查看
            </el-button>,
            <el-button loading={row.loading} type='text' onClick={() => this.handleEdit(row)}>
              {!row.isEdit ? '编辑' : '保存'}
            </el-button>
          ]
        }
      ]
    }
  },

  computed: {
    lists() {
      return CatalogStore.lists
    },
    pages() {
      return CatalogStore.pages
    },
    catalogStatus() {
      return CatalogStore.catalogStatus
    },
    // 部门数据
    catalogTreeData() {
      return CatalogStore.treeData
    }
  },
  created() {
    //发起部门树请求
    this.getCatalogTree(1)
    this.treeClick({ id: 0 })
  },
  methods: {
    addCatalog() {
      API.resourcesCenterServer.cataloging.addCatalog
        .request(
          {},
          {
            catalogType: '1',
            catalogCode: 'code1',
            catalogName: '目录名称',
            // catalogStatus: 1,
            shareLevel: 1,
            parentId: 0
          }
        )
        .then(() => {
          if (res.code) {
            console.log(res)
          }
        })
    },

    getCatalogTree(type) {
      //请求目录树 数据
      CatalogStore.GetCatalogTree({
        catalogType: type
      })
    },

    //部门树点击事件
    treeClick(data) {
      console.log(data)
      //请求目录列表
      CatalogStore.GetCatalogLists(Object.assign(this.queryParams, { catalogType: 1, parentId: data.id }))
    },

    //  编辑列表数据
    handleEdit(row) {
      this.$set(row, 'isEdit', !row.isEdit)
    },

    // 删除列表数据
    handleDel(row) {
      console.log(555, row)
    }
  }
})
</script>
<style lang="scss" scoped>
.tree {
  position: relative;
}
.tab_content {
  background-color: aqua;
}
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

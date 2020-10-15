<template>
  <page-view>
    <el-tabs slot="left" v-model="activeTabName" class="tab_box" @tab-click="handleClick">
      <el-tab-pane label="部门" name="1" :style="{ height: tabHeight + 'px' }">
        <div class="btn_list">
          <el-button class="t_btn" type="primary">
            <svg-icon iconClass="chexiao"></svg-icon>
          </el-button>
          <el-button class="t_btn" type="primary">
            <svg-icon iconClass="bohui"></svg-icon>
          </el-button>
          <el-button class="t_btn" type="warning">
            <svg-icon iconClass="tree-tijiao"></svg-icon>
          </el-button>
        </div>
        <el-scrollbar :style="{ height: tabHeight - 180 + 'px' }">
          <i-tree :data="treeDataObj['1']" :isEdit="true"></i-tree>
        </el-scrollbar>
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
      <el-tab-pane label="主题" name="2" :style="{ height: tabHeight + 'px' }">
        <div class="btn_list">
          <el-button class="t_btn" type="primary">
            <svg-icon iconClass="chexiao"></svg-icon>
          </el-button>
          <el-button class="t_btn" type="primary">
            <svg-icon iconClass="bohui"></svg-icon>
          </el-button>
          <el-button class="t_btn" type="warning">
            <svg-icon iconClass="tree-tijiao"></svg-icon>
          </el-button>
        </div>
        <el-scrollbar :style="{ height: tabHeight - 180 + 'px' }">
          <i-tree :data="treeDataObj['2']" :isEdit="true"></i-tree>
        </el-scrollbar>
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
      <el-tab-pane label="行业" name="3" :style="{ height: tabHeight + 'px' }">
        <div class="btn_list">
          <el-button class="t_btn" type="primary">
            <svg-icon iconClass="chexiao"></svg-icon>
          </el-button>
          <el-button class="t_btn" type="primary">
            <svg-icon iconClass="bohui"></svg-icon>
          </el-button>
          <el-button class="t_btn" type="warning">
            <svg-icon iconClass="tree-tijiao"></svg-icon>
          </el-button>
        </div>
        <el-scrollbar :style="{ height: tabHeight - 150 + 'px' }">
          <i-tree :data="treeDataObj['3']" :isEdit="true"></i-tree>
        </el-scrollbar>
        <dl class="directions">
          <dt>说明：</dt>
          <dd class="i10">已发布</dd>
          <dd class="i6">发布中</dd>
          <dd class="i7">驳回</dd>
        </dl>
      </el-tab-pane>
      <el-tab-pane label="主题" name="4" :style="{ height: tabHeight + 'px' }">
        <div class="btn_list">
          <el-button class="t_btn" type="primary">
            <svg-icon iconClass="chexiao"></svg-icon>
          </el-button>
          <el-button class="t_btn" type="primary">
            <svg-icon iconClass="bohui"></svg-icon>
          </el-button>
          <el-button class="t_btn" type="warning">
            <svg-icon iconClass="tree-tijiao"></svg-icon>
          </el-button>
        </div>
        <el-scrollbar :style="{ height: tabHeight - 180 + 'px' }">
          <i-tree :data="treeDataObj['4']" :isEdit="true"></i-tree>
        </el-scrollbar>
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
    </el-tabs>
    <i-container>
      <content-header slot="header">
        <template slot="search">
          <el-input v-model="query.catalogName" clearable placeholder="编码/部门名称" />
          <el-select v-model="query.shareLevel" clearable placeholder="共享级别">
            <el-option label="无条件共" :value="0"></el-option>
            <el-option label="有条件共享" :value="1"></el-option>
            <el-option label="不共享" :value="2"></el-option>
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
        :data="catalogTreeData"
        :selection="true"
        :height="height"
      ></table-lists>
      <el-pagination
        slot="footer"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400"
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
      activeTabName: '1',
      defaultProps: {
        children: 'catalogingTree',
        label: 'catalogName'
      },
      timeArr: null,
      query: {},
      currentPage4: 4,
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
    treeDataObj() {
      return CatalogStore.treeData
    },
    tabHeight() {
      return this.$store.getters.mainHeight - 15
    }
  },
  created() {
    //发起部门树请求
    this.getCatalogTree(1)
    // this.treeClick({ id: 0 })
  },
  methods: {
    addCatalog() {
      // API.resourcesCenterServer.cataloging.addCatalog
      //   .request(
      //     {},
      //     {
      //       catalogType: '1',
      //       catalogCode: 'code1',
      //       catalogName: '目录名称',
      //       // catalogStatus: 1,
      //       shareLevel: 1,
      //       parentId: 0
      //     }
      //   )
      //   .then(() => {
      //     if (res.code) {
      //       console.log(res)
      //     }
      //   })
    },

    getCatalogTree(type) {
      // 请求目录树 数据
      CatalogStore.GetTree([
        {
          catalogType: type
        },
        type + ''
      ])
    },

    //部门树点击事件
    treeClick(data) {
      console.log(data)
      //请求目录列表
      // CatalogStore.GetCatalogLists(Object.assign(this.queryParams, { catalogType: 1, parentId: data.id }))
    },

    //  编辑列表数据
    handleEdit(row) {
      this.$set(row, 'isEdit', !row.isEdit)
    },

    // 删除列表数据
    handleDel(row) {
      console.log(555, row)
    },
    // 选项卡点击后请求数据
    handleClick(tab, event) {
      this.getCatalogTree(parseInt(tab.name))
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
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

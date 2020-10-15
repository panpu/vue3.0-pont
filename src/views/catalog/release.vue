<template>
  <page-view>
    <el-tabs slot="left" v-model="activeTabName" class="tab_box" @tab-click="handleClick">
      <el-tab-pane label="部门" name="1" :style="{ height: tabHeight - 20 + 'px', overflow: 'auto' }">
        <div class="btn_list">
          <el-button class="t_btn" @click="rejectCheck()" type="primary">
            <svg-icon iconClass="bohui"></svg-icon>
          </el-button>
          <el-button class="t_btn" @click="submitCheck()" type="warning">
            <svg-icon iconClass="tree-tijiao"></svg-icon>
          </el-button>
        </div>
        <el-scrollbar :style="{ height: tabHeight - 180 + 'px' }">
          <i-tree
            :data="treeDataObj['1']"
            :checkedData="checkedData"
            @getCheckedKeys="getCheckedKeys"
            :isEdit="false"
            @handleClick="handleTreeClick"
          ></i-tree>
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
          <el-button class="t_btn" @click="rejectCheck()" type="primary">
            <svg-icon iconClass="bohui"></svg-icon>
          </el-button>
          <el-button class="t_btn" @click="submitCheck()" type="warning">
            <svg-icon iconClass="tree-tijiao"></svg-icon>
          </el-button>
        </div>
        <el-scrollbar :style="{ height: tabHeight - 180 + 'px' }">
          <i-tree
            :data="treeDataObj['2']"
            :checkedData="checkedData"
            @getCheckedKeys="getCheckedKeys"
            :isEdit="false"
            @handleClick="handleTreeClick"
          ></i-tree>
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
          <el-button class="t_btn" @click="rejectCheck()" type="primary">
            <svg-icon iconClass="bohui"></svg-icon>
          </el-button>
          <el-button class="t_btn" @click="submitCheck()" type="warning">
            <svg-icon iconClass="tree-tijiao"></svg-icon>
          </el-button>
        </div>
        <el-scrollbar :style="{ height: tabHeight - 150 + 'px' }">
          <i-tree
            :data="treeDataObj['3']"
            :checkedData="checkedData"
            @getCheckedKeys="getCheckedKeys"
            :isEdit="false"
            @handleClick="handleTreeClick"
          ></i-tree>
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
          <el-button class="t_btn" @click="rejectCheck()" type="primary">
            <svg-icon iconClass="bohui"></svg-icon>
          </el-button>
          <el-button class="t_btn" @click="submitCheck()" type="warning">
            <svg-icon iconClass="tree-tijiao"></svg-icon>
          </el-button>
        </div>
        <el-scrollbar :style="{ height: tabHeight - 180 + 'px' }">
          <i-tree
            :data="treeDataObj['4']"
            :checkedData="checkedData"
            @getCheckedKeys="getCheckedKeys"
            :isEdit="false"
            @handleClick="handleTreeClick"
          ></i-tree>
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
        <template slot="actions">
          <el-button type="warning">
            <svg-icon iconClass="tree-tijiao" @click="rejectCheck()"></svg-icon>
            提交
          </el-button>
          <el-button type="primary">
            <svg-icon iconClass="bohui" @click="submitCheck()"></svg-icon>
            驳回
          </el-button>
        </template>
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
        :current-page="query.current"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="query.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
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
      catalogTreeData: [],
      checkedData: [],
      timeArr: null,
      query: {
        catalogName: '',
        startTime: '',
        endTime: '',
        current: 1,
        pageSize: 10,
        status: undefined,
        catalogType: 0,
        parentId: undefined
      },
      total: 0,
      columns: [
        {
          label: '部门名称',
          prop: 'catalogName',
          render: ({ val, row }) => val
        },
        {
          label: '部门路径',
          prop: 'catalogRoute',
          render: ({ val, row }) => val
        },
        {
          label: '描述',
          prop: 'remark',
          render: ({ val, row }) => val
        },
        {
          label: '共享级别',
          prop: 'shareLevel',
          render: ({ val, row }) => val
        },
        {
          label: '时间',
          prop: 'time',
          render: ({ val, row }) => val
        },
        {
          label: '状态',
          prop: 'status',
          render: ({ val, row }) => val
        },
        {
          label: '操作',
          width: 130,
          render: ({ row }) => [
            <el-button loading={row.loading} type='text' onClick={() => this.handleOpreate(row.catalogId, 1)}>
              提交
            </el-button>,
            <el-button loading={row.loading} type='text' onClick={() => this.handleOpreate(row.catalogId, 2)}>
              驳回
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
    this.getCatalogTable(1)
  },
  methods: {
    submitCheck() {
      if (this.checkedData.length == 0) {
        return
      }
      API.resourcesCenterServer.catalogFlow.release
        .request({}, { catalogIdList: this.checkedData, operateType: 1 })
        .then(res => {
          this.getCatalogTable()
        })
    },
    rejectCheck(type) {
      console.log(this.checkedData)
      if (this.checkedData.length == 0) {
        return
      }
      API.resourcesCenterServer.catalogFlow.releaseReject
        .request({}, { catalogIdList: this.checkedData, operateType: 1 })
        .then(res => {
          this.getCatalogTable()
        })
    },
    getCatalogTree(type) {
      // 请求目录树 数据
      CatalogStore.releaseTreeList([
        {
          catalogType: type
        },
        type + ''
      ])
    },
    //选择的树菜单
    getCheckedKeys(keys) {
      this.checkedData = keys
    },
    //部门树点击事件
    handleTreeClick(data) {
      this.query.parentId = data.parentId
      this.getCatalogTable()
    },
    getCatalogTable(type) {
      if (type) {
        this.query.catalogType = type
      }
      API.resourcesCenterServer.catalogFlow.releaseList.request({}, this.query).then(res => {
        if (res.code) {
          this.catalogTreeData = res.data.records
          this.total = res.total
        }
      })
    },
    //  提交or驳回
    handleOpreate(id, type) {
      if (type == 1) {
        API.resourcesCenterServer.catalogFlow.release.request({}, { catalogIdList: [id], operateType: 1 }).then(res => {
          this.getCatalogTable()
        })
      } else if (type == 2) {
        API.resourcesCenterServer.catalogFlow.releaseReject
          .request({}, { catalogIdList: [id], operateType: 1 })
          .then(res => {
            this.getCatalogTable()
          })
      }
    },

    // 删除列表数据
    handleDel(row) {
      console.log(555, row)
    },
    // 选项卡点击后请求数据
    handleClick(tab, event) {
      this.checkedData = []
      this.getCatalogTable(parseInt(tab.name))
      this.getCatalogTree(parseInt(tab.name))
    },

    handleSizeChange(val) {
      this.query.pageSize = val
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      this.query.current = val
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

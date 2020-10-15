<template>
  <page-view>
    <el-tabs slot="left" v-model="activeTabName" class="tab_box" @tab-click="handleClick">
      <el-tab-pane label="部门" name="1" :style="{ height: tabHeight + 'px' }">
        <action-btns
          @add="handerAdd"
          @sumbitCatalog="sumbitCatalog"
          @export="handerExport"
          @imp="handerExportImp"
          @del="handleDel"
        ></action-btns>
        <el-scrollbar :style="{ height: tabHeight - 180 + 'px' }">
          <i-tree
            :data="treeDataObj['1']"
            :checkedData="checkedData"
            @getCheckedKeys="getCheckedKeys"
            :isEdit="true"
            :add="handerAdd"
            draggable
            @dragOk="handleDrag"
            @editSubmit="handleTreeSubmit"
            @handleClick="handleTreeClick"
            @remove="handleDel"
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
        <action-btns @add="handerAdd"></action-btns>
        <el-scrollbar :style="{ height: tabHeight - 180 + 'px' }">
          <i-tree
            :data="treeDataObj['2']"
            :checkedData="checkedData"
            @getCheckedKeys="getCheckedKeys"
            :isEdit="true"
            :add="handerAdd"
            draggable
            @dragOk="handleDrag"
            @editSubmit="handleSubmit"
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
        <action-btns @add="handerAdd"></action-btns>
        <el-scrollbar :style="{ height: tabHeight - 150 + 'px' }">
          <i-tree
            :data="treeDataObj['3']"
            :checkedData="checkedData"
            @getCheckedKeys="getCheckedKeys"
            :isEdit="true"
            :add="handerAdd"
            draggable
            @dragOk="handleDrag"
            @editSubmit="handleSubmit"
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
        <action-btns @add="handerAdd"></action-btns>
        <el-scrollbar :style="{ height: tabHeight - 180 + 'px' }">
          <i-tree
            :data="treeDataObj['4']"
            :checkedData="checkedData"
            @getCheckedKeys="getCheckedKeys"
            :isEdit="true"
            :add="handerAdd"
            draggable
            @dragOk="handleDrag"
            @editSubmit="handleSubmit"
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
      <content-header slot="header" :searchAction="getLists" :cleanAction="handerClean">
        <template slot="search">
          <el-input v-model="query.catalogName" clearable placeholder="编码/部门名称" />
          <el-select v-model="query.shareLevel" clearable placeholder="共享级别">
            <el-option
              v-for="item of shareLevelEnum"
              :key="item.index"
              :label="item.name"
              :value="item.index"
            ></el-option>
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
import { formatQuery } from '@/utils/format-query'
import { cloneDeep } from 'lodash'
import actionBtns from './components/action-btns'
export default defineComponent({
  components: { actionBtns },
  data() {
    return {
      checkedData: [], //选择的菜单节点
      activeTabName: '1',
      defaultProps: {
        children: 'catalogingTree',
        label: 'catalogName'
      },
      timeArr: null,
      query: {
        current: 1,
        pageSize: 10
      },
      lists: [],
      pagetotal: 0,
      //新增编辑拷贝的数据
      addlist: {
        catalogCode: '',
        catalogName: '',
        parentId: 0,
        remark: '',
        shareLevel: 0
      },
      shareLevelEnum: [
        {
          index: 0,
          name: '无条件共享'
        },
        {
          index: 1,
          name: '有条件共享'
        },
        {
          index: 2,
          name: '不共享'
        }
      ],
      columns: [
        {
          type: 'index',
          width: 48
        },
        {
          label: '部门编码',
          prop: 'catalogCode',
          render: ({ val, row }) => (row.isEdit ? <el-input v-model={row.__deep.catalogCode} /> : val)
        },
        {
          label: '部门名称',
          prop: 'catalogName',
          render: ({ val, row }) => (row.isEdit ? <el-input v-model={row.__deep.catalogName} /> : val)
        },
        {
          label: '部门路径',
          prop: 'allPath',
          render: ({ val, row }) => val || '/'
        },
        {
          label: '描述',
          prop: 'remark',
          render: ({ val, row }) => (row.isEdit ? <el-input v-model={row.__deep.remark} /> : val)
        },
        {
          label: '共享级别',
          prop: 'shareLevel',
          render: ({ val, row }) =>
            row.isEdit ? (
              <el-select v-model={row.__deep.shareLevel} clearable placeholder='共享级别'>
                {this.shareLevelEnum.map(item => (
                  <el-option label={item.name} value={item.index} key={item.index}></el-option>
                ))}
              </el-select>
            ) : (
              this.shareLevelEnum.find(item => item.index === val).name
            )
        },
        {
          label: '状态',
          prop: 'catalogStatus',
          render: ({ val, row }) => this.statusName[val]
        },
        {
          label: '创建时间',
          prop: 'createTime',
          render: ({ val, row }) => val
        },
        {
          label: '更新时间',
          prop: 'updateTime',
          render: ({ val, row }) => val
        },
        {
          label: '创建人',
          prop: 'createByName',
          render: ({ val, row }) => {
            return val
          }
        },
        {
          label: '操作',
          width: 130,
          render: ({ row }) => {
            if (row.id === -1 || row.isEdit) {
              return [
                <el-button type='text' onClick={() => this.handleSubmit(row)}>
                  保存
                </el-button>,
                <el-button type='text' onClick={() => this.handleCancel(row)}>
                  取消
                </el-button>
              ]
            } else {
              return row.catalogStatus !== 1
                ? [
                    <el-button type='text' v-auth='view'>
                      查看
                    </el-button>
                  ]
                : [
                    <el-button v-auth='edit' type='text' onClick={() => this.handleEdit(row)}>
                      编辑
                    </el-button>,
                    <el-button v-auth='del' type='text' onClick={() => this.handleDel(row.id)}>
                      删除
                    </el-button>
                  ]
            }
          }
        }
      ]
    }
  },

  computed: {
    statusName() {
      return CatalogStore.catalogStatus
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
    //选择的树菜单
    getCheckedKeys(keys) {
      this.checkedData = keys
    },
    // 选项卡点击后请求数据
    handleClick(tab, event) {
      this.checkedData = []
      this.getCatalogTree(parseInt(tab.name))
    },

    getCatalogTree(type = parseInt(this.activeTabName)) {
      // 请求目录树 数据
      CatalogStore.GetTree([
        {
          catalogType: type
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

    handleDrag(query) {
      API.resourcesCenterServer.cataloging.moveDept.request({}, query).then(res => {
        if (res.code) {
          this.getCatalogTree()
        }
      })

      console.log(query)
    },

    //请求目录列表
    getLists(query = this.query) {
      if (query.parentId && query.catalogType) {
        // CatalogStore.GetLists(formatQuery(query))
        API.resourcesCenterServer.cataloging.queryCatalogListByParent.request(formatQuery(query)).then(res => {
          if (res.code) {
            this.lists = res.data.records
            this.pagetotal = res.data.total
          }
        })
      }
    },
    //导入
    handerExportImp() {},
    //导出
    handerExport() {
      API.resourcesCenterServer.cataloging.exportCataloging
        .request({
          excelName: 'test',
          idList: this.checkedData
        })
        .then(res => {
          console.log(res, 12)
          if (res.status == 200) {
            console.log(res, 11)
            const fileName = 'test' + '.xlsx'
            const bolb = new Blob([res.data])
            console.log(bolb, 22)
            if ('download' in document.createElement('a')) {
              const link = document.createElement('a')
              link.download = fileName
              link.style.display = 'none'
              link.href = URL.createObjectURL(bolb)
              document.body.appendChild(link)
              link.click()
              URL.revokeObjectURL(link.href)
              document.body.removeChild(link)
            }
          }
        })
    },

    // 提交审核
    sumbitCatalog() {
      console.log(this.checkedData)
      API.resourcesCenterServer.cataloging.sumbitCatalog
        .request({
          idList: this.checkedData
        })
        .then(res => {
          if (res.code) {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            // 请空选中项，刷新列表
            this.checkedData = []
            this.getCatalogTree()
            this.getLists()
          }
        })
    },

    //新增
    handerAdd(pid) {
      if (pid === 0) {
        //新增顶级
        this.lists = [
          {
            __deep: {
              parentId: pid,
              shareLevel: 0
            },
            isEdit: true
          }
        ]
      } else {
        //每次允许新增一条
        if (this.lists[0].id) {
          //增加自己
          this.lists.unshift({
            __deep: {
              parentId: pid,
              shareLevel: 0
            },
            isEdit: true
          })
        }
      }
    },
    //  编辑列表数据
    handleEdit(row) {
      if (row.id) {
        this.$set(row, '__deep', cloneDeep(row))
        this.$set(row, 'isEdit', !row.isEdit)
      }
    },

    // 删除列表数据
    async handleDel(ids) {
      const res = await this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {})
      if (res) {
        API.resourcesCenterServer.cataloging.deleteCatalog
          .request({
            idList: ids ? [ids] : this.checkedData
          })
          .then(res => {
            if (res.code) {
              this.getCatalogTree()
              this.getLists()
            }
          })
      }
    },
    // 取消编辑/新增
    handleCancel(row) {
      console.log(row.id)
      if (!row.id) {
        this.lists.shift()
      } else {
        this.$set(row, 'isEdit', false)
      }
    },

    //树列表的编辑保存
    handleTreeSubmit(row) {
      API.resourcesCenterServer.cataloging.editCatalogName
        .request({
          id: row.id,
          catalogName: row.catalogName
        })
        .then(res => {
          if (res.code) {
            this.getCatalogTree()
            this.getLists()
          }
        })
    },

    // 保存列表
    handleSubmit(row) {
      let query = {
        id: row.id,
        catalogType: parseInt(this.activeTabName)
      }
      for (const key in this.addlist) {
        query[key] = row.__deep[key]
      }
      if (row.id) {
        //编辑保存
        API.resourcesCenterServer.cataloging.editCatalog.request({}, formatQuery(query)).then(res => {
          if (res.code) {
            this.$message({
              message: this.$constants.save,
              type: 'success'
            })
            this.getCatalogTree()
            this.getLists()
          }
        })
        //新增保存
      } else {
        API.resourcesCenterServer.cataloging.addCatalog.request({}, formatQuery(query)).then(res => {
          if (res.code) {
            this.$message({
              message: this.$constants.save,
              type: 'success'
            })
            this.getCatalogTree()
            if (this.query.parentId && this.query.catalogType) {
              this.getLists()
            } else {
              this.lists = []
            }
          }
        })
      }
    },

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

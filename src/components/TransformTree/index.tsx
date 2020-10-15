import { defineComponent, getCurrentInstance, onMounted, PropType, reactive, toRefs, watch } from '@vue/composition-api'
import './style.scss'
import { Data } from '@/shims-global'
import { Tree } from 'element-ui'
import { clone } from 'lodash'
export const TransformTree = defineComponent({
  name: 'TransformTree',
  props: {
    /** 树形结构数据 */
    fetchDataApi: { type: Function as PropType<(_, params?: any) => Promise<any>>, required: true },
    /** 树形结构的子集key值  */
    children: {
      type: String,
      required: false
    },
    // 已选人员列表
    groupUserList: {
      type: Array
    },
    /** 树形结构展示的数据key值 */
    label: {
      type: String
    },
    /** 树形结构是否叶子节点key值 */
    isLeaf: {
      type: String
    },
    /** 组件行宽,同elementui  */
    col: {
      type: Number
    },
    /** 组件间隔,同elementui */
    gutter: {
      type: Number
    }
  },
  setup(props, { emit }) {
    const state = reactive({
      // 基础树
      treeList: [] as any[],
      // 展开列表
      // expandedList: [] as any[],
      config: {
        children: 'children',
        label: 'name',
        isLeaf: 'leaf',
        col: 11,
        gutter: 40
      },
      tableList: [] as any[],
      newTreeList: [] as any[],
      filterText: '',
      multipleSelection: [] as any[],
      filterList: [] as any[]
    })

    Object.keys(props).forEach(item => {
      state.config[item] = props[item] || state.config[item]
    })

    let moduleSetting = state.config

    const ctx = getCurrentInstance()!

    watch(
      () => props.groupUserList as any[],
      (val: any[]) => {
        state.tableList = val
        state.filterList = val
        ;(ctx.$refs.basetree as Tree).filter(val)
        // ; (ctx.$refs.tree as Tree).filter(val)
      }
    )
    watch(
      () => state.filterText,
      val => {
        ;(ctx.$refs.basetree as Tree).filter(val)
      }
    )
    watch(
      () => state.tableList,
      val => {
        ;(ctx.$refs.basetree as Tree).filter(val)
        emit(
          'input',
          state.tableList.map(item => item.id)
        )
      }
    )
    function filterNodeLeft(value: any, data: Data) {
      let result = false
      let arr = state.filterList.map(item => item.id)
      if (arr.indexOf(data.id) == -1) {
        result = true
        if (typeof value == 'string') {
          result = data[state.config.label].indexOf(value) !== -1
        }
      } else {
        result = false
      }
      return result
    }
    // function filterNodeRight(value: string, data: Data) {
    //   let result = false
    //   if (!value) return false
    //   state.tableList.forEach(item => {
    //     if (data.id === item) {
    //       result = true
    //     }
    //   })
    //   return result
    // }
    function handleSelectionChange(val: any) {
      state.multipleSelection = val
    }
    function handleAddSelect() {
      // ; (ctx.$refs.basetree as Tree).getCheckedNodes().forEach(item => {
      //   if (state.filterList.map(data => data.id).indexOf(item.id) == -1) {
      //     state.filterList.push(item)
      //   }
      // })
      ;(ctx.$refs.basetree as Tree)
        .getCheckedNodes()
        .filter((item: any) => item.fullName)
        .forEach(item => {
          if (state.tableList.map(data => data.id).indexOf(item.id) == -1) {
            state.tableList.push(item)
          }
        })
      ;(ctx.$refs.basetree as Tree).setCheckedKeys([])
    }
    function handleCancelSelect() {
      state.multipleSelection.map(checked => {
        for (let i = state.filterList.length - 1; i > -1; i--) {
          if (state.filterList[i].id == checked.id) {
            state.filterList.splice(i, 1)
          }
        }
        for (let n = state.tableList.length - 1; n > -1; n--) {
          if (state.tableList[n].id == checked.id) {
            state.tableList.splice(n, 1)
          }
        }
        // state.filterList.forEach((item, index) => {
        //   if (item.id == checked.id) {
        //     state.filterList.splice(index, 1)
        //   }
        // })
        // state.tableList.forEach((item, index) => {
        //   if (item.id == checked.id) {
        //     state.tableList.splice(index, 1)
        //   }
        // })
      })
      ;(ctx.$refs.basetree as Tree).setCheckedKeys([])
      emit(
        'input',
        state.tableList.map(item => item.id)
      )
    }
    async function dateReset() {
      let res = await props.fetchDataApi?.({}, {})
      if (res.code) {
        // 重组
        reconsitution(res.data)
        state.treeList = res.data
        // 获取所有带用户的父节点
        getUsersPid(state.treeList)
        // // 收集所有部门关联节点
        getAllDeptId(state.treeList)
        // 去除空节点
        clearFreeDept(state.treeList)
      }
      /** 数据重组 */
      function reconsitution(users) {
        users.forEach(item => {
          if (item.deptTreeDomainList) {
            item.leaf = true
            item.noticeUserList.forEach(i => {
              ;(i.parentId = item.id), (i.name = i.fullName)
            })
            item.children = [...item.deptTreeDomainList, ...item.noticeUserList]
            reconsitution(item.children)
          }
        })
      }
      /** 获取所有带用户的父节点 */
      function getUsersPid(users) {
        users.forEach(item => {
          if (item.noticeUserList?.length > 0) {
            item.noticeUserList.forEach(user => {
              state.newTreeList.push(user.id)
            })
            state.newTreeList.push(item.id)
            getUsersPid(item.deptTreeDomainList)
          }
        })
      }
      /** 收集所有部门关联节点  */
      function getAllDeptId(users) {
        let tlength = state.newTreeList.length
        users.forEach(item => {
          if (state.newTreeList.indexOf(item.id) == -1) {
            if (item.children) {
              getAllDeptId(item.children)
            }
          }
        })
        if (state.newTreeList.length > tlength) {
          getAllDeptId(state.treeList)
        }
      }
      /** 去除空节点 */
      function clearFreeDept(users) {
        for (let i = users.length - 1; i > -1; i--) {
          if (state.newTreeList.indexOf(users[i].id) == -1) {
            users.splice(i, 1)
          } else {
            if (users[i].children) {
              clearFreeDept(users[i].children)
            }
          }
        }
      }
    }
    onMounted(() => {
      dateReset()
    })
    return {
      ...toRefs(state),
      moduleSetting,
      filterNodeLeft,
      // filterNodeRight,
      handleSelectionChange,
      dateReset,
      handleAddSelect,
      handleCancelSelect
    }
  },

  render() {
    return (
      <el-row gutter={this.moduleSetting.gutter} class='transform-tree' type='flex' align='middle'>
        <el-col span={this.moduleSetting.col}>
          <el-card class='box-card max-height'>
            <div slot='header' class='clearfix'>
              <span>人员列表</span>
            </div>
            <el-input placeholder='输入关键字进行过滤' clearable v-model={this.filterText}></el-input>
            <el-tree
              ref='basetree'
              class='filter-tree'
              show-checkbox
              data={this.treeList}
              filter-node-method={this.filterNodeLeft}
              props={{
                props: {
                  children: this.moduleSetting.children,
                  label: this.moduleSetting.label
                }
              }}
              // default-expanded-keys={this.expandedList}
              default-checked-keys={this.defaultCheckedKeys}
              node-key='id'
            ></el-tree>
          </el-card>
        </el-col>
        <div span={6} type='flex' align='middle'>
          <el-button type='primary' onClick={this.handleAddSelect}>
            添加{'>>>'}
          </el-button>
          <br />
          <el-button class='clear-btn-m' onClick={this.handleCancelSelect}>
            删除{'<<<'}
          </el-button>
        </div>
        {/* <el-col span={this.moduleSetting.col}>
          <el-card class='box-card max-height'>
            <div slot='header' class='clearfix'>
              <span>人员列表</span>
            </div>
            <el-tree
              ref='tree'
              class='filter-tree'
              show-checkbox
              data={this.treeList}
              filter-node-method={this.filterNodeRight}
              props={{
                props: {
                  children: this.moduleSetting.children,
                  label: this.moduleSetting.label
                }
              }}
              node-key='id'
            ></el-tree>
          </el-card>
        </el-col> */}
        <el-col span={this.moduleSetting.col}>
          <el-card class='box-card max-height'>
            <div slot='header' class='clearfix'>
              <span>已选人员列表</span>
            </div>
            <el-table
              data={this.tableList}
              border
              height={330}
              onSelection-change={this.handleSelectionChange}
              style='width: 100%'
            >
              <el-table-column type='selection' width='40'></el-table-column>
              <el-table-column type='index' label='序号' width='50'></el-table-column>
              <el-table-column property={this.config.label} label='姓名'></el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    )
  }
})

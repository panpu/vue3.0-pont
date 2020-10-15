<template>
  <el-tree
    ref="tree"
    class="tree_box"
    :class="{ tree_edit: isEdit }"
    :data="data"
    :props="defaultProps"
    show-checkbox
    node-key="id"
    :default-checked-keys="checkedData"
    :highlight-current="true"
    default-expand-all
    @node-drag-start="handleDragStart"
    @node-drag-enter="handleDragEnter"
    @node-drag-leave="handleDragLeave"
    @node-drag-over="handleDragOver"
    @node-drag-end="handleDragEnd"
    @node-drop="handleDrop"
    v-bind="$attrs"
    :expand-on-click-node="false"
    :render-content="renderContent"
    @node-click="handleNodeClick"
    @check-change="handerNodeChange"
  ></el-tree>
</template>

<script>
import { cloneDeep } from 'lodash'
export default {
  name: 'i-tree',
  data() {
    return {
      treeSatus: true, //是否有tree菜单在编辑，
      color: {
        10: '#00BFB5', //已发布
        6: '#FEAD3A', //发布中
        7: '#FD5858', //驳回
        1: '#BDBDBD', //待提交
        2: '#4DA1FF', //审核中
        4: '#4DA1FF', //审核中
        5: '#4DA1FF', //审核中
        9: '#4DA1FF', //审核中
        11: '#4DA1FF', //审核中
        8: '#D06BE4' //发布审核中
      }
    }
  },
  props: {
    data: {
      type: Array
    },
    // 选择的树菜单
    checkedData: {
      type: Array,
      default: () => []
    },
    defaultProps: {
      type: Object,
      default: () => {
        return {
          children: 'catalogingTree',
          label: 'catalogName'
        }
      }
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    add: Function
  },
  methods: {
    //当节点选择状态变化时
    handerNodeChange() {
      this.$emit('getCheckedKeys', this.$refs.tree.getCheckedKeys())
    },
    handleNodeClick(data) {
      this.$emit('handleClick', data)
    },

    //节点开始拖拽时触发的事件
    handleDragStart(node, ev) {
      // console.log('开始拖拽', node)
    },
    //拖拽进入其他节点时触发的事件
    handleDragEnter(draggingNode, dropNode, ev) {
      // console.log('拖拽进入其他节点时: ', dropNode)
    },
    //拖拽离开某个节点时触发的事件
    handleDragLeave(draggingNode, dropNode, ev) {
      // console.log('拖拽离开某个节点: ', dropNode.label)
    },
    //在拖拽节点时触发的事件
    handleDragOver(draggingNode, dropNode, ev) {
      // console.log('拖拽节点时: ', dropNode.label)
    },
    //拖拽结束时（可能未成功）触发的事件
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      console.log('拖拽结束时: ', draggingNode && draggingNode.data, dropNode && dropNode.data, dropType)
      //拖拽的对象数据
      const draggingNodeData = draggingNode && draggingNode.data
      //目标数据
      const dropNodeData = dropNode && dropNode.data
      // switch (dropType) {
      //   case 'none':
      //     break
      //   case 'inner':
      //     // 调用编辑接口,x修改被推拽的对象父级节点 parentId 为目标节点的ID
      //     break
      //   default:
      //     // if 目标节点 parentId 不为 0 那么 修改被推拽的对象父级节点 parentId 为目标节点的parentId
      //     break
      // }

      // //判断拖到是否成功
      if (dropType !== 'none') {
        this.$emit('dragOk', {
          sourceId: draggingNodeData.id,
          targetId: dropNodeData.id
        })
      }
      // // 如果目标对象的父级Id为0
      // if (dropNodeData) {
      // }
    },
    //拖拽成功完成时触发的事件
    handleDrop(draggingNode, dropNode, dropType, ev) {
      // console.log('拖拽成功完成时: ', dropNode.label, dropType)
    },
    allowDrop(draggingNode, dropNode, type) {
      return true
    },
    //判断节点能否被拖拽
    allowDrag(draggingNode) {
      return flase
    },

    append(data) {
      console.log(data)
      this.add(data.id)
      //判断是否编辑状态
      // if (this.treeSatus) {
      //   this.treeSatus = false
      //   const newChild = { id: '', editStatus: true, label: '', children: [] }
      //   if (!data.children) {
      //     this.$set(data, 'children', [])
      //   }
      //   data.children.push(newChild)
      // } else {
      //   this.$message({
      //     message: '你还有未完成的编辑项',
      //     type: 'warning'
      //   })
      // }
    },
    edit(data) {
      if (this.treeSatus) {
        this.treeSatus = false
        this.$set(data, 'editStatus', true)
        this.$set(data, '__deep', cloneDeep(data))
      } else {
        this.$message({
          message: '你还有未完成的编辑项',
          type: 'warning'
        })
      }
    },
    remove(node, data) {
      this.$emit('remove', data.id)
      // const parent = node.parent
      // const children = parent.data.children || parent.data
      // const index = children.findIndex(d => d.id === data.id)
      // children.splice(index, 1)
    },

    cancel(data) {
      this.treeSatus = true
      this.$set(data, 'editStatus', false)
    },

    treeSubmit(node, data) {
      this.$set(data, 'editStatus', false)
      this.$emit('editSubmit', data.__deep)
      //设置编辑状态
      this.treeSatus = true
    },
    renderDom(h, { node, data, store }) {
      return (
        <span class='tontent_text'>
          <span class='txt'>
            <i class='text_icon' style={{ backgroundColor: this.color[data.catalogStatus] }}></i>
            <span class='tree_text'>{node.label}</span>
          </span>
          <span class='tree_button'>
            <el-button
              title='新增'
              class='tree_btn'
              v-auth='add'
              type='text'
              on-click={e => {
                e.stopPropagation()
                return this.append(data)
              }}
            >
              <svg-icon iconClass='xinzengs'></svg-icon>
            </el-button>
            <el-button
              class='tree_btn'
              type='text'
              title='编辑'
              v-auth='edit'
              on-click={e => {
                e.stopPropagation()
                return this.edit(data)
              }}
            >
              <svg-icon iconClass='tree-edit'></svg-icon>
            </el-button>
            <el-button
              class='tree_btn'
              type='text'
              v-auth='del'
              title='删除'
              on-click={e => {
                e.stopPropagation()
                return this.remove(node, data)
              }}
            >
              <svg-icon iconClass='tree-del'></svg-icon>
            </el-button>
          </span>
        </span>
      )
    },
    renderEdit(h, { node, data, store }) {
      return (
        <span class='tontent_text'>
          <span class='txt'>
            <el-input
              class='tree_input'
              nativeOnClick={e => e.stopPropagation()}
              v-model={data.__deep.catalogName}
              placeholder='请输入内容'
            ></el-input>
          </span>
          <span>
            <el-button
              class='tree_btn'
              type='text'
              on-click={e => {
                e.stopPropagation()
                return this.treeSubmit(node, data)
              }}
            >
              <svg-icon icon-class='tree-tijiao'></svg-icon>
            </el-button>
            <el-button
              class='tree_btn'
              type='text'
              on-click={e => {
                e.stopPropagation()
                return this.cancel(data)
              }}
            >
              <svg-icon icon-class='tree_quxiao'></svg-icon>
            </el-button>
          </span>
        </span>
      )
    },
    renderContent(h, { node, data, store }) {
      return !data.editStatus ? this.renderDom(h, { node, data, store }) : this.renderEdit(h, { node, data, store })
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/_variables.scss';
.tree_box {
  position: relative;
  padding: 10px;

  .text_icon {
    position: absolute;
    width: 2px;
    height: 12px;
    margin-top: 2px;
  }
  .tree_text {
    padding-left: 8px;
  }
  .tontent_text {
    z-index: 2;
    flex: 1;
    display: flex;
    align-items: center;
    font-size: 14px;
    .txt {
      padding-right: 6px;
    }
  }

  .tree_btn {
    font-size: 12px;
    color: #999;
    & + .el-button {
      margin-left: 4px;
    }
  }

  .el-tree-node__expand-icon {
    z-index: 1;
  }
  .el-tree-node__content {
    height: 30px;
    &:hover {
      background-color: #fff;
    }
  }
  .el-tree-node__label {
    z-index: 1;
  }
  &.el-tree--highlight-current .el-tree-node > .el-tree-node__content {
    background-color: transparent;
  }
  &.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    &::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 30px;
      left: 0;
      background-color: $menu-blue;
      z-index: 0;
    }
  }
  .tree_button {
    display: none;
  }
}
.tree_edit {
  &.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    .tree_button {
      display: block;
    }
  }
}
.tree_input.el-input--medium .el-input__inner {
  height: 25px;
  line-height: 25px;
  padding: 0 6px;
}
</style>

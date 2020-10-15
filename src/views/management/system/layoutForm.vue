<template>
  <div style="height:100%">
    <i-form style="height:100%" :formItems="formItems" :state="model" @cancel="$emit('clear')" :ok="submit"></i-form>
    <div class="selectSvg">
      <el-dialog title="选择图标" :visible.sync="dialogVisible">
        <div class="svgBox">
          <span v-for="(item, index) of data" :key="index" @click="selectIcon(item)">
            <svg-icon :iconClass="item"></svg-icon>
          </span>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import svgData from '@/icons/svgData.js'
import config from '@/config/config.ts'
import { defineComponent } from '@vue/composition-api'
import { isInteger } from 'lodash'
export default defineComponent({
  name: 'layoutForm',
  props: {
    parentData: {
      type: Array,
      default: []
    },
    info: {
      type: Object
    }
  },
  data() {
    return {
      FieldEdit: config.isSystemFieldEdit, //系统配置
      form: null,
      dialogVisible: false,
      model: {
        parentId: -1,
        authorityType: 0,
        authorityName: '',
        code: '',
        seq: '',
        url: '',
        routing: '',
        icon: '',
        state: 0,
        describe: ''
      },
      selectData: [],
      formItems: [
        {
          title: this.info.id ? '编辑' : '新增'
        },
        {
          col: { span: 24 },
          render: () => (
            <el-menu
              default-active={this.model.authorityType + ''}
              class='el-menu-tab'
              mode='horizontal'
              onSelect={key => this.handleSelect(key)}
            >
              <el-menu-item index='0'>目录</el-menu-item>
              <el-menu-item index='1'>模块</el-menu-item>
              <el-menu-item index='2'>操作</el-menu-item>
            </el-menu>
          )
        },
        {
          prop: 'parentId',
          label: '父级节点',
          col: { span: 8 },
          render: () => (
            <i-tree-select
              disabled={this.info.id && !this.FieldEdit.parentId}
              renderContent={(h, { data }) => <span>{data.authorityName}</span>}
              v-model={this.model.parentId}
              selectParams={{ placeholder: '请选择' }}
              expandClick={true}
              treeParams={{
                data: this.selectData,
                props: {
                  children: 'childrenList',
                  label: 'authorityName',
                  value: 'id'
                }
              }}
            ></i-tree-select>
          )
        },
        // {
        //   prop: 'authorityType',
        //   label: '类别',
        //   col: { span: 8 },
        //   render: () => (
        //     <el-radio-group v-model={this.model.authorityType} disabled={this.info.id && !this.FieldEdit.authorityType}>
        //       <el-radio label={0}>目录</el-radio>
        //       <el-radio label={1}>模块</el-radio>
        //       <el-radio label={2}>操作</el-radio>
        //     </el-radio-group>
        //   )
        // },
        {
          prop: 'authorityName',
          label: '名称',
          required: true,
          col: { span: 8 },
          render: () => (
            <el-input v-model={this.model.authorityName} disabled={this.info.id && !this.FieldEdit.authorityName} />
          )
        },
        {
          prop: 'code',
          label: '编码',
          required: !this.info.id,
          col: { span: 8 },
          render: () => <el-input disabled={this.info.id && !this.FieldEdit.code} v-model={this.model.code} />
        },
        {
          prop: 'seq',
          label: '排序',
          required: true,
          col: { span: 8 },
          render: () => <el-input maxlength='10' v-model={this.model.seq} />
        },
        {
          prop: 'url',
          label: 'URL',
          required: true,
          col: { span: 8 },
          render: () => <el-input v-model={this.model.url} disabled={this.info.id && !this.FieldEdit.url} />
        },
        {
          prop: 'routing',
          label: '路径',
          col: { span: 8 },
          render: () => <el-input v-model={this.model.routing} disabled={this.info.id && !this.FieldEdit.routing} />
        },

        {
          prop: 'icon',
          label: '图标',
          // required: true,
          col: { span: 8 },
          render: () => (
            <div>
              <el-input
                placeholder='请输入内容'
                v-model={this.model.icon}
                disabled={this.dialogVisible}
                onFocus={() => (this.dialogVisible = true)}
                suffix-icon='el-icon-arrow-down'
              >
                <template slot='prepend'>
                  <svg-icon icon-class={this.model.icon}></svg-icon>
                </template>
              </el-input>
            </div>
          )
        },
        // {
        //   prop: 'icon',
        //   label: '图标',
        //   required: true,
        //   col: { span: 12 },
        //   render: () => (
        //     <div>
        //       <svg-icon icon-class={this.model.icon}></svg-icon>
        //       <el-input placeholder='请输入内容' disabled v-model={this.model.icon}>
        //         <el-button slot='append' icon='el-icon-search' onClick={() => (this.dialogVisible = true)}></el-button>
        //       </el-input>
        //     </div>
        //   )
        // },
        {
          prop: 'state',
          label: '状态',
          // required: true,
          col: { span: 8 },
          render: () => (
            <el-select v-model={this.model.state} placeholder='请选择'>
              <el-option label='正常' value={0}></el-option>
              <el-option label='禁用' value={1}></el-option>
            </el-select>
          )
        },
        {
          prop: 'describe',
          label: '描述',
          col: { span: 24 },
          render: () => <el-input v-model={this.model.describe} type='textarea' rows={3} placeholder='请输入内容' />
        }
      ],
      dialogVisible: false,
      data: svgData
    }
  },
  created() {
    // 数据源添加 根目录选项， id 为-1 代指根目录
    this.selectData.push({ authorityName: '/', id: -1 }, ...this.parentData)
  },
  mounted() {
    if (this.info.id) {
      Object.assign(this.model, this.info)
      if (!this.info.parentId) {
        this.model.parentId = -1
      }
    }
  },
  computed: {},
  methods: {
    handleSelect(key) {
      this.model.authorityType = parseInt(key)
    },
    submit() {
      let query = this.model
      // 防止提交失败  修改父级选项
      if (this.model.parentId === -1) {
        query = Object.assign({}, this.model, { parentId: null })
      }

      if (this.info.id) {
        return API.manageCenterServer.authority.updateAuthority.request({}, query).then(res => {
          if (res.code) {
            this.$emit('ok')
          }
        })
      } else {
        return API.manageCenterServer.authority.addAuthority.request({}, query).then(res => {
          if (res.code) {
            this.$emit('ok')
          }
        })
      }
    },
    selectIcon(item) {
      this.model.icon = item
      this.dialogVisible = false
    }
  }
})
</script>

<style lang="scss">
.el-menu-tab.el-menu--horizontal > .el-menu-item {
  height: 40px;
  line-height: 40px;
  padding: 0 40px;
  margin-top: 10px;
}

.selectSvg .el-input-group__append {
  background-color: #fff;
}
.selectSvg .el-dialog__body {
  padding: 10px 20px 30px 20px;
}
.svgBox {
  display: flex;
  flex-wrap: wrap;
  & > span {
    border: 1px solid #ddd;
    width: 50px;
    height: 50px;
    box-sizing: border-box;
    justify-items: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.svgBox:after {
  content: '';
  display: table;
  clear: both;
}
</style>

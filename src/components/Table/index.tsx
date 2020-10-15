import {
  defineComponent,
  PropType,
  reactive,
  nextTick,
  toRefs,
  getCurrentInstance,
  onMounted,
  onUnmounted,
  set,
  watch
} from '@vue/composition-api'
import day from 'dayjs'
import { ITableColumn } from './interface'
import { Message, MessageBox, Table } from 'element-ui'
import './style.scss'
import { Data } from '@/shims-global'
import { cloneDeep, omit } from 'lodash'
import Axios from 'axios'

type Fn = PropType<(...arg) => Promise<any>>

export interface TableRef extends Table {
  getData(params?: Data): Promise<void> | undefined
}

type DefaultActionsNode = JSX.Element[]

export const ITable = defineComponent({
  name: 'i-table',
  inheritAttrs: false,
  props: {
    /**是否立即直接请求函数 */
    immediate: ({ type: Boolean, default: true } as any) as PropType<boolean | undefined>,
    /** 请求函数 必须返回Promise */
    fetch: Function as PropType<(_, params?: any) => Promise<any>>,
    /** 导出请求函数 */
    exportFetch: Function as Fn,
    /** 导入请求函数 */
    importFetch: Function as Fn,
    /**删除请求函数 */
    delFetch: Function as Fn,
    /** list 查询参数 */
    state: Object,
    /** list 请求函数的类型 post|get */
    methods: String as PropType<'post' | 'get'>,
    /** 列 配置项 */
    getRef: Function as PropType<(table: TableRef) => TableRef>,
    columns: {
      type: (Array as any) as PropType<ITableColumn[]>,
      required: true
    },
    /** 不展示分页 */
    noPagination: Boolean,
    /** 表格多选 */
    selection: Array,
    /** 导出的文件名 */
    exportName: String,
    renderActions: Function as PropType<(defaultNode: DefaultActionsNode) => JSX.Element[]>
  },
  setup(props, { slots, emit, attrs }) {
    const state = reactive({
      /** 数据源 */
      dataSource: [] as any[],
      loading: false,
      height: 200,
      importLoading: false,
      exportLoading: false,
      delLoading: false,
      downloadLoading: false,
      paginationCfg: {
        total: 0,
        size: 10,
        current: 1
      }
    })
    const ctx = getCurrentInstance()!
    let currentPage = 0

    watch(
      () => state.dataSource,
      val => {
        if (val?.length && props.selection?.length) {
          props.selection?.forEach(id => {
            const item = state.dataSource.find(v => v[attrs.rowKey || 'id'] == id)
            item && (ctx.$refs.table as Table).toggleRowSelection(item)
          })
        }
      },
      { immediate: true }
    )

    onMounted(() => {
      if (props.getRef) {
        const table = ctx.$refs.table as TableRef
        table.getData = getData
        props.getRef(table)
      }
      props.immediate && getData()
      setTableHeight()
      addEventListener('resize', addEvent)
    })

    onUnmounted(() => {
      removeEventListener('resize', addEvent)
    })

    function excelImport({ file }: any) {
      state.importLoading = true
      const body: FormData = new FormData()
      body.append('file', file)
      props
        .importFetch?.({}, body)
        .finally(() => (state.importLoading = false))
        .then(res => {
          if (!res.data.fail) {
            Message.success('导入成功')
            refresh()
          } else {
            Message.warning(res.data.failStr)
          }
        })
    }

    function exportExcel() {
      state.exportLoading = true
      const exportName = props.exportName || 'zcc'
      props
        .exportFetch?.({}, { excelName: exportName, excelType: 'xlsx' }, { responseType: 'blob' })
        .finally(() => (state.exportLoading = false))
        .then(res => {
          const fileName = props.exportName || 'test' + '.xlsx'
          const bolb = new Blob([res.data])
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
        })
    }

    function setTableHeight() {
      nextTick(() => {
        state.height = ctx.$parent.$el.clientHeight - (ctx.$refs.header as Vue).$el.clientHeight - 135
      })
    }

    function addEvent() {
      setTableHeight()
      ctx.$forceUpdate()
    }
    function select(selection: any[]) {
      props.selection?.splice(0, props.selection.length)
      props.selection?.push(...selection.map(v => v[attrs.rowKey || 'id']))
    }
    function sizeChange(size: number) {
      state.paginationCfg.size = size
      getData()
    }
    function currentChange(page: number) {
      state.paginationCfg.current = page
      getData()
    }
    function refresh() {
      Object.keys(props.state || {}).forEach(key => {
        props.state![key] = undefined
      })
      state.paginationCfg.current = 1
      getData()
    }
    function getData(params?: Data) {
      const pagination = {
        current: state.paginationCfg.current,
        pageSize: state.paginationCfg.size
      }
      const queryParams = {
        ...(!props.noPagination ? pagination : {}),
        ...props.state,
        ...(params || {})
      }

      //字段为null、'' 时 删除该字段
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === '' || key == '__date') {
          delete queryParams[key]
        }
      })

      const res = props.methods == 'get' ? props.fetch?.(queryParams) : props.fetch?.({}, queryParams)
      state.loading = true

      return res
        ?.finally(() => (state.loading = false))
        ?.then(v => {
          if (v.code) {
            if (!props.noPagination) {
              state.paginationCfg.total = v.data.total
              state.dataSource = v.data.records
              currentPage = state.paginationCfg.current
            } else {
              state.dataSource = v.data
            }
          }
        })
    }

    async function handleDel(row) {
      const res = await MessageBox.confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {})
      if (res) {
        set(row, 'delLoading', true)
        const v = await props.delFetch?.({}, [row.id]).finally(() => (row.delLoading = false))
        if (v.code) {
          getData()
          Message({ type: 'success', message: v.msg })
        }
      }
    }

    function renderColumns() {
      const index = (
        <el-table-column
          type='index'
          align='center'
          scopedSlots={{
            default: ({ $index }) => (currentPage - 1) * 10 + $index + 1,
            header: () => '序号'
          }}
        />
      )
      const selection = props.selection ? <el-table-column type='selection' align='center' /> : []
      const columns = props.columns?.map(({ render, ...attrs }) => (
        <el-table-column
          props={{ showOverflowTooltip: !!attrs.prop, ...attrs }}
          scopedSlots={{ default: defSlot(attrs, render) }}
        />
      ))

      return [selection, index, ...(columns || [])]

      function defSlot(attrs, render) {
        return p => {
          const row = p.row
          if (row.__loading === undefined) {
            set(row, '__loading', false)
          }
          if (row.__isEdit === undefined) {
            set(row, '__isEdit', false)
          }
          if (!row.__data && row.__isEdit) {
            set(row, '__data', cloneDeep(omit(row, '__isEdit', '__loading')))
          }
          let val = row[attrs.prop!]

          switch (attrs.valType) {
            case 'date':
              val = day(val).format('YYYY-MM-DD HH:mm:ss')
              break
            default:
              break
          }

          const renderNode = render?.({ val, getData, ...p })
          const Node = render ? renderNode : val
          const Btn = props.delFetch && (
            <el-button loading={p.row.delLoading} onClick={() => handleDel(p.row)} type='text'>
              删除
            </el-button>
          )
          return !attrs?.prop && render ? <el-row type='flex'>{[...renderNode, Btn]}</el-row> : Node
        }
      }
    }

    function renderActions() {
      const { exportFetch, importFetch } = props
      const defaultActions: any[] = [
        exportFetch && (
          <el-button type='primary' onClick={exportExcel}>
            <i-icon name='daochu' /> 导出
          </el-button>
        ),
        importFetch && (
          <el-upload action='' http-request={excelImport} show-file-list={false}>
            <el-button type='primary'>
              <i-icon name='daoru' />
              导入
            </el-button>
          </el-upload>
        )
      ]
      const actions = props.renderActions
        ? props.renderActions(defaultActions)
        : [...(slots.actions?.() || []), ...defaultActions]

      const node = actions.filter(v => v)

      if (node.length) {
        node.forEach((v, n) => {
          v!.data!.style = { height: '36px', 'margin-left': n > 0 ? '10px' : 0 }
        })
        return node
      } else {
        return null
      }
    }

    function renderDate() {
      const o: any = {}
      const queryParams = props.state || {}
      Object.keys(queryParams).forEach((key, n) => {
        ;['startTime', 'endTime'].includes(key) && (o[key] = 1)
      })
      if (o.startTime && o.endTime) {
        return (
          <el-date-picker
            v-model={queryParams.__date}
            type='datetimerange'
            value-format='yyyy-MM-dd HH:MM:ss'
            range-separator='至'
            start-placeholder='开始日期'
            end-placeholder='结束日期'
            onChange={v => {
              const time = v || []
              queryParams.startTime = time[0]
              queryParams.endTime = time[1]
            }}
          />
        )
      } else {
        return null
      }
    }

    function renderHeader() {
      const { query } = slots
      const actions = renderActions()
      if (query || actions) {
        return (
          <el-row type='flex' ref='header' justify='space-between' class='i-top'>
            <el-row type='flex' justify='start' gutter={5}>
              {actions}
            </el-row>
            {query && (
              <el-row type='flex' class='query'>
                {query?.(state)?.map(node => (
                  <el-col style='margin-right:10px'>{node}</el-col>
                ))}
                <el-col style='margin-right:10px'> {renderDate()}</el-col>
                <el-button style='height:36px' type='primary' onClick={() => getData()}>
                  查询
                </el-button>
                <el-button style='height:36px' onClick={refresh}>
                  重置
                </el-button>
              </el-row>
            )}
          </el-row>
        )
      } else {
        return null
      }
    }

    return {
      ...toRefs(state),
      getData,
      select,
      addEvent,
      sizeChange,
      currentChange,
      renderColumns,
      renderHeader
    }
  },

  render() {
    const { loading, ...attrs } = this.$attrs
    return (
      <div class='i-table'>
        {this.renderHeader()}
        <el-table
          ref='table'
          element-loading-text='数据拼命加载中'
          element-loading-spinner='el-icon-loading'
          element-loading-background='rgba(0, 0, 0, 0.8)'
          v-loading={this.fetch ? this.loading : loading}
          on={{
            select: this.select,
            'select-all': this.select,
            ...this.$listeners
          }}
          props={{
            height: this.height,
            stripe: true,
            data: this.dataSource,
            size: 'mini',
            rowKey: 'id',
            ...attrs
          }}
          slots={this.$slots}
          scopedSlots={{
            ...this.$scopedSlots,
            default: this.renderColumns
          }}
        />
        {!this.$props.noPagination ? (
          <el-pagination
            small
            background
            total={this.paginationCfg.total}
            page-size={this.paginationCfg.size}
            on={{ 'size-change': this.sizeChange, 'current-change': this.currentChange }}
            layout='prev, pager, next, total, sizes, jumper'
          />
        ) : null}
      </div>
    )
  }
})

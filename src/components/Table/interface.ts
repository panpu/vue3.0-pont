import {
  TableColumnType,
  TableColumnFixedType,
  RenderHeaderData,
  SortOrders,
  TableColumnFilter
} from 'element-ui/types/table-column'
import { CreateElement, VNode } from 'vue'
import { ElementUIHorizontalAlignment } from 'element-ui/types/component'
import { PopoverPlacement } from 'element-ui/types/popover'

interface RowData<T> {
  [key: string]: any
  /** 自定义行内loading */
  __loading: boolean
  /**自定义当前行要编辑状态 */
  __isEdit: boolean
  /**
   * 当前行的数据副本
   * @var 当  __isEdit   第一次为true时才会被定义
   */
  __data: T
}

export declare class ITableColumn<T = Record<string, any>> {
  valType?: 'date' | 'number'
  render?: (scope: { val: any; $index: any; row: T & RowData<T>; getData: () => void }) => any
  /** Type of the column. If set to `selection`, the column will display checkbox. If set to `index`, the column will display index of the row (staring from 1). If set to `expand`, the column will display expand icon. */
  type?: TableColumnType

  /** Column label */
  label?: string

  /** Column's key. If you need to use the filter-change event, you need this attribute to identify which column is being filtered */
  columnKey?: string

  /** Field name. You can also use its alias?: property */
  prop?: keyof T

  /** Column width */
  width?: string | number

  /** Column minimum width. Columns with `width` has a fixed width, while columns with `min-width` has a width that is distributed in proportion */
  minWidth?: string | number

  /** Whether column is fixed at left/right. Will be fixed at left if `true` */
  fixed?: boolean | TableColumnFixedType

  /** Render function for table header of this column */
  renderHeader?: (h?: CreateElement, data?: RenderHeaderData) => VNode | string

  /** Whether column can be sorted */
  sortable?: boolean | 'custom'

  /** Sorting method. Works when `sortable` is `true` */
  sortMethod?: (a?: any, b?: any) => number

  /** The order of the sorting strategies used when sorting the data. Works when `sortable` is `true`. */
  sortOrders?: SortOrders[]

  /** Whether column width can be resized. Works when border of `el-table` is `true` */
  resizable?: boolean

  /** Function that formats content */
  formatter?: (row?: object, column?: ITableColumn) => any

  /** Whether to hide extra content and show them in a tooltip when hovering on the cell */
  showOverflowTooltip?: boolean

  /** Alignment */
  align?: ElementUIHorizontalAlignment

  /** Alignment of the table header. If omitted, the value of the `align` attribute will be applied */
  headerAlign?: ElementUIHorizontalAlignment

  /** Class name of cells in the column */
  className?: string

  /** Class name of the label of this column */
  labelClassName?: string

  /** Function that determines if a certain row can be selected, works when `type` is `'selection'` */
  selectable?: (row?: object, index?: number) => boolean

  /** Whether to reserve selection after data refreshing, works when `type` is `'selection'` */
  reserveSelection?: boolean

  /** An array of data filtering options */
  filters?: TableColumnFilter[]

  /** Placement for the filter dropdown */
  filterPlacement?: PopoverPlacement

  /** Whether data filtering supports multiple options */
  filterMultiple?: Boolean

  /** Data filtering method. If `filter-multiple` is on, this method will be called multiple times for each row, and a row will display if one of the calls returns `true` */
  filterMethod?: (value?: any, row?: object) => boolean

  /** Filter value for selected data, might be useful when table header is rendered with `render-header` */
  filteredValue?: TableColumnFilter[]
}

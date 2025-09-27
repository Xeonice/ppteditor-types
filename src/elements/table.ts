import { PPTBaseElement } from './base';
import { PPTElementOutline } from '../base/outline';
import { TableTheme, TableCell } from '../base/common';

/**
 * 表格元素
 *
 * type: 元素类型（table）
 *
 * outline: 边框
 *
 * theme?: 主题
 *
 * colWidths: 列宽数组，如[30, 50, 20]表示三列宽度分别为30%, 50%, 20%
 *
 * cellMinHeight: 单元格最小高度
 *
 * data: 表格数据
 */
export interface PPTTableElement extends PPTBaseElement {
  type: 'table'
  outline: PPTElementOutline
  theme?: TableTheme
  colWidths: number[]
  cellMinHeight: number
  data: TableCell[][]
}
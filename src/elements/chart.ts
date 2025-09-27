import { PPTBaseElement } from './base';
import { PPTElementOutline } from '../base/outline';
import { ChartType, ChartData, ChartOptions } from '../base/common';

/**
 * 图表元素
 *
 * type: 元素类型（chart）
 *
 * fill?: 填充色
 *
 * chartType: 图表基础类型（bar/line/pie），所有图表类型都是由这三种基本类型衍生而来
 *
 * data: 图表数据
 *
 * options: 扩展选项
 *
 * outline?: 边框
 *
 * themeColors: 主题色
 *
 * textColor?: 坐标和文字颜色
 *
 * lineColor?: 网格颜色
 */
export interface PPTChartElement extends PPTBaseElement {
  type: 'chart'
  fill?: string
  chartType: ChartType
  data: ChartData
  options?: ChartOptions
  outline?: PPTElementOutline
  themeColors: string[]
  textColor?: string
  lineColor?: string
}
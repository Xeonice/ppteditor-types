import { PPTBaseElement } from './base'
import { Gradient } from '../base/gradient';
import { PPTElementShadow, PPTElementOutline } from '../base';
import { ShapeText } from '../base/common';
import { ShapePathFormulasKeys } from '../enums/shape';

/**
 * 形状元素
 *
 * type: 元素类型（shape）
 *
 * viewBox: SVG 的 viewBox 属性
 *
 * path: SVG 路径
 *
 * fixedRatio: 固定宽高比
 *
 * fill: 填充色
 *
 * gradient?: 渐变填充
 *
 * pattern?: 图案填充
 *
 * outline?: 边框
 *
 * opacity?: 不透明度
 *
 * flipH?: 水平翻转
 *
 * flipV?: 垂直翻转
 *
 * shadow?: 阴影
 *
 * special?: 特殊形状（标记一些难以解析的形状，例如路径使用了 L Q C A 以外的类型，该类形状在导出后将变为图片的形式）
 *
 * text?: 形状内文本
 *
 * pathFormula?: 形状路径计算公式
 * 一般情况下，形状的大小变化时仅由宽高基于 viewBox 的缩放比例来调整形状，而 viewBox 本身和 path 不会变化，
 * 但也有一些形状希望能更精确的控制一些关键点的位置，此时就需要提供路径计算公式，通过在缩放时更新 viewBox 并重新计算 path 来重新绘制形状
 *
 * keypoints?: 关键点位置百分比
 */
export interface PPTShapeElement extends PPTBaseElement {
  type: 'shape'
  viewBox: [number, number]
  path: string
  fixedRatio: boolean
  fill: string
  gradient?: Gradient
  pattern?: string
  outline?: PPTElementOutline
  opacity?: number
  flipH?: boolean
  flipV?: boolean
  shadow?: PPTElementShadow
  special?: boolean
  text?: ShapeText
  pathFormula?: ShapePathFormulasKeys
  keypoints?: number[]
}
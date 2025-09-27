import { PPTElementLink } from '../base/link';

/**
 * 元素通用属性
 *
 * id: 元素ID
 *
 * left: 元素距离画布左侧的距离
 *
 * top: 元素距离画布顶部的距离
 *
 * lock?: 锁定元素
 *
 * groupId?: 组合ID
 *
 * width: 元素宽度
 *
 * height: 元素高度
 *
 * rotate: 旋转角度
 *
 * link?: 超链接
 *
 * name?: 元素名
 */
export interface PPTBaseElement {
  id: string
  left: number
  top: number
  lock?: boolean
  groupId?: string
  width: number
  height: number
  rotate: number
  link?: PPTElementLink
  name?: string
}
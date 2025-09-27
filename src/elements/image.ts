import { PPTBaseElement } from './base';
import { PPTElementOutline } from '../base/outline';
import { PPTElementShadow } from '../base/shadow';
import { ImageElementFilters, ImageElementClip, ImageType } from '../base/common';

/**
 * 图片元素
 *
 * type: 元素类型
 *
 * fixedRatio: 固定宽高比
 *
 * src: 图片地址
 *
 * outline?: 边框
 *
 * filters?: 滤镜
 *
 * clip?: 裁剪
 *
 * flipH?: 水平翻转
 *
 * flipV?: 垂直翻转
 *
 * shadow?: 阴影
 *
 * radius?: 圆角半径
 *
 * colorMask?: 颜色蒙版
 *
 * imageType?: 图片类型
 */
export interface PPTImageElement extends PPTBaseElement {
  type: 'image'
  fixedRatio: boolean
  src: string
  outline?: PPTElementOutline
  filters?: ImageElementFilters
  clip?: ImageElementClip
  flipH?: boolean
  flipV?: boolean
  shadow?: PPTElementShadow
  radius?: number
  colorMask?: string
  imageType?: ImageType
}
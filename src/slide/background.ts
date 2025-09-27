import type { Gradient } from '../base'

export type SlideBackgroundType = 'solid' | 'image' | 'gradient'
export type SlideBackgroundImageSize = 'cover' | 'contain' | 'repeat'
export interface SlideBackgroundImage {
  src: string
  size: SlideBackgroundImageSize,
}

/**
 * 幻灯片背景
 *
 * type: 背景类型（纯色、图片、渐变）
 *
 * color?: 背景颜色（纯色）
 *
 * image?: 图片背景
 *
 * gradientType?: 渐变背景
 */
export interface SlideBackground {
  type: SlideBackgroundType
  color?: string
  image?: SlideBackgroundImage
  gradient?: Gradient
}
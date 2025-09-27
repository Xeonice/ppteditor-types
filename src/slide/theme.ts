import type { PPTElementOutline, PPTElementShadow } from '../base'

/**
 * 幻灯片主题
 *
 * backgroundColor: 页面背景颜色
 *
 * themeColor: 主题色，用于默认创建的形状颜色等
 *
 * fontColor: 字体颜色
 *
 * fontName: 字体
 */
export interface SlideTheme {
  backgroundColor: string
  themeColors: string[]
  fontColor: string
  fontName: string
  outline: PPTElementOutline
  shadow: PPTElementShadow
}
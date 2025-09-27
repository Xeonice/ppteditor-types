import type { PPTElement } from '../elements'
import type { PPTAnimation } from '../animation'
import type { SlideBackground } from './background'

export type TurningMode = 'no' | 'fade' | 'slideX' | 'slideY' | 'random' | 'slideX3D' | 'slideY3D' | 'rotate' | 'scaleY' | 'scaleX' | 'scale' | 'scaleReverse'

export interface NoteReply {
  id: string
  content: string
  time: number
  user: string
}

export interface Note {
  id: string
  content: string
  time: number
  user: string
  elId?: string
  replies?: NoteReply[]
}

export interface SectionTag {
  id: string
  title?: string
}

export type SlideType = 'cover' | 'contents' | 'transition' | 'content' | 'end'

/**
 * 幻灯片页面
 *
 * id: 页面ID
 *
 * elements: 元素集合
 *
 * notes?: 批注
 *
 * remark?: 备注
 *
 * background?: 页面背景
 *
 * animations?: 元素动画集合
 *
 * turningMode?: 翻页方式
 *
 * slideType?: 页面类型
 */
export interface Slide {
  id: string
  elements: PPTElement[]
  notes?: Note[]
  remark?: string
  background?: SlideBackground
  animations?: PPTAnimation[]
  turningMode?: TurningMode
  sectionTag?: SectionTag
  type?: SlideType
}
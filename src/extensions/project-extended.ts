/**
 * 项目扩展类型定义
 *
 * 本文件提供了基于标准 Slide 类型的项目扩展版本
 * 用于支持 frontend-new-ppt 项目的特定需求
 *
 * 参考文档: SLIDE_TYPE_DIFFERENCES.md
 */

import type { Slide as StandardSlide, Note, NoteReply, TurningMode } from '../slide/slide.js'
import type { PPTAnimation } from '../animation/index.js'
import type { PPTElement } from '../elements/index.js'

// ==================== 项目特定类型定义 ====================

/**
 * 页面标签类型
 * 用于标记页面的语义类型
 */
export type PageTag =
  | 'title'      // 标题页（对应标准库的 cover）
  | 'catalogue'  // 目录页（对应标准库的 contents）
  | 'chapter'    // 章节页
  | 'content'    // 内容页
  | 'end'        // 结束页
  | 'list'       // 列表页（项目特有）

/**
 * 模板付费类型
 */
export type TemplatePayType = 'free' | 'not_free'

/**
 * 颜色配置类型
 * 支持主题色系统的复杂颜色配置
 */
export interface ColorConfig {
  color: string                    // 实际颜色值
  themeColor?: {                   // 主题色引用
    color: string
    type: string                   // 主题色类型 (如 'accent1', 'accent2' 等)
  }
  colorType?: string               // 颜色类型
  colorIndex?: number              // 颜色索引
  opacity?: number                 // 不透明度
}

// ==================== 项目扩展的背景类型 ====================

/**
 * 项目扩展的幻灯片背景类型
 *
 * 与标准库的主要差异：
 * 1. 使用 ColorConfig 而非简单的 string
 * 2. 图片背景使用扁平结构（image + imageSize）
 * 3. 渐变背景使用扁平结构（gradientType + gradientColor + gradientRotate）
 * 4. 渐变色仅支持双色渐变
 */
export interface ProjectSlideBackground {
  type: 'solid' | 'image' | 'gradient'
  themeColor?: ColorConfig                        // 纯色背景（支持主题色）
  image?: string                                  // 图片URL
  imageSize?: 'cover' | 'contain' | 'repeat'      // 图片尺寸模式
  gradientType?: 'linear' | 'radial'              // 渐变类型
  gradientColor?: [ColorConfig, ColorConfig]      // 双色渐变
  gradientRotate?: number                         // 渐变旋转角度
}

// ==================== 项目扩展的 Slide 类型 ====================

/**
 * 项目扩展的幻灯片基础类型
 *
 * 继承自标准 Slide，并添加项目特有字段
 */
export interface ProjectSlideBase extends Omit<StandardSlide, 'background' | 'sectionTag' | 'type'> {
  // 覆盖标准库的 background 字段
  background?: ProjectSlideBackground

  // 项目特有字段
  pageId?: string                  // 业务层面的页面ID
  tag?: PageTag                    // 页面类型标签
  listCount?: number               // 列表项数量（用于 tag === 'list'）
  aiImage?: boolean                // 是否包含AI生成的图片
  aiImageStatus?: string           // AI图片生成状态
  fillPageType?: number            // 页面填充类型
}

/**
 * 列表页专用类型
 *
 * 项目特有的列表页类型，包含付费信息和自动填充功能
 */
export interface ProjectSlideListBase extends ProjectSlideBase {
  tag: 'list'                      // 固定为 'list'
  payType: TemplatePayType         // 付费类型
  listFlag: string                 // 列表标识符
  autoFill: boolean                // 是否自动填充
}

/**
 * 项目扩展的列表页类型（完整版）
 */
export type ProjectSlideList = ProjectSlideListBase & { elements: PPTElement[] }

/**
 * 项目扩展的幻灯片类型（联合类型）
 *
 * 包含普通幻灯片和列表幻灯片两种类型
 */
export type ProjectSlide =
  | (ProjectSlideBase & { elements: PPTElement[] })  // 普通幻灯片
  | ProjectSlideList                                  // 列表幻灯片

// ==================== 导出重命名类型 ====================

/**
 * 为了方便使用，导出常用类型的别名
 */
export type {
  Note,
  NoteReply,
  TurningMode,
  PPTAnimation
}

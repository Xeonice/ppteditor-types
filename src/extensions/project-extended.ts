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
 * AI 图片生成状态
 */
export type AIImageStatus = 'pending' | 'success' | 'failed'

/**
 * 主题色类型
 *
 * Office PPT 主题色系统包含：
 * - 6种强调色（accent1-6）
 * - 2种深色（dk1-2，用于文本）
 * - 2种浅色（lt1-2，用于背景）
 *
 * 参考: Office Open XML 主题色规范
 */
export type ThemeColorType =
  // 强调色（Accent Colors）
  | 'accent1'      // 强调色1
  | 'accent2'      // 强调色2
  | 'accent3'      // 强调色3
  | 'accent4'      // 强调色4
  | 'accent5'      // 强调色5
  | 'accent6'      // 强调色6
  // 深色（Dark Colors）- 主要用于文本
  | 'dk1'          // 深色1（主要文本）
  | 'dk2'          // 深色2（次要文本）
  // 浅色（Light Colors）- 主要用于背景
  | 'lt1'          // 浅色1（主要背景）
  | 'lt2'          // 浅色2（次要背景）

/**
 * 颜色配置类型
 * 支持主题色系统的复杂颜色配置
 *
 * @example
 * ```typescript
 * // 简单颜色
 * const simpleColor: ColorConfig = {
 *   color: '#FF0000'
 * }
 *
 * // 主题色配置（完整版）
 * const themeColor: ColorConfig = {
 *   color: '#FF0000',
 *   themeColor: {
 *     color: '#FF0000',
 *     type: 'accent1'
 *   },
 *   opacity: 0.8
 * }
 *
 * // 主题色配置（简化版）
 * const simpleThemeColor: ColorConfig = {
 *   color: '#FF0000',
 *   colorType: 'accent1',  // 直接指定主题色类型
 *   colorIndex: 1
 * }
 * ```
 */
export interface ColorConfig {
  color: string                    // 实际颜色值（必需）
  themeColor?: {                   // 主题色引用（可选，完整版）
    color: string
    type: ThemeColorType           // 主题色类型
  }
  colorType?: ThemeColorType       // 主题色类型（可选，简化版，用于不需要完整 themeColor 对象的场景）
  colorIndex?: number              // 颜色索引（可选）
  opacity?: number                 // 不透明度 0-1（可选）
}

// ==================== 项目扩展的背景类型 ====================

/**
 * 纯色背景类型
 *
 * @example
 * ```typescript
 * const solidBg: ProjectSolidBackground = {
 *   type: 'solid',
 *   themeColor: {
 *     color: '#FFFFFF',
 *     themeColor: {
 *       color: '#FFFFFF',
 *       type: 'background1'
 *     }
 *   }
 * }
 * ```
 */
export interface ProjectSolidBackground {
  type: 'solid'
  themeColor: ColorConfig  // 纯色背景（必需）
}

/**
 * 图片背景类型
 *
 * @example
 * ```typescript
 * const imageBg: ProjectImageBackground = {
 *   type: 'image',
 *   image: 'https://example.com/background.jpg',
 *   imageSize: 'cover'
 * }
 * ```
 */
export interface ProjectImageBackground {
  type: 'image'
  image: string                                   // 图片URL（必需）
  imageSize?: 'cover' | 'contain' | 'repeat'      // 图片尺寸模式
}

/**
 * 渐变背景类型
 *
 * @example
 * ```typescript
 * const gradientBg: ProjectGradientBackground = {
 *   type: 'gradient',
 *   gradientType: 'linear',
 *   gradientColor: [
 *     { color: '#FF0000' },
 *     { color: '#0000FF' }
 *   ],
 *   gradientRotate: 90
 * }
 * ```
 */
export interface ProjectGradientBackground {
  type: 'gradient'
  gradientType: 'linear' | 'radial'               // 渐变类型（必需）
  gradientColor: [ColorConfig, ColorConfig]       // 双色渐变（必需）
  gradientRotate?: number                         // 渐变旋转角度
}

/**
 * 项目扩展的幻灯片背景类型（判别联合）
 *
 * 使用判别联合类型确保类型安全，防止无效的属性组合
 *
 * 与标准库的主要差异：
 * 1. 使用 ColorConfig 而非简单的 string
 * 2. 图片背景使用扁平结构（image + imageSize）
 * 3. 渐变背景使用扁平结构（gradientType + gradientColor + gradientRotate）
 * 4. 渐变色仅支持双色渐变
 * 5. 使用判别联合确保每种类型的必需字段
 *
 * @example
 * ```typescript
 * // TypeScript 会根据 type 字段进行类型缩窄
 * function applyBackground(bg: ProjectSlideBackground) {
 *   switch (bg.type) {
 *     case 'solid':
 *       // bg 被缩窄为 ProjectSolidBackground
 *       console.log(bg.themeColor)
 *       break
 *     case 'image':
 *       // bg 被缩窄为 ProjectImageBackground
 *       console.log(bg.image, bg.imageSize)
 *       break
 *     case 'gradient':
 *       // bg 被缩窄为 ProjectGradientBackground
 *       console.log(bg.gradientType, bg.gradientColor)
 *       break
 *   }
 * }
 * ```
 */
export type ProjectSlideBackground =
  | ProjectSolidBackground
  | ProjectImageBackground
  | ProjectGradientBackground

// ==================== 项目扩展的 Slide 类型 ====================

/**
 * 项目扩展的幻灯片基础类型
 *
 * 继承自标准 Slide，并添加项目特有字段
 *
 * @example
 * ```typescript
 * const slide: ProjectSlideBase = {
 *   id: 'slide-1',
 *   elements: [],
 *   tag: 'content',
 *   pageId: 'page-123',
 *   aiImage: true,
 *   aiImageStatus: 'success',
 *   background: {
 *     type: 'solid',
 *     themeColor: { color: '#F5F5F5' }
 *   }
 * }
 * ```
 */
export interface ProjectSlideBase extends Omit<StandardSlide, 'background' | 'sectionTag' | 'type'> {
  // 覆盖标准库的 background 字段
  background?: ProjectSlideBackground

  // 项目特有字段
  pageId?: string                  // 业务层面的页面ID
  tag?: PageTag                    // 页面类型标签
  listCount?: number               // 列表项数量（用于 tag === 'list'）
  aiImage?: boolean                // 是否包含AI生成的图片
  aiImageStatus?: AIImageStatus    // AI图片生成状态（类型安全）
  fillPageType?: number            // 页面填充类型
}

/**
 * 列表页专用类型
 *
 * 项目特有的列表页类型，包含付费信息和自动填充功能
 *
 * @example
 * ```typescript
 * const listSlide: ProjectSlideListBase = {
 *   id: 'list-1',
 *   elements: [],
 *   tag: 'list',
 *   payType: 'free',
 *   listFlag: 'template-list-1',
 *   autoFill: true,
 *   listCount: 20
 * }
 * ```
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
 *
 * @example
 * ```typescript
 * // 普通幻灯片
 * const regularSlide: ProjectSlide = {
 *   id: 'slide-1',
 *   elements: [],
 *   tag: 'content',
 *   pageId: 'page-1'
 * }
 *
 * // 列表页
 * const listSlide: ProjectSlide = {
 *   id: 'slide-2',
 *   elements: [],
 *   tag: 'list',
 *   payType: 'free',
 *   listFlag: 'list-1',
 *   autoFill: true
 * }
 * ```
 */
export type ProjectSlide =
  | (ProjectSlideBase & { elements: PPTElement[] })  // 普通幻灯片
  | ProjectSlideList                                  // 列表幻灯片

// ==================== 类型守卫辅助函数 ====================

/**
 * 类型守卫：检查幻灯片是否为列表页
 *
 * @param slide - 要检查的幻灯片
 * @returns 如果是列表页返回 true，否则返回 false
 *
 * @example
 * ```typescript
 * const slide: ProjectSlide = getSlide()
 *
 * if (isProjectSlideList(slide)) {
 *   // TypeScript 会将 slide 类型缩窄为 ProjectSlideList
 *   console.log(slide.payType, slide.autoFill)
 * }
 * ```
 */
export function isProjectSlideList(slide: ProjectSlide): slide is ProjectSlideList {
  return slide.tag === 'list' && 'payType' in slide
}

// ==================== 运行时验证辅助函数 ====================

/**
 * 验证未知数据是否为有效的 ProjectSlide
 *
 * 用于运行时验证外部数据（API 响应、文件解析等）
 *
 * @param data - 要验证的数据
 * @returns 如果数据符合 ProjectSlide 类型返回 true
 *
 * @example
 * ```typescript
 * // 验证 API 响应
 * const apiData = await fetch('/api/slide').then(r => r.json())
 *
 * if (validateProjectSlide(apiData)) {
 *   // apiData 现在被类型守卫为 ProjectSlide
 *   processSlide(apiData)
 * } else {
 *   console.error('Invalid slide data')
 * }
 * ```
 */
export function validateProjectSlide(data: unknown): data is ProjectSlide {
  if (!data || typeof data !== 'object') return false

  const slide = data as Record<string, unknown>

  // 验证必需字段
  if (typeof slide.id !== 'string') return false
  if (!Array.isArray(slide.elements)) return false

  // 验证可选字段类型
  if (slide.pageId !== undefined && typeof slide.pageId !== 'string') return false
  if (slide.tag !== undefined && typeof slide.tag !== 'string') return false
  if (slide.listCount !== undefined && typeof slide.listCount !== 'number') return false
  if (slide.aiImage !== undefined && typeof slide.aiImage !== 'boolean') return false
  if (slide.aiImageStatus !== undefined && typeof slide.aiImageStatus !== 'string') return false
  if (slide.fillPageType !== undefined && typeof slide.fillPageType !== 'number') return false

  // 如果是列表页，验证列表页必需字段
  if (slide.tag === 'list') {
    if (typeof slide.payType !== 'string') return false
    if (typeof slide.listFlag !== 'string') return false
    if (typeof slide.autoFill !== 'boolean') return false
  }

  // 验证背景字段（如果存在）
  if (slide.background !== undefined && slide.background !== null) {
    if (typeof slide.background !== 'object') return false
    const bg = slide.background as Record<string, unknown>
    if (typeof bg.type !== 'string') return false
    if (!['solid', 'image', 'gradient'].includes(bg.type as string)) return false
  }

  return true
}

/**
 * 验证未知数据是否为有效的 ColorConfig
 *
 * @param data - 要验证的数据
 * @returns 如果数据符合 ColorConfig 类型返回 true
 *
 * @example
 * ```typescript
 * if (validateColorConfig(data)) {
 *   applyColor(data)
 * }
 * ```
 */
export function validateColorConfig(data: unknown): data is ColorConfig {
  if (!data || typeof data !== 'object') return false

  const color = data as Record<string, unknown>

  if (typeof color.color !== 'string') return false

  // Validate opacity range (0-1)
  if (color.opacity !== undefined) {
    if (typeof color.opacity !== 'number') return false
    if (color.opacity < 0 || color.opacity > 1) return false
  }

  if (color.colorIndex !== undefined && typeof color.colorIndex !== 'number') return false

  // Validate colorType enum (ThemeColorType)
  if (color.colorType !== undefined) {
    if (typeof color.colorType !== 'string') return false
    const validColorTypes = [
      'accent1', 'accent2', 'accent3', 'accent4', 'accent5', 'accent6',
      'dk1', 'dk2', 'lt1', 'lt2'
    ]
    if (!validColorTypes.includes(color.colorType as string)) return false
  }

  if (color.themeColor !== undefined) {
    if (typeof color.themeColor !== 'object' || color.themeColor === null) return false
    const tc = color.themeColor as Record<string, unknown>
    if (typeof tc.color !== 'string') return false
    if (typeof tc.type !== 'string') return false
  }

  return true
}

/**
 * 验证未知数据是否为有效的 ProjectSlideBackground
 *
 * @param data - 要验证的数据
 * @returns 如果数据符合 ProjectSlideBackground 类型返回 true
 *
 * @example
 * ```typescript
 * if (validateProjectSlideBackground(data)) {
 *   applyBackground(data)
 * }
 * ```
 */
export function validateProjectSlideBackground(data: unknown): data is ProjectSlideBackground {
  if (!data || typeof data !== 'object') return false

  const bg = data as Record<string, unknown>

  if (typeof bg.type !== 'string') return false

  switch (bg.type) {
    case 'solid':
      return bg.themeColor !== undefined && validateColorConfig(bg.themeColor)

    case 'image':
      if (typeof bg.image !== 'string') return false
      if (bg.imageSize !== undefined) {
        if (typeof bg.imageSize !== 'string') return false
        if (!['cover', 'contain', 'repeat'].includes(bg.imageSize as string)) return false
      }
      return true

    case 'gradient':
      if (typeof bg.gradientType !== 'string') return false
      if (!['linear', 'radial'].includes(bg.gradientType as string)) return false
      if (!Array.isArray(bg.gradientColor)) return false
      if (bg.gradientColor.length !== 2) return false
      if (!validateColorConfig(bg.gradientColor[0])) return false
      if (!validateColorConfig(bg.gradientColor[1])) return false
      // Validate gradientRotate range (0-360)
      if (bg.gradientRotate !== undefined) {
        if (typeof bg.gradientRotate !== 'number') return false
        if (bg.gradientRotate < 0 || bg.gradientRotate > 360) return false
      }
      return true

    default:
      return false
  }
}

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

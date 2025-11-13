// src/presentation/presentation.ts

import type { Slide } from '../slide/slide.js'

/**
 * V2 文档主题类型
 */
export interface PresentationTheme {
  /** 字体名称 */
  fontName: string

  /** 主题颜色映射 */
  themeColor?: Record<string, string>
}

/**
 * V2 文档元数据
 */
export interface PresentationMetadata {
  /** 格式版本 */
  version: '2.0'

  /** 解析时间 */
  parsedAt?: string

  /** 使用的功能特性 */
  features?: string[]

  /** 作者 */
  author?: string

  /** 创建时间 */
  created?: string

  /** 修改时间 */
  modified?: string

  /** 描述 */
  description?: string
}

/**
 * V2 文档类型（Presentation）
 *
 * 标准格式，对应 backgroundFormat: "pptist"
 *
 * @example
 * ```typescript
 * const presentation: Presentation = {
 *   width: 1280,
 *   height: 720,
 *   slides: [...],
 *   theme: { fontName: 'Arial' },
 *   title: 'My Presentation',
 *   fileName: 'presentation.pptx',
 *   metadata: {
 *     version: '2.0',
 *     parsedAt: '2025-01-12T10:00:00.000Z'
 *   }
 * }
 * ```
 */
export interface Presentation {
  /** 画布宽度（points） */
  width: number

  /** 画布高度（points） */
  height: number

  /** 幻灯片数组 */
  slides: Slide[]

  /** 主题信息 */
  theme: PresentationTheme

  /** 文档标题 */
  title: string

  /** 文件名 */
  fileName: string

  /** 文档元数据（可选） */
  metadata?: PresentationMetadata
}

/**
 * V2 文档类型别名
 */
export type Document = Presentation
export type V2Presentation = Presentation
export type V2Document = Presentation
export type PPTistPresentation = Presentation

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

  /** 文档标题 */
  title?: string

  /** 作者 */
  author?: string

  /** 创建时间 */
  created?: string

  /** 修改时间 */
  modified?: string

  /** 描述 */
  description?: string

  /** 幻灯片总数 */
  slideCount?: number

  /** 元素总数 */
  elementCount?: number
}

/**
 * 文档尺寸
 */
export interface PresentationSize {
  /** 宽度（points） */
  width: number

  /** 高度（points） */
  height: number

  /** 宽高比 */
  aspectRatio?: string
}

/**
 * V2 文档类型（Presentation）
 *
 * 标准格式，对应 backgroundFormat: "pptist"
 *
 * @example
 * ```typescript
 * const presentation: Presentation = {
 *   size: { width: 1280, height: 720 },
 *   slides: [...],
 *   theme: { fontName: 'Arial' },
 *   fileName: 'presentation.pptx',
 *   metadata: {
 *     version: '2.0',
 *     title: 'My Presentation',
 *     parsedAt: '2025-01-12T10:00:00.000Z'
 *   }
 * }
 * ```
 */
export interface Presentation {
  /** 文档尺寸 */
  size: PresentationSize

  /** 幻灯片数组 */
  slides: Slide[]

  /** 主题信息 */
  theme: PresentationTheme

  /** 文件名 */
  fileName: string

  /** 文档元数据 */
  metadata: PresentationMetadata
}

/**
 * V2 文档类型别名
 */
export type Document = Presentation
export type V2Presentation = Presentation
export type V2Document = Presentation
export type PPTistPresentation = Presentation

// src/presentation/legacy-presentation.ts

import type { Slide } from '../slide/slide.js'

/**
 * V1 文档主题类型
 */
export interface LegacyPresentationTheme {
  /** 字体名称 */
  fontName: string

  /** 主题颜色映射 */
  themeColor?: Record<string, string>
}

/**
 * V1 文档元数据
 */
export interface LegacyPresentationMetadata {
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
}

/**
 * V1 文档类型（Legacy Presentation）
 *
 * 用于向后兼容，对应 backgroundFormat: "legacy"
 *
 * @example
 * ```typescript
 * const legacyDoc: LegacyPresentation = {
 *   width: 1280,
 *   height: 720,
 *   slides: [...],
 *   theme: {
 *     fontName: 'Arial',
 *     themeColor: { accent1: '#4472C4' }
 *   },
 *   title: 'My Presentation'
 * }
 * ```
 */
export interface LegacyPresentation {
  /** 画布宽度（points） */
  width: number

  /** 画布高度（points） */
  height: number

  /** 幻灯片数组 */
  slides: Slide[]

  /** 主题信息 */
  theme: LegacyPresentationTheme

  /** 文档标题 */
  title: string

  /** 元数据（可选） */
  metadata?: LegacyPresentationMetadata
}

/**
 * V1 文档类型别名（用于兼容不同命名习惯）
 */
export type LegacyDocument = LegacyPresentation
export type V1Presentation = LegacyPresentation
export type V1Document = LegacyPresentation

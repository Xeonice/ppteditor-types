// src/utils/presentation-validator.ts

import type { LegacyPresentation } from '../presentation/legacy-presentation.js'
import type { Presentation } from '../presentation/presentation.js'

/**
 * V1 文档验证器
 */
export class LegacyPresentationValidator {
  /**
   * 验证 V1 文档结构
   */
  static validate(data: unknown): data is LegacyPresentation {
    if (!data || typeof data !== 'object') return false

    const doc = data as any

    // 必需字段检查
    if (typeof doc.width !== 'number') return false
    if (typeof doc.height !== 'number') return false
    if (!Array.isArray(doc.slides)) return false
    if (!doc.theme || typeof doc.theme !== 'object') return false
    if (typeof doc.theme.fontName !== 'string') return false
    if (typeof doc.title !== 'string') return false

    // 幻灯片结构检查
    for (const slide of doc.slides) {
      if (!slide || typeof slide !== 'object') return false
      if (typeof slide.id !== 'string') return false
      if (!Array.isArray(slide.elements)) return false
    }

    return true
  }

  /**
   * 验证并抛出错误
   */
  static validateOrThrow(data: unknown): asserts data is LegacyPresentation {
    if (!this.validate(data)) {
      throw new Error('Invalid LegacyPresentation structure')
    }
  }
}

/**
 * V2 文档验证器
 */
export class PresentationValidator {
  /**
   * 验证 V2 文档结构
   */
  static validate(data: unknown): data is Presentation {
    if (!data || typeof data !== 'object') return false

    const doc = data as any

    // 必需字段检查
    if (!doc.size || typeof doc.size !== 'object') return false
    if (typeof doc.size.width !== 'number') return false
    if (typeof doc.size.height !== 'number') return false
    if (!Array.isArray(doc.slides)) return false
    if (!doc.theme || typeof doc.theme !== 'object') return false
    if (typeof doc.fileName !== 'string') return false
    if (!doc.metadata || typeof doc.metadata !== 'object') return false
    if (doc.metadata.version !== '2.0') return false

    // 幻灯片结构检查
    for (const slide of doc.slides) {
      if (!slide || typeof slide !== 'object') return false
      if (typeof slide.id !== 'string') return false
      if (!Array.isArray(slide.elements)) return false
    }

    return true
  }

  /**
   * 验证并抛出错误
   */
  static validateOrThrow(data: unknown): asserts data is Presentation {
    if (!this.validate(data)) {
      throw new Error('Invalid Presentation structure')
    }
  }
}

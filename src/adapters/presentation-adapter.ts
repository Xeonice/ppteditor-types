// src/adapters/presentation-adapter.ts

import type { LegacyPresentation } from '../presentation/legacy-presentation.js'
import type { Presentation } from '../presentation/presentation.js'

/**
 * V1 → V2 文档适配器
 */
export class LegacyPresentationToV2Adapter {
  /**
   * 将 V1 文档转换为 V2 文档
   */
  static convert(legacy: LegacyPresentation): Presentation {
    return {
      size: {
        width: legacy.width,
        height: legacy.height,
        aspectRatio: this.calculateAspectRatio(legacy.width, legacy.height)
      },
      slides: legacy.slides,
      theme: {
        fontName: legacy.theme.fontName,
        themeColor: legacy.theme.themeColor
      },
      fileName: 'presentation.pptx',
      metadata: {
        version: '2.0',
        title: legacy.title,
        author: legacy.metadata?.author,
        created: legacy.metadata?.created,
        modified: legacy.metadata?.modified,
        description: legacy.metadata?.description,
        slideCount: legacy.slides.length,
        elementCount: legacy.slides.reduce(
          (sum, slide) => sum + slide.elements.length,
          0
        )
      }
    }
  }

  private static calculateAspectRatio(width: number, height: number): string {
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
    const divisor = gcd(width, height)
    return `${width / divisor}:${height / divisor}`
  }
}

/**
 * V2 → V1 文档适配器
 */
export class V2PresentationToLegacyAdapter {
  /**
   * 将 V2 文档转换为 V1 文档
   */
  static convert(presentation: Presentation): LegacyPresentation {
    return {
      width: presentation.size.width,
      height: presentation.size.height,
      slides: presentation.slides,
      theme: {
        fontName: presentation.theme.fontName,
        themeColor: presentation.theme.themeColor
      },
      title: presentation.metadata.title || 'Presentation',
      metadata: {
        title: presentation.metadata.title,
        author: presentation.metadata.author,
        created: presentation.metadata.created,
        modified: presentation.metadata.modified,
        description: presentation.metadata.description
      }
    }
  }
}

/**
 * 自动检测并转换文档
 */
export class AutoPresentationAdapter {
  /**
   * 检测文档版本
   */
  static detectVersion(data: any): 'v1' | 'v2' | 'unknown' {
    if (!data || typeof data !== 'object') return 'unknown'

    // V2 特征：有 size 对象和 metadata.version
    if (data.size && typeof data.size === 'object' && data.metadata?.version === '2.0') {
      return 'v2'
    }

    // V1 特征：有 width/height 字段且没有 size
    if (typeof data.width === 'number' && typeof data.height === 'number' && !data.size) {
      return 'v1'
    }

    return 'unknown'
  }

  /**
   * 自动转换为 V2
   */
  static toV2(data: LegacyPresentation | Presentation): Presentation {
    const version = this.detectVersion(data)

    if (version === 'v2') {
      return data as Presentation
    }

    if (version === 'v1') {
      return LegacyPresentationToV2Adapter.convert(data as LegacyPresentation)
    }

    throw new Error('Cannot detect presentation version')
  }

  /**
   * 自动转换为 V1
   */
  static toV1(data: LegacyPresentation | Presentation): LegacyPresentation {
    const version = this.detectVersion(data)

    if (version === 'v1') {
      return data as LegacyPresentation
    }

    if (version === 'v2') {
      return V2PresentationToLegacyAdapter.convert(data as Presentation)
    }

    throw new Error('Cannot detect presentation version')
  }
}

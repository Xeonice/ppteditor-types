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
      width: legacy.width,
      height: legacy.height,
      slides: legacy.slides,
      theme: {
        fontName: legacy.theme.fontName,
        themeColor: legacy.theme.themeColor
      },
      title: legacy.title,
      fileName: 'presentation.pptx',
      metadata: {
        version: '2.0',
        author: legacy.metadata?.author,
        created: legacy.metadata?.created,
        modified: legacy.metadata?.modified,
        description: legacy.metadata?.description
      }
    }
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
      width: presentation.width,
      height: presentation.height,
      slides: presentation.slides,
      theme: {
        fontName: presentation.theme.fontName,
        themeColor: presentation.theme.themeColor
      },
      title: presentation.title,
      metadata: {
        title: presentation.title,
        author: presentation.metadata?.author,
        created: presentation.metadata?.created,
        modified: presentation.metadata?.modified,
        description: presentation.metadata?.description
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

    // V2 特征：有 fileName 字段和 metadata.version
    if (typeof data.fileName === 'string' && data.metadata?.version === '2.0') {
      return 'v2'
    }

    // V1 特征：有 width/height/title 字段但没有 fileName
    if (typeof data.width === 'number' && typeof data.height === 'number' && !data.fileName) {
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

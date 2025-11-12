// tests/presentation/presentation-adapter.test.ts

import { describe, it, expect } from 'vitest'
import {
  LegacyPresentationToV2Adapter,
  V2PresentationToLegacyAdapter,
  AutoPresentationAdapter
} from '../../src/adapters/presentation-adapter.js'
import type { LegacyPresentation } from '../../src/presentation/legacy-presentation.js'
import type { Presentation } from '../../src/presentation/presentation.js'

describe('PresentationAdapter', () => {
  describe('LegacyPresentationToV2Adapter', () => {
    it('应该将 V1 文档转换为 V2', () => {
      const v1Doc: LegacyPresentation = {
        width: 1280,
        height: 720,
        slides: [],
        theme: { fontName: 'Arial' },
        title: 'Test'
      }

      const v2Doc = LegacyPresentationToV2Adapter.convert(v1Doc)

      expect(v2Doc.size.width).toBe(1280)
      expect(v2Doc.size.height).toBe(720)
      expect(v2Doc.size.aspectRatio).toBe('16:9')
      expect(v2Doc.metadata.version).toBe('2.0')
      expect(v2Doc.metadata.title).toBe('Test')
      expect(v2Doc.theme.fontName).toBe('Arial')
      expect(v2Doc.fileName).toBe('presentation.pptx')
    })

    it('应该正确计算宽高比', () => {
      const v1Doc: LegacyPresentation = {
        width: 1920,
        height: 1080,
        slides: [],
        theme: { fontName: 'Arial' },
        title: 'Test'
      }

      const v2Doc = LegacyPresentationToV2Adapter.convert(v1Doc)
      expect(v2Doc.size.aspectRatio).toBe('16:9')
    })

    it('应该计算幻灯片总数和元素总数', () => {
      const v1Doc: LegacyPresentation = {
        width: 1280,
        height: 720,
        slides: [
          {
            id: 'slide-1',
            elements: [
              { id: 'el-1', type: 'text' } as any,
              { id: 'el-2', type: 'shape' } as any
            ],
            background: { type: 'solid', color: '#ffffff' }
          },
          {
            id: 'slide-2',
            elements: [
              { id: 'el-3', type: 'image' } as any
            ],
            background: { type: 'solid', color: '#ffffff' }
          }
        ],
        theme: { fontName: 'Arial' },
        title: 'Test'
      }

      const v2Doc = LegacyPresentationToV2Adapter.convert(v1Doc)
      expect(v2Doc.metadata.slideCount).toBe(2)
      expect(v2Doc.metadata.elementCount).toBe(3)
    })

    it('应该转换主题颜色', () => {
      const v1Doc: LegacyPresentation = {
        width: 1280,
        height: 720,
        slides: [],
        theme: {
          fontName: 'Arial',
          themeColor: {
            accent1: '#4472C4',
            accent2: '#ED7D31'
          }
        },
        title: 'Test'
      }

      const v2Doc = LegacyPresentationToV2Adapter.convert(v1Doc)
      expect(v2Doc.theme.themeColor).toEqual({
        accent1: '#4472C4',
        accent2: '#ED7D31'
      })
    })

    it('应该转换元数据', () => {
      const v1Doc: LegacyPresentation = {
        width: 1280,
        height: 720,
        slides: [],
        theme: { fontName: 'Arial' },
        title: 'Test',
        metadata: {
          author: 'Test Author',
          created: '2025-01-12',
          modified: '2025-01-12',
          description: 'Test Description'
        }
      }

      const v2Doc = LegacyPresentationToV2Adapter.convert(v1Doc)
      expect(v2Doc.metadata.author).toBe('Test Author')
      expect(v2Doc.metadata.created).toBe('2025-01-12')
      expect(v2Doc.metadata.modified).toBe('2025-01-12')
      expect(v2Doc.metadata.description).toBe('Test Description')
    })
  })

  describe('V2PresentationToLegacyAdapter', () => {
    it('应该将 V2 文档转换为 V1', () => {
      const v2Doc: Presentation = {
        size: {
          width: 1280,
          height: 720,
          aspectRatio: '16:9'
        },
        slides: [],
        theme: { fontName: 'Arial' },
        fileName: 'test.pptx',
        metadata: {
          version: '2.0',
          title: 'Test'
        }
      }

      const v1Doc = V2PresentationToLegacyAdapter.convert(v2Doc)

      expect(v1Doc.width).toBe(1280)
      expect(v1Doc.height).toBe(720)
      expect(v1Doc.title).toBe('Test')
      expect(v1Doc.theme.fontName).toBe('Arial')
    })

    it('应该使用默认标题当 metadata.title 缺失时', () => {
      const v2Doc: Presentation = {
        size: { width: 1280, height: 720 },
        slides: [],
        theme: { fontName: 'Arial' },
        fileName: 'test.pptx',
        metadata: { version: '2.0' }
      }

      const v1Doc = V2PresentationToLegacyAdapter.convert(v2Doc)
      expect(v1Doc.title).toBe('Presentation')
    })

    it('应该转换主题颜色', () => {
      const v2Doc: Presentation = {
        size: { width: 1280, height: 720 },
        slides: [],
        theme: {
          fontName: 'Arial',
          themeColor: {
            accent1: '#4472C4'
          }
        },
        fileName: 'test.pptx',
        metadata: { version: '2.0' }
      }

      const v1Doc = V2PresentationToLegacyAdapter.convert(v2Doc)
      expect(v1Doc.theme.themeColor).toEqual({
        accent1: '#4472C4'
      })
    })

    it('应该转换元数据', () => {
      const v2Doc: Presentation = {
        size: { width: 1280, height: 720 },
        slides: [],
        theme: { fontName: 'Arial' },
        fileName: 'test.pptx',
        metadata: {
          version: '2.0',
          title: 'Test',
          author: 'Test Author',
          created: '2025-01-12',
          modified: '2025-01-12',
          description: 'Test Description'
        }
      }

      const v1Doc = V2PresentationToLegacyAdapter.convert(v2Doc)
      expect(v1Doc.metadata?.title).toBe('Test')
      expect(v1Doc.metadata?.author).toBe('Test Author')
      expect(v1Doc.metadata?.created).toBe('2025-01-12')
    })
  })

  describe('AutoPresentationAdapter', () => {
    it('应该自动检测 V1 文档', () => {
      const v1Doc = {
        width: 1280,
        height: 720,
        slides: [],
        theme: { fontName: 'Arial' },
        title: 'Test'
      }

      expect(AutoPresentationAdapter.detectVersion(v1Doc)).toBe('v1')
    })

    it('应该自动检测 V2 文档', () => {
      const v2Doc = {
        size: { width: 1280, height: 720 },
        slides: [],
        theme: { fontName: 'Arial' },
        fileName: 'test.pptx',
        metadata: { version: '2.0', title: 'Test' }
      }

      expect(AutoPresentationAdapter.detectVersion(v2Doc)).toBe('v2')
    })

    it('应该返回 unknown 对于无效数据', () => {
      expect(AutoPresentationAdapter.detectVersion(null)).toBe('unknown')
      expect(AutoPresentationAdapter.detectVersion(undefined)).toBe('unknown')
      expect(AutoPresentationAdapter.detectVersion({})).toBe('unknown')
      expect(AutoPresentationAdapter.detectVersion('string')).toBe('unknown')
    })

    it('应该自动转换 V1 到 V2', () => {
      const v1Doc: LegacyPresentation = {
        width: 1280,
        height: 720,
        slides: [],
        theme: { fontName: 'Arial' },
        title: 'Test'
      }

      const result = AutoPresentationAdapter.toV2(v1Doc)
      expect(result.metadata.version).toBe('2.0')
      expect(result.size.width).toBe(1280)
    })

    it('应该保持 V2 文档不变', () => {
      const v2Doc: Presentation = {
        size: { width: 1280, height: 720 },
        slides: [],
        theme: { fontName: 'Arial' },
        fileName: 'test.pptx',
        metadata: { version: '2.0' }
      }

      const result = AutoPresentationAdapter.toV2(v2Doc)
      expect(result).toBe(v2Doc)
    })

    it('应该在无法检测版本时抛出错误', () => {
      expect(() => {
        AutoPresentationAdapter.toV2({} as any)
      }).toThrow('Cannot detect presentation version')
    })

    it('应该自动转换 V2 到 V1', () => {
      const v2Doc: Presentation = {
        size: { width: 1280, height: 720 },
        slides: [],
        theme: { fontName: 'Arial' },
        fileName: 'test.pptx',
        metadata: { version: '2.0', title: 'Test' }
      }

      const result = AutoPresentationAdapter.toV1(v2Doc)
      expect(result.width).toBe(1280)
      expect(result.title).toBe('Test')
    })

    it('应该保持 V1 文档不变', () => {
      const v1Doc: LegacyPresentation = {
        width: 1280,
        height: 720,
        slides: [],
        theme: { fontName: 'Arial' },
        title: 'Test'
      }

      const result = AutoPresentationAdapter.toV1(v1Doc)
      expect(result).toBe(v1Doc)
    })
  })
})

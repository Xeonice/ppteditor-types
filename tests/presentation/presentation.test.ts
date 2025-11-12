// tests/presentation/presentation.test.ts

import { describe, it, expect } from 'vitest'
import type { Presentation } from '../../src/presentation/presentation.js'
import { PresentationValidator } from '../../src/utils/presentation-validator.js'

describe('Presentation (V2)', () => {
  it('应该创建有效的 V2 文档', () => {
    const doc: Presentation = {
      width: 1280,
      height: 720,
      slides: [
        {
          id: 'slide-1',
          elements: [],
          background: {
            type: 'solid',
            color: '#ffffff'
          }
        }
      ],
      theme: {
        fontName: 'Arial'
      },
      fileName: 'test.pptx',
      title: 'Test Presentation',
      metadata: {
        version: '2.0'
      }
    }

    expect(PresentationValidator.validate(doc)).toBe(true)
  })

  it('应该支持完整的元数据字段', () => {
    const doc: Presentation = {
      width: 1280,
      height: 720,
      slides: [],
      theme: {
        fontName: 'Arial'
      },
      fileName: 'test.pptx',
      title: 'Test Presentation',
      metadata: {
        version: '2.0',
        author: 'Test Author',
        created: '2025-01-12T10:00:00.000Z',
        modified: '2025-01-12T11:00:00.000Z',
        description: 'Test Description',
        parsedAt: '2025-01-12T10:00:00.000Z',
        features: ['tables', 'charts']
      }
    }

    expect(PresentationValidator.validate(doc)).toBe(true)
    expect(doc.metadata.author).toBe('Test Author')
    expect(doc.metadata.features).toEqual(['tables', 'charts'])
  })

  it('应该支持主题颜色映射', () => {
    const doc: Presentation = {
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
      title: 'Test',
      fileName: 'test.pptx',
      metadata: {
        version: '2.0'
      }
    }

    expect(PresentationValidator.validate(doc)).toBe(true)
    expect(doc.theme.themeColor?.accent1).toBe('#4472C4')
  })

  it('应该拒绝缺少 width/height 的文档', () => {
    const invalidDoc = {
      // 缺少 width/height
      slides: [],
      theme: {
        fontName: 'Arial'
      },
      fileName: 'test.pptx',
      metadata: {
        version: '2.0'
      }
    }

    expect(PresentationValidator.validate(invalidDoc)).toBe(false)
  })

  it('应该拒绝 metadata.version 不是 "2.0" 的文档', () => {
    const invalidDoc = {
      width: 1280,
      height: 720,
      slides: [],
      theme: {
        fontName: 'Arial'
      },
      fileName: 'test.pptx',
      metadata: {
        version: '1.0' // 错误：应该是 "2.0"
      }
    }

    expect(PresentationValidator.validate(invalidDoc)).toBe(false)
  })

  it('应该拒绝缺少 fileName 的文档', () => {
    const invalidDoc = {
      width: 1280,
      height: 720,
      slides: [],
      theme: {
        fontName: 'Arial'
      },
      // 缺少 fileName
      metadata: {
        version: '2.0'
      }
    }

    expect(PresentationValidator.validate(invalidDoc)).toBe(false)
  })

  it('validateOrThrow 应该在验证失败时抛出错误', () => {
    const invalidDoc = {
      width: 1280,
      height: 720
      // 缺少其他必需字段
    }

    expect(() => {
      PresentationValidator.validateOrThrow(invalidDoc)
    }).toThrow('Invalid Presentation structure')
  })

  it('validateOrThrow 应该在验证成功时不抛出错误', () => {
    const validDoc: Presentation = {
      width: 1280,
      height: 720,
      slides: [],
      theme: {
        fontName: 'Arial'
      },
      title: 'Test',
      fileName: 'test.pptx',
      metadata: {
        version: '2.0'
      }
    }

    expect(() => {
      PresentationValidator.validateOrThrow(validDoc)
    }).not.toThrow()
  })

  it('应该支持所有类型别名', () => {
    const doc: Presentation = {
      width: 1280,
      height: 720,
      slides: [],
      theme: { fontName: 'Arial' },
      title: 'Test',
      fileName: 'test.pptx',
      metadata: { version: '2.0' }
    }

    // 这些类型别名应该都能使用
    const doc1: import('../../src/presentation/presentation.js').Document = doc
    const doc2: import('../../src/presentation/presentation.js').V2Presentation = doc
    const doc3: import('../../src/presentation/presentation.js').V2Document = doc
    const doc4: import('../../src/presentation/presentation.js').PPTistPresentation = doc

    expect(doc1).toBe(doc)
    expect(doc2).toBe(doc)
    expect(doc3).toBe(doc)
    expect(doc4).toBe(doc)
  })
})

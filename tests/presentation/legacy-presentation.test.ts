// tests/presentation/legacy-presentation.test.ts

import { describe, it, expect } from 'vitest'
import type { LegacyPresentation } from '../../src/presentation/legacy-presentation.js'
import { LegacyPresentationValidator } from '../../src/utils/presentation-validator.js'

describe('LegacyPresentation', () => {
  it('应该创建有效的 V1 文档', () => {
    const doc: LegacyPresentation = {
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
      title: 'Test Presentation'
    }

    expect(LegacyPresentationValidator.validate(doc)).toBe(true)
  })

  it('应该支持可选的 themeColor', () => {
    const doc: LegacyPresentation = {
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

    expect(LegacyPresentationValidator.validate(doc)).toBe(true)
  })

  it('应该支持可选的元数据', () => {
    const doc: LegacyPresentation = {
      width: 1280,
      height: 720,
      slides: [],
      theme: {
        fontName: 'Arial'
      },
      title: 'Test',
      metadata: {
        title: 'Test Presentation',
        author: 'Test Author',
        created: '2025-01-12',
        modified: '2025-01-12',
        description: 'Test Description'
      }
    }

    expect(LegacyPresentationValidator.validate(doc)).toBe(true)
    expect(doc.metadata?.author).toBe('Test Author')
  })

  it('应该拒绝缺少必需字段的文档', () => {
    const invalidDoc = {
      width: 1280,
      // 缺少 height
      slides: [],
      theme: {
        fontName: 'Arial'
      },
      title: 'Test'
    }

    expect(LegacyPresentationValidator.validate(invalidDoc)).toBe(false)
  })

  it('应该拒绝 width 不是数字的文档', () => {
    const invalidDoc = {
      width: '1280', // 错误：应该是数字
      height: 720,
      slides: [],
      theme: {
        fontName: 'Arial'
      },
      title: 'Test'
    }

    expect(LegacyPresentationValidator.validate(invalidDoc)).toBe(false)
  })

  it('应该拒绝缺少 theme.fontName 的文档', () => {
    const invalidDoc = {
      width: 1280,
      height: 720,
      slides: [],
      theme: {},
      title: 'Test'
    }

    expect(LegacyPresentationValidator.validate(invalidDoc)).toBe(false)
  })

  it('validateOrThrow 应该在验证失败时抛出错误', () => {
    const invalidDoc = {
      width: 1280
      // 缺少其他必需字段
    }

    expect(() => {
      LegacyPresentationValidator.validateOrThrow(invalidDoc)
    }).toThrow('Invalid LegacyPresentation structure')
  })

  it('validateOrThrow 应该在验证成功时不抛出错误', () => {
    const validDoc: LegacyPresentation = {
      width: 1280,
      height: 720,
      slides: [],
      theme: {
        fontName: 'Arial'
      },
      title: 'Test'
    }

    expect(() => {
      LegacyPresentationValidator.validateOrThrow(validDoc)
    }).not.toThrow()
  })

  it('应该支持所有类型别名', () => {
    const doc: LegacyPresentation = {
      width: 1280,
      height: 720,
      slides: [],
      theme: { fontName: 'Arial' },
      title: 'Test'
    }

    // 这些类型别名应该都能使用
    const doc1: import('../../src/presentation/legacy-presentation.js').LegacyDocument = doc
    const doc2: import('../../src/presentation/legacy-presentation.js').V1Presentation = doc
    const doc3: import('../../src/presentation/legacy-presentation.js').V1Document = doc

    expect(doc1).toBe(doc)
    expect(doc2).toBe(doc)
    expect(doc3).toBe(doc)
  })
})

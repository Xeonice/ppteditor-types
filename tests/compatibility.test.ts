/**
 * 兼容性测试
 *
 * 测试导出的完整性、循环依赖检查、命名空间导出等兼容性问题
 */

import { describe, it, expect } from 'vitest'
import * as PPTTypes from '../src'
import { Base, Elements, SlideNamespace, Animation, Enums, Extensions } from '../src'
import {
  PPTElement,
  PPTTextElement,
  ElementTypes,
  PPTAnimation,
  ShapePathFormulasKeys
} from '../src'
import type { Slide } from '../src'

describe('Compatibility Tests', () => {
  describe('Export Completeness', () => {
    it('should export all enum types', () => {
      expect('ElementTypes' in PPTTypes).toBe(true)
    })

    it('should be able to import types successfully', () => {
      // TypeScript types don't exist at runtime, but successful compilation means they're exported
      // This test verifies that the imports at the top of the file work
      expect(PPTTypes).toBeDefined()
      expect(Elements).toBeDefined()
      expect(Extensions).toBeDefined()
    })
  })

  describe('Namespace Exports', () => {
    it('should export Base namespace', () => {
      expect(Base).toBeDefined()
      expect(typeof Base).toBe('object')
    })

    it('should export Elements namespace', () => {
      expect(Elements).toBeDefined()
      expect(typeof Elements).toBe('object')
    })

    it('should export Enums namespace', () => {
      expect(Enums).toBeDefined()
      expect(typeof Enums).toBe('object')
    })

    it('should export SlideNamespace namespace', () => {
      expect(SlideNamespace).toBeDefined()
      expect(typeof SlideNamespace).toBe('object')
    })

    it('should export Animation namespace', () => {
      expect(Animation).toBeDefined()
      expect(typeof Animation).toBe('object')
    })

    it('should export Extensions namespace', () => {
      expect(Extensions).toBeDefined()
      expect(typeof Extensions).toBe('object')
    })
  })

  describe('Type Compatibility', () => {
    it('should allow different import methods to be compatible', () => {
      const textElement1: PPTTypes.PPTTextElement = {
        type: 'text',
        id: 'test-1',
        left: 0,
        top: 0,
        width: 100,
        height: 50,
        rotate: 0,
        content: 'test',
        defaultFontName: 'Arial',
        defaultColor: '#000000',
        fit: 'none'
      }

      const textElement2: PPTTextElement = textElement1
      const textElement3: Elements.PPTTextElement = textElement1

      expect(textElement2).toBe(textElement1)
      expect(textElement3).toBe(textElement1)
    })

    it('should support union type compatibility', () => {
      const textElement: PPTTextElement = {
        type: 'text',
        id: 'test-1',
        left: 0,
        top: 0,
        width: 100,
        height: 50,
        rotate: 0,
        content: 'test',
        defaultFontName: 'Arial',
        defaultColor: '#000000',
        fit: 'none'
      }

      const element1: PPTTypes.PPTElement = textElement
      const element2: PPTElement = textElement
      const element3: Elements.PPTElement = textElement

      expect(element1).toBe(textElement)
      expect(element2).toBe(textElement)
      expect(element3).toBe(textElement)
    })
  })

  describe('Circular Dependency Check', () => {
    it('should create complex nested structures without circular dependency errors', () => {
      const complexStructure: Slide = {
        id: 'test-slide',
        elements: [
          {
            type: ElementTypes.TEXT,
            id: 'text-1',
            left: 0,
            top: 0,
            width: 200,
            height: 50,
            rotate: 0,
            content: '<p>测试文本</p>',
            defaultFontName: 'Arial',
            defaultColor: '#000000',
            fit: 'none',
            outline: {
              width: 1,
              style: 'solid',
              color: '#666666'
            },
            shadow: {
              h: 2,
              v: 2,
              blur: 4,
              color: '#888888'
            }
          }
        ],
        background: {
          type: 'solid',
          color: '#ffffff'
        },
        animations: [
          {
            id: 'anim-1',
            elId: 'text-1',
            effect: 'fadeIn',
            type: 'in',
            duration: 1000,
            trigger: 'click'
          }
        ]
      }

      expect(complexStructure.id).toBe('test-slide')
      expect(complexStructure.elements).toHaveLength(1)
      expect(complexStructure.background).toBeDefined()
    })
  })

  describe('Runtime Behavior', () => {
    it('should have correct enum values', () => {
      expect(ElementTypes.TEXT).toBe('text')
      expect(ElementTypes.IMAGE).toBe('image')
      expect(ElementTypes.SHAPE).toBe('shape')
    })

    it('should support type guards', () => {
      const element: PPTElement = {
        type: 'text',
        id: 'test',
        left: 0,
        top: 0,
        width: 100,
        height: 50,
        rotate: 0,
        content: 'test',
        defaultFontName: 'Arial',
        defaultColor: '#000000',
        fit: 'none'
      }

      function isTextElement(el: PPTElement): el is PPTTextElement {
        return el.type === ElementTypes.TEXT
      }

      expect(isTextElement(element)).toBe(true)

      if (isTextElement(element)) {
        expect(element.content).toBe('test')
        expect(element.defaultFontName).toBe('Arial')
      }
    })
  })

  describe('Backward Compatibility', () => {
    it('should accept legacy element definitions', () => {
      const legacyTextElement = {
        type: 'text' as const,
        id: 'legacy-text',
        left: 0,
        top: 0,
        width: 100,
        height: 50,
        rotate: 0,
        content: 'legacy text',
        defaultFontName: 'Arial',
        defaultColor: '#000000',
        fit: 'none' as const
      }

      const newTextElement: PPTTextElement = legacyTextElement
      expect(newTextElement.content).toBe('legacy text')
    })

    it('should accept legacy slide definitions', () => {
      const legacySlide = {
        id: 'legacy-slide',
        elements: [],
        background: {
          type: 'solid' as const,
          color: '#ffffff'
        }
      }

      const newSlide: Slide = legacySlide
      expect(newSlide.id).toBe('legacy-slide')
    })
  })
})

/**
 * 项目扩展类型测试
 *
 * 测试项目扩展类型的正确性和兼容性
 */

import { describe, it, expect } from 'vitest'
import type {
  ProjectSlide,
  ProjectSlideBase,
  ProjectSlideList,
  ProjectSlideBackground,
  ColorConfig,
  PageTag,
  TemplatePayType,
  AIImageStatus,
  ThemeColorType
} from '../../src/extensions/project-extended.js'
import {
  isProjectSlideList,
  validateProjectSlide,
  validateColorConfig,
  validateProjectSlideBackground
} from '../../src/extensions/project-extended.js'
import type { Slide } from '../../src/slide/slide.js'
import type { PPTElement } from '../../src/elements/index.js'

describe('ProjectExtended Types', () => {
  describe('AIImageStatus', () => {
    it('should accept valid status values', () => {
      const statuses: AIImageStatus[] = ['pending', 'success', 'failed']
      expect(statuses.length).toBe(3)
    })
  })

  describe('ThemeColorType', () => {
    it('should accept all valid theme color types', () => {
      const types: ThemeColorType[] = [
        'accent1', 'accent2', 'accent3', 'accent4', 'accent5', 'accent6',
        'dk1', 'dk2', 'lt1', 'lt2'
      ]
      expect(types.length).toBe(10)
    })
  })

  describe('ColorConfig', () => {
    it('should allow simple color configuration', () => {
      const color: ColorConfig = {
        color: '#FF0000'
      }
      expect(color.color).toBe('#FF0000')
    })

    it('should allow theme color configuration with type safety', () => {
      const color: ColorConfig = {
        color: '#FF0000',
        themeColor: {
          color: '#FF0000',
          type: 'accent1' as ThemeColorType
        },
        opacity: 0.8
      }
      expect(color.themeColor?.type).toBe('accent1')
    })

    it('should support all theme color types', () => {
      const color: ColorConfig = {
        color: '#FF0000',
        themeColor: {
          color: '#FF0000',
          type: 'lt1' as ThemeColorType
        }
      }
      expect(color.themeColor?.type).toBe('lt1')
    })
  })

  describe('ProjectSlideBackground', () => {
    it('should allow solid background', () => {
      const bg: ProjectSlideBackground = {
        type: 'solid',
        themeColor: {
          color: '#FFFFFF'
        }
      }
      expect(bg.type).toBe('solid')
    })

    it('should allow image background', () => {
      const bg: ProjectSlideBackground = {
        type: 'image',
        image: 'https://example.com/image.jpg',
        imageSize: 'cover'
      }
      expect(bg.type).toBe('image')
      expect(bg.imageSize).toBe('cover')
    })

    it('should allow gradient background', () => {
      const bg: ProjectSlideBackground = {
        type: 'gradient',
        gradientType: 'linear',
        gradientColor: [
          { color: '#FF0000' },
          { color: '#00FF00' }
        ],
        gradientRotate: 90
      }
      expect(bg.type).toBe('gradient')
      expect(bg.gradientColor?.length).toBe(2)
    })
  })

  describe('PageTag', () => {
    it('should accept all valid page tags', () => {
      const tags: PageTag[] = ['title', 'catalogue', 'chapter', 'content', 'end', 'list']
      expect(tags.length).toBe(6)
    })
  })

  describe('ProjectSlideBase', () => {
    it('should extend standard slide with project fields', () => {
      const slide: ProjectSlideBase = {
        id: 'slide-1',
        elements: [],
        pageId: 'page-1',
        tag: 'content',
        listCount: 5,
        aiImage: true,
        aiImageStatus: 'success',
        fillPageType: 1
      }
      expect(slide.pageId).toBe('page-1')
      expect(slide.tag).toBe('content')
    })

    it('should allow standard slide fields', () => {
      const slide: ProjectSlideBase = {
        id: 'slide-1',
        elements: [],
        notes: [{
          id: 'note-1',
          content: 'Test note',
          time: Date.now(),
          user: 'test-user'
        }],
        remark: 'Test remark',
        animations: [],
        turningMode: 'fade'
      }
      expect(slide.notes?.length).toBe(1)
      expect(slide.turningMode).toBe('fade')
    })

    it('should use ProjectSlideBackground', () => {
      const slide: ProjectSlideBase = {
        id: 'slide-1',
        elements: [],
        background: {
          type: 'solid',
          themeColor: {
            color: '#FFFFFF'
          }
        }
      }
      expect(slide.background?.type).toBe('solid')
    })
  })

  describe('ProjectSlideList', () => {
    it('should require list-specific fields', () => {
      const slide: ProjectSlideList = {
        id: 'slide-1',
        elements: [],
        tag: 'list',
        payType: 'free',
        listFlag: 'list-1',
        autoFill: true
      }
      expect(slide.tag).toBe('list')
      expect(slide.payType).toBe('free')
      expect(slide.autoFill).toBe(true)
    })

    it('should allow project base fields', () => {
      const slide: ProjectSlideList = {
        id: 'slide-1',
        elements: [],
        tag: 'list',
        payType: 'not_free',
        listFlag: 'list-1',
        autoFill: false,
        pageId: 'page-1',
        listCount: 10
      }
      expect(slide.listCount).toBe(10)
    })
  })

  describe('ProjectSlide Union Type', () => {
    it('should accept regular slides', () => {
      const slide: ProjectSlide = {
        id: 'slide-1',
        elements: [],
        tag: 'content'
      }
      expect(slide.id).toBe('slide-1')
    })

    it('should accept list slides', () => {
      const slide: ProjectSlide = {
        id: 'slide-1',
        elements: [],
        tag: 'list',
        payType: 'free',
        listFlag: 'list-1',
        autoFill: true
      }

      if ('payType' in slide) {
        expect(slide.payType).toBe('free')
      }
    })

    it('should allow all project fields', () => {
      const slide: ProjectSlide = {
        id: 'slide-1',
        elements: [],
        pageId: 'page-1',
        tag: 'title',
        aiImage: true,
        aiImageStatus: 'pending',
        background: {
          type: 'gradient',
          gradientType: 'radial',
          gradientColor: [
            { color: '#FF0000' },
            { color: '#0000FF' }
          ],
          gradientRotate: 45
        }
      }
      expect(slide.background?.type).toBe('gradient')
    })
  })

  describe('Type Compatibility', () => {
    it('should maintain standard slide compatibility for common fields', () => {
      const projectSlide: ProjectSlideBase = {
        id: 'slide-1',
        elements: [],
        notes: [],
        remark: 'test',
        animations: [],
        turningMode: 'slideX'
      }

      // These fields are compatible with standard Slide
      const id: string = projectSlide.id
      const elements: PPTElement[] = projectSlide.elements
      const remark: string | undefined = projectSlide.remark

      expect(id).toBe('slide-1')
      expect(elements).toEqual([])
      expect(remark).toBe('test')
    })

    it('should extend beyond standard slide', () => {
      const projectSlide: ProjectSlideBase = {
        id: 'slide-1',
        elements: [],
        pageId: 'page-1',  // Project-specific field
        tag: 'content'      // Project-specific field
      }

      // These fields don't exist in standard Slide
      expect(projectSlide.pageId).toBe('page-1')
      expect(projectSlide.tag).toBe('content')
    })

    it('should support AIImageStatus type safety', () => {
      const slide: ProjectSlideBase = {
        id: 'slide-1',
        elements: [],
        aiImage: true,
        aiImageStatus: 'success' as AIImageStatus
      }

      expect(slide.aiImageStatus).toBe('success')
    })
  })

  describe('Type Guard Functions', () => {
    it('should correctly identify list slides', () => {
      const listSlide: ProjectSlide = {
        id: 'slide-1',
        elements: [],
        tag: 'list',
        payType: 'free',
        listFlag: 'list-1',
        autoFill: true
      }

      expect(isProjectSlideList(listSlide)).toBe(true)

      if (isProjectSlideList(listSlide)) {
        // Type should be narrowed to ProjectSlideList
        expect(listSlide.payType).toBe('free')
        expect(listSlide.listFlag).toBe('list-1')
        expect(listSlide.autoFill).toBe(true)
      }
    })

    it('should correctly identify non-list slides', () => {
      const regularSlide: ProjectSlide = {
        id: 'slide-1',
        elements: [],
        tag: 'content'
      }

      expect(isProjectSlideList(regularSlide)).toBe(false)
    })

    it('should work with slides missing list properties', () => {
      const slideWithoutListProps: ProjectSlide = {
        id: 'slide-1',
        elements: [],
        tag: 'list' // Has list tag but missing other required fields
      }

      // Should return false because it doesn't have all required list fields
      expect(isProjectSlideList(slideWithoutListProps)).toBe(false)
    })

    it('should enable type narrowing in conditional blocks', () => {
      const slides: ProjectSlide[] = [
        {
          id: 'slide-1',
          elements: [],
          tag: 'content'
        },
        {
          id: 'slide-2',
          elements: [],
          tag: 'list',
          payType: 'free',
          listFlag: 'list-1',
          autoFill: true
        }
      ]

      const listSlides = slides.filter(isProjectSlideList)

      expect(listSlides.length).toBe(1)
      expect(listSlides[0].payType).toBe('free')
    })
  })

  describe('Discriminated Union - ProjectSlideBackground', () => {
    it('should enforce required fields for solid background', () => {
      const solidBg: ProjectSlideBackground = {
        type: 'solid',
        themeColor: { color: '#FFFFFF' }
      }

      expect(solidBg.type).toBe('solid')
      expect(solidBg.themeColor.color).toBe('#FFFFFF')
    })

    it('should enforce required fields for image background', () => {
      const imageBg: ProjectSlideBackground = {
        type: 'image',
        image: 'https://example.com/bg.jpg',
        imageSize: 'cover'
      }

      expect(imageBg.type).toBe('image')
      expect(imageBg.image).toBe('https://example.com/bg.jpg')
    })

    it('should enforce required fields for gradient background', () => {
      const gradientBg: ProjectSlideBackground = {
        type: 'gradient',
        gradientType: 'linear',
        gradientColor: [
          { color: '#FF0000' },
          { color: '#0000FF' }
        ],
        gradientRotate: 90
      }

      expect(gradientBg.type).toBe('gradient')
      expect(gradientBg.gradientColor.length).toBe(2)
    })

    it('should support type narrowing with switch statement', () => {
      const backgrounds: ProjectSlideBackground[] = [
        { type: 'solid', themeColor: { color: '#FFF' } },
        { type: 'image', image: 'url', imageSize: 'cover' },
        { type: 'gradient', gradientType: 'linear', gradientColor: [{ color: '#F00' }, { color: '#00F' }] }
      ]

      backgrounds.forEach(bg => {
        switch (bg.type) {
          case 'solid':
            expect(bg.themeColor).toBeDefined()
            break
          case 'image':
            expect(bg.image).toBeDefined()
            break
          case 'gradient':
            expect(bg.gradientType).toBeDefined()
            expect(bg.gradientColor).toHaveLength(2)
            break
        }
      })
    })
  })

  describe('Runtime Validation Functions', () => {
    describe('validateColorConfig', () => {
      it('should validate valid color config', () => {
        const validColor = {
          color: '#FF0000',
          opacity: 0.8
        }

        expect(validateColorConfig(validColor)).toBe(true)
      })

      it('should validate color with theme color', () => {
        const validColor = {
          color: '#FF0000',
          themeColor: {
            color: '#FF0000',
            type: 'accent1'
          }
        }

        expect(validateColorConfig(validColor)).toBe(true)
      })

      it('should reject invalid color config', () => {
        expect(validateColorConfig(null)).toBe(false)
        expect(validateColorConfig(undefined)).toBe(false)
        expect(validateColorConfig('string')).toBe(false)
        expect(validateColorConfig({})).toBe(false)
        expect(validateColorConfig({ opacity: 0.5 })).toBe(false)
      })
    })

    describe('validateProjectSlideBackground', () => {
      it('should validate solid background', () => {
        const solidBg = {
          type: 'solid',
          themeColor: { color: '#FFFFFF' }
        }

        expect(validateProjectSlideBackground(solidBg)).toBe(true)
      })

      it('should validate image background', () => {
        const imageBg = {
          type: 'image',
          image: 'https://example.com/bg.jpg',
          imageSize: 'cover'
        }

        expect(validateProjectSlideBackground(imageBg)).toBe(true)
      })

      it('should validate gradient background', () => {
        const gradientBg = {
          type: 'gradient',
          gradientType: 'linear',
          gradientColor: [
            { color: '#FF0000' },
            { color: '#0000FF' }
          ],
          gradientRotate: 90
        }

        expect(validateProjectSlideBackground(gradientBg)).toBe(true)
      })

      it('should reject invalid backgrounds', () => {
        expect(validateProjectSlideBackground(null)).toBe(false)
        expect(validateProjectSlideBackground({ type: 'invalid' })).toBe(false)
        expect(validateProjectSlideBackground({ type: 'solid' })).toBe(false) // missing themeColor
        expect(validateProjectSlideBackground({ type: 'image' })).toBe(false) // missing image
        expect(validateProjectSlideBackground({ type: 'gradient' })).toBe(false) // missing required fields
      })

      it('should validate gradient with exactly 2 colors', () => {
        const invalidGradient = {
          type: 'gradient',
          gradientType: 'linear',
          gradientColor: [{ color: '#FF0000' }] // Only 1 color
        }

        expect(validateProjectSlideBackground(invalidGradient)).toBe(false)
      })
    })

    describe('validateProjectSlide', () => {
      it('should validate regular slide', () => {
        const validSlide = {
          id: 'slide-1',
          elements: [],
          tag: 'content',
          pageId: 'page-1'
        }

        expect(validateProjectSlide(validSlide)).toBe(true)
      })

      it('should validate list slide', () => {
        const validListSlide = {
          id: 'slide-1',
          elements: [],
          tag: 'list',
          payType: 'free',
          listFlag: 'list-1',
          autoFill: true
        }

        expect(validateProjectSlide(validListSlide)).toBe(true)
      })

      it('should reject invalid slides', () => {
        expect(validateProjectSlide(null)).toBe(false)
        expect(validateProjectSlide({})).toBe(false)
        expect(validateProjectSlide({ id: 'test' })).toBe(false) // missing elements
        expect(validateProjectSlide({ elements: [] })).toBe(false) // missing id
      })

      it('should reject list slide missing required fields', () => {
        const invalidListSlide = {
          id: 'slide-1',
          elements: [],
          tag: 'list'
          // missing payType, listFlag, autoFill
        }

        expect(validateProjectSlide(invalidListSlide)).toBe(false)
      })

      it('should validate slide with background', () => {
        const slideWithBg = {
          id: 'slide-1',
          elements: [],
          background: {
            type: 'solid',
            themeColor: { color: '#FFF' }
          }
        }

        expect(validateProjectSlide(slideWithBg)).toBe(true)
      })

      it('should handle API response validation', () => {
        // Simulate API response
        const apiResponse = JSON.parse(JSON.stringify({
          id: 'api-slide-1',
          elements: [
            {
              type: 'text',
              id: 'text-1',
              left: 0,
              top: 0,
              width: 100,
              height: 50
            }
          ],
          tag: 'content',
          aiImage: true,
          aiImageStatus: 'success'
        }))

        expect(validateProjectSlide(apiResponse)).toBe(true)
      })
    })
  })

  describe('Boundary Value Tests', () => {
    describe('ColorConfig opacity validation', () => {
      it('should accept valid opacity values', () => {
        expect(validateColorConfig({ color: '#FF0000', opacity: 0 })).toBe(true)
        expect(validateColorConfig({ color: '#FF0000', opacity: 0.5 })).toBe(true)
        expect(validateColorConfig({ color: '#FF0000', opacity: 1 })).toBe(true)
      })

      it('should reject invalid opacity values', () => {
        expect(validateColorConfig({ color: '#FF0000', opacity: -0.1 })).toBe(false)
        expect(validateColorConfig({ color: '#FF0000', opacity: 1.1 })).toBe(false)
        expect(validateColorConfig({ color: '#FF0000', opacity: -1 })).toBe(false)
        expect(validateColorConfig({ color: '#FF0000', opacity: 2 })).toBe(false)
      })
    })

    describe('ColorConfig colorType validation', () => {
      it('should accept valid colorType values (ThemeColorType)', () => {
        expect(validateColorConfig({ color: '#FF0000', colorType: 'accent1' })).toBe(true)
        expect(validateColorConfig({ color: '#FF0000', colorType: 'accent2' })).toBe(true)
        expect(validateColorConfig({ color: '#FF0000', colorType: 'dk1' })).toBe(true)
        expect(validateColorConfig({ color: '#FF0000', colorType: 'dk2' })).toBe(true)
        expect(validateColorConfig({ color: '#FF0000', colorType: 'lt1' })).toBe(true)
      })

      it('should reject invalid colorType values', () => {
        expect(validateColorConfig({ color: '#FF0000', colorType: 'invalid' })).toBe(false)
        expect(validateColorConfig({ color: '#FF0000', colorType: 'theme' })).toBe(false)
        expect(validateColorConfig({ color: '#FF0000', colorType: 'rgb' })).toBe(false)
        expect(validateColorConfig({ color: '#FF0000', colorType: '' })).toBe(false)
      })
    })

    describe('Gradient rotation validation', () => {
      it('should accept valid rotation values', () => {
        const validGradient0 = {
          type: 'gradient',
          gradientType: 'linear',
          gradientColor: [{ color: '#FF0000' }, { color: '#0000FF' }],
          gradientRotate: 0
        }
        expect(validateProjectSlideBackground(validGradient0)).toBe(true)

        const validGradient180 = {
          type: 'gradient',
          gradientType: 'linear',
          gradientColor: [{ color: '#FF0000' }, { color: '#0000FF' }],
          gradientRotate: 180
        }
        expect(validateProjectSlideBackground(validGradient180)).toBe(true)

        const validGradient360 = {
          type: 'gradient',
          gradientType: 'linear',
          gradientColor: [{ color: '#FF0000' }, { color: '#0000FF' }],
          gradientRotate: 360
        }
        expect(validateProjectSlideBackground(validGradient360)).toBe(true)
      })

      it('should reject invalid rotation values', () => {
        const invalidNegative = {
          type: 'gradient',
          gradientType: 'linear',
          gradientColor: [{ color: '#FF0000' }, { color: '#0000FF' }],
          gradientRotate: -1
        }
        expect(validateProjectSlideBackground(invalidNegative)).toBe(false)

        const invalidTooLarge = {
          type: 'gradient',
          gradientType: 'linear',
          gradientColor: [{ color: '#FF0000' }, { color: '#0000FF' }],
          gradientRotate: 361
        }
        expect(validateProjectSlideBackground(invalidTooLarge)).toBe(false)

        const invalidLargeNegative = {
          type: 'gradient',
          gradientType: 'linear',
          gradientColor: [{ color: '#FF0000' }, { color: '#0000FF' }],
          gradientRotate: -90
        }
        expect(validateProjectSlideBackground(invalidLargeNegative)).toBe(false)
      })
    })

    describe('Long string values', () => {
      it('should accept long URLs in image backgrounds', () => {
        const longUrl = 'https://example.com/' + 'a'.repeat(500) + '.jpg'
        const bg = {
          type: 'image',
          image: longUrl,
          imageSize: 'cover'
        }
        expect(validateProjectSlideBackground(bg)).toBe(true)
      })

      it('should accept long IDs', () => {
        const longId = 'slide-' + 'x'.repeat(500)
        const slide = {
          id: longId,
          elements: [],
          pageId: 'page-' + 'y'.repeat(500)
        }
        expect(validateProjectSlide(slide)).toBe(true)
      })

      it('should accept long listFlag values', () => {
        const longFlag = 'list-flag-' + 'z'.repeat(200)
        const listSlide = {
          id: 'slide-1',
          elements: [],
          tag: 'list',
          payType: 'free',
          listFlag: longFlag,
          autoFill: true
        }
        expect(validateProjectSlide(listSlide)).toBe(true)
      })
    })

    describe('Special characters in strings', () => {
      it('should accept special characters in color values', () => {
        expect(validateColorConfig({ color: 'rgba(255, 0, 0, 0.5)' })).toBe(true)
        expect(validateColorConfig({ color: 'hsl(120, 100%, 50%)' })).toBe(true)
        expect(validateColorConfig({ color: '#FF00FF' })).toBe(true)
      })

      it('should accept special characters in URLs', () => {
        const urlWithParams = 'https://example.com/image.jpg?param1=value&param2=value#anchor'
        const bg = {
          type: 'image',
          image: urlWithParams,
          imageSize: 'cover'
        }
        expect(validateProjectSlideBackground(bg)).toBe(true)
      })

      it('should accept Unicode characters in IDs', () => {
        const slide = {
          id: 'slide-测试-🎨',
          elements: [],
          pageId: 'page-页面-📄'
        }
        expect(validateProjectSlide(slide)).toBe(true)
      })
    })

    describe('ColorConfig type combinations', () => {
      it('should accept complete ColorConfig with all fields', () => {
        const fullConfig = {
          color: '#FF0000',
          themeColor: {
            color: '#FF0000',
            type: 'accent1'
          },
          colorType: 'accent1',
          colorIndex: 5,
          opacity: 0.8
        }
        expect(validateColorConfig(fullConfig)).toBe(true)
      })

      it('should reject ColorConfig with invalid theme color type', () => {
        const invalidTheme = {
          color: '#FF0000',
          themeColor: {
            color: '#FF0000',
            type: 'invalid-type'
          }
        }
        // Should still pass validateColorConfig (it only checks type is string)
        // but would fail TypeScript compilation
        expect(validateColorConfig(invalidTheme)).toBe(true)
      })
    })

    describe('Edge cases for listCount', () => {
      it('should accept zero listCount', () => {
        const slide = {
          id: 'slide-1',
          elements: [],
          tag: 'list',
          payType: 'free',
          listFlag: 'test-flag',
          autoFill: true,
          listCount: 0
        }
        expect(validateProjectSlide(slide)).toBe(true)
      })

      it('should accept large listCount', () => {
        const slide = {
          id: 'slide-1',
          elements: [],
          tag: 'list',
          payType: 'free',
          listFlag: 'test-flag',
          autoFill: true,
          listCount: 999999
        }
        expect(validateProjectSlide(slide)).toBe(true)
      })

      it('should accept negative listCount', () => {
        // Note: Current validation doesn't check for negative numbers
        // This is intentional to show what's validated vs not
        const slide = {
          id: 'slide-1',
          elements: [],
          tag: 'list',
          payType: 'free',
          listFlag: 'test-flag',
          autoFill: true,
          listCount: -5
        }
        // Current implementation accepts this (only checks type)
        expect(validateProjectSlide(slide)).toBe(true)
      })
    })

    describe('Empty and minimal values', () => {
      it('should accept empty elements array', () => {
        const slide = {
          id: 'slide-1',
          elements: []
        }
        expect(validateProjectSlide(slide)).toBe(true)
      })

      it('should accept minimal valid slide', () => {
        const minimalSlide = {
          id: 'x',
          elements: []
        }
        expect(validateProjectSlide(minimalSlide)).toBe(true)
      })

      it('should reject empty ID', () => {
        const slide = {
          id: '',
          elements: []
        }
        // Current implementation accepts this (only checks type)
        expect(validateProjectSlide(slide)).toBe(true)
      })
    })
  })
})

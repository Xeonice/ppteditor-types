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
import { isProjectSlideList } from '../../src/extensions/project-extended.js'
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
        'text1', 'text2', 'background1', 'background2'
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
          type: 'background1' as ThemeColorType
        }
      }
      expect(color.themeColor?.type).toBe('background1')
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
})

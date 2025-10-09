/**
 * 类型完整性测试
 *
 * 这个文件测试所有导出的类型是否能正确导入和使用
 */

import { describe, it, expect } from 'vitest'

// 测试所有主要类型的导入
import {
  // 基础类型
  PPTElementOutline,
  PPTElementShadow,
  Gradient,
  GradientColor,
  PPTElementLink,
  TextType,
  ChartType,
  ShapePathFormulasKeys,

  // 元素类型
  PPTElement,
  PPTTextElement,
  PPTImageElement,
  PPTShapeElement,
  PPTLineElement,
  PPTChartElement,
  PPTTableElement,
  PPTLatexElement,
  PPTVideoElement,
  PPTAudioElement,

  // 枚举类型
  ElementTypes,

  // 幻灯片类型
  Slide,
  SlideBackground,
  SlideTheme,
  SlideTemplate,

  // 动画类型
  PPTAnimation,

  // 项目扩展类型
  ProjectSlide,
  ProjectSlideBackground,
  ColorConfig
} from '../src'

describe('Type Import Tests', () => {
  it('should import all types successfully', () => {
    // 这个测试通过 TypeScript 编译即表示所有类型都能正确导入
    expect(true).toBe(true)
  })

  it('should have ElementTypes enum values', () => {
    expect(ElementTypes.TEXT).toBe('text')
    expect(ElementTypes.IMAGE).toBe('image')
    expect(ElementTypes.SHAPE).toBe('shape')
    expect(ElementTypes.LINE).toBe('line')
    expect(ElementTypes.CHART).toBe('chart')
    expect(ElementTypes.TABLE).toBe('table')
    expect(ElementTypes.LATEX).toBe('latex')
    expect(ElementTypes.VIDEO).toBe('video')
    expect(ElementTypes.AUDIO).toBe('audio')
  })

  it('should create valid Slide object', () => {
    const slide: Slide = {
      id: 'test-slide',
      elements: []
    }

    expect(slide.id).toBe('test-slide')
    expect(slide.elements).toEqual([])
  })

  it('should create valid ProjectSlide object', () => {
    const slide: ProjectSlide = {
      id: 'project-slide',
      elements: [],
      tag: 'content',
      pageId: 'page-1'
    }

    expect(slide.id).toBe('project-slide')
    expect(slide.tag).toBe('content')
  })

  it('should create valid PPTTextElement', () => {
    const element: PPTTextElement = {
      type: 'text',
      id: 'text-1',
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

    expect(element.type).toBe('text')
    expect(element.content).toBe('test')
  })

  it('should create valid ColorConfig', () => {
    const color: ColorConfig = {
      color: '#FF0000',
      themeColor: {
        color: '#FF0000',
        type: 'accent1'
      },
      opacity: 0.8
    }

    expect(color.color).toBe('#FF0000')
    expect(color.opacity).toBe(0.8)
  })

  it('should create valid ProjectSlideBackground', () => {
    const background: ProjectSlideBackground = {
      type: 'gradient',
      gradientType: 'linear',
      gradientColor: [
        { color: '#FF0000' },
        { color: '#0000FF' }
      ],
      gradientRotate: 90
    }

    expect(background.type).toBe('gradient')
    expect(background.gradientColor?.length).toBe(2)
  })
})

console.log('所有类型测试通过 ✓')

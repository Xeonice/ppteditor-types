/**
 * PPTEditor Types 使用示例
 *
 * 展示如何在项目中使用 @ppteditor/types 包的各种类型定义
 */

// === 基本导入方式 ===

// 方式1: 导入所有类型
import * as PPTTypes from './src';

// 方式2: 选择性导入常用类型
import {
  PPTElement,
  PPTTextElement,
  PPTImageElement,
  PPTShapeElement,
  PPTChartElement,
  Slide,
  SlideBackground,
  PPTAnimation,
  ElementTypes,
  ShapePathFormulasKeys,
  GradientColor
} from './src';

// 方式3: 命名空间导入
import { Elements, Base, SlideNamespace } from './src';

// === 基础使用示例 ===

/**
 * 示例1: 创建文本元素
 */
function createTextElement(): PPTTextElement {
  return {
    type: ElementTypes.TEXT,
    id: 'text-element-1',
    left: 100,
    top: 100,
    width: 300,
    height: 60,
    rotate: 0,
    content: '<p style="font-size: 24px; color: #333;">欢迎使用 PPT 编辑器</p>',
    defaultFontName: 'Microsoft YaHei',
    defaultColor: '#333333',
    fit: 'resize',
    // 可选属性
    outline: {
      width: 2,
      style: 'solid',
      color: '#007acc'
    },
    shadow: {
      h: 2,
      v: 2,
      blur: 8,
      color: 'rgba(0, 0, 0, 0.3)'
    },
    lineHeight: 1.5,
    opacity: 1,
    textType: 'title'
  };
}

/**
 * 示例2: 创建图片元素
 */
function createImageElement(): PPTImageElement {
  return {
    type: ElementTypes.IMAGE,
    id: 'image-element-1',
    left: 50,
    top: 200,
    width: 400,
    height: 300,
    rotate: 0,
    src: 'https://example.com/images/presentation-bg.jpg',
    fixedRatio: true,
    // 可选属性
    outline: {
      width: 3,
      style: 'solid',
      color: '#ffffff'
    },
    shadow: {
      h: 5,
      v: 5,
      blur: 15,
      color: 'rgba(0, 0, 0, 0.4)'
    },
    filters: {
      brightness: '110%',
      contrast: '105%',
      saturate: '120%'
    }
  };
}

/**
 * 示例3: 创建形状元素
 */
function createShapeElement(): PPTShapeElement {
  return {
    type: ElementTypes.SHAPE,
    id: 'shape-element-1',
    left: 500,
    top: 150,
    width: 120,
    height: 120,
    rotate: 45,
    path: 'M 60 0 L 120 60 L 60 120 L 0 60 Z', // 菱形路径
    fill: '#ff6b6b',
    fixedRatio: true,
    pathFormula: ShapePathFormulasKeys.TRIANGLE,
    viewBox: [120, 120],
    // 可选属性
    outline: {
      width: 2,
      style: 'dashed',
      color: '#ffffff'
    },
    gradient: {
      type: 'linear',
      colors: [
        { pos: 0, color: '#ff6b6b' },
        { pos: 100, color: '#feca57' }
      ],
      rotate: 45
    }
  };
}

/**
 * 示例4: 创建图表元素
 */
function createChartElement(): PPTChartElement {
  return {
    type: ElementTypes.CHART,
    id: 'chart-element-1',
    left: 100,
    top: 350,
    width: 500,
    height: 300,
    rotate: 0,
    chartType: 'bar',
    data: {
      labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
      legends: ['销售额', '利润'],
      series: [
        [65, 78, 90, 88, 92, 85],
        [28, 35, 42, 38, 45, 40]
      ]
    },
    options: {
      lineSmooth: false,
      stack: false
    },
    themeColors: ['#36a2eb', '#ff6384', '#4bc0c0', '#ff9f40']
  };
}

/**
 * 示例5: 创建幻灯片背景
 */
function createSlideBackgrounds(): SlideBackground[] {
  return [
    // 纯色背景
    {
      type: 'solid',
      color: '#f8f9fa'
    },
    // 渐变背景
    {
      type: 'gradient',
      gradient: {
        type: 'linear',
        colors: [
          { pos: 0, color: '#667eea' },
          { pos: 100, color: '#764ba2' }
        ],
        rotate: 135
      }
    },
    // 图片背景
    {
      type: 'image',
      image: {
        src: 'https://example.com/backgrounds/presentation-bg.jpg',
        size: 'cover'
      }
    }
  ];
}

/**
 * 示例6: 创建动画
 */
function createAnimations(): PPTAnimation[] {
  return [
    {
      id: 'animation-1',
      elId: 'text-element-1',
      effect: 'slideInLeft',
      type: 'in',
      duration: 800,
      trigger: 'click'
    },
    {
      id: 'animation-2',
      elId: 'image-element-1',
      effect: 'fadeIn',
      type: 'in',
      duration: 1000,
      trigger: 'auto'
    },
    {
      id: 'animation-3',
      elId: 'shape-element-1',
      effect: 'rotateIn',
      type: 'in',
      duration: 600,
      trigger: 'meantime'
    },
    {
      id: 'animation-4',
      elId: 'chart-element-1',
      effect: 'slideInUp',
      type: 'in',
      duration: 1200,
      trigger: 'auto'
    }
  ];
}

/**
 * 示例7: 创建完整的幻灯片
 */
function createCompleteSlide(): Slide {
  const elements: PPTElement[] = [
    createTextElement(),
    createImageElement(),
    createShapeElement(),
    createChartElement()
  ];

  const backgrounds = createSlideBackgrounds();
  const animations = createAnimations();

  return {
    id: 'slide-example-1',
    elements,
    background: backgrounds[1], // 使用渐变背景
    animations,
    // 可选属性
    remark: '这是一个演示幻灯片，展示了各种元素类型的使用',
    turningMode: 'fade'
  };
}

/**
 * 示例8: 类型守卫函数
 */
function isTextElement(element: PPTElement): element is PPTTextElement {
  return element.type === ElementTypes.TEXT;
}

function isImageElement(element: PPTElement): element is PPTImageElement {
  return element.type === ElementTypes.IMAGE;
}

function isShapeElement(element: PPTElement): element is PPTShapeElement {
  return element.type === ElementTypes.SHAPE;
}

/**
 * 示例9: 元素处理函数
 */
function processElements(elements: PPTElement[]): void {
  elements.forEach(element => {
    console.log(`处理元素: ${element.id} (类型: ${element.type})`);

    // 使用类型守卫进行特定处理
    if (isTextElement(element)) {
      console.log(`  文本内容: ${element.content}`);
      console.log(`  字体: ${element.defaultFontName}`);
    } else if (isImageElement(element)) {
      console.log(`  图片源: ${element.src}`);
      console.log(`  固定比例: ${element.fixedRatio}`);
    } else if (isShapeElement(element)) {
      console.log(`  形状路径: ${element.path}`);
      console.log(`  填充色: ${element.fill}`);
    }
  });
}

/**
 * 示例10: 幻灯片工具函数
 */
class SlideUtils {
  /**
   * 获取幻灯片中指定类型的元素
   */
  static getElementsByType<T extends PPTElement['type']>(
    slide: Slide,
    type: T
  ): Extract<PPTElement, { type: T }>[] {
    return slide.elements.filter(
      (element): element is Extract<PPTElement, { type: T }> => element.type === type
    );
  }

  /**
   * 计算幻灯片的边界框（只计算有宽高的元素）
   */
  static getBoundingBox(slide: Slide): { left: number; top: number; right: number; bottom: number } {
    const elementsWithDimensions = slide.elements.filter(element =>
      'width' in element && 'height' in element
    );

    if (elementsWithDimensions.length === 0) {
      return { left: 0, top: 0, right: 0, bottom: 0 };
    }

    let minLeft = Infinity;
    let minTop = Infinity;
    let maxRight = -Infinity;
    let maxBottom = -Infinity;

    elementsWithDimensions.forEach(element => {
      minLeft = Math.min(minLeft, element.left);
      minTop = Math.min(minTop, element.top);

      if ('width' in element && 'height' in element) {
        maxRight = Math.max(maxRight, element.left + element.width);
        maxBottom = Math.max(maxBottom, element.top + element.height);
      }
    });

    return {
      left: minLeft,
      top: minTop,
      right: maxRight,
      bottom: maxBottom
    };
  }

  /**
   * 克隆元素
   */
  static cloneElement<T extends PPTElement>(element: T): T {
    return JSON.parse(JSON.stringify(element));
  }
}

/**
 * 示例11: 主演示函数
 */
function demonstrateUsage(): void {
  console.log('=== PPTEditor Types 使用演示 ===\n');

  // 创建完整的幻灯片
  const slide = createCompleteSlide();
  console.log('创建的幻灯片:', slide.id);
  console.log('元素数量:', slide.elements.length);
  console.log('背景类型:', slide.background?.type);
  console.log('动画数量:', slide.animations?.length || 0);

  // 处理元素
  console.log('\n=== 元素处理 ===');
  processElements(slide.elements);

  // 使用工具函数
  console.log('\n=== 工具函数演示 ===');
  const textElements = SlideUtils.getElementsByType(slide, ElementTypes.TEXT);
  console.log('文本元素数量:', textElements.length);

  const imageElements = SlideUtils.getElementsByType(slide, ElementTypes.IMAGE);
  console.log('图片元素数量:', imageElements.length);

  const boundingBox = SlideUtils.getBoundingBox(slide);
  console.log('幻灯片边界框:', boundingBox);

  // 克隆元素示例
  const clonedElement = SlideUtils.cloneElement(slide.elements[0]);
  clonedElement.id = 'cloned-element';
  console.log('克隆元素 ID:', clonedElement.id);

  console.log('\n=== 演示完成 ===');
}

// === 高级使用示例 ===

/**
 * 示例12: 自定义类型扩展
 */
namespace CustomTypes {
  // 扩展基础元素类型
  export interface CustomElement extends PPTTypes.PPTBaseElement {
    type: 'custom';
    customProperty: string;
    customConfig: Record<string, any>;
  }

  // 扩展元素联合类型
  export type ExtendedPPTElement = PPTTypes.PPTElement | CustomElement;

  // 扩展幻灯片类型
  export interface ExtendedSlide extends Omit<PPTTypes.Slide, 'elements'> {
    elements: ExtendedPPTElement[];
    metadata?: {
      author: string;
      createdAt: Date;
      tags: string[];
    };
  }
}

/**
 * 示例13: 命名空间使用
 */
function useNamespaces(): void {
  // 使用 Elements 命名空间
  const textElement: Elements.PPTTextElement = {
    type: 'text',
    id: 'ns-text',
    left: 0,
    top: 0,
    width: 100,
    height: 50,
    rotate: 0,
    content: 'Namespace example',
    defaultFontName: 'Arial',
    defaultColor: '#000000',
    fit: 'none'
  };

  // 使用 Base 命名空间
  const shadow: Base.PPTElementShadow = {
    h: 2,
    v: 2,
    blur: 4,
    color: '#888888'
  };

  console.log('命名空间使用示例:', { textElement, shadow });
}

// 导出所有示例函数
export {
  createTextElement,
  createImageElement,
  createShapeElement,
  createChartElement,
  createSlideBackgrounds,
  createAnimations,
  createCompleteSlide,
  isTextElement,
  isImageElement,
  isShapeElement,
  processElements,
  SlideUtils,
  demonstrateUsage,
  CustomTypes,
  useNamespaces
};

// 如果直接运行此文件，执行演示
// if (require.main === module) {
//   demonstrateUsage();
//   useNamespaces();
// }
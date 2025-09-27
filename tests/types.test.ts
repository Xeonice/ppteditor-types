/**
 * 类型完整性测试
 *
 * 这个文件测试所有导出的类型是否能正确导入和使用
 */

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
  PPTChartElement,
  PPTShapeElement,
  PPTLineElement,
  PPTTableElement,
  PPTLatexElement,
  PPTVideoElement,
  PPTAudioElement,
  PPTBaseElement,

  // 枚举类型
  ElementTypes,

  // 动画类型
  PPTAnimation,
  AnimationType,
  AnimationTrigger,
} from '../src';

// 单独导入幻灯片类型以避免命名空间冲突
import type {
  Slide,
  SlideBackground,
  SlideTemplate,
  SlideTheme,
} from '../src';

// 类型完整性测试：验证基础元素类型
const testTextElement: PPTTextElement = {
  type: 'text',
  id: 'test-text-1',
  left: 100,
  top: 100,
  width: 200,
  height: 50,
  rotate: 0,
  content: '<p>测试文本</p>',
  defaultFontName: 'Microsoft YaHei',
  defaultColor: '#000000',
  fit: 'none'
};

// 类型完整性测试：验证形状元素类型
const testShapeElement: PPTShapeElement = {
  type: 'shape',
  id: 'test-shape-1',
  left: 50,
  top: 50,
  width: 100,
  height: 100,
  rotate: 0,
  path: 'M 0 0 L 100 0 L 100 100 L 0 100 Z',
  fill: '#ff0000',
  fixedRatio: false,
  pathFormula: ShapePathFormulasKeys.ROUND_RECT,
  viewBox: [100, 100]
};

// 类型完整性测试：验证图片元素类型
const testImageElement: PPTImageElement = {
  type: 'image',
  id: 'test-image-1',
  left: 0,
  top: 0,
  width: 300,
  height: 200,
  rotate: 0,
  src: 'https://example.com/image.jpg',
  fixedRatio: true
};

// 类型完整性测试：验证图表元素类型
const testChartElement: PPTChartElement = {
  type: 'chart',
  id: 'test-chart-1',
  left: 100,
  top: 200,
  width: 400,
  height: 300,
  rotate: 0,
  chartType: 'bar',
  data: {
    labels: ['A', 'B', 'C'],
    legends: ['Dataset 1'],
    series: [[1, 2, 3]]
  },
  themeColors: ['#ff6384', '#36a2eb', '#ffce56']
};

// 类型完整性测试：验证PPTElement联合类型
const testElements: PPTElement[] = [
  testTextElement,
  testShapeElement,
  testImageElement,
  testChartElement
];

// 类型完整性测试：验证幻灯片类型
const testSlide: Slide = {
  id: 'test-slide-1',
  elements: testElements,
  background: {
    type: 'solid',
    color: '#ffffff'
  }
};

// 类型完整性测试：验证幻灯片背景类型
const testSolidBackground: SlideBackground = {
  type: 'solid',
  color: '#f0f0f0'
};

const testImageBackground: SlideBackground = {
  type: 'image',
  image: {
    src: 'https://example.com/bg.jpg',
    size: 'cover'
  }
};

const testGradientBackground: SlideBackground = {
  type: 'gradient',
  gradient: {
    type: 'linear',
    colors: [
      { pos: 0, color: '#ff6b6b' },
      { pos: 100, color: '#4ecdc4' }
    ],
    rotate: 45
  }
};

// 类型完整性测试：验证动画类型
const testAnimation: PPTAnimation = {
  id: 'test-animation-1',
  elId: 'test-text-1',
  effect: 'fadeIn',
  type: 'in',
  duration: 1000,
  trigger: 'click'
};

// 类型兼容性测试：验证枚举使用
const elementType: ElementTypes = ElementTypes.TEXT;
const isTextElement = (element: PPTElement): element is PPTTextElement => {
  return element.type === ElementTypes.TEXT;
};

// 类型兼容性测试：验证可选属性
const textElementWithOptionals: PPTTextElement = {
  ...testTextElement,
  outline: {
    width: 2,
    style: 'solid',
    color: '#000000'
  },
  shadow: {
    h: 2,
    v: 2,
    blur: 4,
    color: '#888888'
  },
  opacity: 0.8,
  lineHeight: 1.5,
  wordSpace: 1,
  paragraphSpace: 10,
  vertical: false,
  textType: 'title'
};

// 类型兼容性测试：验证复杂嵌套类型
const complexSlide: Slide = {
  id: 'complex-slide',
  elements: [
    {
      type: 'text',
      id: 'title',
      left: 50,
      top: 50,
      width: 500,
      height: 100,
      rotate: 0,
      content: '<h1>标题</h1>',
      defaultFontName: 'Arial',
      defaultColor: '#333333',
      fit: 'resize',
      textType: 'title'
    },
    {
      type: 'chart',
      id: 'chart-1',
      left: 100,
      top: 200,
      width: 400,
      height: 300,
      rotate: 0,
      chartType: 'bar',
      data: {
        labels: ['A', 'B', 'C'],
        legends: ['Dataset 1'],
        series: [[1, 2, 3]]
      },
      themeColors: ['#ff6384', '#36a2eb', '#ffce56']
    }
  ],
  background: testGradientBackground,
  animations: [testAnimation]
};

// 示例使用函数：展示如何处理不同类型的元素
function processElement(element: PPTElement): string {
  switch (element.type) {
    case ElementTypes.TEXT:
      return `文本元素：${element.content}`;
    case ElementTypes.IMAGE:
      return `图片元素：${element.src}`;
    case ElementTypes.SHAPE:
      return `形状元素：路径长度 ${element.path.length}`;
    case ElementTypes.CHART:
      return `图表元素：${element.chartType}`;
    case ElementTypes.TABLE:
      return `表格元素：${element.data.length} 行`;
    case ElementTypes.LATEX:
      return `LaTeX 元素：${element.latex}`;
    case ElementTypes.VIDEO:
      return `视频元素：${element.src}`;
    case ElementTypes.AUDIO:
      return `音频元素：${element.src}`;
    default:
      return '未知元素类型';
  }
}

// 示例使用函数：展示类型守卫的使用
function isComplexElement(element: PPTElement): boolean {
  if (isTextElement(element)) {
    return element.content.length > 100;
  }

  if (element.type === ElementTypes.CHART) {
    return element.data.series.length > 3;
  }

  return false;
}

// 导出测试数据供其他测试文件使用
export {
  testTextElement,
  testShapeElement,
  testImageElement,
  testChartElement,
  testSlide,
  testAnimation,
  complexSlide,
  processElement,
  isComplexElement
};

// TypeScript 编译时类型检查
// 如果类型定义有问题，以下代码将无法通过编译

type _TestElementUnion = PPTElement extends (infer U)[] ? never : PPTElement;
type _TestTextElementRequired = Required<Pick<PPTTextElement, 'type' | 'content' | 'defaultFontName' | 'defaultColor' | 'fit'>>;

console.log('所有类型测试通过 ✓');
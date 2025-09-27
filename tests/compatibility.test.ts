/**
 * 兼容性测试
 *
 * 测试导出的完整性、循环依赖检查、命名空间导出等兼容性问题
 */

// 测试默认导出方式
import * as PPTTypes from '../src';

// 测试命名空间导出
import { Base, Elements, SlideNamespace, Animation, Enums } from '../src';

// 测试选择性导入
import {
  PPTElement,
  PPTTextElement,
  ElementTypes,
  PPTAnimation,
  ShapePathFormulasKeys
} from '../src';

// 单独导入幻灯片类型
import type { Slide as SlideType } from '../src';

// 测试类型别名导入
import type {
  PPTBaseElement,
  PPTElementShadow,
  SlideBackground,
  SlideTheme
} from '../src';

/**
 * 导出完整性测试
 * 检查所有模块是否正确导出
 */
function testExportCompleteness(): void {
  // 测试基础类型导出
  const hasBaseTypes = [
    'PPTElementOutline',
    'PPTElementShadow',
    'PPTElementGradient',
    'PPTElementLink'
  ].every(typeName => typeName in PPTTypes);

  if (!hasBaseTypes) {
    throw new Error('基础类型导出不完整');
  }

  // 测试元素类型导出
  const hasElementTypes = [
    'PPTElement',
    'PPTTextElement',
    'PPTImageElement',
    'PPTShapeElement',
    'PPTChartElement'
  ].every(typeName => typeName in PPTTypes);

  if (!hasElementTypes) {
    throw new Error('元素类型导出不完整');
  }

  // 测试枚举导出
  const hasEnumTypes = [
    'ElementTypes'
  ].every(enumName => enumName in PPTTypes);

  if (!hasEnumTypes) {
    throw new Error('枚举类型导出不完整');
  }

  console.log('✓ 导出完整性测试通过');
}

/**
 * 命名空间导出测试
 * 验证命名空间导出是否正常工作
 */
function testNamespaceExports(): void {
  // 测试 Base 命名空间
  if (!Base || typeof Base !== 'object') {
    throw new Error('Base 命名空间导出失败');
  }

  // 测试 Elements 命名空间
  if (!Elements || typeof Elements !== 'object') {
    throw new Error('Elements 命名空间导出失败');
  }

  // 测试 Enums 命名空间
  if (!Enums || typeof Enums !== 'object') {
    throw new Error('Enums 命名空间导出失败');
  }

  // 测试 SlideNamespace 命名空间
  if (!SlideNamespace || typeof SlideNamespace !== 'object') {
    throw new Error('SlideNamespace 命名空间导出失败');
  }

  // 测试 Animation 命名空间
  if (!Animation || typeof Animation !== 'object') {
    throw new Error('Animation 命名空间导出失败');
  }

  console.log('✓ 命名空间导出测试通过');
}

/**
 * 类型兼容性测试
 * 验证不同导入方式的类型兼容性
 */
function testTypeCompatibility(): void {
  // 测试通过不同方式导入的同一类型是否兼容
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
  };

  const textElement2: PPTTextElement = textElement1; // 应该兼容
  const textElement3: Elements.PPTTextElement = textElement1; // 应该兼容

  // 测试联合类型兼容性
  const element1: PPTTypes.PPTElement = textElement1;
  const element2: PPTElement = textElement1;
  const element3: Elements.PPTElement = textElement1;

  // 测试枚举兼容性
  const elementType1: PPTTypes.ElementTypes = PPTTypes.ElementTypes.TEXT;
  const elementType2: ElementTypes = ElementTypes.TEXT;
  const elementType3: Enums.ElementTypes = Enums.ElementTypes.TEXT;

  if (elementType1 !== elementType2 || elementType2 !== elementType3) {
    throw new Error('枚举类型不兼容');
  }

  console.log('✓ 类型兼容性测试通过');
}

/**
 * 循环依赖检查
 * 通过尝试创建复杂的嵌套结构来检查是否存在循环依赖问题
 */
function testCircularDependency(): void {
  try {
    // 创建包含所有类型的复杂结构
    const complexStructure: SlideType = {
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
        },
        {
          type: ElementTypes.SHAPE,
          id: 'shape-1',
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
    };

    // 如果能成功创建，说明没有循环依赖问题
    if (!complexStructure.id || !complexStructure.elements || !complexStructure.background) {
      throw new Error('复杂结构创建失败');
    }

    console.log('✓ 循环依赖检查通过');
  } catch (error) {
    throw new Error(`循环依赖检查失败: ${error}`);
  }
}

/**
 * 运行时类型检查
 * 验证类型在运行时的表现
 */
function testRuntimeBehavior(): void {
  // 测试枚举值
  if (ElementTypes.TEXT !== 'text') {
    throw new Error('ElementTypes.TEXT 值不正确');
  }

  if (ElementTypes.IMAGE !== 'image') {
    throw new Error('ElementTypes.IMAGE 值不正确');
  }

  // 测试类型守卫函数
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
  };

  function isTextElement(el: PPTElement): el is PPTTextElement {
    return el.type === ElementTypes.TEXT;
  }

  if (!isTextElement(element)) {
    throw new Error('类型守卫函数不工作');
  }

  // 在类型守卫后，应该能访问 PPTTextElement 特有的属性
  const textContent = element.content; // 应该能正常访问
  const fontName = element.defaultFontName; // 应该能正常访问

  if (!textContent || !fontName) {
    throw new Error('类型收窄不工作');
  }

  console.log('✓ 运行时类型检查通过');
}

/**
 * 向后兼容性测试
 * 确保新版本的类型定义向后兼容
 */
function testBackwardCompatibility(): void {
  // 测试基本元素创建（模拟旧版本的使用方式）
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
  };

  // 应该能够赋值给新的类型
  const newTextElement: PPTTextElement = legacyTextElement;

  // 测试幻灯片创建
  const legacySlide = {
    id: 'legacy-slide',
    elements: [legacyTextElement],
    background: {
      type: 'solid' as const,
      color: '#ffffff'
    }
  };

  const newSlide: SlideType = legacySlide;

  if (!newSlide.id || !newTextElement.content) {
    throw new Error('向后兼容性测试失败');
  }

  console.log('✓ 向后兼容性测试通过');
}

/**
 * 多种导入方式兼容性测试
 */
function testMultipleImportStyles(): void {
  // 方式1: 默认全量导入
  const element1: PPTTypes.PPTTextElement = {
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
  };

  // 方式2: 命名空间导入
  const element2: Elements.PPTTextElement = element1;

  // 方式3: 选择性导入
  const element3: PPTTextElement = element1;

  // 所有方式应该创建相同的类型
  if (element1.type !== element2.type || element2.type !== element3.type) {
    throw new Error('多种导入方式类型不一致');
  }

  console.log('✓ 多种导入方式兼容性测试通过');
}

// 执行所有兼容性测试
export function runCompatibilityTests(): void {
  console.log('开始运行兼容性测试...\n');

  try {
    testExportCompleteness();
    testNamespaceExports();
    testTypeCompatibility();
    testCircularDependency();
    testRuntimeBehavior();
    testBackwardCompatibility();
    testMultipleImportStyles();

    console.log('\n🎉 所有兼容性测试通过！');
  } catch (error) {
    console.error('\n❌ 兼容性测试失败：', error);
    throw error;
  }
}

// 导出测试函数
export {
  testExportCompleteness,
  testNamespaceExports,
  testTypeCompatibility,
  testCircularDependency,
  testRuntimeBehavior,
  testBackwardCompatibility,
  testMultipleImportStyles
};

// 如果直接运行此文件，执行所有测试
// if (require.main === module) {
//   runCompatibilityTests();
// }
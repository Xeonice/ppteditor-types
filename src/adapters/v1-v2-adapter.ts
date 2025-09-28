/**
 * V1/V2版本转换适配器
 * 提供V1项目类型与V2标准类型之间的双向转换
 */

import type {
  V1ColorConfig,
  V1ShapeGradient,
  V1CompatiblePPTElement,
  V1CompatibleTextElement,
  V1CompatibleShapeElement,
  V1CompatibleImageElement,
  V1CompatibleLineElement
} from '../types/v1-compat-types.js';

import type {
  PPTElement,
  PPTTextElement,
  PPTShapeElement,
  PPTImageElement,
  PPTLineElement,
  Gradient,
  GradientColor
} from '../types/v2-standard-types.js';

/**
 * V1 → V2 转换器
 */
export class V1ToV2Adapter {
  /**
   * 颜色转换：V1ColorConfig → V2 string
   */
  static convertColor(v1Color: V1ColorConfig): string {
    return v1Color.color || v1Color.themeColor;
  }

  /**
   * 渐变转换：V1ShapeGradient → V2 Gradient
   */
  static convertGradient(v1Gradient: V1ShapeGradient): Gradient {
    const colors: GradientColor[] = v1Gradient.themeColor.map((colorConfig, index) => ({
      pos: index * 100,
      color: this.convertColor(colorConfig)
    }));

    return {
      type: v1Gradient.type as 'linear' | 'radial',
      colors,
      rotate: v1Gradient.rotate
    };
  }

  /**
   * 文本元素转换
   */
  static convertTextElement(v1Element: V1CompatibleTextElement): PPTTextElement {
    const { tag, index, from, isDefault, enableShrink, themeFill, defaultColor, ...baseProps } = v1Element;

    return {
      ...baseProps,
      defaultColor: this.convertColor(defaultColor),
      fill: themeFill ? this.convertColor(themeFill) : undefined,
      // V2新增属性使用默认值
      textType: 'content'
    } as PPTTextElement;
  }

  /**
   * 形状元素转换
   */
  static convertShapeElement(v1Element: V1CompatibleShapeElement): PPTShapeElement {
    const { tag, index, from, isDefault, keypoint, themeFill, gradient, ...baseProps } = v1Element;

    return {
      ...baseProps,
      path: typeof v1Element.path === 'string' ? v1Element.path : JSON.stringify(v1Element.path),
      fill: this.convertColor(themeFill),
      gradient: gradient ? this.convertGradient(gradient) : undefined
    } as PPTShapeElement;
  }

  /**
   * 图片元素转换
   */
  static convertImageElement(v1Element: V1CompatibleImageElement): PPTImageElement {
    const { tag, index, from, isDefault, size, loading, ...baseProps } = v1Element;

    return {
      ...baseProps,
      fixedRatio: false   // V2必需属性
    } as PPTImageElement;
  }

  /**
   * 线条元素转换
   */
  static convertLineElement(v1Element: V1CompatibleLineElement): PPTLineElement {
    const { tag, index, from, isDefault, themeColor, lineWidth, ...baseProps } = v1Element;

    return {
      ...baseProps,
      color: this.convertColor(themeColor),
      start: v1Element.start,
      end: v1Element.end,
      width: lineWidth || 1
    } as unknown as PPTLineElement;
  }

  /**
   * 通用元素转换
   */
  static convertElement(v1Element: V1CompatiblePPTElement): PPTElement | null {
    switch (v1Element.type) {
      case 'text':
        return this.convertTextElement(v1Element);
      case 'shape':
        return this.convertShapeElement(v1Element);
      case 'image':
        return this.convertImageElement(v1Element);
      case 'line':
        return this.convertLineElement(v1Element);
      case 'none':
        // V1特有元素类型，V2不支持，返回null或转换为其他类型
        return null;
      default:
        return null;
    }
  }

  /**
   * 批量转换元素数组
   */
  static convertElements(v1Elements: V1CompatiblePPTElement[]): PPTElement[] {
    return v1Elements
      .map(element => this.convertElement(element))
      .filter((element): element is PPTElement => element !== null);
  }
}

/**
 * V2 → V1 转换器
 */
export class V2ToV1Adapter {
  /**
   * 颜色转换：V2 string → V1ColorConfig
   */
  static convertColor(v2Color: string): V1ColorConfig {
    return {
      color: v2Color,
      themeColor: v2Color
    };
  }

  /**
   * 渐变转换：V2 Gradient → V1ShapeGradient
   */
  static convertGradient(v2Gradient: Gradient): V1ShapeGradient {
    // 取前两个颜色，如果不足则重复最后一个
    const colors = v2Gradient.colors.slice(0, 2);
    if (colors.length < 2 && colors.length > 0) {
      colors.push(colors[colors.length - 1]);
    }

    const themeColors: [V1ColorConfig, V1ColorConfig] = [
      this.convertColor(colors[0]?.color || '#000000'),
      this.convertColor(colors[1]?.color || '#FFFFFF')
    ];

    return {
      type: v2Gradient.type as 'linear' | 'radial',
      themeColor: themeColors,
      rotate: v2Gradient.rotate
    };
  }

  /**
   * 文本元素转换
   */
  static convertTextElement(v2Element: PPTTextElement): V1CompatibleTextElement {
    return {
      ...v2Element,
      defaultColor: this.convertColor(v2Element.defaultColor),
      themeFill: v2Element.fill ? this.convertColor(v2Element.fill) : undefined,
      // 添加V1默认属性
      tag: undefined,
      index: undefined,
      from: undefined,
      isDefault: undefined,
      enableShrink: false
    };
  }

  /**
   * 形状元素转换
   */
  static convertShapeElement(v2Element: PPTShapeElement): V1CompatibleShapeElement {
    return {
      ...v2Element,
      themeFill: this.convertColor(v2Element.fill),
      gradient: v2Element.gradient ? this.convertGradient(v2Element.gradient) : undefined,
      // 添加V1默认属性
      tag: undefined,
      index: undefined,
      from: undefined,
      isDefault: undefined,
      keypoint: undefined
    };
  }

  /**
   * 图片元素转换
   */
  static convertImageElement(v2Element: PPTImageElement): V1CompatibleImageElement {
    return {
      ...v2Element,
      // 添加V1默认属性
      tag: undefined,
      index: undefined,
      from: undefined,
      isDefault: undefined,
      size: undefined,
      loading: false
    };
  }

  /**
   * 线条元素转换
   */
  static convertLineElement(v2Element: PPTLineElement): V1CompatibleLineElement {
    return {
      ...v2Element,
      height: (v2Element as any).height || 2, // 线条默认高度
      rotate: (v2Element as any).rotate || 0,  // 线条默认旋转
      start: (v2Element as any).start || [0, 0],
      end: (v2Element as any).end || [100, 100],
      themeColor: this.convertColor(v2Element.color),
      lineWidth: v2Element.width,
      // 添加V1默认属性
      tag: undefined,
      index: undefined,
      from: undefined,
      isDefault: undefined
    } as V1CompatibleLineElement;
  }

  /**
   * 通用元素转换
   */
  static convertElement(v2Element: PPTElement): V1CompatiblePPTElement {
    switch (v2Element.type) {
      case 'text':
        return this.convertTextElement(v2Element);
      case 'shape':
        return this.convertShapeElement(v2Element);
      case 'image':
        return this.convertImageElement(v2Element);
      case 'line':
        return this.convertLineElement(v2Element);
      default:
        // 对于不支持的类型，跳过或抛出错误
        throw new Error(`Unsupported element type for V1 conversion: ${(v2Element as any).type}`);
    }
  }

  /**
   * 批量转换元素数组
   */
  static convertElements(v2Elements: PPTElement[]): V1CompatiblePPTElement[] {
    return v2Elements.map(element => this.convertElement(element));
  }
}

/**
 * 版本检测器
 */
export class VersionDetector {
  /**
   * 检测是否为V1元素
   */
  static isV1Element(element: any): element is V1CompatiblePPTElement {
    if (!element || typeof element !== 'object') return false;

    // 检查V1特有属性
    const hasV1Props = 'tag' in element ||
                       'index' in element ||
                       'from' in element ||
                       'isDefault' in element;

    // 检查V1特有颜色格式
    const hasV1ColorFormat = element.defaultColor &&
                             typeof element.defaultColor === 'object' &&
                             'color' in element.defaultColor &&
                             'themeColor' in element.defaultColor;

    // 检查V1特有渐变格式
    const hasV1GradientFormat = element.gradient &&
                               typeof element.gradient === 'object' &&
                               'themeColor' in element.gradient &&
                               Array.isArray(element.gradient.themeColor);

    return hasV1Props || hasV1ColorFormat || hasV1GradientFormat;
  }

  /**
   * 检测是否为V2元素
   */
  static isV2Element(element: any): element is PPTElement {
    return !this.isV1Element(element);
  }

  /**
   * 检测元素数组的版本
   */
  static detectElementsVersion(elements: any[]): 'v1' | 'v2' | 'mixed' {
    if (elements.length === 0) return 'v2'; // 默认V2

    const v1Count = elements.filter(el => this.isV1Element(el)).length;
    const v2Count = elements.length - v1Count;

    if (v1Count === 0) return 'v2';
    if (v2Count === 0) return 'v1';
    return 'mixed';
  }
}

/**
 * 自动适配器 - 智能检测版本并转换
 */
export class AutoAdapter {
  /**
   * 自动转换到V2格式
   */
  static toV2(element: any): PPTElement | null {
    if (VersionDetector.isV1Element(element)) {
      return V1ToV2Adapter.convertElement(element);
    }
    return element as PPTElement;
  }

  /**
   * 自动转换到V1格式
   */
  static toV1(element: any): V1CompatiblePPTElement {
    if (VersionDetector.isV2Element(element)) {
      return V2ToV1Adapter.convertElement(element);
    }
    return element as V1CompatiblePPTElement;
  }

  /**
   * 批量自动转换到V2
   */
  static elementsToV2(elements: any[]): PPTElement[] {
    return elements
      .map(el => this.toV2(el))
      .filter((el): el is PPTElement => el !== null);
  }

  /**
   * 批量自动转换到V1
   */
  static elementsToV1(elements: any[]): V1CompatiblePPTElement[] {
    return elements.map(el => this.toV1(el));
  }
}
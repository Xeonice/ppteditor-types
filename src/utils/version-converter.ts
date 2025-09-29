/**
 * 智能版本转换器
 * 提供高级的版本转换功能和策略
 */

import type { V1CompatiblePPTElement, V1ShapeGradient } from '../types/v1-compat-types.js';
import type { PPTElement, Gradient } from '../types/v2-standard-types.js';
import { UnifiedPPTElementCollection, VersionConversionUtils } from '../types/unified-types.js';
import { V1ToV2Adapter, V2ToV1Adapter, VersionDetector } from '../adapters/v1-v2-adapter.js';

/**
 * 转换策略接口
 */
export interface ConversionStrategy {
  /** 策略名称 */
  name: string;
  /** 策略描述 */
  description: string;
  /** 源版本 */
  from: 'v1' | 'v2';
  /** 目标版本 */
  to: 'v1' | 'v2';
  /** 转换函数 */
  convert: (element: any) => any;
  /** 验证函数 */
  validate?: (element: any) => boolean;
  /** 优先级（数字越高优先级越高） */
  priority: number;
}

/**
 * 转换选项接口
 */
export interface ConversionOptions {
  /** 错误处理策略 */
  errorHandling: 'throw' | 'skip' | 'default';
  /** 是否保留不支持的属性 */
  preserveUnsupported: boolean;
  /** 是否进行数据验证 */
  validate: boolean;
  /** 自定义转换策略 */
  customStrategies?: ConversionStrategy[];
  /** 转换回调 */
  onConvert?: (from: any, to: any) => void;
  /** 错误回调 */
  onError?: (error: Error, element: any) => void;
}

/**
 * 默认转换选项
 */
export const DEFAULT_CONVERSION_OPTIONS: ConversionOptions = {
  errorHandling: 'skip',
  preserveUnsupported: false,
  validate: true
};

/**
 * 智能版本转换器主类
 */
export class SmartVersionConverter {
  private strategies: Map<string, ConversionStrategy> = new Map();
  private options: ConversionOptions;

  constructor(options: Partial<ConversionOptions> = {}) {
    this.options = { ...DEFAULT_CONVERSION_OPTIONS, ...options };
    this.initializeDefaultStrategies();

    // 注册自定义策略
    if (options.customStrategies) {
      options.customStrategies.forEach(strategy => {
        this.registerStrategy(strategy);
      });
    }
  }

  /**
   * 初始化默认转换策略
   */
  private initializeDefaultStrategies(): void {
    // V1 → V2 文本元素策略
    this.registerStrategy({
      name: 'v1-to-v2-text',
      description: 'V1文本元素转V2',
      from: 'v1',
      to: 'v2',
      priority: 100,
      validate: (el) => el.type === 'text' && VersionDetector.isV1Element(el),
      convert: (el) => V1ToV2Adapter.convertTextElement(el)
    });

    // V1 → V2 形状元素策略
    this.registerStrategy({
      name: 'v1-to-v2-shape',
      description: 'V1形状元素转V2',
      from: 'v1',
      to: 'v2',
      priority: 100,
      validate: (el) => el.type === 'shape' && VersionDetector.isV1Element(el),
      convert: (el) => V1ToV2Adapter.convertShapeElement(el)
    });

    // V2 → V1 通用策略
    this.registerStrategy({
      name: 'v2-to-v1-generic',
      description: 'V2元素转V1通用策略',
      from: 'v2',
      to: 'v1',
      priority: 50,
      validate: (el) => VersionDetector.isV2Element(el),
      convert: (el) => V2ToV1Adapter.convertElement(el)
    });
  }

  /**
   * 注册转换策略
   */
  registerStrategy(strategy: ConversionStrategy): void {
    this.strategies.set(strategy.name, strategy);
  }

  /**
   * 获取适用的转换策略
   */
  private getApplicableStrategy(
    element: any,
    targetVersion: 'v1' | 'v2'
  ): ConversionStrategy | null {
    const currentVersion = VersionDetector.isV1Element(element) ? 'v1' : 'v2';

    if (currentVersion === targetVersion) {
      return null; // 无需转换
    }

    const applicableStrategies = Array.from(this.strategies.values())
      .filter(strategy =>
        strategy.from === currentVersion &&
        strategy.to === targetVersion &&
        (!strategy.validate || strategy.validate(element))
      )
      .sort((a, b) => b.priority - a.priority);

    return applicableStrategies[0] || null;
  }

  /**
   * 智能转换单个元素
   */
  smartConvert(
    element: V1CompatiblePPTElement | PPTElement,
    targetVersion: 'v1' | 'v2'
  ): V1CompatiblePPTElement | PPTElement | null {
    try {
      const strategy = this.getApplicableStrategy(element, targetVersion);

      if (!strategy) {
        // 无需转换或无适用策略
        return element;
      }

      const converted = strategy.convert(element);

      // 验证转换结果
      if (this.options.validate && !this.validateConvertedElement(converted, targetVersion)) {
        throw new Error('转换结果验证失败');
      }

      // 调用转换回调
      this.options.onConvert?.(element, converted);

      return converted;

    } catch (error) {
      this.handleConversionError(error as Error, element);
      return null;
    }
  }

  /**
   * 批量智能转换
   */
  smartBatchConvert(
    elements: (V1CompatiblePPTElement | PPTElement)[],
    targetVersion: 'v1' | 'v2'
  ): {
    converted: (V1CompatiblePPTElement | PPTElement)[];
    failed: any[];
    stats: {
      total: number;
      converted: number;
      failed: number;
      skipped: number;
    };
  } {
    const converted: (V1CompatiblePPTElement | PPTElement)[] = [];
    const failed: any[] = [];
    let skipped = 0;

    for (const element of elements) {
      const result = this.smartConvert(element, targetVersion);

      if (result) {
        converted.push(result);
      } else {
        if (this.getApplicableStrategy(element, targetVersion)) {
          failed.push(element);
        } else {
          skipped++;
        }
      }
    }

    return {
      converted,
      failed,
      stats: {
        total: elements.length,
        converted: converted.length,
        failed: failed.length,
        skipped
      }
    };
  }

  /**
   * 处理转换错误
   */
  private handleConversionError(error: Error, element: any): void {
    this.options.onError?.(error, element);

    switch (this.options.errorHandling) {
      case 'throw':
        throw error;
      case 'skip':
        // 静默跳过
        break;
      case 'default':
        // 使用默认转换器
        break;
    }
  }

  /**
   * 验证转换后的元素
   */
  private validateConvertedElement(element: any, expectedVersion: 'v1' | 'v2'): boolean {
    if (!element) return false;

    const actualVersion = VersionDetector.isV1Element(element) ? 'v1' : 'v2';
    return actualVersion === expectedVersion;
  }

  /**
   * 自动推断最佳转换策略
   */
  inferBestStrategy(elements: (V1CompatiblePPTElement | PPTElement)[]): {
    recommendedVersion: 'v1' | 'v2';
    confidence: number;
    reasoning: string[];
  } {
    const collection = new UnifiedPPTElementCollection(elements);
    const stats = collection.getVersionStats();
    const reasoning: string[] = [];

    let v2Score = 0;
    let v1Score = 0;

    // 基于版本分布评分
    const v2Ratio = stats.v2 / stats.total;
    const v1Ratio = stats.v1 / stats.total;

    if (v2Ratio > 0.7) {
      v2Score += 40;
      reasoning.push(`${Math.round(v2Ratio * 100)}%的元素已是V2格式`);
    }

    if (v1Ratio > 0.7) {
      v1Score += 30;
      reasoning.push(`${Math.round(v1Ratio * 100)}%的元素是V1格式`);
    }

    // 基于功能特性评分
    const v2Elements = collection.getAll().filter(el => el.version() === 'v2');
    const hasV2Features = v2Elements.some(el => {
      const raw = el.raw() as any;
      return raw.textType || raw.imageType || raw.pattern;
    });

    if (hasV2Features) {
      v2Score += 30;
      reasoning.push('检测到V2特有功能');
    }

    // 基于兼容性评分
    const compatibility = VersionConversionUtils.checkCompatibility(elements);
    if (compatibility.compatible) {
      v2Score += 20;
      reasoning.push('完全兼容V2标准');
    } else {
      v1Score += 20;
      reasoning.push('存在V2兼容性问题');
    }

    // 基于未来扩展性评分
    v2Score += 10; // V2是未来方向

    const recommendedVersion = v2Score > v1Score ? 'v2' : 'v1';
    const confidence = Math.min(Math.abs(v2Score - v1Score) / Math.max(v2Score, v1Score), 1);

    reasoning.push(`推荐使用${recommendedVersion.toUpperCase()}版本 (置信度: ${Math.round(confidence * 100)}%)`);

    return {
      recommendedVersion,
      confidence,
      reasoning
    };
  }

  /**
   * 获取转换预览
   */
  previewConversion(
    elements: (V1CompatiblePPTElement | PPTElement)[],
    targetVersion: 'v1' | 'v2'
  ): {
    summary: {
      total: number;
      willConvert: number;
      willSkip: number;
      willFail: number;
    };
    details: Array<{
      element: any;
      status: 'convert' | 'skip' | 'fail';
      strategy?: string;
      reason?: string;
    }>;
  } {
    const details: Array<{
      element: any;
      status: 'convert' | 'skip' | 'fail';
      strategy?: string;
      reason?: string;
    }> = [];

    let willConvert = 0;
    let willSkip = 0;
    let willFail = 0;

    for (const element of elements) {
      const currentVersion = VersionDetector.isV1Element(element) ? 'v1' : 'v2';

      if (currentVersion === targetVersion) {
        details.push({
          element,
          status: 'skip',
          reason: '已是目标版本'
        });
        willSkip++;
        continue;
      }

      const strategy = this.getApplicableStrategy(element, targetVersion);

      if (strategy) {
        details.push({
          element,
          status: 'convert',
          strategy: strategy.name
        });
        willConvert++;
      } else {
        details.push({
          element,
          status: 'fail',
          reason: '无适用的转换策略'
        });
        willFail++;
      }
    }

    return {
      summary: {
        total: elements.length,
        willConvert,
        willSkip,
        willFail
      },
      details
    };
  }
}

/**
 * 渐变转换器（专门处理复杂的渐变转换）
 */
export class GradientConverter {
  /**
   * V1渐变 → V2渐变
   */
  static v1ToV2(v1Gradient: V1ShapeGradient): Gradient {
    return V1ToV2Adapter.convertGradient(v1Gradient);
  }

  /**
   * V2渐变 → V1渐变
   */
  static v2ToV1(v2Gradient: Gradient): V1ShapeGradient {
    return V2ToV1Adapter.convertGradient(v2Gradient);
  }

  /**
   * 智能渐变转换（自动检测版本）
   */
  static smartConvert(gradient: V1ShapeGradient | Gradient, targetVersion: 'v1' | 'v2'): V1ShapeGradient | Gradient {
    const isV1 = 'themeColor' in gradient && Array.isArray(gradient.themeColor);

    if (isV1 && targetVersion === 'v2') {
      return this.v1ToV2(gradient as V1ShapeGradient);
    } else if (!isV1 && targetVersion === 'v1') {
      return this.v2ToV1(gradient as Gradient);
    }

    return gradient;
  }

  /**
   * 渐变兼容性检查
   */
  static checkCompatibility(gradient: any): {
    version: 'v1' | 'v2' | 'unknown';
    valid: boolean;
    issues: string[];
  } {
    const issues: string[] = [];
    let version: 'v1' | 'v2' | 'unknown' = 'unknown';
    let valid = true;

    if (gradient.themeColor && Array.isArray(gradient.themeColor)) {
      version = 'v1';

      if (gradient.themeColor.length !== 2) {
        issues.push('V1渐变应包含恰好2个颜色');
        valid = false;
      }

      gradient.themeColor.forEach((color: any, index: number) => {
        if (!color.color && !color.themeColor) {
          issues.push(`V1渐变颜色${index + 1}缺少color或themeColor属性`);
          valid = false;
        }
      });

    } else if (gradient.colors && Array.isArray(gradient.colors)) {
      version = 'v2';

      if (gradient.colors.length < 2) {
        issues.push('V2渐变应至少包含2个颜色');
        valid = false;
      }

      gradient.colors.forEach((colorStop: any, index: number) => {
        if (typeof colorStop.pos !== 'number' || typeof colorStop.color !== 'string') {
          issues.push(`V2渐变颜色停止点${index + 1}格式错误`);
          valid = false;
        }
      });
    } else {
      issues.push('无法识别渐变格式');
      valid = false;
    }

    return { version, valid, issues };
  }
}

/**
 * 预设转换器实例
 */
export const standardConverter = new SmartVersionConverter();

export const conservativeConverter = new SmartVersionConverter({
  errorHandling: 'skip',
  preserveUnsupported: true,
  validate: true
});

export const aggressiveConverter = new SmartVersionConverter({
  errorHandling: 'default',
  preserveUnsupported: false,
  validate: false
});

/**
 * 便捷转换函数
 */
export class ConverterUtils {
  /**
   * 一键转换到V2
   */
  static toV2(elements: (V1CompatiblePPTElement | PPTElement)[]): (V1CompatiblePPTElement | PPTElement)[] {
    return standardConverter.smartBatchConvert(elements, 'v2').converted;
  }

  /**
   * 一键转换到V1
   */
  static toV1(elements: (V1CompatiblePPTElement | PPTElement)[]): (V1CompatiblePPTElement | PPTElement)[] {
    return standardConverter.smartBatchConvert(elements, 'v1').converted;
  }

  /**
   * 自动选择最佳版本并转换
   */
  static autoConvert(elements: (V1CompatiblePPTElement | PPTElement)[]): {
    converted: (V1CompatiblePPTElement | PPTElement)[];
    strategy: 'v1' | 'v2';
    confidence: number;
  } {
    const inference = standardConverter.inferBestStrategy(elements);
    const result = standardConverter.smartBatchConvert(elements, inference.recommendedVersion);

    return {
      converted: result.converted,
      strategy: inference.recommendedVersion,
      confidence: inference.confidence
    };
  }
}
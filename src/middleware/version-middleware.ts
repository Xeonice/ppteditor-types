/**
 * 版本处理中间件
 * 提供数据流转过程中的版本处理和转换
 */

import type { V1CompatiblePPTElement } from '../types/v1-compat-types.js';
import type { PPTElement } from '../types/v2-standard-types.js';
import { UnifiedPPTElement, UnifiedPPTElementCollection, VersionConversionUtils } from '../types/unified-types.js';

/**
 * 中间件配置接口
 */
export interface MiddlewareConfig {
  /** 默认版本偏好 */
  defaultVersion: 'v1' | 'v2';
  /** 是否启用自动转换 */
  autoConvert: boolean;
  /** 是否保留原始数据 */
  preserveOriginal: boolean;
  /** 错误处理策略 */
  errorHandling: 'throw' | 'skip' | 'warn';
  /** 日志级别 */
  logLevel: 'none' | 'error' | 'warn' | 'info' | 'debug';
}

/**
 * 默认中间件配置
 */
export const DEFAULT_MIDDLEWARE_CONFIG: MiddlewareConfig = {
  defaultVersion: 'v2',
  autoConvert: true,
  preserveOriginal: false,
  errorHandling: 'warn',
  logLevel: 'warn'
};

/**
 * 处理上下文接口
 */
export interface ProcessingContext {
  /** 数据来源 */
  source: 'api' | 'ui' | 'storage' | 'import' | 'export';
  /** 目标用途 */
  target: 'api' | 'ui' | 'storage' | 'display' | 'processing';
  /** 用户偏好版本 */
  preferredVersion?: 'v1' | 'v2';
  /** 是否强制转换 */
  forceConversion?: boolean;
  /** 额外元数据 */
  metadata?: Record<string, any>;
}

/**
 * 处理结果接口
 */
export interface ProcessingResult<T> {
  /** 处理后的数据 */
  data: T;
  /** 原始数据（如果保留） */
  original?: any;
  /** 处理统计 */
  stats: {
    processed: number;
    converted: number;
    skipped: number;
    errors: number;
  };
  /** 警告信息 */
  warnings: string[];
  /** 错误信息 */
  errors: string[];
  /** 处理时间（毫秒） */
  processingTime: number;
}

/**
 * 版本处理中间件主类
 */
export class VersionMiddleware {
  private config: MiddlewareConfig;
  private logger: (level: string, message: string, data?: any) => void;

  constructor(config: Partial<MiddlewareConfig> = {}) {
    this.config = { ...DEFAULT_MIDDLEWARE_CONFIG, ...config };
    this.logger = this.createLogger();
  }

  /**
   * 创建日志记录器
   */
  private createLogger() {
    const levels = ['none', 'error', 'warn', 'info', 'debug'];
    const currentLevelIndex = levels.indexOf(this.config.logLevel);

    return (level: string, message: string, data?: any) => {
      const levelIndex = levels.indexOf(level);
      if (levelIndex >= 0 && levelIndex <= currentLevelIndex && typeof globalThis !== 'undefined' && (globalThis as any).console) {
        const logFn = (globalThis as any).console[level] || (globalThis as any).console.log;
        logFn(`[VersionMiddleware] ${message}`, data || '');
      }
    };
  }

  /**
   * 处理单个元素
   */
  processElement(
    element: V1CompatiblePPTElement | PPTElement,
    context: ProcessingContext
  ): ProcessingResult<V1CompatiblePPTElement | PPTElement | null> {
    const startTime = Date.now();
    const warnings: string[] = [];
    const errors: string[] = [];

    try {
      this.logger('debug', 'Processing single element', { elementType: element.type, context });

      const unified = new UnifiedPPTElement(element);
      const targetVersion = this.determineTargetVersion(context);

      let processedData: V1CompatiblePPTElement | PPTElement | null;

      if (targetVersion === 'v1') {
        processedData = unified.asV1();
      } else {
        processedData = unified.asV2();
        if (!processedData && this.config.errorHandling === 'warn') {
          warnings.push(`无法将元素 ${element.id} 转换为V2格式`);
        }
      }

      return {
        data: processedData,
        original: this.config.preserveOriginal ? element : undefined,
        stats: {
          processed: 1,
          converted: unified.version() !== targetVersion ? 1 : 0,
          skipped: processedData ? 0 : 1,
          errors: 0
        },
        warnings,
        errors,
        processingTime: Date.now() - startTime
      };

    } catch (error) {
      const errorMessage = `处理元素失败: ${error instanceof Error ? error.message : String(error)}`;
      errors.push(errorMessage);
      this.logger('error', errorMessage, { element, context });

      if (this.config.errorHandling === 'throw') {
        throw error;
      }

      return {
        data: null,
        original: this.config.preserveOriginal ? element : undefined,
        stats: {
          processed: 1,
          converted: 0,
          skipped: 0,
          errors: 1
        },
        warnings,
        errors,
        processingTime: Date.now() - startTime
      };
    }
  }

  /**
   * 批量处理元素
   */
  processElements(
    elements: (V1CompatiblePPTElement | PPTElement)[],
    context: ProcessingContext
  ): ProcessingResult<(V1CompatiblePPTElement | PPTElement)[]> {
    const startTime = Date.now();
    const warnings: string[] = [];
    const errors: string[] = [];
    const processedElements: (V1CompatiblePPTElement | PPTElement)[] = [];

    this.logger('info', `开始批量处理 ${elements.length} 个元素`, { context });

    const collection = new UnifiedPPTElementCollection(elements);
    const versionStats = collection.getVersionStats();
    const targetVersion = this.determineTargetVersion(context);

    this.logger('debug', '版本统计', versionStats);

    // 执行兼容性检查
    const compatibility = VersionConversionUtils.checkCompatibility(elements);
    if (!compatibility.compatible) {
      warnings.push(...compatibility.issues);
      this.logger('warn', '兼容性检查发现问题', compatibility);
    }

    // 批量转换
    try {
      const conversionResult = VersionConversionUtils.normalizeToVersion(elements, targetVersion);
      processedElements.push(...conversionResult.converted);

      if (conversionResult.stats.skipped > 0) {
        warnings.push(`跳过了 ${conversionResult.stats.skipped} 个无法转换的元素`);
      }

      this.logger('info', '批量转换完成', conversionResult.stats);

    } catch (error) {
      const errorMessage = `批量处理失败: ${error instanceof Error ? error.message : String(error)}`;
      errors.push(errorMessage);
      this.logger('error', errorMessage, { elements: elements.length, context });

      if (this.config.errorHandling === 'throw') {
        throw error;
      }
    }

    const stats = {
      processed: elements.length,
      converted: processedElements.length,
      skipped: elements.length - processedElements.length,
      errors: errors.length
    };

    return {
      data: processedElements,
      original: this.config.preserveOriginal ? elements : undefined,
      stats,
      warnings,
      errors,
      processingTime: Date.now() - startTime
    };
  }

  /**
   * 输入数据预处理
   */
  preprocessInput(
    data: any,
    context: ProcessingContext
  ): ProcessingResult<(V1CompatiblePPTElement | PPTElement)[]> {
    this.logger('debug', '输入预处理', { dataType: typeof data, context });

    // 数据标准化
    let elements: (V1CompatiblePPTElement | PPTElement)[];

    if (Array.isArray(data)) {
      elements = data;
    } else if (data && typeof data === 'object' && data.elements) {
      elements = data.elements;
    } else if (data && typeof data === 'object') {
      elements = [data];
    } else {
      throw new Error('无效的输入数据格式');
    }

    return this.processElements(elements, context);
  }

  /**
   * 输出数据后处理
   */
  postprocessOutput(
    elements: (V1CompatiblePPTElement | PPTElement)[],
    context: ProcessingContext
  ): ProcessingResult<any> {
    const processed = this.processElements(elements, context);

    // 根据上下文格式化输出
    let outputData: any = processed.data;

    switch (context.target) {
      case 'api':
        // API输出：添加元数据
        outputData = {
          elements: processed.data,
          metadata: {
            version: this.config.defaultVersion,
            processedAt: new Date().toISOString(),
            stats: processed.stats
          }
        };
        break;

      case 'storage':
        // 存储输出：优化存储格式
        outputData = {
          version: this.config.defaultVersion,
          elements: processed.data,
          checksum: this.calculateChecksum(processed.data)
        };
        break;

      case 'display':
        // 显示输出：只保留必要字段
        outputData = processed.data.map(el => ({
          id: el.id,
          type: el.type,
          left: el.left,
          top: el.top,
          width: el.width,
          height: (el as any).height || 0
        }));
        break;

      default:
        outputData = processed.data;
    }

    return {
      ...processed,
      data: outputData
    };
  }

  /**
   * 确定目标版本
   */
  private determineTargetVersion(context: ProcessingContext): 'v1' | 'v2' {
    if (context.forceConversion && context.preferredVersion) {
      return context.preferredVersion;
    }

    if (context.preferredVersion) {
      return context.preferredVersion;
    }

    // 根据上下文推断最佳版本
    switch (context.source) {
      case 'api':
        return context.target === 'storage' ? 'v2' : this.config.defaultVersion;
      case 'storage':
        return 'v2'; // 存储优先使用V2
      case 'import':
        return this.config.defaultVersion;
      default:
        return this.config.defaultVersion;
    }
  }

  /**
   * 计算数据校验和
   */
  private calculateChecksum(data: any): string {
    const jsonString = JSON.stringify(data, Object.keys(data).sort());
    // 简单的字符串哈希算法
    let hash = 0;
    for (let i = 0; i < jsonString.length; i++) {
      const char = jsonString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 转换为32位整数
    }
    return Math.abs(hash).toString(16).slice(0, 16);
  }

  /**
   * 更新配置
   */
  updateConfig(newConfig: Partial<MiddlewareConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.logger = this.createLogger();
    this.logger('info', '中间件配置已更新', this.config);
  }

  /**
   * 获取当前配置
   */
  getConfig(): MiddlewareConfig {
    return { ...this.config };
  }
}

/**
 * 预定义的中间件实例
 */
export const apiMiddleware = new VersionMiddleware({
  defaultVersion: 'v2',
  autoConvert: true,
  preserveOriginal: false,
  errorHandling: 'warn',
  logLevel: 'warn'
});

export const storageMiddleware = new VersionMiddleware({
  defaultVersion: 'v2',
  autoConvert: true,
  preserveOriginal: true,
  errorHandling: 'skip',
  logLevel: 'error'
});

export const uiMiddleware = new VersionMiddleware({
  defaultVersion: 'v2',
  autoConvert: true,
  preserveOriginal: false,
  errorHandling: 'skip',
  logLevel: 'none'
});

/**
 * 便捷处理函数
 */
export class MiddlewareUtils {
  /**
   * API数据处理
   */
  static forAPI(data: any): ProcessingResult<any> {
    return apiMiddleware.postprocessOutput(
      Array.isArray(data) ? data : [data],
      { source: 'api', target: 'api' }
    );
  }

  /**
   * 存储数据处理
   */
  static forStorage(data: any): ProcessingResult<any> {
    return storageMiddleware.postprocessOutput(
      Array.isArray(data) ? data : [data],
      { source: 'ui', target: 'storage' }
    );
  }

  /**
   * UI显示数据处理
   */
  static forUI(data: any): ProcessingResult<any> {
    return uiMiddleware.postprocessOutput(
      Array.isArray(data) ? data : [data],
      { source: 'api', target: 'display' }
    );
  }

  /**
   * 导入数据处理
   */
  static forImport(data: any, preferredVersion: 'v1' | 'v2' = 'v2'): ProcessingResult<any> {
    const middleware = new VersionMiddleware({
      defaultVersion: preferredVersion,
      autoConvert: true,
      preserveOriginal: true,
      errorHandling: 'warn',
      logLevel: 'info'
    });

    return middleware.preprocessInput(data, {
      source: 'import',
      target: 'processing',
      preferredVersion
    });
  }
}
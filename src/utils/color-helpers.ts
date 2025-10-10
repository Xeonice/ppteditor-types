/**
 * V1 颜色配置工具函数
 *
 * 提供颜色配置的创建、转换和验证工具
 *
 * @packageDocumentation
 */

import type { V1ColorConfig } from '../types/v1-compat-types.js';
import type { ThemeColorType } from '../extensions/project-extended.js';

/**
 * 将字符串颜色转换为 V1ColorConfig
 *
 * @param color - 颜色字符串（HEX/RGB/RGBA）
 * @returns 规范化的 V1ColorConfig 对象
 *
 * @example
 * ```typescript
 * import { stringToColorConfig } from '@douglasdong/ppteditor-types';
 *
 * const config = stringToColorConfig('#FF0000');
 * // { color: '#FF0000' }
 * ```
 */
export function stringToColorConfig(color: string): V1ColorConfig {
  return { color };
}

/**
 * 从 V1ColorConfig 提取颜色字符串
 *
 * @param config - 颜色配置对象
 * @returns 颜色字符串
 *
 * @example
 * ```typescript
 * import { colorConfigToString } from '@douglasdong/ppteditor-types';
 *
 * const colorStr = colorConfigToString({
 *   color: '#FF0000',
 *   opacity: 0.5
 * });
 * // '#FF0000'
 * ```
 */
export function colorConfigToString(config: V1ColorConfig): string {
  return config.color;
}

/**
 * 创建主题色配置
 *
 * @param color - 颜色值
 * @param colorType - 主题色类型
 * @param colorIndex - 主题色索引（可选）
 * @param opacity - 透明度 0-1（可选）
 * @returns 完整的主题色配置
 *
 * @example
 * ```typescript
 * import { createThemeColorConfig } from '@douglasdong/ppteditor-types';
 *
 * const themeColor = createThemeColorConfig(
 *   '#FF0000',
 *   'accent1',
 *   1,
 *   0.8
 * );
 * ```
 */
export function createThemeColorConfig(
  color: string,
  colorType: ThemeColorType,
  colorIndex?: number,
  opacity?: number
): V1ColorConfig {
  const config: V1ColorConfig = {
    color,
    colorType
  };

  if (colorIndex !== undefined) {
    config.colorIndex = colorIndex;
  }

  if (opacity !== undefined) {
    config.opacity = opacity;
  }

  // V1ColorConfig 现在使用项目的 ColorConfig
  // themeColor 字段是可选的对象类型：{ color: string; type: ThemeColorType }
  if (colorType) {
    // Validate color format before creating themeColor object
    if (!color || typeof color !== 'string') {
      throw new Error('Invalid color value for theme color configuration');
    }
    config.themeColor = {
      color,
      type: colorType
    };
  }

  return config;
}

/**
 * 检查是否为主题色配置
 *
 * @param config - 颜色配置
 * @returns 如果包含主题色信息返回 true
 *
 * @example
 * ```typescript
 * import { isThemeColor } from '@douglasdong/ppteditor-types';
 *
 * if (isThemeColor(config)) {
 *   console.log('这是一个主题色配置');
 * }
 * ```
 */
export function isThemeColor(config: V1ColorConfig): boolean {
  return config.colorType !== undefined || config.themeColor !== undefined;
}

/**
 * 合并颜色配置（后者覆盖前者）
 *
 * @param base - 基础配置
 * @param override - 覆盖配置
 * @returns 合并后的配置
 *
 * @example
 * ```typescript
 * import { mergeColorConfig } from '@douglasdong/ppteditor-types';
 *
 * const merged = mergeColorConfig(
 *   { color: '#FF0000', opacity: 0.5 },
 *   { opacity: 0.8 }
 * );
 * // { color: '#FF0000', opacity: 0.8 }
 * ```
 */
export function mergeColorConfig(
  base: V1ColorConfig,
  override: Partial<V1ColorConfig>
): V1ColorConfig {
  return { ...base, ...override };
}

/**
 * 验证颜色配置的有效性
 *
 * @param config - 要验证的配置
 * @returns 如果配置有效返回 true
 *
 * @example
 * ```typescript
 * import { validateColorConfig } from '@douglasdong/ppteditor-types';
 *
 * if (validateColorConfig(userInput)) {
 *   applyColor(userInput);
 * } else {
 *   console.error('无效的颜色配置');
 * }
 * ```
 */
export function validateColorConfig(config: unknown): config is V1ColorConfig {
  if (!config || typeof config !== 'object') return false;

  const color = config as Record<string, unknown>;

  // color 字段是必需的
  if (typeof color.color !== 'string') return false;

  // 验证可选的 themeColor 字段（现在是对象类型）
  if (color.themeColor !== undefined) {
    if (typeof color.themeColor !== 'object' || color.themeColor === null) {
      return false;
    }
    const themeColor = color.themeColor as Record<string, unknown>;
    // 验证 themeColor 对象的必需字段
    if (typeof themeColor.color !== 'string') return false;
    if (typeof themeColor.type !== 'string') return false;
  }

  if (color.colorType !== undefined && typeof color.colorType !== 'string') {
    return false;
  }

  if (color.colorIndex !== undefined && typeof color.colorIndex !== 'number') {
    return false;
  }

  if (color.opacity !== undefined) {
    if (typeof color.opacity !== 'number') return false;
    if (color.opacity < 0 || color.opacity > 1) return false;
  }

  return true;
}

/**
 * V2标准类型定义
 * 当前仓库的标准化类型定义re-export
 */

// 重新导出所有V2标准类型
export * from '../base/index.js';
export * from '../elements/index.js';
export * from '../enums/index.js';
export * from '../animation/index.js';
export * from '../slide/index.js';

// 主要V2类型的具名导出（便于直接引用）
export type {
  PPTElement,
  PPTTextElement,
  PPTImageElement,
  PPTShapeElement,
  PPTLineElement,
  PPTChartElement,
  PPTTableElement,
  PPTLatexElement,
  PPTVideoElement,
  PPTAudioElement
} from '../elements/index.js';

export type {
  Gradient,
  GradientColor,
  GradientType,
  PPTElementShadow,
  PPTElementOutline,
  PPTElementLink
} from '../base/index.js';

export type {
  ElementTypes,
  ShapePathFormulasKeys
} from '../enums/index.js';

export type {
  SlideTheme,
  SlideBackground
} from '../slide/index.js';

export type {
  PPTAnimation,
  AnimationType
} from '../animation/index.js';

// V2版本标识
export const V2_VERSION = '2.0.0';
export const V2_SCHEMA_VERSION = 2;

// V2标准特性标识
export const V2_FEATURES = {
  STANDARD_GRADIENT: true,
  STRING_COLORS: true,
  TEXT_TYPES: true,
  IMAGE_TYPES: true,
  ENHANCED_ANIMATIONS: true,
  SLIDE_THEMES: true
} as const;
/**
 * V1兼容类型定义
 * 用于支持现有V1项目的类型适配和迁移
 * 根据 v1-type-compatibility-adaptations.md 优化
 */

// 导入并重新导出项目扩展的主题颜色类型
import type { ThemeColorType } from '../extensions/project-extended.js'
export type { ThemeColorType }

// ============ V1 颜色配置类型（重构） ============

/**
 * V1 兼容的颜色配置类型（扁平化结构）
 *
 * 支持三种使用模式：
 * 1. 简单模式：只指定颜色值 `{ color: '#FF0000' }`
 * 2. 主题色模式：指定主题色类型和索引
 * 3. 完整模式：包含所有可选配置
 *
 * 此类型设计为扁平化接口，所有字段都是可选的（除了 color），
 * 避免了之前联合类型导致的类型兼容性问题。
 *
 * @example
 * ```typescript
 * // 简单模式 - 最常用
 * const color1: V1ColorConfig = { color: '#FF0000' };
 *
 * // 主题色模式 - 用于主题色系统
 * const color2: V1ColorConfig = {
 *   color: '#FF0000',
 *   colorType: 'accent1',
 *   colorIndex: 1
 * };
 *
 * // 完整模式 - 包含所有配置
 * const color3: V1ColorConfig = {
 *   color: '#FF0000',
 *   themeColor: 'accent1',    // 向后兼容字段
 *   colorType: 'accent1',
 *   colorIndex: 1,
 *   opacity: 0.8
 * };
 * ```
 */
export interface V1ColorConfig {
  /**
   * 实际颜色值（必需）
   *
   * 支持格式：
   * - HEX: '#FF0000'
   * - RGB: 'rgb(255, 0, 0)'
   * - RGBA: 'rgba(255, 0, 0, 0.5)'
   */
  color: string;

  /**
   * 主题色名称（可选）
   *
   * V1 标准字段，用于向后兼容
   *
   * @deprecated 建议使用 colorType 替代
   */
  themeColor?: string;

  /**
   * 主题色类型（可选）
   *
   * 项目扩展字段，用于主题色系统
   *
   * 支持的值：
   * - accent1-6: 强调色
   * - dk1-2: 深色（文本）
   * - lt1-2: 浅色（背景）
   */
  colorType?: ThemeColorType;

  /**
   * 主题色索引（可选）
   *
   * 项目扩展字段，用于颜色变体
   *
   * @example
   * colorIndex: 0  // 原始颜色
   * colorIndex: 1  // 第一个变体（通常是较浅的颜色）
   * colorIndex: -1 // 第一个变体（通常是较深的颜色）
   */
  colorIndex?: number;

  /**
   * 不透明度（可选）
   *
   * 项目扩展字段，范围 0-1
   *
   * @example
   * opacity: 1.0   // 完全不透明
   * opacity: 0.5   // 半透明
   * opacity: 0.0   // 完全透明
   */
  opacity?: number;
}

// V1项目中的渐变类型 - 基于适配文档的类型替换模式
export interface V1ShapeGradient {
  type: "linear" | "radial";
  themeColor: [V1ColorConfig, V1ColorConfig];  // 使用项目优化的颜色系统
  rotate: number;
}

// V1项目中的阴影类型 - 基于适配文档的完全重定义模式
export interface V1PPTElementShadow {
  h: number;
  v: number;
  blur: number;
  themeColor: V1ColorConfig;  // 使用项目的颜色系统和字段名
}

// V1项目中的描边类型 - 基于适配文档的完全重定义模式
export interface V1PPTElementOutline {
  style?: "dashed" | "solid";
  width?: number;
  themeColor?: V1ColorConfig;  // 使用项目的颜色系统和字段名
}

// V1项目基础元素扩展属性
export interface V1PPTBaseElementExtension {
  tag?: string;           // 元素标签，用于业务逻辑
  index?: number;         // 元素索引，用于排序
  from?: string;          // 元素来源，AI生成标识
  isDefault?: boolean;    // 是否为默认元素
}

// V1兼容基础元素类型
export interface V1CompatibleBaseElement {
  id: string;
  left: number;
  top: number;
  lock?: boolean;
  groupId?: string;
  width: number;
  height: number;
  rotate: number;
  name?: string;
  // V1特有属性
  tag?: string;
  index?: number;
  from?: string;
  isDefault?: boolean;
}

// V1兼容文本元素
export interface V1CompatibleTextElement extends V1CompatibleBaseElement {
  type: "text";
  content: string;
  defaultFontName: string;
  defaultColor: V1ColorConfig;    // V1格式：ColorConfig对象
  themeFill?: V1ColorConfig;      // V1格式：ColorConfig对象
  lineHeight?: number;
  wordSpace?: number;
  opacity?: number;
  paragraphSpace?: number;
  vertical?: boolean;
  valign?: 'middle' | 'top' | 'bottom';
  fit: 'none' | 'shrink' | 'resize';
  maxFontSize?: number;
  enableShrink?: boolean;         // V1特有功能
  // 新增支持的样式属性
  shadow?: V1PPTElementShadow;    // 文本阴影效果
  outline?: V1PPTElementOutline;  // 文本描边效果
}

// V1兼容形状元素
export interface V1CompatibleShapeElement extends V1CompatibleBaseElement {
  type: "shape";
  viewBox: [number, number];
  path: string | any[];           // V1支持复杂路径类型
  fixedRatio: boolean;
  themeFill: V1ColorConfig;       // V1格式：ColorConfig对象
  gradient?: V1ShapeGradient;     // V1格式：ShapeGradient对象
  opacity?: number;
  flipH?: boolean;
  flipV?: boolean;
  special?: boolean;
  keypoint?: number;              // V1特有
  keypoints?: number[];
  // 新增支持的样式属性
  shadow?: V1PPTElementShadow;    // 阴影效果
  outline?: V1PPTElementOutline;  // 描边效果
}

// V1兼容图片元素
export interface V1CompatibleImageElement extends V1CompatibleBaseElement {
  type: "image";
  src: string;
  size?: string;                  // V1特有
  loading?: boolean;              // V1特有：UI状态
}

// V1兼容线条元素
export interface V1CompatibleLineElement extends V1CompatibleBaseElement {
  type: "line";
  start: [number, number];
  end: [number, number];
  themeColor: V1ColorConfig;      // V1格式：ColorConfig对象
  lineWidth?: number;             // 重命名避免与基类width冲突
  style?: string;
}

// V1兼容图表元素
/**
 * V1 兼容的图表元素类型
 *
 * 支持向后兼容的 themeColor (单数) 字段名
 *
 * @example
 * ```typescript
 * // 推荐用法（使用 themeColors）
 * const chart1: V1CompatibleChartElement = {
 *   type: "chart",
 *   chartType: "bar",
 *   themeColors: ["#FF0000", "#00FF00"],
 *   // ... 其他属性
 * };
 *
 * // 向后兼容用法（使用 themeColor）
 * const chart2: V1CompatibleChartElement = {
 *   type: "chart",
 *   chartType: "bar",
 *   themeColor: ["#FF0000", "#00FF00"],  // 也支持
 *   // ... 其他属性
 * };
 * ```
 */
export interface V1CompatibleChartElement extends V1CompatibleBaseElement {
  type: "chart";

  /**
   * 图表基础类型
   *
   * - bar: 柱状图
   * - line: 折线图
   * - pie: 饼图
   */
  chartType: "bar" | "line" | "pie";

  /**
   * 图表数据
   */
  data: {
    labels: string[];        // X 轴标签
    legends: string[];       // 图例
    series: number[][];      // 数据系列
  };

  /**
   * 图表配置项（可选）
   *
   * 依赖于具体的图表库（chartist）的配置格式
   */
  options?: Record<string, any>;

  /**
   * 填充色（可选）
   */
  fill?: string;

  /**
   * 边框样式（可选）
   */
  outline?: V1PPTElementOutline;

  /**
   * 图表主题色数组（标准字段）
   *
   * 推荐使用此字段，符合类型规范
   */
  themeColors: string[];

  /**
   * 图表主题色数组（向后兼容别名）
   *
   * @deprecated 建议使用 themeColors（复数）替代
   *
   * 为了向后兼容保留此字段，允许项目代码继续使用 themeColor（单数）
   * 新代码应该使用 themeColors（复数）
   */
  themeColor?: string[];

  /**
   * 网格和坐标颜色（可选）
   */
  gridColor?: string;

  /**
   * 图例位置（可选）
   *
   * - "": 不显示图例
   * - "top": 顶部
   * - "bottom": 底部
   */
  legend?: "" | "top" | "bottom";
}

// V1项目独有元素类型
export interface V1PPTNoneElement extends V1CompatibleBaseElement {
  type: "none";
  from?: string;
  text: string;                   // 大模型生成的数据
  content?: string;               // 用户编辑的数据
}

// V1兼容联合类型
export type V1CompatiblePPTElement =
  | V1CompatibleTextElement
  | V1CompatibleShapeElement
  | V1CompatibleImageElement
  | V1CompatibleLineElement
  | V1CompatibleChartElement
  | V1PPTNoneElement;

// V1文本元素的多种变体（项目特有设计）
export interface V1PPTTextElementBase extends V1CompatibleBaseElement {
  type: "text";
  content: string;
  defaultFontName: string;
}

export interface V1PPTTextElement extends V1PPTTextElementBase {
  defaultColor: V1ColorConfig;
  themeFill?: V1ColorConfig;
  enableShrink?: boolean;
}

export interface V1PPTTextElementApi extends V1PPTTextElementBase {
  defaultColor: string;           // API版本使用string
  themeFill?: string;
}

// 导出别名（向后兼容）
export type V1PPTElement = V1CompatiblePPTElement;

// ============ 适配策略文档化 ============
/**
 * 适配策略总结（基于 v1-type-compatibility-adaptations.md）
 *
 * 核心适配原则：
 * 1. 最小化代码变更 - 优先保持现有代码结构
 * 2. 向下兼容 - 确保现有功能不受影响
 * 3. 渐进式增强 - 为未来 V2 升级保留空间
 *
 * 适配模式：
 *
 * 1. 字段扩展模式 (V1ColorConfig):
 *    - 继承 V1 基础，添加项目扩展
 *    - themeColor 改为可选以适配现有代码
 *    - 添加 colorType、colorIndex、opacity 扩展
 *
 * 2. 类型替换模式 (V1ShapeGradient):
 *    - 继承结构，替换特定字段类型
 *    - themeColor 数组使用项目优化的 V1ColorConfig
 *
 * 3. 完全重定义模式 (V1PPTElementShadow, V1PPTElementOutline):
 *    - 结构相似但字段名不同
 *    - 使用 themeColor 而非 color 字段名
 *    - 使用项目的复杂颜色对象系统
 *
 * 兼容性成果：
 * ✅ 保持 90%+ 代码兼容性
 * ✅ 保留所有项目特有功能
 * ✅ 为未来标准化升级奠定基础
 * ✅ 最小化迁移风险
 */

// 注意：新增的样式类型已经在上面直接导出，无需重复导出

// ============ 扩展属性和工具导出 ============

/**
 * 导出扩展属性相关的类型和工具函数
 *
 * 使用方式：
 * ```typescript
 * import {
 *   hasTag,
 *   hasFrom,
 *   type PPTElementExtension
 * } from '@douglasdong/ppteditor-types/v1-compat';
 *
 * if (hasTag(element)) {
 *   console.log(element.tag);
 * }
 * ```
 */
export type {
  PPTElementExtension,
  WithExtension
} from '../extensions/element-extensions.js';

export {
  hasTag,
  hasIndex,
  hasFrom,
  hasIsDefault,
  hasExtensions
} from '../extensions/element-extensions.js';

/**
 * 导出颜色配置工具函数
 *
 * 使用方式：
 * ```typescript
 * import {
 *   stringToColorConfig,
 *   colorConfigToString
 * } from '@douglasdong/ppteditor-types/v1-compat';
 *
 * const config = stringToColorConfig('#FF0000');
 * ```
 */
export {
  stringToColorConfig,
  colorConfigToString,
  createThemeColorConfig,
  isThemeColor,
  mergeColorConfig,
  validateColorConfig
} from '../utils/color-helpers.js';
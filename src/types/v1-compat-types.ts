/**
 * V1兼容类型定义
 * 用于支持现有V1项目的类型适配和迁移
 * 根据 v1-type-compatibility-adaptations.md 优化
 */

// 导入并重新导出项目扩展的主题颜色类型和颜色配置
import type { ThemeColorType, ColorConfig } from '../extensions/project-extended.js'
export type { ThemeColorType, ColorConfig }

// 导入标准类型（用于扩展属性）
import type { PPTElementLink } from '../base/link.js'

// 导入形状路径公式类型
import type { ShapePathFormulaValue } from '../enums/shape.js'
export type { ShapePathFormulaValue }

// ============ V1 颜色配置类型（统一为项目 ColorConfig） ============

/**
 * V1 兼容的颜色配置类型
 *
 * ⭐ 关键改变：直接使用项目的 ColorConfig 类型，确保完全兼容
 *
 * 项目的 ColorConfig 支持：
 * 1. 简单模式：`{ color: '#FF0000' }`
 * 2. 主题色模式（完整）：`{ color: '#FF0000', themeColor: { color: '#FF0000', type: 'accent1' } }`
 * 3. 主题色模式（简化）：`{ color: '#FF0000', colorType: 'accent1', colorIndex: 1 }`
 *
 * @example
 * ```typescript
 * // 简单模式
 * const color1: V1ColorConfig = { color: '#FF0000' };
 *
 * // 主题色模式（完整版）
 * const color2: V1ColorConfig = {
 *   color: '#FF0000',
 *   themeColor: {
 *     color: '#FF0000',
 *     type: 'accent1'
 *   }
 * };
 *
 * // 主题色模式（简化版）
 * const color3: V1ColorConfig = {
 *   color: '#FF0000',
 *   colorType: 'accent1',
 *   colorIndex: 1,
 *   opacity: 0.8
 * };
 * ```
 */
export type V1ColorConfig = ColorConfig;

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
  themeColor?: V1ColorConfig;  // 使用项目的颜色系统和字段名（可选，适配器会处理转换）
}

// V1项目中的描边类型 - 基于适配文档的完全重定义模式
export interface V1PPTElementOutline {
  style?: "dashed" | "solid" | "dotted";  // 支持所有线条样式
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
  // 项目扩展：元素链接（支持页面跳转等）
  link?: PPTElementLink;
}

// ============ 文本内容相关类型（项目扩展）============

/**
 * HTML 元素属性
 */
export interface ElementAttribute {
  key: string;
  value: string | null;
}

/**
 * 文本内容 JSON 结构（递归类型）
 *
 * 用于表示富文本的结构化内容，支持嵌套
 */
export interface TextContentJson {
  type: string;
  attributes?: ElementAttribute[];
  style?: { [key: string]: string };
  content?: TextContentJson[];
  text?: string;
}

/**
 * 文本内容类型
 *
 * - string: 简单文本或 HTML 字符串（默认，项目内部使用）
 * - TextContentJson[]: 结构化的富文本内容（Mock 数据、API 交互）
 */
export type TextContent = string | TextContentJson[];

// V1兼容文本元素（泛型版本）
export interface V1CompatibleTextElement<TContent extends TextContent = string> extends V1CompatibleBaseElement {
  type: "text";
  /**
   * 文本内容
   *
   * 通过泛型参数 TContent 指定具体类型：
   * - V1CompatibleTextElement<string>: 默认，项目内部使用
   * - V1CompatibleTextElement<TextContentJson[]>: Mock/API 数据
   * - V1CompatibleTextElement: 默认为 string
   */
  content: TContent;
  defaultFontName: string;
  defaultColor: V1ColorConfig;    // V1格式：ColorConfig对象
  themeFill?: V1ColorConfig;      // V1格式：ColorConfig对象
  lineHeight?: number;
  wordSpace?: number;
  opacity?: number;
  paragraphSpace?: number;
  vertical?: boolean;
  valign?: 'middle' | 'top' | 'bottom';
  fit?: 'none' | 'shrink' | 'resize';
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
  // 项目扩展属性（可选）
  text?: any;                     // 形状内文本配置
  pathFormula?: ShapePathFormulaValue;  // 路径公式值（如 'roundRect' | 'triangle' | ...）
}

// V1兼容图片元素
export interface V1CompatibleImageElement extends V1CompatibleBaseElement {
  type: "image";
  src: string;
  size?: string;                  // V1特有
  loading?: boolean;              // V1特有：UI状态
  // 项目扩展属性（可选）
  fixedRatio?: boolean;           // 固定宽高比
  outline?: V1PPTElementOutline;  // 边框
  filters?: any;                  // CSS滤镜
  clip?: any;                     // 裁剪配置
  flipH?: boolean;                // 水平翻转
  flipV?: boolean;                // 垂直翻转
  shadow?: V1PPTElementShadow;    // 阴影
  colorMask?: string;             // 颜色蒙版
}

// V1兼容线条元素
export interface V1CompatibleLineElement extends Omit<V1CompatibleBaseElement, 'height' | 'rotate'> {
  type: "line";
  start: [number, number];
  end: [number, number];
  themeColor: V1ColorConfig;      // V1格式：ColorConfig对象
  lineWidth?: number;             // 重命名避免与基类width冲突
  style?: string;
  // 项目扩展属性（可选）
  points: ["dot" | "arrow" | "", "dot" | "arrow" | ""];      // 端点样式 ("", "arrow", "dot")
  shadow?: V1PPTElementShadow;    // 阴影
  broken?: [number, number];      // 折线控制点
  curve?: [number, number];       // 二次曲线控制点
  cubic?: [[number, number], [number, number]]; // 三次曲线控制点
  // LineElement 创建时 height 和 rotate 为可选
  height?: number;
  rotate?: number;
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
   * 项目扩展：改为可选，因为项目使用 themeColor（单数）
   */
  themeColors?: string[];

  /**
   * 图表主题色数组（向后兼容别名）
   *
   * @deprecated 建议使用 themeColors（复数）替代
   *
   * 为了向后兼容保留此字段，允许项目代码继续使用 themeColor（单数）
   * 新代码应该使用 themeColors（复数）
   */
  themeColor: string[];

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

// ============ V1 表格元素类型 ============

/**
 * 表格单元格样式
 */
export interface V1TableCellStyle {
  bold?: boolean;
  em?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  themeColor?: V1ColorConfig;
  themeBackcolor?: V1ColorConfig;
  fontsize?: string;
  fontname?: string;
  align?: "left" | "center" | "right" | "justify";
}

/**
 * 表格单元格
 */
export interface V1TableCell {
  id: string;
  colspan: number;
  rowspan: number;
  text: string;
  style?: V1TableCellStyle;
}

/**
 * 表格主题
 */
export interface V1TableTheme {
  themeColor: V1ColorConfig;
  rowHeader: boolean;
  rowFooter: boolean;
  colHeader: boolean;
  colFooter: boolean;
}

/**
 * V1 兼容的表格元素
 */
export interface V1CompatibleTableElement extends V1CompatibleBaseElement {
  type: "table";
  outline: V1PPTElementOutline;
  theme?: V1TableTheme;
  colWidths: number[];
  cellMinHeight: number;
  data: V1TableCell[][];
}

// ============ V1 LaTeX 元素类型 ============

/**
 * V1 兼容的 LaTeX 元素（公式）
 */
export interface V1CompatibleLatexElement extends V1CompatibleBaseElement {
  type: "latex";
  latex: string;
  path: string;
  themeColor: V1ColorConfig;
  strokeWidth: number;
  viewBox: [number, number];
  fixedRatio: boolean;
}

// ============ V1 媒体元素类型 ============

/**
 * V1 兼容的视频元素
 */
export interface V1CompatibleVideoElement extends V1CompatibleBaseElement {
  type: "video";
  src: string;
  autoplay: boolean;
  poster?: string;
  ext?: string;
}

/**
 * V1 兼容的音频元素
 */
export interface V1CompatibleAudioElement extends V1CompatibleBaseElement {
  type: "audio";
  fixedRatio: boolean;
  themeColor: V1ColorConfig;
  /** 项目扩展：图标颜色（字符串） */
  color?: string;
  loop: boolean;
  autoplay: boolean;
  src: string;
  ext?: string;
}

// V1兼容联合类型（泛型版本）
export type V1CompatiblePPTElement<TContent extends TextContent = string> =
  | V1CompatibleTextElement<TContent>
  | V1CompatibleShapeElement
  | V1CompatibleImageElement
  | V1CompatibleLineElement
  | V1CompatibleChartElement
  | V1CompatibleTableElement
  | V1CompatibleLatexElement
  | V1CompatibleVideoElement
  | V1CompatibleAudioElement
  | V1PPTNoneElement;

// V1文本元素的多种变体（项目特有设计）
/**
 * V1 文本元素基础接口（泛型版本）
 *
 * @template TContent - 文本内容类型，默认为 string
 *
 * @example
 * ```typescript
 * // 默认使用 string
 * const textBase: V1PPTTextElementBase = {
 *   type: "text",
 *   content: "Hello",
 *   defaultFontName: "Arial",
 *   // ... 其他基础属性
 * };
 *
 * // 使用 TextContentJson[]
 * const richTextBase: V1PPTTextElementBase<TextContentJson[]> = {
 *   type: "text",
 *   content: [{ type: "paragraph", children: [...] }],
 *   defaultFontName: "Arial",
 *   // ... 其他基础属性
 * };
 * ```
 */
export interface V1PPTTextElementBase<TContent extends TextContent = string> extends V1CompatibleBaseElement {
  type: "text";
  content: TContent;
  defaultFontName: string;
}

/**
 * V1 文本元素（项目内部使用）
 *
 * @template TContent - 文本内容类型，默认为 string
 */
export interface V1PPTTextElement<TContent extends TextContent = string> extends V1PPTTextElementBase<TContent> {
  defaultColor: V1ColorConfig;
  themeFill?: V1ColorConfig;
  enableShrink?: boolean;
}

/**
 * V1 文本元素 API 版本
 *
 * @template TContent - 文本内容类型，默认为 string
 *
 * API 版本使用简单的 string 类型表示颜色，而非 ColorConfig 对象
 */
export interface V1PPTTextElementApi<TContent extends TextContent = string> extends V1PPTTextElementBase<TContent> {
  defaultColor: V1ColorConfig;    // V1格式：ColorConfig对象
  themeFill?: V1ColorConfig;       // V1格式：ColorConfig对象
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

// ============ V1 兼容的 Slide 类型 ============

/**
 * 导入项目扩展类型（用于 Slide）
 */
import type {
  PageTag,
  AIImageStatus,
  TemplatePayType
} from '../extensions/project-extended.js';
import { ShapePathFormulasKeys } from '../enums/shape.js';

/**
 * 翻页模式
 */
export type TurningMode =
  | 'no'          // 无动画
  | 'fade'        // 淡入淡出
  | 'slideX'      // 水平滑动
  | 'slideY'      // 垂直滑动
  | 'slideX3D'    // 3D水平滑动
  | 'slideY3D'    // 3D垂直滑动
  | 'random'      // 随机模式
  | 'rotate'      // 旋转
  | 'scale'       // 缩放
  | 'scaleReverse'// 反向缩放
  | 'scaleX'      // 水平缩放
  | 'scaleY';     // 垂直缩放

/**
 * V1 兼容的幻灯片背景 - 纯色
 *
 * 注意：为了支持项目中的解构语法，所有背景类型都包含所有可能的属性
 * 通过 type 字段区分实际使用的属性
 */
export interface V1SolidBackground {
  type: "solid";
  /** 纯色背景的主题色（必需） */
  themeColor: V1ColorConfig;
  /** 兼容标准的 color 字段 */
  color?: V1ColorConfig;
  // 以下属性在纯色背景中不使用，但为了支持联合类型解构而添加
  image?: string;
  value?: string;
  imageSize?: string;
  gradientType?: "linear" | "radial";
  gradientColor?: [V1ColorConfig, V1ColorConfig];
  gradientRotate?: number;
}

/**
 * V1 兼容的幻灯片背景 - 图片
 */
export interface V1ImageBackground {
  type: "image";
  /** 图片URL（可选，允许初始化时不提供） */
  image?: string;
  /** 兼容标准的 value 字段 */
  value?: string;
  /** 图片尺寸模式: cover | contain | repeat */
  imageSize?: string;
  /** 图片背景的主题色（可选，用于遮罩或边框） */
  themeColor?: V1ColorConfig;
  // 以下属性在图片背景中不使用，但为了支持联合类型解构而添加
  color?: V1ColorConfig;
  gradientType?: "linear" | "radial";
  gradientColor?: [V1ColorConfig, V1ColorConfig];
  gradientRotate?: number;
}

/**
 * V1 兼容的幻灯片背景 - 渐变
 */
export interface V1GradientBackground {
  type: "gradient";
  /** 渐变类型：线性或径向 */
  gradientType?: "linear" | "radial";
  /** 渐变颜色（双色） */
  gradientColor?: [V1ColorConfig, V1ColorConfig];
  /** 渐变旋转角度（0-360） */
  gradientRotate?: number;
  // 以下属性在渐变背景中不使用，但为了支持联合类型解构而添加
  themeColor?: V1ColorConfig;
  color?: V1ColorConfig;
  image?: string;
  value?: string;
  imageSize?: string;
}

/**
 * V1 兼容的幻灯片背景类型（联合）
 */
export type V1SlideBackground =
  | V1SolidBackground
  | V1ImageBackground
  | V1GradientBackground;

/**
 * V1 兼容的幻灯片基础类型（泛型版本）
 *
 * 包含项目所需的所有扩展字段
 *
 * @template TContent - 文本元素的内容类型，默认为 string
 */
export interface V1SlideBase<TContent extends TextContent = string> {
  /** 幻灯片唯一标识 */
  id: string;

  /** 幻灯片元素列表 - 使用 V1 兼容元素类型 */
  elements: V1CompatiblePPTElement<TContent>[];

  /** 背景配置 */
  background?: V1SlideBackground;

  /** 页面ID（用于模板关联） */
  pageId?: string;

  /** 页面标签（cover/catalog/list/content/end等） */
  tag?: PageTag;

  /** 备注信息 */
  remark?: string;

  /** AI图片生成状态 */
  aiImageStatus?: AIImageStatus;

  /** 翻页模式 */
  turningMode?: TurningMode;

  /** 付费类型 */
  payType?: TemplatePayType;

  /** 动画配置 */
  animations?: any[];

  /** 项目扩展：AI图片标记 */
  aiImage?: boolean;

  /** 项目扩展：列表页计数（适用于所有 slide 类型，不仅限于 list tag） */
  listCount?: number;

  /** 项目扩展：填充页面类型 */
  fillPageType?: number;

  /** 项目扩展：备注/评论列表 */
  notes?: Array<{
    id: string;
    content: string;
    time: number;
    user: string;
    elId?: string;
    replies?: Array<{
      id: string;
      content: string;
      time: number;
      user: string;
    }>;
  }>;
}

/**
 * V1 兼容的列表页幻灯片基础类型（泛型版本）
 *
 * @template TContent - 文本元素的内容类型，默认为 string
 */
export interface V1SlideListBase<TContent extends TextContent = string> extends V1SlideBase<TContent> {
  /** 明确标记为列表页 */
  tag: "list";

  /** 列表项数量 */
  listCount?: number;

  /** 列表级别 */
  listLevel?: number;

  /** 项目扩展：列表标记 */
  listFlag?: string;

  /** 项目扩展：自动填充 */
  autoFill?: boolean;
}

/**
 * V1 兼容的普通幻灯片（泛型版本）
 *
 * @template TContent - 文本元素的内容类型，默认为 string
 */
export type V1SlideNormal<TContent extends TextContent = string> = V1SlideBase<TContent> & {
  elements: V1CompatiblePPTElement<TContent>[];
};

/**
 * V1 兼容的列表页幻灯片（泛型版本）
 *
 * @template TContent - 文本元素的内容类型，默认为 string
 */
export type V1SlideList<TContent extends TextContent = string> = V1SlideListBase<TContent> & {
  elements: V1CompatiblePPTElement<TContent>[];
};

/**
 * V1 兼容的幻灯片类型（联合类型，泛型版本）
 *
 * 包含普通幻灯片和列表幻灯片两种类型
 *
 * @template TContent - 文本元素的内容类型，默认为 string
 * - V1Slide: 默认为 string，项目内部使用
 * - V1Slide<TextContentJson[]>: Mock/API 数据使用
 *
 * @example
 * ```typescript
 * import type { V1Slide, TextContentJson } from '@douglasdong/ppteditor-types/v1-compat';
 *
 * // 项目内部使用（默认 string）
 * const slide: V1Slide = {
 *   id: 'slide-1',
 *   elements: [],
 *   background: { type: 'solid', themeColor: { color: '#FFFFFF' } }
 * };
 *
 * // Mock 数据使用（TextContentJson[]）
 * const mockSlide: V1Slide<TextContentJson[]> = {
 *   id: 'slide-1',
 *   elements: [{
 *     type: 'text',
 *     content: [{ type: 'p', text: 'Hello' }],
 *     // ...
 *   }]
 * };
 * ```
 */
export type V1Slide<TContent extends TextContent = string> = V1SlideNormal<TContent> | V1SlideList<TContent>;

/**
 * 类型守卫：检查幻灯片是否为列表页
 *
 * @param slide - 要检查的幻灯片
 * @returns 如果是列表页返回 true，否则返回 false
 *
 * @example
 * ```typescript
 * import { isV1SlideList } from '@douglasdong/ppteditor-types/v1-compat';
 *
 * if (isV1SlideList(slide)) {
 *   console.log('List count:', slide.listCount);
 * }
 * ```
 */
export function isV1SlideList(slide: V1Slide): slide is V1SlideList {
  return slide.tag === 'list';
}
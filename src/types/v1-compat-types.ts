/**
 * V1兼容类型定义
 * 用于支持现有V1项目的类型适配和迁移
 */

// V1项目中的颜色配置类型
export interface V1ColorConfig {
  color: string;
  themeColor: string;
}

// V1项目中的渐变类型
export interface V1ShapeGradient {
  type: "linear" | "radial";
  themeColor: [V1ColorConfig, V1ColorConfig];
  rotate: number;
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
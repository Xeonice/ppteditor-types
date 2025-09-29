/**
 * V1兼容类型定义
 * 用于支持现有V1项目的类型适配和迁移
 * 根据 v1-type-compatibility-adaptations.md 优化
 */

// 导入项目特有的主题颜色类型（如果需要）
export type ThemeColorType = string; // 项目特定的主题颜色类型

// 优化的V1颜色配置类型 - 基于适配文档的字段扩展模式
export interface V1ColorConfig {
  color: string;                    // V1 必需字段
  themeColor?: string;             // V1 字段，项目中改为可选以适配现有代码
  colorType?: ThemeColorType;      // 项目扩展：主题色类型
  colorIndex?: number;             // 项目扩展：主题色索引
  opacity?: number;                // 项目扩展：透明度控制
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
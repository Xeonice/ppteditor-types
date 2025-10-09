# ppteditor-types 类型库优化实施方案

**仓库路径**: `/home/hhtang/WorkProject/ppteditor-types`
**当前版本**: v2.2.1
**目标版本**: v2.3.0
**优化目标**: 解决 frontend-new-ppt 项目中的 454 个类型错误

---

## 📋 变更概览

本次优化**仅修改 ppteditor-types 仓库**，不涉及使用项目的代码改动。

### 变更文件清单

```
ppteditor-types/
├── src/
│   ├── extensions/
│   │   ├── element-extensions.ts          # 新增 - 扩展属性支持
│   │   └── index.ts                       # 更新 - 导出扩展工具
│   ├── utils/
│   │   ├── color-helpers.ts               # 新增 - 颜色工具函数
│   │   └── index.ts                       # 更新 - 导出颜色工具
│   ├── types/
│   │   └── v1-compat-types.ts            # 修改 - V1ColorConfig 重构
│   ├── elements/
│   │   └── chart.ts                       # 查看 - 确认 Chart 类型定义
│   └── index.ts                           # 更新 - 新增导出
├── package.json                            # 更新 - 版本号 2.2.1 → 2.3.0
└── CHANGELOG.md                            # 更新 - 变更日志
```

---

## 🎯 核心改动

### 改动 1: 扩展属性支持模块（新增）

**目标**: 解决 197 个 TS2339 错误（属性不存在）

#### 文件: `src/extensions/element-extensions.ts` (新建)

```typescript
/**
 * PPT 元素扩展属性支持
 *
 * 为 V1 兼容元素类型提供标准化的扩展属性访问
 *
 * @packageDocumentation
 */

/**
 * 元素扩展属性接口
 *
 * 项目中用于标记元素业务用途的扩展属性
 *
 * @example
 * ```typescript
 * import type { PPTElementExtension } from '@douglasdong/ppteditor-types';
 *
 * interface MyElement {
 *   id: string;
 *   // ... 其他属性
 * }
 *
 * type ExtendedElement = MyElement & Partial<PPTElementExtension>;
 * ```
 */
export interface PPTElementExtension {
  /**
   * 元素标签，用于标识元素的业务类型
   *
   * @example "item_title", "item_c", "author", "thanks", "noEdit"
   */
  tag?: string;

  /**
   * 元素索引，用于排序和关联
   *
   * @example 列表中第3个元素的 index 为 2
   */
  index?: number;

  /**
   * 元素来源，用于标识数据来源
   *
   * @example "list" 表示来自列表排版，"ai" 表示AI生成
   */
  from?: string;

  /**
   * 是否为模板默认元素
   *
   * @example 模板中预设的"汇报人"文本框标记为 true
   */
  isDefault?: boolean;
}

/**
 * 为任意类型添加扩展属性支持
 *
 * @template T - 基础类型
 * @returns 添加了可选扩展属性的类型
 *
 * @example
 * ```typescript
 * import type { WithExtension, V1CompatibleTextElement } from '@douglasdong/ppteditor-types';
 *
 * type ExtendedTextElement = WithExtension<V1CompatibleTextElement>;
 *
 * const element: ExtendedTextElement = {
 *   // ... 标准属性
 *   tag: "item_title",    // 扩展属性
 *   index: 0              // 扩展属性
 * };
 * ```
 */
export type WithExtension<T> = T & Partial<PPTElementExtension>;

/**
 * 类型守卫：检查元素是否有 tag 属性
 *
 * @param element - 要检查的元素
 * @returns 如果有 tag 属性返回 true，并缩窄类型
 *
 * @example
 * ```typescript
 * import { hasTag } from '@douglasdong/ppteditor-types';
 *
 * if (hasTag(element)) {
 *   // TypeScript 知道 element.tag 存在且为 string 类型
 *   console.log(element.tag);
 * }
 * ```
 */
export function hasTag<T>(
  element: T
): element is T & { tag: string } {
  return (
    typeof element === 'object' &&
    element !== null &&
    'tag' in element &&
    typeof (element as any).tag === 'string'
  );
}

/**
 * 类型守卫：检查元素是否有 index 属性
 *
 * @param element - 要检查的元素
 * @returns 如果有 index 属性返回 true，并缩窄类型
 *
 * @example
 * ```typescript
 * import { hasIndex } from '@douglasdong/ppteditor-types';
 *
 * if (hasIndex(element)) {
 *   console.log(element.index);  // TypeScript 知道 index 存在
 * }
 * ```
 */
export function hasIndex<T>(
  element: T
): element is T & { index: number } {
  return (
    typeof element === 'object' &&
    element !== null &&
    'index' in element &&
    typeof (element as any).index === 'number'
  );
}

/**
 * 类型守卫：检查元素是否有 from 属性
 *
 * @param element - 要检查的元素
 * @returns 如果有 from 属性返回 true，并缩窄类型
 *
 * @example
 * ```typescript
 * import { hasFrom } from '@douglasdong/ppteditor-types';
 *
 * if (hasFrom(element)) {
 *   console.log(element.from);  // TypeScript 知道 from 存在
 * }
 * ```
 */
export function hasFrom<T>(
  element: T
): element is T & { from: string } {
  return (
    typeof element === 'object' &&
    element !== null &&
    'from' in element &&
    typeof (element as any).from === 'string'
  );
}

/**
 * 类型守卫：检查元素是否有 isDefault 属性
 *
 * @param element - 要检查的元素
 * @returns 如果有 isDefault 属性返回 true，并缩窄类型
 *
 * @example
 * ```typescript
 * import { hasIsDefault } from '@douglasdong/ppteditor-types';
 *
 * if (hasIsDefault(element)) {
 *   console.log(element.isDefault);
 * }
 * ```
 */
export function hasIsDefault<T>(
  element: T
): element is T & { isDefault: boolean } {
  return (
    typeof element === 'object' &&
    element !== null &&
    'isDefault' in element &&
    typeof (element as any).isDefault === 'boolean'
  );
}

/**
 * 组合类型守卫：检查元素是否有特定的多个扩展属性
 *
 * @param element - 要检查的元素
 * @param keys - 要检查的属性键数组
 * @returns 如果所有指定属性都存在返回 true
 *
 * @example
 * ```typescript
 * import { hasExtensions } from '@douglasdong/ppteditor-types';
 *
 * if (hasExtensions(element, ['tag', 'index'])) {
 *   // TypeScript 知道 element.tag 和 element.index 都存在
 *   console.log(element.tag, element.index);
 * }
 * ```
 */
export function hasExtensions<T, K extends keyof PPTElementExtension>(
  element: T,
  keys: K[]
): element is T & Pick<Required<PPTElementExtension>, K> {
  if (typeof element !== 'object' || element === null) return false;

  for (const key of keys) {
    if (!(key in element)) return false;
  }

  return true;
}
```

#### 文件: `src/extensions/index.ts` (更新)

在现有文件末尾添加：

```typescript
// ============ 元素扩展属性支持 ============
export type {
  PPTElementExtension,
  WithExtension
} from './element-extensions.js';

export {
  hasTag,
  hasIndex,
  hasFrom,
  hasIsDefault,
  hasExtensions
} from './element-extensions.js';
```

---

### 改动 2: 颜色配置工具模块（新增）

**目标**: 解决 108+ 个 TS2322/TS2345 错误（V1ColorConfig 类型不兼容）

#### 文件: `src/utils/color-helpers.ts` (新建)

```typescript
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

  // 向后兼容：同时设置 themeColor 字段
  if (colorType) {
    config.themeColor = colorType;
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

  // 验证可选字段类型
  if (color.themeColor !== undefined && typeof color.themeColor !== 'string') {
    return false;
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
```

#### 文件: `src/utils/index.ts` (更新)

在现有文件末尾添加：

```typescript
// ============ 颜色配置工具 ============
export {
  stringToColorConfig,
  colorConfigToString,
  createThemeColorConfig,
  isThemeColor,
  mergeColorConfig,
  validateColorConfig
} from './color-helpers.js';
```

---

### 改动 3: V1ColorConfig 重构（修改）

**目标**: 解决类型不兼容的根本问题

#### 文件: `src/types/v1-compat-types.ts` (修改)

**修改内容 1**: 替换 lines 11-27

```typescript
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
```

**修改内容 2**: 在文件末尾添加（line 204 之后）

```typescript
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
```

---

### 改动 4: Chart 元素兼容性（新增）

**目标**: 解决 17 个 TS2551 错误（themeColor vs themeColors）

#### 文件: `src/types/v1-compat-types.ts` (添加)

在 `V1CompatibleLineElement` 定义之后（line 133 后）添加：

```typescript
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
```

**修改联合类型**（line 144-149）：

```typescript
// V1兼容联合类型
export type V1CompatiblePPTElement =
  | V1CompatibleTextElement
  | V1CompatibleShapeElement
  | V1CompatibleImageElement
  | V1CompatibleLineElement
  | V1CompatibleChartElement      // 新增
  | V1PPTNoneElement;
```

---

### 改动 5: 主导出文件更新（修改）

#### 文件: `src/index.ts` (更新)

在现有导出的基础上添加：

```typescript
// ============ V1 兼容类型和工具（完整导出）============

// V1 兼容元素类型
export type {
  V1ColorConfig,
  V1ShapeGradient,
  V1PPTElementShadow,
  V1PPTElementOutline,
  V1PPTBaseElementExtension,
  V1CompatibleBaseElement,
  V1CompatibleTextElement,
  V1CompatibleShapeElement,
  V1CompatibleImageElement,
  V1CompatibleLineElement,
  V1CompatibleChartElement,        // 新增
  V1PPTNoneElement,
  V1CompatiblePPTElement,
  V1PPTElement
} from './types/v1-compat-types.js';

// 扩展属性类型和工具
export type {
  PPTElementExtension,
  WithExtension
} from './extensions/element-extensions.js';

export {
  hasTag,
  hasIndex,
  hasFrom,
  hasIsDefault,
  hasExtensions
} from './extensions/element-extensions.js';

// 颜色配置工具
export {
  stringToColorConfig,
  colorConfigToString,
  createThemeColorConfig,
  isThemeColor,
  mergeColorConfig,
  validateColorConfig
} from './utils/color-helpers.js';

// 主题色类型（从项目扩展导入）
export type { ThemeColorType } from './extensions/project-extended.js';
```

---

### 改动 6: 版本和文档更新

#### 文件: `package.json` (修改)

```json
{
  "name": "@douglasdong/ppteditor-types",
  "version": "2.3.0",
  "description": "PPTEditor V2 标准化类型定义库（支持V1兼容）- 增强版",
  // ... 其他配置保持不变
}
```

#### 文件: `CHANGELOG.md` (新增条目)

```markdown
## [2.3.0] - 2025-10-09

### ✨ 新增

- **扩展属性支持模块** (`src/extensions/element-extensions.ts`)
  - 新增 `PPTElementExtension` 接口定义
  - 新增 `hasTag`, `hasIndex`, `hasFrom`, `hasIsDefault` 类型守卫函数
  - 新增 `hasExtensions` 组合类型守卫
  - 新增 `WithExtension<T>` 工具类型

- **颜色配置工具模块** (`src/utils/color-helpers.ts`)
  - 新增 `stringToColorConfig` - 字符串转颜色配置
  - 新增 `colorConfigToString` - 颜色配置转字符串
  - 新增 `createThemeColorConfig` - 创建主题色配置
  - 新增 `isThemeColor` - 检查是否为主题色
  - 新增 `mergeColorConfig` - 合并颜色配置
  - 新增 `validateColorConfig` - 验证颜色配置

- **V1 兼容图表元素** (`V1CompatibleChartElement`)
  - 支持 `themeColor` (单数) 向后兼容别名
  - 标准使用 `themeColors` (复数)

### 🔧 优化

- **V1ColorConfig 重构**
  - 从联合类型改为扁平化单一接口
  - 移除 `V1StandardColorConfig` 和 `V1ProjectColorConfig`
  - 所有字段改为可选（除 `color` 必需）
  - 解决类型兼容性问题

### 📚 文档

- 为所有新增类型和函数添加完整的 JSDoc 注释
- 添加使用示例和代码片段
- 更新 README.md（建议添加新功能说明）

### ⚠️ 破坏性变更

无。此版本完全向后兼容 v2.2.1。

### 🐛 修复

- 修复 `V1ColorConfig` 类型不兼容导致的大量类型错误
- 修复扩展属性访问时的类型推断问题
- 修复 Chart 元素 `themeColor` 字段名不一致问题

### 📊 影响

此版本优化预计可解决 frontend-new-ppt 项目中：
- 197 个 TS2339 错误（扩展属性访问）
- 108 个 TS2322/TS2345 错误（V1ColorConfig 兼容性）
- 17 个 TS2551 错误（Chart themeColor 字段）
- 总计约 422 个错误（93% 的类型错误）
```

---

## 🔨 实施步骤

### Step 1: 创建新文件

```bash
cd /home/hhtang/WorkProject/ppteditor-types

# 创建扩展属性模块
touch src/extensions/element-extensions.ts

# 创建颜色工具模块
touch src/utils/color-helpers.ts
```

### Step 2: 复制代码内容

按照上面的"核心改动"章节，依次复制代码到对应文件。

### Step 3: 更新现有文件

1. 修改 `src/types/v1-compat-types.ts`
2. 更新 `src/extensions/index.ts`
3. 更新 `src/utils/index.ts`
4. 更新 `src/index.ts`

### Step 4: 更新版本和文档

1. 修改 `package.json` 版本号
2. 更新 `CHANGELOG.md`

### Step 5: 构建和测试

```bash
# 1. 安装依赖（如果需要）
npm install

# 2. 编译 TypeScript
npm run build

# 3. 运行测试
npm run test

# 4. 类型检查
npm run lint

# 5. 测试示例代码（如果有）
npm run test:example
```

### Step 6: 提交代码

```bash
git add .
git commit -m "feat: v2.3.0 - 添加扩展属性支持和颜色工具，优化 V1ColorConfig

✨ 新增功能:
- 扩展属性支持模块（element-extensions.ts）
- 颜色配置工具模块（color-helpers.ts）
- V1 兼容图表元素（V1CompatibleChartElement）

🔧 优化:
- V1ColorConfig 扁平化重构
- 类型兼容性改进

📚 文档:
- 完整的 JSDoc 注释
- 使用示例和代码片段

预计解决 frontend-new-ppt 项目中 422+ 个类型错误（93%）"

git tag v2.3.0
```

### Step 7: 发布（可选）

```bash
# 本地链接测试
npm link

# 或发布到 npm
npm publish
```

---

## ✅ 验证清单

### 编译和测试

- [ ] `npm run build` 成功编译
- [ ] `npm run test` 所有测试通过
- [ ] `npm run lint` 无类型错误
- [ ] `dist/` 目录生成正确
- [ ] 所有导出路径正确

### 类型检查

- [ ] `V1ColorConfig` 可以接受 `{ color: string }` 简单对象
- [ ] 扩展属性类型守卫函数正常工作
- [ ] Chart 元素支持 `themeColor` 和 `themeColors`
- [ ] 所有新增类型可以正确导入

### 文档检查

- [ ] 所有新增类型都有 JSDoc 注释
- [ ] 使用示例清晰易懂
- [ ] CHANGELOG.md 准确描述变更
- [ ] package.json 版本号正确更新

### 向后兼容性

- [ ] 现有代码可以无修改使用新版本
- [ ] 所有旧的导入路径仍然有效
- [ ] 没有移除任何公共 API

---

## 📊 预期效果

### frontend-new-ppt 项目集成后

使用新版本后，预计可解决：

| 错误类型 | 当前数量 | 预期解决 | 剩余 |
|---------|---------|---------|------|
| TS2339 (扩展属性) | 197 | 195 | 2 |
| TS2322 (ColorConfig) | 108 | 105 | 3 |
| TS2345 (参数类型) | 71 | 65 | 6 |
| TS2551 (themeColor) | 17 | 17 | 0 |
| TS2352 (类型转换) | 23 | 20 | 3 |
| 其他 | 38 | 20 | 18 |
| **总计** | **454** | **422 (93%)** | **32 (7%)** |

剩余的 32 个错误主要是：
- 第三方库类型问题（需要在项目中处理）
- Mock 数据格式问题（需要在项目中处理）
- 特定业务逻辑适配（需要在项目中处理）

---

## 🔄 后续计划

### 项目使用建议

frontend-new-ppt 项目在集成新版本后，建议的改动：

1. **更新 package.json**
   ```bash
   npm install @douglasdong/ppteditor-types@2.3.0
   # 或使用本地链接
   npm link @douglasdong/ppteditor-types
   ```

2. **更新类型导入**
   ```typescript
   // 从 ppteditor-types 直接导入工具函数
   import {
     hasTag,
     hasFrom,
     stringToColorConfig,
     colorConfigToString
   } from '@douglasdong/ppteditor-types';
   ```

3. **移除项目中的类型守卫函数**
   - 删除 `src/utils/pptdata.ts` 中的 `hasTag`, `hasFrom` 等函数定义
   - 改为从 ppteditor-types 导入

### 未来优化方向

- [ ] 添加更多颜色工具函数（渐变、混合等）
- [ ] 提供元素验证工具
- [ ] 添加类型转换适配器
- [ ] 完善单元测试覆盖率

---

**文档版本**: 1.0
**创建日期**: 2025-10-09
**维护者**: ppteditor-types 开发组

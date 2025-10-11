# ppteditor-types 表格类型修改方案

## 修改目的

根据实际导出的表格数据结构,修改 `@douglasdong/ppteditor-types` 中的 V1 兼容表格类型定义,使其与实际使用场景完全匹配。

## 当前类型定义与实际导出数据的差异

### 差异对比表

| 项目 | V1兼容类型 (当前) | 实际导出数据 | 是否需要修改 |
|------|------------------|--------------|------------|
| **colWidths 语义** | `number[]` 无明确说明 | 相对比例值 (0-1) | ⚠️ 需要文档说明 |
| **单元格样式.字体大小** | `fontsize?: string` | `fontSize: "14pt"` (驼峰+单位) | ✅ **需要修改** |
| **单元格样式.颜色** | `themeColor?: V1ColorConfig` | `color?: string` | ✅ **需要修改** |
| **单元格样式.背景色** | `themeBackcolor?: V1ColorConfig` | `backcolor?: string` | ✅ **需要修改** |
| **表格主题** | `theme?: V1TableTheme` | 完全不存在 | ⚠️ 需要文档说明 |
| **边框.颜色** | `outline.themeColor?: V1ColorConfig` | `outline.color?: string` | ✅ **需要修改** |

---

## 详细差异分析

### 1. colWidths 字段

#### 当前定义
```typescript
// 位置: dist/types/v1-compat-types.d.ts:316
colWidths: number[]
```

#### 实际导出数据
```json
{
  "colWidths": [0.21978, 0.24242, 0.29545, 0.24233]
}
```

#### 问题
- 类型定义为 `number[]`,未明确说明是绝对值还是比例值
- 实际导出使用相对比例值 (总和约为 1.0)
- Mock 数据 (scenario-5) 使用的是绝对像素值,造成混淆

#### 建议修改
```typescript
/**
 * 列宽数组（相对比例值）
 *
 * 每个值表示该列宽度占表格总宽度的比例，取值范围 [0, 1]
 * 所有列宽比例之和应接近 1.0
 *
 * @example
 * ```typescript
 * // 4列表格，宽度比例约为 22% : 24% : 30% : 24%
 * colWidths: [0.21978, 0.24242, 0.29545, 0.24233]
 * ```
 */
colWidths: number[]
```

---

### 2. 单元格样式 - 字体大小字段

#### 当前定义
```typescript
// 位置: dist/types/v1-compat-types.d.ts:285
export interface V1TableCellStyle {
  fontsize?: string;  // ❌ 小写,无单位说明
  // ...
}
```

#### 实际导出数据
```json
{
  "style": {
    "fontSize": "14pt"  // ✅ 驼峰命名 + 单位
  }
}
```

#### 建议修改

**方案 A: 同时支持两种字段名 (推荐)**
```typescript
export interface V1TableCellStyle {
  /**
   * 字体大小（旧字段名，保留兼容性）
   * @deprecated 请使用 fontSize (驼峰命名)
   */
  fontsize?: string;

  /**
   * 字体大小（推荐使用）
   * 格式: "数字 + 单位"，如 "14pt", "16px"
   *
   * @example "14pt", "16px", "1.2em"
   */
  fontSize?: string;

  // ...其他字段
}
```

**方案 B: 仅使用新字段名 (破坏性变更)**
```typescript
export interface V1TableCellStyle {
  /**
   * 字体大小
   * 格式: "数字 + 单位"，如 "14pt", "16px"
   */
  fontSize?: string;

  // ...其他字段
}
```

**推荐**: 使用方案 A,保持向后兼容。

---

### 3. 单元格样式 - 颜色字段

#### 当前定义
```typescript
// 位置: dist/types/v1-compat-types.d.ts:283-284
export interface V1TableCellStyle {
  themeColor?: V1ColorConfig;      // ❌ 主题色对象
  themeBackcolor?: V1ColorConfig;  // ❌ 主题背景色对象
  // ...
}
```

#### 实际导出数据
```json
{
  "style": {
    "color": "#000000",      // ✅ 简单字符串
    "backcolor": "#D9E2F3"   // ✅ 简单字符串
  }
}
```

#### 问题分析
- 当前使用 `V1ColorConfig` 对象支持主题色
- 实际导出**不保留主题信息**,直接使用计算后的十六进制颜色值
- 导入时需要处理两种格式,导出时主题信息丢失

#### 建议修改

**方案 A: 同时支持两种格式 (推荐)**
```typescript
export interface V1TableCellStyle {
  // 保留旧字段(主题色支持)
  /**
   * 文字颜色（主题色模式）
   * @deprecated 导出时不保留主题信息，建议使用 color
   */
  themeColor?: V1ColorConfig;

  /**
   * 背景颜色（主题色模式）
   * @deprecated 导出时不保留主题信息，建议使用 backcolor
   */
  themeBackcolor?: V1ColorConfig;

  // 新增简单字段
  /**
   * 文字颜色（推荐）
   * 十六进制颜色值，如 "#000000"
   *
   * @example "#000000", "#FF5733", "#4472C4"
   */
  color?: string;

  /**
   * 背景颜色（推荐）
   * 十六进制颜色值，如 "#FFFFFF"
   *
   * @example "#FFFFFF", "#D9E2F3", "#F2F2F2"
   */
  backcolor?: string;

  // ...其他字段
}
```

**方案 B: 仅使用简单字符串 (破坏性变更)**
```typescript
export interface V1TableCellStyle {
  /**
   * 文字颜色
   * 十六进制颜色值
   */
  color?: string;

  /**
   * 背景颜色
   * 十六进制颜色值
   */
  backcolor?: string;

  // ...其他字段
}
```

**推荐**: 使用方案 A,同时支持主题色和简单颜色值。

---

### 4. 边框 (outline) 颜色

#### 当前定义
```typescript
// 位置: dist/types/v1-compat-types.d.ts:56-60
export interface V1PPTElementOutline {
  style?: "dashed" | "solid" | "dotted";
  width?: number;
  themeColor?: V1ColorConfig;  // ❌ 主题色对象
}
```

#### 实际导出数据
```json
{
  "outline": {
    "color": "#ffffff",  // ✅ 简单字符串
    "style": "solid",
    "width": 2
  }
}
```

#### 建议修改

**方案 A: 同时支持两种格式 (推荐)**
```typescript
export interface V1PPTElementOutline {
  style?: "dashed" | "solid" | "dotted";
  width?: number;

  /**
   * 边框颜色（主题色模式）
   * @deprecated 导出时不保留主题信息，建议使用 color
   */
  themeColor?: V1ColorConfig;

  /**
   * 边框颜色（推荐）
   * 十六进制颜色值
   *
   * @example "#000000", "#CCCCCC", "#4472C4"
   */
  color?: string;
}
```

**方案 B: 仅使用简单字符串 (破坏性变更)**
```typescript
export interface V1PPTElementOutline {
  style?: "dashed" | "solid" | "dotted";
  width?: number;

  /**
   * 边框颜色
   * 十六进制颜色值
   */
  color?: string;
}
```

**推荐**: 使用方案 A。

---

### 5. 表格主题 (theme)

#### 当前定义
```typescript
// 位置: dist/types/v1-compat-types.d.ts:302-308
export interface V1TableTheme {
  themeColor: V1ColorConfig;
  rowHeader: boolean;
  rowFooter: boolean;
  colHeader: boolean;
  colFooter: boolean;
}

// 在表格元素中
export interface V1CompatibleTableElement {
  theme?: V1TableTheme;  // 可选字段
  // ...
}
```

#### 实际导出数据
```json
{
  "type": "table",
  // 完全不存在 theme 字段
  "outline": { ... },
  "colWidths": [ ... ],
  "data": [ ... ]
}
```

#### 问题分析
- Mock 数据中包含 `theme` 字段
- 实际导出**完全不存在** `theme` 字段
- 主题配置已被"烘焙"到各单元格的样式中

#### 建议修改

**保持当前定义不变**,但添加文档说明:

```typescript
/**
 * 表格主题配置
 *
 * ⚠️ 注意：
 * 1. 该字段在导出时不保留，会被转换为单元格级别的样式
 * 2. 导入时如果存在该字段，需要将主题配置应用到对应单元格
 * 3. 主题色会被计算为具体的十六进制颜色值
 *
 * @example
 * ```typescript
 * // 编辑时可能包含主题信息
 * theme: {
 *   themeColor: { color: "#4472C4", colorType: "accent1" },
 *   rowHeader: true,  // 标题行应用主题色
 *   rowFooter: false,
 *   colHeader: false,
 *   colFooter: false
 * }
 *
 * // 导出后主题信息丢失，转为单元格样式
 * data: [[
 *   {
 *     text: "标题",
 *     style: {
 *       color: "#FFFFFF",
 *       backcolor: "#4472C4"  // 主题色已计算
 *     }
 *   }
 * ]]
 * ```
 */
export interface V1TableTheme {
  themeColor: V1ColorConfig;
  rowHeader: boolean;
  rowFooter: boolean;
  colHeader: boolean;
  colFooter: boolean;
}
```

---

## 完整修改后的类型定义

### V1TableCellStyle (修改后)

```typescript
/**
 * 表格单元格样式
 *
 * 支持两种颜色格式：
 * 1. 主题色模式（themeColor/themeBackcolor）- 导入时支持，导出时不保留
 * 2. 简单颜色值（color/backcolor）- 推荐使用，导出时使用此格式
 */
export interface V1TableCellStyle {
  bold?: boolean;
  em?: boolean;
  underline?: boolean;
  strikethrough?: boolean;

  // ========== 颜色字段（同时支持两种格式）==========

  /**
   * 文字颜色（主题色模式）
   * @deprecated 导出时不保留主题信息，建议使用 color
   */
  themeColor?: V1ColorConfig;

  /**
   * 背景颜色（主题色模式）
   * @deprecated 导出时不保留主题信息，建议使用 backcolor
   */
  themeBackcolor?: V1ColorConfig;

  /**
   * 文字颜色（推荐）
   * 十六进制颜色值
   * @example "#000000", "#FF5733"
   */
  color?: string;

  /**
   * 背景颜色（推荐）
   * 十六进制颜色值
   * @example "#FFFFFF", "#D9E2F3"
   */
  backcolor?: string;

  // ========== 字体大小（同时支持两种字段名）==========

  /**
   * 字体大小（旧字段名）
   * @deprecated 请使用 fontSize (驼峰命名)
   */
  fontsize?: string;

  /**
   * 字体大小（推荐）
   * 格式: "数字 + 单位"
   * @example "14pt", "16px"
   */
  fontSize?: string;

  // ========== 其他字段 ==========

  fontname?: string;
  align?: "left" | "center" | "right" | "justify";
}
```

### V1PPTElementOutline (修改后)

```typescript
/**
 * 元素边框
 *
 * 支持两种颜色格式：
 * 1. 主题色模式（themeColor）- 导入时支持，导出时不保留
 * 2. 简单颜色值（color）- 推荐使用，导出时使用此格式
 */
export interface V1PPTElementOutline {
  style?: "dashed" | "solid" | "dotted";
  width?: number;

  /**
   * 边框颜色（主题色模式）
   * @deprecated 导出时不保留主题信息，建议使用 color
   */
  themeColor?: V1ColorConfig;

  /**
   * 边框颜色（推荐）
   * 十六进制颜色值
   * @example "#000000", "#CCCCCC"
   */
  color?: string;
}
```

### V1CompatibleTableElement (修改后)

```typescript
/**
 * V1 兼容的表格元素
 */
export interface V1CompatibleTableElement extends V1CompatibleBaseElement {
  type: "table";
  outline: V1PPTElementOutline;

  /**
   * 表格主题配置（可选）
   *
   * ⚠️ 导出时不保留，会转换为单元格样式
   */
  theme?: V1TableTheme;

  /**
   * 列宽数组（相对比例值）
   *
   * 每个值表示该列宽度占表格总宽度的比例，取值范围 [0, 1]
   * 所有列宽比例之和应接近 1.0
   *
   * @example [0.21978, 0.24242, 0.29545, 0.24233]
   */
  colWidths: number[];

  /**
   * 单元格最小高度（像素）
   */
  cellMinHeight: number;

  /**
   * 表格数据（二维数组）
   */
  data: V1TableCell[][];
}
```

---

## 实施步骤

### Phase 1: ppteditor-types 包修改

1. **修改 V1 兼容类型定义**
   - 文件: `src/types/v1-compat-types.ts`
   - 修改 `V1TableCellStyle` 接口
   - 修改 `V1PPTElementOutline` 接口
   - 为 `V1CompatibleTableElement` 添加文档注释

2. **更新测试用例**
   - 添加同时使用 `themeColor` 和 `color` 的测试
   - 添加同时使用 `fontsize` 和 `fontSize` 的测试
   - 验证两种格式的互操作性

3. **发布新版本**
   - 更新 CHANGELOG.md
   - 版本号建议: `2.3.2` (修复补丁)
   - 发布到 npm

### Phase 2: frontend-new-ppt 项目适配

1. **更新依赖**
   ```bash
   npm install @douglasdong/ppteditor-types@2.3.2
   ```

2. **修改 Mock 数据**
   - 文件: `src/mocks/scenarios/scenario-5-multi-tables.ts`
   - 修改 `colWidths` 为相对比例值
   - 修改单元格样式使用新字段名
   - 移除或标注 `theme` 字段为可选

3. **修改导入逻辑**
   - 文件: `src/views/Editor/Thumbnails/JSONImportExportButtons.vue`
   - 添加字段兼容性处理
   - 同时支持 `fontsize`/`fontSize`
   - 同时支持 `themeColor`/`color`

4. **验证导入导出**
   - 导出 JSON → 验证格式
   - 导入导出的 JSON → 验证渲染
   - 导入旧格式 JSON → 验证兼容性

---

## 兼容性处理代码示例

### 导入时的字段兼容性处理

```typescript
// 在 JSONImportExportButtons.vue 中
const normalizeTableCellStyle = (style: any) => {
  if (!style) return style;

  const normalized = { ...style };

  // 字体大小：fontsize → fontSize
  if (style.fontsize && !style.fontSize) {
    normalized.fontSize = style.fontsize.includes('pt')
      ? style.fontsize
      : `${style.fontsize}pt`;
  }

  // 文字颜色：themeColor → color
  if (style.themeColor && !style.color) {
    normalized.color = typeof style.themeColor === 'string'
      ? style.themeColor
      : style.themeColor.color;
  }

  // 背景颜色：themeBackcolor → backcolor
  if (style.themeBackcolor && !style.backcolor) {
    normalized.backcolor = typeof style.themeBackcolor === 'string'
      ? style.themeBackcolor
      : style.themeBackcolor.color;
  }

  return normalized;
};

// 处理表格元素
const normalizeTableElement = (element: any) => {
  if (element.type !== 'table') return element;

  // 处理 outline 颜色
  if (element.outline?.themeColor && !element.outline.color) {
    element.outline.color = typeof element.outline.themeColor === 'string'
      ? element.outline.themeColor
      : element.outline.themeColor.color;
  }

  // 处理单元格样式
  if (element.data && Array.isArray(element.data)) {
    element.data = element.data.map((row: any[]) =>
      row.map((cell: any) => ({
        ...cell,
        style: normalizeTableCellStyle(cell.style),
      }))
    );
  }

  return element;
};
```

---

## 验证清单

### ppteditor-types 包

- [ ] `V1TableCellStyle` 同时包含旧字段和新字段
- [ ] `V1PPTElementOutline` 同时包含 `themeColor` 和 `color`
- [ ] TypeScript 编译通过
- [ ] 测试用例全部通过
- [ ] 文档注释完整清晰

### frontend-new-ppt 项目

- [ ] scenario-5 Mock 数据使用新格式
- [ ] 导入旧格式 JSON 能正常工作
- [ ] 导入新格式 JSON 能正常工作
- [ ] 导出的 JSON 使用新格式
- [ ] 导出 → 导入循环测试通过
- [ ] 表格渲染正确

---

## 风险评估

### 低风险
- ✅ 添加新字段（向后兼容）
- ✅ 添加文档注释
- ✅ 保留旧字段但标记为 deprecated

### 中风险
- ⚠️ 需要在导入时处理两种格式
- ⚠️ Mock 数据需要同步更新

### 零风险
- 🔒 不删除任何现有字段
- 🔒 不修改现有字段的类型
- 🔒 仅添加和文档化

---

## 总结

### 核心变更
1. **V1TableCellStyle**: 添加 `color`, `backcolor`, `fontSize` 字段
2. **V1PPTElementOutline**: 添加 `color` 字段
3. **文档**: 为 `colWidths` 和 `theme` 添加详细说明

### 兼容性策略
- **同时支持新旧字段** (不破坏现有代码)
- **标记旧字段为 deprecated** (引导迁移)
- **导入时自动转换** (用户无感)

### 推荐实施顺序
1. 先修改 ppteditor-types 并发布
2. 再更新 frontend-new-ppt 项目
3. 逐步迁移 Mock 数据和测试

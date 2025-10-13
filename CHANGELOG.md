# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.5.0] - 2025-10-13

### ✨ 新增

- **表格单元格样式向后兼容性增强**
  - `V1TableCellStyle` 现在同时支持新旧两种格式
    - 新格式（推荐）：`color`, `backcolor`, `fontsize`（全小写）
    - 旧格式（兼容）：`themeColor`, `themeBackcolor`（标记为 @deprecated）
  - **修正 v2.4.0 的字段命名错误**：
    - v2.4.0 错误地使用了 `fontSize`（驼峰命名）
    - v2.5.0 修正为 `fontsize`（全小写），这才是实际 PPT 导出数据使用的字段名
    - 此修正符合 V2 标准类型定义（src/base/common.ts:134）
  - 明确文档说明：支持 `"14px"` 和 `"12pt"` 两种单位格式

### 🔧 修复

- **适配器增强**
  - 新增 `V1ToV2Adapter.convertTableCellStyle()` 方法
  - 新增 `V2ToV1Adapter.convertTableCellStyle()` 方法
  - 智能处理新旧格式混合场景，优先使用新格式

- **优先级规则明确**
  - 当 `color` 和 `themeColor` 同时存在时，优先使用 `color`
  - 当 `backcolor` 和 `themeBackcolor` 同时存在时，优先使用 `backcolor`
  - 当 `fontsize` 存在时使用 `fontsize`
  - 所有优先级规则已在 JSDoc 中明确文档化

### 🧪 测试

- **新增测试用例**
  - 添加 `tests/types/table-cell-style.test.ts` 测试文件
  - 覆盖新格式、旧格式、混合格式三种场景
  - 验证适配器转换的正确性和可逆性
  - 所有测试通过

### 📖 迁移指南

**⚠️ 重要变更：**此版本恢复了对旧格式的支持，使 v2.4.0 的破坏性变更变为渐进式迁移。

**推荐用法（新格式）：**
```typescript
// 表格单元格样式
{
  color: "#FFFFFF",           // 简单字符串
  backcolor: "#4472C4",       // 简单字符串
  fontsize: "14px"            // 全小写 + 单位
}
```

**仍然支持（旧格式）：**
```typescript
// 表格单元格样式
{
  themeColor: { color: "#FFFFFF", colorType: "lt1" },
  themeBackcolor: { color: "#4472C4", colorType: "accent1" },
  fontsize: "14px"
}
```

**混合格式（优先新格式）：**
```typescript
// 当同时存在时，优先使用 color/backcolor
{
  color: "#FFFFFF",                                           // ✅ 优先使用
  themeColor: { color: "#000000", colorType: "dk1" },        // ⚠️ 被忽略
  backcolor: "#4472C4",                                       // ✅ 优先使用
  themeBackcolor: { color: "#FFFFFF", colorType: "lt1" },    // ⚠️ 被忽略
  fontsize: "14px"
}
```

**向后兼容性保证：**
- ✅ v2.4.0 之前的旧代码无需修改即可继续工作
- ✅ 新代码推荐使用简洁的字符串格式
- ✅ 适配器会自动处理格式转换
- ⚠️ 旧格式字段已标记 `@deprecated`，建议逐步迁移

## [2.4.0] - 2025-10-11

### 💥 破坏性变更

- **表格类型重构：与实际导出数据完全匹配**
  - `V1TableCellStyle` 类型定义更新
    - 移除 `fontsize?: string`，改为 `fontSize?: string` (驼峰命名 + 单位，如 "14pt")
    - 移除 `themeColor?: V1ColorConfig`，改为 `color?: string` (十六进制颜色值)
    - 移除 `themeBackcolor?: V1ColorConfig`，改为 `backcolor?: string` (十六进制颜色值)

  - `V1PPTElementOutline` 类型定义更新
    - 移除 `themeColor?: V1ColorConfig`，改为 `color?: string` (十六进制颜色值)

### ✨ 新增

- **完善的文档注释**
  - 为 `V1CompatibleTableElement` 添加详细的字段说明
  - 为 `colWidths` 添加相对比例值的说明文档 (值域 [0, 1])
  - 为 `theme` 字段添加导出行为说明（导出时不保留，会转为单元格样式）

### 🔧 修复

- **适配器代码更新**
  - 更新 `V1ToV2Adapter.convertOutline()` 使用新的 `color` 字段
  - 更新 `V2ToV1Adapter.convertOutline()` 使用新的 `color` 字段
  - 移除对已弃用 `themeColor` 字段的依赖

- **测试用例更新**
  - 更新所有表格相关测试使用新字段名
  - 所有 220 个测试用例通过

### 📖 迁移指南

**⚠️ 重要提示：**这是一个破坏性变更版本。如果您的项目使用了表格元素，需要更新字段名。

**旧格式 (不再支持):**
```typescript
// 表格单元格样式
{
  fontsize: "14pt",
  themeColor: { color: "#000000" },
  themeBackcolor: { color: "#D9E2F3" }
}

// 边框
{
  outline: {
    themeColor: { color: "#ffffff" }
  }
}
```

**新格式 (必须使用):**
```typescript
// 表格单元格样式
{
  fontSize: "14pt",           // 驼峰命名
  color: "#000000",           // 简单字符串
  backcolor: "#D9E2F3"        // 简单字符串
}

// 边框
{
  outline: {
    color: "#ffffff"          // 简单字符串
  }
}
```

## [2.3.1] - 2025-10-11

### 🔧 修复

- **ColorConfig 类型迁移修复**
  - 修复了从 `{ themeColor: string }` 到 `{ themeColor?: { color: string, type: ThemeColorType } }` 的类型迁移问题
  - 更新了 V1ColorConfig 直接使用项目的 ColorConfig 定义，确保类型一致性
  - 改进了 `validateColorConfig()` 验证逻辑，正确处理新的 themeColor 对象格式
  - 修复了 `convertColor()` 优先级逻辑：color (非空) > themeColor > 默认值
  - 增强了 `createThemeColorConfig()` 的 null 安全检查和错误信息描述性

- **测试覆盖完善**
  - 新增 `tests/utils/color-helpers.test.ts` 颜色助手函数测试
  - 添加了 V1→V2→V1 轮转测试，确保转换的可逆性
  - 增加了边界情况和错误处理的测试覆盖
  - 所有 208 个测试用例通过

- **向后兼容性保证**
  - 适配器同时支持旧的字符串格式和新的对象格式 themeColor
  - 提供渐进式迁移的回退逻辑
  - 版本检测器无需 themeColor 字段即可正确识别 V1 元素

### 📖 迁移指南

如果您正在从旧版本的 ColorConfig 迁移，请注意以下变更：

**旧格式 (不再支持):**
```typescript
{
  color: "#ff0000",
  themeColor: "#ff0000"  // 字符串格式
}
```

**新格式:**
```typescript
{
  color: "#ff0000",
  themeColor: {  // 对象格式
    color: "#ff0000",
    type: "accent1"
  }
}
```

**自动迁移:**
- V1/V2 适配器会自动处理格式转换
- 使用 `createThemeColorConfig()` 创建新的主题色配置
- 使用 `validateColorConfig()` 验证配置有效性

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
- 更新导出路径和模块说明

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

## [2.2.1] - 2025-10-09

### Fixed
- **Type Definition Corrections**
  - Fixed `ColorConfig.colorType` field to use `ThemeColorType` instead of `ColorType` in `src/extensions/project-extended.ts`
  - Fixed `V1ProjectColorConfig.colorType` field to use `ThemeColorType` instead of `string` in `src/types/v1-compat-types.ts`
  - Updated runtime validation for `colorType` to correctly validate against `ThemeColorType` enum values
- **Enhanced Theme Color Support**
  - Added missing theme color types: `dk1`, `dk2`, `lt1`, `lt2` to `ThemeColorType` enum
  - These are the most commonly used theme colors in Office PPT (dark colors for text, light colors for backgrounds)
  - Added comprehensive documentation explaining Office Open XML color scheme structure

### Changed
- **Type System Improvements**
  - `ThemeColorType` now includes all 10 Office theme color types (6 accents + 4 dark/light colors)
  - `ColorConfig.colorType` now correctly represents theme color types rather than color format types
  - Updated JSDoc examples to demonstrate both full and simplified theme color configurations
  - `v1-compat-types.ts` now imports and re-exports `ThemeColorType` from `project-extended.ts` for consistency

### Documentation
- Enhanced inline documentation for `ThemeColorType` with Office Open XML reference
- Clarified the difference between `colorType` (simplified) and `themeColor.type` (full object) usage patterns

## [2.2.0] - 2025-10-09

### Added
- **Project Extension Types** for frontend-new-ppt project
  - `ProjectSlide` - Extended slide type with project-specific fields
  - `ProjectSlideList` - List page specific slide type
  - `ProjectSlideBackground` - Discriminated union for background types (solid/image/gradient)
  - `ColorConfig` - Enhanced color configuration with theme color support
  - `ColorType` - Type-safe color type enumeration (`theme`, `rgb`, `hsl`, `hex`, `custom`)
  - `ThemeColorType` - 10 theme color types (accent1-6, text1-2, background1-2)
  - `AIImageStatus` - AI image generation status tracking
  - `PageTag` - Page type tags (`cover`, `catalog`, `transition`, `list`, `content`, `end`)
- **Runtime Validation Functions**
  - `validateProjectSlide()` - Validate slide data from external sources
  - `validateColorConfig()` - Validate color configuration with range checks
  - `validateProjectSlideBackground()` - Validate background with type discrimination
- **Type Guard Functions**
  - `isProjectSlideList()` - Type guard for list slides with automatic type narrowing
- **Enhanced Validation**
  - Opacity range validation (0-1) in color configurations
  - Gradient rotation range validation (0-360 degrees)
  - ColorType enum validation
- **Comprehensive Documentation**
  - `PROJECT_EXTENSIONS.md` - 810-line documentation with migration guide
  - JSDoc examples for all major types
  - Usage patterns and best practices
- **Test Coverage**
  - 35+ boundary value tests
  - Tests for opacity, rotation, long strings, Unicode, special characters
  - Edge case tests for all validation functions
  - Total: 181 tests passing

### Changed
- Updated version to 2.2.0 in all configuration files
- Enhanced `ColorConfig` interface with type-safe `colorType` field
- Improved type safety using discriminated unions for `ProjectSlideBackground`

### Fixed
- Version string consistency across codebase (src/index.ts:136)

## [2.1.1] - 2025-09-30

### Added
- Optimized V1 type compatibility based on adaptation document
- Enhanced V1/V2 adapter with better type inference

### Changed
- Improved V1 compatibility layer for better interoperability
- Refined type definitions for V1 elements

### Fixed
- Minor compatibility issues with V1 element types
- Type inference improvements in adapter functions

## [2.1.0] - 2025-09-29

### Added
- **V1/V2 Dual Version Compatibility System**
  - V1 compatibility types (`V1ColorConfig`, `V1PPTElement`, etc.)
  - V2 standard types (current repository standard)
  - Bidirectional adapters (V1ToV2Adapter, V2ToV1Adapter)
  - Version detection utilities
  - Auto-adapter for seamless version handling
- **Unified Type System**
  - `UnifiedPPTElement` - Wrapper class for version-agnostic element handling
  - `UnifiedPPTElementCollection` - Collection management with version support
  - `VersionConversionUtils` - Batch conversion and compatibility checking
- **Middleware System**
  - Version detection middleware
  - Automatic conversion middleware
  - Validation middleware
  - Logging middleware
  - Composable middleware pipeline
- **Comprehensive Test Suite**
  - V1/V2 adapter tests
  - Unified types tests
  - Integration tests
  - Malformed data handling tests
  - Middleware tests
- **Documentation**
  - Migration guide for V1 to V2
  - Adapter usage examples
  - Middleware patterns
  - Best practices

### Changed
- Reorganized module structure for better version separation
- Enhanced export strategy with namespace exports
- Improved type inference across adapters

### Fixed
- Gradient conversion edge cases
- Color configuration handling for mixed versions
- Element type detection accuracy

## [1.0.0] - 2025-09-27

### Added
- **Initial Release** of @douglasdong/ppteditor-types
- Complete TypeScript type definitions for PPT Editor
- **Element Types**
  - Text elements with rich formatting
  - Image elements with cropping and filters
  - Shape elements with 100+ predefined paths
  - Line elements with various styles
  - Chart elements (bar, line, pie, etc.)
  - Table elements with cell formatting
  - LaTeX elements for mathematical formulas
  - Video elements with playback controls
  - Audio elements
- **Base Types**
  - Common properties (position, size, rotation, etc.)
  - Gradients (linear and radial)
  - Shadows and outlines
  - Links and hyperlinks
- **Slide Types**
  - Slide structure and layout
  - Background types (solid, image, gradient)
  - Theme and template support
  - Note and annotation support
- **Animation Types**
  - Animation configurations
  - Timing and easing functions
- **Enumerations**
  - Element types
  - Shape paths (100+ SVG paths)
  - Animation types
- **Module System**
  - ESM modules with `.js` extensions
  - Full TypeScript support with `.d.ts` files
  - Namespace exports for grouped imports
  - Tree-shakeable exports
- **Testing**
  - Type compatibility tests
  - Export completeness tests
  - Circular dependency checks
- **Documentation**
  - Comprehensive README with examples
  - API documentation
  - Usage patterns
  - Example files
- **NPM Package**
  - Published to npm registry as @douglasdong/ppteditor-types
  - Proper package.json configuration
  - License: MIT

[2.3.0]: https://github.com/Xeonice/ppteditor-types/compare/v2.2.1...v2.3.0
[2.2.1]: https://github.com/Xeonice/ppteditor-types/compare/v2.2.0...v2.2.1
[2.2.0]: https://github.com/Xeonice/ppteditor-types/compare/v2.1.1...v2.2.0
[2.1.1]: https://github.com/Xeonice/ppteditor-types/compare/v2.1.0...v2.1.1
[2.1.0]: https://github.com/Xeonice/ppteditor-types/compare/v1.0.0...v2.1.0
[1.0.0]: https://github.com/Xeonice/ppteditor-types/releases/tag/v1.0.0

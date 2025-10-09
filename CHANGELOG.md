# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[2.2.1]: https://github.com/Xeonice/ppteditor-types/compare/v2.2.0...v2.2.1
[2.2.0]: https://github.com/Xeonice/ppteditor-types/compare/v2.1.1...v2.2.0
[2.1.1]: https://github.com/Xeonice/ppteditor-types/compare/v2.1.0...v2.1.1
[2.1.0]: https://github.com/Xeonice/ppteditor-types/compare/v1.0.0...v2.1.0
[1.0.0]: https://github.com/Xeonice/ppteditor-types/releases/tag/v1.0.0

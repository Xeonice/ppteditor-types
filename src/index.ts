// ====== 主导出文件 ======
// PPTEditor V2标准化类型定义库（支持V1兼容）

// ===== 主要导出：V2版本（当前仓库标准） =====
// Core V2 Standard Types
export * from './enums/index.js';
export * from './base/index.js';
export * from './elements/index.js';
export * from './animation/index.js';
export * from './slide/index.js';

// ===== Project Extensions =====
export * from './extensions/index.js';

// V2 Version Information
export { V2_VERSION, V2_SCHEMA_VERSION, V2_FEATURES } from './types/v2-standard-types.js';

// ===== 版本适配器导出 =====
export {
  V1ToV2Adapter,
  V2ToV1Adapter,
  VersionDetector,
  AutoAdapter
} from './adapters/v1-v2-adapter.js';

// ===== 统一接口导出 =====
export {
  UnifiedPPTElement,
  UnifiedPPTElementCollection,
  VersionConversionUtils
} from './types/unified-types.js';

// ===== 智能转换器导出 =====
export {
  SmartVersionConverter,
  GradientConverter,
  ConverterUtils,
  standardConverter,
  conservativeConverter,
  aggressiveConverter
} from './utils/version-converter.js';

// ===== 版本中间件导出 =====
export {
  VersionMiddleware,
  MiddlewareUtils,
  apiMiddleware,
  storageMiddleware,
  uiMiddleware
} from './middleware/version-middleware.js';

// ===== Namespace Exports for Grouped Imports =====
// V2 Standard Types
import * as BaseModule from './base/index.js';
import * as EnumsModule from './enums/index.js';
import * as ElementsModule from './elements/index.js';
import * as SlideModule from './slide/index.js';
import * as AnimationModule from './animation/index.js';
import * as V2StandardModule from './types/v2-standard-types.js';

// V1 Compatibility & Adapters
import * as V1CompatModule from './types/v1-compat-types.js';
import * as AdaptersModule from './adapters/v1-v2-adapter.js';

// Utilities & Middleware
import * as UnifiedModule from './types/unified-types.js';
import * as ConverterModule from './utils/version-converter.js';
import * as MiddlewareModule from './middleware/version-middleware.js';

// Project Extensions
import * as ExtensionsModule from './extensions/index.js';

// Group V2 Standard Types
export const V2Types = {
  Base: BaseModule,
  Enums: EnumsModule,
  Elements: ElementsModule,
  Slide: SlideModule,
  Animation: AnimationModule,
  Standard: V2StandardModule
};

// Group V1 Related Types
export const V1Types = {
  Compat: V1CompatModule,
  Adapters: AdaptersModule
};

// Group Utility Modules
export const Utils = {
  Unified: UnifiedModule,
  Converters: ConverterModule,
  Middleware: MiddlewareModule
};

// Group Project Extensions
export const ProjectExtensions = ExtensionsModule;

// Legacy namespace exports (for backward compatibility)
export { BaseModule as Base };
export { EnumsModule as Enums };
export { ElementsModule as Elements };
export { SlideModule as SlideNamespace };
export { AnimationModule as Animation };
export { V2StandardModule as V2Standard };
export { V1CompatModule as V1Compat };
export { AdaptersModule as Adapters };
export { UnifiedModule as Unified };
export { ConverterModule as Converters };
export { MiddlewareModule as Middleware };
export { ExtensionsModule as Extensions };

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
  V1CompatibleChartElement,
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
  validateColorConfig as validateColorConfigUtil
} from './utils/color-helpers.js';

// 主题色类型（从项目扩展导入）
export type { ThemeColorType } from './extensions/project-extended.js';

// ===== 版本信息导出 =====
export const PPTEDITOR_TYPES_VERSION = '2.3.0';
export const SCHEMA_VERSION = 2;
export const SUPPORTS_V1_COMPATIBILITY = true;
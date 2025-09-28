// ====== 主导出文件 ======
// PPTEditor V2标准化类型定义库（支持V1兼容）

// ===== 主要导出：V2版本（当前仓库标准） =====
// 导出所有V2标准类型
export * from './enums/index.js';
export * from './base/index.js';
export * from './elements/index.js';
export * from './animation/index.js';
export * from './slide/index.js';

// V2标准类型版本信息
export { V2_VERSION, V2_SCHEMA_VERSION, V2_FEATURES } from './types/v2-standard-types.js';

// ===== V1兼容导出（用于适配器） =====
export type {
  V1CompatiblePPTElement,
  V1CompatibleTextElement,
  V1CompatibleShapeElement,
  V1CompatibleImageElement,
  V1CompatibleLineElement,
  V1PPTNoneElement,
  V1ColorConfig,
  V1ShapeGradient,
  V1PPTTextElement,
  V1PPTTextElementApi
} from './types/v1-compat-types.js';

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

// ===== 命名空间导出 ===
import * as BaseModule from './base/index.js';
import * as EnumsModule from './enums/index.js';
import * as ElementsModule from './elements/index.js';
import * as SlideModule from './slide/index.js';
import * as AnimationModule from './animation/index.js';
import * as V2StandardModule from './types/v2-standard-types.js';
import * as V1CompatModule from './types/v1-compat-types.js';
import * as AdaptersModule from './adapters/v1-v2-adapter.js';
import * as UnifiedModule from './types/unified-types.js';
import * as ConverterModule from './utils/version-converter.js';
import * as MiddlewareModule from './middleware/version-middleware.js';

export { BaseModule as Base };
export { EnumsModule as Enums };
export { ElementsModule as Elements };
export { SlideModule as SlideNamespace };
export { AnimationModule as Animation };
export { V2StandardModule as V2Standard };    // V2标准类型命名空间
export { V1CompatModule as V1Compat };        // V1兼容类型命名空间
export { AdaptersModule as Adapters };         // 版本适配器命名空间
export { UnifiedModule as Unified };          // 统一接口命名空间
export { ConverterModule as Converters };     // 智能转换器命名空间
export { MiddlewareModule as Middleware };    // 版本中间件命名空间

// ===== 版本信息导出 =====
export const PPTEDITOR_TYPES_VERSION = '2.0.0';
export const SCHEMA_VERSION = 2;
export const SUPPORTS_V1_COMPATIBILITY = true;
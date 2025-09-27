// ====== 主导出文件 ======
// 提供完整的类型导出，支持多种导入方式

// === 主要模块导出 ===
// 导出所有枚举类型
export * from './enums/index.js';

// 导出所有基础类型
export * from './base/index.js';

// 导出所有元素类型
export * from './elements/index.js';

// 导出所有动画类型
export * from './animation/index.js';

// 导出所有幻灯片类型
export * from './slide/index.js';

// === 命名空间导出 ===
// 为了支持命名空间导入方式，提供模块级别的导出
import * as BaseModule from './base/index.js';
import * as EnumsModule from './enums/index.js';
import * as ElementsModule from './elements/index.js';
import * as SlideModule from './slide/index.js';
import * as AnimationModule from './animation/index.js';

export { BaseModule as Base };
export { EnumsModule as Enums };
export { ElementsModule as Elements };
export { SlideModule as SlideNamespace };
export { AnimationModule as Animation };
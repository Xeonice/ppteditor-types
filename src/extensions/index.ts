/**
 * 项目扩展类型模块
 *
 * 提供基于标准类型的项目扩展版本
 */

export * from './project-extended.js'

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

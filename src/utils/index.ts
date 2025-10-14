/**
 * 工具函数模块
 *
 * 提供类型转换、验证等工具函数
 */

export * from './memoize.js';
export * from './version-converter.js';

// ============ 颜色配置工具 ============
export {
  stringToColorConfig,
  colorConfigToString,
  createThemeColorConfig,
  isThemeColor,
  mergeColorConfig,
  validateColorConfig
} from './color-helpers.js';

// ============ 验证工具 ============
export {
  isValidGist,
  isValidNonEmptyGist,
  isValidGistWithNonEmptyStrings,
  isValidSlideNote,
  isValidSlideNoteReply,
  isValidSlideNotes
} from './validation-helpers.js';

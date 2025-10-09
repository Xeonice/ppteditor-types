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

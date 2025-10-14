/**
 * 验证工具函数
 *
 * @description 提供类型安全的验证辅助函数
 */

import type { V1SlideNote, V1SlideNoteReply } from '../types/v1-compat-types.js';

/**
 * 验证 gist 字段是否为有效的字符串数组
 *
 * @param gist - 待验证的 gist 数据
 * @returns 如果是有效的字符串数组则返回 true
 *
 * @example
 * ```typescript
 * const data: unknown = ['point 1', 'point 2'];
 * if (isValidGist(data)) {
 *   // TypeScript 现在知道 data 是 string[]
 *   console.log(data.length);
 * }
 * ```
 */
export function isValidGist(gist: unknown): gist is string[] {
  return Array.isArray(gist) && gist.every(item => typeof item === 'string');
}

/**
 * 验证 gist 字段是否为非空字符串数组
 *
 * @param gist - 待验证的 gist 数据
 * @returns 如果是非空字符串数组则返回 true
 *
 * @example
 * ```typescript
 * const data: unknown = ['point 1', 'point 2'];
 * if (isValidNonEmptyGist(data)) {
 *   // data 至少包含一个字符串元素
 *   console.log(data[0]);
 * }
 * ```
 */
export function isValidNonEmptyGist(gist: unknown): gist is [string, ...string[]] {
  return isValidGist(gist) && gist.length > 0;
}

/**
 * 验证 gist 字段中的每个字符串是否非空
 *
 * @param gist - 待验证的 gist 数据
 * @returns 如果所有字符串都非空则返回 true
 *
 * @example
 * ```typescript
 * const validGist = ['point 1', 'point 2'];
 * console.log(isValidGistWithNonEmptyStrings(validGist)); // true
 *
 * const invalidGist = ['point 1', '', 'point 3'];
 * console.log(isValidGistWithNonEmptyStrings(invalidGist)); // false
 * ```
 */
export function isValidGistWithNonEmptyStrings(gist: unknown): gist is string[] {
  return isValidGist(gist) && gist.every(item => item.trim().length > 0);
}

/**
 * 验证 V1SlideNoteReply 对象结构
 *
 * @param reply - 待验证的回复对象
 * @returns 如果是有效的 V1SlideNoteReply 则返回 true
 *
 * @example
 * ```typescript
 * const data: unknown = {
 *   id: 'reply-1',
 *   content: '回复内容',
 *   time: Date.now(),
 *   user: 'user-123'
 * };
 *
 * if (isValidSlideNoteReply(data)) {
 *   console.log(data.content); // TypeScript 类型安全
 * }
 * ```
 */
export function isValidSlideNoteReply(reply: unknown): reply is V1SlideNoteReply {
  if (!reply || typeof reply !== 'object') return false;

  const r = reply as Record<string, unknown>;
  return (
    typeof r.id === 'string' &&
    typeof r.content === 'string' &&
    typeof r.time === 'number' &&
    typeof r.user === 'string'
  );
}

/**
 * 验证 V1SlideNote 对象结构
 *
 * @param note - 待验证的备注对象
 * @returns 如果是有效的 V1SlideNote 则返回 true
 *
 * @example
 * ```typescript
 * const data: unknown = {
 *   id: 'note-1',
 *   content: '备注内容',
 *   time: Date.now(),
 *   user: 'user-123',
 *   elId: 'element-1',
 *   replies: []
 * };
 *
 * if (isValidSlideNote(data)) {
 *   console.log(data.content); // TypeScript 类型安全
 * }
 * ```
 */
export function isValidSlideNote(note: unknown): note is V1SlideNote {
  if (!note || typeof note !== 'object') return false;

  const n = note as Record<string, unknown>;

  // 验证必需字段
  if (
    typeof n.id !== 'string' ||
    typeof n.content !== 'string' ||
    typeof n.time !== 'number' ||
    typeof n.user !== 'string'
  ) {
    return false;
  }

  // 验证可选字段 elId
  if (n.elId !== undefined && typeof n.elId !== 'string') {
    return false;
  }

  // 验证可选字段 replies
  if (n.replies !== undefined) {
    if (!Array.isArray(n.replies)) return false;
    if (!n.replies.every(isValidSlideNoteReply)) return false;
  }

  return true;
}

/**
 * 验证 notes 数组
 *
 * @param notes - 待验证的备注数组
 * @returns 如果是有效的 V1SlideNote 数组则返回 true
 *
 * @example
 * ```typescript
 * const data: unknown = [
 *   {
 *     id: 'note-1',
 *     content: '备注1',
 *     time: Date.now(),
 *     user: 'user-123'
 *   }
 * ];
 *
 * if (isValidSlideNotes(data)) {
 *   data.forEach(note => console.log(note.content));
 * }
 * ```
 */
export function isValidSlideNotes(notes: unknown): notes is V1SlideNote[] {
  return Array.isArray(notes) && notes.every(isValidSlideNote);
}

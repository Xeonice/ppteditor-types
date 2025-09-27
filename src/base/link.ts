export type ElementLinkType = 'web' | 'slide';

/**
 * 元素超链接
 *
 * type: 链接类型（网页、幻灯片页面）
 *
 * target: 目标地址（网页链接、幻灯片页面ID）
 */
export interface PPTElementLink {
  type: ElementLinkType;
  target: string;
}
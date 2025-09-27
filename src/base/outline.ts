export type LineStyleType = 'solid' | 'dashed' | 'dotted';

/**
 * 元素边框
 *
 * style?: 边框样式（实线或虚线）
 *
 * width?: 边框宽度
 *
 * color?: 边框颜色
 */
export interface PPTElementOutline {
  style?: LineStyleType;
  width?: number;
  color?: string;
}
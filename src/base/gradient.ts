/**
 * 渐变
 *
 * type: 渐变类型（径向、线性）
 *
 * colors: 渐变颜色列表（pos: 百分比位置；color: 颜色）
 *
 * rotate: 渐变角度（线性渐变）
 */
export type GradientType = 'linear' | 'radial';

export interface GradientColor {
  pos: number;
  color: string;
}

export interface Gradient {
  type: GradientType;
  colors: GradientColor[];
  rotate: number;
}
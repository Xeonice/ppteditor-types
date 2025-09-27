import { PPTBaseElement } from './base';
import { PPTElementOutline } from '../base/outline';
import { PPTElementShadow } from '../base/shadow';
import { TextType } from '../base/common';

/**
 * 文本元素
 *
 * type: 元素类型
 *
 * content: 文字内容（HTML字符串）
 *
 * defaultFontName: 默认字体（会被文本内容中的HTML内联样式覆盖）
 *
 * defaultColor: 默认颜色（会被文本内容中的HTML内联样式覆盖）
 *
 * outline?: 边框
 *
 * fill?: 填充色
 *
 * lineHeight?: 行高倍数
 *
 * wordSpace?: 字符间距
 *
 * opacity?: 透明度
 *
 * shadow?: 阴影
 *
 * paragraphSpace?: 段间距
 *
 * vertical?: 竖向文本
 *
 * textType?: 文本类型
 */
export interface PPTTextElement extends PPTBaseElement {
  type: 'text';
  content: string;
  defaultFontName: string;
  defaultColor: string;
  outline?: PPTElementOutline;
  fill?: string;
  lineHeight?: number;
  wordSpace?: number;
  opacity?: number;
  shadow?: PPTElementShadow;
  paragraphSpace?: number;
  vertical?: boolean;
  textType?: TextType;
  valign?: 'middle' | 'top' | 'bottom';
  // 'none' = Do not Autofit
  // 'shrink' = Shrink text on overflow
  // 'resize' = Resize shape to fit text
  fit: 'none' | 'shrink' | 'resize';
  // fit = shrink 时，用于计算文字大小
  maxFontSize?: number;
}
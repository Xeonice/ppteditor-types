import { PPTBaseElement } from './base';

/**
 * 音频元素
 *
 * type: 元素类型（audio）
 *
 * fixedRatio: 固定图标宽高比例
 *
 * color: 图标颜色
 *
 * loop: 循环播放
 *
 * autoplay: 自动播放
 *
 * src: 音频地址
 *
 * ext: 音频后缀，当资源链接缺少后缀时用该字段确认资源类型
 */
export interface PPTAudioElement extends PPTBaseElement {
  type: 'audio'
  fixedRatio: boolean
  color: string
  loop: boolean
  autoplay: boolean
  src: string
  ext?: string
}
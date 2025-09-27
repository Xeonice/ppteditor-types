import { PPTBaseElement } from './base';

/**
 * 视频元素
 *
 * type: 元素类型（video）
 *
 * src: 视频地址
 *
 * autoplay: 自动播放
 *
 * poster: 预览封面
 *
 * ext: 视频后缀，当资源链接缺少后缀时用该字段确认资源类型
 */
export interface PPTVideoElement extends PPTBaseElement {
  type: 'video'
  src: string
  autoplay: boolean
  poster?: string
  ext?: string
}
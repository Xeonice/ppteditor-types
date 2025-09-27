export type AnimationType = 'in' | 'out' | 'attention';
export type AnimationTrigger = 'click' | 'meantime' | 'auto';

/**
 * 元素动画
 *
 * id: 动画id
 *
 * elId: 元素ID
 *
 * effect: 动画效果
 *
 * type: 动画类型（入场、退场、强调）
 *
 * duration: 动画持续时间
 *
 * trigger: 动画触发方式(click - 单击时、meantime - 与上一动画同时、auto - 上一动画之后)
 */
export interface PPTAnimation {
  id: string;
  elId: string;
  effect: string;
  type: AnimationType;
  duration: number;
  trigger: AnimationTrigger;
}
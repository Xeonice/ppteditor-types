/**
 * 形状路径公式键值
 */
export enum ShapePathFormulasKeys {
  ROUND_RECT = 'roundRect',
  ROUND_RECT_DIAGONAL = 'roundRectDiagonal',
  ROUND_RECT_SINGLE = 'roundRectSingle',
  ROUND_RECT_SAMESIDE = 'roundRectSameSide',
  CUT_RECT_DIAGONAL = 'cutRectDiagonal',
  CUT_RECT_SINGLE = 'cutRectSingle',
  CUT_RECT_SAMESIDE = 'cutRectSameSide',
  CUT_ROUND_RECT = 'cutRoundRect',
  MESSAGE = 'message',
  ROUND_MESSAGE = 'roundMessage',
  L = 'L',
  RING_RECT = 'ringRect',
  PLUS = 'plus',
  TRIANGLE = 'triangle',
  PARALLELOGRAM_LEFT = 'parallelogramLeft',
  PARALLELOGRAM_RIGHT = 'parallelogramRight',
  TRAPEZOID = 'trapezoid',
  BULLET = 'bullet',
  INDICATOR = 'indicator',
}

/**
 * 形状路径公式值类型
 *
 * 表示所有 ShapePathFormulasKeys 枚举的值
 *
 * @example
 * ```typescript
 * const formula: ShapePathFormulaValue = 'roundRect'; // ✓
 * const formula2: ShapePathFormulaValue = 'invalid'; // ✗ 错误
 * ```
 */
export type ShapePathFormulaValue = `${ShapePathFormulasKeys}`;
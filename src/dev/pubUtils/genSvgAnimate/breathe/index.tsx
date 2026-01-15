/**
 * 生成呼吸动画的 animateTransform 标签
 *
 * @module breathe
 *
 * @description
 * 呼吸动画是一种自动循环的缩放效果，用于吸引注意力
 */

// 导出类型
export type { BaseBreatheOptions, BreatheOptions } from './types';

// 导出呼吸动画
export { genAnimateBreathe, breathePresets } from './components/genAnimateBreathe';

// 导出样式常量
export { centerBreatheStyle } from './utils/styleUtils';

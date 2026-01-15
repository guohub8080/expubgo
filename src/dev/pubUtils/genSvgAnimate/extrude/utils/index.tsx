/**
 * 挤出动画工具函数集合
 *
 * 提供三种不同粒度的 animate 标签生成器：
 * - genWidthAnimate: 仅生成宽度动画
 * - genRectAnimate: 仅生成矩形高度动画（瞬间撤离）
 * - genAnimateExtrude: 生成完整的宽度+矩形高度动画组合
 */

export { genWidthAnimate, type extrudeOptions } from './genWidthAnimate';
export { genRectAnimate } from './genRectAnimate';
export { genAnimateExtrude } from './genAnimateExtrude';

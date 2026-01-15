/**
 * 生成淡入淡出/闪烁动画的 animate 标签
 *
 * @module blink
 *
 * @description
 * 提供两种闪烁动画效果：
 * - 软闪烁（Soft Blink）：透明度平滑过渡，有渐变效果
 * - 硬闪烁（Hard Blink）：在 0 和 1 之间直接切换，无渐变
 */

// eslint-disable-next-line react-refresh/only-export-components
export type { BaseBlinkOptions, SoftBlinkOptions, HardBlinkOptions } from './types';

// 导出软闪烁
export { genAnimateSoftBlink, softBlinkPresets } from './components/genAnimateSoftBlink';

// 导出硬闪烁
export { genAnimateHardBlink, hardBlinkPresets } from './components/genAnimateHardBlink';

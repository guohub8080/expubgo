/**
 * 软闪烁动画（淡入淡出）
 * 透明度在 maxOpacity 和 minOpacity 之间平滑过渡
 */

import React from 'react';
import type { SoftBlinkOptions } from '../types';
import { resolveBeginAttr, resolveRepeatCountAttr } from '../utils/resolveAttrs';

/**
 * 生成软闪烁动画的 animate React 元素
 *
 * @param options - 软闪烁动画选项
 * @returns React <animate> 元素
 *
 * @example
 * ```tsx
 * <svg>
 *   <g>
 *     {genAnimateSoftBlink({ minOpacity: 0.5, onceBlinkDurationSeconds: 2 })}
 *     <rect width="100" height="100" fill="red" />
 *   </g>
 * </svg>
 * ```
 */
export function genAnimateSoftBlink(options: SoftBlinkOptions = {}) {
  const {
    maxOpacity = 1,
    minOpacity = 0.2,
    onceBlinkDurationSeconds = 1.2,
    keySplines = '0.45 0 0.55 1',
    delay = 0,
    repeatCount = 0,
    beginType,
    restart,
  } = options;

  // 计算关键帧值：完全显示 -> 淡出 -> 完全显示
  const values = `${maxOpacity};${minOpacity};${maxOpacity}`;

  // keySplines 需要 n-1 段（n 是关键帧数量）
  const keySplinesFull = `${keySplines};${keySplines}`;

  const repeatCountValue = resolveRepeatCountAttr(repeatCount);
  const beginValue = resolveBeginAttr(delay, beginType);

  return (
    <animate
      attributeName="opacity"
      values={values}
      repeatCount={repeatCountValue}
      calcMode="spline"
      keySplines={keySplinesFull}
      dur={`${onceBlinkDurationSeconds}s`}
      {...(restart && { restart })}
      begin={beginValue}
    />
  );
}

/**
 * 预设的软闪烁效果
 */
export const softBlinkPresets = {
  /** 轻柔淡入淡出 */
  gentle: () => genAnimateSoftBlink({ minOpacity: 0.5, onceBlinkDurationSeconds: 2 }),

  /** 标准淡入淡出 */
  normal: () => genAnimateSoftBlink({ minOpacity: 0.2, onceBlinkDurationSeconds: 1.2 }),

  /** 深度淡化 */
  deep: () => genAnimateSoftBlink({ minOpacity: 0.1, onceBlinkDurationSeconds: 2.5 }),

  /** 快速闪烁 */
  fast: () => genAnimateSoftBlink({ minOpacity: 0.3, onceBlinkDurationSeconds: 0.8 }),

  /** 慢速淡化 */
  slow: () => genAnimateSoftBlink({ minOpacity: 0.2, onceBlinkDurationSeconds: 3 }),

  /** 微弱淡化 */
  subtle: () => genAnimateSoftBlink({ minOpacity: 0.7, onceBlinkDurationSeconds: 2 }),

  /** 接近硬闪烁（淡化到几乎完全透明） */
  nearHard: () => genAnimateSoftBlink({ minOpacity: 0.05, onceBlinkDurationSeconds: 1 }),
};

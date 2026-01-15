/**
 * 呼吸动画
 * 自动循环的缩放效果，用于吸引注意力
 */

import React from 'react';
import type { BreatheOptions } from '../types';
import { resolveBeginAttr, resolveRepeatCountAttr, resolveKeySplines } from '../utils/resolveAttrs';

/**
 * 生成呼吸动画的 animateTransform React 元素
 *
 * 呼吸动画会自动开始并循环播放
 *
 * @param options - 呼吸动画选项
 * @returns React <animateTransform> 元素
 *
 * @example
 * ```tsx
 * <svg width="200" height="200">
 *   <g style={getCenterBreatheStyle()}>
 *     {genAnimateBreathe()}
 *     <rect width="100" height="100" fill="red" />
 *   </g>
 * </svg>
 * ```
 */
export function genAnimateBreathe(options: BreatheOptions = {}) {
  const {
    fromScale = 1,
    toScale = 1.1,
    onceBreatheDurationSeconds = 2,
    keySplines = '0.42 0 0.58 1',
    delay = 0,
    repeatCount = 0,
    transformOrigin = 'center',
    isAdditive = true,
    beginType,
  } = options;

  // 计算关键帧值：原始大小 -> 放大 -> 原始大小
  const values = `${fromScale};${toScale};${fromScale}`;

  const keySplinesFull = resolveKeySplines(keySplines);
  const repeatCountValue = resolveRepeatCountAttr(repeatCount);
  const beginValue = resolveBeginAttr(delay, beginType);

  return (
    <animateTransform
      attributeName="transform"
      type="scale"
      values={values}
      dur={`${onceBreatheDurationSeconds}s`}
      repeatCount={repeatCountValue}
      calcMode="spline"
      keySplines={keySplinesFull}
      begin={beginValue}
      additive={isAdditive ? 'sum' : void 0}
    />
  );
}

/**
 * 预设的呼吸动画效果
 */
export const breathePresets = {
  /** 标准呼吸（2秒） */
  normal: () => genAnimateBreathe(),

  /** 快速呼吸（1秒） */
  fast: () => genAnimateBreathe({
    onceBreatheDurationSeconds: 1,
    toScale: 1.15
  }),

  /** 慢速呼吸（3秒） */
  slow: () => genAnimateBreathe({
    onceBreatheDurationSeconds: 3,
    toScale: 1.08,
    keySplines: '0.37 0 0.63 1'
  }),

  /** 轻微呼吸（2.5秒，小幅度） */
  gentle: () => genAnimateBreathe({
    onceBreatheDurationSeconds: 2.5,
    toScale: 1.05
  }),

  /** 强烈呼吸（1.5秒，大幅度） */
  strong: () => genAnimateBreathe({
    onceBreatheDurationSeconds: 1.5,
    toScale: 1.2
  }),

  /** 延迟呼吸（延迟1秒后开始） */
  delayed: () => genAnimateBreathe({
    delay: 1
  }),
};

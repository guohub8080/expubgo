/**
 * 硬闪烁动画
 * 在完全透明（opacity: 0）和完全不透明（opacity: 1）之间切换
 * 类似于霓虹灯或警示灯的开关效果
 */

import React from 'react';
import type { HardBlinkOptions } from '../types';
import { resolveBeginAttr, resolveRepeatCountAttr } from '../utils/resolveAttrs';

/**
 * 生成硬闪烁动画的 animate React 元素
 *
 * 硬闪烁与软闪烁的区别：
 * - 软闪烁：透明度平滑过渡，有渐变效果
 * - 硬闪烁：直接在 0 和 1 之间切换，无渐变
 *
 * @param options - 硬闪烁动画选项
 * @returns React <animate> 元素
 *
 * @example
 * ```tsx
 * <svg>
 *   <g>
 *     {genAnimateHardBlink({ onDurationSeconds: 0.8, offDurationSeconds: 0.3 })}
 *     <rect width="100" height="100" fill="red" />
 *   </g>
 * </svg>
 * ```
 */
export function genAnimateHardBlink(options: HardBlinkOptions = {}) {
  const {
    onDurationSeconds = 0.8,
    offDurationSeconds = 0.3,
    delay = 0,
    repeatCount = 0,
    beginType,
  } = options;

  // 计算关键帧值：显示 -> 隐藏 -> 显示
  const values = '1;0;1';

  // 计算关键帧时间点
  // 0 = 开始（显示）
  // t1 = onDuration / total = 显示结束时间点
  // 1 = 结束（显示）
  const totalDuration = onDurationSeconds + offDurationSeconds;
  const onRatio = onDurationSeconds / totalDuration;

  const keyTimes = `0;${onRatio};1`;

  const repeatCountValue = resolveRepeatCountAttr(repeatCount);
  const beginValue = resolveBeginAttr(delay, beginType);

  return (
    <animate
      attributeName="opacity"
      values={values}
      keyTimes={keyTimes}
      repeatCount={repeatCountValue}
      calcMode="discrete"
      dur={`${totalDuration}s`}
      begin={beginValue}
    />
  );
}

/**
 * 预设的硬闪烁效果
 */
export const hardBlinkPresets = {
  /** 标准：显示 0.8s，隐藏 0.3s */
  normal: () => genAnimateHardBlink({ onDurationSeconds: 0.8, offDurationSeconds: 0.3 }),

  /** 快速：显示 0.5s，隐藏 0.2s */
  fast: () => genAnimateHardBlink({ onDurationSeconds: 0.5, offDurationSeconds: 0.2 }),

  /** 慢速：显示 1.5s，隐藏 0.5s */
  slow: () => genAnimateHardBlink({ onDurationSeconds: 1.5, offDurationSeconds: 0.5 }),

  /** 警示：显示 0.6s，隐藏 0.4s（类似警示灯） */
  warning: () => genAnimateHardBlink({ onDurationSeconds: 0.6, offDurationSeconds: 0.4 }),

  /** SOS：显示 0.3s，隐藏 0.3s（紧急信号） */
  sos: () => genAnimateHardBlink({ onDurationSeconds: 0.3, offDurationSeconds: 0.3 }),

  /** 长显示：显示 2s，隐藏 0.3s（常用于提示） */
  longOn: () => genAnimateHardBlink({ onDurationSeconds: 2, offDurationSeconds: 0.3 }),

  /** 短显示：显示 0.3s，隐藏 0.8s（偶尔闪烁） */
  shortOn: () => genAnimateHardBlink({ onDurationSeconds: 0.3, offDurationSeconds: 0.8 }),
};

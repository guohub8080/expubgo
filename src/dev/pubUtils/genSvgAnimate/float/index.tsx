/**
 * 生成浮动动画的 animateTransform 标签
 */

import React from 'react';
import { getSvgBegin } from '@pub-utils/common/getSvgBegin';
import type { SvgBeginEventType } from '@pub-utils/common/getSvgBegin';

export interface FloatOptions {
  /** Y轴浮动范围（像素），默认 20 */
  floatRangeY?: number;
  /** X轴浮动范围（像素），默认 0 */
  floatRangeX?: number;
  /** 动画时长（秒），默认 4 */
  durationSeconds?: number;
  /** 缓动曲线，默认 '0.24 0 0.24 1' (ease-in-out) */
  keySplines?: string;
  /** 重复次数，0 表示无限循环，默认 0 */
  repeatCount?: number;
  /** 初始延迟（秒），默认 0 */
  delay?: number;
  /** 触发事件类型，默认 undefined（自动开始） */
  beginType?: SvgBeginEventType;
}

/**
 * 生成浮动动画的 animateTransform React 元素
 * @returns 返回 React <animateTransform> 元素
 * @example
 * ```tsx
 * <svg>
 *   <g>
 *     {genAnimateFloat({ floatRangeY: 20, durationSeconds: 4 })}
 *     <rect width="100" height="100" fill="red" />
 *   </g>
 * </svg>
 * ```
 */
export function genAnimateFloat(options: FloatOptions = {}) {
  const {
    floatRangeY = 20,
    floatRangeX = 0,
    durationSeconds = 4,
    keySplines = '0.24 0 0.24 1',
    repeatCount = 0,
    delay = 0,
    beginType,
  } = options;

  // 计算关键帧值：从原始位置开始，向上浮动，再回到原始位置
  // 两段动画：原点 -> 顶点 -> 原点
  const originValue = `${floatRangeX} 0`;
  const topValue = `${-floatRangeX} ${-floatRangeY}`;

  const values = `${originValue};${topValue};${originValue}`;

  // 两段动画需要两段缓动曲线
  const keySplinesFull = `${keySplines};${keySplines}`;

  const repeatCountValue = repeatCount === 0 ? 'indefinite' : repeatCount;

  // 处理 begin 属性
  const beginValue = getSvgBegin(beginType, delay);

  return (
    <animateTransform
      attributeName="transform"
      type="translate"
      values={values}
      repeatCount={repeatCountValue}
      calcMode="spline"
      keySplines={keySplinesFull}
      dur={`${durationSeconds}s`}
      begin={beginValue}
    />
  );
}

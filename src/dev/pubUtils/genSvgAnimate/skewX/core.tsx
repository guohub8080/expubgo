/**
 * genAnimateSkewX 核心函数
 */

import React from 'react';
import { isUndefined } from 'es-toolkit/predicate';
import { defaultTo } from 'es-toolkit/compat';
import { genSvgKeySplines, SvgTimelineSegment } from '@pub-utils/genSvgKeySplines';
import { SkewXAnimationConfig } from './types.ts';
import { getEaseBezier } from '@pub-utils/getBezier';
import { assertNonEmptyArray } from '@pub-utils/common/arrayValidation';
import { getSvgBegin } from '@pub-utils/common/getSvgBegin';

/**
 * 生成水平斜切动画的 animateTransform React 元素
 * 使用时间线配置方式，支持复杂的多段动画
 * 
 * @returns 返回 React <animateTransform> 元素
 * @example
 * ```tsx
 * // 简单的水平斜切
 * genAnimateSkewX({
 *   timeline: [
 *     { durationSeconds: 1, toAngle: 20 },
 *     { durationSeconds: 1, toAngle: 0 }
 *   ],
 *   loopCount: 0
 * })
 * 
 * // 左右摇摆效果
 * genAnimateSkewX({
 *   initAngle: -15,
 *   timeline: [
 *     { durationSeconds: 1, toAngle: 15 },
 *     { durationSeconds: 1, toAngle: -15 }
 *   ],
 *   loopCount: 0
 * })
 * ```
 */
export function genAnimateSkewX(config: SkewXAnimationConfig) {
  const {
    initAngle = 0,
    timeline,
    delay = 0,
    isAdditive = true,
    beginType,
    calcMode,
    isFreeze = false,
    loopCount = 1,
  } = config;

  // 参数验证
  assertNonEmptyArray(timeline, 'timeline');

  // 构建完整的角度序列
  const angles: number[] = [initAngle];
  let lastAngle = initAngle;

  timeline.forEach((segment) => {
    const newAngle = !isUndefined(segment.toValue) ? segment.toValue : lastAngle;
    angles.push(newAngle);
    lastAngle = newAngle;
  });

  // 计算总时长
  const totalDuration = timeline.reduce((sum, segment) => sum + segment.durationSeconds, 0);

  // 使用 genSvgKeySplines 生成动画参数
  const angleTimeline: SvgTimelineSegment[] = timeline.map((segment, index) => ({
    keySplines: defaultTo(segment.keySplines, getEaseBezier({ isIn: true, isOut: true })),
    toValue: angles[index + 1],
    durationSeconds: segment.durationSeconds,
  }));

  const angleKeys = genSvgKeySplines({
    initValue: initAngle,
    timeline: angleTimeline,
  });

  // 确定 calcMode
  const hasKeySplines = timeline.some(seg => seg.keySplines);
  const finalCalcMode = defaultTo(calcMode, hasKeySplines ? 'spline' : 'linear');

  // 处理 begin 属性
  const beginValue = getSvgBegin(beginType, delay);

  // 处理 repeatCount
  const repeatCountValue = loopCount === 0 ? 'indefinite' : loopCount;

  return (
    <animateTransform
      attributeName="transform"
      type="skewX"
      values={angleKeys.values}
      keyTimes={angleKeys.keyTimes}
      keySplines={finalCalcMode === 'spline' ? angleKeys.keySplines : void 0}
      dur={`${totalDuration}s`}
      calcMode={finalCalcMode}
      repeatCount={repeatCountValue}
      begin={beginValue}
      fill={isFreeze ? 'freeze' : 'remove'}
      additive={isAdditive ? 'sum' : void 0}
    />
  );
}


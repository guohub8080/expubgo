/**
 * genAnimateTranslate 核心函数
 */

import React from 'react';
import { defaultTo } from 'es-toolkit/compat';
import { genSvgKeySplines } from '@pub-utils/genSvgKeySplines';
import { TranslateAnimationConfig } from './types.ts';
import { assertNonEmptyArray } from '@pub-utils/common/arrayValidation';
import { buildCoordinates, buildXYTimelines, combineXYValues, calculateTotalDuration } from './utils/index.ts';
import { getSvgBegin } from '@pub-utils/common/getSvgBegin';

/**
 * 生成平移动画的 animateTransform React 元素
 * 使用时间线配置方式，支持复杂的多段动画
 *
 * @returns 返回 React <animateTransform> 元素
 * @example
 * ```tsx
 * // 简单的两段动画
 * genAnimateTranslate({
 *   initValue: { x: 0, y: 0 },
 *   timeline: [
 *     { durationSeconds: 2, toValue: { x: 100, y: 50 }, keySplines: '0.42 0 0.58 1' },
 *     { durationSeconds: 1, toValue: { x: 200, y: 0 }, keySplines: '0 0 0.58 1' }
 *   ]
 * })
 *
 * // 往返动画
 * genAnimateTranslate({
 *   initValue: { x: 0, y: 0 },
 *   timeline: [
 *     { durationSeconds: 1.5, toValue: { x: 100 } },  // 向右
 *     { durationSeconds: 1.5, toValue: { x: 0 } }     // 向左
 *   ],
 *   loopCount: 0  // 无限循环
 * })
 * ```
 */
export function genAnimateTranslate(config: TranslateAnimationConfig) {
  const {
    initValue = {},
    timeline,
    delay = 0,
    isAdditive = true,
    beginType,
    calcMode,
    isFreeze = false,
    loopCount = 1,
    isRelativeMove = true,
    restart,
  } = config;

  // 提取初始坐标
  const initX = defaultTo(initValue.x, 0);
  const initY = defaultTo(initValue.y, 0);

  // 参数验证
  assertNonEmptyArray(timeline, 'timeline');

  // 构建完整的坐标序列
  const coordinates = buildCoordinates(initX, initY, timeline, isRelativeMove);

  // 计算总时长
  const totalDuration = calculateTotalDuration(timeline);

  // 使用 genSvgKeySplines 分别生成 X 和 Y 的动画参数
  const { xTimeline, yTimeline } = buildXYTimelines(timeline, coordinates);

  const xKeys = genSvgKeySplines({
    initValue: initX,
    timeline: xTimeline,
  });

  const yKeys = genSvgKeySplines({
    initValue: initY,
    timeline: yTimeline,
  });

  // 合并 X 和 Y 的 values
  const xyCombinedValues = combineXYValues(xKeys, yKeys);

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
      type="translate"
      values={xyCombinedValues}
      keyTimes={xKeys.keyTimes}
      keySplines={finalCalcMode === 'spline' ? xKeys.keySplines : void 0}
      dur={`${totalDuration}s`}
      calcMode={finalCalcMode}
      repeatCount={repeatCountValue}
      begin={beginValue}
      fill={isFreeze ? 'freeze' : 'remove'}
      additive={isAdditive ? 'sum' : void 0}
      {...(restart && { restart })}
    />
  );
}

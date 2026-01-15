/**
 * genAnimatePathStroke 核心函数
 */

import React from 'react';
import { isUndefined, isNil } from 'es-toolkit/predicate';
import { defaultTo, isEmpty } from 'es-toolkit/compat';
import { genSvgKeySplines, SvgTimelineSegment } from '@pub-utils/genSvgKeySplines';
import { PathStrokeAnimationConfig } from './types.ts';
import { getLinearBezier } from '@pub-utils/getBezier';
import { getSvgBegin } from '@pub-utils/common/getSvgBegin';

/**
 * 生成路径描边动画的 <g> 容器及 <animate> 元素
 * 使用时间线配置方式，支持复杂的多段动画
 *
 * @param config 路径描边动画配置（包含 element）
 * @returns 返回带有描边动画的 <g> 容器
 * @example
 * ```tsx
 * // 基础描边动画（自动播放）
 * {genAnimatePathStroke({
 *   pathLength: 996,
 *   timeline: [
 *     { durationSeconds: 2, toValue: 0 }
 *   ],
 *   element: <path d="M10,10 L290,490" stroke="red" strokeWidth="2" fill="none" />
 * })}
 *
 * // 点击触发的描边动画
 * {genAnimatePathStroke({
 *   pathLength: 996,
 *   beginType: 'click',
 *   restart: 'never',
 *   clickableAreaSize: { width: 300, height: 500 },
 *   timeline: [
 *     { durationSeconds: 2, toValue: 0 }
 *   ],
 *   element: <path d="M..." stroke="blue" strokeWidth="3" fill="none" />
 * })}
 * ```
 */
export function genAnimatePathStroke(
  config: PathStrokeAnimationConfig
) {
  const {
    pathLength,
    initOffset,
    timeline,
    delay = 0,
    beginType,
    calcMode,
    isFreeze = true,
    loopCount = 1,
    restart = 'always',
    element,
    clickableAreaSize,
  } = config;

  // 参数验证
  if (isNil(pathLength)) {
    throw new Error('pathLength 是必填参数');
  }
  if (isEmpty(timeline) || !Array.isArray(timeline)) {
    throw new Error('timeline 必须是非空数组');
  }
  if (isNil(element)) {
    throw new Error('element 是必填参数');
  }

  // 初始偏移量默认为路径长度（完全隐藏）
  const initialOffset = defaultTo(initOffset, pathLength);

  // 构建完整的偏移量序列
  const offsets: number[] = [initialOffset];
  let lastOffset = initialOffset;

  timeline.forEach((segment) => {
    const newOffset = !isUndefined(segment.toValue) ? segment.toValue : lastOffset;
    offsets.push(newOffset);
    lastOffset = newOffset;
  });

  // 计算总时长
  const totalDuration = timeline.reduce((sum, segment) => sum + segment.durationSeconds, 0);

  // 使用 genSvgKeySplines 生成动画参数
  const offsetTimeline: SvgTimelineSegment[] = timeline.map((segment, index) => ({
    keySplines: defaultTo(segment.keySplines, getLinearBezier()),
    toValue: offsets[index + 1],
    durationSeconds: segment.durationSeconds,
  }));

  const offsetKeys = genSvgKeySplines({
    initValue: initialOffset,
    timeline: offsetTimeline,
  });

  // 确定 calcMode
  const hasKeySplines = timeline.some(seg => seg.keySplines);
  const finalCalcMode = defaultTo(calcMode, hasKeySplines ? 'spline' : 'linear');

  // 处理 begin 属性
  const beginValue = getSvgBegin(beginType, delay);

  // 处理 repeatCount
  const repeatCountValue = loopCount === 0 ? 'indefinite' : loopCount;

  return (
    <g
      strokeDasharray={`${pathLength},${pathLength}`}
      strokeDashoffset={pathLength}
      style={beginType ? { cursor: 'pointer' } : void 0}
    >
      <animate
        attributeType="CSS"
        attributeName="stroke-dashoffset"
        values={offsetKeys.values}
        keyTimes={offsetKeys.keyTimes}
        keySplines={finalCalcMode === 'spline' ? offsetKeys.keySplines : void 0}
        dur={`${totalDuration}s`}
        calcMode={finalCalcMode}
        begin={beginValue}
        fill={isFreeze ? 'freeze' : 'remove'}
        repeatCount={repeatCountValue}
        restart={restart}
      />
      {/* 点击触发时添加透明覆盖层，让整个区域都可点击 */}
      {beginType && clickableAreaSize && (
        <rect
          x="0"
          y="0"
          width={clickableAreaSize.width}
          height={clickableAreaSize.height}
          fill="transparent"
        />
      )}
      {element}
    </g>
  );
}


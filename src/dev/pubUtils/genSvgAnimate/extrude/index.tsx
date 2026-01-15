/**
 * genAnimateExtrude - 挤出动画生成器
 * 基于挤出动画原理：通过撑开容器实现"露出"效果
 *
 * 核心设计：
 * 1. 外层 SVG pointerEvents: none - 不阻挡下方内容的点击
 * 2. 内部 rect pointerEvents: painted - 负责接收点击事件
 * 3. rect 点击后高度变为 0 - 实现点击后消失，不再阻挡后续交互
 *
 * 瞬间撤离机制：
 * - rect 的 height 动画使用 values="100%;0%;0%" 和 keyTimes="0;0.0001;1"
 * - 在动画总时长的 0.0001 比例处瞬间塌陷为 0
 * - dur 使用与 width 动画相同的总时长，避免因时间太短被系统忽略
 *
 * 工具函数导出：
 * - genWidthAnimate: 仅生成宽度 <animate> 元素
 * - genRectAnimate: 仅生成矩形高度 <animate> 元素
 * - genAnimateExtrudeAttrs: 生成宽度+矩形高度 <animate> 元素组合
 */

import React from 'react';
import { isNil, isUndefined } from 'es-toolkit/predicate';
import { defaultTo, isEmpty } from 'es-toolkit/compat';
import {genSvgKeySplines, SvgTimelineSegment} from '@pub-utils/genSvgKeySplines';
import {getEaseBezier} from "@pub-utils/getBezier";
import { getSvgBegin } from '@pub-utils/common/getSvgBegin';
import type { SvgBeginEventType } from '@pub-utils/common/getSvgBegin';
import SvgEx from "@pub-html/basicEx/SvgEx.tsx";

// 重新导出工具函数，供需要单独使用 animate 元素的场景
export { genWidthAnimate, genRectAnimate, genAnimateExtrude as genAnimateExtrudeAttrs, type extrudeOptions as extrudeOptionsAttrs } from './utils';

// 本地类型定义（用于主函数 genAnimateExtrude）
export type extrudeOptions = {
  canvasWidth: number;
  initHeight: number;
  timeline: {
    toHeight: number;
    durationSeconds: number;
    keySplines?: string;
  }[];
  /** 初始延迟（秒），默认 0 */
  delay?: number;
  /** 触发事件类型，默认 undefined（自动开始） */
  beginType?: SvgBeginEventType;
  /** 动画计算模式 */
  calcMode?: 'spline' | 'linear' | 'discrete' | 'paced';
  /** 是否保持最终状态，默认 true */
  isFreeze?: boolean;
  /** 循环次数，0 表示无限循环，默认 1 */
  loopCount?: number;
};

/**
 * 生成挤出动画的 animate 元素
 * 通过改变容器宽度实现"挤出"效果
 *
 * 工作原理：
 * 1. 外层 SVG 设置 pointerEvents: none，避免阻挡下方内容
 * 2. 内部 rect 设置 pointerEvents: painted，负责接收点击
 * 3. 点击后 rect 的 height 动画变为 0%，实现点击后穿透
 */
export const genAnimateExtrude = (props: extrudeOptions): React.ReactElement => {
  // 参数验证
  if (isNil(props.canvasWidth)) {
    throw new Error('canvasWidth 是必填参数');
  }
  if (isNil(props.initHeight)) {
    throw new Error('initHeight 是必填参数');
  }
  if (isEmpty(props.timeline) || !Array.isArray(props.timeline)) {
    throw new Error('timeline 必须是非空数组');
  }

  // 构建 widthTimeline 供 genSvgKeySplines 使用
  // 公式: targetPercent = initialPercent × (viewBoxH + additionalH) / viewBoxH
  // 简化: targetPercent = 100 × toHeight / initHeight
  const widthTimeline: SvgTimelineSegment[] = props.timeline.map((segment) => ({
    keySplines: defaultTo(segment.keySplines, getEaseBezier({isOut: true})),
    toValue: `${100 * (segment.toHeight / props.initHeight)}%`,
    durationSeconds: segment.durationSeconds,
  }));

  // 使用 genSvgKeySplines 生成动画参数
  const widthParams = genSvgKeySplines({
    initValue: `100%`,
    timeline: widthTimeline,
  });

  // 处理 begin 属性
  const beginValue = getSvgBegin(props.beginType, props.delay);

  // 处理 repeatCount
  const loopCount = defaultTo(props.loopCount, 1);
  const repeatCountValue = loopCount === 0 ? 'indefinite' : loopCount;

  // 处理 calcMode
  const hasKeySplines = props.timeline.some(seg => !isUndefined(seg.keySplines));
  const finalCalcMode = defaultTo(props.calcMode, hasKeySplines ? 'spline' : 'linear');

  // 处理 isFreeze
  const isFreeze = defaultTo(props.isFreeze, true);

  // rect 消失动画使用与 width 动画相同的总时长
  // 这样可以确保在整个动画播放期间，rect 都保持高度为 0 的穿透状态
  // 避免因为时间太短被系统默认去掉
  const rectDisappearDuration = widthParams.totalDuration;

  return (
    <SvgEx
      data-label="extrude-animate-controler"
      viewBox={`0 0 ${props.canvasWidth} ${props.initHeight}`}
      style={{ pointerEvents: 'none', display: 'block' }}
      important={[['max-width', 'none']]}>
      {/* 外层 SVG 的宽度动画：负责撑开容器 */}
      <animate
        attributeName="width"
        values={widthParams.values}
        keyTimes={widthParams.keyTimes}
        keySplines={finalCalcMode === 'spline' ? widthParams.keySplines : void 0}
        dur={`${widthParams.totalDuration}s`}
        begin={beginValue}
        calcMode={finalCalcMode}
        fill={isFreeze ? 'freeze' : 'remove'}
        repeatCount={repeatCountValue}
        restart="never"
      />

      {/* 内部 rect：负责接收点击事件，点击后消失实现穿透 */}
      <rect
        data-label="click-trigger"
        width="100%"
        height="100%"
        style={{ pointerEvents: 'painted', opacity: 0 }}>
        {/* rect 的高度动画：点击后瞬间变为 0，实现点击后穿透 */}
        <animate
          attributeName="height"
          values="100%;0%;0%"
          keyTimes="0;0.0001;1"
          keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"
          dur={`${rectDisappearDuration}s`}
          begin={beginValue}
          calcMode="spline"
          fill="freeze"
          restart="never"
        />
      </rect>
    </SvgEx>
  );
};

/**
 * genWidthAnimate - 挤出动画的宽度 animate 标签生成器
 *
 * 纯函数实现：只负责生成宽度 animate 标签的 JSX 元素
 * 用于直接在 React 组件中使用
 */

import { isNil, isUndefined } from 'es-toolkit/predicate';
import { defaultTo, isEmpty } from 'es-toolkit/compat';
import { genSvgKeySplines, SvgTimelineSegment } from '@pub-utils/genSvgKeySplines';
import { getEaseBezier } from "@pub-utils/getBezier";
import { getSvgBegin } from '@pub-utils/common/getSvgBegin';
import type { SvgBeginEventType } from '@pub-utils/common/getSvgBegin';
import { CSSProperties } from "react";

/**
 * 挤出动画选项
 */
export type extrudeOptions = {
  /** 画布宽度 */
  canvasWidth: number;
  /** 初始高度 */
  initHeight: number;
  /** 时间线配置：每个阶段的目标高度和持续时间 */
  timeline: {
    /** 目标高度 */
    toHeight: number;
    /** 持续时间（秒） */
    durationSeconds: number;
    /** 贝塞尔曲线（可选） */
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
  /** SVG 容器样式（可选） */
  svgStyle?: CSSProperties;
};

/**
 * 生成宽度动画的 animate 元素
 *
 * @example
 * ```tsx
 * const widthAnimate = genWidthAnimate({
 *   canvasWidth: 300,
 *   initHeight: 200,
 *   timeline: [{ toHeight: 400, durationSeconds: 10 }]
 * });
 *
 * <svg>{widthAnimate}</svg>
 * ```
 */
export const genWidthAnimate = (options: extrudeOptions): React.ReactElement => {
  // 参数验证
  if (isNil(options.canvasWidth)) {
    throw new Error('canvasWidth 是必填参数');
  }
  if (isNil(options.initHeight)) {
    throw new Error('initHeight 是必填参数');
  }
  if (isEmpty(options.timeline) || !Array.isArray(options.timeline)) {
    throw new Error('timeline 必须是非空数组');
  }

  // 构建 widthTimeline 供 genSvgKeySplines 使用
  // 公式: targetPercent = initialPercent × (viewBoxH + additionalH) / viewBoxH
  // 简化: targetPercent = 100 × toHeight / initHeight
  const widthTimeline: SvgTimelineSegment[] = options.timeline.map((segment) => ({
    keySplines: defaultTo(segment.keySplines, getEaseBezier({ isOut: true })),
    toValue: `${100 * (segment.toHeight / options.initHeight)}%`,
    durationSeconds: segment.durationSeconds,
  }));

  // 使用 genSvgKeySplines 生成动画参数
  const widthParams = genSvgKeySplines({
    initValue: `100%`,
    timeline: widthTimeline,
  });

  // 处理 begin 属性
  const beginValue = getSvgBegin(options.beginType, options.delay);

  // 处理 repeatCount
  const loopCount = defaultTo(options.loopCount, 1);
  const repeatCountValue = loopCount === 0 ? 'indefinite' : loopCount;

  // 处理 calcMode
  const hasKeySplines = options.timeline.some(seg => !isUndefined(seg.keySplines));
  const finalCalcMode = defaultTo(options.calcMode, hasKeySplines ? 'spline' : 'linear');

  // 处理 isFreeze
  const isFreeze = defaultTo(options.isFreeze, true);

  return (
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
  );
};

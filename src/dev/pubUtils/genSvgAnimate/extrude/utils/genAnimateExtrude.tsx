/**
 * genAnimateExtrude - 挤出动画的完整 animate 标签组合生成器
 *
 * 纯函数实现：生成宽度动画和矩形高度动画的组合
 * 用于直接在 React 组件中使用
 */

import { isUndefined } from 'es-toolkit/predicate';
import { defaultTo } from 'es-toolkit/compat';
import { genSvgKeySplines, SvgTimelineSegment } from '@pub-utils/genSvgKeySplines';
import { getEaseBezier } from "@pub-utils/getBezier";
import { getSvgBegin } from '@pub-utils/common/getSvgBegin';
import type { SvgBeginEventType } from '@pub-utils/common/getSvgBegin';

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
};

/**
 * 生成完整的挤出动画 animate 元素组合
 *
 * 包含宽度动画和矩形高度动画（瞬间撤离机制）
 *
 * @example
 * ```tsx
 * const { widthAnimate, rectAnimate } = genAnimateExtrude({
 *   canvasWidth: 300,
 *   initHeight: 200,
 *   timeline: [{ toHeight: 400, durationSeconds: 10 }],
 *   beginType: 'click'
 * });
 *
 * <svg viewBox="0 0 300 200">
 *   {widthAnimate}
 *   <rect width="100%" height="100%" style={{ pointerEvents: 'painted', opacity: 0 }}>
 *     {rectAnimate}
 *   </rect>
 * </svg>
 * ```
 */
export const genAnimateExtrude = (options: extrudeOptions): {
  widthAnimate: React.ReactElement;
  rectAnimate: React.ReactElement;
} => {
  // 生成宽度动画属性
  const widthTimeline: SvgTimelineSegment[] = options.timeline.map((segment) => ({
    keySplines: defaultTo(segment.keySplines, getEaseBezier({ isOut: true })),
    toValue: `${100 * (segment.toHeight / options.initHeight)}%`,
    durationSeconds: segment.durationSeconds,
  }));

  const widthParams = genSvgKeySplines({
    initValue: `100%`,
    timeline: widthTimeline,
  });

  const beginValue = getSvgBegin(options.beginType, options.delay);

  const loopCount = defaultTo(options.loopCount, 1);
  const repeatCountValue = loopCount === 0 ? 'indefinite' : loopCount;

  const hasKeySplines = options.timeline.some(seg => !isUndefined(seg.keySplines));
  const finalCalcMode = defaultTo(options.calcMode, hasKeySplines ? 'spline' : 'linear');
  const isFreeze = defaultTo(options.isFreeze, true);

  const widthAnimate = (
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

  // 使用与 width 动画相同的总时长
  const rectAnimate = (
    <animate
      attributeName="height"
      values="100%;0%;0%"
      keyTimes="0;0.0001;1"
      keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"
      dur={`${widthParams.totalDuration}s`}
      begin={beginValue}
      calcMode="spline"
      fill="freeze"
      restart="never"
    />
  );

  return { widthAnimate, rectAnimate };
};

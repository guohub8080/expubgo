/**
 * genRectAnimate - 矩形高度动画的 animate 标签生成器
 *
 * 纯函数实现：只负责生成矩形高度 animate 标签的 JSX 元素
 * 用于实现点击后矩形瞬间消失的"瞬间撤离"机制
 */

import { defaultTo } from 'es-toolkit/compat';
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
 * 生成矩形高度动画的 animate 元素（点击后消失）
 *
 * 瞬间撤离机制：
 * - values="100%;0%;0%" - 从 100% 瞬间降到 0%，然后保持
 * - keyTimes="0;0.0001;1" - 在极短时间内完成高度变化
 * - 动画时长与宽度动画一致，确保整个动画期间保持穿透状态
 *
 * @example
 * ```tsx
 * const rectAnimate = genRectAnimate(10000, { beginType: 'click' });
 *
 * <svg>
 *   <rect width="100%" height="100%" style={{ pointerEvents: 'painted', opacity: 0 }}>
 *     {rectAnimate}
 *   </rect>
 * </svg>
 * ```
 */
export const genRectAnimate = (widthTotalDuration: number, options: extrudeOptions): React.ReactElement => {
  // 处理 begin 属性（与宽度动画同步）
  const beginValue = getSvgBegin(options.beginType, options.delay);

  // 使用与 width 动画相同的总时长
  // 确保在整个动画播放期间，rect 都保持高度为 0 的穿透状态
  const duration = widthTotalDuration;

  return (
    <animate
      attributeName="height"
      values="100%;0%;0%"
      keyTimes="0;0.0001;1"
      keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"
      dur={`${duration}s`}
      begin={beginValue}
      calcMode="spline"
      fill="freeze"
      restart="never"
    />
  );
};

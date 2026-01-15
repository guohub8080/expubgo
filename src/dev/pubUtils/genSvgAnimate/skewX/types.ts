/**
 * genAnimateSkewX 类型定义
 */

import type { SvgBeginEventType } from '@pub-utils/common/getSvgBegin';

/** 水平斜切时间线段 */
export interface SkewXTimelineSegment {
  /** 贝塞尔缓动参数（格式："x1 y1 x2 y2"），默认 "0.42 0 0.58 1" (ease-in-out) */
  keySplines?: string;
  /** 该段的持续时间（秒） */
  durationSeconds: number;
  /** 目标斜切角度（度数，可选，如果不提供则保持上一段的角度） */
  toValue?: number;
}

/** 动画计算模式 */
export type AnimateCalcMode = 'spline' | 'linear' | 'discrete' | 'paced';

/** 水平斜切动画配置 */
export interface SkewXAnimationConfig {
  /** 初始斜切角度（度数），默认 0 */
  initAngle?: number;
  /** 时间线段数组 */
  timeline: SkewXTimelineSegment[];
  /** 初始延迟（秒），默认 0 */
  delay?: number;
  /**
   * 是否累加变换（与其他变换组合），默认 true
   * - true: 与其他动画叠加（推荐）
   * - false: 替换其他变换
   */
  isAdditive?: boolean;
  /** 触发事件类型，留空或 'auto' 表示自动开始 */
  beginType?: SvgBeginEventType;
  /**
   * 动画计算模式，默认根据 keySplines 自动判断
   * - 'spline': 使用贝塞尔缓动（需要 keySplines）
   * - 'linear': 线性插值
   * - 'discrete': 跳转（无过渡）
   * - 'paced': 等速（忽略 keyTimes）
   */
  calcMode?: AnimateCalcMode;
  /** 是否保持最终状态，默认 false */
  isFreeze?: boolean;
  /** 循环次数，0 表示无限循环，默认 1 */
  loopCount?: number;
}


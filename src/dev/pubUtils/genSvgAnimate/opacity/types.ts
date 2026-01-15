/**
 * genAnimateOpacity 类型定义
 */

import type { SvgBeginEventType } from '@pub-utils/common/getSvgBegin';

/** 不透明度时间线段 */
export interface OpacityTimelineSegment {
  /** 贝塞尔缓动参数（格式："x1 y1 x2 y2"），默认 "0.42 0 0.58 1" (ease-in-out) */
  keySplines?: string;
  /** 该段的持续时间（秒） */
  durationSeconds: number;
  /** 目标不透明度（0-1，可选，如果不提供则保持上一段的不透明度） */
  toValue?: number;
}

/** 动画计算模式 */
export type AnimateCalcMode = 'spline' | 'linear' | 'discrete' | 'paced';

/** 不透明度动画配置 */
export interface OpacityAnimationConfig {
  /** 初始不透明度（0-1），默认 1 */
  initOpacity?: number;
  /** 时间线段数组 */
  timeline: OpacityTimelineSegment[];
  /** 初始延迟（秒），默认 0 */
  delay?: number;
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
  restart?: 'always' | 'whenNotActive' | 'never';
}


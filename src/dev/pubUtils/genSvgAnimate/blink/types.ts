/**
 * blink 动画的类型定义
 */

import type { SvgBeginEventType } from '@pub-utils/common/getSvgBegin';

/**
 * 基础动画选项
 */
export interface BaseBlinkOptions {
  /** 初始延迟（秒），默认 0 */
  delay?: number;
  /** 重复次数，0 表示无限循环，默认 0 */
  repeatCount?: number;
  /** 触发事件类型，留空或 'auto' 表示自动开始 */
  beginType?: SvgBeginEventType;
  restart?: 'always' | 'whenNotActive' | 'never';
}

/**
 * 软闪烁（淡入淡出）动画选项
 */
export interface SoftBlinkOptions extends BaseBlinkOptions {
  /** 最大透明度，默认 1 */
  maxOpacity?: number;
  /** 最小透明度，默认 0.2 */
  minOpacity?: number;
  /** 一次闪烁时长（秒），默认 1.2 */
  onceBlinkDurationSeconds?: number;
  /** 缓动曲线，默认 '0.45 0 0.55 1' (ease-in-out) */
  keySplines?: string;
}

/**
 * 硬闪烁（完全透明到完全不透明）动画选项
 */
export interface HardBlinkOptions extends BaseBlinkOptions {
  /** 完全显示时长（秒），默认 0.8 */
  onDurationSeconds?: number;
  /** 完全隐藏时长（秒），默认 0.3 */
  offDurationSeconds?: number;
}

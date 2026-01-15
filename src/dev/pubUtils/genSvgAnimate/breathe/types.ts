/**
 * breathe 动画的类型定义
 */

import type { SvgBeginEventType } from '@pub-utils/common/getSvgBegin';

/**
 * 基础动画选项
 */
export interface BaseBreatheOptions {
  /** 初始延迟（秒），默认 0 */
  delay?: number;
  /** 重复次数，0 表示无限循环，默认 0 */
  repeatCount?: number;
  /** 触发事件类型，留空或 'auto' 表示自动开始 */
  beginType?: SvgBeginEventType;
}

/**
 * 呼吸动画选项
 */
export interface BreatheOptions extends BaseBreatheOptions {
  /** 初始缩放比例，默认 1 */
  fromScale?: number;
  /** 目标缩放比例，默认 1.1 */
  toScale?: number;
  /** 一次呼吸时长（秒），默认 2 */
  onceBreatheDurationSeconds?: number;
  /**
   * 缓动曲线，支持字符串或数组
   * - string: 两个阶段使用相同曲线
   * - [string]: 两个阶段使用相同曲线
   * - [string, string]: 第一个用于放大，第二个用于缩小
   * @default '0.42 0 0.58 1' (ease-in-out)
   */
  keySplines?: string | string[];
  /**
   * 变换原点，默认 'center'
   * - 'center': 以图形中心为原点（推荐）
   * - 'origin': 以坐标原点(0,0)为原点
   * - 自定义: 如 '50% 50%' 或 '100 100'
   */
  transformOrigin?: 'center' | 'origin' | string;
  /**
   * 是否累加变换（与其他变换组合），默认 true
   * - true: 与其他动画叠加（推荐，可以同时使用多个动画）
   * - false: 替换其他变换
   */
  isAdditive?: boolean;
}

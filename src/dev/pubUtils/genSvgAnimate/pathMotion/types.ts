/**
 * genAnimatePathMotion 类型定义
 */

import type { SvgBeginEventType } from '@pub-utils/common/getSvgBegin';

/** 路径动画旋转模式 */
export type PathMotionRotateMode =
  | 'auto'           // 自动旋转，朝向运动方向（纸飞机推荐）
  | 'auto-reverse'   // 自动反向旋转（适合倒退物体）
  | number;          // 固定旋转角度（如 0, 45, 90）

/** 动画计算模式 */
export type AnimateCalcMode = 'spline' | 'linear' | 'discrete' | 'paced';

/** 路径动画配置 */
export interface PathMotionAnimationConfig {
  /**
   * 运动路径（SVG 路径语法，必填）
   *
   * @example
   * // 直线
   * path="M 0 0 L 200 100"
   *
   * // 贝塞尔曲线
   * path="M 100 250 C 320 100 760 400 980 250"
   *
   * // 8字形往返
   * path="M 100 250 C 320 100 760 400 980 250 C 760 100 320 400 100 250"
   */
  path: string;

  /**
   * 动画时长（秒），默认 6
   *
   * 注意：路径动画通常使用单一时长，不支持多段时间线
   * 如果需要复杂运动，应该在 path 中定义完整的运动轨迹
   */
  durationSeconds?: number;

  /**
   * 旋转模式，默认 'auto'
   *
   * - 'auto': 元素自动旋转，朝向运动方向（如飞机、箭头）
   * - 'auto-reverse': 反向旋转（适合倒退的物体）
   * - 0/45/90: 固定旋转角度（不随方向改变）
   *
   * @example
   * // 纸飞机：自动朝向
   * rotate: 'auto'
   *
   * // 滑动的盒子：不旋转
   * rotate: 0
   *
   * // 固定45度的箭头
   * rotate: 45
   */
  rotate?: PathMotionRotateMode;

  /**
   * 初始延迟（秒），默认 0
   */
  delay?: number;

  /**
   * 触发事件类型，留空或 'auto' 表示自动开始
   */
  beginType?: SvgBeginEventType;

  /**
   * 动画计算模式，默认 'linear'
   *
   * - 'linear': 线性运动（默认）
   * - 'spline': 使用缓动（需要配合 keySplines）
   * - 'paced': 等速运动
   *
   * 注意：'discrete' 对路径动画无意义（会直接跳到终点）
   */
  calcMode?: AnimateCalcMode;

  /**
   * 缓动参数（仅在 calcMode='spline' 时有效）
   *
   * 格式："x1 y1 x2 y2"（CSS cubic-bezier 格式）
   *
   * @example
   * // ease-in-out
   * keySplines: "0.42 0 0.58 1"
   *
   * // 自定义缓动
   * keySplines: "0.45 0 0.55 1"
   */
  keySplines?: string;

  /**
   * 关键时间点（仅在 calcMode='spline' 时使用）
   *
   * 格式："0; 0.5; 1"
   *
   * 注意：路径动画通常只有起点和终点，所以通常是 "0; 1"
   * 如果需要分段控制，需要分解为多个 path 动画
   */
  keyTimes?: string;

  /**
   * 是否保持最终状态，默认 false
   *
   * - true: 动画结束后停留在终点
   * - false: 动画结束后返回起点
   */
  isFreeze?: boolean;

  /**
   * 循环次数，0 表示无限循环，默认 0
   */
  loopCount?: number;
}

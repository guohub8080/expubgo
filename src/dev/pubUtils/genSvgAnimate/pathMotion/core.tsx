/**
 * genAnimatePathMotion 核心函数
 */

import React from 'react';
import { defaultTo } from 'es-toolkit/compat';
import { PathMotionAnimationConfig } from './types.ts';
import { getSvgBegin } from '@pub-utils/common/getSvgBegin';

/**
 * 生成路径动画的 animateMotion React 元素
 *
 * 使用 SVG 原生的 <animateMotion> 标签，让元素沿着指定路径移动
 *
 * @returns 返回 React <animateMotion> 元素
 * @example
 * ```tsx
 * // 纸飞机（8字形往返，自动旋转）
 * <g>
 *   <path d="..." fill="#94a3b8" />
 *   {genAnimatePathMotion({
 *     path: "M 100 250 C 320 100 760 400 980 250 C 760 100 320 400 100 250",
 *     durationSeconds: 6,
 *     rotate: 'auto',
 *     loopCount: 0
 *   })}
 * </g>
 *
 * // 滑动的方块（不旋转）
 * <rect x="0" y="0" width="50" height="50" fill="blue">
 *   {genAnimatePathMotion({
 *     path: "M 0 0 L 200 100",
 *     durationSeconds: 3,
 *     rotate: 0,
 *     isFreeze: true
 *   })}
 * </rect>
 *
 * // 点击触发的缓动运动
 * <circle r="20" fill="red">
 *   {genAnimatePathMotion({
 *     path: "M 50 50 L 200 50",
 *     durationSeconds: 2,
 *     rotate: 'auto',
 *     beginType: 'click',
 *     calcMode: 'spline',
 *     keySplines: "0.42 0 0.58 1"
 *   })}
 * </circle>
 * ```
 */
export function genAnimatePathMotion(config: PathMotionAnimationConfig) {
  const {
    path,
    durationSeconds = 6,
    rotate: rotateMode = 'auto',
    delay = 0,
    beginType,
    calcMode = 'linear',
    keySplines,
    keyTimes,
    isFreeze = false,
    loopCount = 0,
  } = config;

  // 参数验证：path 是必填
  if (!path) {
    throw new Error(
      'genAnimatePathMotion: 必须提供 path 参数\n' +
      '例如：genAnimatePathMotion({ path: "M 0 0 L 100 100", ... })'
    );
  }

  // 处理 begin 属性
  const beginValue = getSvgBegin(beginType, delay);

  // 处理 repeatCount
  const repeatCountValue = loopCount === 0 ? 'indefinite' : loopCount;

  // 处理 rotate 属性（数字类型需要转为字符串）
  const rotateValue = typeof rotateMode === 'number' ? rotateMode.toString() : rotateMode;

  // 处理 keyTimes（如果提供了 keySplines 但没有 keyTimes，使用默认值）
  const finalKeyTimes = defaultTo(keyTimes, '0; 1');

  // 生成 animateMotion 元素
  return (
    <animateMotion
      path={path}
      dur={`${durationSeconds}s`}
      rotate={rotateValue}
      repeatCount={repeatCountValue}
      begin={beginValue}
      calcMode={calcMode}
      keySplines={keySplines}
      keyTimes={calcMode === 'spline' ? finalKeyTimes : void 0}
      fill={isFreeze ? 'freeze' : 'remove'}
    />
  );
}

/**
 * 生成沿路径往返运动的动画（循环）
 *
 * 这是一个快捷函数，用于创建常见的往返路径动画
 *
 * @param path - 往返路径（起点和终点相同）
 * @param durationSeconds - 单程时长（秒），默认 6
 * @returns 返回 React <animateMotion> 元素
 * @example
 * ```tsx
 * // 8字形往返纸飞机
 * <g>
 *   <path d="..." fill="#94a3b8" />
 *   {genAnimatePathMotionLoop(
 *     "M 100 250 C 320 100 760 400 980 250 C 760 100 320 400 100 250",
 *     6
 *   )}
 * </g>
 * ```
 */
export function genAnimatePathMotionLoop(
  path: string,
  durationSeconds: number = 6
): React.ReactElement {
  return genAnimatePathMotion({
    path,
    durationSeconds,
    rotate: 'auto',
    loopCount: 0,
  });
}

/**
 * 生成沿路径滑动且不旋转的动画（适合方块、圆形等）
 *
 * @param path - 运动路径
 * @param durationSeconds - 时长（秒），默认 3
 * @param isFreeze - 是否保持最终状态，默认 false
 * @returns 返回 React <animateMotion> 元素
 * @example
 * ```tsx
 * // 滑动的盒子
 * <rect x="0" y="0" width="50" height="50" fill="blue">
 *   {genAnimatePathMotionSlide(
 *     "M 0 0 L 200 100",
 *     3,
 *     true
 *   )}
 * </rect>
 * ```
 */
export function genAnimatePathMotionSlide(
  path: string,
  durationSeconds: number = 3,
  isFreeze: boolean = false
): React.ReactElement {
  return genAnimatePathMotion({
    path,
    durationSeconds,
    rotate: 0,
    isFreeze,
    loopCount: 0,
  });
}

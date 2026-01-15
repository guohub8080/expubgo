/**
 * genAnimatePathStroke 辅助函数和常量
 */

import React from 'react';
import { genAnimatePathStroke } from './core.tsx';
import { getLinearBezier } from '@pub-utils/getBezier';

/**
 * 生成简单的路径绘制动画（从头到尾）
 * @param pathLength 路径总长度
 * @param duration 绘制时长（秒）
 * @param element 路径元素
 * @returns <g> 容器及动画
 * @example
 * genAnimatePathStrokeDraw(996, 2, <path d="..." />)
 */
export function genAnimatePathStrokeDraw(
  pathLength: number,
  duration: number,
  element: React.ReactNode
) {
  return genAnimatePathStroke({
    pathLength,
    timeline: [
      { durationSeconds: duration, toValue: 0, keySplines: getLinearBezier() }
    ],
    loopCount: 1,
    element
  });
}

/**
 * 生成点击触发的路径绘制动画（带延迟）
 * @param pathLength 路径总长度
 * @param duration 绘制时长（秒）
 * @param delayPercent 延迟占比（0-1），默认 0.001
 * @param element 路径元素
 * @returns <g> 容器及动画
 * @example
 * genAnimatePathStrokeDrawClick(996, 2, 0.001, <path d="..." />)
 */
export function genAnimatePathStrokeDrawClick(
  pathLength: number,
  duration: number,
  delayPercent: number = 0.001,
  element: React.ReactNode
) {
  const delayTime = duration * delayPercent;
  const drawTime = duration - delayTime;

  return genAnimatePathStroke({
    pathLength,
    beginType: 'click',
    restart: 'never',
    timeline: [
      { durationSeconds: delayTime, toValue: pathLength },
      { durationSeconds: drawTime, toValue: 0, keySplines: getLinearBezier() }
    ],
    loopCount: 1,
    element
  });
}

/**
 * 生成路径擦除动画（从有到无）
 * @param pathLength 路径总长度
 * @param duration 擦除时长（秒）
 * @param element 路径元素
 * @returns <g> 容器及动画
 * @example
 * genAnimatePathStrokeErase(996, 2, <path d="..." />)
 */
export function genAnimatePathStrokeErase(
  pathLength: number,
  duration: number,
  element: React.ReactNode
) {
  return genAnimatePathStroke({
    pathLength,
    initOffset: 0,
    timeline: [
      { durationSeconds: duration, toValue: pathLength, keySplines: getLinearBezier() }
    ],
    loopCount: 1,
    element
  });
}

/**
 * 生成路径循环绘制动画（绘制 → 擦除 → 重复）
 * @param pathLength 路径总长度
 * @param drawDuration 绘制时长（秒）
 * @param eraseDuration 擦除时长（秒）
 * @param element 路径元素
 * @returns <g> 容器及动画
 * @example
 * genAnimatePathStrokeLoop(996, 2, 2, <path d="..." />)
 */
export function genAnimatePathStrokeLoop(
  pathLength: number,
  drawDuration: number,
  eraseDuration: number,
  element: React.ReactNode
) {
  return genAnimatePathStroke({
    pathLength,
    timeline: [
      { durationSeconds: drawDuration, toValue: 0, keySplines: getLinearBezier() },
      { durationSeconds: eraseDuration, toValue: pathLength, keySplines: getLinearBezier() }
    ],
    loopCount: 0,
    element
  });
}

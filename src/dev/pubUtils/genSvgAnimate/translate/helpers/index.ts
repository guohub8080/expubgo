/**
 * 辅助函数和常量
 */

import { genAnimateTranslate } from '../core.tsx';
import { Point2D, TranslateAnimationConfig, TranslateTimelineSegment } from '../types.ts';

/**
 * 方向常量，用于快速创建方向性移动
 */
export const TranslateDirection = {
  /** 向右 */
  RIGHT: { x: 1, y: 0 },
  /** 向左 */
  LEFT: { x: -1, y: 0 },
  /** 向下 */
  DOWN: { x: 0, y: 1 },
  /** 向上 */
  UP: { x: 0, y: -1 },
  /** 右下 */
  RIGHT_DOWN: { x: 1, y: 1 },
  /** 右上 */
  RIGHT_UP: { x: 1, y: -1 },
  /** 左下 */
  LEFT_DOWN: { x: -1, y: 1 },
  /** 左上 */
  LEFT_UP: { x: -1, y: -1 },
} as const;

/**
 * 根据方向和距离创建简单的平移动画
 */
export function genAnimateTranslateByDirection(
  direction: { x: number; y: number },
  distance: number,
  duration: number = 1,
  options: Omit<TranslateAnimationConfig, 'timeline'> = {}
) {
  const toX = direction.x * distance;
  const toY = direction.y * distance;

  return genAnimateTranslate({
    ...options,
    timeline: [{ durationSeconds: duration, toValue: { x: toX, y: toY } }],
  });
}

/**
 * 创建往返循环动画
 */
export function genAnimateTranslateLoop(
  x: number,
  y: number,
  duration: number = 2,
  options: Omit<TranslateAnimationConfig, 'timeline' | 'loopCount'> = {}
) {
  return genAnimateTranslate({
    ...options,
    timeline: [
      { durationSeconds: duration, toValue: { x, y } },
      { durationSeconds: duration, toValue: { x: 0, y: 0 } },
    ],
    loopCount: 0,
  });
}

/**
 * 创建路径动画
 */
export function genAnimateTranslatePath(
  path: Point2D[],
  totalDuration: number = 3,
  options: Omit<TranslateAnimationConfig, 'timeline'> = {}
) {
  if (path.length < 1) {
    throw new Error('路径至少需要 1 个点');
  }

  const segmentDuration = totalDuration / path.length;
  const timeline: TranslateTimelineSegment[] = path.map(point => ({
    durationSeconds: segmentDuration,
    toValue: point,
  }));

  return genAnimateTranslate({
    ...options,
    timeline,
  });
}
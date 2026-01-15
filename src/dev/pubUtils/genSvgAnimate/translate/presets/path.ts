/**
 * 路径运动预设
 */

import { genAnimateTranslate } from '../core.tsx';

export const pathPresets = {
  /** S 形路径 */
  sPath: (width: number = 100, height: number = 50, duration: number = 3) =>
    genAnimateTranslate({
      timeline: [
        { durationSeconds: duration / 2, toValue: { x: width / 2, y: -height }, keySplines: '0.42 0 0.58 1' },
        { durationSeconds: duration / 2, toValue: { x: width, y: 0 }, keySplines: '0.42 0 0.58 1' },
      ],
    }),

  /** 圆形路径（近似） */
  circlePath: (radius: number = 50, duration: number = 4) =>
    genAnimateTranslate({
      timeline: [
        { durationSeconds: duration / 4, toValue: { x: radius, y: 0 }, keySplines: '0.42 0 0.58 1' },
        { durationSeconds: duration / 4, toValue: { x: radius, y: radius }, keySplines: '0.42 0 0.58 1' },
        { durationSeconds: duration / 4, toValue: { x: 0, y: radius }, keySplines: '0.42 0 0.58 1' },
        { durationSeconds: duration / 4, toValue: { x: 0, y: 0 }, keySplines: '0.42 0 0.58 1' },
      ],
      loopCount: 0,
    }),

  /** Z 字形路径 */
  zPath: (width: number = 100, height: number = 100, duration: number = 3) =>
    genAnimateTranslate({
      timeline: [
        { durationSeconds: duration / 3, toValue: { x: width }, keySplines: '0.5 0 0.5 1' },
        { durationSeconds: duration / 3, toValue: { x: width, y: height }, keySplines: '0.5 0 0.5 1' },
        { durationSeconds: duration / 3, toValue: { x: width * 2, y: height }, keySplines: '0.5 0 0.5 1' },
      ],
    }),

  /** 抛物线路径（模拟投掷效果） */
  parabola: (distance: number = 200, height: number = 100, duration: number = 2) =>
    genAnimateTranslate({
      timeline: [
        { durationSeconds: duration / 2, toValue: { x: distance / 2, y: -height }, keySplines: '0.33 0.66 0.66 1' },
        { durationSeconds: duration / 2, toValue: { x: distance, y: 0 }, keySplines: '0.33 0 0.66 0.33' },
      ],
    }),
};

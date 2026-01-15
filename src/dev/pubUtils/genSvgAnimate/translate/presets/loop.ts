/**
 * 循环运动预设
 */

import { genAnimateTranslate } from '../core.tsx';

export const loopPresets = {
  /** 水平往返（左右摇摆） */
  swingHorizontal: (distance: number = 50, duration: number = 1) =>
    genAnimateTranslate({
      timeline: [
        { durationSeconds: duration, toValue: { x: distance }, keySplines: '0.42 0 0.58 1' },
        { durationSeconds: duration, toValue: { x: -distance }, keySplines: '0.42 0 0.58 1' },
        { durationSeconds: duration, toValue: { x: 0 }, keySplines: '0.42 0 0.58 1' },
      ],
      loopCount: 0,
    }),

  /** 垂直浮动（上下浮动） */
  floatVertical: (distance: number = 20, duration: number = 3) =>
    genAnimateTranslate({
      timeline: [
        { durationSeconds: duration / 2, toValue: { y: -distance }, keySplines: '0.37 0 0.63 1' },
        { durationSeconds: duration / 2, toValue: { y: 0 }, keySplines: '0.37 0 0.63 1' },
      ],
      loopCount: 0,
    }),

  /** 无限滚动（水平） */
  scrollHorizontal: (distance: number = 100, duration: number = 2) =>
    genAnimateTranslate({
      timeline: [{ durationSeconds: duration, toValue: { x: distance }, keySplines: '0 0 1 1' }],
      loopCount: 0,
      isFreeze: false,
    }),
};

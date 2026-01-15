/**
 * 基础移动预设
 */

import { genAnimateTranslate } from '../core.tsx';

export const movePresets = {
  /** 向右移动 */
  right: (distance: number = 100, duration: number = 1) =>
    genAnimateTranslate({
      timeline: [{ durationSeconds: duration, toValue: { x: distance } }],
    }),

  /** 向左移动 */
  left: (distance: number = 100, duration: number = 1) =>
    genAnimateTranslate({
      timeline: [{ durationSeconds: duration, toValue: { x: -distance } }],
    }),

  /** 向下移动 */
  down: (distance: number = 100, duration: number = 1) =>
    genAnimateTranslate({
      timeline: [{ durationSeconds: duration, toValue: { y: distance } }],
    }),

  /** 向上移动 */
  up: (distance: number = 100, duration: number = 1) =>
    genAnimateTranslate({
      timeline: [{ durationSeconds: duration, toValue: { y: -distance } }],
    }),
};

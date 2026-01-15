/**
 * 特效预设
 */

import { genAnimateTranslate } from '../core.tsx';

export const effectPresets = {
  /** 延迟移动（移动-停留-返回） */
  delayedBounce: (distance: number = 100, moveDur: number = 1, stayDur: number = 2) =>
    genAnimateTranslate({
      timeline: [
        { durationSeconds: moveDur, toValue: { x: distance }, keySplines: '0.42 0 0.58 1' },
        { durationSeconds: stayDur }, // 保持位置
        { durationSeconds: moveDur, toValue: { x: 0 }, keySplines: '0.42 0 0.58 1' },
      ],
      loopCount: 0,
    }),

  /** 弹性移动（带回弹效果） */
  elastic: (distance: number = 100, duration: number = 1) =>
    genAnimateTranslate({
      timeline: [
        { durationSeconds: duration, toValue: { x: distance }, keySplines: '0.68 -0.55 0.265 1.55' },
      ],
      isFreeze: true,
    }),

  /** 阶梯移动（离散跳转） */
  stepped: (steps: number[] = [50, 100, 150, 200], stepDuration: number = 0.5) =>
    genAnimateTranslate({
      timeline: steps.map(x => ({
        durationSeconds: stepDuration,
        toValue: { x },
      })),
      calcMode: 'discrete',
    }),

  /** 抖动效果（快速左右） */
  shake: (intensity: number = 10, duration: number = 0.5) =>
    genAnimateTranslate({
      timeline: [
        { durationSeconds: duration / 6, toValue: { x: -intensity } },
        { durationSeconds: duration / 6, toValue: { x: intensity } },
        { durationSeconds: duration / 6, toValue: { x: -intensity } },
        { durationSeconds: duration / 6, toValue: { x: intensity } },
        { durationSeconds: duration / 6, toValue: { x: -intensity } },
        { durationSeconds: duration / 6, toValue: { x: 0 } },
      ],
      calcMode: 'linear',
    }),

  /** 点击触发移动 */
  onClick: (x: number = 100, y: number = 0, duration: number = 1) =>
    genAnimateTranslate({
      timeline: [{ durationSeconds: duration, toValue: { x, y } }],
      beginType: 'click',
      isFreeze: true,
    }),
};

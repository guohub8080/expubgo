/**
 * genAnimateSkewY 预设效果
 */

import { genAnimateSkewY } from './core.tsx';

/**
 * 预设的垂直斜切动画效果
 */
export const skewYPresets = {
  /** 上下摇摆 */
  swing: (amplitude: number = 12, duration: number = 2) =>
    genAnimateSkewY({
      initAngle: -amplitude,
      timeline: [
        { durationSeconds: duration / 2, toValue: amplitude, keySplines: '0.45 0 0.55 1' },
        { durationSeconds: duration / 2, toValue: -amplitude, keySplines: '0.45 0 0.55 1' },
      ],
      loopCount: 0,
    }),

  /** 点击斜切 */
  clickSkew: (angle: number = 15, duration: number = 0.5) =>
    genAnimateSkewY({
      timeline: [{ durationSeconds: duration, toValue: angle }],
      beginType: 'click',
      isFreeze: true,
    }),

  /** 往返斜切 */
  backAndForth: (angle: number = 15, duration: number = 1) =>
    genAnimateSkewY({
      timeline: [
        { durationSeconds: duration, toValue: angle },
        { durationSeconds: duration, toValue: 0 },
      ],
      loopCount: 0,
    }),

  /** 弹性斜切 */
  elastic: (angle: number = 20, duration: number = 0.8) =>
    genAnimateSkewY({
      timeline: [{ 
        durationSeconds: duration, 
        toValue: angle, 
        keySplines: '0.68 -0.55 0.265 1.55' 
      }],
      isFreeze: true,
    }),

  /** 抖动效果 */
  shake: (intensity: number = 4, duration: number = 0.5) =>
    genAnimateSkewY({
      timeline: [
        { durationSeconds: duration / 6, toValue: -intensity },
        { durationSeconds: duration / 6, toValue: intensity },
        { durationSeconds: duration / 6, toValue: -intensity },
        { durationSeconds: duration / 6, toValue: intensity },
        { durationSeconds: duration / 6, toValue: -intensity },
        { durationSeconds: duration / 6, toValue: 0 },
      ],
      calcMode: 'linear',
    }),

  /** 波浪斜切 */
  wave: (amplitude: number = 15, duration: number = 4) =>
    genAnimateSkewY({
      timeline: [
        { durationSeconds: duration / 4, toValue: amplitude },
        { durationSeconds: duration / 4, toValue: -amplitude },
        { durationSeconds: duration / 4, toValue: amplitude },
        { durationSeconds: duration / 4, toValue: 0 },
      ],
      loopCount: 0,
    }),
};


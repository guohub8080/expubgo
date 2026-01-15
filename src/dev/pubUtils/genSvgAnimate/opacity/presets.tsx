/**
 * genAnimateOpacity 预设效果
 */

import { genAnimateOpacity } from './core.tsx';

/**
 * 预设的不透明度动画效果
 */
export const opacityPresets = {
  /** 淡入（从透明到不透明） */
  fadeIn: (duration: number = 1) =>
    genAnimateOpacity({
      initOpacity: 0,
      timeline: [{ durationSeconds: duration, toValue: 1 }],
      isFreeze: true,
    }),

  /** 淡出（从不透明到透明） */
  fadeOut: (duration: number = 1) =>
    genAnimateOpacity({
      initOpacity: 1,
      timeline: [{ durationSeconds: duration, toValue: 0 }],
      isFreeze: true,
    }),

  /** 呼吸效果（淡入淡出循环） */
  breathe: (minOpacity: number = 0.3, duration: number = 2) =>
    genAnimateOpacity({
      initOpacity: 1,
      timeline: [
        { durationSeconds: duration, toValue: minOpacity },
        { durationSeconds: duration, toValue: 1 },
      ],
      loopCount: 0,
    }),

  /** 闪烁效果（快速明暗切换） */
  blink: (blinkCount: number = 3, duration: number = 1.5) => {
    const singleBlinkDuration = duration / blinkCount / 2;
    const timeline = [];
    
    for (let i = 0; i < blinkCount; i++) {
      timeline.push(
        { durationSeconds: singleBlinkDuration, toValue: 0 },
        { durationSeconds: singleBlinkDuration, toValue: 1 }
      );
    }

    return genAnimateOpacity({
      timeline,
    });
  },

  /** 慢闪烁（较慢的明暗循环） */
  slowBlink: (duration: number = 2) =>
    genAnimateOpacity({
      timeline: [
        { durationSeconds: duration / 2, toValue: 0.2 },
        { durationSeconds: duration / 2, toValue: 1 },
      ],
      loopCount: 0,
    }),

  /** 渐显（延迟后淡入） */
  delayedFadeIn: (delayTime: number = 0.5, duration: number = 1) =>
    genAnimateOpacity({
      initOpacity: 0,
      timeline: [{ durationSeconds: duration, toValue: 1 }],
      delay: delayTime,
      isFreeze: true,
    }),

  /** 脉冲效果（快速淡入淡出） */
  pulse: (duration: number = 0.5) =>
    genAnimateOpacity({
      timeline: [
        { durationSeconds: duration / 2, toValue: 0.4 },
        { durationSeconds: duration / 2, toValue: 1 },
      ],
      loopCount: 0,
    }),

  /** 点击淡入 */
  clickFadeIn: (duration: number = 0.5) =>
    genAnimateOpacity({
      initOpacity: 0,
      timeline: [{ durationSeconds: duration, toValue: 1 }],
      beginType: 'click',
      isFreeze: true,
    }),

  /** 点击淡出 */
  clickFadeOut: (duration: number = 0.5) =>
    genAnimateOpacity({
      initOpacity: 1,
      timeline: [{ durationSeconds: duration, toValue: 0 }],
      beginType: 'click',
      isFreeze: true,
    }),

  /** 淡入后停留再淡出 */
  fadeInOutCycle: (fadeInDur: number = 1, stayDur: number = 2, fadeOutDur: number = 1) =>
    genAnimateOpacity({
      initOpacity: 0,
      timeline: [
        { durationSeconds: fadeInDur, toValue: 1 },
        { durationSeconds: stayDur },  // 保持不透明
        { durationSeconds: fadeOutDur, toValue: 0 },
      ],
      loopCount: 0,
    }),

  /** 快速淡入 */
  quickFadeIn: () =>
    genAnimateOpacity({
      initOpacity: 0,
      timeline: [{ durationSeconds: 0.3, toValue: 1 }],
      isFreeze: true,
    }),

  /** 快速淡出 */
  quickFadeOut: () =>
    genAnimateOpacity({
      initOpacity: 1,
      timeline: [{ durationSeconds: 0.3, toValue: 0 }],
      isFreeze: true,
    }),

  /** 线性淡入（匀速） */
  linearFadeIn: (duration: number = 1) =>
    genAnimateOpacity({
      initOpacity: 0,
      timeline: [{ durationSeconds: duration, toValue: 1, keySplines: '0 0 1 1' }],
      isFreeze: true,
    }),

  /** 线性淡出（匀速） */
  linearFadeOut: (duration: number = 1) =>
    genAnimateOpacity({
      initOpacity: 1,
      timeline: [{ durationSeconds: duration, toValue: 0, keySplines: '0 0 1 1' }],
      isFreeze: true,
    }),

  /** 幽灵效果（半透明循环） */
  ghost: (duration: number = 3) =>
    genAnimateOpacity({
      initOpacity: 1,
      timeline: [
        { durationSeconds: duration / 2, toValue: 0.5 },
        { durationSeconds: duration / 2, toValue: 1 },
      ],
      loopCount: 0,
    }),

  /** 波浪渐变（多段平滑过渡） */
  wave: (duration: number = 4) =>
    genAnimateOpacity({
      timeline: [
        { durationSeconds: duration / 4, toValue: 0.3 },
        { durationSeconds: duration / 4, toValue: 0.7 },
        { durationSeconds: duration / 4, toValue: 0.3 },
        { durationSeconds: duration / 4, toValue: 1 },
      ],
      loopCount: 0,
    }),

  /** 心跳效果 */
  heartbeat: () =>
    genAnimateOpacity({
      timeline: [
        { durationSeconds: 0.2, toValue: 0.6 },
        { durationSeconds: 0.2, toValue: 1 },
        { durationSeconds: 0.2, toValue: 0.6 },
        { durationSeconds: 0.2, toValue: 1 },
        { durationSeconds: 0.8 },  // 停顿
      ],
      loopCount: 0,
    }),
};


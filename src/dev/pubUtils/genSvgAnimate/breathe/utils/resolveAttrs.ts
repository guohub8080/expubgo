/**
 * breathe 动画的工具函数
 */

import { getSvgBegin } from '@pub-utils/common/getSvgBegin';
import type { SvgBeginEventType } from '@pub-utils/common/getSvgBegin';

/**
 * 处理 begin 属性
 */
export const resolveBeginAttr = (
  delay: number,
  beginType?: SvgBeginEventType
): string | undefined => {
  return getSvgBegin(beginType, delay);
};

/**
 * 处理 repeatCount 属性
 */
export const resolveRepeatCountAttr = (
  repeatCount: number
): string | number => {
  return repeatCount === 0 ? 'indefinite' : repeatCount;
};

/**
 * 处理 keySplines 属性
 */
export const resolveKeySplines = (
  keySplines: string | string[]
): string => {
  if (typeof keySplines === 'string') {
    // 字符串：来回都用同一个
    return `${keySplines};${keySplines}`;
  } else if (Array.isArray(keySplines)) {
    if (keySplines.length === 1) {
      // 数组只有一个元素：来回都用同一个
      return `${keySplines[0]};${keySplines[0]}`;
    } else if (keySplines.length === 2) {
      // 数组有两个元素：第一个用于放大，第二个用于缩小
      return `${keySplines[0]};${keySplines[1]}`;
    } else {
      // 三个及以上：报错
      throw new Error(`keySplines 数组长度必须是 1 或 2，当前长度为 ${keySplines.length}`);
    }
  } else {
    throw new Error(`keySplines 必须是 string 或 string[]`);
  }
};

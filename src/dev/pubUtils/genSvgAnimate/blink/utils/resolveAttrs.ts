/**
 * blink 动画的工具函数
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

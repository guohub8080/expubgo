import type { SvgBeginEventType } from '../../common/getSvgBegin';

export interface SetOptions {
  /** 触发事件类型，默认 auto（自动开始） */
  beginType?: SvgBeginEventType;
  /** 延迟时间（秒），默认 0 */
  delay?: number;
  /** 是否冻结在 to 值，默认 false */
  isFreeze?: boolean;
  /** set 持续时长，默认 'indefinite'（数字为秒数，或字符串如 '0.3s'） */
  dur?: number | string;
}

export interface GenSetOptions extends SetOptions {
  /** 要切换的属性名 */
  attributeName: string;
  /** 目标值 */
  to: string;
}

export interface GenSetVisibilityOptions extends SetOptions {
  to: 'visible' | 'hidden';
}

export interface GenSetOpacityOptions extends SetOptions {
  to: number;
}

export interface GenSetDisplayOptions extends SetOptions {
  to: string;
}

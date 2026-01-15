/**
 * SVG 动画 begin 属性工具函数
 *
 * 参考 W3C SVG 1.1 规范：
 * https://www.w3.org/TR/SVG11/animate.html
 *
 * 事件类型对应 SVG DTD 中的事件属性（去掉 'on' 前缀）
 * 例如：onclick → click, onmouseover → mouseover
 */

/**
 * SVG 动画开始事件类型
 *
 * 支持的事件类型包括：
 * - 鼠标事件: click, mousedown, mouseup, mouseover, mouseout, mousemove
 * - 键盘事件: keydown, keyup, keypress
 * - 焦点事件: focusin, focusout, focus, blur
 * - 文档事件: load, unload, abort, error, resize, scroll, zoom
 * - 动画事件: beginEvent, endEvent, repeatEvent
 */
export type SvgBeginEventType =
// 鼠标事件
  | 'click'
  | 'mousedown'
  | 'mouseup'
  | 'mouseover'
  | 'mouseout'
  | 'mousemove'
  // 键盘事件
  | 'keydown'
  | 'keyup'
  | 'keypress'
  // 焦点事件
  | 'focusin'
  | 'focusout'
  | 'focus'
  | 'blur'
  // 文档/窗口事件
  | 'load'
  | 'unload'
  | 'resize'
  | 'scroll'
  | 'zoom'
  // 动画事件（用于同步其他动画）
  | 'beginEvent'
  | 'endEvent'
  | 'repeatEvent'
// 自定义
  | "auto"
  | undefined | null | string

/**
 * 生成 SVG 动画的 begin 属性值
 *
 * @param eventType 触发事件类型，留空表示自动开始
 * @param delay 延迟时间（秒），默认 0
 * @returns begin 属性值，不需要 begin 时返回 undefined
 * @example
 * ```ts
 * // 自动开始，无延迟
 * getSvgBegin()  // undefined
 *
 * // 自动开始，延迟 2 秒
 * getSvgBegin(undefined, 2)  // '2s'
 *
 * // 点击触发，无延迟
 * getSvgBegin('click')  // 'click'
 *
 * // 点击触发，延迟 2 秒
 * getSvgBegin('click', 2)  // 'click+2s'
 *
 * // 鼠标悬停触发
 * getSvgBegin('mouseover')  // 'mouseover'
 *
 * // 键盘按下触发
 * getSvgBegin('keydown')  // 'keydown'
 *
 * // 其他动画的 begin 事件触发（同步）
 * getSvgBegin('otherAnim.beginEvent')  // 'otherAnim.beginEvent'
 * ```
 */
export function getSvgBegin(eventType?: SvgBeginEventType, delay: number = 0): string | undefined {
  if (!eventType || eventType === 'auto') {
    // 自动开始模式
    return delay !== 0 ? `${delay}s` : void 0;
  }

  // 事件触发模式（支持 ID.eventType 格式）
  return delay !== 0 ? `${eventType}+${delay}s` : eventType;
}

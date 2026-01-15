/**
 * breathe 动画的样式常量
 */

import type { CSSProperties } from 'react';

/**
 * 中心缩放的样式对象
 * 用于让缩放动画以元素中心为原点
 *
 * @example
 * ```tsx
 * <g style={centerBreatheStyle}>
 *   {genAnimateBreathe()}
 *   <rect width="100" height="100" fill="red" />
 * </g>
 * ```
 */
export const centerBreatheStyle: CSSProperties = {
  transformOrigin: 'center',
  transformBox: 'fill-box'
};

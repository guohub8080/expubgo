/**
 * genSvgAnimate 工具函数集
 */

import { isArray, isEmpty } from 'es-toolkit/compat';

// ============================================ 非空数组验证 ============================================

/**
 * 验证值是否为非空数组，否则抛出错误
 *
 * @param value - 要验证的值
 * @param paramName - 参数名称（用于错误信息）
 * @throws {Error} 如果值不是数组或数组为空
 * @example
 * ```ts
 * assertNonEmptyArray(timeline, 'timeline')  // 通过验证
 * assertNonEmptyArray([], 'timeline')         // 抛出 Error: timeline 必须是非空数组
 * assertNonEmptyArray(null, 'timeline')       // 抛出 Error: timeline 必须是非空数组
 * ```
 */
export function assertNonEmptyArray<T>(value: unknown, paramName: string = 'array'): asserts value is T[] {
  if (!isArray(value) || isEmpty(value)) {
    throw new Error(`${paramName} 必须是非空数组`);
  }
}

/**
 * 检查值是否为非空数组
 *
 * @param value - 要检查的值
 * @returns 如果是非空数组返回 true，否则返回 false
 * @example
 * ```ts
 * isNonEmptyArray([1, 2, 3])   // true
 * isNonEmptyArray([])           // false
 * isNonEmptyArray(null)         // false
 * isNonEmptyArray('string')     // false
 * ```
 */
export function isNonEmptyArray<T>(value: unknown): value is T[] {
  return isArray(value) && !isEmpty(value);
}

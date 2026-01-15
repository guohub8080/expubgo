import {CSSProperties} from "react";

// ============================================ 内边距 (Padding) ============================================

/**
 * 内边距 - 所有方向
 */
export const p = (value: number): CSSProperties => ({
    padding: value
})

/**
 * 内边距 - 水平方向 (左右)
 */
export const px = (value: number): CSSProperties => ({
    paddingLeft: value / 2,
    paddingRight: value / 2
})

/**
 * 内边距 - 垂直方向 (上下)
 */
export const py = (value: number): CSSProperties => ({
    paddingTop: value / 2,
    paddingBottom: value / 2
})

/**
 * 内边距 - 上
 */
export const pt = (value: number): CSSProperties => ({
    paddingTop: value
})

/**
 * 内边距 - 右
 */
export const pr = (value: number): CSSProperties => ({
    paddingRight: value
})

/**
 * 内边距 - 下
 */
export const pb = (value: number): CSSProperties => ({
    paddingBottom: value
})

/**
 * 内边距 - 左
 */
export const pl = (value: number): CSSProperties => ({
    paddingLeft: value
})

// ============================================ 外边距 (Margin) ============================================

/**
 * 外边距 - 所有方向
 */
export const m = (value: number): CSSProperties => ({
    margin: value
})

/**
 * 外边距 - 水平方向 (左右)
 */
export const mx = (value: number): CSSProperties => ({
    marginLeft: value / 2,
    marginRight: value / 2
})

/**
 * 外边距 - 垂直方向 (上下)
 */
export const my = (value: number): CSSProperties => ({
    marginTop: value / 2,
    marginBottom: value / 2
})

/**
 * 外边距 - 上
 */
export const mt = (value: number): CSSProperties => ({
    marginTop: value
})

/**
 * 外边距 - 右
 */
export const mr = (value: number): CSSProperties => ({
    marginRight: value
})

/**
 * 外边距 - 下
 */
export const mb = (value: number): CSSProperties => ({
    marginBottom: value
})

/**
 * 外边距 - 左
 */
export const ml = (value: number): CSSProperties => ({
    marginLeft: value
})

import {CSSProperties} from "react";

/**
 * 字体大小
 */
export const textSize = (value: number | string): CSSProperties => ({
    fontSize: value
})

/**
 * 字体粗细
 */
export const fontWeight = (value: CSSProperties["fontWeight"]): CSSProperties => ({
    fontWeight: value
})

/**
 * 文字对齐
 */
export const textAlign = (value: CSSProperties["textAlign"]): CSSProperties => ({
    textAlign: value
})

/**
 * 行高
 */
export const leading = (value: number | string): CSSProperties => ({
    lineHeight: value
})

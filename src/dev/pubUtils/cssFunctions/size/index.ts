import {CSSProperties} from "react";

/**
 * 宽度
 */
export const w = (value: number | string): CSSProperties => ({
    width: value
})

/**
 * 高度
 */
export const h = (value: number | string): CSSProperties => ({
    height: value
})

/**
 * 最大宽度
 */
export const maxW = (value: number | string): CSSProperties => ({
    maxWidth: value
})

/**
 * 最大高度
 */
export const maxH = (value: number | string): CSSProperties => ({
    maxHeight: value
})

/**
 * 最小宽度
 */
export const minW = (value: number | string): CSSProperties => ({
    minWidth: value
})

/**
 * 最小高度
 */
export const minH = (value: number | string): CSSProperties => ({
    minHeight: value
})

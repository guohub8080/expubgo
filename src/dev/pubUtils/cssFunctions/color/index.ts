import {CSSProperties} from "react";

/**
 * 文字颜色
 */
export const textColor = (value: string): CSSProperties => ({
    color: value
})

/**
 * 背景颜色
 */
export const bgColor = (value: string): CSSProperties => ({
    backgroundColor: value
})

/**
 * 边框颜色
 */
export const borderColor = (value: string): CSSProperties => ({
    borderColor: value
})

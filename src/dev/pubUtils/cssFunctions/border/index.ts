import {CSSProperties} from "react";

// ============================================ 边框宽度 ============================================

/**
 * 边框宽度 - 所有方向
 */
export const borderWidth = (value: number): CSSProperties => ({
    borderWidth: value
})

/**
 * 边框宽度 - 水平方向 (左右)
 */
export const borderX = (value: number): CSSProperties => ({
    borderLeftWidth: value / 2,
    borderRightWidth: value / 2
})

/**
 * 边框宽度 - 垂直方向 (上下)
 */
export const borderY = (value: number): CSSProperties => ({
    borderTopWidth: value / 2,
    borderBottomWidth: value / 2
})

/**
 * 边框宽度 - 上
 */
export const borderTop = (value: number): CSSProperties => ({
    borderTopWidth: value
})

/**
 * 边框宽度 - 右
 */
export const borderRight = (value: number): CSSProperties => ({
    borderRightWidth: value
})

/**
 * 边框宽度 - 下
 */
export const borderBottom = (value: number): CSSProperties => ({
    borderBottomWidth: value
})

/**
 * 边框宽度 - 左
 */
export const borderLeft = (value: number): CSSProperties => ({
    borderLeftWidth: value
})

/**
 * 边框样式 - 所有方向
 */
export const borderStyle = (value: CSSProperties["borderStyle"]): CSSProperties => ({
    borderStyle: value
})

// ============================================ 圆角 ============================================

/**
 * 圆角 - 所有方向
 */
export const rounded = (value: number): CSSProperties => ({
    borderRadius: value
})

/**
 * 圆角 - 仅左上
 */
export const roundedTl = (value: number): CSSProperties => ({
    borderTopLeftRadius: value
})

/**
 * 圆角 - 仅右上
 */
export const roundedTr = (value: number): CSSProperties => ({
    borderTopRightRadius: value
})

/**
 * 圆角 - 仅右下
 */
export const roundedBr = (value: number): CSSProperties => ({
    borderBottomRightRadius: value
})

/**
 * 圆角 - 仅左下
 */
export const roundedBl = (value: number): CSSProperties => ({
    borderBottomLeftRadius: value
})

/**
 * 圆角 - 顶部
 */
export const roundedT = (value: number): CSSProperties => ({
    borderTopLeftRadius: value,
    borderTopRightRadius: value
})

/**
 * 圆角 - 右侧
 */
export const roundedR = (value: number): CSSProperties => ({
    borderTopRightRadius: value,
    borderBottomRightRadius: value
})

/**
 * 圆角 - 底部
 */
export const roundedB = (value: number): CSSProperties => ({
    borderBottomLeftRadius: value,
    borderBottomRightRadius: value
})

/**
 * 圆角 - 左侧
 */
export const roundedL = (value: number): CSSProperties => ({
    borderTopLeftRadius: value,
    borderBottomLeftRadius: value
})

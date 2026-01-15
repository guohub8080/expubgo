import {CSSProperties} from "react";

/**
 * 显示
 */
export const display = (value: CSSProperties["display"]): CSSProperties => ({
    display: value
})

/**
 * Flex 方向
 */
export const flexDir = (value: CSSProperties["flexDirection"]): CSSProperties => ({
    flexDirection: value
})

/**
 * Flex 对齐 - 主轴
 */
export const justify = (value: CSSProperties["justifyContent"]): CSSProperties => ({
    justifyContent: value
})

/**
 * Flex 对齐 - 交叉轴
 */
export const items = (value: CSSProperties["alignItems"]): CSSProperties => ({
    alignItems: value
})

/**
 * 定位
 */
export const position = (value: CSSProperties["position"]): CSSProperties => ({
    position: value
})

/**
 * 顶部位置
 */
export const top = (value: number | string): CSSProperties => ({
    top: value
})

/**
 * 右侧位置
 */
export const right = (value: number | string): CSSProperties => ({
    right: value
})

/**
 * 底部位置
 */
export const bottom = (value: number | string): CSSProperties => ({
    bottom: value
})

/**
 * 左侧位置
 */
export const left = (value: number | string): CSSProperties => ({
    left: value
})

/**
 * Z轴层级
 */
export const z = (value: number): CSSProperties => ({
    zIndex: value
})

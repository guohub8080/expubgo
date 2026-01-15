import {CSSProperties} from "react";

// ============================================ 定位预设 ============================================

/**
 * 绝对定位 - 填满父容器
 */
export const absoluteFill: CSSProperties = {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
}

/**
 * 固定定位 - 填满视口
 */
export const fixedFill: CSSProperties = {
    position: "fixed",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
}

/**
 * 相对定位
 */
export const relative: CSSProperties = {
    position: "relative"
}

/**
 * 绝对定位
 */
export const absolute: CSSProperties = {
    position: "absolute"
}

/**
 * 固定定位
 */
export const fixed: CSSProperties = {
    position: "fixed"
}

/**
 * 粘性定位
 */
export const sticky: CSSProperties = {
    position: "sticky"
}

/**
 * 静态定位
 */
export const static_: CSSProperties = {
    position: "static"
}

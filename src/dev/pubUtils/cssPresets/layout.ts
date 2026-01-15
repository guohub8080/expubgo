import {CSSProperties} from "react";

// ============================================ 布局预设 ============================================

/**
 * Flex 布局 - 行方向
 */
export const flexRow: CSSProperties = {
    display: "flex",
    flexDirection: "row"
}

/**
 * Flex 布局 - 列方向
 */
export const flexCol: CSSProperties = {
    display: "flex",
    flexDirection: "column"
}

/**
 * Flex 布局 - 居中
 */
export const flexCenter: CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
}

/**
 * Flex 布局 - 水平居中
 */
export const flexCenterX: CSSProperties = {
    display: "flex",
    justifyContent: "center"
}

/**
 * Flex 布局 - 垂直居中
 */
export const flexCenterY: CSSProperties = {
    display: "flex",
    alignItems: "center"
}

/**
 * Flex 布局 - 两端对齐
 */
export const flexBetween: CSSProperties = {
    display: "flex",
    justifyContent: "space-between"
}

/**
 * Flex 布局 - 均匀分布
 */
export const flexAround: CSSProperties = {
    display: "flex",
    justifyContent: "space-around"
}

/**
 * Flex 布局 - 等间距分布
 */
export const flexEvenly: CSSProperties = {
    display: "flex",
    justifyContent: "space-evenly"
}

/**
 * Grid 布局
 */
export const grid: CSSProperties = {
    display: "grid"
}

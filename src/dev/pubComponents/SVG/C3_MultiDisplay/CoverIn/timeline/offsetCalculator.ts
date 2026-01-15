import { Direction, Point } from "../types";

/**
 * 方向位移计算器
 * 职责：根据方向和视图尺寸计算位移坐标
 */

/**
 * 根据方向获取初始位置
 * 图片开始时位于屏幕外，需要从这个位置滑入
 *
 * @param direction - 滑入方向
 * @param viewBoxW - 视图宽度
 * @param viewBoxH - 视图高度
 * @returns 初始坐标 {x, y}
 */
export const getInitialPosition = (
    direction: Direction,
    viewBoxW: number,
    viewBoxH: number
): Point => {
    // 注意：这里使用 viewBoxW + 1 确保完全移出视图
    switch (direction) {
        case "T": // 从下往上滑入：初始在下方
            return { x: 0, y: viewBoxH + 1 };
        case "B": // 从上往下滑入：初始在上方
            return { x: 0, y: -(viewBoxH + 1) };
        case "L": // 从右往左滑入：初始在右方
            return { x: viewBoxW + 1, y: 0 };
        case "R": // 从左往右滑入：初始在左方
            return { x: -(viewBoxW + 1), y: 0 };
    }
};

/**
 * 根据方向获取平移距离（字符串格式，用于 SVG animateTransform 的 values）
 * 从初始位置平移到中心（0, 0）需要的相对位移
 *
 * @param direction - 滑入方向
 * @param viewBoxW - 视图宽度
 * @param viewBoxH - 视图高度
 * @returns 平移字符串 "x y"
 */
export const getTranslateOffset = (
    direction: Direction,
    viewBoxW: number,
    viewBoxH: number
): string => {
    const offset = viewBoxW + 1;
    const offsetY = viewBoxH + 1;

    switch (direction) {
        case "T": // 从下往上：需要向上平移
            return `0 -${offsetY}`;
        case "B": // 从上往下：需要向下平移
            return `0 ${offsetY}`;
        case "L": // 从右往左：需要向左平移
            return `-${offset} 0`;
        case "R": // 从左往右：需要向右平移
            return `${offset} 0`;
    }
};

import { Direction } from "../types";

/**
 * 方向位移计算器
 * 职责：根据方向和视图尺寸计算位移坐标
 */

/**
 * 根据方向获取初始位置偏移量
 *
 * @param direction - 移动方向
 * @param viewBoxW - 视图宽度
 * @param viewBoxH - 视图高度
 * @returns 初始位置偏移坐标 {x, y}
 */
export const getInitialOffset = (
    direction: Direction,
    viewBoxW: number,
    viewBoxH: number
): { x: number; y: number } => {
    switch (direction) {
        case "L": return { x: viewBoxW, y: 0 };       // 从右侧开始
        case "R": return { x: -viewBoxW, y: 0 };      // 从左侧开始
        case "T": return { x: 0, y: viewBoxH };       // 从下方开始
        case "B": return { x: 0, y: -viewBoxH };      // 从上方开始
    }
};

/**
 * 根据方向获取退出位置偏移量
 *
 * @param direction - 移动方向
 * @param viewBoxW - 视图宽度
 * @param viewBoxH - 视图高度
 * @returns 退出位置偏移坐标 {x, y}
 */
export const getExitOffset = (
    direction: Direction,
    viewBoxW: number,
    viewBoxH: number
): { x: number; y: number } => {
    switch (direction) {
        case "L": return { x: -viewBoxW, y: 0 };      // 退出到左侧
        case "R": return { x: viewBoxW, y: 0 };       // 退出到右侧
        case "T": return { x: 0, y: -viewBoxH };      // 退出到上方
        case "B": return { x: 0, y: viewBoxH };       // 退出到下方
    }
};

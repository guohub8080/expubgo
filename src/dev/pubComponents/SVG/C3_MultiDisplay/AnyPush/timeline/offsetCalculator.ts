import { Direction, Point } from "../types";

/**
 * 方向位移计算器
 * 职责：根据方向和视图尺寸计算位移坐标
 */

/**
 * 根据方向获取"进入"位移值
 * 即图片从屏幕外进入视图中心的位移
 *
 * @param direction - 进入方向
 * @param viewBoxW - 视图宽度
 * @param viewBoxH - 视图高度
 * @returns 位移坐标 {x, y}
 */
export const getEntryOffset = (
    direction: Direction,
    viewBoxW: number,
    viewBoxH: number
): Point => {
    switch (direction) {
        case "L": return { x: viewBoxW, y: 0 };      // 从左边外进入
        case "R": return { x: -viewBoxW, y: 0 };     // 从右边外进入
        case "T": return { x: 0, y: viewBoxH };      // 从上边外进入
        case "B": return { x: 0, y: -viewBoxH };     // 从下边外进入
    }
};

/**
 * 根据方向获取"退出"位移值
 * 即图片从视图中心退出到屏幕外的位移
 *
 * @param direction - 退出方向
 * @param viewBoxW - 视图宽度
 * @param viewBoxH - 视图高度
 * @returns 位移坐标 {x, y}
 */
export const getExitOffset = (
    direction: Direction,
    viewBoxW: number,
    viewBoxH: number
): Point => {
    switch (direction) {
        case "L": return { x: -viewBoxW, y: 0 };     // 退出到左边外
        case "R": return { x: viewBoxW, y: 0 };       // 退出到右边外
        case "T": return { x: 0, y: -viewBoxH };     // 退出到上边外
        case "B": return { x: 0, y: viewBoxH };      // 退出到下边外
    }
};

/**
 * 获取初始位置（进入位置）
 * 用于设置 foreignObject 的初始坐标
 *
 * @param direction - 进入方向
 * @param viewBoxW - 视图宽度
 * @param viewBoxH - 视图高度
 * @returns 初始坐标 {x, y}
 */
export const getInitialPosition = (
    direction: Direction,
    viewBoxW: number,
    viewBoxH: number
): Point => {
    // 初始位置就是进入位移值
    return getEntryOffset(direction, viewBoxW, viewBoxH);
};

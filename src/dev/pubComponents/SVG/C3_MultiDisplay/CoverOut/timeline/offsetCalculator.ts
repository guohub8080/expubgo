import { Direction } from "../types";

/**
 * 方向位移计算器
 * 职责：根据方向和视图尺寸计算位移坐标
 */

/**
 * 根据方向获取滑出位移值
 * 即图片从中心退出到屏幕外的位移
 *
 * @param direction - 滑出方向
 * @param viewBoxW - 视图宽度
 * @param viewBoxH - 视图高度
 * @returns 位移坐标字符串 "x y"
 */
export const getExitOffset = (
    direction: Direction,
    viewBoxW: number,
    viewBoxH: number
): string => {
    switch (direction) {
        case "T": return `0 ${-(viewBoxH + 1)}`;  // 往上退出
        case "B": return `0 ${viewBoxH + 1}`;      // 往下退出
        case "L": return `${-(viewBoxW + 1)} 0`;  // 往左退出
        case "R": return `${viewBoxW + 1} 0`;     // 往右退出
    }
};

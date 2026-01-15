import { Direction } from "../types";
import { getInitialOffset, getExitOffset } from "./offsetCalculator";

/**
 * 关键帧构建器
 * 职责：生成轮播动画的关键帧序列
 */

/**
 * 构建轮播动画的 values 字符串
 *
 * 格式：初始位置;中心位置;退出位置;退出位置;...
 * - 初始位置：在屏幕外（根据方向）
 * - 中心位置：(0, 0)
 * - 退出位置：在屏幕外（根据方向），重复 picCount 次
 *
 * @param direction - 移动方向
 * @param viewBoxW - 视图宽度
 * @param viewBoxH - 视图高度
 * @param picCount - 图片数量
 * @returns values 字符串
 */
export const buildValues = (
    direction: Direction,
    viewBoxW: number,
    viewBoxH: number,
    picCount: number
): string => {
    const initialOffset = getInitialOffset(direction, viewBoxW, viewBoxH);
    const exitOffset = getExitOffset(direction, viewBoxW, viewBoxH);

    // 格式：初始位置;中心位置;退出位置;退出位置;...
    const values = [
        `${initialOffset.x} ${initialOffset.y}`,  // 初始位置
        `0 0`,                                     // 中心位置
        ...new Array(picCount).fill(`${exitOffset.x} ${exitOffset.y}`) // 退出位置重复
    ];

    return values.join(';');
};

/**
 * 构建 keyTimes 字符串
 *
 * 关键帧时间均匀分布在 [0, 1] 区间
 *
 * @param picCount - 图片数量
 * @returns keyTimes 字符串
 */
export const buildKeyTimes = (picCount: number): string => {
    const totalFrames = picCount + 2; // 初始位置 + 中心位置 + picCount个退出位置
    const times: number[] = [];

    for (let i = 0; i < totalFrames; i++) {
        times.push(i / (totalFrames - 1));
    }

    return times.join(';');
};

/**
 * 构建 keySplines 字符串
 *
 * 所有动画段使用相同的贝塞尔曲线
 *
 * @param keySplines - 贝塞尔曲线值
 * @param picCount - 图片数量
 * @returns keySplines 字符串
 */
export const buildKeySplines = (keySplines: string, picCount: number): string => {
    const totalFrames = picCount + 2;
    const splines: string[] = [];

    // 需要 totalFrames - 1 个贝塞尔曲线
    for (let i = 0; i < totalFrames - 1; i++) {
        splines.push(keySplines);
    }

    return splines.join(';');
};

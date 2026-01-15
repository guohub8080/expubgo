import { NormalizedPicConfig, Direction, TimelineSegment } from "../types";
import { getEntryOffset, getExitOffset } from "./offsetCalculator";
import { calculateDelayTime, calculateHoldTime } from "./sequenceCalculator";

/**
 * 时间线段组装器
 * 职责：将图片配置组合成动画时间线段
 *
 * 时间线结构：
 * 1. 进入（switchDuration）- 从屏幕外滑入到中心
 * 2. 停留（stayDuration）- 在中心保持静止
 * 3. 退出（nextPic.switchDuration）- 从中心滑出到屏幕外
 * 4. 保持（holdTime）- 在屏幕外保持（等待其他动画完成）
 */

/**
 * 为指定图片生成完整的时间线
 *
 * 注意：时间线中的 toValue 都是相对于当前位置的位移
 * 因为 foreignObject 初始位置已经设置在 entryOffset，所以：
 * - 进入段需要移动到中心（位移为 entryOffset 的负值，即 exitOffset）
 * - 停留段保持静止（位移为 0）
 * - 退出段移动到屏幕外（使用下一张图的 exitOffset）
 * - 保持段保持静止（位移为 0）
 *
 * @param index - 当前图片索引
 * @param pics - 所有图片配置数组
 * @param viewBoxW - 视图宽度
 * @param viewBoxH - 视图高度
 * @param totalCycleDuration - 总周期时长
 * @returns 时间线段数组
 */
export const assembleTimeline = (
    index: number,
    pics: NormalizedPicConfig[],
    viewBoxW: number,
    viewBoxH: number,
    totalCycleDuration: number
): TimelineSegment[] => {
    const currentPic = pics[index];
    const nextPic = pics[(index + 1) % pics.length];

    // 1. 进入段：从屏幕外滑入到中心
    // 当前位置在 entryOffset，需要移动到中心（相对位移为 exitOffset）
    const entrySegment: TimelineSegment = {
        toValue: getExitOffset(currentPic.direction, viewBoxW, viewBoxH),
        durationSeconds: currentPic.switchDuration,
        keySplines: currentPic.keySplines
    };

    // 2. 停留段：在中心保持静止
    const staySegment: TimelineSegment = {
        toValue: { x: 0, y: 0 },
        durationSeconds: currentPic.stayDuration,
        keySplines: currentPic.keySplines
    };

    // 3. 退出段：从中心滑出到屏幕外（沿着下一张图的退出方向）
    const exitSegment: TimelineSegment = {
        toValue: getExitOffset(nextPic.direction, viewBoxW, viewBoxH),
        durationSeconds: nextPic.switchDuration,
        keySplines: nextPic.keySplines
    };

    // 4. 保持段：在屏幕外保持（等待循环重置）
    // 相对位移为 0，因为已经在目标位置
    const holdSegment: TimelineSegment = {
        toValue: { x: 0, y: 0 },
        durationSeconds: calculateHoldTime(index, pics, totalCycleDuration),
        keySplines: currentPic.keySplines
    };

    return [entrySegment, staySegment, exitSegment, holdSegment];
};

/**
 * 获取所有图片的延迟时间数组
 *
 * @param pics - 图片配置数组
 * @returns 每张图片的延迟时间
 */
export const getAllDelayTimes = (pics: NormalizedPicConfig[]): number[] => {
    return pics.map((_, index) => calculateDelayTime(index, pics));
};

/**
 * 获取所有图片的初始位置数组
 *
 * @param pics - 图片配置数组
 * @param viewBoxW - 视图宽度
 * @param viewBoxH - 视图高度
 * @returns 每张图片的初始位置
 */
export const getAllInitialPositions = (
    pics: NormalizedPicConfig[],
    viewBoxW: number,
    viewBoxH: number
): { x: number; y: number }[] => {
    return pics.map(pic => getEntryOffset(pic.direction, viewBoxW, viewBoxH));
};

import { KeyframeBuilderInput, KeyframeParams, AnimationMode, Direction } from "../types";
import { getInitialPosition, getTranslateOffset } from "./offsetCalculator";

/**
 * 关键帧构建器
 * 职责：构建 SVG animateTransform 所需的关键帧参数
 *
 * CoverIn 使用原生的 <animateTransform> 元素，需要：
 * - values: 关键帧值序列（用分号分隔）
 * - keyTimes: 关键帧时间点（用分号分隔，0-1之间）
 * - keySplines: 每段动画的贝塞尔曲线（用分号分隔）
 */

/**
 * 构建 keyTimes 数组
 *
 * @param slideInStartTime - 滑入开始时间
 * @param slideInEndTime - 滑入结束时间
 * @param totalDuration - 总时长
 * @param animationMode - 动画模式（once 或 loop）
 * @returns keyTimes 数组
 */
const buildKeyTimesArray = (
    slideInStartTime: number,
    slideInEndTime: number,
    totalDuration: number,
    animationMode: AnimationMode
): number[] => {
    // 计算归一化时间点（0-1之间）
    const keyTime1 = 0; // 初始位置
    const keyTime2 = slideInStartTime / totalDuration; // 滑入开始
    let keyTime3 = slideInEndTime / totalDuration; // 滑入结束
    const keyTime4 = 1; // 保持到结束

    // 边界处理：确保 keyTimes 单调递增
    if (keyTime3 > 1) keyTime3 = 1;
    if (keyTime2 > keyTime3) {
        // 如果滑入开始时间已经超过了结束时间（逻辑错误），使用离散跳变
        keyTime3 = keyTime2;
    }

    if (animationMode === "once") {
        // 一次性动画：4个关键点
        return [keyTime1, keyTime2, keyTime3, keyTime4];
    } else {
        // 循环动画：5个关键点（多一个重置点）
        const keyTime5 = 1; // 在t=1时刻重置（重复keyTime实现离散跳变）
        return [keyTime1, keyTime2, keyTime3, keyTime4, keyTime5];
    }
};

/**
 * 构建 values 数组
 *
 * @param translateOffset - 平移距离字符串
 * @param animationMode - 动画模式（once 或 loop）
 * @returns values 数组
 */
const buildValuesArray = (
    translateOffset: string,
    animationMode: AnimationMode
): string[] => {
    if (animationMode === "once") {
        // 一次性动画：初始位置 → 等待 → 滑入 → 保持（4个点）
        return [
            "0 0",              // 1. 初始位置
            "0 0",              // 2. 等待滑入
            translateOffset,    // 3. 滑入完成
            translateOffset     // 4. 保持显示
        ];
    } else {
        // 循环动画：初始位置 → 等待 → 滑入 → 保持 → 重置（5个点）
        return [
            "0 0",              // 1. 初始位置
            "0 0",              // 2. 等待滑入
            translateOffset,    // 3. 滑入完成
            translateOffset,    // 4. 保持显示
            "0 0"               // 5. 重置
        ];
    }
};

/**
 * 构建 keySplines 字符串
 * 每段动画需要一个贝塞尔曲线（n个关键点 = n-1段动画）
 *
 * @param valuesCount - values 数组的长度
 * @param keySplines - 贝塞尔曲线字符串
 * @returns keySplines 字符串（用分号分隔）
 */
const buildKeySplinesString = (
    valuesCount: number,
    keySplines: string
): string => {
    const splineCount = valuesCount - 1;
    return new Array(splineCount)
        .fill(keySplines)
        .join(";");
};

/**
 * 构建完整的关键帧参数
 *
 * @param input - 构建输入参数
 * @returns 关键帧参数对象
 */
export const buildKeyframeParams = (input: KeyframeBuilderInput): KeyframeParams => {
    const {
        direction,
        viewBoxW,
        viewBoxH,
        slideInStartTime,
        slideInEndTime,
        totalDuration,
        animationMode,
        firstRoundDuration = 0,
        keySplines
    } = input;

    // 构建关键帧数据
    const translateOffset = getTranslateOffset(direction, viewBoxW, viewBoxH);
    const valuesArray = buildValuesArray(translateOffset, animationMode);
    const keyTimesArray = buildKeyTimesArray(
        slideInStartTime,
        slideInEndTime,
        totalDuration,
        animationMode
    );
    const keySplinesString = buildKeySplinesString(valuesArray.length, keySplines);

    // 获取初始位置
    const initialPos = getInitialPosition(direction, viewBoxW, viewBoxH);

    // 确定开始时间和重复次数
    let beginTime: string;
    let repeatCount: string;

    if (animationMode === "once") {
        beginTime = "0s";
        repeatCount = "1";
    } else {
        beginTime = `${firstRoundDuration}s`; // 在第一轮结束后开始
        repeatCount = "indefinite";
    }

    return {
        values: valuesArray.join(";"),
        keyTimes: keyTimesArray.join(";"),
        keySplines: keySplinesString,
        initialX: initialPos.x,
        initialY: initialPos.y,
        beginTime,
        repeatCount
    };
};

/**
 * 为初始静止图构建淡出参数
 *（这个图不需要滑动动画，只需要淡出）
 *
 * @param stayDuration - 停留时长
 * @param totalDuration - 总时长
 * @returns 淡出的 keyTimes 比率
 */
export const buildFadeOutParams = (
    stayDuration: number,
    totalDuration: number
): { startRatio: number; endRatio: number } => {
    const fadeOutTimeRatio = stayDuration / totalDuration;
    return {
        startRatio: fadeOutTimeRatio,
        endRatio: Math.min(fadeOutTimeRatio + 0.01, 1)
    };
};

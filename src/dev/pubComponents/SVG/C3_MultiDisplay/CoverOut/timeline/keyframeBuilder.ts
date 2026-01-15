import { NormalizedPicConfig } from "../types";
import { calculateSlideOutStartTime, calculateSlideOutEndTime } from "./sequenceCalculator";
import { getExitOffset } from "./offsetCalculator";

/**
 * 关键帧构建器
 * 职责：生成主循环层和假动作层的关键帧参数
 */

/**
 * 构建主循环层的关键帧参数
 *
 * 时间线：初始位置(0) -> 等待 -> 滑出 -> 保持在屏外(1)
 *
 * @param index - 图片索引
 * @param pic - 图片配置
 * @param pics - 所有图片配置数组
 * @param viewBoxW - 视图宽度
 * @param viewBoxH - 视图高度
 * @param totalDuration - 总周期时长
 * @returns 关键帧参数对象
 */
export const buildLoopLayerKeyframes = (
    index: number,
    pic: NormalizedPicConfig,
    pics: NormalizedPicConfig[],
    viewBoxW: number,
    viewBoxH: number,
    totalDuration: number
) => {
    // 计算时间点
    const slideOutStartTime = calculateSlideOutStartTime(index, pics);
    const slideOutEndTime = slideOutStartTime + pic.coverOutDuration;

    // 计算 keyTimes（时间点在总时长中的比例）
    const epsilon = 1e-6;
    let keyTime2 = slideOutStartTime / totalDuration; // 滑出开始
    let keyTime3 = slideOutEndTime / totalDuration;   // 滑出结束

    // 确保keyTime的顺序正确
    if (keyTime2 < epsilon) {
        keyTime2 = epsilon;
    }
    if (keyTime3 <= keyTime2) {
        keyTime3 = keyTime2 + epsilon;
    }

    // 确保不超过1
    if (keyTime3 > 1) {
        keyTime3 = 1;
    }
    if (keyTime2 >= keyTime3) {
        keyTime2 = keyTime3 - epsilon;
    }

    // 计算滑出位移
    const translateOffset = getExitOffset(pic.direction, viewBoxW, viewBoxH);

    // values/keyTimes逻辑：在t=1时保持在屏外
    const values = [`0 0`, `0 0`, translateOffset, translateOffset];
    const keyTimes = [`0`, `${keyTime2}`, `${keyTime3}`, `1`];

    // keySplines: 每段动画的缓动曲线（4个关键点 = 3段动画）
    const keySplinesString = [
        "0 0 1 1",        // 第1段：静止等待
        pic.keySplines,   // 第2段：滑出动画
        "0 0 1 1",        // 第3段：保持在屏外
    ].join(";");

    return {
        values: values.join(";"),
        keyTimes: keyTimes.join(";"),
        keySplines: keySplinesString,
    };
};

/**
 * 构建假动作层的关键帧参数
 *
 * 假动作层用于循环时的视觉连接：在最后一张图滑出时，下面显示第一张图的假动作
 * 时间线：隐藏(0) -> 隐藏 -> 出现 -> 显示 -> 消失 -> 隐藏(1)
 *
 * @param pics - 所有图片配置数组
 * @param totalDuration - 总周期时长
 * @returns 关键帧参数对象
 */
export const buildGhostLayerKeyframes = (
    pics: NormalizedPicConfig[],
    totalDuration: number
) => {
    // 计算假动作层的出现和消失时间
    const ghostAppearTime = pics.slice(0, -1).reduce(
        (acc, pic) => acc + pic.stayDuration + pic.coverOutDuration,
        0
    ) + pics[pics.length - 1].stayDuration;

    const ghostDisappearTime = ghostAppearTime + pics[pics.length - 1].coverOutDuration;

    // 计算 keyTimes（相对于整个循环周期）
    const keyTime2 = ghostAppearTime / totalDuration; // 出现时刻
    const keyTime3 = ghostDisappearTime / totalDuration; // 消失时刻

    return {
        values: "0;0;1;1;0;0", // 隐藏->隐藏->显示->显示->隐藏->隐藏
        keyTimes: `0;${keyTime2};${keyTime2};${keyTime3};${keyTime3};1`,
    };
};

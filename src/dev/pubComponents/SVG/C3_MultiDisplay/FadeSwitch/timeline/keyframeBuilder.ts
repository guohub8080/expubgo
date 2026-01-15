import { NormalizedPicConfig } from "../types";
import { calculateFadeOutStartTime, calculateGhostAppearTime } from "./sequenceCalculator";

/**
 * 关键帧构建器
 * 职责：生成主循环层和假动作层的不透明度时间线
 */

/**
 * 构建主循环层的不透明度时间线
 *
 * 时间线：保持可见(1) -> 淡出(0) -> 等待(0)
 *
 * @param index - 图片索引
 * @param pic - 图片配置
 * @param pics - 所有图片配置数组
 * @param totalDuration - 总周期时长
 * @returns 时间线数组
 */
export const buildLoopLayerTimeline = (
    index: number,
    pic: NormalizedPicConfig,
    pics: NormalizedPicConfig[],
    totalDuration: number
) => {
    const fadeOutStart = calculateFadeOutStartTime(index, pics);
    const fadeOutEnd = fadeOutStart + pic.fadeDuration;
    const waitEnd = Math.max(0, totalDuration - fadeOutEnd);

    const timeline: { durationSeconds: number; toValue: number }[] = [];

    if (fadeOutStart > 0) {
        timeline.push({ durationSeconds: fadeOutStart, toValue: 1 }); // 保持可见直到淡出开始
    }
    if (pic.fadeDuration > 0) {
        timeline.push({ durationSeconds: pic.fadeDuration, toValue: 0 }); // 淡出
    }
    if (waitEnd > 0) {
        timeline.push({ durationSeconds: waitEnd, toValue: 0 }); // 等待到周期结束
    }

    return timeline;
};

/**
 * 构建假动作层的关键帧参数
 *
 * 假动作层用于循环时的视觉连接：在最后一张图淡出时显示第一张图的假动作
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
    const ghostAppearTime = calculateGhostAppearTime(pics);
    const ghostDisappearTime = ghostAppearTime + pics[pics.length - 1].fadeDuration;

    const keyTime2 = totalDuration === 0 ? 0 : (ghostAppearTime / totalDuration);
    const keyTime3 = totalDuration === 0 ? 0 : (ghostDisappearTime / totalDuration);

    return {
        values: "0;0;1;1;0;0", // 隐藏->隐藏->显示->显示->隐藏->隐藏
        keyTimes: `0;${keyTime2};${keyTime2};${keyTime3};${keyTime3};1`,
    };
};

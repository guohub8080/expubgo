import { NormalizedPicConfig } from "../types";
import { calculateDelayTime } from "./sequenceCalculator";

/**
 * 时间线构建器
 * 职责：生成硬切切换的不透明度时间线
 */

/**
 * 构建硬切时间线
 *
 * 时间线：显示(stayDuration) -> 隐藏(剩余时间)
 *
 * @param index - 图片索引
 * @param pic - 图片配置
 * @param pics - 所有图片配置数组
 * @param totalDuration - 总周期时长
 * @returns 时间线数组
 */
export const buildHardCutTimeline = (
    index: number,
    pic: NormalizedPicConfig,
    pics: NormalizedPicConfig[],
    totalDuration: number
) => {
    const delay = calculateDelayTime(index, pics);
    const hideTime = totalDuration - pic.stayDuration;

    return [
        { durationSeconds: pic.stayDuration, toValue: 0 }, // 显示期间保持不透明度为0（通过延迟实现）
        { durationSeconds: hideTime, toValue: 0 }         // 隐藏期间
    ];
};

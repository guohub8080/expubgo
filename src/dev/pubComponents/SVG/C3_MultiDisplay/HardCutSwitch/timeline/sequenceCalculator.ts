import { NormalizedPicConfig } from "../types";

/**
 * 序列时间计算器
 * 职责：计算整个动画周期的总时长和各图片的时间节点
 */

/**
 * 计算整个动画周期的总时长
 *
 * @param pics - 图片配置数组
 * @returns 总周期时长（秒）
 */
export const calculateTotalCycleDuration = (pics: NormalizedPicConfig[]): number => {
    return pics.reduce((total, pic) => total + pic.stayDuration, 0);
};

/**
 * 计算指定图片的延迟开始时间
 *
 * 延迟时间 = 前面所有图的 stay 之和
 *
 * @param index - 图片索引
 * @param pics - 图片配置数组
 * @returns 延迟时间（秒）
 */
export const calculateDelayTime = (index: number, pics: NormalizedPicConfig[]): number => {
    let delay = 0;
    for (let i = 0; i < index; i++) {
        delay += pics[i].stayDuration;
    }
    return delay;
};

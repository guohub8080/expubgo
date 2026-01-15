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
    return pics.reduce((total, pic) => total + pic.fadeDuration + pic.stayDuration, 0);
};

/**
 * 计算指定图片的淡出开始时间
 *
 * 淡出开始时间 = 前面所有图的 (stay + fade) + 当前图的 stay
 *
 * @param index - 图片索引
 * @param pics - 图片配置数组
 * @returns 淡出开始时间（秒）
 */
export const calculateFadeOutStartTime = (index: number, pics: NormalizedPicConfig[]): number => {
    let time = 0;

    // 累加前面所有图的时长
    for (let i = 0; i < index; i++) {
        time += pics[i].stayDuration + pics[i].fadeDuration;
    }

    // 加上当前图的停留时长
    time += pics[index].stayDuration;

    return time;
};

/**
 * 计算假动作层的出现时间
 *
 * 假动作出现时间 = 图1到图(n-1)的(stay+fade) + 图n的stay
 * 即：在最后一张图开始淡出时，假动作层出现
 *
 * @param pics - 图片配置数组
 * @returns 假动作出现时间（秒）
 */
export const calculateGhostAppearTime = (pics: NormalizedPicConfig[]): number => {
    const totalSlides = pics.length;
    let time = 0;

    // 累加图1到图(n-1)的时长
    for (let i = 0; i < totalSlides - 1; i++) {
        time += pics[i].stayDuration + pics[i].fadeDuration;
    }

    // 加上最后一张图的停留时长
    time += pics[totalSlides - 1].stayDuration;

    return time;
};

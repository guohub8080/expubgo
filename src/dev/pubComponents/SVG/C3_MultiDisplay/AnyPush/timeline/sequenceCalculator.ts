import { NormalizedPicConfig } from "../types";

/**
 * 序列时间计算器
 * 职责：计算整个动画周期的总时长
 *
 * 总时长 = 所有图片的 (switchDuration + stayDuration) 之和
 */
export const calculateTotalCycleDuration = (pics: NormalizedPicConfig[]): number => {
    return pics.reduce((total, pic) => total + pic.switchDuration + pic.stayDuration, 0);
};

/**
 * 计算指定图片的延迟开始时间
 *
 * 延迟时间 = 当前图片应该开始动画的时间点（负值表示提前开始）
 *
 * @param index - 图片索引
 * @param pics - 图片数组
 * @returns 延迟时间（秒），负数表示提前开始
 */
export const calculateDelayTime = (index: number, pics: NormalizedPicConfig[]): number => {
    if (index === 0) {
        // 第一张图：在它自己的 switchDuration 之前开始（负值）
        return -pics[0].switchDuration;
    }

    // 其他图片：累加前面所有图的 (switch + stay) 时长
    let delay = pics[0].stayDuration;
    for (let i = 1; i < index; i++) {
        delay += pics[i].switchDuration + pics[i].stayDuration;
    }

    return delay;
};

/**
 * 计算指定图片的保持时间
 *
 * 保持时间 = 总时长 - 当前图的switch - 当前图的stay - 下一图的switch
 *
 * @param index - 图片索引
 * @param pics - 图片数组
 * @param totalDuration - 总时长
 * @returns 保持时间（秒）
 */
export const calculateHoldTime = (
    index: number,
    pics: NormalizedPicConfig[],
    totalDuration: number
): number => {
    const currentPic = pics[index];
    const nextPic = pics[(index + 1) % pics.length];
    const nextPicSwitchDuration = nextPic.switchDuration;

    return (
        totalDuration
        - currentPic.switchDuration
        - currentPic.stayDuration
        - nextPicSwitchDuration
    );
};

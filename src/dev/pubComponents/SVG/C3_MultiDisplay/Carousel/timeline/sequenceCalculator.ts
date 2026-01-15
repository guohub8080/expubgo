/**
 * 序列时间计算器
 * 职责：计算轮播动画的总时长
 *
 * 总时长 = duration × (图片数量 + 1)
 * +1 是因为需要额外的空间让最后一张图滑出
 */

/**
 * 计算整个轮播周期总时长
 *
 * @param duration - 单次切换时长
 * @param picCount - 图片数量
 * @returns 总周期时长（秒）
 */
export const calculateTotalCycleDuration = (duration: number, picCount: number): number => {
    return duration * (picCount + 1);
};

/**
 * 计算指定图片的延迟开始时间
 *
 * 延迟时间 = -(index × duration)
 * 负值表示提前开始，确保所有图片同时开始动画但位置不同
 *
 * @param index - 图片索引
 * @param duration - 单次切换时长
 * @returns 延迟时间（秒），负数表示提前开始
 */
export const calculateDelayTime = (index: number, duration: number): number => {
    return -(index * duration);
};

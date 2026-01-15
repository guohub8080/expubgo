import { NormalizedPicConfig, DurationCalculations, AnimationGroups } from "../types";

/**
 * 序列时间计算器
 * 职责：计算动画周期的总时长
 */

/**
 * 计算第一轮动画的总时长
 * 第一轮 = 图1的stayDuration + 图2/3/4...的(coverInDuration + stayDuration)
 *
 * @param groups - 动画分组
 * @returns 第一轮总时长（秒）
 */
export const calculateFirstRoundDuration = (groups: AnimationGroups): number => {
    const { initialStatic, firstRoundSlides } = groups;

    // 第一轮时长 = 初始图停留时间 + 第一轮滑入图的每个(滑入+停留)
    const firstRoundDuration = initialStatic.stayDuration +
        firstRoundSlides.reduce((total, slide) => {
            return total + slide.coverInDuration + slide.stayDuration;
        }, 0);

    return firstRoundDuration;
};

/**
 * 计算循环动画的总时长
 * 循环 = 所有图的(coverInDuration + stayDuration)
 *
 * @param loopSlides - 循环滑入的图片数组
 * @returns 循环总时长（秒）
 */
export const calculateLoopDuration = (loopSlides: NormalizedPicConfig[]): number => {
    return loopSlides.reduce((total, slide) => {
        return total + slide.coverInDuration + slide.stayDuration;
    }, 0);
};

/**
 * 计算所有时长
 *
 * @param groups - 动画分组
 * @returns 时长计算结果
 */
export const calculateDurations = (groups: AnimationGroups): DurationCalculations => {
    return {
        firstRoundDuration: calculateFirstRoundDuration(groups),
        loopDuration: calculateLoopDuration(groups.loopSlides)
    };
};

/**
 * 计算指定图片的滑入开始时间
 * 累加前面所有图的 coverInDuration + stayDuration
 *
 * @param slideIndex - 当前图片索引
 * @param slides - 滑入图片数组
 * @param timeOffset - 时间偏移量（可选，第一轮需要）
 * @returns 滑入开始时间（秒）
 */
export const calculateSlideStartTime = (
    slideIndex: number,
    slides: NormalizedPicConfig[],
    timeOffset: number = 0
): number => {
    let startTime = timeOffset;

    for (let i = 0; i < slideIndex; i++) {
        startTime += slides[i].coverInDuration + slides[i].stayDuration;
    }

    return startTime;
};

/**
 * 计算指定图片的滑入结束时间
 *
 * @param slideIndex - 当前图片索引
 * @param slides - 滑入图片数组
 * @param timeOffset - 时间偏移量（可选，第一轮需要）
 * @returns 滑入结束时间（秒）
 */
export const calculateSlideEndTime = (
    slideIndex: number,
    slides: NormalizedPicConfig[],
    timeOffset: number = 0
): number => {
    const startTime = calculateSlideStartTime(slideIndex, slides, timeOffset);
    const currentSlide = slides[slideIndex];
    return startTime + currentSlide.coverInDuration;
};

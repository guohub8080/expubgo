import { NormalizedPicConfig, AnimationGroups } from "../types";

/**
 * 动画分组器
 * 职责：将图片数组按动画逻辑分组
 *
 * CoverIn 的动画分为三个组：
 * 1. initialStatic: 初始静止图（第一张图，显示一段时间后淡出）
 * 2. firstRoundSlides: 第一轮滑入序列（第2、3、4...张图，一次性动画）
 * 3. loopSlides: 循环滑入序列（所有图片，无限循环）
 */

/**
 * 创建动画分组
 *
 * @param pics - 标准化后的图片配置数组
 * @returns 动画分组结果
 */
export const createAnimationGroups = (pics: NormalizedPicConfig[]): AnimationGroups => {
    // 只有1张图：初始静止 + 循环滑入（用同一张图）
    if (pics.length === 1) {
        return {
            initialStatic: pics[0],
            firstRoundSlides: [pics[0]],
            loopSlides: [pics[0]]
        };
    }

    // 多张图：初始图1 + 第一轮滑入（图2、图3、图4） + 循环滑入（图1、图2、图3、图4）
    return {
        initialStatic: pics[0],          // 图1静止
        firstRoundSlides: pics.slice(1), // 第一轮：图2、图3、图4...
        loopSlides: pics                 // 循环：所有图
    };
};

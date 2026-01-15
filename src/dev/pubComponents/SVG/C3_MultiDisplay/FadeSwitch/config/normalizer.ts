import { PicConfig, NormalizedPicConfig } from "../types";
import { defaultTo } from "es-toolkit/compat";
import getTextImgPic1 from "@api/placeHolderPic/getTextImgPic1";

/**
 * 配置标准化器
 * 职责：将用户输入的配置转换为标准化的内部配置
 */

/** 默认值常量 */
export const EPSILON = 0.01; // 最小淡入淡出时长，避免硬切
export const DEFAULT_FADE_DURATION = 0.5;
export const DEFAULT_STAY_DURATION = 2;

/**
 * 标准化单个图片配置
 *
 * @param pic - 用户输入的图片配置
 * @returns 标准化后的图片配置
 */
export const normalizePic = (pic: PicConfig): NormalizedPicConfig => ({
    url: pic.url,
    fadeDuration: Math.max(defaultTo(pic.fadeDuration, DEFAULT_FADE_DURATION), EPSILON),
    stayDuration: defaultTo(pic.stayDuration, DEFAULT_STAY_DURATION)
});

/**
 * 获取默认的图片配置（用于占位）
 *
 * @returns 默认的图片配置数组
 */
export const getDefaultPics = (): NormalizedPicConfig[] => [
    {
        url: getTextImgPic1(450, 450, "Fade 1"),
        fadeDuration: DEFAULT_FADE_DURATION,
        stayDuration: DEFAULT_STAY_DURATION
    },
    {
        url: getTextImgPic1(450, 450, "Fade 2"),
        fadeDuration: DEFAULT_FADE_DURATION,
        stayDuration: DEFAULT_STAY_DURATION
    },
    {
        url: getTextImgPic1(450, 450, "Fade 3"),
        fadeDuration: DEFAULT_FADE_DURATION,
        stayDuration: DEFAULT_STAY_DURATION
    }
];

/**
 * 标准化图片配置数组
 * - 如果只有1张图片，自动复制一份（至少需要2张）
 * - 如果未提供图片，使用默认占位图
 *
 * @param pics - 用户输入的图片配置数组（可能为 undefined）
 * @returns 标准化后的图片配置数组
 */
export const normalizePics = (pics?: PicConfig[]): NormalizedPicConfig[] => {
    // 未提供图片：使用默认占位图
    if (!pics || pics.length === 0) {
        return getDefaultPics();
    }

    // 只有1张图片：复制一份
    if (pics.length === 1) {
        const normalized = normalizePic(pics[0]);
        return [normalized, normalized];
    }

    // 多张图片：全部标准化
    return pics.map(normalizePic);
};

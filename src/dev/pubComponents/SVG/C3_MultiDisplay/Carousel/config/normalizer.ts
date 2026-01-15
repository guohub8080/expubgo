import { PicConfig, NormalizedPicConfig } from "../types";
import { defaultTo } from "es-toolkit/compat";
import getTextImgPic1 from "@api/placeHolderPic/getTextImgPic1";

/**
 * 配置标准化器
 * 职责：将用户输入的配置转换为标准化的内部配置
 */

/** 默认值常量 */
export const DEFAULT_IS_TOUCHABLE = false;

/**
 * 标准化单个图片配置
 *
 * @param pic - 用户输入的图片配置
 * @returns 标准化后的图片配置
 */
export const normalizePic = (pic: PicConfig): NormalizedPicConfig => ({
    url: pic.url,
    isTouchable: defaultTo(pic.isTouchable, DEFAULT_IS_TOUCHABLE)
});

/**
 * 获取默认的图片配置（用于占位）
 *
 * @returns 默认的图片配置数组
 */
export const getDefaultPics = (): NormalizedPicConfig[] => [
    {
        url: getTextImgPic1(600, 800, "Carousel"),
        isTouchable: DEFAULT_IS_TOUCHABLE
    },
    {
        url: getTextImgPic1(600, 800, "Carousel"),
        isTouchable: DEFAULT_IS_TOUCHABLE
    }
];

/**
 * 标准化图片配置数组
 * - 如果只有1张图片，自动复制一份（至少需要2张才能形成轮播效果）
 * - 如果未提供图片，使用默认占位图
 *
 * @param pics - 用户输入的图片配置数组（可能为 undefined）
 * @returns 标准化后的图片配置数组（保证至少有2张）
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

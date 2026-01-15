import { PicConfig, NormalizedPicConfig } from "../types";
import { defaultTo } from "es-toolkit/compat";
import { getEaseBezier } from "@pub-utils/getBezier";
import getTextImgPic1 from "@api/placeHolderPic/getTextImgPic1";

/**
 * 配置标准化器
 * 职责：将用户输入的配置转换为标准化的内部配置
 */

/** 默认值常量 */
export const DEFAULT_COVER_OUT_DURATION = 0.5;
export const DEFAULT_STAY_DURATION = 0.5;
export const DEFAULT_DIRECTION: NormalizedPicConfig["direction"] = "B";
export const DEFAULT_KEY_SPLINES = getEaseBezier({ isIn: true, isOut: true });

/**
 * 标准化单个图片配置
 *
 * @param pic - 用户输入的图片配置
 * @returns 标准化后的图片配置
 */
export const normalizePic = (pic: PicConfig): NormalizedPicConfig => ({
    url: pic.url,
    coverOutDuration: defaultTo(pic.coverOutDuration, DEFAULT_COVER_OUT_DURATION),
    stayDuration: defaultTo(pic.stayDuration, DEFAULT_STAY_DURATION),
    direction: defaultTo(pic.direction, DEFAULT_DIRECTION),
    keySplines: defaultTo(pic.keySplines, DEFAULT_KEY_SPLINES)
});

/**
 * 获取默认的图片配置（用于占位）
 *
 * @returns 默认的图片配置数组
 */
export const getDefaultPics = (): NormalizedPicConfig[] => {
    const placeholder = getTextImgPic1(450, 450, "CoverOut");
    return [{
        url: placeholder,
        coverOutDuration: DEFAULT_COVER_OUT_DURATION,
        stayDuration: DEFAULT_STAY_DURATION,
        direction: DEFAULT_DIRECTION,
        keySplines: DEFAULT_KEY_SPLINES
    }];
};

/**
 * 标准化图片配置数组
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

    // 全部标准化
    return pics.map(normalizePic);
};

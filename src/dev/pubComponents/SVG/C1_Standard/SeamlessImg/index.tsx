import { defaultTo } from "es-toolkit/compat";
import getWechat300x300 from "@api/placeHolderPic/getWechat300x300";
import { mpBlank, mpGet, mpProps } from "@styles/funcs/mp";
import getImgSizeByDefault from "@pub-utils/common/getImgSizeByDefault";
import SeamlessImg1 from "./components/SeamlessImg1";
import SeamlessImg2 from "./components/SeamlessImg2";
import SeamlessImg3 from "./components/SeamlessImg3";
import SeamlessImg4 from "./components/SeamlessImg4";
import SeamlessImg5 from "./components/SeamlessImg5";
import SeamlessImg6 from "./components/SeamlessImg6";
import SeamlessImg7 from "./components/SeamlessImg7";

interface SeamlessImgProps {
    /** 图片URL，默认使用300x300占位图 */
    url?: string
    /** 公众号样式属性（margin, padding等） */
    mp?: mpProps
    /** 图片宽度，默认为0（自动获取） */
    w?: number
    /** 图片高度，默认为0（自动获取） */
    h?: number
    /** 是否自然优先级（无transform）- SeamlessImg2 */
    isNaturalPriority?: boolean
    /** 是否事件穿透（pointerEvents: none）- SeamlessImg3 */
    isEventThrough?: boolean
    /** 是否可弹出查看（使用foreignObject + img标签）- SeamlessImg4 */
    isPopable?: boolean
    /** 是否强制可触摸（pointerEvents: visible）- SeamlessImg5 */
    isTouchForced?: boolean
    /** 是否支持发布后替换（使用data-src属性）- SeamlessImg6 */
    isReplaceableAfterPublish?: boolean
    /** 是否仅支持长按识别（不可弹出但可长按保存）- SeamlessImg7 */
    isLongPressOnly?: boolean
}

/**
 * 无缝图组件 - 用于显示无缝背景图片，支持深色模式对抗
 *
 * 根据不同的配置参数，返回6种不同的无缝图实现方式。
 * 优先级顺序（从高到低）：发布后可替换 > 强制可触摸 > 可弹出 > 事件穿透 > 自然优先级 > 默认深色对抗
 *
 * @example
 * // 默认深色对抗模式
 * <SeamlessImg url="https://example.com/image.jpg" />
 *
 * @example
 * // 可弹出模式
 * <SeamlessImg url="https://example.com/image.jpg" isPopable={true} />
 *
 * @example
 * // 发布后可替换模式
 * <SeamlessImg url="https://example.com/image.jpg" isReplaceableAfterPublish={true} />
 */
const SeamlessImg = (props: SeamlessImgProps) => {
    const mpResult = mpGet(defaultTo(props.mp, mpBlank))
    const isNaturalPriority = defaultTo(props.isNaturalPriority, false)
    const isEventThrough = defaultTo(props.isEventThrough, false)
    const isPopable = defaultTo(props.isPopable, false)
    const isTouchForced = defaultTo(props.isTouchForced, false)
    const isReplaceableAfterPublish = defaultTo(props.isReplaceableAfterPublish, false)
    const isLongPressOnly = defaultTo(props.isLongPressOnly, false)


    //定义图片和尺寸
    const imgURL = defaultTo(props.url, getWechat300x300(1))
    const imgSize = getImgSizeByDefault(imgURL, props.w, props.h)


    //仅长按识别 - SeamlessImg7
    if (isLongPressOnly) {
        return <SeamlessImg7 w={imgSize.w} h={imgSize.h} url={imgURL} mpResult={mpResult} />
    }
    //发布后可替换 - SeamlessImg6
    if (isReplaceableAfterPublish) {
        return <SeamlessImg6 w={imgSize.w} h={imgSize.h} url={imgURL} mpResult={mpResult} />
    }
    //强制可触摸 - SeamlessImg5
    if (isTouchForced) {
        return <SeamlessImg5 w={imgSize.w} h={imgSize.h} url={imgURL} mpResult={mpResult} />
    }
    //可弹出 - SeamlessImg4
    if (isPopable) {
        return <SeamlessImg4 w={imgSize.w} h={imgSize.h} url={imgURL} mpResult={mpResult} />
    }
    //事件穿透 - SeamlessImg3
    if (isEventThrough) {
        return <SeamlessImg3 w={imgSize.w} h={imgSize.h} url={imgURL} mpResult={mpResult} />
    }
    //自然优先级 - SeamlessImg2
    if (isNaturalPriority) {
        return <SeamlessImg2 w={imgSize.w} h={imgSize.h} url={imgURL} mpResult={mpResult} />
    }
    //深色模式高亮（深色对抗，默认）- SeamlessImg1
    return <SeamlessImg1 w={imgSize.w} h={imgSize.h} url={imgURL} mpResult={mpResult} />
}

export default SeamlessImg

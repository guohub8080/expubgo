import { CSSProperties } from "react";
import SectionEx from "@pub-html/basicEx/SectionEx";
import { defaultTo } from "es-toolkit/compat";
import getTextImgPic1 from "@api/placeHolderPic/getTextImgPic1";
import { mpBlank, mpGet, mpProps } from "@styles/funcs/mp";
import getImgSizeByDefault from "@pub-utils/common/getImgSizeByDefault";
import NormalSvgImg from "./components/NormalSvgImg";
import UnpopButCanLongPress from "./components/UnpopButCanLongPress";
import OnlyDisplayImg from "./components/OnlyDisplayImg";

interface SvgImgExProps {
    /** 图片URL */
    url?: string
    /** 是否允许点击弹出查看大图，默认true */
    isPopAllowed?: boolean
    /** 是否允许长按识别保存，默认true */
    isLongPressedRecongitionAllowed?: boolean
    /** 公众号样式属性（margin, padding等） */
    mp?: mpProps
    /** 自定义样式 */
    style?: CSSProperties
    /** 图片宽度，默认为0（自动获取） */
    w?: number
    /** 图片高度，默认为0（自动获取） */
    h?: number
}

/**
 * SVG图片扩展组件
 *
 * 根据配置提供三种图片显示模式：
 * 1. 可弹出 + 可长按保存（默认）
 * 2. 不可弹出 + 可长按保存
 * 3. 不可弹出 + 不可长按保存（仅展示）
 *
 * @example
 * // 默认模式：可弹出可长按
 * <SvgImgEx url="https://example.com/image.jpg" />
 *
 * @example
 * // 仅长按保存模式
 * <SvgImgEx url="https://example.com/image.jpg" isPopAllowed={false} />
 *
 * @example
 * // 仅展示模式
 * <SvgImgEx url="https://example.com/image.jpg" isPopAllowed={false} isLongPressedRecongitionAllowed={false} />
 */
const SvgImgEx = (props: SvgImgExProps) => {
    const mpResult = mpGet(defaultTo(props.mp, mpBlank))
    const url = defaultTo(props.url, getTextImgPic1(300, 400, "pic"))
    const isPopAllowed = defaultTo(props.isPopAllowed, true)
    const isLongPressedRecongitionAllowed = defaultTo(props.isLongPressedRecongitionAllowed, true)

    //获取size，如果svg定位需要size
    const imgSize = getImgSizeByDefault(url, props.w, props.h)
    //普通的图片，允许点击弹出，也允许长按保存。
    if (isPopAllowed) {
        return <SectionEx
            data-label="svg-img-ex-popable"
            important={[["max-width", "100%"], ["width", "100%"], ["height", "auto"],["line-height","0"],["font-size","0"]]}
            style={{ ...mpResult, ...props.style,fontSize:0,lineHeight:0 }} >
            <NormalSvgImg url={url} />
        </ SectionEx>
    }

    // 不允许点击弹出但允许长按保存。
    if (!isPopAllowed && isLongPressedRecongitionAllowed) {
        return <SectionEx
            data-label="svg-img-ex-long-press-only"
            important={[["max-width", "100%"], ["width", "100%"], ["height", "auto"]]}
            style={{ ...mpResult, ...props.style }} >
            <UnpopButCanLongPress url={url} w={imgSize.w} h={imgSize.h} />
        </ SectionEx>
    }

    // 不允许点击弹出也不允许长按保存，就是仅展示的固态图片了。
    return <SectionEx
        data-label="svg-img-ex-display-only"
        important={[["max-width", "100%"], ["width", "100%"], ["height", "auto"]]}
        style={{ ...mpResult, ...props.style }} >
        <OnlyDisplayImg url={url} w={imgSize.w} h={imgSize.h} />
    </ SectionEx>
}

export default SvgImgEx


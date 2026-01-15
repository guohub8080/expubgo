import { defaultTo } from "es-toolkit/compat"
import { CSSProperties } from "react"
import SectionEx from "@pub-html/basicEx/SectionEx"

// ============================================ Types ============================================

interface MomentImg1Props {
    /** 图片 URL */
    url: string
    /** 图片宽高比，例如 [1, 1] 表示正方形，[16, 9] 表示 16:9 */
    ratio?: [number, number]
    /** 图片裁剪对齐方式，仅在设置 ratio 时生效 */
    position?: "center" | "top" | "bottom" | "left" | "right"
    /** 最大宽度，支持数字（px）或字符串（如 "100%"、"300px" 等） */
    maxWidth?: number | string
    /** 上边距，默认 12px */
    mt?: number
    /** 下边距，默认 0 */
    mb?: number
}

// ============================================ Constants ============================================

/**
 * MomentImg1 组件常量配置
 *
 * 魔法数字说明：
 * - BORDER_WIDTH: 图片边框宽度
 * - BORDER_COLOR: 边框颜色
 * - BACKGROUND_COLOR: 占位背景颜色
 * - MARGIN_TOP: 图片上边距
 * - DEFAULT_MAX_WIDTH: 默认最大宽度
 * - DEFAULT_RATIO: 默认宽高比（1:1，正方形）
 */
const BORDER_WIDTH = 1 // 边框宽度（px）
const BORDER_COLOR = "rgb(207, 217, 222)" // 边框颜色
const BACKGROUND_COLOR = "rgb(239, 243, 244)" // 浅灰色占位背景
const DEFAULT_MARGIN_TOP = 12 // 默认上边距（px）
const DEFAULT_MARGIN_BOTTOM = 0 // 默认下边距（px）
const DEFAULT_MAX_WIDTH = "100%" // 默认最大宽度
const DEFAULT_RATIO: [number, number] = [1, 1] // 默认宽高比（正方形）

// ============================================ MomentImg1 Component ============================================

/**
 * MomentImg1 - 朋友圈单图组件
 *
 * 用于显示朋友圈中的单张图片，带 1px 边框（无圆角）
 *
 * @example
 * <MomentImg1 url="https://example.com/image.jpg" />
 * <MomentImg1 url="https://example.com/image.jpg" ratio={[16, 9]} />
 */
const MomentImg1 = (props: MomentImg1Props) => {
    // 获取宽高比，默认 1:1
    const ratio = defaultTo(props.ratio, DEFAULT_RATIO)

    // 计算宽高比字符串
    const ratioString = `${ratio[0]} / ${ratio[1]}`

    // 获取对齐方式，默认 center
    const position = defaultTo(props.position, "center")

    // 获取最大宽度，默认 100%
    const maxWidth = defaultTo(props.maxWidth, DEFAULT_MAX_WIDTH)

    // 获取上边距，默认 DEFAULT_MARGIN_TOP
    const marginTop = defaultTo(props.mt, DEFAULT_MARGIN_TOP)

    // 获取下边距，默认 DEFAULT_MARGIN_BOTTOM
    const marginBottom = defaultTo(props.mb, DEFAULT_MARGIN_BOTTOM)

    // 图片样式，始终应用宽高比
    const finalImgStyle: CSSProperties = {
        ...imgStyle,
        aspectRatio: ratioString,
        objectFit: "cover",
        objectPosition: position,
    }

    const finalWrapperStyle: CSSProperties = {
        ...wrapperStyle,
        maxWidth: maxWidth,
        marginTop: marginTop,
        marginBottom: marginBottom,
    }

    return (
        <SectionEx
            style={finalWrapperStyle}
            important={[['max-width', typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth]]}
        >
            <img
                src={props.url}
                alt=""
                style={finalImgStyle}
            />
        </SectionEx>
    )
}

export default MomentImg1

// ============================================ Styles ============================================

const wrapperStyle: CSSProperties = {
    boxSizing: "border-box",
    display: "block",
    borderStyle: "solid",
    borderWidth: BORDER_WIDTH,
    borderColor: BORDER_COLOR,
    // 无 borderRadius
    overflow: "hidden",
    width: "100%",
    marginRight: "auto", //如果宽度较小，始终保持靠左
    backgroundColor: BACKGROUND_COLOR,
    // marginTop 和 marginBottom 通过 defaultTo 动态设置
}

const imgStyle: CSSProperties = {
    display: "block",
    width: "100%",
    height: "auto",
    objectFit: "cover",
}

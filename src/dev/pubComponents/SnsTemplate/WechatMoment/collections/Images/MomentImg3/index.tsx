import { defaultTo } from "es-toolkit/compat"
import { CSSProperties } from "react"
import { MOMENT_CONSTANTS } from "../../../constants"

// ============================================ Types ============================================

interface ImageConfig {
    /** 图片 URL */
    url: string
    /** 图片裁剪对齐方式，仅在设置 ratio 时生效 */
    position?: "center" | "top" | "bottom" | "left" | "right"
}

interface MomentImg3Props {
    /** 第一张图片配置 */
    pic1: ImageConfig
    /** 第二张图片配置 */
    pic2: ImageConfig
    /** 第三张图片配置 */
    pic3: ImageConfig
    /** 图片之间的间隙，默认 4px */
    gap?: number
    /** 最大宽度，支持数字（px）或字符串（如 "100%"、"300px" 等） */
    maxWidth?: number | string
    /** 上边距，默认 12px */
    mt?: number
    /** 下边距，默认 0 */
    mb?: number
}

// ============================================ Constants ============================================

/**
 * MomentImg3 组件常量配置
 *
 * 魔法数字说明：
 * - BORDER_WIDTH: 图片边框宽度
 * - BORDER_COLOR: 边框颜色
 * - BACKGROUND_COLOR: 占位背景颜色
 * - DEFAULT_MARGIN_TOP: 图片上边距
 * - DEFAULT_MARGIN_BOTTOM: 图片下边距
 * - DEFAULT_MAX_WIDTH: 默认最大宽度
 * - DEFAULT_GAP: 默认间隙（使用 MOMENT_CONSTANTS.IMAGE_GRID_GAP）
 * - DEFAULT_RATIO: 默认正方形（1:1）
 */
const BORDER_WIDTH = 1 // 边框宽度（px）
const BORDER_COLOR = "rgb(207, 217, 222)" // 边框颜色
const BACKGROUND_COLOR = "rgb(239, 243, 244)" // 浅灰色占位背景
const DEFAULT_MARGIN_TOP = 12 // 默认上边距（px）
const DEFAULT_MARGIN_BOTTOM = 0 // 默认下边距（px）
const DEFAULT_MAX_WIDTH = "100%" // 默认最大宽度
const DEFAULT_GAP = MOMENT_CONSTANTS.IMAGE_GRID_GAP // 默认间隙（px）
const DEFAULT_RATIO = "1 / 1" // 默认正方形（1:1）

// ============================================ MomentImg3 Component ============================================

/**
 * MomentImg3 - 朋友圈三图组件
 *
 * 用于显示朋友圈中的三张图片，横向排列
 * 每个图片都是独立的，带 1px 边框（无圆角），默认都是正方形（1:1）
 *
 * @example
 * <MomentImg3
 *   pic1={{ url: "https://example.com/image1.jpg" }}
 *   pic2={{ url: "https://example.com/image2.jpg" }}
 *   pic3={{ url: "https://example.com/image3.jpg" }}
 * />
 * <MomentImg3
 *   pic1={{ url: "https://example.com/image1.jpg" }}
 *   pic2={{ url: "https://example.com/image2.jpg" }}
 *   pic3={{ url: "https://example.com/image3.jpg" }}
 *   gap={6}
 * />
 */
const MomentImg3 = (props: MomentImg3Props) => {
    // 获取间隙大小，默认 DEFAULT_GAP
    const gapSize = defaultTo(props.gap, DEFAULT_GAP)

    // 获取最大宽度，默认 100%
    const maxWidth = defaultTo(props.maxWidth, DEFAULT_MAX_WIDTH)

    // 获取上边距，默认 DEFAULT_MARGIN_TOP
    const marginTop = defaultTo(props.mt, DEFAULT_MARGIN_TOP)

    // 获取下边距，默认 DEFAULT_MARGIN_BOTTOM
    const marginBottom = defaultTo(props.mb, DEFAULT_MARGIN_BOTTOM)

    // 获取图片样式（始终应用 1:1 宽高比）
    const getImgStyle = (position?: "center" | "top" | "bottom" | "left" | "right"): CSSProperties => {
        const pos = defaultTo(position, "center")

        return {
            ...imgStyle,
            aspectRatio: DEFAULT_RATIO,
            objectFit: "cover",
            objectPosition: pos,
        }
    }

    // 动态设置外层容器样式（包含 maxWidth、marginTop、marginBottom）
    const finalWrapperStyle: CSSProperties = {
        ...wrapperStyle,
        maxWidth: maxWidth,
        marginTop: marginTop,
        marginBottom: marginBottom,
    }

    // 动态设置间隙样式
    const gapStyleDynamic: CSSProperties = {
        ...gapStyle,
        width: gapSize,
    }

    return (
        <section style={finalWrapperStyle}>
            {/* 第一张图片 */}
            <section style={imageWrapperStyle}>
                <img
                    src={props.pic1.url}
                    alt=""
                    style={getImgStyle(props.pic1.position)}
                />
            </section>

            {/* 间隙 */}
            <section style={gapStyleDynamic}></section>

            {/* 第二张图片 */}
            <section style={imageWrapperStyle}>
                <img
                    src={props.pic2.url}
                    alt=""
                    style={getImgStyle(props.pic2.position)}
                />
            </section>

            {/* 间隙 */}
            <section style={gapStyleDynamic}></section>

            {/* 第三张图片 */}
            <section style={imageWrapperStyle}>
                <img
                    src={props.pic3.url}
                    alt=""
                    style={getImgStyle(props.pic3.position)}
                />
            </section>
        </section>
    )
}

export default MomentImg3

// ============================================ Styles ============================================

const wrapperStyle: CSSProperties = {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "row",
    width: "100%",
    marginRight: "auto", // 如果宽度较小，始终保持靠左
    // marginTop 和 marginBottom 通过 defaultTo 动态设置
}

const imageWrapperStyle: CSSProperties = {
    flex: 1,
    display: "block",
    borderStyle: "solid",
    borderWidth: BORDER_WIDTH,
    borderColor: BORDER_COLOR,
    borderRadius: 0, // 无圆角
    overflow: "hidden",
    backgroundColor: BACKGROUND_COLOR,
}

const imgStyle: CSSProperties = {
    display: "block",
    width: "100%",
    height: "auto",
}

const gapStyle: CSSProperties = {
    flexShrink: 0,
}

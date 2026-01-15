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

interface MomentImg56Props {
    /** 第一张图片配置（左上） */
    pic1?: ImageConfig | null
    /** 第二张图片配置（中上） */
    pic2?: ImageConfig | null
    /** 第三张图片配置（右上） */
    pic3?: ImageConfig | null
    /** 第四张图片配置（左下） */
    pic4?: ImageConfig | null
    /** 第五张图片配置（中下，可选） */
    pic5?: ImageConfig | null
    /** 第六张图片配置（右下，可选） */
    pic6?: ImageConfig | null
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
 * MomentImg56 组件常量配置
 *
 * 魔法数字说明：
 * - BORDER_WIDTH: 图片边框宽度
 * - BORDER_COLOR: 边框颜色
 * - BACKGROUND_COLOR: 占位背景颜色
 * - DEFAULT_MARGIN_TOP: 默认上边距
 * - DEFAULT_MARGIN_BOTTOM: 默认下边距
 * - DEFAULT_MAX_WIDTH: 默认最大宽度
 * - DEFAULT_GAP: 默认间隙
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

// ============================================ MomentImg56 Component ============================================

/**
 * MomentImg56 - 朋友圈五六图组件
 *
 * 用于显示朋友圈中的五张或六张图片，3x2 布局
 * 每个位置都可以传入 ImageConfig 或 null，null 时显示透明占位
 * - 5张图：某个位置传 null 即可显示透明占位
 * - 6张图：所有位置都传图片配置
 * 每个图片都是独立的，带 1px 边框（无圆角），默认都是正方形（1:1）
 *
 * @example
 * // 5张图（pic5 为 null 占位）
 * <MomentImg56
 *   pic1={{ url: "https://example.com/image1.jpg" }}
 *   pic2={{ url: "https://example.com/image2.jpg" }}
 *   pic3={{ url: "https://example.com/image3.jpg" }}
 *   pic4={{ url: "https://example.com/image4.jpg" }}
 *   pic5={null}
 *   pic6={{ url: "https://example.com/image5.jpg" }}
 * />
 *
 * // 6张图
 * <MomentImg56
 *   pic1={{ url: "https://example.com/image1.jpg" }}
 *   pic2={{ url: "https://example.com/image2.jpg" }}
 *   pic3={{ url: "https://example.com/image3.jpg" }}
 *   pic4={{ url: "https://example.com/image4.jpg" }}
 *   pic5={{ url: "https://example.com/image5.jpg" }}
 *   pic6={{ url: "https://example.com/image6.jpg" }}
 * />
 */
const MomentImg56 = (props: MomentImg56Props) => {
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
    const gapRowStyleDynamic: CSSProperties = {
        ...gapRowStyle,
        height: gapSize,
    }

    const gapColStyleDynamic: CSSProperties = {
        ...gapColStyle,
        width: gapSize,
    }

    // 透明占位 SVG
    const placeholderSvg = (
        <svg
            style={{ display: "block", width: "100%", height: "100%" }}
            viewBox="0 0 1 1"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect width="1" height="1" fill="transparent" />
        </svg>
    )

    // 渲染单个位置（图片或占位）
    const renderSlot = (config: ImageConfig | null | undefined) => {
        if (!config) {
            // null 或 undefined 时显示透明占位
            return (
                <section style={placeholderWrapperStyle}>
                    {placeholderSvg}
                </section>
            )
        }
        // 有图片配置时显示图片
        return (
            <section style={imageWrapperStyle}>
                <img
                    src={config.url}
                    alt=""
                    style={getImgStyle(config.position)}
                />
            </section>
        )
    }

    return (
        <section style={finalWrapperStyle}>
            {/* 第一行（3个位置） */}
            <section style={rowStyle}>
                {/* 左上位置 */}
                {renderSlot(props.pic1)}

                {/* 列间隙 */}
                <section style={gapColStyleDynamic}></section>

                {/* 中上位置 */}
                {renderSlot(props.pic2)}

                {/* 列间隙 */}
                <section style={gapColStyleDynamic}></section>

                {/* 右上位置 */}
                {renderSlot(props.pic3)}
            </section>

            {/* 行间隙 */}
            <section style={gapRowStyleDynamic}></section>

            {/* 第二行（3个位置） */}
            <section style={rowStyle}>
                {/* 左下位置 */}
                {renderSlot(props.pic4)}

                {/* 列间隙 */}
                <section style={gapColStyleDynamic}></section>

                {/* 中下位置 */}
                {renderSlot(props.pic5)}

                {/* 列间隙 */}
                <section style={gapColStyleDynamic}></section>

                {/* 右下位置 */}
                {renderSlot(props.pic6)}
            </section>
        </section>
    )
}

export default MomentImg56

// ============================================ Styles ============================================

const wrapperStyle: CSSProperties = {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    marginRight: "auto", // 如果宽度较小，始终保持靠左
    // marginTop 和 marginBottom 通过 defaultTo 动态设置
}

const rowStyle: CSSProperties = {
    display: "flex",
    flexDirection: "row",
    flex: 1,
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

const placeholderWrapperStyle: CSSProperties = {
    flex: 1,
    display: "block",
    borderStyle: "solid",
    borderWidth: BORDER_WIDTH,
    borderColor: "transparent", // 透明边框
    borderRadius: 0,
    overflow: "hidden",
    backgroundColor: "transparent", // 透明背景
}

const imgStyle: CSSProperties = {
    display: "block",
    width: "100%",
    height: "auto",
}

const gapRowStyle: CSSProperties = {
    flexShrink: 0,
}

const gapColStyle: CSSProperties = {
    flexShrink: 0,
}

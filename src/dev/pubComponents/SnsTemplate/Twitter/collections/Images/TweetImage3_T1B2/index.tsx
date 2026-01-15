import { defaultTo } from "es-toolkit/compat"
import { CSSProperties } from "react"

// ============================================ TweetImage3_T1B2 Component ============================================

interface ImageConfig {
    /** 图片 URL */
    url: string
    /** 图片裁剪对齐方式，仅在设置 ratio 时生效 */
    position?: "center" | "top" | "bottom" | "left" | "right"
}

interface TweetImage3_T1B2Props {
    /** 上方图片配置 */
    picTop: ImageConfig
    /** 下方左侧图片配置 */
    picBottomLeft: ImageConfig
    /** 下方右侧图片配置 */
    picBottomRight: ImageConfig
    /** 整个容器的宽高比，例如 [16, 9] 表示 16:9 */
    ratio?: [number, number]
    /** 图片之间的间隙，默认 4px */
    gap?: number
}

/**
 * TweetImage3_T1B2 - Twitter 推文三图组件（上一一下二布局）
 *
 * 用于显示推文中的三张图片，上面一张占据整个宽度，下面两张左右排列
 * 上下两层高度相等，下面两张等宽
 * 布局结构：[      上      ]
 *           [左下] [右下]
 *
 * @example
 * <TweetImage3_T1B2
 *   picTop={{ url: "https://example.com/image1.jpg" }}
 *   picBottomLeft={{ url: "https://example.com/image2.jpg" }}
 *   picBottomRight={{ url: "https://example.com/image3.jpg" }}
 * />
 */
const TweetImage3_T1B2 = (props: TweetImage3_T1B2Props) => {
    // 计算宽高比
    const ratio = defaultTo(props.ratio, [16, 9])

    // 获取间隙大小，默认 4px
    const gapSize = defaultTo(props.gap, 4)

    // 上方图片的 aspect-ratio（宽度保持，高度减半）
    const topImgRatioString = `${ratio[0]} / ${ratio[1] / 2}`
    // 下方每张图片的 aspect-ratio（保持原始比例）
    const bottomImgRatioString = `${ratio[0]} / ${ratio[1]}`

    // 获取上方图片样式
    const getTopImgStyle = (position?: "center" | "top" | "bottom" | "left" | "right"): CSSProperties => {
        const pos = defaultTo(position, "center")
        return {
            ...imgStyle,
            aspectRatio: topImgRatioString,
            objectPosition: pos,
        }
    }

    // 获取下方图片样式
    const getBottomImgStyle = (position?: "center" | "top" | "bottom" | "left" | "right"): CSSProperties => {
        const pos = defaultTo(position, "center")
        return {
            ...imgStyle,
            aspectRatio: bottomImgRatioString,
            objectPosition: pos,
        }
    }

    // 分割线样式（垂直方向，用于上下间隙）
    const dividerStyleDynamic: CSSProperties = {
        ...dividerStyle,
        height: gapSize,
    }

    // 水平分割线样式（用于左右间隙）
    const horizontalDividerStyleDynamic: CSSProperties = {
        ...dividerStyle,
        width: gapSize,
    }

    return (
        <section style={wrapperStyle}>
            {/* 上方图片 */}
            <section style={topContainerStyle}>
                <img
                    src={props.picTop.url}
                    alt=""
                    style={getTopImgStyle(props.picTop.position)}
                />
            </section>

            {/* 上下间隙 */}
            <section style={dividerStyleDynamic}></section>

            {/* 下方容器 */}
            <section style={bottomContainerStyle}>
                {/* 下方左侧图片容器 */}
                <section style={bottomImgContainerStyle}>
                    <img
                        src={props.picBottomLeft.url}
                        alt=""
                        style={getBottomImgStyle(props.picBottomLeft.position)}
                    />
                </section>
                {/* 左右间隙 */}
                <section style={horizontalDividerStyleDynamic}></section>
                {/* 下方右侧图片容器 */}
                <section style={bottomImgContainerStyle}>
                    <img
                        src={props.picBottomRight.url}
                        alt=""
                        style={getBottomImgStyle(props.picBottomRight.position)}
                    />
                </section>
            </section>
        </section>
    )
}

export default TweetImage3_T1B2

// ============================================ Styles ============================================

const wrapperStyle: CSSProperties = {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    marginTop: 12,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "rgb(207, 217, 222)",
    borderRadius: 16,
    overflow: "hidden",
    width: "100%",
    backgroundColor: "rgb(239, 243, 244)",
}

const topContainerStyle: CSSProperties = {
    display: "block",
    overflow: "hidden",
}

const bottomContainerStyle: CSSProperties = {
    display: "flex",
    flexDirection: "row",
}

const bottomImgContainerStyle: CSSProperties = {
    flex: 1,
    display: "block",
    overflow: "hidden",
}

const imgStyle: CSSProperties = {
    display: "block",
    width: "100%",
    height: "auto",
    objectFit: "cover",
    objectPosition: "center",
}

const dividerStyle: CSSProperties = {
    flexShrink: 0,
}

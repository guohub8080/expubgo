import { defaultTo } from "es-toolkit/compat"
import { CSSProperties } from "react"

// ============================================ TweetImage3_T2B1 Component ============================================

interface ImageConfig {
    /** 图片 URL */
    url: string
    /** 图片裁剪对齐方式，仅在设置 ratio 时生效 */
    position?: "center" | "top" | "bottom" | "left" | "right"
}

interface TweetImage3_T2B1Props {
    /** 上方左侧图片配置 */
    picTopLeft: ImageConfig
    /** 上方右侧图片配置 */
    picTopRight: ImageConfig
    /** 下方图片配置 */
    picBottom: ImageConfig
    /** 整个容器的宽高比，例如 [16, 9] 表示 16:9 */
    ratio?: [number, number]
    /** 图片之间的间隙，默认 4px */
    gap?: number
}

/**
 * TweetImage3_T2B1 - Twitter 推文三图组件（上二下一布局）
 *
 * 用于显示推文中的三张图片，上面两张左右排列，下面一张占据整个宽度
 * 上下两层高度相等，上面两张等宽
 * 布局结构：[左上] [右上]
 *           [      下      ]
 *
 * @example
 * <TweetImage3_T2B1
 *   picTopLeft={{ url: "https://example.com/image1.jpg" }}
 *   picTopRight={{ url: "https://example.com/image2.jpg" }}
 *   picBottom={{ url: "https://example.com/image3.jpg" }}
 * />
 */
const TweetImage3_T2B1 = (props: TweetImage3_T2B1Props) => {
    // 计算宽高比
    const ratio = defaultTo(props.ratio, [16, 9])

    // 获取间隙大小，默认 4px
    const gapSize = defaultTo(props.gap, 4)

    // 上方每张图片的 aspect-ratio（宽度减半，高度减半）
    const topImgRatioString = `${ratio[0] / 2} / ${ratio[1] / 2}`
    // 下方图片的 aspect-ratio（宽度保持，高度减半）
    const bottomImgRatioString = `${ratio[0]} / ${ratio[1] / 2}`

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
            {/* 上方容器 */}
            <section style={topContainerStyle}>
                {/* 上方左侧图片容器 */}
                <section style={topImgContainerStyle}>
                    <img
                        src={props.picTopLeft.url}
                        alt=""
                        style={getTopImgStyle(props.picTopLeft.position)}
                    />
                </section>
                {/* 左右间隙 */}
                <section style={horizontalDividerStyleDynamic}></section>
                {/* 上方右侧图片容器 */}
                <section style={topImgContainerStyle}>
                    <img
                        src={props.picTopRight.url}
                        alt=""
                        style={getTopImgStyle(props.picTopRight.position)}
                    />
                </section>
            </section>

            {/* 上下间隙 */}
            <section style={dividerStyleDynamic}></section>

            {/* 下方图片 */}
            <section style={bottomContainerStyle}>
                <img
                    src={props.picBottom.url}
                    alt=""
                    style={getBottomImgStyle(props.picBottom.position)}
                />
            </section>
        </section>
    )
}

export default TweetImage3_T2B1

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
    display: "flex",
    flexDirection: "row",
}

const topImgContainerStyle: CSSProperties = {
    flex: 1,
    display: "block",
    overflow: "hidden",
}

const bottomContainerStyle: CSSProperties = {
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

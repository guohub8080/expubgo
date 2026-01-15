import { defaultTo } from "es-toolkit/compat"
import { CSSProperties } from "react"

// ============================================ TweetImage4 Component ============================================

interface ImageConfig {
    /** 图片 URL */
    url: string
    /** 图片裁剪对齐方式，仅在设置 ratio 时生效 */
    position?: "center" | "top" | "bottom" | "left" | "right"
}

interface TweetImage4Props {
    /** 左上图片配置 */
    picTopLeft: ImageConfig
    /** 右上图片配置 */
    picTopRight: ImageConfig
    /** 左下图片配置 */
    picBottomLeft: ImageConfig
    /** 右下图片配置 */
    picBottomRight: ImageConfig
    /** 整个容器的宽高比，例如 [16, 9] 表示 16:9 */
    ratio?: [number, number]
    /** 图片之间的间隙，默认 4px */
    gap?: number
}

/**
 * TweetImage4 - Twitter 推文四图组件（2x2 网格布局）
 *
 * 用于显示推文中的四张图片，2x2 网格布局
 * 四张图片等宽等高
 * 布局结构：[左上] [右上]
 *           [左下] [右下]
 *
 * @example
 * <TweetImage4
 *   picTopLeft={{ url: "https://example.com/image1.jpg" }}
 *   picTopRight={{ url: "https://example.com/image2.jpg" }}
 *   picBottomLeft={{ url: "https://example.com/image3.jpg" }}
 *   picBottomRight={{ url: "https://example.com/image4.jpg" }}
 * />
 */
const TweetImage4 = (props: TweetImage4Props) => {
    // 计算宽高比
    const ratio = defaultTo(props.ratio, [16, 9])

    // 获取间隙大小，默认 4px
    const gapSize = defaultTo(props.gap, 4)

    // 每张图片的 aspect-ratio（宽度减半，高度减半）
    const imgRatioString = `${ratio[0] / 2} / ${ratio[1] / 2}`

    // 获取图片样式
    const getImgStyle = (position?: "center" | "top" | "bottom" | "left" | "right"): CSSProperties => {
        const pos = defaultTo(position, "center")
        return {
            ...imgStyle,
            aspectRatio: imgRatioString,
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
            <section style={rowStyle}>
                {/* 左上图片容器 */}
                <section style={imgContainerStyle}>
                    <img
                        src={props.picTopLeft.url}
                        alt=""
                        style={getImgStyle(props.picTopLeft.position)}
                    />
                </section>
                {/* 左右间隙 */}
                <section style={horizontalDividerStyleDynamic}></section>
                {/* 右上图片容器 */}
                <section style={imgContainerStyle}>
                    <img
                        src={props.picTopRight.url}
                        alt=""
                        style={getImgStyle(props.picTopRight.position)}
                    />
                </section>
            </section>

            {/* 上下间隙 */}
            <section style={dividerStyleDynamic}></section>

            {/* 下方容器 */}
            <section style={rowStyle}>
                {/* 左下图片容器 */}
                <section style={imgContainerStyle}>
                    <img
                        src={props.picBottomLeft.url}
                        alt=""
                        style={getImgStyle(props.picBottomLeft.position)}
                    />
                </section>
                {/* 左右间隙 */}
                <section style={horizontalDividerStyleDynamic}></section>
                {/* 右下图片容器 */}
                <section style={imgContainerStyle}>
                    <img
                        src={props.picBottomRight.url}
                        alt=""
                        style={getImgStyle(props.picBottomRight.position)}
                    />
                </section>
            </section>
        </section>
    )
}

export default TweetImage4

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

const rowStyle: CSSProperties = {
    display: "flex",
    flexDirection: "row",
}

const imgContainerStyle: CSSProperties = {
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

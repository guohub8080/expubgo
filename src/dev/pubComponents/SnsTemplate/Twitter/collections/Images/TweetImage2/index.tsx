import { defaultTo } from "es-toolkit/compat"
import { CSSProperties } from "react"

// ============================================ TweetImage2 Component ============================================

interface ImageConfig {
    /** 图片 URL */
    url: string
    /** 图片裁剪对齐方式，仅在设置 ratio 时生效 */
    position?: "center" | "top" | "bottom" | "left" | "right"
}

interface TweetImage2Props {
    /** 第一张图片配置 */
    pic1: ImageConfig
    /** 第二张图片配置 */
    pic2: ImageConfig
    /** 整个容器的宽高比，例如 [1, 1] 表示正方形，[16, 9] 表示 16:9 */
    ratio?: [number, number]
    /** 两张图片之间的间隙，默认 4px */
    gap?: number
}

/**
 * TweetImage2 - Twitter 推文双图组件
 *
 * 用于显示推文中的两张图片，左右排列，带 16px 圆角和 1px 边框
 *
 * @example
 * <TweetImage2
 *   pic1={{ url: "https://example.com/image1.jpg" }}
 *   pic2={{ url: "https://example.com/image2.jpg" }}
 * />
 */
const TweetImage2 = (props: TweetImage2Props) => {
    // 计算宽高比字符串（如果是双图，宽度除以2）
    const ratioString = props.ratio ? `${props.ratio[0] / 2} / ${props.ratio[1]}` : undefined

    // 获取间隙大小，默认 4px
    const gapSize = defaultTo(props.gap, 4)

    // 获取图片样式（根据是否有 ratio 和 position）
    const getImgStyle = (position?: "center" | "top" | "bottom" | "left" | "right"): CSSProperties => {
        const pos = defaultTo(position, "center")

        return props.ratio ? {
            ...imgStyle,
            aspectRatio: ratioString,
            height: "auto",
            objectFit: "cover",
            objectPosition: pos,
        } : imgStyle
    }

    // 动态设置分割线样式
    const dividerStyleDynamic: CSSProperties = {
        ...dividerStyle,
        width: gapSize,
    }

    return (
        <section style={wrapperStyle}>
            <section style={imageContainerStyle}>
                <img
                    src={props.pic1.url}
                    alt=""
                    style={getImgStyle(props.pic1.position)}
                />
            </section>
            <section style={dividerStyleDynamic}></section>
            <section style={imageContainerStyle}>
                <img
                    src={props.pic2.url}
                    alt=""
                    style={getImgStyle(props.pic2.position)}
                />
            </section>
        </section>
    )
}

export default TweetImage2

// ============================================ Styles ============================================

const wrapperStyle: CSSProperties = {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "row",
    marginTop: 12,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "rgb(207, 217, 222)",
    borderRadius: 16,
    overflow: "hidden",
    width: "100%",
    backgroundColor: "rgb(239, 243, 244)", // 浅灰色占位背景
}

const imageContainerStyle: CSSProperties = {
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
    width: 4,
    flexShrink: 0,
}

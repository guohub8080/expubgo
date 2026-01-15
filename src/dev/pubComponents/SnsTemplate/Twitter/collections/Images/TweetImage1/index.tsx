import { defaultTo } from "es-toolkit/compat"
import { CSSProperties } from "react"

// ============================================ TweetImage1 Component ============================================

interface TweetImage1Props {
    /** 图片 URL */
    url: string
    /** 图片宽高比，例如 [1, 1] 表示正方形，[16, 9] 表示 16:9 */
    ratio?: [number, number]
    /** 图片裁剪对齐方式，仅在设置 ratio 时生效 */
    position?: "center" | "top" | "bottom" | "left" | "right"
}

/**
 * TweetImage1 - Twitter 推文单图组件
 *
 * 用于显示推文中的单张图片，带 16px 圆角和 1px 边框
 *
 * @example
 * <TweetImage1 url="https://example.com/image.jpg" />
 */
const TweetImage1 = (props: TweetImage1Props) => {
    // 计算宽高比字符串
    const ratioString = props.ratio ? `${props.ratio[0]} / ${props.ratio[1]}` : undefined

    // 获取对齐方式，默认 center
    const position = defaultTo(props.position, "center")

    // 根据是否有 ratio 决定图片样式
    const imgStyleWithRatio: CSSProperties = props.ratio ? {
        ...imgStyle,
        aspectRatio: ratioString,
        height: "auto",
        objectFit: "cover",
        objectPosition: position,
    } : imgStyle

    return (
        <section style={wrapperStyle}>
            <img
                src={props.url}
                alt=""
                style={imgStyleWithRatio}
            />
        </section>
    )
}

export default TweetImage1

// ============================================ Styles ============================================

const wrapperStyle: CSSProperties = {
    boxSizing: "border-box",
    display: "block",
    marginTop: 12,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "rgb(207, 217, 222)",
    borderRadius: 16,
    overflow: "hidden",
    width: "100%",
    backgroundColor: "rgb(239, 243, 244)", // 浅灰色占位背景
}

const imgStyle: CSSProperties = {
    display: "block",
    width: "100%",
    height: "auto",
    objectFit: "cover",
}

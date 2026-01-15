import { defaultTo } from "es-toolkit/compat"
import { CSSProperties } from "react"

// ============================================ TweetImage3_L2R1 Component ============================================

interface ImageConfig {
    /** 图片 URL */
    url: string
    /** 图片裁剪对齐方式，仅在设置 ratio 时生效 */
    position?: "center" | "top" | "bottom" | "left" | "right"
}

interface TweetImage3_L2R1Props {
    /** 左上图片配置 */
    picTopLeft: ImageConfig
    /** 左下图片配置 */
    picBottomLeft: ImageConfig
    /** 右侧图片配置 */
    picRight: ImageConfig
    /** 整个容器的宽高比，例如 [16, 9] 表示 16:9 */
    ratio?: [number, number]
    /** 图片之间的间隙，默认 4px */
    gap?: number
}

/**
 * TweetImage3_L2R1 - Twitter 推文三图组件（左二右一布局）
 *
 * 用于显示推文中的三张图片，左边两张上下排列，右边一张占据整个右侧
 * 左右两栏等宽，左上和左下等高
 * 布局结构：[左上] [右]
 *           [左下] [右]
 *
 * @example
 * <TweetImage3_L2R1
 *   picTopLeft={{ url: "https://example.com/image1.jpg" }}
 *   picBottomLeft={{ url: "https://example.com/image2.jpg" }}
 *   picRight={{ url: "https://example.com/image3.jpg" }}
 * />
 */
const TweetImage3_L2R1 = (props: TweetImage3_L2R1Props) => {
    // 计算宽高比
    const ratio = defaultTo(props.ratio, [16, 9])

    // 获取间隙大小，默认 4px
    const gapSize = defaultTo(props.gap, 4)

    // 左侧每张图片的 aspect-ratio（宽度减半，高度也减半）
    const leftImgRatioString = `${ratio[0] / 2} / ${ratio[1] / 2}`
    // 右侧图片的 aspect-ratio（宽度减半，高度保持）
    const rightImgRatioString = `${ratio[0] / 2} / ${ratio[1]}`

    // 获取左侧图片样式
    const getLeftImgStyle = (position?: "center" | "top" | "bottom" | "left" | "right"): CSSProperties => {
        const pos = defaultTo(position, "center")
        return {
            ...imgStyle,
            ...leftImgStyle,
            aspectRatio: leftImgRatioString,
            objectPosition: pos,
        }
    }

    // 获取右侧图片样式
    const getRightImgStyle = (position?: "center" | "top" | "bottom" | "left" | "right"): CSSProperties => {
        const pos = defaultTo(position, "center")
        return {
            ...imgStyle,
            aspectRatio: rightImgRatioString,
            objectPosition: pos,
        }
    }

    // 分割线样式
    const dividerStyleDynamic: CSSProperties = {
        ...dividerStyle,
        width: gapSize,
    }

    return (
        <section style={wrapperStyle}>
            {/* 左侧容器 */}
            <section style={leftContainerStyle}>
                {/* 左上图片 */}
                <img
                    src={props.picTopLeft.url}
                    alt=""
                    style={getLeftImgStyle(props.picTopLeft.position)}
                />
                {/* 左下图片 */}
                <img
                    src={props.picBottomLeft.url}
                    alt=""
                    style={getLeftImgStyle(props.picBottomLeft.position)}
                />
            </section>

            {/* 左右间隙 */}
            <section style={dividerStyleDynamic}></section>

            {/* 右侧图片 */}
            <section style={rightContainerStyle}>
                <img
                    src={props.picRight.url}
                    alt=""
                    style={getRightImgStyle(props.picRight.position)}
                />
            </section>
        </section>
    )
}

export default TweetImage3_L2R1

// ============================================ Styles ============================================

const wrapperStyle: CSSProperties = {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "row",
    alignItems: "stretch",
    marginTop: 12,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "rgb(207, 217, 222)",
    borderRadius: 16,
    overflow: "hidden",
    width: "100%",
    backgroundColor: "rgb(239, 243, 244)",
}

const leftContainerStyle: CSSProperties = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
}

const rightContainerStyle: CSSProperties = {
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

const leftImgStyle: CSSProperties = {
    flex: 1,
    height: "100%",
}

const dividerStyle: CSSProperties = {
    flexShrink: 0,
}

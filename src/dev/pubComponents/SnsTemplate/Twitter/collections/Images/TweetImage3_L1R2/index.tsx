import { defaultTo } from "es-toolkit/compat"
import { CSSProperties } from "react"

// ============================================ TweetImage3_L1R2 Component ============================================

interface ImageConfig {
    /** 图片 URL */
    url: string
    /** 图片裁剪对齐方式，仅在设置 ratio 时生效 */
    position?: "center" | "top" | "bottom" | "left" | "right"
}

interface TweetImage3_L1R2Props {
    /** 左侧图片配置 */
    picLeft: ImageConfig
    /** 右上图片配置 */
    picTopRight: ImageConfig
    /** 右下图片配置 */
    picBottomRight: ImageConfig
    /** 整个容器的宽高比，例如 [16, 9] 表示 16:9 */
    ratio?: [number, number]
    /** 图片之间的间隙，默认 4px */
    gap?: number
}

/**
 * TweetImage3_L1R2 - Twitter 推文三图组件（左一右二布局）
 *
 * 用于显示推文中的三张图片，左边一张占据整个左侧，右边两张上下排列
 * 左右两栏等宽，右上和右下等高
 * 布局结构：[左] [右上]
 *           [左] [右下]
 *
 * @example
 * <TweetImage3_L1R2
 *   picLeft={{ url: "https://example.com/image1.jpg" }}
 *   picTopRight={{ url: "https://example.com/image2.jpg" }}
 *   picBottomRight={{ url: "https://example.com/image3.jpg" }}
 * />
 */
const TweetImage3_L1R2 = (props: TweetImage3_L1R2Props) => {
    // 计算宽高比
    const ratio = defaultTo(props.ratio, [16, 9])

    // 获取间隙大小，默认 4px
    const gapSize = defaultTo(props.gap, 4)

    // 左侧图片的 aspect-ratio（宽度减半，高度保持）
    const leftImgRatioString = `${ratio[0] / 2} / ${ratio[1]}`
    // 右侧每张图片的 aspect-ratio（宽度减半，高度减半）
    const rightImgRatioString = `${ratio[0] / 2} / ${ratio[1] / 2}`

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
            ...rightImgStyle,
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
            {/* 左侧图片 */}
            <section style={leftContainerStyle}>
                <img
                    src={props.picLeft.url}
                    alt=""
                    style={getLeftImgStyle(props.picLeft.position)}
                />
            </section>

            {/* 左右间隙 */}
            <section style={dividerStyleDynamic}></section>

            {/* 右侧容器 */}
            <section style={rightContainerStyle}>
                {/* 右上图片 */}
                <img
                    src={props.picTopRight.url}
                    alt=""
                    style={getRightImgStyle(props.picTopRight.position)}
                />
                {/* 右下图片 */}
                <img
                    src={props.picBottomRight.url}
                    alt=""
                    style={getRightImgStyle(props.picBottomRight.position)}
                />
            </section>
        </section>
    )
}

export default TweetImage3_L1R2

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
    display: "block",
    overflow: "hidden",
}

const rightContainerStyle: CSSProperties = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
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

const rightImgStyle: CSSProperties = {
    flex: 1,
}

const dividerStyle: CSSProperties = {
    flexShrink: 0,
}

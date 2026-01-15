import { defaultTo } from "es-toolkit/compat"
import { CSSProperties } from "react"

// ============================================ TweetImage6 Component ============================================

interface ImageConfig {
    /** 图片 URL */
    url: string
    /** 图片裁剪对齐方式，仅在设置 ratio 时生效 */
    position?: "center" | "top" | "bottom" | "left" | "right"
}

interface TweetImage6Props {
    /** 第一行第一张图片配置 */
    pic1: ImageConfig
    /** 第一行第二张图片配置 */
    pic2: ImageConfig
    /** 第一行第三张图片配置 */
    pic3: ImageConfig
    /** 第二行第一张图片配置 */
    pic4: ImageConfig
    /** 第二行第二张图片配置 */
    pic5: ImageConfig
    /** 第二行第三张图片配置 */
    pic6: ImageConfig
    /** 整个容器的宽高比，例如 [16, 9] 表示 16:9 */
    ratio?: [number, number]
    /** 图片之间的间隙，默认 4px */
    gap?: number
}

/**
 * TweetImage6 - Twitter 推文六图组件（3x2 网格布局）
 *
 * 用于显示推文中的六张图片，每行3张图，共2行
 * 六张图片等宽等高
 * 布局结构：[1] [2] [3]
 *           [4] [5] [6]
 *
 * @example
 * <TweetImage6
 *   pic1={{ url: "https://example.com/image1.jpg" }}
 *   pic2={{ url: "https://example.com/image2.jpg" }}
 *   pic3={{ url: "https://example.com/image3.jpg" }}
 *   pic4={{ url: "https://example.com/image4.jpg" }}
 *   pic5={{ url: "https://example.com/image5.jpg" }}
 *   pic6={{ url: "https://example.com/image6.jpg" }}
 * />
 */
const TweetImage6 = (props: TweetImage6Props) => {
    // 计算宽高比
    const ratio = defaultTo(props.ratio, [16, 9])

    // 获取间隙大小，默认 4px
    const gapSize = defaultTo(props.gap, 4)

    // 每张图片的 aspect-ratio（宽度除以3，高度除以2）
    const imgRatioString = `${ratio[0] / 3} / ${ratio[1] / 2}`

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
            {/* 第一行 */}
            <section style={rowStyle}>
                {/* 第一张图片 */}
                <section style={imgContainerStyle}>
                    <img
                        src={props.pic1.url}
                        alt=""
                        style={getImgStyle(props.pic1.position)}
                    />
                </section>
                {/* 间隙 */}
                <section style={horizontalDividerStyleDynamic}></section>
                {/* 第二张图片 */}
                <section style={imgContainerStyle}>
                    <img
                        src={props.pic2.url}
                        alt=""
                        style={getImgStyle(props.pic2.position)}
                    />
                </section>
                {/* 间隙 */}
                <section style={horizontalDividerStyleDynamic}></section>
                {/* 第三张图片 */}
                <section style={imgContainerStyle}>
                    <img
                        src={props.pic3.url}
                        alt=""
                        style={getImgStyle(props.pic3.position)}
                    />
                </section>
            </section>

            {/* 上下间隙 */}
            <section style={dividerStyleDynamic}></section>

            {/* 第二行 */}
            <section style={rowStyle}>
                {/* 第四张图片 */}
                <section style={imgContainerStyle}>
                    <img
                        src={props.pic4.url}
                        alt=""
                        style={getImgStyle(props.pic4.position)}
                    />
                </section>
                {/* 间隙 */}
                <section style={horizontalDividerStyleDynamic}></section>
                {/* 第五张图片 */}
                <section style={imgContainerStyle}>
                    <img
                        src={props.pic5.url}
                        alt=""
                        style={getImgStyle(props.pic5.position)}
                    />
                </section>
                {/* 间隙 */}
                <section style={horizontalDividerStyleDynamic}></section>
                {/* 第六张图片 */}
                <section style={imgContainerStyle}>
                    <img
                        src={props.pic6.url}
                        alt=""
                        style={getImgStyle(props.pic6.position)}
                    />
                </section>
            </section>
        </section>
    )
}

export default TweetImage6

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

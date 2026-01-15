import { CSSProperties } from "react"
import SectionEx from "@pub-html/basicEx/SectionEx"
import SvgEx from "@pub-html/basicEx/SvgEx"
import { defaultTo } from "es-toolkit/compat"
import { mpBlank, mpGet, mpProps } from "@styles/funcs/mp"
import getImgSizeByDefault from "@pub-utils/common/getImgSizeByDefault"
import CarouselImage from "./components/CarouselImage"
import { PicConfig } from "./types"
import { normalizePics } from "./config/normalizer"
import { getEaseBezier } from "@pub-utils/getBezier"

/**
 * Carousel - 多图轮播切换组件
 *
 * 效果：图片从不同方向滑入到中心，停留后再滑出，形成连续轮播效果
 *
 * @param props.mp - margin/padding 配置
 * @param props.viewBoxW - ViewBox 宽度
 * @param props.viewBoxH - ViewBox 高度
 * @param props.pics - 图片配置数组
 * @param props.duration - 单次切换时长（秒）
 * @param props.direction - 轮播方向（L/R/T/B）
 * @param props.keySplines - 贝塞尔曲线
 */
const Carousel = (props: {
    mp?: mpProps
    viewBoxW?: number
    viewBoxH?: number
    pics?: PicConfig[]
    duration?: number
    direction?: "L" | "R" | "T" | "B"
    keySplines?: string
}) => {
    const mpResult = mpGet(defaultTo(props.mp, mpBlank))
    const canvasSize = getImgSizeByDefault(props.pics?.[0]?.url, props.viewBoxW, props.viewBoxH)
    const pics = normalizePics(props.pics)

    // 获取时长，默认 3 秒
    const duration = defaultTo(props.duration, 3)

    // 获取方向，默认向左
    const direction = defaultTo(props.direction, "L")

    // 获取贝塞尔曲线，默认 ease-in-out
    const keySplines = defaultTo(props.keySplines, getEaseBezier({ isIn: true, isOut: true }))

    return (
        <SectionEx style={{ ...rootBaseStyle, ...mpResult }} data-label="carousel">
            <section style={innerStyle}>
                <SvgEx viewBox={`0 0 ${canvasSize.w} ${canvasSize.h}`}
                    style={svgStyle}
                    width="100%">
                    {pics.map((pic, index) => (
                        <CarouselImage
                            key={index}
                            pic={pic}
                            index={index}
                            picCount={pics.length}
                            viewBoxW={canvasSize.w}
                            viewBoxH={canvasSize.h}
                            duration={duration}
                            direction={direction}
                            keySplines={keySplines}
                        />
                    ))}
                </SvgEx>
            </section>
        </SectionEx>
    )
}

export default Carousel


/** ================================================== Styles ===================================================== */
const rootBaseStyle: CSSProperties = {
    WebkitTouchCallout: "none",
    userSelect: "text",
    overflow: "hidden",
    textAlign: "center",
    lineHeight: 0,
}

const innerStyle: CSSProperties = {
    overflow: "hidden",
    lineHeight: 0,
    margin: 0,
}

const svgStyle: CSSProperties = {
    display: "block",
    margin: "0 auto",
}

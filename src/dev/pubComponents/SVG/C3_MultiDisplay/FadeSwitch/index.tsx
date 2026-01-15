import { CSSProperties } from "react"
import SectionEx from "@pub-html/basicEx/SectionEx"
import SvgEx from "@pub-html/basicEx/SvgEx"
import { defaultTo } from "es-toolkit/compat"
import { mpBlank, mpGet, mpProps } from "@styles/funcs/mp"
import getImgSizeByDefault from "@pub-utils/common/getImgSizeByDefault"
import FadeSwitchImage from "./components/FadeSwitchImage"
import GhostLayer from "./components/GhostLayer"
import { PicConfig } from "./types"
import { normalizePics } from "./config/normalizer"
import { calculateTotalCycleDuration } from "./timeline/sequenceCalculator"

/**
 * FadeSwitch - 多图渐变切换组件
 *
 * 效果：多张图片通过淡入淡出效果循环切换
 *
 * 每张图片的完整循环：
 * 1. 淡入显示（fadeDuration）
 * 2. 完全显示停留（stayDuration）
 * 3. 开始淡出（下一张图淡入时同时淡出）
 *
 * 图片叠加在同一位置，通过opacity控制显示/隐藏
 *
 * @param props.mp - margin/padding 配置
 * @param props.viewBoxW - ViewBox 宽度
 * @param props.viewBoxH - ViewBox 高度
 * @param props.pics - 图片配置数组
 */
const FadeSwitch = (props: {
    mp?: mpProps
    viewBoxW?: number
    viewBoxH?: number
    pics?: PicConfig[]
}) => {
    const mpResult = mpGet(defaultTo(props.mp, mpBlank))
    const pics = normalizePics(props.pics)
    const canvasSize = getImgSizeByDefault(pics[0].url, props.viewBoxW, props.viewBoxH)

    // 计算总动画时长
    const totalDuration = calculateTotalCycleDuration(pics)

    // 渲染顺序：图片倒序（图n在最下，图1在最上）
    const renderOrder = [...Array(pics.length).keys()].reverse()

    return (
        <SectionEx style={{ ...rootBaseStyle, ...mpResult }} data-label="fade-switch">
            <section style={innerStyle}>
                <SvgEx
                    viewBox={`0 0 ${canvasSize.w} ${canvasSize.h}`}
                    style={svgStyle}
                    width="100%"
                >
                    {/* 假动作层：用于循环收尾的视觉连接（放在最下层） */}
                    <GhostLayer
                        url={pics[0].url}
                        pics={pics}
                        viewBoxW={canvasSize.w}
                        viewBoxH={canvasSize.h}
                        totalDuration={totalDuration}
                    />

                    {/* 主循环层：倒序渲染 */}
                    {renderOrder.map((index) => {
                        const pic = pics[index]
                        return (
                            <FadeSwitchImage
                                key={index}
                                pic={pic}
                                index={index}
                                pics={pics}
                                viewBoxW={canvasSize.w}
                                viewBoxH={canvasSize.h}
                                totalDuration={totalDuration}
                            />
                        )
                    })}
                </SvgEx>
            </section>
        </SectionEx>
    )
}

export default FadeSwitch


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

import {CSSProperties} from "react"
import SectionEx from "@pub-html/basicEx/SectionEx"
import SvgEx from "@pub-html/basicEx/SvgEx"
import {defaultTo} from "es-toolkit/compat"
import {mpBlank, mpGet, mpProps} from "@styles/funcs/mp"
import getImgSizeByDefault from "@pub-utils/common/getImgSizeByDefault"
import PushingImage from "./components/PushingImage"
import {PicConfig} from "./types"
import {normalizePics} from "./config/normalizer"
import {calculateTotalCycleDuration} from "./timeline/sequenceCalculator"

/**
 * AnyPush - 多图循环"推入"切换组件
 *
 * 效果：图片从不同方向滑入到中心，停留后再从另一个方向滑出
 *
 * @param props.mp - margin/padding 配置
 * @param props.viewBoxW - ViewBox 宽度
 * @param props.viewBoxH - ViewBox 高度
 * @param props.pics - 图片配置数组
 */
const AnyPush = (props: {
  mp?: mpProps
  viewBoxW?: number
  viewBoxH?: number
  pics?: PicConfig[]
}) => {
  const mpResult = mpGet(defaultTo(props.mp, mpBlank))
  const canvasSize = getImgSizeByDefault(props.pics?.[0]?.url, props.viewBoxW, props.viewBoxH)
  const pics = normalizePics(props.pics)

  // 预计算总时长（所有图片共享）
  const totalCycleDuration = calculateTotalCycleDuration(pics)

  return (
    <SectionEx style={{...rootBaseStyle, ...mpResult}} data-label="any-push"
    >
      <section style={innerStyle}>
        <SvgEx viewBox={`0 0 ${canvasSize.w} ${canvasSize.h}`}
               style={svgStyle}
               width="100%">
          {pics.map((pic, index) => (
            <PushingImage key={index} pic={pic}
                          index={index} pics={pics}
                          viewBoxW={canvasSize.w}
                          viewBoxH={canvasSize.h}
                          totalCycleDuration={totalCycleDuration}/>
          ))}
        </SvgEx>
      </section>
    </SectionEx>
  )
}

export default AnyPush


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

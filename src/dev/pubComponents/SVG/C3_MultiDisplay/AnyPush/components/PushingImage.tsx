import SvgEx from "@pub-html/basicEx/SvgEx.tsx";
import svgURL from "@pub-utils/common/svgURL.ts";
import { genAnimateTranslate } from "@svg-anim/translate";
import { NormalizedPicConfig } from "../types";
import { calculateDelayTime } from "../timeline/sequenceCalculator";
import { getEntryOffset } from "../timeline/offsetCalculator";
import { assembleTimeline } from "../timeline/segmentAssembler";

/**
 * 单张推入图片组件
 * 职责：渲染单张图片的推入动画
 */
const PushingImage = (props: {
    pic: NormalizedPicConfig
    index: number
    pics: NormalizedPicConfig[]
    viewBoxW: number
    viewBoxH: number
    totalCycleDuration: number
}) => {
    // 使用工具函数获取时间线、延迟时间和初始位置
    const timeline = assembleTimeline(props.index, props.pics, props.viewBoxW, props.viewBoxH, props.totalCycleDuration)
    const delay = calculateDelayTime(props.index, props.pics)
    const initPos = getEntryOffset(props.pic.direction, props.viewBoxW, props.viewBoxH)

    return (
        <g>
            <foreignObject x={initPos.x} y={initPos.y} width={props.viewBoxW} height={props.viewBoxH}>
                <SvgEx
                    style={{
                        display: "block",
                        backgroundImage: svgURL(props.pic.url),
                        backgroundSize: "100% auto",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                    }}
                    viewBox={`0 0 ${props.viewBoxW} ${props.viewBoxH}`}
                    width="100%"
                />
            </foreignObject>
            {genAnimateTranslate({
                initValue: { x: 0, y: 0 },
                timeline,
                loopCount: 0,
                delay,
                isFreeze: true,
                isAdditive: true,
                isRelativeMove: true
            })}
        </g>
    )
}

export default PushingImage

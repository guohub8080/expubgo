import SvgEx from "@pub-html/basicEx/SvgEx";
import svgURL from "@pub-utils/common/svgURL";
import { NormalizedPicConfig } from "../types";
import { buildGhostLayerKeyframes } from "../timeline/keyframeBuilder";

/**
 * 假动作层组件
 * 职责：在循环时提供视觉连接，在最后一张图淡出时显示第一张图的假动作
 */
const GhostLayer = (props: {
    url: string
    pics: NormalizedPicConfig[]
    viewBoxW: number
    viewBoxH: number
    totalDuration: number
}) => {
    // 构建假动作层的关键帧参数
    const keyframes = buildGhostLayerKeyframes(props.pics, props.totalDuration);

    return (
        <g name="ghost-layer" opacity={0}>
            <foreignObject
                x={0}
                y={0}
                width={props.viewBoxW}
                height={props.viewBoxH}
            >
                <SvgEx
                    style={{
                        display: "block",
                        backgroundImage: svgURL(props.url),
                        backgroundSize: "100% auto",
                        backgroundRepeat: "no-repeat",
                    }}
                    viewBox={`0 0 ${props.viewBoxW} ${props.viewBoxH}`}
                    width="100%"
                />
            </foreignObject>

            {/* 假动作层的opacity动画：瞬间出现、持续显示、瞬间消失 */}
            <animate
                attributeName="opacity"
                values={keyframes.values}
                keyTimes={keyframes.keyTimes}
                begin="0s"
                dur={`${props.totalDuration}s`}
                fill="freeze"
                repeatCount="indefinite"
                calcMode="discrete"
            />
        </g>
    )
}

export default GhostLayer

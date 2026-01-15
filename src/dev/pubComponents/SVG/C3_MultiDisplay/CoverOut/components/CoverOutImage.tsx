import SvgEx from "@pub-html/basicEx/SvgEx.tsx";
import svgURL from "@pub-utils/common/svgURL.ts";
import { NormalizedPicConfig } from "../types";
import { buildLoopLayerKeyframes } from "../timeline/keyframeBuilder";

/**
 * 单张图片组件 - 主循环层
 * 职责：渲染单张图片的滑出退场动画
 */
const CoverOutImage = (props: {
    pic: NormalizedPicConfig
    index: number
    pics: NormalizedPicConfig[]
    viewBoxW: number
    viewBoxH: number
    totalDuration: number
}) => {
    // 构建关键帧参数
    const keyframes = buildLoopLayerKeyframes(
        props.index,
        props.pic,
        props.pics,
        props.viewBoxW,
        props.viewBoxH,
        props.totalDuration
    );

    return (
        <g name={`slide-${props.index}`}>
            <foreignObject
                x={0}
                y={0}
                width={props.viewBoxW}
                height={props.viewBoxH}
            >
                <SvgEx
                    style={{
                        display: "block",
                        backgroundImage: svgURL(props.pic.url),
                        backgroundSize: "100% auto",
                        backgroundRepeat: "no-repeat",
                    }}
                    viewBox={`0 0 ${props.viewBoxW} ${props.viewBoxH}`}
                    width="100%"
                />
            </foreignObject>

            {/* 滑出动画 */}
            <animateTransform
                attributeName="transform"
                type="translate"
                values={keyframes.values}
                keyTimes={keyframes.keyTimes}
                begin="0s"
                fill="freeze"
                dur={`${props.totalDuration}s`}
                calcMode="spline"
                keySplines={keyframes.keySplines}
                repeatCount="indefinite"
            />
        </g>
    )
}

export default CoverOutImage

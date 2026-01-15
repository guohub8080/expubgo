import SvgEx from "@pub-html/basicEx/SvgEx.tsx";
import svgURL from "@pub-utils/common/svgURL.ts";
import { genAnimateOpacity } from "@svg-anim/opacity";
import { NormalizedPicConfig } from "../types";
import { buildLoopLayerTimeline } from "../timeline/keyframeBuilder";

/**
 * 单张图片组件 - 主循环层
 * 职责：渲染单张图片的淡入淡出动画
 */
const FadeSwitchImage = (props: {
    pic: NormalizedPicConfig
    index: number
    pics: NormalizedPicConfig[]
    viewBoxW: number
    viewBoxH: number
    totalDuration: number
}) => {
    // 构建时间线
    const timeline = buildLoopLayerTimeline(
        props.index,
        props.pic,
        props.pics,
        props.totalDuration
    );

    // 生成不透明度动画
    const opacityAnim = genAnimateOpacity({
        initOpacity: 1,
        timeline,
        loopCount: 0,
        isFreeze: true
    });

    return (
        <g name={`fade-pic-${props.index}`} opacity="0">
            <foreignObject x={0} y={0} width={props.viewBoxW} height={props.viewBoxH}>
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

            {/* 淡入淡出动画 */}
            {opacityAnim}
        </g>
    )
}

export default FadeSwitchImage

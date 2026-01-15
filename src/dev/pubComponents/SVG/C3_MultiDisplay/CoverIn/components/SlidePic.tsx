import SvgEx from "@pub-html/basicEx/SvgEx.tsx";
import svgURL from "@pub-utils/common/svgURL.ts";
import { defaultTo } from "es-toolkit/compat";
import { buildKeyframeParams } from "../timeline/keyframeBuilder";
import { calculateSlideStartTime, calculateSlideEndTime } from "../timeline/sequenceCalculator";
import { NormalizedPicConfig, AnimationMode } from "../types";

/**
 * 滑入图片组件
 * 职责：渲染带滑入动画的图片
 */
const SlidePic = (props: {
    viewBoxW: number
    viewBoxH: number
    url: string
    direction: NormalizedPicConfig["direction"]
    duration: number
    animationMode: AnimationMode
    keySplines: string
    slideIndex: number
    allSlides: NormalizedPicConfig[]
    firstRoundDuration?: number
    timeOffset?: number
}) => {
    // 计算滑入时间
    const slideInStartTime = calculateSlideStartTime(
        props.slideIndex,
        props.allSlides,
        defaultTo(props.timeOffset, 0)
    );
    const slideInEndTime = calculateSlideEndTime(
        props.slideIndex,
        props.allSlides,
        defaultTo(props.timeOffset, 0)
    );

    // 构建关键帧参数
    const animationParams = buildKeyframeParams({
        direction: props.direction,
        viewBoxW: props.viewBoxW,
        viewBoxH: props.viewBoxH,
        slideInStartTime,
        slideInEndTime,
        totalDuration: props.duration,
        animationMode: props.animationMode,
        firstRoundDuration: props.firstRoundDuration,
        keySplines: props.keySplines
    });

    return (
        <g name={`slide-${props.slideIndex}`}>
            <foreignObject
                x={animationParams.initialX}
                y={animationParams.initialY}
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

            {/* 滑入动画 */}
            <animateTransform
                attributeName="transform"
                type="translate"
                values={animationParams.values}
                keyTimes={animationParams.keyTimes}
                begin={animationParams.beginTime}
                fill="freeze"
                dur={`${props.duration}s`}
                calcMode="spline"
                keySplines={animationParams.keySplines}
                repeatCount={animationParams.repeatCount}
            />
        </g>
    );
};

export default SlidePic;

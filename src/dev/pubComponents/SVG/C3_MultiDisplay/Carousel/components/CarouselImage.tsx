import SvgEx from "@pub-html/basicEx/SvgEx.tsx";
import svgURL from "@pub-utils/common/svgURL.ts";
import SeamlessImg from "@pub-svg/C1_Standard/SeamlessImg";
import { NormalizedPicConfig, Direction } from "../types";
import { calculateDelayTime } from "../timeline/sequenceCalculator";
import { getInitialOffset } from "../timeline/offsetCalculator";
import { buildValues, buildKeyTimes, buildKeySplines } from "../timeline/keyframeBuilder";

/**
 * 单张轮播图片组件
 * 职责：渲染单张图片的轮播动画
 */
const CarouselImage = (props: {
    pic: NormalizedPicConfig
    index: number
    picCount: number
    viewBoxW: number
    viewBoxH: number
    duration: number
    direction: Direction
    keySplines: string
}) => {
    // 计算延迟时间
    const delay = calculateDelayTime(props.index, props.duration);

    // 计算总时长
    const totalDuration = props.duration * (props.picCount + 1);

    // 构建动画参数
    const values = buildValues(props.direction, props.viewBoxW, props.viewBoxH, props.picCount);
    const keyTimes = buildKeyTimes(props.picCount);
    const keySplines = buildKeySplines(props.keySplines, props.picCount);

    // 计算初始位置
    const initPos = getInitialOffset(props.direction, props.viewBoxW, props.viewBoxH);

    return (
        <g>
            <foreignObject x={initPos.x} y={initPos.y} width={props.viewBoxW} height={props.viewBoxH}>
                {!props.pic.isTouchable && (
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
                )}
                {props.pic.isTouchable && <SeamlessImg url={props.pic.url} />}
            </foreignObject>
            <animateTransform
                attributeName="transform"
                type="translate"
                repeatCount="indefinite"
                values={values}
                calcMode="spline"
                keyTimes={keyTimes}
                keySplines={keySplines}
                fill="freeze"
                begin={`${delay}s`}
                dur={`${totalDuration}s`}
            />
        </g>
    )
}

export default CarouselImage

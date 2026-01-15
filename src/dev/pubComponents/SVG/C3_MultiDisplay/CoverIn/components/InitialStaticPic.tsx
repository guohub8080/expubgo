import SvgEx from "@pub-html/basicEx/SvgEx.tsx";
import svgURL from "@pub-utils/common/svgURL.ts";
import { defaultTo } from "es-toolkit/compat";

/**
 * 初始静止图组件
 * 职责：渲染初始静止的图片，带淡出动画
 */
const InitialStaticPic = (props: {
    viewBoxW: number
    viewBoxH: number
    url: string
    duration: number
    stayDuration: number  // 停留时长
}) => {
    // 计算淡出参数
    const fadeOutTimeRatio = props.stayDuration / props.duration;
    const fadeOutEndRatio = Math.min(fadeOutTimeRatio + 0.01, 1);

    return (
        <g name="initial-static">
            <foreignObject x={0} y={0} width={props.viewBoxW} height={props.viewBoxH}>
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
            {/* 在 stayDuration 结束时开始淡出，只运行一次 */}
            <animate
                attributeName="opacity"
                values={`1;1;0`}
                keyTimes={`0;${fadeOutTimeRatio};${fadeOutEndRatio}`}
                begin="0s"
                dur={`${props.duration}s`}
                repeatCount="1"
                fill="freeze"
            />
        </g>
    );
};

export default InitialStaticPic;

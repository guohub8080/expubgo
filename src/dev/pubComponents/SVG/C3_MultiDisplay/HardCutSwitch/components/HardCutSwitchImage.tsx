import SvgEx from "@pub-html/basicEx/SvgEx.tsx";
import svgURL from "@pub-utils/common/svgURL.ts";
import { genAnimateOpacity } from "@svg-anim/opacity";
import { NormalizedPicConfig } from "../types";
import { buildHardCutTimeline } from "../timeline/timelineBuilder";

/**
 * 单张图片组件
 * 职责：渲染单张图片的硬切切换动画
 */
const HardCutSwitchImage = (props: {
    pic: NormalizedPicConfig
    index: number
    pics: NormalizedPicConfig[]
    viewBoxW: number
    viewBoxH: number
    totalDuration: number
}) => {
    // 构建时间线
    const timeline = buildHardCutTimeline(
        props.index,
        props.pic,
        props.pics,
        props.totalDuration
    );

    // 计算延迟时间
    let delay = 0;
    for (let i = 0; i < props.index; i++) {
        delay += props.pics[i].stayDuration;
    }

    // 生成不透明度动画
    const anim = genAnimateOpacity({
        initOpacity: 1,
        timeline,
        calcMode: 'discrete',
        loopCount: 0,
        delay
    });

    return (
        <g name={`hardcut-pic-${props.index}`}>
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

            {anim}
        </g>
    )
}

export default HardCutSwitchImage

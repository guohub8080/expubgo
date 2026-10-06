import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";
import { animatePathStroke } from "@guohub8080/expub-tool/smil";

export const ClickDraw = () => {
    const heartPath = "M 100 40 C 100 40, 60 60, 60 90 C 60 130, 100 160, 100 160 C 100 160, 140 130, 140 90 C 140 60, 100 40, 100 40";

    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                {/* 点击触发：手写 <g> 承载静态 dash 属性（点击前保持隐藏）+ 透明热区 */}
                <g strokeDasharray="600 600" strokeDashoffset={600} style={{ cursor: "pointer" }}>
                    {animatePathStroke({
                        pathLength: 600,
                        begin: "click",
                        restart: "never",
                        timeline: [
                            { durationSeconds: 0.001, toAbs: 600 },
                            { durationSeconds: 2, toAbs: 0 }
                        ],
                    })}
                    <rect x="0" y="0" width="200" height="200" fill="transparent" />
                    <path d={heartPath} stroke="#ef4444" strokeWidth="3" fill="none" strokeLinecap="round" />
                </g>
                <text x="100" y="190" fontSize="12" fill="#9ca3af" textAnchor="middle">
                    点击心形开始绘制
                </text>
            </svg>
        </SvgWrapper>
    );
};

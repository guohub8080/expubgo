import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";
import { animatePathStroke } from "@guohub8080/expub-tool/smil";

export const DrawAndErase = () => {
    const cloudPath = "M 60 100 Q 100 60 140 100 T 220 100";

    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="300" height="200" viewBox="0 0 300 200">
                <path
                    d={cloudPath}
                    stroke="#10b981"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray="300 300"
                    strokeDashoffset={300}
                >
                    {animatePathStroke({
                        pathLength: 300,
                        timeline: [
                            { durationSeconds: 1.5, toAbs: 0 },    // 绘制
                            { durationSeconds: 1, toAbs: 300 }     // 擦除
                        ]
                    })}
                </path>
            </svg>
        </SvgWrapper>
    );
};

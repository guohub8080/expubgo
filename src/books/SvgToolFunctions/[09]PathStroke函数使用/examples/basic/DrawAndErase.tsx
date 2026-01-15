import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";
import { genAnimatePathStroke } from "@svg-anim/pathStroke";

export const DrawAndErase = () => {
    const cloudPath = "M 60 100 Q 100 60 140 100 T 220 100";

    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="300" height="200" viewBox="0 0 300 200">
                {genAnimatePathStroke({
                    pathLength: 300,
                    timeline: [
                        { durationSeconds: 1.5, toValue: 0 },    // 绘制
                        { durationSeconds: 1, toValue: 300 }     // 擦除
                    ],
                    element: (
                        <path
                            d={cloudPath}
                            stroke="#10b981"
                            strokeWidth="3"
                            fill="none"
                            strokeLinecap="round"
                        />
                    )
                })}
            </svg>
        </SvgWrapper>
    );
};

import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";
import { genAnimatePathStroke } from "@svg-anim/pathStroke";

export const ClickDraw = () => {
    const heartPath = "M 100 40 C 100 40, 60 60, 60 90 C 60 130, 100 160, 100 160 C 100 160, 140 130, 140 90 C 140 60, 100 40, 100 40";

    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                {genAnimatePathStroke({
                    pathLength: 600,
                    beginType: 'click',
                    restart: 'never',
                    timeline: [
                        { durationSeconds: 0.001, toValue: 600 },
                        { durationSeconds: 2, toValue: 0 }
                    ],
                    element: <path d={heartPath} stroke="#ef4444" strokeWidth="3" fill="none" strokeLinecap="round" />,
                    clickableAreaSize: { width: 200, height: 200 }
                })}
                <text x="100" y="190" fontSize="12" fill="#9ca3af" textAnchor="middle">
                    点击心形开始绘制
                </text>
            </svg>
        </SvgWrapper>
    );
};

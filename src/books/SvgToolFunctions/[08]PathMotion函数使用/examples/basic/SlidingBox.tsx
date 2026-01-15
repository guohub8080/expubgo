import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";
import { genAnimatePathMotion } from "@svg-anim/pathMotion";

export const SlidingBox = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="400" height="150" viewBox="0 0 400 150">
                {/* 路径参考线（虚线） */}
                <path
                    d="M 30 75 Q 200 20 370 75"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    fill="none"
                />

                {/* 滑动的箭头（不旋转） */}
                <g>
                    {/* 箭头图形 */}
                    <g transform="scale(1.2)">
                        <circle r="12" fill="#3b82f6" />
                        <path d="M -4 -4 L 4 0 L -4 4" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                    {/* 沿曲线滑动，不旋转，保持最终状态 */}
                    {genAnimatePathMotion({
                        path: "M 30 75 Q 200 20 370 75",
                        durationSeconds: 3,
                        rotate: 0,
                        isFreeze: true,
                        loopCount: 1
                    })}
                </g>
            </svg>
        </SvgWrapper>
    );
};

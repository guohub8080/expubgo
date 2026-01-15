import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";
import { genAnimatePathMotion } from "@svg-anim/pathMotion";

export const CurvedPath = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="400" height="200" viewBox="0 0 400 200">
                {/* 路径参考线（虚线） */}
                <path
                    d="M 50 150 Q 200 50 350 150"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    fill="none"
                />
                {/* 沿曲线运动的箭头（自动旋转） */}
                <g>
                    {/* 箭头图形 */}
                    <path
                        d="M -15 -8 L 15 0 L -15 8 L -8 0 Z"
                        fill="#10b981"
                    />
                    {/* 曲线路径运动 */}
                    {genAnimatePathMotion({
                        path: "M 50 150 Q 200 50 350 150",
                        durationSeconds: 4,
                        rotate: 'auto',
                        loopCount: 0
                    })}
                </g>
            </svg>
        </SvgWrapper>
    );
};

import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";
import { genAnimatePathMotion } from "@svg-anim/pathMotion";

export const EasingComparison = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="600" height="320" viewBox="0 0 600 320">
                {/* 标题 */}
                <text x="300" y="25" textAnchor="middle" fontSize="18" fill="#6b7280" fontWeight="600">
                    缓动效果对比（相同路径，不同速度曲线）
                </text>

                {/* Row 1: Linear */}
                <g transform="translate(100, 50)">
                    <text x="0" y="0" fontSize="14" fill="#9ca3af" fontWeight="500">linear</text>
                    <text x="80" y="0" fontSize="13" fill="#9ca3af">匀速</text>
                    <path d="M 80 30 Q 300 5 420 30" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="4,4" fill="none" />
                    <circle r="10" fill="#ef4444">
                        {genAnimatePathMotion({
                            path: "M 80 30 Q 300 5 420 30",
                            durationSeconds: 2,
                            rotate: 0,
                            loopCount: 0
                        })}
                    </circle>
                </g>

                {/* Row 2: Ease */}
                <g transform="translate(100, 105)">
                    <text x="0" y="0" fontSize="14" fill="#9ca3af" fontWeight="500">ease</text>
                    <text x="80" y="0" fontSize="13" fill="#9ca3af">慢-快-慢</text>
                    <path d="M 80 30 Q 300 5 420 30" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="4,4" fill="none" />
                    <circle r="10" fill="#f97316">
                        {genAnimatePathMotion({
                            path: "M 80 30 Q 300 5 420 30",
                            durationSeconds: 2,
                            calcMode: 'spline',
                            keySplines: "0.25 0.1 0.25 1",
                            keyTimes: "0; 1",
                            rotate: 0,
                            loopCount: 0
                        })}
                    </circle>
                </g>

                {/* Row 3: Ease-in */}
                <g transform="translate(100, 160)">
                    <text x="0" y="0" fontSize="14" fill="#9ca3af" fontWeight="500">ease-in</text>
                    <text x="80" y="0" fontSize="13" fill="#9ca3af">慢启动</text>
                    <path d="M 80 30 Q 300 5 420 30" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="4,4" fill="none" />
                    <circle r="10" fill="#eab308">
                        {genAnimatePathMotion({
                            path: "M 80 30 Q 300 5 420 30",
                            durationSeconds: 2,
                            calcMode: 'spline',
                            keySplines: "0.42 0 1 1",
                            keyTimes: "0; 1",
                            rotate: 0,
                            loopCount: 0
                        })}
                    </circle>
                </g>

                {/* Row 4: Ease-out */}
                <g transform="translate(100, 215)">
                    <text x="0" y="0" fontSize="14" fill="#9ca3af" fontWeight="500">ease-out</text>
                    <text x="80" y="0" fontSize="13" fill="#9ca3af">慢结束</text>
                    <path d="M 80 30 Q 300 5 420 30" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="4,4" fill="none" />
                    <circle r="10" fill="#22c55e">
                        {genAnimatePathMotion({
                            path: "M 80 30 Q 300 5 420 30",
                            durationSeconds: 2,
                            calcMode: 'spline',
                            keySplines: "0 0 0.58 1",
                            keyTimes: "0; 1",
                            rotate: 0,
                            loopCount: 0
                        })}
                    </circle>
                </g>

                {/* Row 5: Ease-in-out */}
                <g transform="translate(100, 270)">
                    <text x="0" y="0" fontSize="14" fill="#9ca3af" fontWeight="500">ease-in-out</text>
                    <text x="80" y="0" fontSize="13" fill="#9ca3af">慢两端</text>
                    <path d="M 80 30 Q 300 5 420 30" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="4,4" fill="none" />
                    <circle r="10" fill="#3b82f6">
                        {genAnimatePathMotion({
                            path: "M 80 30 Q 300 5 420 30",
                            durationSeconds: 2,
                            calcMode: 'spline',
                            keySplines: "0.42 0 0.58 1",
                            keyTimes: "0; 1",
                            rotate: 0,
                            loopCount: 0
                        })}
                    </circle>
                </g>
            </svg>
        </SvgWrapper>
    );
};

import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";
import { genAnimatePathStroke } from "@svg-anim/pathStroke";

// 蚂蚁线效果 - 虚线流动
export const MarchingAnts = () => {
    return (
        <SvgWrapper showReplayButton={false}>
            <svg width="400" height="100" viewBox="0 0 400 100">
                {/* 示例1: 标准蚂蚁线 */}
                <g transform="translate(0, 0)">
                    <text x="10" y="20" fontSize="11" fill="#6b7280">蚂蚁线效果</text>
                    <text x="10" y="35" fontSize="10" fill="#9ca3af">虚线沿路径流动</text>

                    {/* 底层灰色实线 */}
                    <path d="M 30 60 L 370 60" stroke="#e5e7eb" strokeWidth="3" fill="none" />

                    {/* 蚂蚁线 - stroke-dasharray: "10 10", offset 从 0 到 20 */}
                    <path
                        d="M 30 60 L 370 60"
                        stroke="#3b82f6"
                        strokeWidth="3"
                        strokeDasharray="10 10"
                        fill="none"
                    >
                        <animate
                            attributeName="stroke-dashoffset"
                            from="20"
                            to="0"
                            dur="0.5s"
                            repeatCount="indefinite"
                        />
                    </path>
                </g>
            </svg>
        </SvgWrapper>
    );
};

// 快速蚂蚁线
export const FastMarchingAnts = () => {
    return (
        <SvgWrapper showReplayButton={false}>
            <svg width="400" height="100" viewBox="0 0 400 100">
                <g>
                    <text x="10" y="20" fontSize="11" fill="#6b7280">快速蚂蚁线</text>
                    <text x="10" y="35" fontSize="10" fill="#9ca3af">短虚线，快速流动</text>

                    {/* 蚂蚁线 - stroke-dasharray: "5 5", offset 从 10 到 0 */}
                    <path
                        d="M 30 60 L 370 60"
                        stroke="#10b981"
                        strokeWidth="3"
                        strokeDasharray="5 5"
                        fill="none"
                    >
                        <animate
                            attributeName="stroke-dashoffset"
                            from="10"
                            to="0"
                            dur="0.3s"
                            repeatCount="indefinite"
                        />
                    </path>
                </g>
            </svg>
        </SvgWrapper>
    );
};

// 曲线蚂蚁线
export const CurvedMarchingAnts = () => {
    return (
        <SvgWrapper showReplayButton={false}>
            <svg width="400" height="120" viewBox="0 0 400 120">
                <g>
                    <text x="10" y="20" fontSize="11" fill="#6b7280">曲线蚂蚁线</text>
                    <text x="10" y="35" fontSize="10" fill="#9ca3af">虚线沿曲线路径流动</text>

                    {/* S形曲线 */}
                    <path
                        d="M 30 80 C 100 30, 200 130, 370 80"
                        stroke="#f59e0b"
                        strokeWidth="3"
                        strokeDasharray="8 8"
                        strokeLinecap="round"
                        fill="none"
                    >
                        <animate
                            attributeName="stroke-dashoffset"
                            from="16"
                            to="0"
                            dur="0.4s"
                            repeatCount="indefinite"
                        />
                    </path>
                </g>
            </svg>
        </SvgWrapper>
    );
};

// 划线消失 - 从中间向两边
export const EraseFromCenter = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="400" height="100" viewBox="0 0 400 100">
                <g>
                    <text x="10" y="20" fontSize="11" fill="#6b7280">划线消失（分段擦除）</text>
                    <text x="10" y="35" fontSize="10" fill="#9ca3af">从中间向两边逐渐消失</text>

                    {/* 左半段 */}
                    {genAnimatePathStroke({
                        pathLength: 170,
                        initOffset: 0,
                        timeline: [
                            { durationSeconds: 2, toValue: 170 }
                        ],
                        element: <line x1="30" y1="60" x2="200" y2="60" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
                    })}

                    {/* 右半段 - 延迟0.5秒后开始擦除 */}
                    {genAnimatePathStroke({
                        pathLength: 170,
                        initOffset: 0,
                        delay: 0.5,
                        timeline: [
                            { durationSeconds: 2, toValue: 170 }
                        ],
                        element: <line x1="200" y1="60" x2="370" y2="60" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
                    })}
                </g>
            </svg>
        </SvgWrapper>
    );
};

// 蚂蚁线进度条
export const AntsProgressBar = () => {
    return (
        <SvgWrapper showReplayButton={false}>
            <svg width="400" height="100" viewBox="0 0 400 100">
                <g>
                    <text x="10" y="20" fontSize="11" fill="#6b7280">蚂蚁线进度条</text>
                    <text x="10" y="35" fontSize="10" fill="#9ca3af">背景实线 + 前景蚂蚁线</text>

                    {/* 背景灰色实线 */}
                    <path d="M 30 60 L 370 60" stroke="#e5e7eb" strokeWidth="3" fill="none" />

                    {/* 前景蚂蚁线 - 只显示50% */}
                    <path
                        d="M 30 60 L 200 60"
                        stroke="#8b5cf6"
                        strokeWidth="3"
                        strokeDasharray="10 10"
                        strokeLinecap="round"
                        fill="none"
                    >
                        <animate
                            attributeName="stroke-dashoffset"
                            from="20"
                            to="0"
                            dur="0.5s"
                            repeatCount="indefinite"
                        />
                    </path>
                </g>
            </svg>
        </SvgWrapper>
    );
};

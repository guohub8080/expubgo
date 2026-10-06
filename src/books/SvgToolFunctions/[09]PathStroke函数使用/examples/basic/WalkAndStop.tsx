import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";
import { animatePathStroke } from "@guohub8080/expub-tool/smil";

export const WalkAndStop = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="400" height="120" viewBox="0 0 400 120">
                {/* 走走停停示例 */}
                <g>
                    <text x="10" y="20" fontSize="11" fill="#6b7280">走走停停</text>
                    <text x="10" y="35" fontSize="10" fill="#9ca3af">走1秒→停0.5秒→走1秒→停0.5秒→走1秒</text>

                    {/* 灰色底轨 */}
                    <path d="M 30 70 L 370 70" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3,3" fill="none" />

                    {/* 动画路径 */}
                    <line x1="30" y1="70" x2="370" y2="70" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeDasharray="340 340" strokeDashoffset={340}>
                        {animatePathStroke({
                            pathLength: 340,
                            initValue: 340,
                            timeline: [
                                { durationSeconds: 1, toAbs: 226 },    // 走：画到1/3
                                { durationSeconds: 0.5, toAbs: 226 },   // 停：保持0.5秒
                                { durationSeconds: 1, toAbs: 113 },     // 走：画到2/3
                                { durationSeconds: 0.5, toAbs: 113 },   // 停：保持0.5秒
                                { durationSeconds: 1, toAbs: 0 }        // 走：画到终点
                            ]
                        })}
                    </line>
                </g>
            </svg>
        </SvgWrapper>
    );
};

export const WalkStopErase = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="400" height="120" viewBox="0 0 400 120">
                {/* 走→停→擦除→停→走 */}
                <g>
                    <text x="10" y="20" fontSize="11" fill="#6b7280">复杂走走停停</text>
                    <text x="10" y="35" fontSize="10" fill="#9ca3af">画→停→擦→停→画</text>

                    {/* 灰色底轨 */}
                    <path d="M 30 70 L 370 70" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3,3" fill="none" />

                    {/* 动画路径 */}
                    <line x1="30" y1="70" x2="370" y2="70" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeDasharray="340 340" strokeDashoffset={340}>
                        {animatePathStroke({
                            pathLength: 340,
                            initValue: 340,
                            timeline: [
                                { durationSeconds: 0.8, toAbs: 0 },     // 画：完全显示
                                { durationSeconds: 0.4, toAbs: 0 },     // 停：保持
                                { durationSeconds: 0.6, toAbs: 170 },    // 擦：擦除一半
                                { durationSeconds: 0.4, toAbs: 170 },    // 停：保持
                                { durationSeconds: 0.8, toAbs: 0 }      // 画：重新画完
                            ]
                        })}
                    </line>
                </g>
            </svg>
        </SvgWrapper>
    );
};

export const StepByStep = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="400" height="120" viewBox="0 0 400 120">
                {/* 分段前进 */}
                <g>
                    <text x="10" y="20" fontSize="11" fill="#6b7280">分段前进</text>
                    <text x="10" y="35" fontSize="10" fill="#9ca3af">每段走0.5秒，停0.3秒，共5段</text>

                    {/* 灰色底轨 */}
                    <path d="M 30 70 L 370 70" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3,3" fill="none" />

                    {/* 动画路径 - 总长度340，分5段，每段68 */}
                    <line x1="30" y1="70" x2="370" y2="70" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" strokeDasharray="340 340" strokeDashoffset={340}>
                        {animatePathStroke({
                            pathLength: 340,
                            initValue: 340,
                            timeline: [
                                { durationSeconds: 0.5, toAbs: 272 },   // 第1段
                                { durationSeconds: 0.3, toAbs: 272 },   // 停
                                { durationSeconds: 0.5, toAbs: 204 },   // 第2段
                                { durationSeconds: 0.3, toAbs: 204 },   // 停
                                { durationSeconds: 0.5, toAbs: 136 },   // 第3段
                                { durationSeconds: 0.3, toAbs: 136 },   // 停
                                { durationSeconds: 0.5, toAbs: 68 },    // 第4段
                                { durationSeconds: 0.3, toAbs: 68 },    // 停
                                { durationSeconds: 0.5, toAbs: 0 },     // 第5段
                            ]
                        })}
                    </line>
                </g>
            </svg>
        </SvgWrapper>
    );
};

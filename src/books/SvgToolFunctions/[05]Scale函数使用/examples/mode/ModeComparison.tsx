import { transformScale } from "@guohub8080/expub-tool/smil";
import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";

export const ModeComparison = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                {/* 中心点标记 */}
                <circle cx="100" cy="100" r="4" fill="#666" />
                <text x="100" y="185" textAnchor="middle" fontSize="11" fill="#999">中心 (100,100)</text>

                {/* 相对模式（累计写法） - 左侧蓝色 */}
                <g>
                    <circle cx="45" cy="100" r="20" fill="blue" opacity="0.8">
                        {transformScale({
                            pivot: [45, 100],
                            initValue: 1,
                            // 累计写法：以当前值为基准心算（1×2=2 → 2×0.5=1 → 1×1.5=1.5）
                            timeline: [
                                { toAbs: 2, durationSeconds: 1 },
                                { toAbs: 1, durationSeconds: 1 },
                                { toAbs: 1.5, durationSeconds: 1 }
                            ],
                            loopCount: 0
                        })}
                    </circle>
                    <text x="45" y="50" textAnchor="middle" fontSize="11" fill="#666">相对</text>
                </g>

                {/* 绝对模式（绝对写法） - 右侧绿色 */}
                <g>
                    <circle cx="155" cy="100" r="20" fill="green" opacity="0.8">
                        {transformScale({
                            pivot: [155, 100],
                            initValue: 1,
                            // 绝对写法：直接写目标倍数，保持需重复写同一值
                            timeline: [
                                { toAbs: 2, durationSeconds: 1 },
                                { toAbs: 2, durationSeconds: 1 },
                                { toAbs: 1.5, durationSeconds: 1 }
                            ],
                            loopCount: 0
                        })}
                    </circle>
                    <text x="155" y="50" textAnchor="middle" fontSize="11" fill="#666">绝对</text>
                </g>
            </svg>
        </SvgWrapper>
    );
};

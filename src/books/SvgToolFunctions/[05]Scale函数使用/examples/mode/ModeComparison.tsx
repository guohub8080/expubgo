import { genAnimateScale } from "@svg-anim/scale";
import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";

export const ModeComparison = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                {/* 中心点标记 */}
                <circle cx="100" cy="100" r="4" fill="#666" />
                <text x="100" y="185" textAnchor="middle" fontSize="11" fill="#999">中心 (100,100)</text>

                {/* 相对模式 - 左侧蓝色 */}
                <g>
                    <circle cx="45" cy="100" r="20" fill="blue" opacity="0.8">
                        {genAnimateScale({
                            origin: [45, 100],
                            initScale: 1,
                            isRelativeScale: true,
                            timeline: [
                                { toValue: 2, durationSeconds: 1 },
                                { toValue: 0.5, durationSeconds: 1 },
                                { toValue: 1.5, durationSeconds: 1 }
                            ],
                            loopCount: 0
                        })}
                    </circle>
                    <text x="45" y="50" textAnchor="middle" fontSize="11" fill="#666">相对</text>
                </g>

                {/* 绝对模式 - 右侧绿色 */}
                <g>
                    <circle cx="155" cy="100" r="20" fill="green" opacity="0.8">
                        {genAnimateScale({
                            origin: [155, 100],
                            initScale: 1,
                            isRelativeScale: false,
                            timeline: [
                                { toValue: 2, durationSeconds: 1 },
                                { toValue: 2, durationSeconds: 1 },
                                { toValue: 1.5, durationSeconds: 1 }
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

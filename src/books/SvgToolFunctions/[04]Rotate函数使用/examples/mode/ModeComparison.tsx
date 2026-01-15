import { genAnimateRotate } from "@svg-anim/rotate";
import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";

export const ModeComparison = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                {/* 中心点标记 */}
                <circle cx="100" cy="100" r="4" fill="#666" />
                <text x="100" y="185" textAnchor="middle" fontSize="11" fill="#999">中心 (100,100)</text>

                {/* 相对模式 - 左侧 */}
                <g>
                    <circle cx="60" cy="60" r="15" fill="blue" opacity="0.8">
                        {genAnimateRotate({
                            initAngle: 0,
                            origin: [100, 100],
                            isRelativeRotate: true,
                            timeline: [
                                { toValue: 45, durationSeconds: 1 },
                                { toValue: 0, durationSeconds: 1 },
                                { toValue: 45, durationSeconds: 1 }
                            ],
                            loopCount: 0
                        })}
                    </circle>
                </g>
                <text x="60" y="35" textAnchor="middle" fontSize="11" fill="#666">相对</text>

                {/* 绝对模式 - 右侧 */}
                <g>
                    <circle cx="140" cy="60" r="15" fill="green" opacity="0.8">
                        {genAnimateRotate({
                            initAngle: 0,
                            origin: [100, 100],
                            isRelativeRotate: false,
                            timeline: [
                                { toValue: 45, durationSeconds: 1 },
                                { toValue: 45, durationSeconds: 1 },
                                { toValue: 90, durationSeconds: 1 }
                            ],
                            loopCount: 0
                        })}
                    </circle>
                </g>
                <text x="140" y="35" textAnchor="middle" fontSize="11" fill="#666">绝对</text>
            </svg>
        </SvgWrapper>
    );
};

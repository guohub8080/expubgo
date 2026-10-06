import { transformScale } from "@guohub8080/expub-tool/smil";
import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";

export const Comparison = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                {/* 左侧：循环缩放 */}
                <g>
                    <circle cx="60" cy="80" r="20" fill="blue">
                        {transformScale({
                            pivot: [60, 80],
                            initValue: 1,
                            timeline: [
                                { toAbs: 1.8, durationSeconds: 1.5 },
                                { toAbs: 0.5, durationSeconds: 1.5 }
                            ],
                            loopCount: 0
                        })}
                    </circle>
                    <text x="60" y="130" textAnchor="middle" fontSize="12" fill="#666">循环</text>
                </g>

                {/* 右侧：摇摆缩放 */}
                <g>
                    <rect x="110" y="65" width="40" height="40" fill="purple">
                        {transformScale({
                            pivot: [130, 85],
                            initValue: 1,
                            timeline: [
                                { toAbs: 1.3, durationSeconds: 0.5 },
                                { toAbs: 0.7, durationSeconds: 0.5 }
                            ],
                            loopCount: 0
                        })}
                    </rect>
                    <text x="130" y="130" textAnchor="middle" fontSize="12" fill="#666">摇摆</text>
                </g>
            </svg>
        </SvgWrapper>
    );
};

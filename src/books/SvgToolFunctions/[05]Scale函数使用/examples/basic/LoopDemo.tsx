import { transformScale } from "@guohub8080/expub-tool/smil";
import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";

export const LoopDemo = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                {/* 播放1次 */}
                <circle cx="50" cy="70" r="15" fill="blue">
                    {transformScale({
                        pivot: [50, 70],
                        timeline: [
                            { toAbs: 1.8, durationSeconds: 1.5 }
                        ],
                        loopCount: 1
                    })}
                </circle>
                <text x="50" y="110" textAnchor="middle" fontSize="10" fill="#666">1次</text>

                {/* 播放3次 */}
                <circle cx="100" cy="70" r="15" fill="green">
                    {transformScale({
                        pivot: [100, 70],
                        timeline: [
                            { toAbs: 1.8, durationSeconds: 1 }
                        ],
                        loopCount: 3
                    })}
                </circle>
                <text x="100" y="110" textAnchor="middle" fontSize="10" fill="#666">3次</text>

                {/* 无限循环 */}
                <circle cx="150" cy="70" r="15" fill="purple">
                    {transformScale({
                        pivot: [150, 70],
                        timeline: [
                            { toAbs: 1.3, durationSeconds: 1 },
                            { toAbs: 0.7, durationSeconds: 1 }
                        ],
                        loopCount: 0
                    })}
                </circle>
                <text x="150" y="110" textAnchor="middle" fontSize="10" fill="#666">无限</text>
            </svg>
        </SvgWrapper>
    );
};

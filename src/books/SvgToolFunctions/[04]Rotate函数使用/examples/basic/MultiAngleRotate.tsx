import { transformRotate } from "@guohub8080/expub-tool/smil";
import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";

export const MultiAngleRotate = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                {/* 中心恒星 */}
                <circle cx="100" cy="100" r="15" fill="#FFD700" />

                {/* 卫星 - 来回摆动 */}
                <g>
                    {transformRotate({
                        pivot: [100, 100],
                        initValue: 0,
                        timeline: [
                            { toAbs: 120, durationSeconds: 1 },
                            { toAbs: -120, durationSeconds: 2 },
                            { toAbs: 120, durationSeconds: 2 },
                            { toAbs: -120, durationSeconds: 2 },
                            { toAbs: 0, durationSeconds: 1 }
                        ],
                        loopCount: 0
                    })}
                    {/* 卫星从右侧开始 */}
                    <circle cx="100" cy="60" r="8" fill="purple" />
                </g>

                {/* 轨道线 */}
                <circle cx="100" cy="100" r="40" fill="none" stroke="#ddd" strokeWidth="1" strokeDasharray="4,4" />
            </svg>
        </SvgWrapper>
    );
};

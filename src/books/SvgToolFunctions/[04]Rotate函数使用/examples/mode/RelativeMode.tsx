import { genAnimateRotate } from "@svg-anim/rotate";
import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";

export const RelativeMode = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                {/* 旋转中心标记 */}
                <circle cx="100" cy="100" r="3" fill="#ccc" />

                <circle cx="100" cy="50" r="25" fill="blue">
                    {genAnimateRotate({
                        initAngle: 0,
                        origin: [100, 100],
                        isRelativeRotate: true,
                        timeline: [
                            { toValue: 90, durationSeconds: 1 },
                            { toValue: 0, durationSeconds: 1 },
                            { toValue: 90, durationSeconds: 1 }
                        ]
                    })}
                </circle>
                <text x="100" y="170" textAnchor="middle" fontSize="14" fill="#666">相对模式</text>
            </svg>
        </SvgWrapper>
    );
};

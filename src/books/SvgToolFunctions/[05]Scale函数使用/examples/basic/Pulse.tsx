import { genAnimateScale } from "@svg-anim/scale";
import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";

export const Pulse = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="30" fill="purple">
                    {genAnimateScale({
                        origin: [100, 100],
                        timeline: [
                            { toValue: 1.5, durationSeconds: 0.5 },
                            { toValue: 1, durationSeconds: 0.5 }
                        ],
                        loopCount: 0
                    })}
                </circle>
                <text x="100" y="170" textAnchor="middle" fontSize="14" fill="#666">脉冲缩放</text>
            </svg>
        </SvgWrapper>
    );
};

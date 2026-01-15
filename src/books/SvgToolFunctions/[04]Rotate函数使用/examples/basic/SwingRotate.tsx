import { genAnimateRotate } from "@svg-anim/rotate";
import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";

export const SwingRotate = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <rect x="85" y="85" width="30" height="30" fill="indigo">
                    {genAnimateRotate({
                        origin: [100, 100],
                        initAngle: -30,
                        timeline: [
                            { toValue: 30, durationSeconds: 0.8 },
                            { toValue: -30, durationSeconds: 0.8 }
                        ],
                        loopCount: 0
                    })}
                </rect>
            </svg>
        </SvgWrapper>
    );
};

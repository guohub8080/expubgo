import { genAnimateRotate } from "@svg-anim/rotate";
import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";

export const CornerOrigin = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <g>
                    {genAnimateRotate({
                        timeline: [
                            { toValue: 360, durationSeconds: 2 }
                        ],
                        loopCount: 0,
                        origin: [75, 75]
                    })}
                    <rect x="75" y="75" width="50" height="50" fill="green" />
                </g>
            </svg>
        </SvgWrapper>
    );
};

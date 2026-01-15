import { genAnimateRotate } from "@svg-anim/rotate";
import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";

export const ClockwiseRotate = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="30" fill="blue">
                    {genAnimateRotate({
                        timeline: [
                            { toValue: 360, durationSeconds: 2 }
                        ]
                    })}
                </circle>
            </svg>
        </SvgWrapper>
    );
};

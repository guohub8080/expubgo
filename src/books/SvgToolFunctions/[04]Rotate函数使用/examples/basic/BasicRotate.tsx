import { genAnimateRotate } from "@svg-anim/rotate";
import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";

export const BasicRotate = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <rect x="75" y="75" width="50" height="50" fill="blue">
                    {genAnimateRotate({
                        timeline: [
                            { toValue: 360, durationSeconds: 2 }
                        ],
                        loopCount: 0
                    })}
                </rect>
            </svg>
        </SvgWrapper>
    );
};

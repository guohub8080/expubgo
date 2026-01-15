import { genAnimateRotate } from "@svg-anim/rotate";
import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";

export const HalfRotate = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <rect x="75" y="75" width="50" height="50" fill="orange">
                    {genAnimateRotate({
                        timeline: [
                            { toValue: 180, durationSeconds: 1 }
                        ],
                        isFreeze: true
                    })}
                </rect>
            </svg>
        </SvgWrapper>
    );
};

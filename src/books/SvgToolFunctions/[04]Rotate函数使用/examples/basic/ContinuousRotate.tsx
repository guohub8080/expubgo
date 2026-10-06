import { transformRotate } from "@guohub8080/expub-tool/smil";
import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";

export const ContinuousRotate = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <rect x="85" y="85" width="30" height="30" fill="purple">
                    {transformRotate({
                        pivot: [100, 100],
                        timeline: [
                            { toAbs: 360, durationSeconds: 1 }
                        ],
                        loopCount: 0
                    })}
                </rect>
            </svg>
        </SvgWrapper>
    );
};

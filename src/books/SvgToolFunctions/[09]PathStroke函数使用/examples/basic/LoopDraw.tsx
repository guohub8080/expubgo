import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";
import { genAnimatePathStroke } from "@svg-anim/pathStroke";

export const LoopDraw = () => {
    const spiralPath = "M 100 100 m -5 0 a 5 5 0 1 0 10 0 a 10 10 0 1 0 -20 0 a 15 15 0 1 0 30 0 a 20 20 0 1 0 -40 0 a 25 25 0 1 0 50 0";

    return (
        <SvgWrapper showReplayButton={false}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                {genAnimatePathStroke({
                    pathLength: 600,
                    timeline: [
                        { durationSeconds: 2, toValue: 0 },
                        { durationSeconds: 1, toValue: 600 }
                    ],
                    loopCount: 0,
                    element: <path d={spiralPath} stroke="#8b5cf6" strokeWidth="2" fill="none" strokeLinecap="round" />
                })}
            </svg>
        </SvgWrapper>
    );
};

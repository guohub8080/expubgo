import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";
import { genAnimatePathStroke } from "@svg-anim/pathStroke";

export const BasicDraw = () => {
    const starPath = "M 100 20 L 123 75 L 182 78 L 138 115 L 151 175 L 100 140 L 49 175 L 62 115 L 18 78 L 77 75 Z";

    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                {genAnimatePathStroke({
                    pathLength: 600,
                    timeline: [
                        { durationSeconds: 2, toValue: 0 }
                    ],
                    element: <path d={starPath} stroke="#3b82f6" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                })}
            </svg>
        </SvgWrapper>
    );
};

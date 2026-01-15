import { genAnimateScale } from "@svg-anim/scale";
import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";

export const Enlarge = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                {/* 中心点标记 */}
                <circle cx="100" cy="100" r="3" fill="#ccc" />

                <rect x="75" y="75" width="50" height="50" fill="blue">
                    {genAnimateScale({
                        origin: [100, 100],
                        timeline: [
                            { toValue: 2, durationSeconds: 2 }
                        ]
                    })}
                </rect>
                <text x="100" y="170" textAnchor="middle" fontSize="14" fill="#666">放大 2x</text>
            </svg>
        </SvgWrapper>
    );
};

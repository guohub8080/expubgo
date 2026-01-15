import { genAnimateScale } from "@svg-anim/scale";
import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";

export const RelativeMode = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="3" fill="#ccc" />
                <text x="100" y="170" textAnchor="middle" fontSize="14" fill="#666">相对模式</text>

                <circle cx="100" cy="80" r="25" fill="blue">
                    {genAnimateScale({
                        origin: [100, 80],
                        initScale: 1,
                        isRelativeScale: true,
                        timeline: [
                            { toValue: 2, durationSeconds: 1 },
                            { toValue: 0.5, durationSeconds: 1 },
                            { toValue: 1.5, durationSeconds: 1 }
                        ],
                        loopCount: 0
                    })}
                </circle>
            </svg>
        </SvgWrapper>
    );
};

export const AbsoluteMode = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="3" fill="#ccc" />
                <text x="100" y="170" textAnchor="middle" fontSize="14" fill="#666">绝对模式</text>

                <circle cx="100" cy="80" r="25" fill="green">
                    {genAnimateScale({
                        origin: [100, 80],
                        initScale: 1,
                        isRelativeScale: false,
                        timeline: [
                            { toValue: 2, durationSeconds: 1 },
                            { toValue: 2, durationSeconds: 1 },
                            { toValue: 1.5, durationSeconds: 1 }
                        ],
                        loopCount: 0
                    })}
                </circle>
            </svg>
        </SvgWrapper>
    );
};

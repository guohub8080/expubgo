import { genAnimateScale } from "@svg-anim/scale";
import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";

export const AbsoluteMode = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                {/* 中心点标记 */}
                <circle cx="100" cy="100" r="3" fill="#ccc" />
                <text x="100" y="180" textAnchor="middle" fontSize="12" fill="#999">绝对模式</text>

                <circle cx="100" cy="80" r="25" fill="green">
                    {genAnimateScale({
                        origin: [100, 100],
                        initScale: 1,
                        isRelativeScale: false,
                        timeline: [
                            { toValue: 2, durationSeconds: 1 },
                            { toValue: 2, durationSeconds: 1 },
                            { toValue: 1.5, durationSeconds: 1 }
                        ]
                    })}
                </circle>
            </svg>
        </SvgWrapper>
    );
};

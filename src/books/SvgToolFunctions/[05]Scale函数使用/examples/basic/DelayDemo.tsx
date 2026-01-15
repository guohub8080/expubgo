import { genAnimateScale } from "@svg-anim/scale";
import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";

export const DelayDemo = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                {/* 三个圆依次延迟 */}
                <circle cx="50" cy="80" r="15" fill="blue">
                    {genAnimateScale({
                        origin: [50, 80],
                        timeline: [
                            { toValue: 1.8, durationSeconds: 1.5 }
                        ]
                    })}
                </circle>
                <circle cx="100" cy="80" r="15" fill="green">
                    {genAnimateScale({
                        origin: [100, 80],
                        delay: 1,
                        timeline: [
                            { toValue: 1.8, durationSeconds: 1.5 }
                        ]
                    })}
                </circle>
                <circle cx="150" cy="80" r="15" fill="orange">
                    {genAnimateScale({
                        origin: [150, 80],
                        delay: 2,
                        timeline: [
                            { toValue: 1.8, durationSeconds: 1.5 }
                        ]
                    })}
                </circle>
                <text x="100" y="170" textAnchor="middle" fontSize="12" fill="#666">延迟：0s、1s、2s</text>
            </svg>
        </SvgWrapper>
    );
};

import { genAnimateScale } from "@svg-anim/scale";
import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";

export const BasicScale = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                {/* 缩放中心标记 */}
                <circle cx="100" cy="100" r="3" fill="#ccc" />

                <rect x="75" y="75" width="50" height="50" fill="blue">
                    {genAnimateScale({
                        origin: [100, 100],
                        timeline: [
                            { toValue: 2, durationSeconds: 2 }
                        ]
                    })}
                </rect>
            </svg>
        </SvgWrapper>
    );
};

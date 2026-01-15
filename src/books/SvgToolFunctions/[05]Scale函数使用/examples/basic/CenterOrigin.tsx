import { genAnimateScale } from "@svg-anim/scale";
import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";

export const CenterOrigin = () => {
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
            </svg>
        </SvgWrapper>
    );
};

export const TopLeft = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                {/* 左上角标记 */}
                <circle cx="75" cy="75" r="3" fill="red" />

                <rect x="75" y="75" width="50" height="50" fill="green">
                    {genAnimateScale({
                        origin: [75, 75],
                        timeline: [
                            { toValue: 2, durationSeconds: 2 }
                        ]
                    })}
                </rect>
            </svg>
        </SvgWrapper>
    );
};

export const BottomRight = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                {/* 右下角标记 */}
                <circle cx="125" cy="125" r="3" fill="red" />

                <rect x="75" y="75" width="50" height="50" fill="orange">
                    {genAnimateScale({
                        origin: [125, 125],
                        timeline: [
                            { toValue: 2, durationSeconds: 2 }
                        ]
                    })}
                </rect>
            </svg>
        </SvgWrapper>
    );
};

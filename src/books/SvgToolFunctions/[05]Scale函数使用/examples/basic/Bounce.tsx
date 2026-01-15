import { genAnimateScale } from "@svg-anim/scale";
import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";

export const Bounce = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                {/* 中心点标记 */}
                <circle cx="100" cy="100" r="3" fill="#ccc" />

                <rect x="85" y="85" width="30" height="30" fill="orange">
                    {genAnimateScale({
                        origin: [100, 100],
                        timeline: [
                            {
                                toValue: 1.8,
                                durationSeconds: 0.8,
                                keySplines: '0.25 0.1 0.25 1'  // SVG 兼容的 ease 曲线
                            }
                        ]
                    })}
                </rect>
                <text x="100" y="170" textAnchor="middle" fontSize="14" fill="#666">弹跳缩放</text>
            </svg>
        </SvgWrapper>
    );
};

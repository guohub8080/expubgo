import { transformRotate } from "@guohub8080/expub-tool/smil";
import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";

export const RelativeMode = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                {/* 旋转中心标记 */}
                <circle cx="100" cy="100" r="3" fill="#ccc" />

                <circle cx="100" cy="50" r="25" fill="blue">
                    {transformRotate({
                        initValue: 0,
                        pivot: [100, 100],
                        timeline: [
                            { toRel: 90, durationSeconds: 1 },
                            { toRel: 0, durationSeconds: 1 },
                            { toRel: 90, durationSeconds: 1 }
                        ]
                    })}
                </circle>
                <text x="100" y="170" textAnchor="middle" fontSize="14" fill="#666">相对模式 toRel</text>
            </svg>
        </SvgWrapper>
    );
};

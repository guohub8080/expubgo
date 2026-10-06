import { transformScale } from "@guohub8080/expub-tool/smil";
import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";

export const Swing = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="3" fill="#ccc" />
                <text x="100" y="170" textAnchor="middle" fontSize="14" fill="#666">摇摆缩放</text>

                <rect x="85" y="65" width="30" height="30" fill="indigo">
                    {transformScale({
                        pivot: [100, 80],
                        initValue: 1,
                        timeline: [
                            { toAbs: 1.3, durationSeconds: 0.8 },
                            { toAbs: 0.7, durationSeconds: 0.8 }
                        ],
                        loopCount: 0
                    })}
                </rect>
            </svg>
        </SvgWrapper>
    );
};

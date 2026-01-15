import { genAnimateRotate } from "@svg-anim/rotate";
import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";

export const CenterOrigin = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="-20 -20 240 240">
                {/* 坐标轴 */}
                <line x1="0" y1="0" x2="220" y2="0" stroke="#ddd" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="0" y1="0" x2="0" y2="220" stroke="#ddd" strokeWidth="1" strokeDasharray="5,5" />

                {/* 标记原点 */}
                <circle cx="0" cy="0" r="6" fill="red" />
                <text x="5" y="-5" fontSize="12" fill="#666">(0,0)</text>

                {/* 围绕原点旋转的方块 */}
                <rect x="80" y="80" width="50" height="50" fill="blue">
                    {genAnimateRotate({
                        timeline: [
                            { toValue: 360, durationSeconds: 2 }
                        ],
                        loopCount: 0
                    })}
                </rect>
            </svg>
        </SvgWrapper>
    );
};

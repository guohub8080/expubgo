import { genAnimateScale } from "@svg-anim/scale";
import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";

export const FreezeDemo = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                {/* isFreeze: false - 回到原位 */}
                <circle cx="100" cy="60" r="20" fill="blue">
                    {genAnimateScale({
                        origin: [100, 60],
                        timeline: [
                            { toValue: 1.8, durationSeconds: 2 }
                        ],
                        isFreeze: false
                    })}
                </circle>
                <text x="100" y="35" textAnchor="middle" fontSize="11" fill="#666">isFreeze: false</text>

                {/* isFreeze: true - 保持最终大小 */}
                <circle cx="100" cy="140" r="20" fill="orange">
                    {genAnimateScale({
                        origin: [100, 140],
                        timeline: [
                            { toValue: 1.8, durationSeconds: 2 }
                        ],
                        isFreeze: true
                    })}
                </circle>
                <text x="100" y="175" textAnchor="middle" fontSize="11" fill="#666">isFreeze: true</text>
            </svg>
        </SvgWrapper>
    );
};

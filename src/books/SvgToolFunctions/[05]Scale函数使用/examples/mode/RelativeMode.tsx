import { transformScale } from "@guohub8080/expub-tool/smil";
import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";

export const RelativeMode = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="3" fill="#ccc" />
                <text x="100" y="170" textAnchor="middle" fontSize="14" fill="#666">相对模式</text>

                <circle cx="100" cy="80" r="25" fill="blue">
                    {transformScale({
                        pivot: [100, 80],
                        initValue: 1,
                        // 累计写法：以当前值为基准心算出每段的绝对目标（scale 的 timeline 只支持 toAbs）
                        timeline: [
                            { toAbs: 2, durationSeconds: 1 },    // 1 × 2 = 2
                            { toAbs: 1, durationSeconds: 1 },    // 2 × 0.5 = 1（想「减半」就以当前值 2 为基准）
                            { toAbs: 1.5, durationSeconds: 1 }   // 1 × 1.5 = 1.5
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
                    {transformScale({
                        pivot: [100, 80],
                        initValue: 1,
                        // 绝对写法：每段 toAbs 都是绝对目标倍数，「保持大小」需重复写同一值
                        timeline: [
                            { toAbs: 2, durationSeconds: 1 },    // 放大到 2 倍
                            { toAbs: 2, durationSeconds: 1 },    // 保持 2 倍（重复写目标值）
                            { toAbs: 1.5, durationSeconds: 1 }   // 缩小到 1.5 倍
                        ],
                        loopCount: 0
                    })}
                </circle>
            </svg>
        </SvgWrapper>
    );
};

import { transformScale } from "@guohub8080/expub-tool/smil";
import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper";

export const AbsoluteMode = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                {/* 中心点标记 */}
                <circle cx="100" cy="100" r="3" fill="#ccc" />
                <text x="100" y="180" textAnchor="middle" fontSize="12" fill="#999">绝对模式</text>

                <circle cx="100" cy="80" r="25" fill="green">
                    {transformScale({
                        pivot: [100, 100],
                        initValue: 1,
                        // 绝对写法：每段 toAbs 都是绝对目标倍数，「保持大小」需重复写同一值
                        timeline: [
                            { toAbs: 2, durationSeconds: 1 },    // 放大到 2 倍
                            { toAbs: 2, durationSeconds: 1 },    // 保持 2 倍（重复写目标值）
                            { toAbs: 1.5, durationSeconds: 1 }   // 缩小到 1.5 倍
                        ]
                    })}
                </circle>
            </svg>
        </SvgWrapper>
    );
};

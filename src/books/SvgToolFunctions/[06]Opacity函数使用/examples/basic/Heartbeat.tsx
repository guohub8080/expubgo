import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper"
import { animateOpacity } from "@guohub8080/expub-tool/smil"

export const Heartbeat = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="40" fill="#ef4444">
                    {animateOpacity({
                        initValue: 1,
                        timeline: [
                            { toAbs: 0.6, durationSeconds: 0.2 },
                            { toAbs: 1, durationSeconds: 0.2 },
                            { toAbs: 0.6, durationSeconds: 0.2 },
                            { toAbs: 1, durationSeconds: 0.2 },
                            { toAbs: 1, durationSeconds: 0.8 }  // 停顿：保持当前透明度
                        ],
                        loopCount: 0
                    })}
                </circle>
            </svg>
        </SvgWrapper>
    )
}

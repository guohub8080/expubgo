import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper"
import { genAnimateOpacity } from "@svg-anim/opacity"

export const Heartbeat = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="40" fill="#ef4444">
                    {genAnimateOpacity({
                        timeline: [
                            { toValue: 0.6, durationSeconds: 0.2 },
                            { toValue: 1, durationSeconds: 0.2 },
                            { toValue: 0.6, durationSeconds: 0.2 },
                            { toValue: 1, durationSeconds: 0.2 },
                            { durationSeconds: 0.8 }
                        ],
                        loopCount: 0
                    })}
                </circle>
            </svg>
        </SvgWrapper>
    )
}

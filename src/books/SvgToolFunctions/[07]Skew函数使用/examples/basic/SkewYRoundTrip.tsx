import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper"
import { transformSkewY } from "@guohub8080/expub-tool/smil"

export const SkewYRoundTrip = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="100%" height="140" viewBox="0 0 240 140">
                <g transform="translate(120, 70)">
                    <rect x="-50" y="-50" width="100" height="100" fill="rgb(34, 197, 94)" rx="8">
                        {transformSkewY({
                            timeline: [
                                { toAbs: 15, durationSeconds: 1 },
                                { toAbs: 0, durationSeconds: 1 }
                            ],
                            loopCount: 0
                        })}
                    </rect>
                </g>
            </svg>
        </SvgWrapper>
    )
}

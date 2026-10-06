import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper"
import { transformSkewX } from "@guohub8080/expub-tool/smil"

export const BasicSkewX = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="100%" height="150" viewBox="0 0 240 150">
                <g transform="translate(120, 75)">
                    <rect x="-50" y="-40" width="100" height="80" fill="rgb(59, 130, 246)" rx="8">
                        {transformSkewX({
                            timeline: [
                                { toAbs: 15, durationSeconds: 1 },
                                { toAbs: -15, durationSeconds: 1 },
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

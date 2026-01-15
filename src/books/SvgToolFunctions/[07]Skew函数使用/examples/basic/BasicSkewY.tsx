import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper"
import { genAnimateSkewY } from "@svg-anim/skewY"

export const BasicSkewY = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="100%" height="150" viewBox="0 0 240 150">
                <g transform="translate(120, 75)">
                    <rect x="-50" y="-40" width="100" height="80" fill="rgb(34, 197, 94)" rx="8">
                        {genAnimateSkewY({
                            timeline: [
                                { toValue: 15, durationSeconds: 1 },
                                { toValue: -15, durationSeconds: 1 },
                                { toValue: 0, durationSeconds: 1 }
                            ],
                            loopCount: 0
                        })}
                    </rect>
                </g>
            </svg>
        </SvgWrapper>
    )
}

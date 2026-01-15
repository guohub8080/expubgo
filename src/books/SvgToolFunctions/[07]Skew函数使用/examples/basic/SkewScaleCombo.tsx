import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper"
import { genAnimateSkewX } from "@svg-anim/skewX"
import { genAnimateScale } from "@svg-anim/scale"

export const SkewScaleCombo = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="100%" height="160" viewBox="0 0 280 160">
                <g transform="translate(140, 80)">
                    <rect x="-60" y="-40" width="120" height="80" fill="rgb(59, 130, 246)" rx="8">
                        {genAnimateSkewX({
                            timeline: [
                                { toValue: 12, durationSeconds: 1.5 },
                                { toValue: -12, durationSeconds: 3 },
                                { toValue: 12, durationSeconds: 1.5 }
                            ],
                            loopCount: 0,
                            isAdditive: true
                        })}
                        {genAnimateScale({
                            timeline: [
                                { toValue: 1.3, durationSeconds: 1.5 },
                                { toValue: 0.7, durationSeconds: 3 },
                                { toValue: 1.3, durationSeconds: 1.5 }
                            ],
                            loopCount: 0,
                            isAdditive: true
                        })}
                    </rect>
                </g>
            </svg>
        </SvgWrapper>
    )
}

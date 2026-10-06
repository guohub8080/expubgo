import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper"
import { transformSkewX, transformScale } from "@guohub8080/expub-tool/smil"

export const SkewScaleCombo = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="100%" height="160" viewBox="0 0 280 160">
                <g transform="translate(140, 80)">
                    <rect x="-60" y="-40" width="120" height="80" fill="rgb(59, 130, 246)" rx="8">
                        {transformSkewX({
                            timeline: [
                                { toAbs: 12, durationSeconds: 1.5 },
                                { toAbs: -12, durationSeconds: 3 },
                                { toAbs: 12, durationSeconds: 1.5 }
                            ],
                            loopCount: 0,
                            isAdditive: true
                        })}
                        {transformScale({
                            initValue: 1,
                            timeline: [
                                { toAbs: 1.3, durationSeconds: 1.5 },
                                { toAbs: 0.7, durationSeconds: 3 },
                                { toAbs: 1.3, durationSeconds: 1.5 }
                            ],
                            pivot: [0, 0],
                            loopCount: 0,
                            isAdditive: true
                        })}
                    </rect>
                </g>
            </svg>
        </SvgWrapper>
    )
}

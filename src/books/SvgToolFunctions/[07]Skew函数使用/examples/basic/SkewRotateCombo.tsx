import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper"
import { transformSkewY, transformRotate } from "@guohub8080/expub-tool/smil"

export const SkewRotateCombo = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="100%" height="200" viewBox="0 0 280 200">
                <g transform="translate(140, 100)">
                    <rect x="-50" y="-50" width="100" height="100" fill="rgb(34, 197, 94)" rx="8">
                        {transformSkewY({
                            timeline: [
                                { toAbs: 10, durationSeconds: 2 },
                                { toAbs: -10, durationSeconds: 2 }
                            ],
                            loopCount: 0,
                            isAdditive: true
                        })}
                        {transformRotate({
                            timeline: [
                                { toAbs: 360, durationSeconds: 4 }
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

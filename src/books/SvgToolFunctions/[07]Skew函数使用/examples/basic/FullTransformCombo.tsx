import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper"
import { transformSkewY, transformScale, transformRotate, transformTranslate } from "@guohub8080/expub-tool/smil"

export const FullTransformCombo = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="100%" height="200" viewBox="0 0 280 200">
                <g transform="translate(140, 100)">
                    {transformSkewY({
                        timeline: [
                            { toAbs: 10, durationSeconds: 2 },
                            { toAbs: -10, durationSeconds: 2 }
                        ],
                        loopCount: 0,
                        isAdditive: true
                    })}
                    {transformScale({
                        initValue: 1,
                        timeline: [
                            { toAbs: 1.15, durationSeconds: 2 },
                            { toAbs: 0.85, durationSeconds: 2 }
                        ],
                        pivot: [0, 0],
                        loopCount: 0,
                        isAdditive: true
                    })}
                    {transformRotate({
                        timeline: [
                            { toAbs: 180, durationSeconds: 4 }
                        ],
                        loopCount: 0,
                        isAdditive: true
                    })}
                    {transformTranslate({
                        timeline: [
                            { toAbs: { x: 12, y: 0 }, durationSeconds: 2 },
                            { toAbs: { x: -12, y: 0 }, durationSeconds: 2 }
                        ],
                        loopCount: 0,
                        isAdditive: true
                    })}
                    <rect x="-60" y="-60" width="120" height="120" fill="rgb(168, 85, 247)" rx="8" />
                </g>
            </svg>
        </SvgWrapper>
    )
}

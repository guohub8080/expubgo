import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper"
import { genAnimateSkewY } from "@svg-anim/skewY"
import { genAnimateScale } from "@svg-anim/scale"
import { genAnimateRotate } from "@svg-anim/rotate"
import { genAnimateTranslate } from "@svg-anim/translate"

export const FullTransformCombo = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="100%" height="200" viewBox="0 0 280 200">
                <g transform="translate(140, 100)">
                    {genAnimateSkewY({
                        timeline: [
                            { toValue: 10, durationSeconds: 2 },
                            { toValue: -10, durationSeconds: 2 }
                        ],
                        loopCount: 0,
                        isAdditive: true
                    })}
                    {genAnimateScale({
                        timeline: [
                            { toValue: { x: 1.15, y: 0.85 }, durationSeconds: 2 },
                            { toValue: { x: 0.85, y: 1.15 }, durationSeconds: 2 }
                        ],
                        loopCount: 0,
                        isAdditive: true
                    })}
                    {genAnimateRotate({
                        timeline: [
                            { toValue: 180, durationSeconds: 4 }
                        ],
                        loopCount: 0,
                        isAdditive: true
                    })}
                    {genAnimateTranslate({
                        timeline: [
                            { toValue: { x: 12, y: 0 }, durationSeconds: 2 },
                            { toValue: { x: -12, y: 0 }, durationSeconds: 2 }
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

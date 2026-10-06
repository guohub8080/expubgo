import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper"
import { animateOpacity } from "@guohub8080/expub-tool/smil"

export const Blink = () => {
    return (
        <SvgWrapper>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="40" fill="#3b82f6">
                    {animateOpacity({
                        initValue: 1,
                        timeline: [
                            { toAbs: 0, durationSeconds: 0.5 },
                            { toAbs: 1, durationSeconds: 0.5 }
                        ],
                        loopCount: 0
                    })}
                </circle>
            </svg>
        </SvgWrapper>
    )
}

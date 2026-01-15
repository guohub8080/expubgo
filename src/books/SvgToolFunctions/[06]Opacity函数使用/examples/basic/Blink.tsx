import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper"
import { genAnimateOpacity } from "@svg-anim/opacity"

export const Blink = () => {
    return (
        <SvgWrapper>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="40" fill="#3b82f6">
                    {genAnimateOpacity({
                        timeline: [
                            { toValue: 0, durationSeconds: 0.5 },
                            { toValue: 1, durationSeconds: 0.5 }
                        ],
                        loopCount: 0
                    })}
                </circle>
            </svg>
        </SvgWrapper>
    )
}

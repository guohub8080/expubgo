import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper"
import { animateOpacity } from "@guohub8080/expub-tool/smil"

export const ClickFadeIn = () => {
    return (
        <SvgWrapper>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="40" fill="#3b82f6">
                    {animateOpacity({
                        initValue: 0,
                        timeline: [
                            { toAbs: 1, durationSeconds: 1 }
                        ],
                        begin: 'click',
                        isFreeze: true
                    })}
                </circle>
            </svg>
        </SvgWrapper>
    )
}

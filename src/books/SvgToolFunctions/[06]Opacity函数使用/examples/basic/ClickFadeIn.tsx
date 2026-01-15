import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper"
import { genAnimateOpacity } from "@svg-anim/opacity"

export const ClickFadeIn = () => {
    return (
        <SvgWrapper>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="40" fill="#3b82f6">
                    {genAnimateOpacity({
                        initOpacity: 0,
                        timeline: [
                            { toValue: 1, durationSeconds: 1 }
                        ],
                        beginType: 'click',
                        isFreeze: true
                    })}
                </circle>
            </svg>
        </SvgWrapper>
    )
}

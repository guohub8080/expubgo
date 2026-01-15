import { SvgWrapper } from "@book-svg-tool/data/SvgWrapper"
import { genAnimateSkewY } from "@svg-anim/skewY"

export const SkewYDirection = () => {
    return (
        <SvgWrapper showReplayButton={true}>
            <svg width="100%" height="240" viewBox="0 0 280 240">
                {/* 初始状态 */}
                <g transform="translate(30, 50)">
                    <rect x="-20" y="-20" width="40" height="40" fill="rgb(148, 163, 184)" opacity={0.3} />
                    <text x="0" y="35" fontSize="10" textAnchor="middle" fill="rgb(71, 85, 105)">0°</text>
                </g>

                {/* 向下倾斜 20° */}
                <g transform="translate(100, 50)">
                    <rect x="-20" y="-20" width="40" height="40" fill="rgb(34, 197, 94)" style={{ transform: 'skewY(20deg)' }} />
                    <text x="0" y="35" fontSize="10" textAnchor="middle" fill="rgb(71, 85, 105)">+20°</text>
                </g>

                {/* 向上倾斜 -20° */}
                <g transform="translate(170, 50)">
                    <rect x="-20" y="-20" width="40" height="40" fill="rgb(34, 197, 94)" style={{ transform: 'skewY(-20deg)' }} />
                    <text x="0" y="35" fontSize="10" textAnchor="middle" fill="rgb(71, 85, 105)">-20°</text>
                </g>

                {/* 动画示例 */}
                <g transform="translate(140, 150)">
                    <rect x="-100" y="-20" width="200" height="40" fill="rgb(249, 115, 22)" rx="4">
                        {genAnimateSkewY({
                            timeline: [
                                { toValue: 15, durationSeconds: 1 },
                                { toValue: -15, durationSeconds: 1 },
                                { toValue: 0, durationSeconds: 1 }
                            ],
                            loopCount: 0
                        })}
                    </rect>
                    <text x="0" y="35" fontSize="10" textAnchor="middle" fill="rgb(71, 85, 105)">动画</text>
                </g>
            </svg>
        </SvgWrapper>
    )
}

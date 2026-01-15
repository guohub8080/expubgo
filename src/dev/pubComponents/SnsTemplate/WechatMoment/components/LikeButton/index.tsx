import { CSSProperties } from "react"
import SectionEx from "@pub-html/basicEx/SectionEx"
import { defaultTo } from "es-toolkit/compat"

// ============================================ Types ============================================

interface LikeButtonProps {
    /** margin/padding 快捷配置 */
    mp?: {
        mt?: number | string
        mb?: number | string
        ml?: number | string
        mr?: number | string
        pt?: number | string
        pb?: number | string
        pl?: number | string
        pr?: number | string
    }
}

// ============================================ Constants ============================================

const HEART_SIZE = 20
const STROKE_COLOR_EMPTY = "rgb(80, 120, 180)"
const FILL_COLOR_LIKED = "rgb(255, 77, 95)"

// ============================================ LikeButton Component ============================================

/**
 * LikeButton - 朋友圈点赞按钮
 *
 * 使用零高容器叠加两个独立 SVG
 */
const LikeButton = (props: LikeButtonProps) => {
    const { mp } = props

    const mpStyle: CSSProperties = {
        marginTop: defaultTo(mp?.mt, 0),
        marginBottom: defaultTo(mp?.mb, 0),
        marginLeft: defaultTo(mp?.ml, 0),
        marginRight: defaultTo(mp?.mr, 0),
        paddingTop: defaultTo(mp?.pt, 0),
        paddingBottom: defaultTo(mp?.pb, 0),
        paddingLeft: defaultTo(mp?.pl, 0),
        paddingRight: defaultTo(mp?.pr, 0),
    }

    return (
        <SectionEx style={{ ...containerStyle, ...mpStyle }}>
            {/* 底层：红色实心心形（零高容器） */}
            <SectionEx style={zeroHeightStyle}>
                <svg
                    width={HEART_SIZE}
                    height={HEART_SIZE}
                    viewBox="0 0 24 24"
                    style={svgStyle}
                >
                    <path
                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                        fill={FILL_COLOR_LIKED}
                    />
                </svg>
            </SectionEx>

            {/* 顶层：空心跳动心形（点击后整体淡出） */}
            <svg
                width={HEART_SIZE}
                height={HEART_SIZE}
                viewBox="0 0 24 24"
                style={{ ...svgStyle, cursor: "pointer", overflow: "visible" }}
            >
                {/* 点击后整个 SVG 淡出 */}
                <animate
                    attributeName="opacity"
                    begin="click"
                    dur="0.3s"
                    values="1;0"
                    fill="freeze"
                    restart="never"
                />

                {/* 跳动动画 - 以中心点缩放 */}
                <g transform="translate(12 12)">
                    <animateTransform
                        attributeName="transform"
                        type="scale"
                        values="1;1.2;1"
                        dur="1s"
                        repeatCount="indefinite"
                        calcMode="spline"
                        keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
                        additive="sum"
                    />
                    <g transform="translate(-12 -12)">
                        <path
                            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                            fill="rgba(255,255,255,0)"
                            stroke={STROKE_COLOR_EMPTY}
                            strokeWidth="1.5"
                        />
                    </g>
                </g>
            </svg>
        </SectionEx>
    )
}

export default LikeButton

// ============================================ Styles ============================================

const containerStyle: CSSProperties = {
    display: "block",
    boxSizing: "border-box",
    width: "fit-content",
}

const zeroHeightStyle: CSSProperties = {
    height: 0,
    lineHeight: 0,
}

const svgStyle: CSSProperties = {
    display: "block",
}

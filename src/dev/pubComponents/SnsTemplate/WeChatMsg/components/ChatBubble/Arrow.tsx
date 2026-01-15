import { CSSProperties } from "react"
import { CHAT_MSG_CONSTANTS, baseStyle } from "@sns/WeChatMsg/constants"
import { ARROW_SIZE, BORDER_OFFSET, CLIP_PATH } from "./constants"

// ============================================ Types ============================================

interface ArrowProps {
    color: string
    strokeColor?: string
    direction: "left" | "right"
}

// ============================================ Arrow Component ============================================

/**
 * Arrow - 三角形箭头组件（使用 clip-path）
 */
const Arrow = ({ color, strokeColor, direction }: ArrowProps) => {
    const clipPathValue = direction === "left" ? CLIP_PATH.LEFT : CLIP_PATH.RIGHT

    return (
        <section style={arrowWrapperStyle}>
            {strokeColor && (
                <section
                    style={{
                        ...arrowBaseStyle(clipPathValue),
                        backgroundColor: strokeColor,
                        marginLeft: -BORDER_OFFSET,
                        marginTop: -BORDER_OFFSET,
                    }}
                />
            )}
            <section
                style={{
                    ...arrowBaseStyle(clipPathValue),
                    backgroundColor: color,
                }}
            />
        </section>
    )
}

export default Arrow

// ============================================ Style Helpers ============================================

/** 箭头基础样式 */
const arrowBaseStyle = (clipPath: string): CSSProperties => ({
    ...baseStyle,
    width: "100%",
    height: "100%",
    clipPath: clipPath,
})

// ============================================ Styles ============================================

const arrowWrapperStyle: CSSProperties = {
    ...baseStyle,
    display: "flex",
    flexDirection: "row",
    width: ARROW_SIZE,
    height: ARROW_SIZE,
    minWidth: ARROW_SIZE,
    maxWidth: ARROW_SIZE,
    flexShrink: 0,
    marginTop: CHAT_MSG_CONSTANTS.BUBBLE_PADDING,
}

import { CSSProperties } from "react"
import { CHAT_MSG_CONSTANTS, baseStyle } from "@sns/WeChatMsg/constants"

// ============================================ Styles ============================================

const bubbleWithArrowStyle: CSSProperties = {
    ...baseStyle,
    display: "inline-flex",
    flexDirection: "row",
    alignItems: "flex-start",
}

const bubbleStyle: CSSProperties = {
    ...baseStyle,
    display: "inline-block",
    maxWidth: "100%",
    padding: CHAT_MSG_CONSTANTS.BUBBLE_PADDING,
    borderRadius: CHAT_MSG_CONSTANTS.BUBBLE_BORDER_RADIUS,
    fontSize: CHAT_MSG_CONSTANTS.FONT_SIZE_CONTENT,
}

// ============================================ Style Helpers ============================================

/** 获取气泡样式 */
export const getBubbleStyle = (
    color: string,
    textColor: string,
    borderColor: string
): CSSProperties => ({
    ...bubbleStyle,
    backgroundColor: color,
    color: textColor,
    border: `1px solid ${borderColor}`,
})

export { bubbleWithArrowStyle }

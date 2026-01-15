import { bubbleWithArrowStyle, getBubbleStyle } from "./styles"
import Arrow from "./Arrow"

// ============================================ Types ============================================

interface ChatBubbleProps {
    /** 气泡颜色 */
    color: string
    /** 气泡边框颜色 */
    borderColor: string
    /** 文字颜色 */
    textColor: string
    /** 消息内容 */
    content: React.ReactNode
}

// ============================================ ChatBubbleR Component ============================================

/**
 * ChatBubbleR - 聊天气泡组件（右箭头）
 *
 * 箭头指向右侧，用于我方消息
 */
const ChatBubbleR = (props: ChatBubbleProps) => {
    const { color, borderColor, textColor, content } = props

    return (
        <section style={bubbleWithArrowStyle}>
            <section style={getBubbleStyle(color, textColor, borderColor)}>
                {content}
            </section>
            <Arrow color={color} strokeColor={borderColor} direction="right" />
        </section>
    )
}

export default ChatBubbleR

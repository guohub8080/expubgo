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

// ============================================ ChatBubbleL Component ============================================

/**
 * ChatBubbleL - 聊天气泡组件（左箭头）
 *
 * 箭头指向左侧，用于对方消息
 */
const ChatBubbleL = (props: ChatBubbleProps) => {
    const { color, borderColor, textColor, content } = props

    return (
        <section style={bubbleWithArrowStyle}>
            <Arrow color={color} strokeColor={borderColor} direction="left" />
            <section style={getBubbleStyle(color, textColor, borderColor)}>
                {content}
            </section>
        </section>
    )
}

export default ChatBubbleL

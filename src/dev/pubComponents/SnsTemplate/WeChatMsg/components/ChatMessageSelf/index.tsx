import { CSSProperties } from "react"
import { CHAT_MSG_CONSTANTS, baseStyle } from "@sns/WeChatMsg/constants"
import { ChatBubbleR } from "../ChatBubble"

// ============================================ Types ============================================

interface ChatMessageSelfProps {
    /** 头像图片 URL */
    avatar?: string
    /** 消息内容 */
    content: React.ReactNode
}

// ============================================ ChatMessageSelf Component ============================================

/**
 * ChatMessageSelf - 我方消息组件（右侧）
 *
 * 布局：[对话框][头像]
 * - 头像固定宽度：AVATAR_SIZE (42px)
 * - 对话框最大宽度：BUBBLE_MAX_WIDTH (240px)
 * - 对话框自动扩展，但不超过最大宽度
 * - 头像和对话框之间有间距
 *
 * @example
 * <ChatMessageSelf
 *   avatar="https://example.com/avatar.jpg"
 *   content={<div>你好！</div>}
 * />
 */
const ChatMessageSelf = (props: ChatMessageSelfProps) => {
    const { avatar, content } = props

    return (
        <section style={containerStyle}>
            {/* 消息内容区域（对话框 + 箭头） */}
            <section style={contentWrapperStyle}>
                <ChatBubbleR
                    color={CHAT_MSG_CONSTANTS.COLOR_BUBBLE_SELF}
                    borderColor={CHAT_MSG_CONSTANTS.COLOR_BUBBLE_BORDER}
                    textColor={CHAT_MSG_CONSTANTS.COLOR_TEXT_SELF}
                    content={content}
                />
            </section>

            {/* 头像 */}
            <section style={avatarWrapperStyle}>
                {avatar ? (
                    <section style={avatarImageStyle}>
                        <img
                            src={avatar}
                            alt=""
                            style={{
                                display: "block",
                                width: "100%",
                                height: "100%",
                                aspectRatio: "1 / 1",
                                objectFit: "cover",
                            }}
                        />
                    </section>
                ) : (
                    <section style={avatarPlaceholderStyle}>
                        <span style={avatarTextStyle}>我</span>
                    </section>
                )}
            </section>
        </section>
    )
}

export default ChatMessageSelf

// ============================================ Styles ============================================

const containerStyle: CSSProperties = {
    ...baseStyle,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end", // 右对齐
    alignItems: "flex-start",
    marginBottom: CHAT_MSG_CONSTANTS.MESSAGE_GAP,
}

const contentWrapperStyle: CSSProperties = {
    ...baseStyle,
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",
    maxWidth: CHAT_MSG_CONSTANTS.BUBBLE_MAX_WIDTH, // 气泡最大宽度
}

const avatarWrapperStyle: CSSProperties = {
    ...baseStyle,
    width: CHAT_MSG_CONSTANTS.AVATAR_SIZE,
    height: CHAT_MSG_CONSTANTS.AVATAR_SIZE,
    marginLeft: CHAT_MSG_CONSTANTS.AVATAR_MARGIN_LEFT,
    flexShrink: 0,
}

const avatarImageStyle: CSSProperties = {
    width: "100%",
    height: "100%",
    borderRadius: CHAT_MSG_CONSTANTS.AVATAR_BORDER_RADIUS,
    overflow: "hidden",
}

const avatarPlaceholderStyle: CSSProperties = {
    width: CHAT_MSG_CONSTANTS.AVATAR_SIZE,
    height: CHAT_MSG_CONSTANTS.AVATAR_SIZE,
    borderRadius: CHAT_MSG_CONSTANTS.AVATAR_BORDER_RADIUS,
    overflow: "hidden",
    backgroundColor: CHAT_MSG_CONSTANTS.COLOR_BUBBLE_SELF,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}

const avatarTextStyle: CSSProperties = {
    fontSize: 16,
    fontWeight: 600,
    color: CHAT_MSG_CONSTANTS.COLOR_TEXT_SELF,
}

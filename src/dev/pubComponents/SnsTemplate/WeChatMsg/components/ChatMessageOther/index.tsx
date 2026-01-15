import { CSSProperties } from "react"
import { CHAT_MSG_CONSTANTS, baseStyle } from "@sns/WeChatMsg/constants"
import { ChatBubbleL } from "../ChatBubble"

// ============================================ Types ============================================

interface ChatMessageOtherProps {
    /** 头像图片 URL */
    avatar?: string
    /** 用户名（用于头像降级显示首字母） */
    username: string
    /** 消息内容 */
    content: React.ReactNode
}

// ============================================ ChatMessageOther Component ============================================

/**
 * ChatMessageOther - 对方消息组件（左侧）
 *
 * 布局：[头像][对话框]
 * - 头像固定宽度：AVATAR_SIZE (42px)
 * - 对话框最大宽度：BUBBLE_MAX_WIDTH (240px)
 * - 对话框自动扩展，但不超过最大宽度
 * - 头像和对话框之间有间距
 *
 * @example
 * <ChatMessageOther
 *   avatar="https://example.com/avatar.jpg"
 *   username="张三"
 *   content={<div>你好！</div>}
 * />
 */
const ChatMessageOther = (props: ChatMessageOtherProps) => {
    const { avatar, username, content } = props

    return (
        <section style={containerStyle}>
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
                        <span style={avatarTextStyle}>{username[0]}</span>
                    </section>
                )}
            </section>

            {/* 消息内容区域（对话框 + 箭头） */}
            <section style={contentWrapperStyle}>
                <ChatBubbleL
                    color={CHAT_MSG_CONSTANTS.COLOR_BUBBLE_OTHER}
                    borderColor={CHAT_MSG_CONSTANTS.COLOR_BUBBLE_BORDER}
                    textColor={CHAT_MSG_CONSTANTS.COLOR_TEXT}
                    content={content}
                />
            </section>
        </section>
    )
}

export default ChatMessageOther

// ============================================ Styles ============================================

const containerStyle: CSSProperties = {
    ...baseStyle,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start", // 左对齐
    alignItems: "flex-start",
    marginBottom: CHAT_MSG_CONSTANTS.MESSAGE_GAP,
}

const contentWrapperStyle: CSSProperties = {
    ...baseStyle,
    flex: 1,
    display: "flex",
    justifyContent: "flex-start",
    maxWidth: CHAT_MSG_CONSTANTS.BUBBLE_MAX_WIDTH, // 气泡最大宽度
}

const avatarWrapperStyle: CSSProperties = {
    ...baseStyle,
    width: CHAT_MSG_CONSTANTS.AVATAR_SIZE,
    height: CHAT_MSG_CONSTANTS.AVATAR_SIZE,
    marginRight: CHAT_MSG_CONSTANTS.AVATAR_MARGIN_RIGHT,
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
    backgroundColor: CHAT_MSG_CONSTANTS.COLOR_BORDER,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}

const avatarTextStyle: CSSProperties = {
    fontSize: 16,
    fontWeight: 600,
    color: CHAT_MSG_CONSTANTS.COLOR_TEXT,
}

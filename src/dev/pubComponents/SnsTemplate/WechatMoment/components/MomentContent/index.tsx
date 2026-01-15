import { CSSProperties, ReactNode } from "react"
import { MOMENT_CONSTANTS, baseStyle } from "../../constants"

// ============================================ Types ============================================

interface MomentContentProps {
    /** 用户名 */
    username: string
    /** 文本内容（支持字符串或 ReactNode） */
    content?: ReactNode
}

// ============================================ MomentContent Component ============================================

/**
 * MomentContent - 朋友圈内容组件
 *
 * 特点：
 * - 显示用户名（蓝色链接样式）
 * - 显示文本内容（支持换行和富文本）
 * - 自动间距和格式化
 *
 * @example
 * <MomentContent username="张三" content="今天天气真不错！" />
 * <MomentContent username="李四" content={<span>富文本内容</span>} />
 */
const MomentContent = (props: MomentContentProps) => {
    const { username, content } = props

    return (
        <section style={contentWrapperStyle}>
            {/* 用户名 */}
            <section style={userInfoStyle}>
                <span style={usernameStyle}>{username}</span>
            </section>

            {/* 文本内容 */}
            {content && <section style={contentTextStyle}>{content}</section>}
        </section>
    )
}

export default MomentContent

// ============================================ Styles ============================================

const contentWrapperStyle: CSSProperties = {
    ...baseStyle,
}

const userInfoStyle: CSSProperties = {
    ...baseStyle,
    marginBottom: MOMENT_CONSTANTS.CONTENT_GAP,
}

const usernameStyle: CSSProperties = {
    fontSize: MOMENT_CONSTANTS.FONT_SIZE_USERNAME,
    fontWeight: "bold",
    color: MOMENT_CONSTANTS.COLOR_LINK,
    display: "block",
    lineHeight: "23px",
    marginBottom: 2,
}

const contentTextStyle: CSSProperties = {
    ...baseStyle,
    fontSize: MOMENT_CONSTANTS.FONT_SIZE_CONTENT,
    color: MOMENT_CONSTANTS.COLOR_TEXT,
    lineHeight: 1.6,
    marginBottom: MOMENT_CONSTANTS.CONTENT_GAP,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
}

import { CSSProperties, ReactNode } from "react"
import { MOMENT_CONSTANTS, baseStyle } from "../../constants"

// ============================================ Types ============================================

export interface CommentItem {
    /** 评论者用户名 */
    username: string
    /** 评论文字内容 */
    text: string
    /** 文字下方的自定义内容（图片等） */
    node?: ReactNode
}

interface MomentCommentProps {
    /** 评论列表 */
    comments: CommentItem[]
    /** 上边距 */
    mt?: number
}

// ============================================ MomentComment Component ============================================

/**
 * MomentComment - 朋友圈评论区组件
 *
 * @example
 * <MomentComment comments={[
 *     { username: "张三", content: "拍得真好！" },
 *     { username: "李四", content: "新年快乐！", replyTo: "张三" },
 * ]} />
 */
const MomentComment = (props: MomentCommentProps) => {
    const { comments, mt = 0 } = props

    if (comments.length === 0) return null

    return (
        <section style={{ ...commentWrapperStyle, marginTop: mt }}>
            {comments.map((comment, index) => (
                <section key={index} style={commentItemStyle}>
                    <span style={commentUsernameStyle}>{comment.username}</span>
                    <span style={commentTextStyle}>：{comment.text}</span>
                    {comment.node && <section style={{ marginTop: 4 }}>{comment.node}</section>}
                </section>
            ))}
        </section>
    )
}

export default MomentComment

// ============================================ Styles ============================================

const commentWrapperStyle: CSSProperties = {
    ...baseStyle,
    backgroundColor: MOMENT_CONSTANTS.COLOR_INTERACTION_BG,
    padding: "10px 10px",
}

const commentItemStyle: CSSProperties = {
    ...baseStyle,
    lineHeight: "22px",
    marginBottom: 4,
}

const commentUsernameStyle: CSSProperties = {
    fontSize: 15,
    fontWeight: "bold",
    color: MOMENT_CONSTANTS.COLOR_LINK,
}

const commentTextStyle: CSSProperties = {
    fontSize: 15,
    color: MOMENT_CONSTANTS.COLOR_TEXT,
}

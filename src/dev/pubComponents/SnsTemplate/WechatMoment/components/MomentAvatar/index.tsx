import { CSSProperties } from "react"
import { MOMENT_CONSTANTS, baseStyle } from "../../constants"
import { defaultTo } from "es-toolkit/compat"

// ============================================ Types ============================================

interface MomentAvatarProps {
    /** 头像图片 URL */
    avatar?: string
    /** 用户名（用于头像降级显示首字母） */
    username: string
    /** 头像大小，默认使用 MOMENT_CONSTANTS.AVATAR_SIZE */
    size?: number
}

// ============================================ MomentAvatar Component ============================================

/**
 * MomentAvatar - 朋友圈头像组件
 *
 * 特点：
 * - 支持 URL 图片显示
 * - 无图片时降级显示用户名首字母
 * - 固定尺寸，圆角矩形
 * - 与内容自动间距
 *
 * @example
 * <MomentAvatar username="张三" avatar="https://example.com/avatar.jpg" />
 * <MomentAvatar username="李四" />
 * <MomentAvatar username="王五" size={48} />
 */
const MomentAvatar = (props: MomentAvatarProps) => {
    const { avatar, username } = props

    // 获取头像大小，默认 MOMENT_CONSTANTS.AVATAR_SIZE
    const avatarSize = defaultTo(props.size, MOMENT_CONSTANTS.AVATAR_SIZE)

    return (
        <section style={{
            ...baseStyle,
            width: avatarSize,
            height: avatarSize,
            marginRight: MOMENT_CONSTANTS.AVATAR_MARGIN_RIGHT,
            flexShrink: 0,
        }}>
            {avatar ? (
                <section style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: MOMENT_CONSTANTS.AVATAR_BORDER_RADIUS,
                    overflow: "hidden",
                    backgroundImage: `url(${avatar})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }} />
            ) : (
                <section style={{
                    width: avatarSize,
                    height: avatarSize,
                    borderRadius: MOMENT_CONSTANTS.AVATAR_BORDER_RADIUS,
                    overflow: "hidden",
                    backgroundColor: MOMENT_CONSTANTS.COLOR_BORDER,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    <span style={avatarTextStyle}>{username[0]}</span>
                </section>
            )}
        </section>
    )
}

export default MomentAvatar

// ============================================ Styles ============================================

const avatarTextStyle: CSSProperties = {
    fontSize: 18,
    fontWeight: 600,
    color: MOMENT_CONSTANTS.COLOR_TEXT,
}

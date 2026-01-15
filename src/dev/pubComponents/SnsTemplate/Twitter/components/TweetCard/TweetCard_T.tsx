import { CSSProperties, ReactNode } from "react"
import { defaultTo } from "es-toolkit/compat"
import XLogoIcon from "../../collections/Icons/XLogoIcon"
import { TWEET_CONSTANTS } from "../../constants"

// ============================================ Types ============================================

interface TweetCard_T_Props {
    children: ReactNode
    borderRadius?: CSSProperties["borderRadius"]
    paddingY?: CSSProperties["paddingTop"]
    isFromTextShow?: boolean // 是否显示"来自社交媒体"文字
}

// ============================================ TweetCard_T Component ============================================

/**
 * TweetCard_T - Twitter 推文卡片组件（Top，Logo 居中）
 *
 * 特点：
 * - 圆角卡片容器
 * - 顶部中央 X Logo 图标
 * - 可选显示"来自社交媒体"文字（通过 isFromTextShow 控制）
 * - 内部放置推文内容
 *
 * 布局原理：
 * 1. Logo 容器占据固定高度，Logo 居中显示
 * 2. 内容正常排列在 Logo 下方，不需要负 margin
 * 3. 简化布局，适合 Logo 在顶部的场景
 */
const TweetCard_T = (props: TweetCard_T_Props) => {
    const { children, borderRadius, paddingY, isFromTextShow=false } = props

    const userPaddingY = defaultTo(paddingY, TWEET_CONSTANTS.CARD_PADDING)

    const finalCardStyle: CSSProperties = {
        ...cardStyle,
        borderRadius: defaultTo(borderRadius, TWEET_CONSTANTS.CARD_BORDER_RADIUS),
    }

    const finalLogoWrapperStyle: CSSProperties = {
        ...logoWrapperStyle,
        marginTop: userPaddingY,
        marginBottom: 0,
        height: TWEET_CONSTANTS.LOGO_SIZE_NORMAL,
        gap: isFromTextShow ? TWEET_CONSTANTS.GAP_LARGE : 0,
    }

    const finalContentStyle: CSSProperties = {
        ...contentStyle,
    }

    return (
        <section style={finalCardStyle}>
            {/* 顶部中央：文字 + X Logo（如果 isFromTextShow 为 true）或仅 X Logo */}
            <section style={finalLogoWrapperStyle}>
                {isFromTextShow && <span style={textStyle}>来自社交媒体</span>}
                <XLogoIcon style={logoStyle} />
            </section>

            {/* 推文内容 */}
            <section style={finalContentStyle}>
                {children}
            </section>
        </section>
    )
}

export default TweetCard_T

// ============================================ Styles ============================================

const cardStyle: CSSProperties = {
    backgroundColor: TWEET_CONSTANTS.COLOR_BACKGROUND_WHITE,
    border: `1px solid ${TWEET_CONSTANTS.COLOR_BORDER}`,
    overflow: "hidden",
}

const logoWrapperStyle: CSSProperties = {
    display: "flex",
    justifyContent: "center", // 中央对齐
    alignItems: "center",
}

const logoStyle: CSSProperties = {
    width: TWEET_CONSTANTS.LOGO_SIZE_NORMAL,
    height: TWEET_CONSTANTS.LOGO_SIZE_NORMAL,
    color: TWEET_CONSTANTS.COLOR_TEXT_TERTIARY,
    opacity: 0.6,
}

const textStyle: CSSProperties = {
    color: TWEET_CONSTANTS.COLOR_TEXT_TERTIARY,
    fontSize: "14px",
    lineHeight: `${TWEET_CONSTANTS.LOGO_SIZE_NORMAL}px`, // 与 Logo 高度一致，确保垂直居中
}

const contentStyle: CSSProperties = {
    padding: `${TWEET_CONSTANTS.CARD_PADDING}px`,
}

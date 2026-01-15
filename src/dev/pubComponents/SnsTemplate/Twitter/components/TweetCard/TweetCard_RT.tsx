import { CSSProperties, ReactNode } from "react"
import { defaultTo } from "es-toolkit/compat"
import XLogoIcon from "../../collections/Icons/XLogoIcon"

// ============================================ Types ============================================

interface TweetCard_RT_Props {
    children: ReactNode
    borderRadius?: CSSProperties["borderRadius"]
    paddingY?: CSSProperties["paddingTop"]
    isFromTextShow?: boolean // 是否显示"来自社交媒体"文字
}

// ============================================ Constants ============================================

/**
 * TweetCard_RT 组件常量配置
 *
 * 魔法数字说明：
 * - LOGO_SIZE: X Logo 图标的尺寸（宽高相同）
 * - DEFAULT_PADDING_TOP: Logo 默认上下内边距
 * - DEFAULT_BORDER_RADIUS: 卡片默认圆角
 * - CONTENT_PADDING: 内容区域内边距
 * - FONT_SIZE: 文字大小
 * - GAP: 文字和 Logo 之间的间距
 */
const LOGO_SIZE = 20 // X Logo 图标的固定尺寸（px）
const DEFAULT_PADDING_TOP = 12 // Logo 默认上内边距（px）
const DEFAULT_BORDER_RADIUS = 16 // 卡片默认圆角（px）
const CONTENT_PADDING = 12 // 内容区域内边距（px）
const FONT_SIZE = 14 // 文字大小（px）
const GAP = 8 // 文字和 Logo 之间的间距（px）

// ============================================ TweetCard_RT Component ============================================

/**
 * TweetCard_RT - Twitter 推文卡片组件（Right Top，无负 margin）
 *
 * 特点：
 * - 圆角卡片容器
 * - 顶部右侧显示 X Logo
 * - 可选显示"来自社交媒体"文字（通过 isFromTextShow 控制）
 * - 内部放置推文内容
 *
 * 布局原理：
 * 1. Logo 容器使用 flexbox 布局，靠右对齐
 * 2. 内容正常排列在 Logo 下方，不需要负 margin
 * 3. 简化布局，适合 Logo 在顶部右侧的场景
 */
const TweetCard_RT = (props: TweetCard_RT_Props) => {
    const { children, borderRadius, paddingY, isFromTextShow=true } = props

    const userPaddingY = defaultTo(paddingY, DEFAULT_PADDING_TOP)

    const finalCardStyle: CSSProperties = {
        ...cardStyle,
        borderRadius: defaultTo(borderRadius, DEFAULT_BORDER_RADIUS),
    }

    const finalLogoWrapperStyle: CSSProperties = {
        ...logoWrapperStyle,
        marginTop: userPaddingY,
        marginBottom: 0,
        height: LOGO_SIZE,
        gap: isFromTextShow ? GAP : 0,
    }

    const finalContentStyle: CSSProperties = {
        ...contentStyle,
    }

    return (
        <section style={finalCardStyle}>
            {/* 顶部右侧：文字 + X Logo（如果 isFromTextShow 为 true）或仅 X Logo */}
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

export default TweetCard_RT

// ============================================ Styles ============================================

const cardStyle: CSSProperties = {
    backgroundColor: "rgb(255, 255, 255)",
    border: "1px solid rgb(207, 217, 222)",
    overflow: "hidden",
}

const logoWrapperStyle: CSSProperties = {
    display: "flex",
    justifyContent: "flex-end", // 靠右对齐
    alignItems: "center",
    paddingRight: DEFAULT_PADDING_TOP, // 右边距，与上边距保持一致
}

const logoStyle: CSSProperties = {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    color: "rgb(111, 134, 159)",
    opacity: 0.6,
}

const textStyle: CSSProperties = {
    color: "rgb(111, 134, 159)",
    fontSize: FONT_SIZE,
    lineHeight: LOGO_SIZE, // 与 Logo 高度一致，确保垂直居中
}

const contentStyle: CSSProperties = {
    padding: CONTENT_PADDING,
}

import { CSSProperties, ReactNode } from "react"
import { defaultTo } from "es-toolkit/compat"
import XLogoIcon from "../../collections/Icons/XLogoIcon"

// ============================================ Types ============================================

interface TweetCard_RT_0Margin_Props {
    children: ReactNode
    borderRadius?: CSSProperties["borderRadius"]
    paddingTop?: CSSProperties["paddingTop"]
}

// ============================================ Constants ============================================

/**
 * TweetCard_RT_0Margin 组件常量配置
 *
 * 魔法数字说明：
 * - LOGO_SIZE: X Logo 图标的尺寸（宽高相同）
 * - DEFAULT_PADDING_TOP: Logo 默认上内边距
 * - DEFAULT_BORDER_RADIUS: 卡片默认圆角
 * - CONTENT_PADDING: 内容区域内边距
 * - LOGO_WRAPPER_PADDING_RIGHT: Logo 容器右边距
 */
const LOGO_SIZE = 20 // X Logo 图标的固定尺寸（px）
const DEFAULT_PADDING_TOP = 12 // Logo 默认上内边距（px）
const DEFAULT_BORDER_RADIUS = 16 // 卡片默认圆角（px）
const CONTENT_PADDING = 12 // 内容区域内边距（px）
const LOGO_WRAPPER_PADDING_RIGHT = 12 // Logo 容器右边距（px）

// ============================================ TweetCard_RT_0Margin Component ============================================

/**
 * TweetCard_RT_0Margin - Twitter 推文卡片组件（Right Top, 使用负 margin）
 *
 * 特点：
 * - 圆角卡片容器
 * - 右上角 X Logo 图标
 * - 内部放置推文内容
 *
 * 布局原理：
 * 1. 卡片容器设置 paddingTop，撑高顶部空间
 * 2. Logo 容器使用负 marginTop 抵消卡片的 paddingTop，定位在顶部
 * 3. 内容区域使用负 marginTop 向上偏移，叠加在 Logo 上
 * 4. 替代 position: absolute，兼容微信公众号
 */
const TweetCard_RT_0Margin = (props: TweetCard_RT_0Margin_Props) => {
    const { children, borderRadius, paddingTop } = props

    const logoAreaHeight = LOGO_SIZE + DEFAULT_PADDING_TOP // Logo 区域总高度
    const cardPaddingTop = logoAreaHeight + DEFAULT_PADDING_TOP // 卡片实际顶部内边距
    const userPaddingTop = defaultTo(paddingTop, 0)

    const finalCardStyle: CSSProperties = {
        ...cardStyle,
        borderRadius: defaultTo(borderRadius, DEFAULT_BORDER_RADIUS),
        paddingTop: cardPaddingTop + userPaddingTop,
    }

    const finalLogoWrapperStyle: CSSProperties = {
        ...logoWrapperStyle,
        paddingTop: DEFAULT_PADDING_TOP,
        height: logoAreaHeight,
        marginTop: -cardPaddingTop, // 抵消整个卡片的 paddingTop
    }

    const finalContentStyle: CSSProperties = {
        ...contentStyle,
        marginTop: -logoAreaHeight, // 负 margin 向上偏移，叠加在 Logo 上
    }

    return (
        <section style={finalCardStyle}>
            {/* 右上角 X Logo */}
            <section style={finalLogoWrapperStyle}>
                <XLogoIcon style={logoStyle} />
            </section>

            {/* 推文内容 */}
            <section style={finalContentStyle}>
                {children}
            </section>
        </section>
    )
}

export default TweetCard_RT_0Margin

// ============================================ Styles ============================================

const cardStyle: CSSProperties = {
    backgroundColor: "rgb(255, 255, 255)",
    border: "1px solid rgb(207, 217, 222)",
    overflow: "hidden",
}

const logoWrapperStyle: CSSProperties = {
    display: "flex",
    justifyContent: "flex-end",
    paddingRight: LOGO_WRAPPER_PADDING_RIGHT,
}

const logoStyle: CSSProperties = {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    color: "rgb(111, 134, 159)",
    opacity: 0.6,
}

const contentStyle: CSSProperties = {
    padding: CONTENT_PADDING,
}

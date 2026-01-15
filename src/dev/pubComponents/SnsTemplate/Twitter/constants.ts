import { CSSProperties } from "react"

// ============================================ Twitter 设计规范 ============================================

/**
 * Twitter 组件常量配置
 *
 * 魔法数字说明：
 * - 头像尺寸：40px
 * - Logo 尺寸：18-20px
 * - 卡片圆角：16px
 * - 字体大小：14-15px
 * - 颜色：主色 rgb(15, 20, 25)、链接色 rgb(29, 155, 240)、次要文字 rgb(83, 100, 113)
 */

// ============================================ 尺寸常量 ============================================

export const TWEET_CONSTANTS = {
    // 头像
    AVATAR_SIZE: 40, // 头像尺寸（px）
    AVATAR_MARGIN_RIGHT: 8, // 头像右边距（px）
    AVATAR_FALLBACK_FONT_SIZE: 20, // 头像回退文字大小（px）

    // Logo
    LOGO_SIZE_SMALL: 18, // 小 Logo 尺寸（px），用于 LikeBar
    LOGO_SIZE_NORMAL: 20, // 正常 Logo 尺寸（px），用于 TweetCard

    // 卡片
    CARD_BORDER_RADIUS: 16, // 卡片圆角（px）
    CARD_PADDING: 12, // 卡片内边距（px）

    // 图标
    VERIFIED_ICON_SIZE: 20, // 认证图标尺寸（px）
    VERIFIED_ICON_MARGIN: 2, // 认证图标左边距（px）
    HEART_SIZE: 22, // 心形图标尺寸（px）

    // 间距
    GAP_SMALL: 2, // 小间距（px）
    GAP_NORMAL: 4, // 正常间距（px）
    GAP_LARGE: 8, // 大间距（px）
    CONTENT_MARGIN_BOTTOM: 2, // 内容底部边距（px）

    // LikeBar
    LIKEBAR_PADDING: 16, // 点赞栏内边距（px）

    // 内容
    CONTENT_FONT_SIZE: 17, // 正文字体大小（px）
    CONTENT_LINE_HEIGHT: 24, // 正文字体行高（px）
    CONTENT_MARGIN_TOP: 12, // 内容上边距（px）

    // 颜色
    COLOR_TEXT_PRIMARY: "rgb(15, 20, 25)", // 主要文字颜色
    COLOR_TEXT_SECONDARY: "rgb(83, 100, 113)", // 次要文字颜色
    COLOR_TEXT_TERTIARY: "rgb(111, 134, 159)", // 第三级文字颜色
    COLOR_LINK: "rgb(29, 155, 240)", // 链接颜色（认证蓝）
    COLOR_BACKGROUND_WHITE: "rgb(255, 255, 255)", // 白色背景
    COLOR_BORDER: "rgb(207, 217, 222)", // 边框颜色
    COLOR_HEART: "rgb(249, 24, 128)", // 心形颜色
    COLOR_AVATAR_FALLBACK_BG: "rgb(15, 20, 25)", // 头像回退背景色
    COLOR_AVATAR_FALLBACK_TEXT: "white", // 头像回退文字颜色
} as const

// ============================================ 基础样式 ============================================

/**
 * Twitter 基础 Flexbox 样式
 * 所有 Twitter 组件的通用样式基础
 */
export const baseFlexStyle: CSSProperties = {
    boxSizing: "border-box",
    borderWidth: "0px",
    borderStyle: "solid",
    borderColor: "black",
    alignItems: "stretch",
    backgroundColor: "rgba(0, 0, 0, 0)",
    display: "flex",
    flexBasis: "auto",
    flexDirection: "column",
    flexShrink: 1,
    listStyle: "none",
    margin: "0px",
    minHeight: "0px",
    minWidth: "0px",
    padding: "0px",
    position: "relative",
    textDecoration: "none",
    zIndex: 0,
}

/**
 * Twitter 基础 Block 样式
 * 用于块级元素
 */
export const baseBlockStyle: CSSProperties = {
    ...baseFlexStyle,
    display: "block",
}

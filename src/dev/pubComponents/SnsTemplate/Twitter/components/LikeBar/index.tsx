import { CSSProperties } from "react"
import XLogoIcon from "../../collections/Icons/XLogoIcon"
import { TWEET_CONSTANTS } from "../../constants"

// ============================================ Types ============================================

interface LikeBarProps {
    // 无 props，纯展示组件
}

// ============================================ LikeBar Component ============================================

/**
 * LikeBar - 点赞栏组件
 *
 * 特点：
 * - 宽度 100%，左边距自动（靠右对齐）
 * - 左侧显示 "来自 X" 文字和 Logo
 * - 右侧显示 "喜欢" 文字和心形图标（内置）
 *
 * 布局原理：
 * 1. 使用 marginLeft: auto 实现靠右对齐
 * 2. flexbox 布局，各元素水平排列
 * 3. 心形图标使用 SVG SMIL 动画实现点击效果
 */
const LikeBar = (props: LikeBarProps) => {
    const heartPath = "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"

    return (
        <section style={containerStyle}>
            {/* 来自 X */}
            <span style={textStyle}>来自</span>
            <XLogoIcon style={{ ...logoStyle, width: TWEET_CONSTANTS.LOGO_SIZE_SMALL, height: TWEET_CONSTANTS.LOGO_SIZE_SMALL }} />

            {/* 喜欢和心形图标 */}
            <span style={textStyle}>喜欢</span>
            <svg style={heartStyle} viewBox="0 0 24 24" aria-label="点赞">
                <g>
                    {/* 未点赞状态：空心心形 */}
                    <path fill="transparent" stroke={TWEET_CONSTANTS.COLOR_TEXT_TERTIARY} strokeWidth="1.5" d={heartPath}>
                        {/* 点击时隐藏空心，显示实心 */}
                        <animate
                            attributeName="opacity"
                            from="1"
                            to="0"
                            begin="click"
                            dur="0.2s"
                            fill="freeze"
                        />
                    </path>
                    {/* 已点赞状态：实心心形（初始隐藏） */}
                    <path fill={TWEET_CONSTANTS.COLOR_HEART} opacity="0" d={heartPath}>
                        {/* 点击时显示 */}
                        <animate
                            attributeName="opacity"
                            from="0"
                            to="1"
                            begin="click"
                            dur="0.2s"
                            fill="freeze"
                        />
                    </path>
                </g>
            </svg>
        </section>
    )
}

export default LikeBar

// ============================================ Styles ============================================

const containerStyle: CSSProperties = {
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    gap: `${TWEET_CONSTANTS.GAP_NORMAL}px`,
    width: "100%",
    padding: `${TWEET_CONSTANTS.LIKEBAR_PADDING}px`,
    marginLeft: "auto", // 靠右对齐
}

const logoStyle: CSSProperties = {
    display: "block",
    color: TWEET_CONSTANTS.COLOR_TEXT_TERTIARY,
    opacity: 0.6,
}

const textStyle: CSSProperties = {
    color: TWEET_CONSTANTS.COLOR_TEXT_TERTIARY,
    fontSize: "15px",
}

const heartStyle: CSSProperties = {
    width: `${TWEET_CONSTANTS.HEART_SIZE}px`,
    height: `${TWEET_CONSTANTS.HEART_SIZE}px`,
}

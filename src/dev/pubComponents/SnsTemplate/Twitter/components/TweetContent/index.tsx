import { isNil, isString } from "es-toolkit/predicate"
import { isArray } from "es-toolkit/compat"
import { CSSProperties } from "react"
import { TWEET_CONSTANTS, baseFlexStyle } from "../../constants"

// ============================================ TweetContent Component ============================================

/**
 * 检查文本是否需要高亮显示（以 * 开头）
 * @param text - 要检查的文本
 * @returns 是否需要高亮
 */
const shouldHighlight = (text: string): boolean => {
    const trimmed = text.trim()
    // 如果以 \* 开头，说明是转义的 *，不高亮
    if (trimmed.startsWith("\\*")) {
        return false
    }
    // 如果以 * 开头，需要高亮
    return trimmed.startsWith("*")
}

/**
 * 处理文本，去除转义符和高亮标记
 * @param text - 原始文本
 * @param isHighlight - 是否需要高亮
 * @returns 处理后的文本
 */
const processText = (text: string, isHighlight: boolean): string => {
    let processed = text.replace(/\\\*/g, "*")
    if (isHighlight) {
        // 去掉开头的 *（保留前导空格）
        const match = text.match(/^(\s*)(\*)/)
        if (match) {
            processed = match[1] + text.substring(match[0].length).replace(/^\*/, "")
        }
    }
    return processed
}

const TweetContent = (props: {
    text: (string | string[] | undefined | null)[]
}) => {
    return (
        <section style={wrapperStyle}>
            {props.text.map((line, lineIndex) => {
                // 如果是空段，那么就返回空段
                if (isNil(line)) return <section style={lineSectionStyle} key={lineIndex}>&nbsp;</section>

                // 如果只有一行纯文本，那么就按照普通的段落去渲染
                if (isString(line)) {
                    // 如果是空字符串，那么也是返回空段
                    if (line.trim() === "") {
                        return <section style={lineSectionStyle} key={lineIndex}>&nbsp;</section>
                    }

                    // 检查是否需要高亮
                    const isHighlight = shouldHighlight(line)
                    const processedText = processText(line, isHighlight)

                    return <section style={lineSectionStyle} key={lineIndex}>
                        <p style={isHighlight ? highlightParagraphStyle : paragraphStyle}>
                            {processedText}
                        </p>
                    </section>
                }

                // 如果这是一个数组，证明这是一个混合内容的段落
                if (isArray(line)) {
                    return <section style={lineSectionStyle} key={lineIndex}>
                        <p style={paragraphStyle}>
                            {line.map((part, partIndex) => {
                                const isHighlight = shouldHighlight(part)
                                const processedPart = processText(part, isHighlight)

                                if (isHighlight) {
                                    return <span key={partIndex} style={highlightStyle}>{processedPart}</span>
                                }
                                return processedPart
                            })}
                        </p>
                    </section>
                }
                return null
            })}
        </section>
    )
}

export default TweetContent

// ============================================ Styles ============================================

const wrapperStyle: CSSProperties = {
    ...baseFlexStyle,
    marginTop: TWEET_CONSTANTS.CONTENT_MARGIN_TOP,
}

const lineSectionStyle: CSSProperties = {
    ...baseFlexStyle,
    width: "100%",
}

const paragraphStyle: CSSProperties = {
    margin: 0,
    color: TWEET_CONSTANTS.COLOR_TEXT_PRIMARY,
    fontSize: `${TWEET_CONSTANTS.CONTENT_FONT_SIZE}px`,
    fontWeight: 400,
    lineHeight: `${TWEET_CONSTANTS.CONTENT_LINE_HEIGHT}px`,
    textAlign: "justify",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
}

/**
 * 高亮样式（用于话题标签和用户提及）
 * 颜色: Twitter 蓝色 rgb(29, 155, 240)
 */
const highlightStyle: CSSProperties = {
    color: TWEET_CONSTANTS.COLOR_LINK,
}

/**
 * 整段高亮的段落样式（合并段落样式和高亮样式）
 */
const highlightParagraphStyle: CSSProperties = {
    ...paragraphStyle,
    ...highlightStyle,
}


import { CSSProperties } from "react"

// ============================================ TweetMeta Component ============================================

interface TweetMetaProps {
    /** 时间文本，如 "上午11:43 · 2025年12月29日" */
    time: string
    /** 查看数，如 "9,352" */
    views?: string
}

/**
 * TweetMeta - Twitter 推文元信息组件
 *
 * 用于显示推文的时间和查看数，格式为 "时间 · 查看数"
 *
 * @example
 * <TweetMeta
 *   time="上午11:43 · 2025年12月29日"
 *   views="9,352"
 * />
 */
const TweetMeta = (props: TweetMetaProps) => {
    return (
        <section style={wrapperStyle}>
            <section style={innerStyle}>
                <span style={timeStyle}>{props.time}</span>
                {props.views && (
                    <>
                        <span style={separatorStyle}>·</span>
                        <span style={viewsStyle}>
                            <span style={viewsNumberStyle}>{props.views}</span> <span style={viewsTextStyle}>查看</span>
                        </span>
                    </>
                )}
            </section>
        </section>
    )
}

export default TweetMeta

// ============================================ Styles ============================================

const baseStyle: CSSProperties = {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    position: "relative",
    margin: 0,
    padding: 0,
    minWidth: 0,
    minHeight: 0,
    flexShrink: 0,
    listStyle: "none",
    textDecoration: "none",
    zIndex: 0,
}

const wrapperStyle: CSSProperties = {
    ...baseStyle,
    marginTop: 16,
}

const innerStyle: CSSProperties = {
    ...baseStyle,
    flexDirection: "row",
    alignItems: "baseline",
    flexWrap: "wrap",
}

const timeStyle: CSSProperties = {
    ...baseStyle,
    color: "rgb(83, 100, 113)",
    fontSize: 15,
    fontWeight: 400,
    lineHeight: "20px",
    display: "inline",
    whiteSpace: "pre-wrap",
}

const separatorStyle: CSSProperties = {
    ...baseStyle,
    color: "rgb(83, 100, 113)",
    fontSize: 15,
    fontWeight: 400,
    lineHeight: "20px",
    display: "inline",
    paddingLeft: 4,
    paddingRight: 4,
}

const viewsStyle: CSSProperties = {
    ...baseStyle,
    display: "inline",
    flexDirection: "row",
}

const viewsNumberStyle: CSSProperties = {
    ...baseStyle,
    color: "rgb(15, 20, 25)",
    fontSize: 14,
    fontWeight: 700,
    lineHeight: "16px",
    display: "inline",
}

const viewsTextStyle: CSSProperties = {
    ...baseStyle,
    color: "rgb(83, 100, 113)",
    fontSize: 14,
    fontWeight: 400,
    lineHeight: "16px",
    display: "inline",
}

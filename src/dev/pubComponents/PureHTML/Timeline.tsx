import { CSSProperties, ReactNode } from "react"
import { isNil } from "es-toolkit/predicate"
import { defaultTo } from "es-toolkit/compat"
import SectionEx from "@pub-html/basicEx/SectionEx"

// ============================================ 类型 ============================================

export interface TimelineItem {
    /** 该项的正文，完全由你自己实现（任意 JSX）。时间轴不干涉其内部布局。 */
    jsx: ReactNode
    /** 该项的圆点颜色；不填则 fallback 到 defaultDotColor */
    dotColor?: string
    /** 该项下方的连线颜色（连到下一个圆点）；不填则 fallback 到 defaultLineColor */
    lineColor?: string
    /** 该项的圆点直径 px；不填则 fallback 到 defaultDotSize */
    dotSize?: number
    /** 该项下方的连线宽度 px；不填则 fallback 到 defaultLineWidth */
    lineWidth?: number
    /** 自定义圆点：传入后替换默认圆点（整段 JSX，如带动画的 SVG）。与 dotSize/dotColor 互斥 */
    dotJsx?: ReactNode
}

export interface TimelineProps {
    /** 时间轴项：[{ jsx, dotColor?, lineColor?, dotSize?, lineWidth?, dotJsx? }] */
    childItem: TimelineItem[]

    /** 连线两端的纵向缝：上端（本圆点底部→连线）和下端（连线→下一个圆点顶部）各留 dotGap。默认 0 */
    dotGap?: number
    /** 圆点默认色；单项未传 dotColor 时用它。默认 #1A237E */
    defaultDotColor?: string
    /** 项与项的间距（视觉等同 margin-bottom；内部走 paddingBottom，好让连线桥接跨过去）。默认 20 */
    defaultItemGap?: number
    /** 圆点右边 DOM 的纵向微调，叠加在内部 -8 基线（把 15px/1.7 首行压到圆心）之上：正值下移、负值进一步上提。默认 0（即用 -8 基线） */
    defaultDotMarginTop?: number

    // ───── 以下为渲染必需、带默认值，通常不用动 ─────
    /** 导轨宽度（圆点居中的竖栏）。默认 16 */
    railWidth?: number
    /** 圆点默认直径 px；单项未传 dotSize 时用它。默认 9 */
    defaultDotSize?: number
    /** 连线默认宽度 px；单项未传 lineWidth 时用它。默认 2 */
    defaultLineWidth?: number
    /** 连线默认色；单项未传 lineColor 时用它。默认 #e5e5e5 */
    defaultLineColor?: string
    /**
     * 是否用 !important 锁定圆点 / 连线的尺寸与颜色，防止微信编辑器吞掉小元素。
     * 默认 true（用 SectionEx）；设为 false 时退化为纯 <section style>。
     */
    lock?: boolean
}

// ============================================ Timeline ============================================

/**
 * 竖向时间轴 —— 纯脚手架：圆点 + 连线 + 一个你自己塞 JSX 的槽。
 *
 * 不再干涉正文（无 title/desc/行高概念）：每项 childItem[i].jsx 原样渲染在圆点右侧，
 * 内部布局完全由你的 JSX 决定。圆点也可通过 dotJsx 整个替换（如带动画的 SVG）。
 *
 * 竖向连线原理：每项是一行（行间无 margin），行内左导轨 flex column，圆点贴行顶、连线在其下；
 * alignItems:"stretch" 让导轨被拉到与正文等高，连线 flex:1 填满圆点以下到行底。项间距 defaultItemGap
 * 走正文容器的 paddingBottom（视觉等同 margin-bottom），连线随之被拉长、桥接跨过去，尾端正好落在下一个圆点顶部。
 */
const Timeline = (props: TimelineProps) => {
    const {
        childItem = [],
        dotGap = 0,
        defaultDotColor = "#1A237E",
        defaultItemGap = 20,
        defaultDotMarginTop = 0,
        railWidth = 16,
        defaultDotSize = 9,
        defaultLineWidth = 2,
        defaultLineColor = "#e5e5e5",
        lock = true,
    } = props

    // 圆点贴行顶，正文需上提 8px 才能把 15px/1.7 的首行压到圆心；这 8px 是内部基线，
    // defaultDotMarginTop 在此基础上叠加（默认 0 = 用基线，正值下移、负值进一步上提）
    const contentMarginTop = -8 + defaultDotMarginTop

    return (
        <section style={listStyle}>
            {childItem.map((item, index) => {
                const isLast = index === childItem.length - 1
                const resolvedDotColor = defaultTo(item.dotColor, defaultDotColor)
                const resolvedLineColor = defaultTo(item.lineColor, defaultLineColor)
                const resolvedDotSize = defaultTo(item.dotSize, defaultDotSize)
                const resolvedLineWidth = defaultTo(item.lineWidth, defaultLineWidth)

                const dotStyle: CSSProperties = {
                    display: "block",
                    width: resolvedDotSize,
                    height: resolvedDotSize,
                    borderRadius: "50%",
                    backgroundColor: resolvedDotColor,
                    marginTop: 0, // 圆点贴行顶
                    flexShrink: 0,
                }
                const lineStyle: CSSProperties = {
                    display: "block",
                    flex: 1,
                    width: resolvedLineWidth,
                    minWidth: resolvedLineWidth,
                    backgroundColor: resolvedLineColor,
                    marginTop: dotGap, // 上端：本圆点底部 → 连线
                    marginBottom: dotGap, // 下端：连线 → 下一个圆点顶部
                }
                const itemStyle: CSSProperties = {
                    display: "flex",
                    alignItems: "stretch",
                }

                return (
                    <section style={itemStyle} key={index}>
                        {/* 导轨：圆点（或自定义 dotJsx）+ 连线，flex column，被 stretch 拉到与正文等高 */}
                        <section style={{ ...railStyle, width: railWidth }}>
                            {!isNil(item.dotJsx) ? (
                                <section style={customDotSlotStyle}>{item.dotJsx}</section>
                            ) : lock ? (
                                <SectionEx
                                    style={dotStyle}
                                    important={[
                                        ["width", `${resolvedDotSize}px`],
                                        ["height", `${resolvedDotSize}px`],
                                        ["background-color", resolvedDotColor],
                                    ]}
                                />
                            ) : (
                                <section style={dotStyle} />
                            )}
                            {!isLast &&
                                (lock ? (
                                    <SectionEx
                                        style={lineStyle}
                                        important={[
                                            ["width", `${resolvedLineWidth}px`],
                                            ["min-width", `${resolvedLineWidth}px`],
                                            ["flex", "1"],
                                            ["background-color", resolvedLineColor],
                                        ]}
                                    />
                                ) : (
                                    <section style={lineStyle} />
                                ))}
                        </section>

                        {/* 正文槽：你的 JSX 原样渲染。defaultDotMarginTop 统一上提/下移；
                            defaultItemGap 走 paddingBottom（视觉等同 margin-bottom，但这样连线才能桥接跨过去） */}
                        <section
                            style={{
                                flex: 1,
                                marginTop: contentMarginTop,
                                paddingBottom: isLast ? 0 : defaultItemGap,
                            }}
                        >
                            {item.jsx}
                        </section>
                    </section>
                )
            })}
        </section>
    )
}

export default Timeline

// ============================================ Styles ============================================

const listStyle: CSSProperties = {
    margin: "12px 0 24px 0",
}

const railStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flexShrink: 0,
}

const customDotSlotStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
}

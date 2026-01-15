import { isString } from "es-toolkit/predicate"
import { isArray } from "es-toolkit/compat"
import { ReactNode, isValidElement } from "react"

// ============================================ NoWrapText ============================================

/**
 * NoWrapText - 不换行文本组件
 *
 * 用于将文本列表渲染为多个不换行的词组。
 * 每个词组内部不会换行，但词组之间可以在屏幕较窄时自动换行。
 *
 * @example
 * // 基础用法
 * <NoWrapText textList={["微信公众号", "开发"]} />
 *
 * @example
 * // 带自定义样式
 * <NoWrapText textList={[
 *   "微信公众号",
 *   { text: "开发", style: { color: "red" } }
 * ]} />
 *
 * @param textList - 文本列表，可以是字符串数组或包含样式的对象数组
 */
const NoWrapText = (props: {
    textList: string[] | { text: string, style: React.CSSProperties }[] | ReactNode[]
}) => {
    if (!isArray(props.textList)) throw new Error("NoWrapText 组件的 textList 属性必须是数组")
    return props.textList.map((item, index) => {
        // 如果是 React 元素，直接返回
        if (isValidElement(item)) return item
        // 如果是字符串，渲染为不换行 span
        if (isString(item)) {
            return <span key={index} style={baseStyle}>{item}</span>
        } else {
            // 如果是带样式的对象，合并样式后渲染
            return <span key={index} style={{ ...baseStyle, ...item.style }}>{item.text}</span>
        }
    })
}

export default NoWrapText

// ============================================ Styles ============================================

/**
 * 基础样式 - 继承父元素字体大小和颜色，保持词组内部不换行
 */
const baseStyle: React.CSSProperties = {
    fontSize: "inherit",
    color: "inherit",
    whiteSpace: "nowrap"
}
import { isUndefined, isNumber } from "es-toolkit/predicate"
import { CSSProperties } from "react"

// ============================================ TextSpace ============================================

/**
 * TextSpace - 文字占位组件
 *
 * 用于在文本中插入空白占位符，保持行内元素特性。
 * 常用于对齐文本或预留空位。
 *
 * @example
 * // 基础用法 - 占位 2 个字符宽度
 * <TextSpace em={2} />
 *
 * @example
 * // 使用 rem 单位
 * <TextSpace rem={1} />
 *
 * @example
 * // 自定义宽度
 * <TextSpace width={100} />
 *
 * @param em - 占位宽度（em 单位，相对于当前字体大小）
 * @param rem - 占位宽度（rem 单位，相对于根元素字体大小）
 * @param width - 直接指定宽度（覆盖 em 和 rem）
 * @param display - 显示方式（默认 inline-block）
 */
const TextSpace = (props: {
    /** em 单位的宽度 */
    em?: number
    /** rem 单位的宽度 */
    rem?: number
    /** 自定义宽度 */
    width?: number | string
    /** 显示方式 */
    display?: CSSProperties["display"]
    style?: CSSProperties
}) => {
    const style: CSSProperties = {
        display: props.display || "inline-block",
        fontSize: "inherit",
        ...props.style
    }

    // 优先级：width > rem > em
    if (!isUndefined(props.width)) {
        style.width = isNumber(props.width) ? `${props.width}px` : props.width
    } else if (!isUndefined(props.rem)) {
        style.width = `${props.rem}rem`
    } else if (!isUndefined(props.em)) {
        style.width = `${props.em}em`
    } else {
        style.width = "1em" // 默认 1em
    }

    return <span style={style}>&nbsp;</span>
}

export default TextSpace

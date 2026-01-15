import { CSSProperties } from "react"
import { MOMENT_CONSTANTS, baseStyle } from "../../constants"
import { mpProps, mpGet } from "@dev/styles/funcs/mp"
import { defaultTo } from "es-toolkit/compat"

// ============================================ Types ============================================

interface MomentTimestampProps {
    /** 时间戳（Date 对象或字符串） */
    timestamp: Date | string
    /** margin/padding 快捷配置 */
    mp?: mpProps
}

// ============================================ MomentTimestamp Component ============================================

/**
 * MomentTimestamp - 朋友圈时间戳组件
 *
 * 特点：
 * - 灰色小字显示时间
 * - 自动格式化显示
 *
 * @example
 * <MomentTimestamp timestamp={new Date()} />
 * <MomentTimestamp timestamp="2小时前" />
 */
const MomentTimestamp = (props: MomentTimestampProps) => {
    const { timestamp, mp } = props

    const finalContainerStyle: CSSProperties = {
        ...timeContainerStyle,
        ...mpGet(mp),
    }

    return (
        <section style={finalContainerStyle}>
            <span style={timeStyle}>{String(timestamp)}</span>
        </section>
    )
}

export default MomentTimestamp

// ============================================ Styles ============================================

const timeContainerStyle: CSSProperties = {
    ...baseStyle,
    marginBottom: MOMENT_CONSTANTS.CONTENT_GAP,
}

const timeStyle: CSSProperties = {
    fontSize: MOMENT_CONSTANTS.FONT_SIZE_TIME,
    color: MOMENT_CONSTANTS.COLOR_TIME,
    display: "block",
}

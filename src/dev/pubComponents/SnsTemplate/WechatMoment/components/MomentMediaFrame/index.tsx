import { CSSProperties, ReactNode } from "react"
import { defaultTo } from "es-toolkit/compat"

// ============================================ Types ============================================

interface MomentMediaFrameProps {
    children: ReactNode
    /** 上边距，默认 12px */
    mt?: number
    /** 下边距，默认 12px */
    mb?: number
}

// ============================================ Constants ============================================

/**
 * MomentMediaFrame 组件常量配置
 *
 * 魔法数字说明：
 * - DEFAULT_MARGIN_TOP: 默认上边距
 * - DEFAULT_MARGIN_BOTTOM: 默认下边距
 */
const DEFAULT_MARGIN_TOP = 12 // 默认上边距（px）
const DEFAULT_MARGIN_BOTTOM = 12 // 默认下边距（px）

// ============================================ MomentMediaFrame Component ============================================

/**
 * MomentMediaFrame - 朋友圈媒体容器组件
 *
 * 用于盛放各种图片组件（MomentImg1、MomentImg2 等）
 * 宽度 100%，支持自定义上下边距
 *
 * @example
 * <MomentMediaFrame>
 *   <MomentImg1 url="https://example.com/image.jpg" />
 * </MomentMediaFrame>
 *
 * <MomentMediaFrame mt={20} mb={30}>
 *   <MomentImg2 pic1={{ url: pic1 }} pic2={{ url: pic2 }} />
 * </MomentMediaFrame>
 */
const MomentMediaFrame = (props: MomentMediaFrameProps) => {
    const { children } = props

    // 获取上边距，默认 DEFAULT_MARGIN_TOP
    const marginTop = defaultTo(props.mt, DEFAULT_MARGIN_TOP)

    // 获取下边距，默认 DEFAULT_MARGIN_BOTTOM
    const marginBottom = defaultTo(props.mb, DEFAULT_MARGIN_BOTTOM)

    // 容器样式
    const containerStyle: CSSProperties = {
        boxSizing: "border-box",
        display: "block",
        width: "100%",
        marginTop: marginTop,
        marginBottom: marginBottom,
    }

    return <section style={containerStyle}>{children}</section>
}

export default MomentMediaFrame

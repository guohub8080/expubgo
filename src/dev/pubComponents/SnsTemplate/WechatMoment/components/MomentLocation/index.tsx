import { CSSProperties } from "react"
import { MOMENT_CONSTANTS, baseStyle } from "../../constants"

// ============================================ Types ============================================

interface MomentLocationProps {
    /** 位置信息文本 */
    location: string
}

// ============================================ MomentLocation Component ============================================

/**
 * MomentLocation - 朋友圈位置信息组件
 *
 * 特点：
 * - 带定位图标的蓝色位置文字
 * - 点击链接样式
 *
 * @example
 * <MomentLocation location="北京市·朝阳区" />
 */
const MomentLocation = (props: MomentLocationProps) => {
    const { location } = props

    return (
        <section style={locationStyle}>
            <section style={locationIconContainerStyle}>
                <svg
                    style={locationIconStyle}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                        fill="currentColor"
                    />
                </svg>
            </section>
            <span style={locationTextStyle}>{location}</span>
        </section>
    )
}

export default MomentLocation

// ============================================ Styles ============================================

const locationStyle: CSSProperties = {
    ...baseStyle,
    display: "flex",
    alignItems: "center",
    marginBottom: MOMENT_CONSTANTS.CONTENT_GAP,
}

const locationIconContainerStyle: CSSProperties = {
    ...baseStyle,
    display: "flex",
    alignItems: "center",
    marginRight: 4,
}

const locationIconStyle: CSSProperties = {
    width: 14,
    height: 14,
    color: MOMENT_CONSTANTS.COLOR_LINK,
}

const locationTextStyle: CSSProperties = {
    fontSize: MOMENT_CONSTANTS.FONT_SIZE_LOCATION,
    color: MOMENT_CONSTANTS.COLOR_LINK,
}

import { CSSProperties } from "react"

/**
 * XLogoIcon - X (Twitter) Logo 图标组件
 *
 * 特点：
 * - 纯展示组件，可接收 style prop
 * - 使用 X 官方 Logo 路径
 * - 默认颜色为灰色，透明度 0.6
 */
interface XLogoIconProps {
    style?: CSSProperties
}

export default (props: XLogoIconProps) => {
    const { style } = props

    return (
        <svg style={style} viewBox="0 0 24 24" aria-hidden="true">
            <g>
                <path
                    fill="currentColor"
                    d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                />
            </g>
        </svg>
    )
}

import type { CSSProperties } from "react";
import SectionEx from "@pub-html/basicEx/SectionEx";
import SvgEx from "@pub-html/basicEx/SvgEx";
import { defaultTo } from "es-toolkit/compat";
import { mpBlank, mpGet, mpProps } from "@styles/funcs/mp";

/**
 * 占位组件
 * 
 * @description
 * 用于占位的SVG组件，可以是透明的或自定义颜色。
 * 
 * @example
 * ```tsx
 * // 基础用法（透明）
 * <PlaceHolder />
 * 
 * // 自定义颜色
 * <PlaceHolder color="#ffffff" />
 * 
 * // 自定义尺寸和颜色
 * <PlaceHolder viewBoxW={100} viewBoxH={100} color="#f0f0f0" />
 * 
 * // 带边距
 * <PlaceHolder color="#ffffff" mp={{ mt: 10, mb: 10 }} />
 * ```
 * 
 * @param props - 组件属性
 * @param props.viewBoxW - viewBox 宽度，默认 0
 * @param props.viewBoxH - viewBox 高度，默认 0
 * @param props.color - 填充颜色（如 "#ffffff"），不传则透明
 * @param props.mp - 边距配置（marginTop, marginBottom, marginLeft, marginRight）
 * 
 * @returns React 组件
 */
const PlaceHolder = (props: {
    viewBoxW?: number
    viewBoxH?: number
    mp?: mpProps
    color?: string
}) => {
    const viewBoxW = defaultTo(props.viewBoxW, 0);
    const viewBoxH = defaultTo(props.viewBoxH, 0);
    const mpResult = mpGet(defaultTo(props.mp, mpBlank));
    const dataLabel = props.color ? "placeholder-fill-color" : "placeholder-transparent";

    return (
        <SectionEx data-label={dataLabel} style={{ ...rootSectionStyle, ...mpResult }}>
            <SvgEx
                style={svgStyle}
                viewBox={`0 0 ${viewBoxW} ${viewBoxH}`}
            >
                {props.color && (
                    <rect width="100%" height="100%" fill={props.color} />
                )}
            </SvgEx>
        </SectionEx>
    );
};

export default PlaceHolder;

/** ================================================== Style ===================================================== */
const rootSectionStyle: CSSProperties = {
    WebkitTouchCallout: "none",
    userSelect: "text",
    overflow: "hidden",
    textAlign: "center",
    lineHeight: 0
};

const svgStyle: CSSProperties = {
    display: "block",
    transform: "scale(1)",
    pointerEvents: "none"
};

import type { CSSProperties } from 'react';
import SectionEx from "@pub-html/basicEx/SectionEx";
import SvgEx from "@pub-html/basicEx/SvgEx";
import { defaultTo } from "es-toolkit/compat";
import { mpBlank, mpGet, mpProps } from "@styles/funcs/mp";
import svgURL from "@pub-utils/common/svgURL";


const ZeroHeightImg = (props: {
    url: string,
    mp?: mpProps
    isForcePriority?: boolean
}) => {
    const isForcePriority = defaultTo(props.isForcePriority, false)
    const mpResult = mpGet(defaultTo(props.mp, mpBlank))

    const svgStyle: CSSProperties = {
        backgroundImage: svgURL(props.url),
        backgroundSize: '100%',
        backgroundRepeat: 'no-repeat',
        display: 'block',
    }

    // 开启了强制优先
    if (isForcePriority) {
        const innerForcedStyle: CSSProperties = {
            ...innerStyle,
            transform: 'scale(1)'
        }
        return (
            <SectionEx data-label="zero-height-img" style={{ ...mpResult, ...outerStyle }}>
                <section
                    style={innerForcedStyle}
                >
                    <SvgEx style={svgStyle} viewBox="0 0 0 0" />
                </section>
            </SectionEx>
        )
    }

    //未开启强制优先
    return (
        <SectionEx data-label="zero-height-img" style={{ ...mpResult, ...outerStyle }}>
            <section
                style={innerStyle}
            >
                <SvgEx style={svgStyle} viewBox="0 0 0 0" />
            </section>
        </SectionEx>
    )
}

export default ZeroHeightImg




/**  ================================================== Style ===================================================== */
const outerStyle: CSSProperties = {
    WebkitTouchCallout: 'none',
    userSelect: 'text',
    overflow: 'hidden',
    textAlign: 'center',
    lineHeight: 0,
}

const innerStyle: CSSProperties = {
    textAlign: 'center',
    height: 0,
    lineHeight: 0,
    width: '100%',
    margin: '0 auto',
    marginTop: 0,
}

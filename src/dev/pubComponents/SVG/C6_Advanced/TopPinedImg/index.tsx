/* eslint-disable no-mixed-spaces-and-tabs */
import { CSSProperties } from "react";
import { random, defaultTo } from "es-toolkit/compat"
import SectionEx from "@pub-html/basicEx/SectionEx";
import SvgEx from "@pub-html/basicEx/SvgEx";
import { mpBlank, mpGet, mpProps } from "@styles/funcs/mp";
import svgURL from "@pub-utils/common/svgURL";
import getWechat300x500 from "@api/placeHolderPic/getWechat300x500";
import getImgSizeByDefault from "@pub-utils/common/getImgSizeByDefault";

/**
 * 置顶图片组件
 * 用于显示置顶的图片内容
 */
const TopPinedImg = (props: {
    url?: string
    viewBoxW?: number
    viewBoxH?: number
    mp?: mpProps
}) => {
    const url = defaultTo(props.url, getWechat300x500(random(1, 9)))
    const imgSize = getImgSizeByDefault(url, props.viewBoxW, props.viewBoxH)
    const mpResult = mpGet(defaultTo(props.mp, mpBlank))

    const rootStyle: CSSProperties = {
        ...rootBaseStyle,
        ...mpResult
    };

    const svgStyle: CSSProperties = {
        ...svgBaseStyle,
        backgroundImage: svgURL(url)
    };

    return (
        <SectionEx data-label="top-pined-img" style={rootStyle}>
            <SvgEx
                style={svgStyle}
                viewBox={`0 0 ${imgSize.w} ${imgSize.h}`}
            />
        </SectionEx>
    );
};

export default TopPinedImg;


/** ================================================== Styles ===================================================== */
const rootBaseStyle: CSSProperties = {
    WebkitTouchCallout: "none",
    userSelect: "text",
    overflow: "hidden",
    textAlign: "center",
    lineHeight: 0,
};

const svgBaseStyle: CSSProperties = {
    transform: "scale(1)",
    isolation: "isolate",
    backgroundSize: "100%",
    backgroundRepeat: "no-repeat",
    display: "inline",
    lineHeight: 0,
    margin: 0, // 已修改为 margin: 0
};


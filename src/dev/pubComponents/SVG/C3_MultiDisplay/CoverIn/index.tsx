/* eslint-disable no-mixed-spaces-and-tabs */
import { CSSProperties, useMemo } from "react";
import SectionEx from "@pub-html/basicEx/SectionEx";
import SvgEx from "@pub-html/basicEx/SvgEx";
import { defaultTo } from "es-toolkit/compat";
import { mpBlank, mpGet, mpProps } from "@styles/funcs/mp";
import getImgSizeByDefault from "@pub-utils/common/getImgSizeByDefault";
import InitialStaticPic from "./components/InitialStaticPic";
import SlidePic from "./components/SlidePic";
import { PicConfig } from "./types";
import { normalizePics } from "./config/normalizer";
import { createAnimationGroups } from "./grouping/animationGrouper";
import { calculateDurations } from "./timeline/sequenceCalculator";

/**
 * 层层覆盖组件（CoverIn）
 * 多张图片依次滑入覆盖，形成层层刷新的效果
 */
const CoverIn = (props: {
    pics?: PicConfig[]
    viewBoxW?: number
    viewBoxH?: number
    mp?: mpProps
}) => {
    const mpResult = mpGet(defaultTo(props.mp, mpBlank));

    // 使用工具函数标准化图片配置
    const pics = useMemo(() => normalizePics(props.pics), [props.pics]);

    // 使用工具函数创建动画分组
    const renderPics = useMemo(() => createAnimationGroups(pics), [pics]);

    // 使用工具函数计算时长
    const durations = useMemo(() => calculateDurations(renderPics), [renderPics]);

    // 获取统一的 viewBox 尺寸（基于第一张图）
    const imgSize = getImgSizeByDefault(pics[0].url, props.viewBoxW, props.viewBoxH);

    const rootStyle: CSSProperties = {
        ...rootBaseStyle,
        ...mpResult
    };

    return (
        <SectionEx data-label="cover-in" style={rootStyle}>
            <section style={innerStyle}>
                <SvgEx
                    viewBox={`0 0 ${imgSize.w} ${imgSize.h}`}
                    style={svgStyle}
                    width="100%"
                >
                    {/* ========== 第一组动画（一次性）========== */}
                    {/* 初始静止图，在图1的stayDuration结束后开始淡出 */}
                    <InitialStaticPic
                        viewBoxW={imgSize.w}
                        viewBoxH={imgSize.h}
                        url={renderPics.initialStatic.url}
                        duration={durations.firstRoundDuration}
                        stayDuration={renderPics.initialStatic.stayDuration}
                    />

                    {/* 第一轮滑入序列（图2、图3、图4），一次性，从图1的stayDuration后开始 */}
                    {renderPics.firstRoundSlides.map((pic, index) => (
                        <SlidePic
                            key={`first-${index}`}
                            viewBoxW={imgSize.w}
                            viewBoxH={imgSize.h}
                            url={pic.url}
                            direction={pic.direction}
                            duration={durations.firstRoundDuration}
                            animationMode="once"
                            keySplines={pic.keySplines}
                            slideIndex={index}
                            allSlides={renderPics.firstRoundSlides}
                            timeOffset={renderPics.initialStatic.stayDuration}
                        />
                    ))}

                    {/* ========== 第二组动画（循环）========== */}
                    {/* 循环滑入序列（图1、图2、图3、图4），无限循环 */}
                    {renderPics.loopSlides.map((pic, index) => (
                        <SlidePic
                            key={`loop-${index}`}
                            viewBoxW={imgSize.w}
                            viewBoxH={imgSize.h}
                            url={pic.url}
                            direction={pic.direction}
                            duration={durations.loopDuration}
                            animationMode="loop"
                            keySplines={pic.keySplines}
                            slideIndex={index}
                            allSlides={renderPics.loopSlides}
                            firstRoundDuration={durations.firstRoundDuration}
                        />
                    ))}
                </SvgEx>
            </section>
        </SectionEx>
    );
};

export default CoverIn;


/** ================================================== Styles ===================================================== */
const rootBaseStyle: CSSProperties = {
    WebkitTouchCallout: "none",
    userSelect: "text",
    overflow: "hidden",
    textAlign: "center",
    lineHeight: 0,
};

const innerStyle: CSSProperties = {
    overflow: "hidden",
    lineHeight: 0,
    margin: 0,
};

const svgStyle: CSSProperties = {
    display: "block",
    margin: "0 auto",
};

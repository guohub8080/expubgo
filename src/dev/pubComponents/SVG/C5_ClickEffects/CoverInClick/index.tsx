/* eslint-disable no-mixed-spaces-and-tabs */
import { CSSProperties, useMemo } from "react";
import SectionEx from "@pub-html/basicEx/SectionEx";
import { defaultTo } from "es-toolkit/compat";
import svgURL from "@pub-utils/common/svgURL";
import getImgSizeByDefault from "@pub-utils/common/getImgSizeByDefault";
import { mpBlank, mpGet, mpProps } from "@styles/funcs/mp";

type Direction = "T" | "B" | "L" | "R";

const DEFAULT_SPLINE = "0.8 0 0.2 1";

const CoverInClick = (props: {
    pics?: {
        url: string
        switchDuration?: number
        keySplines?: string
        direction?: "T" | "B" | "L" | "R"
        hotArea?: {
            x: number
            y: number
            w: number
            h: number
        }
    }[];
    viewBoxW?: number;
    viewBoxH?: number;
    mp?: mpProps;
}) => {
    const pics = defaultTo(props.pics, []);
    const mpResult = mpGet(defaultTo(props.mp, mpBlank));

    // 以第一张图估算 viewBox，若未提供尺寸
    const firstUrl = pics[0]?.url;
    const imgSizeAsViewBox = getImgSizeByDefault(firstUrl, props.viewBoxW, props.viewBoxH);

    // 统一的容器样式
    const rootStyle: CSSProperties = {
        WebkitTouchCallout: "none",
        userSelect: "text",
        overflow: "hidden",
        textAlign: "center",
        lineHeight: 0,
        ...mpResult,
    };

    // 预计算每张图的动画参数（initialX/Y、values、keySplines、dur）
    const slideParams = useMemo(() => {
        const params = pics.map((pic) => {
            const url = pic.url;
            const duration = defaultTo(pic.switchDuration, 0.5);
            const direction = defaultTo(pic.direction, "B" as Direction);
            const keySplines = defaultTo(pic.keySplines, DEFAULT_SPLINE);

            // 根据方向计算：初始位置（在屏外）与滑入位移
            let translateOffset: string;
            let initialX = 0;
            let initialY = 0;
            switch (direction) {
                case "T": // 从下往上进入（初始在屏下）
                    initialY = imgSizeAsViewBox.h + 1;
                    translateOffset = `0 ${-(imgSizeAsViewBox.h + 1)}`;
                    break;
                case "B": // 从上往下进入（初始在屏上）
                    initialY = -(imgSizeAsViewBox.h + 1);
                    translateOffset = `0 ${imgSizeAsViewBox.h + 1}`;
                    break;
                case "L": // 从右往左进入（初始在屏右）
                    initialX = imgSizeAsViewBox.w + 1;
                    translateOffset = `${-(imgSizeAsViewBox.w + 1)} 0`;
                    break;
                case "R": // 从左往右进入（初始在屏左）
                    initialX = -(imgSizeAsViewBox.w + 1);
                    translateOffset = `${imgSizeAsViewBox.w + 1} 0`;
                    break;
            }

            // values：从初始位置滑入到目标位置
            const values = `0 0; ${translateOffset}`;

            return { url, duration, values, keySplines, initialX, initialY, hotArea: pic.hotArea };
        });
        return params;
    }, [pics, imgSizeAsViewBox.w, imgSizeAsViewBox.h]);

    return (
        <SectionEx style={rootStyle}>
            <SectionEx style={{ display: "inline-block", width: "100%", lineHeight: 0 }}>
                {/* 背景层：以第一张图作为背景，便于点击前有画面可见 */}
                {firstUrl && (
                    <svg
                        viewBox={`0 0 ${imgSizeAsViewBox.w} ${imgSizeAsViewBox.h}`}
                        style={{
                            backgroundImage: svgURL(firstUrl),
                            backgroundRepeat: "no-repeat",
                            display: "block",
                            backgroundSize: "100%",
                        }}
                        width="100%"
                    />
                )}

                {/* 叠层：每张图一个可点击的独立层（不使用 id），各自 begin="click" */}
                <SectionEx style={{ height: "0px" }}>
                    {slideParams.map((p, idx) => (
                        <svg
                            key={idx}
                            x={p.initialX}
                            y={p.initialY}
                            viewBox={`0 0 ${imgSizeAsViewBox.w} ${imgSizeAsViewBox.h}`}
                            width="100%"
                            style={{
                                backgroundImage: svgURL(p.url),
                                backgroundRepeat: "no-repeat",
                                display: "block",
                                backgroundSize: "100%",
                            }}
                        >
                            {/* 自定义热区（矩形），不使用 id，点击冒泡到 svg 本身，触发 begin="click" */}
                            <rect
                                x={defaultTo(p.hotArea?.x, 0)}
                                y={defaultTo(p.hotArea?.y, 0)}
                                width={defaultTo(p.hotArea?.w, imgSizeAsViewBox.w)}
                                height={defaultTo(p.hotArea?.h, imgSizeAsViewBox.h)}
                                style={{ opacity: 0.001, pointerEvents: "visiblePainted" }}
                            />

                            {/* 点击后：该层从屏外滑入并保持 */}
                            <animateTransform
                                attributeName="transform"
                                type="translate"
                                values={p.values}
                                begin="click"
                                dur={`${p.duration}s`}
                                calcMode="spline"
                                keySplines={p.keySplines}
                                fill="freeze"
                            />
                        </svg>
                    ))}
                </SectionEx>
            </SectionEx>
        </SectionEx>
    );
};

export default CoverInClick;



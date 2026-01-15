/* eslint-disable no-mixed-spaces-and-tabs */
import { CSSProperties, useMemo } from "react";
import SectionEx from "@pub-html/basicEx/SectionEx";
import SvgEx from "@pub-html/basicEx/SvgEx";
import svgURL from "@pub-utils/common/svgURL";
import { rootBaseStyle, itemBaseStyle } from "../styles";
import type { TouchSnapSlideXProps } from "../types";

/**
 * TouchSnapSlideX - 水平吸附滑动组件
 *
 * 特性：
 * - 支持左右滑动吸附
 * - 支持反向滑动 (isReverse: true)
 * - 使用 CSS scroll-snap 实现吸附效果
 * - scrollSnapType: x mandatory - 强制水平吸附
 */
const TouchSnapSlideX = (props: TouchSnapSlideXProps) => {
	// 计算容器宽度百分比
	const containerWidthPercent = useMemo(() => Math.max(1, props.pics.length) * 100, [props.pics.length]);

	// 根容器样式：合并基础样式和 mp 样式
	const rootStyle: CSSProperties = {
		...rootBaseStyle,
		...props.mpResult
	};

	// 视口样式：通过 direction 控制滑动方向
	const viewportStyle: CSSProperties = {
		...viewportBaseStyle,
		direction: (props.isReverse ? "rtl" : "ltr") as unknown as CSSProperties["direction"]
	};

	return (
		<SectionEx style={rootStyle} data-label={props.isReverse ? "snap-slide-horizontal-reverse" : "snap-slide-horizontal"}>
			<SectionEx style={viewportStyle}>
				<SectionEx style={trackStyle} important={[["width", `${containerWidthPercent}%`], ["max-width", `${containerWidthPercent}%`]]}>
					{props.pics.map((pic, idx) => {
						// 单个图片样式：设置吸附位置和边距
						const itemStyle: CSSProperties = {
							...itemBaseStyle,
							scrollSnapAlign: props.snap,
							marginTop: pic.mt,
							marginBottom: pic.mb,
							marginLeft: pic.ml,
							marginRight: pic.mr
						};
						// SVG 背景图样式
						const svgStyle: CSSProperties = {
							backgroundImage: svgURL(pic.url),
							backgroundSize: "cover",
							backgroundRepeat: "no-repeat",
							display: "inline",
							lineHeight: 0,
							width: "100%"
						};
						return (
							<SectionEx key={idx} style={itemStyle}>
								<SvgEx
									style={svgStyle}
									viewBox={`0 0 ${props.viewBoxW} ${props.viewBoxH}`}
								/>
							</SectionEx>
						);
					})}
				</SectionEx>
			</SectionEx>
		</SectionEx>
	);
}

export default TouchSnapSlideX;

// ============================================ Styles ============================================

/**
 * 视口基础样式
 * - overflowX: scroll - 显示横向滚动条
 * - scrollSnapType: x mandatory - 强制水平吸附
 * - scrollBehavior: smooth - 平滑滚动
 * - isolation: isolate - 创建新的堆叠上下文
 */
const viewportBaseStyle: CSSProperties = {
	overflowX: "scroll",
	overflowY: "hidden",
	isolation: "isolate" as any,
	scrollSnapType: "x mandatory" as any,
	scrollBehavior: "smooth" as any,
	lineHeight: 0
};

/**
 * 轨道基础样式
 * - whiteSpace: nowrap - 防止换行
 * - display: flex - flex 布局
 */
const trackStyle: CSSProperties = {
	whiteSpace: "nowrap" as any,
	display: "flex",
	lineHeight: 0
};

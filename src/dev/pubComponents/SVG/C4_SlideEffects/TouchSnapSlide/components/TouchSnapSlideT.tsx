/* eslint-disable no-mixed-spaces-and-tabs */
import { CSSProperties } from "react";
import SectionEx from "@pub-html/basicEx/SectionEx";
import SvgEx from "@pub-html/basicEx/SvgEx";
import svgURL from "@pub-utils/common/svgURL";
import { rootBaseStyle, itemBlockStyle } from "../styles";
import type { TouchSnapSlideTProps } from "../types";

/**
 * TouchSnapSlideT - 垂直吸附滑动组件
 *
 * 特性：
 * - 垂直方向吸附滑动（从上往下）
 * - 使用 CSS scroll-snap 实现吸附效果
 * - scrollSnapType: y mandatory - 强制垂直吸附
 */
const TouchSnapSlideT = (props: TouchSnapSlideTProps) => {
	// 根容器样式：合并基础样式和 mp 样式
	const rootStyle: CSSProperties = {
		...rootBaseStyle,
		...props.mpResult
	};

	// 垂直容器样式：使用 aspectRatio 保持比例
	const verticalBoxStyle: CSSProperties = {
		width: "100%",
		aspectRatio: `${props.viewBoxW}/${props.viewBoxH}`,
		overflow: "hidden",
		lineHeight: 0
	};

	return (
		<SectionEx style={rootStyle} data-label="snap-slide-vertical">
			<SectionEx style={verticalBoxStyle}>
				<SectionEx style={viewportBaseStyle} important={[["scroll-snap-type", "y mandatory"], ["overflow-y", "scroll"], ["height", "100%"]]}>
					{props.pics.map((pic, idx) => {
						// 单个图片样式
						const itemStyle: CSSProperties = {
							...itemBlockStyle,
							scrollSnapAlign: props.snap
						};
						// SVG 背景图样式
						const svgStyle: CSSProperties = {
							backgroundImage: svgURL(pic.url),
							backgroundSize: "cover",
							backgroundRepeat: "no-repeat",
							display: "block",
							lineHeight: 0,
							width: "100%",
							height: "100%",
							marginTop: pic.mt,
							marginBottom: pic.mb,
							marginLeft: pic.ml,
							marginRight: pic.mr
						};
						return (
							<SectionEx key={idx} style={itemStyle} important={[["scroll-snap-align", props.snap], ["height", "100%"]]}>
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

export default TouchSnapSlideT;

// ============================================ Styles ============================================

/**
 * 视口基础样式
 * - overflowY: scroll - 显示纵向滚动条
 * - scrollSnapType: y mandatory - 强制垂直吸附
 * - scrollBehavior: smooth - 平滑滚动
 */
const viewportBaseStyle: CSSProperties = {
	overflowY: "scroll",
	overflowX: "hidden",
	scrollSnapType: "y mandatory" as any,
	scrollBehavior: "smooth" as any,
	width: "100%",
	height: "100%",
	lineHeight: 0
};

/* eslint-disable no-mixed-spaces-and-tabs */
import { CSSProperties } from "react";
import SectionEx from "@pub-html/basicEx/SectionEx";
import SvgEx from "@pub-html/basicEx/SvgEx";
import svgURL from "@pub-utils/common/svgURL";
import SeamlessImg from "@pub-svg/C1_Standard/SeamlessImg";
import { rootBaseStyle, itemBaseStyle } from "../styles";
import type { TouchSlideXProps } from "../types";

/**
 * TouchSlideX - 水平滑动组件
 *
 * 特性：
 * - 支持左右滑动
 * - 支持反向滑动 (isReverse: true)
 * - 使用 flex 布局实现水平排列
 * - 支持无缝图 (isTouchable: true)
 */
const TouchSlideX = (props: TouchSlideXProps) => {
	const pics = props.pics;
	const slideCount = Math.max(1, pics.length);
	const slideWidthPercent = slideCount * 100;

	// 根容器样式：合并基础样式和 mp 样式
	const rootStyle: CSSProperties = {
		...rootBaseStyle,
		...props.mpResult
	};

	// 视口样式：通过 direction 控制滑动方向
	const viewportStyle: CSSProperties = {
		...viewportBaseStyle,
		direction: props.isReverse ? "rtl" : "ltr"
	};

	// 轨道样式：宽度为图片数量的 100%
	const trackStyle: CSSProperties = {
		...trackBaseStyle,
		flex: `0 0 ${slideWidthPercent}%`,
		maxWidth: `${slideWidthPercent}%`
	};

	// 单个图片样式：宽度平均分配
	const itemStyle: CSSProperties = {
		...itemBaseStyle,
		flex: `0 0 ${100 / slideCount}%`
	};

	return (
		<SectionEx style={rootStyle} data-label={props.isReverse ? "touch-slide-horizontal-reverse" : "touch-slide-horizontal"}>
			<SectionEx style={viewportStyle}>
				<SectionEx style={trackStyle} important={[["width", `${slideWidthPercent}%`], ["max-width", `${slideWidthPercent}%`]]}>
					{pics.map((x, i) => {
						// SVG 背景图样式
						const svgStyle: CSSProperties = {
							backgroundImage: svgURL(x.url),
							backgroundSize: "cover",
							backgroundRepeat: "no-repeat",
							display: "inline",
							lineHeight: 0,
							marginTop: x.mt,
							marginBottom: x.mb,
							marginLeft: x.ml,
							marginRight: x.mr,
						};
						return (
							<SectionEx key={i} style={itemStyle}>
								{x.isTouchable ? (
									// 可触摸版本：使用 SeamlessImg 组件
									<SeamlessImg url={x.url} mp={{
										mt: x.mt,
										mb: x.mb,
										ml: x.ml,
										mr: x.mr
									}} />
								) : (
									// 普通版本：使用 SVG 背景
									<SvgEx
										viewBox={`0 0 ${props.viewBoxW} ${props.viewBoxH}`}
										style={svgStyle}
										width="100%"
										preserveAspectRatio="xMinYMin meet"
									/>
								)}
							</SectionEx>
						);
					})}
				</SectionEx>
			</SectionEx>
		</SectionEx>
	);
}

export default TouchSlideX;

// ============================================ Styles ============================================

/**
 * 视口基础样式
 * - overflow: scroll hidden - 显示横向滚动条，隐藏纵向滚动条
 * - pointerEvents: painted - 只在绘制区域响应指针事件
 * - WebkitOverflowScrolling: touch - iOS 平滑滚动
 */
const viewportBaseStyle: CSSProperties = {
	width: "100%",
	display: "block",
	verticalAlign: "top",
	overflow: "scroll hidden",
	boxSizing: "border-box",
	pointerEvents: "painted" as unknown as CSSProperties["pointerEvents"],
	WebkitOverflowScrolling: "touch",
	marginTop: 1,
	lineHeight: 0
};

/**
 * 轨道基础样式
 * - flex 布局实现水平排列
 * - whiteSpace: nowrap 防止换行
 */
const trackBaseStyle: CSSProperties = {
	display: "flex",
	flexDirection: "row",
	overflow: "hidden",
	boxSizing: "border-box",
	whiteSpace: "nowrap",
	lineHeight: 0
};

/* eslint-disable no-mixed-spaces-and-tabs */
import { CSSProperties } from "react";
import SectionEx from "@pub-html/basicEx/SectionEx";
import SvgEx from "@pub-html/basicEx/SvgEx";
import svgURL from "@pub-utils/common/svgURL";
import SeamlessImg from "@pub-svg/C1_Standard/SeamlessImg";
import { rootBaseStyle, itemBaseStyle } from "../styles";
import type { TouchSlideBProps } from "../types";

/**
 * TouchSlideB - 垂直反向滑动组件
 *
 * 特性：
 * - 垂直方向滑动（从下往上）
 * - 使用 rotate(180deg) 实现反向效果
 * - 外层容器旋转 180°，内层元素再旋转回来
 * - 最后一张图片使用 backgroundSize: 100% auto 确保完整显示
 */
const TouchSlideB = (props: TouchSlideBProps) => {
	const pics = props.pics;

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

	// 视口样式：旋转 180° 实现反向
	const viewportStyle: CSSProperties = {
		...viewportBaseStyle,
		transform: "rotate(180deg)",
		transformOrigin: "center center"
	};

	// 单个图片样式：旋转回来抵消外层旋转
	const itemStyle: CSSProperties = {
		...itemBaseStyle,
		height: "100%",
		transform: "rotate(180deg)",
		transformOrigin: "center center"
	};

	return (
		<SectionEx style={rootStyle} data-label="touch-slide-vertical-reverse">
			<SectionEx style={verticalBoxStyle}>
				<section style={viewportStyle as any}>
					<SectionEx style={trackStyle}>
						{pics.map((x, i) => {
							const isLast = i === pics.length - 1;
							// SVG 背景图样式
							const svgStyle: CSSProperties = {
								backgroundImage: svgURL(x.url),
								// 最后一张图片使用 100% auto 确保完整显示
								backgroundSize: (isLast ? "100% auto" : "100%") as any,
								backgroundRepeat: "no-repeat",
								display: "block",
								lineHeight: 0,
								transform: "scale(1)",
								marginTop: x.mt,
								marginBottom: x.mb,
								marginLeft: x.ml,
								marginRight: x.mr,
								height: "100%"
							};
							return (
								<SectionEx key={i} style={itemStyle}>
									{x.isTouchable ? (
										// 可触摸版本：使用 SeamlessImg 组件
										<SeamlessImg url={x.url}
											mp={{
												mt: x.mt,
												mb: x.mb,
												ml: x.ml,
												mr: x.mr
											}}
										/>
									) : (
										// 普通版本：使用 SVG 背景
										<SvgEx viewBox={`0 0 ${props.viewBoxW} ${props.viewBoxH}`}
											style={svgStyle}
											width="100%"
											preserveAspectRatio="xMinYMin meet"
										/>
									)}
								</SectionEx>
							);
						})}
					</SectionEx>
				</section>
			</SectionEx>
		</SectionEx>
	);
}

export default TouchSlideB;

// ============================================ Styles ============================================

/**
 * 视口基础样式
 * - overflow: overlay - 使用原生滚动
 * - WebkitOverflowScrolling: touch - iOS 平滑滚动
 */
const viewportBaseStyle: CSSProperties = {
	lineHeight: 0,
	margin: 0,
	overflow: "overlay",
	width: "100%",
	height: "100%",
	visibility: "visible",
	marginTop: 0,
	WebkitOverflowScrolling: "touch"
};

/**
 * 轨道基础样式
 * - display: block - 垂直堆叠
 * - whiteSpace: normal - 允许正常换行
 */
const trackStyle: CSSProperties = {
	display: "block",
	boxSizing: "border-box",
	width: "100%",
	overflow: "hidden",
	whiteSpace: "normal"
};

/* eslint-disable no-mixed-spaces-and-tabs */
import { CSSProperties } from "react";
import SectionEx from "@pub-html/basicEx/SectionEx";
import SvgEx from "@pub-html/basicEx/SvgEx";
import svgURL from "@pub-utils/common/svgURL";
import SeamlessImg from "@pub-svg/C1_Standard/SeamlessImg";
import { rootBaseStyle, itemBaseStyle, viewportBaseStyle, trackStyle } from "../styles";
import type { TouchSlideTProps } from "../types";

/**
 * TouchSlideT - 垂直滑动组件
 *
 * 特性：
 * - 垂直方向滑动（从上往下）
 * - 使用原生 overflow: overlay 滚动
 * - 第一张图片使用 backgroundSize: 100% auto 确保完整显示
 */
const TouchSlideT = (props: TouchSlideTProps) => {
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

	// 单个图片样式：占满高度
	const itemStyle: CSSProperties = {
		...itemBaseStyle,
		height: "100%"
	};

	return (
		<SectionEx style={rootStyle} data-label="touch-slide-vertical">
			<SectionEx style={verticalBoxStyle}>
				<SectionEx style={viewportBaseStyle}>
					<SectionEx style={trackStyle}>
						{pics.map((x, i) => {
							const isFirst = i === 0;
							// SVG 背景图样式
							const svgStyle: CSSProperties = {
								backgroundImage: svgURL(x.url),
								// 第一张图片使用 100% auto 确保完整显示
								backgroundSize: (isFirst ? "100% auto" : "100%") as any,
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
		</SectionEx>
	);
}

export default TouchSlideT;

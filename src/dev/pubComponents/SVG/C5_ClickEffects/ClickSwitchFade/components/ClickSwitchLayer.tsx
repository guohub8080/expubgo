/* eslint-disable no-mixed-spaces-and-tabs */
import { CSSProperties } from "react";
import { max, defaultTo } from "es-toolkit/compat";
import SectionEx from "@pub-html/basicEx/SectionEx";
import SvgEx from "@pub-html/basicEx/SvgEx";
import svgURL from "@pub-utils/common/svgURL";
import type { HotAreaConfig } from "@pub-utils/svgHotArea";
import type { ClickSwitchLayerProps } from "../types";

/**
 * ClickSwitchLayer - 点击切换的单个图层
 *
 * 点击后淡出，显示下一层内容。
 *
 * 工作原理：
 * 1. 热区矩形 (pointerEvents: painted) 接收点击事件
 * 2. 点击后触发两个动画：
 *    - SVG opacity: 1 → 0 (淡出)
 *    - rect x: 原位置 → 远离视野 (防止重复点击)
 * 3. 点击后立即隐藏热区 visibility: hidden
 *
 * @param viewBoxW - ViewBox 宽度
 * @param viewBoxH - ViewBox 高度
 * @param url - 图片 URL
 * @param duration - 淡出动画时长
 * @param keySplines - 贝塞尔曲线参数
 * @param hotArea - 热区配置
 * @param hasAnimation - 是否有淡出动画（最底层图片不需要动画）
 */
const ClickSwitchLayer = (props: ClickSwitchLayerProps) => {
	// 计算热区移出视野的距离（使用最大维度的 50 倍）
	const maxDimension = defaultTo(max([props.viewBoxW, props.viewBoxH]), props.viewBoxW)
	const outOfView = maxDimension * 50

	// 解构热区参数，设置默认值
	const hotX = defaultTo(props.hotArea.x, 0)
	const hotY = defaultTo(props.hotArea.y, 0)
	const hotW = defaultTo(props.hotArea.w, props.viewBoxW)
	const hotH = defaultTo(props.hotArea.h, props.viewBoxH)

	// SVG 主样式：背景图 + 初始透明度
	const mainStyle: CSSProperties = {
		backgroundImage: svgURL(props.url),
		backgroundSize: "100% auto",
		backgroundRepeat: "no-repeat",
		width: "100%",
		transform: "rotateZ(0.00deg)",
		WebkitTransform: "rotateZ(0.00deg)",
		pointerEvents: "none",
	}

	// 最底层图片：静态显示，无动画
	if (!props.hasAnimation) {
		return <SectionEx style={{ pointerEvents: "none", height: 0, lineHeight: 0 }}>
			<SvgEx
				viewBox={`0 0 ${props.viewBoxW} ${props.viewBoxH}`}
				preserveAspectRatio="xMinYMin meet"
				style={mainStyle}
				width="100%"
				opacity={1}
			/>
		</SectionEx>
	}

	// 其他图层：点击后淡出
	// 关键：将 pointerEvents 从 SVG 移到热区矩形，让整个 SVG 能接收点击事件
	return <SectionEx style={{ pointerEvents: "none", height: 0, lineHeight: 0 }}>
		<SvgEx
			viewBox={`0 0 ${props.viewBoxW} ${props.viewBoxH}`}
			preserveAspectRatio="xMinYMin meet"
			style={{ ...mainStyle, pointerEvents: "auto" }}
			width="100%"
			opacity={1}
		>
			{/* 点击后整个 SVG 淡出 */}
			<animate
				attributeName="opacity"
				begin="click"
				restart="never"
				dur={`${props.duration}s`}
				values="1;0"
				keyTimes="0;1"
				keySplines={props.keySplines}
				calcMode={props.keySplines ? "spline" : "linear"}
				fill="freeze"
			/>

			{/* 热区矩形：透明、可点击 */}
			<rect
				x={hotX}
				y={hotY}
				width={hotW}
				height={hotH}
				opacity={0}
				style={{ pointerEvents: "painted" }}
			>
				{/* 点击后立即将热区移出视野，防止重复点击 */}
				<animate
					attributeName="x"
					begin="click+0s"
					dur="1ms"
					values={outOfView.toString()}
					fill="freeze"
					restart="whenNotActive"
				/>
				{/* 点击后隐藏热区 */}
				<set
					attributeName="visibility"
					to="hidden"
					begin="click+0s"
					dur="1ms"
					fill="freeze"
					restart="never"
				/>
			</rect>
		</SvgEx>
	</SectionEx>
}

export default ClickSwitchLayer;

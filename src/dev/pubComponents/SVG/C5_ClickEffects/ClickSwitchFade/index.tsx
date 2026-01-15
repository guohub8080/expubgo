/* eslint-disable no-mixed-spaces-and-tabs */
import { CSSProperties, useMemo } from "react";
import SectionEx from "@pub-html/basicEx/SectionEx";
import { defaultTo } from "es-toolkit/compat";
import getTextImgPic1 from "@api/placeHolderPic/getTextImgPic1";
import { mpGet } from "@styles/funcs/mp";
import getImgSizeByDefault from "@pub-utils/common/getImgSizeByDefault";
import { getLinearBezier } from "@pub-utils/getBezier";
import { HotAreaConfig, getFullScreenHotArea } from "@pub-utils/svgHotArea";
import ClickSwitchLayer from "./components/ClickSwitchLayer";
import { frameStyle } from "./styles";
import type { ClickSwitchFadeProps, ClickSwitchFadePic } from "./types";

// ============================================ ClickSwitchFade Main Component ============================================

/**
 * ClickSwitchFade - 点击淡出切换组件
 *
 * 点击屏幕后，当前图片淡出消失，显示下一层图片。
 * 支持多张图片依次切换，可自定义每张图片的切换速度、贝塞尔曲线和点击热区。
 *
 * 两种模式：
 * 1. isLastImgMaintained: true (默认) - 最后一张图片保持显示，不会消失
 * 2. isLastImgMaintained: false - 所有图片都会点击消失
 *
 * @example
 * // 基础用法
 * <ClickSwitchFade
 *   pics={[
 *     { url: "图片1.jpg" },
 *     { url: "图片2.jpg" },
 *     { url: "图片3.jpg" }
 *   ]}
 * />
 *
 * // 自定义切换速度和热区
 * <ClickSwitchFade
 *   switchDuration={0.8}
 *   pics={[
 *     {
 *       url: "图片1.jpg",
 *       duration: 0.5,
 *       hotArea: { x: 100, y: 100, w: 200, h: 200 }
 *     }
 *   ]}
 * />
 *
 * // 全部消失模式
 * <ClickSwitchFade
 *   isLastImgMaintained={false}
 *   pics={[
 *     { url: "倒计时3.jpg" },
 *     { url: "倒计时2.jpg" },
 *     { url: "倒计时1.jpg" }
 *   ]}
 * />
 */
const ClickSwitchFade = (props: ClickSwitchFadeProps) => {
	// 默认切换动画时长（秒）
	const defaultDuration = defaultTo(props.switchDuration, 0.5)

	// 最后一张图片是否保持显示
	const isLastImgMaintained = defaultTo(props.isLastImgMaintained, true)

	// 解析 margin/padding 样式
	const mpResult = mpGet(props.mp)

	// 获取第一张图片的 URL，用于计算 viewBox 尺寸
	const firstPicUrl = defaultTo(props.pics, [{ url: getTextImgPic1(600, 800, "测试图1") }])[0]?.url

	// 计算最终的 viewBox 尺寸：优先使用用户指定的尺寸，否则使用基准图片的真实尺寸
	const imgSizeAsViewBox = getImgSizeByDefault(firstPicUrl, props.viewBoxW, props.viewBoxH)

	/**
	 * 处理图片配置：为每张图片设置 url、duration、keySplines 和 hotArea
	 */
	const pics: ClickSwitchFadePic[] = useMemo(() => {
		return defaultTo(props.pics, [{
			url: firstPicUrl
		}]).map((x) => {
			// 如果未指定 hotArea，则使用全屏热区
			const hotArea = defaultTo(
				x?.hotArea,
				getFullScreenHotArea({ viewBoxW: imgSizeAsViewBox.w, viewBoxH: imgSizeAsViewBox.h })
			)
			return {
				url: x?.url,
				duration: defaultTo(x?.duration, defaultDuration),
				keySplines: defaultTo(x?.keySplines, getLinearBezier()),
				hotArea
			}
		})
	}, [props.pics, defaultDuration, firstPicUrl, imgSizeAsViewBox.w, imgSizeAsViewBox.h])

	// 根容器样式：合并框架样式和 mp 样式
	const rootStyle: CSSProperties = {
		...frameStyle,
		...mpResult
	};

	// 根据 isLastImgMaintained 决定渲染逻辑
	// - false: 最后一张图片也会点击消失（所有图片都有动画）
	// - true: 最后一张图片保持不消失（底层无动画）

	if (!isLastImgMaintained) {
		// 所有图片都点击消失：从最后一张到第一张，倒序渲染
		return <SectionEx data-label="click-switch-all-disappear" style={rootStyle}>
			{pics.slice().reverse().map((pic, index) => (
				<ClickSwitchLayer
					key={index}
					viewBoxW={imgSizeAsViewBox.w}
					viewBoxH={imgSizeAsViewBox.h}
					url={pic.url}
					duration={pic.duration}
					keySplines={pic.keySplines}
					hotArea={pic.hotArea}
					hasAnimation={true}
				/>
			))}
		</SectionEx>
	}

	// 最后一张图片保持，其他图片点击消失
	// 渲染顺序：最后一张（底层，无动画）→ 中间图片（有动画）→ 第一张（顶层，有动画）
	return <SectionEx data-label="click-switch" style={rootStyle}>
		{/* 倒序渲染，从最后一张到第二张 */}
		{pics.slice().reverse().map((pic, index) => {
			// 最后一张图片（index === pics.length - 1）无动画
			const isLastPic = index === pics.length - 1
			return (
				<ClickSwitchLayer
					key={index}
					viewBoxW={imgSizeAsViewBox.w}
					viewBoxH={imgSizeAsViewBox.h}
					url={pic.url}
					duration={pic.duration}
					keySplines={pic.keySplines}
					hotArea={pic.hotArea}
					hasAnimation={!isLastPic}
				/>
			)
		})}
	</SectionEx>
}

export default ClickSwitchFade;

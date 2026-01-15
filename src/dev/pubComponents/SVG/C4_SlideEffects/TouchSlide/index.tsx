/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useMemo } from "react";
import { range, defaultTo } from "es-toolkit/compat";
import getTextImgPic1 from "@api/placeHolderPic/getTextImgPic1";
import { mpGet } from "@styles/funcs/mp";
import getImgSizeByDefault from "@pub-utils/common/getImgSizeByDefault";
import TouchSlideX from "./components/TouchSlideX";
import TouchSlideB from "./components/TouchSlideB";
import TouchSlideT from "./components/TouchSlideT";
import type { TouchSlideProps, TouchSlidePic } from "./types";

// ============================================ TouchSlide Main Component ============================================

/**
 * TouchSlide - 触摸滑动组件
 *
 * 支持三种滑动模式：
 * 1. 水平滑动 (isX: true) - TouchSlideX
 * 2. 垂直滑动 (isY: true) - TouchSlideT
 * 3. 垂直反向滑动 (isY + isReverse) - TouchSlideB
 *
 * @example
 * // 水平滑动
 * <TouchSlide isX pics={pics} />
 *
 * // 垂直滑动
 * <TouchSlide isY pics={pics} />
 *
 * // 垂直反向滑动
 * <TouchSlide isY isReverse pics={pics} />
 */
const TouchSlide = (props: TouchSlideProps) => {
	// 解构滑动方向参数，X 方向优先
	let isX = defaultTo(props.isX, false);
	const isY = defaultTo(props.isY, false);
	const isReverse = defaultTo(props.isReverse, false);

	// 默认水平滑动（当既不是 X 也不是 Y 时）
	if (!isX && !isY) { isX = true }

	// 解析 margin/padding 样式
	const comps_mp = mpGet(props.mp);

	/**
	 * 统一规范图片数据
	 * - 如果传入 pics，则规范化数据（补全默认值）
	 * - 如果未传入，则生成 3 张占位图片
	 */
	const normalizedPics: TouchSlidePic[] = useMemo(() => {
		const middle = defaultTo(props.pics, [] as TouchSlidePic[]);
		if (middle.length > 0) return middle.map(x => ({
			url: x.url,
			isTouchable: defaultTo(x?.isTouchable, false),
			mt: defaultTo(x?.mt, 0),
			mb: defaultTo(x?.mb, 0),
			ml: defaultTo(x?.ml, 0),
			mr: defaultTo(x?.mr, 0),
		}));
		// 默认生成 3 张占位图片（450x750）
		return range(3).map(i => ({
			url: getTextImgPic1(450, 750, `${i + 1}`),
			isTouchable: false,
			mt: 0,
			mb: 0,
			ml: 0,
			mr: 0,
		}));
	}, [props.pics]);

	/**
	 * 根据 viewBoxBase 与图片尺寸推导最终 viewBox 尺寸
	 * 允许通过 props.viewBoxW 和 props.viewBoxH 覆盖
	 */
	const resolvedViewBox = getImgSizeByDefault(normalizedPics[0].url, props.viewBoxW, props.viewBoxH);

	// 根据滑动方向和反向设置，路由到对应的组件
	if (isX) {
		// 水平滑动（支持反向）
		return (
			<TouchSlideX pics={normalizedPics}
				viewBoxW={resolvedViewBox.w}
				viewBoxH={resolvedViewBox.h}
				mpResult={comps_mp}
				isReverse={isReverse}
			/>
		);
	}

	if (isReverse) {
		// 垂直反向滑动
		return (<TouchSlideB pics={normalizedPics}
			viewBoxW={resolvedViewBox.w}
			viewBoxH={resolvedViewBox.h}
			mpResult={comps_mp}
		/>
	)}

	// 垂直滑动（默认）
	return (
		<TouchSlideT pics={normalizedPics}
			viewBoxW={resolvedViewBox.w}
			viewBoxH={resolvedViewBox.h}
			mpResult={comps_mp}
		/>
	);
}

export default TouchSlide;

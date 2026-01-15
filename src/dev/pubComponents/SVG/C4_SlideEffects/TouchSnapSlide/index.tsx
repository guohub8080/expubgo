/* eslint-disable no-mixed-spaces-and-tabs */
import { useMemo } from "react";
import { range, defaultTo } from "es-toolkit/compat";
import getTextImgPic1 from "@api/placeHolderPic/getTextImgPic1";
import { mpGet } from "@styles/funcs/mp";
import getImgSizeByDefault from "@pub-utils/common/getImgSizeByDefault";
import TouchSnapSlideX from "./components/TouchSnapSlideX";
import TouchSnapSlideT from "./components/TouchSnapSlideT";
import TouchSnapSlideB from "./components/TouchSnapSlideB";
import type { TouchSnapSlideProps, TouchSnapSlidePic } from "./types";

// ============================================ TouchSnapSlide Main Component ============================================

/**
 * TouchSnapSlide - 触摸吸附滑动组件
 *
 * 支持横向和纵向吸附滑动的图片轮播组件。
 * 每次滑动会自动吸附到下一张图片，支持四个方向的滑动。
 *
 * 支持三种滑动模式：
 * 1. 水平吸附滑动 (isX: true) - TouchSnapSlideX
 * 2. 垂直吸附滑动 (isY: true) - TouchSnapSlideT
 * 3. 垂直反向吸附滑动 (isY + isReverse) - TouchSnapSlideB
 *
 * @example
 * // 基础用法（默认左滑）
 * <TouchSnapSlide pics={[
 *   { url: pic1 },
 *   { url: pic2 },
 *   { url: pic3 }
 * ]} />
 *
 * // 右滑
 * <TouchSnapSlide isX isReverse pics={[...]} />
 *
 * // 向上滑动
 * <TouchSnapSlide isY pics={[...]} />
 *
 * // 自定义吸附位置（开始/中间/结束）
 * <TouchSnapSlide snap="start" pics={[...]} />
 *
 * // 带边距
 * <TouchSnapSlide pics={[...]} mp={{ mt: 10, mb: 10 }} />
 */
const TouchSnapSlide = (props: TouchSnapSlideProps) => {
	// 解构吸附位置参数，默认 middle
	const snap = defaultTo(props.snap, "middle");

	// 解构滑动方向参数，X 方向优先
	let isX = defaultTo(props.isX, false);
	const isY = defaultTo(props.isY, false);
	const isReverse = defaultTo(props.isReverse, false);

	// 默认水平滑动（当既不是 X 也不是 Y 时）
	if (!isX && !isY) { isX = true }

	// 解析 margin/padding 样式
	const comp_mpResult = mpGet(props.mp);

	/**
	 * 统一规范图片数据
	 * - 如果传入 pics，则规范化数据（补全默认值）
	 * - 如果未传入，则生成 3 张占位图片
	 */
	const normalizedPics: TouchSnapSlidePic[] = useMemo(() => {
		const middle = defaultTo(props.pics, [] as TouchSnapSlidePic[]);
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

	// 根据 viewBoxBase 与图片尺寸推导最终 viewBox 尺寸
	const resolvedViewBox = getImgSizeByDefault(normalizedPics[0].url, props.viewBoxW, props.viewBoxH);

	// 根据滑动方向和反向设置，路由到对应的组件
	if (isX) {
		// 横向 L/R 统一由 Horizontal 渲染
		return (<TouchSnapSlideX pics={normalizedPics}
			viewBoxW={resolvedViewBox.w}
			viewBoxH={resolvedViewBox.h}
			snap={snap}
			isReverse={isReverse}
			mpResult={comp_mpResult}
		/>
		);
	}

	// 纵向吸附：顶部（T）与底部（B，180°旋转）
	if (isReverse) {
		return (<TouchSnapSlideB
			pics={normalizedPics}
			viewBoxW={resolvedViewBox.w}
			viewBoxH={resolvedViewBox.h}
			mpResult={comp_mpResult}
			snap={snap}
		/>
		);
	}

	// 垂直滑动（默认）
	return (<TouchSnapSlideT
		pics={normalizedPics}
		viewBoxW={resolvedViewBox.w}
		viewBoxH={resolvedViewBox.h}
		mpResult={comp_mpResult}
		snap={snap}
	/>
	);
}

export default TouchSnapSlide;

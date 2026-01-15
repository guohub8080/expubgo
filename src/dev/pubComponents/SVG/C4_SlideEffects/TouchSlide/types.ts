import { CSSProperties } from "react";

/**
 * 单张图片的配置
 */
export type TouchSlidePic = {
	url: string;              // 图片 URL
	isTouchable?: boolean;    // 是否使用可触摸版本（SeamlessImg）
	mt?: number | string;     // 上边距
	mb?: number | string;     // 下边距
	ml?: number | string;     // 左边距
	mr?: number | string;     // 右边距
}

/**
 * TouchSlide 组件的 Props
 */
export type TouchSlideProps = {
	/** 图片数组，每张图片可配置是否可触摸、边距 */
	pics?: TouchSlidePic[];
	/** SVG viewBox 宽度（可选） */
	viewBoxW?: number;
	/** SVG viewBox 高度（可选） */
	viewBoxH?: number;
	/** 是否水平滑动（默认 true） */
	isX?: boolean;
	/** 是否垂直滑动 */
	isY?: boolean;
	/** 是否反向滑动 */
	isReverse?: boolean;
	/** margin/padding 快捷配置 */
	mp?: {
		mt?: number | string;
		mb?: number | string;
		ml?: number | string;
		mr?: number | string;
		pt?: number | string;
		pb?: number | string;
		pl?: number | string;
		pr?: number | string;
	};
}

/**
 * TouchSlideX 组件的 Props
 */
export type TouchSlideXProps = {
	pics: TouchSlidePic[]
	viewBoxW: number
	viewBoxH: number
	isReverse: boolean
	mpResult: CSSProperties
}

/**
 * TouchSlideB 组件的 Props
 */
export type TouchSlideBProps = {
	pics: TouchSlidePic[]
	viewBoxW: number
	viewBoxH: number
	mpResult: CSSProperties
}

/**
 * TouchSlideT 组件的 Props
 */
export type TouchSlideTProps = {
	pics: TouchSlidePic[]
	viewBoxW: number
	viewBoxH: number
	mpResult: CSSProperties
}

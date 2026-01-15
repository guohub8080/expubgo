import { CSSProperties } from "react";

/**
 * 单张图片的配置
 */
export type TouchSnapSlidePic = {
	url: string;              // 图片 URL
	isTouchable?: boolean;    // 是否使用可触摸版本
	mt?: number | string;     // 上边距
	mb?: number | string;     // 下边距
	ml?: number | string;     // 左边距
	mr?: number | string;     // 右边距
}

/**
 * 吸附位置类型
 */
export type SnapAlign = "start" | "middle" | "end";

/**
 * TouchSnapSlide 组件的 Props
 */
export type TouchSnapSlideProps = {
	/** 图片数组，每张图片可配置是否可触摸、边距 */
	pics?: TouchSnapSlidePic[];
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
	/** 吸附位置：start/middle/end，默认 middle */
	snap?: SnapAlign;
}

/**
 * TouchSnapSlideX 组件的 Props
 */
export type TouchSnapSlideXProps = {
	pics: TouchSnapSlidePic[]
	viewBoxW: number
	viewBoxH: number
	snap: SnapAlign
	isReverse: boolean
	mpResult: CSSProperties
}

/**
 * TouchSnapSlideB 组件的 Props
 */
export type TouchSnapSlideBProps = {
	pics: TouchSnapSlidePic[]
	viewBoxW: number
	viewBoxH: number
	snap: SnapAlign
	mpResult: CSSProperties
}

/**
 * TouchSnapSlideT 组件的 Props
 */
export type TouchSnapSlideTProps = {
	pics: TouchSnapSlidePic[]
	viewBoxW: number
	viewBoxH: number
	snap: SnapAlign
	mpResult: CSSProperties
}

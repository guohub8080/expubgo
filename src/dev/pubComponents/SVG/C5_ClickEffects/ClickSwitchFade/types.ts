import { CSSProperties } from "react";

/**
 * 单张图片的配置
 */
export type ClickSwitchFadePic = {
	url: string;                      // 图片 URL
	duration?: number;                // 淡出动画时长（秒）
	keySplines?: string;               // 贝塞尔曲线参数
	hotArea?: HotAreaConfig;          // 点击热区配置
}

/**
 * ClickSwitchFade 组件的 Props
 */
export type ClickSwitchFadeProps = {
	/** 图片配置数组 */
	pics?: ClickSwitchFadePic[];
	/** 默认切换时长（秒），默认 0.5 */
	switchDuration?: number;
	/** ViewBox 宽度（可选） */
	viewBoxW?: number;
	/** ViewBox 高度（可选） */
	viewBoxH?: number;
	/** 最后一张图片是否保持显示，默认 true */
	isLastImgMaintained?: boolean;
	/** margin/padding 配置 */
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
 * ClickSwitchLayer 组件的 Props
 */
export type ClickSwitchLayerProps = {
	viewBoxW: number
	viewBoxH: number
	url: string
	duration: number
	keySplines?: string
	hotArea: HotAreaConfig
	hasAnimation?: boolean
}

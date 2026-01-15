import type { mpProps } from "@styles/funcs/mp";

/** 初始视野位置（图片坐标系） */
export interface InitViewPosition {
	/** 左上角 X */
	x1: number;
	/** 右上角 X */
	x2: number;
	/** 顶部 Y */
	y: number;
}

export interface ZoomToFullViewProps {
	/** 背景图 URL */
	bgPic: string;
	/** 覆盖图 URL（点击后滑入显示），不传则无覆盖图 */
	overlayPic?: string;
	/** 提示图 URL（闪烁效果），不传则无闪烁提示 */
	promptPic?: string;

	/** viewBox 宽度，不传则从图片自动获取 */
	viewBoxW?: number;
	/** viewBox 高度，不传则从图片自动获取 */
	viewBoxH?: number;

	/** 初始视野位置（图片坐标系），必传 */
	initViewPosition: InitViewPosition;

	/** 缩放动画时长（秒），默认 3.25 */
	zoomDuration?: number;
	/** 缩放动画贝塞尔曲线 */
	zoomKeySplines?: string;

	/** 覆盖图出现延迟（秒），默认 0.85 */
	overlayDelay?: number;
	/** 覆盖图淡入贝塞尔曲线 */
	overlayKeySplines?: string;

	/** 提示闪烁最小透明度，默认 0.235 */
	promptBlinkMinOpacity?: number;
	/** 提示闪烁周期（秒），默认 2.15 */
	promptBlinkDuration?: number;

	/** 公众号样式 */
	mp?: mpProps;
}

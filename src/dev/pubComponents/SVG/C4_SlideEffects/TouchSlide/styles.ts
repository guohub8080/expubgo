import { CSSProperties } from "react";

// ============================================ Common Styles ============================================

/**
 * 根容器基础样式
 * - WebkitTouchCallout: none - 禁用 iOS 长按菜单
 * - userSelect: text - 允许文本选择
 * - overflow: hidden - 隐藏溢出内容
 * - lineHeight: 0 - 消除垂直方向意外间距
 */
export const rootBaseStyle: CSSProperties = {
	WebkitTouchCallout: "none",
	userSelect: "text",
	overflow: "hidden",
	textAlign: "center",
	lineHeight: 0
};

/**
 * 视口基础样式（垂直滑动用）
 * - overflow: overlay - 使用原生滚动
 * - WebkitOverflowScrolling: touch - iOS 平滑滚动
 * - visibility: visible - 确保内容可见
 */
export const viewportBaseStyle: CSSProperties = {
	lineHeight: 0,
	margin: 0,
	overflow: "overlay",
	width: "100%",
	height: "100%",
	visibility: "visible",
	WebkitOverflowScrolling: "touch"
};

/**
 * 轨道基础样式（垂直滑动用）
 * - display: block - 垂直堆叠
 * - whiteSpace: normal - 允许正常换行
 */
export const trackStyle: CSSProperties = {
	display: "block",
	boxSizing: "border-box",
	width: "100%",
	overflow: "hidden",
	whiteSpace: "normal"
};

/**
 * 单个图片基础样式
 * - display: inline-block - 内联块级显示
 * - verticalAlign: top - 顶部对齐
 * - boxSizing: border-box - 包含边框和内边距
 */
export const itemBaseStyle: CSSProperties = {
	display: "inline-block",
	verticalAlign: "top",
	boxSizing: "border-box"
};

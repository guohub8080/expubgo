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
 * 单个图片基础样式
 * - flex: 1 - 平均分配空间
 * - verticalAlign: top - 顶部对齐
 */
export const itemBaseStyle: CSSProperties = {
	flex: 1,
	verticalAlign: "top"
};

/**
 * 块级图片基础样式
 * - display: block - 块级显示
 * - boxSizing: border-box - 包含边框和内边距
 */
export const itemBlockStyle: CSSProperties = {
	display: "block",
	width: "100%",
	height: "100%",
	boxSizing: "border-box"
};

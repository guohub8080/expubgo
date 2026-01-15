import { CSSProperties } from "react";

// ============================================ Common Styles ============================================

/**
 * 框架基础样式
 * - WebkitTouchCallout: none - 禁用 iOS 长按菜单
 * - userSelect: text - 允许文本选择
 * - overflow: hidden - 隐藏溢出内容
 * - lineHeight: 0 - 消除垂直方向意外间距
 */
export const frameStyle: CSSProperties = {
	WebkitTouchCallout: "none",
	userSelect: "text",
	overflow: "hidden",
	textAlign: "center",
	lineHeight: 0,
	marginBottom: 0,
};

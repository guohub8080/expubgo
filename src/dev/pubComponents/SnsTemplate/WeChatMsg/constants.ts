import { CSSProperties } from "react";

// 微信聊天设计规范（微信公众号兼容版）
// 颜色来源：微信官方标准色彩指南 (https://res.wx.qq.com/a/wx_fed/wedesign/res/2b7c/WeChat_Standard_Color_Guidelines_201703.pdf)
export const CHAT_MSG_CONSTANTS = {
    // 布局
    CONTAINER_MAX_WIDTH: 414,
    CONTAINER_PADDING: 12,

    // 头像
    AVATAR_SIZE: 42,
    AVATAR_BORDER_RADIUS: 6,
    AVATAR_MARGIN_RIGHT: 10,
    AVATAR_MARGIN_LEFT: 10,

    // 间距
    MESSAGE_GAP: 12, // 消息之间的垂直间距
    BUBBLE_PADDING: 12, // 气泡内边距

    // 字体
    FONT_SIZE_USERNAME: 14,
    FONT_SIZE_CONTENT: 16,
    FONT_SIZE_TIME: 12,

    // 颜色（微信官方标准色 + 微信公众号兼容）
    COLOR_TEXT: "#111111",
    COLOR_TEXT_SELF: "#000000", // 自己发的消息文字颜色（黑色，与绿色背景对比）
    COLOR_LINK: "#576B95",
    COLOR_TIME: "#B2B2B2",
    COLOR_BACKGROUND: "#F5F5F5", // 聊天背景色（浅灰）
    COLOR_BORDER: "#EDEDED",
    COLOR_BUBBLE_SELF: "#91ED61", // 自己的气泡颜色（微信官方辅助色）
    COLOR_BUBBLE_OTHER: "#FFFFFF", // 对方的气泡颜色（白色）
    COLOR_BUBBLE_BORDER: "rgba(0, 0, 0, 0.05)", // 气泡边框（非常淡的灰色）
    COLOR_BUBBLE_ARROW_BORDER: "rgba(0, 0, 0, 0.08)", // 箭头边框（稍微深一点，让白色箭头可见）

    // 气泡样式
    BUBBLE_BORDER_RADIUS: 6,
    BUBBLE_MAX_WIDTH: 240, // 气泡最大宽度
} as const;

// 基础样式对象
export const baseStyle: CSSProperties = {
    boxSizing: "border-box",
    display: "block",
    margin: 0,
    padding: 0,
    minWidth: 0,
    minHeight: 0,
};

export const baseFlexStyle: CSSProperties = {
    ...baseStyle,
    display: "flex",
    alignItems: "stretch",
    flexShrink: 0,
};

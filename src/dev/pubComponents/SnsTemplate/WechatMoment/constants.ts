import { CSSProperties } from "react";

// 微信朋友圈设计规范（微信公众号兼容版）
export const MOMENT_CONSTANTS = {
    // 布局
    CONTAINER_MAX_WIDTH: 414,
    CONTAINER_PADDING: 12,

    // 头像
    AVATAR_SIZE: 42,
    AVATAR_BORDER_RADIUS: 6,
    AVATAR_MARGIN_RIGHT: 10,

    // 间距
    CONTENT_GAP: 5,
    IMAGE_GRID_GAP: 2, // 图片之间的默认间隙（px）
    SECTION_MARGIN: 8,

    // 字体
    FONT_SIZE_USERNAME: 17,
    FONT_SIZE_CONTENT: 17,
    FONT_SIZE_TIME: 14,
    FONT_SIZE_LOCATION: 14,

    // 颜色（微信公众号安全色）
    COLOR_TEXT: "#111111",
    COLOR_LINK: "#576B95",
    COLOR_TIME: "#B2B2B2",
    COLOR_BACKGROUND: "#FFFFFF",
    COLOR_BORDER: "#EDEDED",
    COLOR_INTERACTION_BG: "#F7F7F7",
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

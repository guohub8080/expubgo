/**
 * Carousel 组件的类型定义
 */

// 方向类型
export type Direction = "L" | "R" | "T" | "B";

// 图片配置
export interface PicConfig {
    url: string;
    isTouchable?: boolean;
}

// 规范化后的图片配置（所有默认值已填充）
export interface NormalizedPicConfig extends PicConfig {
    isTouchable: boolean;
}

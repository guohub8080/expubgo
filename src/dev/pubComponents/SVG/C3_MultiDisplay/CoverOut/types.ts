/**
 * CoverOut 组件的类型定义
 */

// 方向类型
export type Direction = "T" | "B" | "L" | "R";

// 图片配置
export interface PicConfig {
    url: string;
    coverOutDuration?: number;   // 该图滑出的时长（秒）
    stayDuration?: number;        // 该图停留的时长（秒）
    direction?: Direction;        // 该图滑出方向
    keySplines?: string;          // 该图的贝塞尔曲线
}

// 规范化后的图片配置（所有默认值已填充）
export interface NormalizedPicConfig extends PicConfig {
    coverOutDuration: number;
    stayDuration: number;
    direction: Direction;
    keySplines: string;
}

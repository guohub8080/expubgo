/**
 * AnyPush 组件的类型定义
 */

// 方向类型
export type Direction = "L" | "R" | "T" | "B";

// 点坐标
export interface Point {
    x: number;
    y: number;
}

// 图片配置
export interface PicConfig {
    url: string;
    direction?: Direction;
    switchDuration?: number;      // 切换到下一张图片的时长（秒）
    stayDuration?: number;         // 静止停留的时长（秒）
    keySplines?: string;           // 贝塞尔曲线
}

// 规范化后的图片配置（所有默认值已填充）
export interface NormalizedPicConfig extends PicConfig {
    direction: Direction;
    switchDuration: number;
    stayDuration: number;
    keySplines: string;
}

// 时间线段配置
export interface TimelineSegment {
    toValue: Point;
    durationSeconds: number;
    keySplines: string;
}

// 动画时间线（按时间顺序排列的段）
export type AnimationTimeline = TimelineSegment[];

// 计算结果的集合
export interface TimingCalculations {
    totalCycleDuration: number;
    delayTimeByIndex: (index: number) => number;
    holdTimeByIndex: (index: number) => number;
}

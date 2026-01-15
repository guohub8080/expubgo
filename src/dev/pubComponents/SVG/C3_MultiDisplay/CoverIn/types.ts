/**
 * CoverIn 组件的类型定义
 */

// 方向类型：T-从下往上, B-从上往下, L-从右往左, R-从左往右
export type Direction = "T" | "B" | "L" | "R";

// 点坐标
export interface Point {
    x: number;
    y: number;
}

// 图片配置（用户输入）
export interface PicConfig {
    url: string;
    coverInDuration?: number;   // 滑入时长（秒）
    stayDuration?: number;      // 停留时长（秒）
    direction?: Direction;      // 滑入方向
    keySplines?: string;        // 贝塞尔曲线
}

// 规范化后的图片配置（所有默认值已填充）
export interface NormalizedPicConfig extends PicConfig {
    coverInDuration: number;
    stayDuration: number;
    direction: Direction;
    keySplines: string;
}

// 动画组类型
export type GroupType = "initialStatic" | "loopSlide";

// 动画模式
export type AnimationMode = "once" | "loop";

// 动画分组结果
export interface AnimationGroups {
    initialStatic: NormalizedPicConfig;      // 初始静止图
    firstRoundSlides: NormalizedPicConfig[]; // 第一轮滑入序列
    loopSlides: NormalizedPicConfig[];       // 循环滑入序列
}

// 关键帧参数（用于 SVG animateTransform）
export interface KeyframeParams {
    values: string;              // values 属性值
    keyTimes: string;            // keyTimes 属性值
    keySplines: string;          // keySplines 属性值
    initialX: number;            // 初始 X 位置
    initialY: number;            // 初始 Y 位置
    beginTime: string;           // begin 时间
    repeatCount: string;         // repeatCount
}

// 构建关键帧参数的输入
export interface KeyframeBuilderInput {
    direction: Direction;
    viewBoxW: number;
    viewBoxH: number;
    slideInStartTime: number;
    slideInEndTime: number;
    totalDuration: number;
    animationMode: AnimationMode;
    firstRoundDuration?: number;
    keySplines: string;
}

// 动画时长计算结果
export interface DurationCalculations {
    firstRoundDuration: number;
    loopDuration: number;
}

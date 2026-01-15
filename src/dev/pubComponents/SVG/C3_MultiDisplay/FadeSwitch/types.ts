/**
 * FadeSwitch 组件的类型定义
 */

// 图片配置
export interface PicConfig {
    url: string;
    fadeDuration?: number;   // 淡入/淡出的时长（秒）
    stayDuration?: number;   // 完全显示停留的时长（秒）
}

// 规范化后的图片配置（所有默认值已填充）
export interface NormalizedPicConfig extends PicConfig {
    fadeDuration: number;
    stayDuration: number;
}

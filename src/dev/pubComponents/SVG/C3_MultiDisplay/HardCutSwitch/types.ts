/**
 * HardCutSwitch 组件的类型定义
 */

// 图片配置
export interface PicConfig {
    url: string;
    stayDuration?: number;   // 完全显示停留的时长（秒）
}

// 规范化后的图片配置（所有默认值已填充）
export interface NormalizedPicConfig extends PicConfig {
    stayDuration: number;
}

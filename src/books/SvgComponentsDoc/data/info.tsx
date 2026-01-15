/**
 * SvgComponentsDoc 全局配置
 */

import routerPaths from '@dev/router/paths';
import type { LucideIcon } from "lucide-react";

/**
 * 分类信息导出类型
 * 文件名：info.tsx
 */
export interface CategoryInfo {
  /** 分类图标（lucide-react 图标组件） */
  icon?: LucideIcon;
  /** 必填：用于覆盖文件夹 {y} 的路由前缀 */
  slug: string;
}

export const svgComponentsDocConfig = {
  /** 标题 */
  title: "SVG组件文档",
  slug: routerPaths.svgComponentsDoc,
  /** 描述 */
  description: "带有使用说明及附带预览效果",
  /** 图标（JSX） - 使用用户提供的 SVG 图标 */
  icon: (
    <svg
      className="w-full h-full"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 0h1024v1024H0V0z" fill="#202425" opacity=".01"></path>
      <path d="M682.666667 204.8h238.933333a34.133333 34.133333 0 0 1 34.133333 34.133333v648.533334a68.266667 68.266667 0 0 1-68.266666 68.266666h-204.8V204.8z" fill="#FFAA44"></path>
      <path d="M68.266667 921.6a34.133333 34.133333 0 0 0 34.133333 34.133333h785.066667a68.266667 68.266667 0 0 1-68.266667-68.266666V102.4a34.133333 34.133333 0 0 0-34.133333-34.133333H102.4a34.133333 34.133333 0 0 0-34.133333 34.133333v819.2z" fill="#11AA66"></path>
      <path d="M238.933333 307.2a34.133333 34.133333 0 0 0 0 68.266667h136.533334a34.133333 34.133333 0 1 0 0-68.266667H238.933333z m0 204.8a34.133333 34.133333 0 1 0 0 68.266667h409.6a34.133333 34.133333 0 1 0 0-68.266667H238.933333z m0 204.8a34.133333 34.133333 0 1 0 0 68.266667h204.8a34.133333 34.133333 0 1 0 0-68.266667H238.933333z" fill="#FFFFFF"></path>
    </svg>
  )
};

// 空 default 导出，避免 glob 导入时报错
export default null;

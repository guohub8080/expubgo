/**
 * 路由路径常量定义
 * 用于统一管理所有静态路由路径，避免硬编码
 */
const routerPaths = {
  // 首页
  home: "home",

  // 设置页面
  settings: "settings",

  // SVG 文档
  userDoc: "user_doc",
  svgToolFunctions: "svg-tool-functions",

  // SVG组件文档
  svgComponentsDoc: "svg_components_doc",

  // 工具
  shadowTool: "shadow-tool",
  rotate3d: "rotate3d",

  // 前端相关
  articleviewer: "view",
  color: "color",
  classInline: "class-inline",

  // 外部链接
  github: "https://github.com/guohub8080/expubgo",
} as const;

export default routerPaths;

// 导出类型定义，方便TypeScript使用
export type RouterPath = typeof routerPaths[keyof typeof routerPaths];
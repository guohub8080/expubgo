# SVG/React 组件转换工具 - 开发文档

## 项目概述

这是一个基于 React + TypeScript + Vite 的现代化 Web 应用，用于将 SVG 代码转换为 React 组件。

## 核心功能

### 1. SVG → React 转换
- 将纯 SVG 代码转换为可复用的 React 组件
- 自动解析 SVG 属性并保留
- 支持自定义组件名称和导出方式

### 2. 转换配置
- **组件名称**: 自定义组件名，支持匿名模式
- **导出方式**: 默认导出 / 命名导出 / 两者
- **尺寸处理**: 不保留 / 原始 / 100%
- **去除ID**: 强制移除所有 id 属性
- **Class展平**: 将 `<style>` 标签内的 CSS 展平到行内 style
- **Style转Object**: 将 style 属性转为 React 对象格式（驼峰命名）

### 3. 语法高亮编辑器
- 支持 XML/JSX 语法高亮
- 使用 VS Code 暗色主题 (`vscDarkPlus`)
- 自定义代码字体

## 技术架构

### 前端技术栈
- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **UI 组件**: shadcn/ui + Radix UI
- **语法高亮**: react-syntax-highlighter
- **状态管理**: Zustand
- **样式**: Tailwind CSS v4
- **代码格式化**: Prettier

### 目录结构
```
src/dev/apps/SvgReactConverter/
├── index.tsx                    # 主组件
├── CLAUDE.md                    # 本文档
├── components/
│   ├── ConverterSettingsCompact.tsx  # 设置面板
│   ├── SvgInputEditor.tsx            # SVG输入编辑器
│   ├── ReactOutputEditor.tsx         # React输出编辑器
│   ├── PreviewAndConvert.tsx         # 预览和转换组件
│   ├── FullscreenCodeViewer.tsx      # 全屏代码查看器
│   └── CodeEditorCard.tsx            # 通用代码编辑器卡片
├── hooks/
│   └── useSvgConversion.ts          # SVG转换逻辑
├── store/
│   └── useConverterStore.ts        # Zustand状态管理
├── utils/
│   ├── svgUtils.ts                 # SVG工具函数
│   └── formatCode.ts               # 代码格式化
└── defaultSvg.ts                   # 默认SVG示例
```

## 主布局 (三栏式)

1. **左侧面板** (`xl:col-span-3`)
   - 预览区域
   - 转换设置面板

2. **中间面板** (`xl:col-span-4`)
   - SVG 输入编辑器
   - 支持拖拽上传 SVG/XML 文件

3. **右侧面板** (`xl:col-span-4`)
   - React 输出编辑器
   - 只读模式，代码高亮

## 转换配置详解

### 组件名称
- 留空时为匿名模式，只能使用默认导出
- 有名称时可以选择导出方式

### 导出方式
- **默认**: `export default SvgComponent;`
- **命名**: `export { SvgComponent };`
- **两者**: 同时支持两种导出

### 尺寸处理
- **不保留**: 移除 width 和 height 属性
- **原始**: 保留 SVG 原始尺寸
- **100%**: 设置 width="100%" height="100%"

### Class展平
将 `<style>` 标签内的 CSS 规则展平到元素的行内 style 属性：
- 解析 class 选择器
- 提取样式规则
- 如果元素已有 style 属性，重复的会被已有值覆盖
- 移除 `<style>` 标签

### Style转Object
将 style 属性从字符串格式转换为 React 对象格式：
- `style="fill: red; stroke: blue"` → `style={{ fill: 'red', stroke: 'blue' }}`
- CSS 属性名自动转为驼峰命名

## 转换流程

```
SVG输入
  ↓
移除注释/DOCTYPE/空行
  ↓
DOMParser解析SVG
  ↓
提取属性（width/height/id/class等）
  ↓
Class展平（可选）
  ↓
Style转Object（可选）
  ↓
移除ID/class（根据设置）
  ↓
格式化代码
  ↓
生成React组件代码
```

## 状态管理

### Zustand Store 结构
```typescript
interface ConverterStore {
  settings: SvgConverterSettings;  // 转换设置（持久化）
  state: ConverterState;            // 运行状态（部分持久化）
  updateSettings: (newSettings) => void;
  resetSettings: () => void;
  setSvgInput: (input) => void;
  setReactOutput: (output) => void;
}
```

## 样式系统

- **编辑器背景**: `#1E1E1E`
- **面板间距**: `gap-3`
- **面板比例**: 3:4:4

## 交互设计

- **拖拽上传**: 支持 SVG/XML 文件拖拽
- **Hover确认**: 清空按钮 hover 触发确认弹窗
- **自动转换**: SVG 输入变化时自动转换
- **实时预览**: 预览区域实时显示 SVG

## 开发命令

```bash
pnpm dev       # 开发服务器
pnpm build     # 生产构建
pnpm lint      # 代码检查
```

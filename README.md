# ExPubGo

现代化 SVG 动画编辑和发布工具，基于 React + TypeScript + Vite 构建。架构与 [logiguo](https://github.com/guohub8080/logiguo) 同源。

## 特性

- **SVG 动画编辑** - 强大的 SVG 动画创作和编辑功能
- **实时预览** - 即时查看动画效果
- **多格式导出** - 支持导出到公众号等平台
- **React 组件转换** - 将原生 SVG 转换为 React 函数组件
- **色彩工具** - Material Design 配色方案，支持多种颜色格式
- **Publisher 内容系统** - 多公众号内容隔离 + 选择性构建
- **现代化 UI** - 使用 Tailwind CSS v4 和 shadcn/ui 构建

## 技术栈

- **前端框架**: React 19 + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS v4
- **UI 组件**: shadcn/ui + Radix UI
- **路由**: React Router v7 (Hash Router，首屏外页面懒加载)
- **状态管理**: Jotai（atomWithStorage 分字段持久化）
- **工具库**: es-toolkit（禁用 lodash）
- **动画**: Motion + 自定义 SVG 动画
- **包管理**: pnpm

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:6768

### 构建生产版本

```bash
pnpm build        # 全量构建（产物 → docs/）
pnpm gh           # GitHub Pages 构建（base: /expubgo/）
PUBLISHERS=<name> pnpm pkg  # 选择性构建：只打包指定 publisher 的单文件产物（dist-pkg/）
```

### 代码检查

```bash
pnpm lint
```

## 项目结构

```
src/
├── books/                    # 文档和教程内容（约定式 loader 发现）
│   ├── SvgToolFunctions/     # SVG 工具函数教程
│   ├── SvgComponentsDoc/     # SVG 组件文档
│   └── UserDocument/         # 用户手册
├── dev/                      # 主要开发代码
│   ├── apps/                 # 应用模块（Home、Color、ArticleViewer 等）
│   ├── components/           # 通用组件
│   ├── pubComponents/        # 发布组件（SVG、PureHTML、SnsTemplate）
│   ├── pubUtils/             # 发布工具（genSvgAnimate 等）
│   ├── shadcn/               # shadcn/ui 组件库
│   ├── router/               # 路由配置
│   ├── store/                # 状态管理（Jotai atoms）
│   └── articles/             # 文章系统核心（articlesLoader）
└── publishers/               # publisher 内容与组件（文章 + tools + config）
```

## 开发指南

详细的架构规范、代码约定与工作流见 [AGENTS.md](./AGENTS.md)，要点：

- **状态管理**：统一 Jotai，禁止 Zustand；持久化用 atomWithStorage 一字段一 key
- **工具库**：统一 es-toolkit，禁止 lodash（谓词走 `/predicate`，defaultTo/isArray 等走 `/compat`）
- **导入**：使用路径别名（`@dev`、`@apps`、`@pub-svg` 等），禁止三层以上相对路径
- **微信公众号兼容**：position/calc 会被过滤，叠加布局用负 margin；SVG 属性白名单见 pubUtils

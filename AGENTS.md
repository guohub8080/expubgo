# AGENTS.md

为在本仓库（**expubgo** —— 纯 Web 应用；GitHub 仓库 [guohub8080/expubgo](https://github.com/guohub8080/expubgo)）中工作的 AI agent 提供指引。本仓架构已对齐 logiguo 项目。

## 命令

包管理器：**pnpm**。**没有配置测试框架**。

```bash
pnpm dev                  # 启动 Vite 开发服务器（固定端口 6768，自动清理占用进程）
pnpm build                # sync-publisher-tsconfig + tsc + vite build（产物 → docs/）
pnpm gh                   # 以 GITHUB_PAGES=true 构建（base: /expubgo/，产物 → docs/）
pnpm lint                 # ESLint（--max-warnings 0）
PUBLISHERS=<name> pnpm pkg  # 选择性构建：只打包指定 publisher 的单文件产物（dist-pkg/）
```

构建产物输出到 `docs/`，**多镜像部署**：

| 平台 | 构建 | base | 地址 |
|---|---|---|---|
| GitHub Pages | `pnpm gh`（push 自动触发） | `/expubgo/` | guohub8080.github.io/expubgo/ |
| Vercel | `pnpm build` | `./` | expubgo-xxx.vercel.app |
| Cloudflare Pages | `pnpm build` | `./` | expubgo.pages.dev |
| Netlify | `pnpm build` | `./` | expubgo.netlify.app |

作为静态文件服务必须使用 hash 路由 + 相对 `base`（GH Pages 构建时为 `/expubgo/`，其余镜像根路径 `./`）—— 切换到 `BrowserRouter` 或绝对资源路径时，必须同时更新 `vite.config.ts` 和各平台部署配置。Vercel 等非 GH Pages 平台的 Framework Preset 保持 **Other**（不要选 Vite——其默认输出目录 `dist` 会找不到产物），Build Command 填 `pnpm build`、Output Directory 填 `docs`。

## 架构

### 目录结构

- `src/dev/` —— 主 React 应用（apps、components、stores、router、styles、utils、shadcn UI、pubComponents 发布组件库、pubUtils 发布工具）
- `src/books/{Name}/` —— 纯内容的「书」章节，由约定式 loader 发现
- `publishers/{name}/` —— publisher 内容与组件（文章 + components + tools + publisher.config.ts）
- `src/dev/articles/` —— 文章系统核心（articlesLoader、publisher 注册）

### 路由

`createHashRouter`（**react-router v7，注意 import 来自 `react-router` 而非 `react-router-dom`**），定义在 `src/dev/router/index.tsx`；路径常量在 `src/dev/router/paths.ts`。布局链：`HashRouter → MainLayout (Navigation + Outlet + Background) → page | BookLayout`。

**懒加载约定**（对齐 logiguo）：Home、Settings、MainLayout（含 Navigation）首屏急加载；其余页面一律 `lazy()` + `Suspense`（Lazy 包装 + LoadingFallback）。未匹配路由重定向到 `/home/`。

### Book loader 模式（核心内容系统）

`src/books/{Name}/` 下每本书的约定结构：

```
src/books/{Name}/
  [01]CategorySlug/
    [01]article-slug.tsx      # 也可以是 .md / .mdx
    info.tsx                  # 导出 { slug, icon? }
  data/
    info.tsx                  # 书的配置（title, slug, icon, description）
    {name}Loader.tsx          # generateXxxRoutes() 实现
```

loader 使用 `import.meta.glob("../**/*.{tsx,md,mdx}")`，解析 `[order]slug` 的目录/文件命名，按分类分组、排序，输出 `RouteObject[]`。新增内容时**必须严格遵循 `[NN]slug` 顺序命名** —— 它直接决定排序。

- **TSX 文章**必须 `export default { title: string, jsx: ReactNode }`
- **MD/MDX 文章**通过 `MDXProviderWrapper` 渲染，使用来自 `@mdx` 的样式化组件

### 文章系统（expubgo 特有）

- `src/dev/articles/articlesLoader.tsx` —— 扫描 `publishers/*/articles/` 生成 `/view/:publisher/:article` 路由；glob 分支经生成文件（见下节）配合 `__PUB_<NAME>__` 构建期常量做选择性构建（未启用 publisher 的分支被 tree-shake）。
- `src/dev/tools/publisherToolsLoader.tsx` —— 读取各 `publisher.config.ts` 的 `tools` 字段自动注册工具卡片 + 路由；工具代码放 `publishers/<p>/tools/<toolId>/`，必须在 articles/ 之外；专属图标放 `publishers/<p>/toolIcon.tsx`。

### Publisher 选择性构建（expubgo 特有）

```
PUBLISHERS=<p1>,<p2>       逗号分隔目录名；不传 = 全部启用
PUBLISHERS_MODE=include|exclude
```

- `vite.config.ts` 的 `generatePublisherAliases()` 扫描 `publishers/*/publisher.config.ts` 的 `alias` 对象生成 @短路径 别名（具体别名在各 publisher 私有配置中声明，公共代码不含目录名）；新增 publisher 只需建目录 + 配置文件，无需改 vite.config。
- `scripts/sync-publisher-tsconfig.cjs` 把同一份别名同步进 `tsconfig.publisher.json`；`tsconfig.app.json` **extends** 该文件，三处别名因此保持一致。新增静态别名要同时改 vite.config 和 sync 脚本的 STATIC_PATHS。
- **公共代码零目录名（隐私约定）**：`vite.config.ts` 的 `ALL_PUBLISHERS` 由扫描 `publishers/` 动态得出；按名字拆分的 `import.meta.glob` 分支（含 `__PUB_<NAME>__` 守卫）全部在 **生成文件** `src/dev/articles/publisherBranches.generated.tsx`（gitignore，由 `pnpm gen:pub` / 构建链现场生成，publishers 为空时生成空对象版本）。`articlesLoader` / `SideList` / `PublisherAccountManager` / `publisherToolsLoader` 只 import 生成文件的导出。**任何公共文件都不得出现 publisher 真实目录名**（文档示例用 `<name>`、`@demo` 占位）。
- 新增 publisher 的完整流程：建 `publishers/<name>/` 目录 + `publisher.config.ts`，然后跑 `pnpm sync:paths && pnpm gen:pub`（dev/build 链会自动跑）——无需改任何公共代码。工具卡片专属图标：放 `publishers/<name>/toolIcon.tsx`（default 导出 ReactNode），壳子经通配 glob 自动发现。

### 网络连接制度（内容源协议 —— 已定架构，待实施）

> 本节是后续开发的**架构依据**（设想已确定，实现尚未开始）。与插件制度**并行**而非替代。

**核心**：壳子与内容彻底分离。expubgo 公开部署后是**纯引擎壳子**——部署的是渲染能力而非内容，部署后终身无需为内容重新构建；任何人在部署后的网页上配置自己的内容源，即可让它渲染自己的内容（数据留在各自本地，不进壳子仓库/服务器）。内容在源端更新，壳子刷新即得。

**三层内容通道**：

1. **内置内容**（`src/books/`、`src/dev/articles/examples/`）——公开示例，随壳子构建
2. **插件制度**（`publishers/`，本地）——本地开发/私用模式照旧，产物编译进本地构建
3. **网络制度**（运行时）——壳子动态接收任意 HTTP 内容源，渲染已编译好的文章

**协议要点（已敲定）**：

- **连接方向**：壳子永远是 HTTP 客户端，主动 fetch/加载源（浏览器安全模型，不存在"源推送壳子"）。体验上支持本地一键发起：`pub:push` 打开 `壳子地址/#/connect?source=<源地址>`，壳子解析参数后自动连接。
- **产物形态**：编译好的**完整 HTML**（全 inline style，与"复制 HTML 发公众号"产物同构）。**不做**浏览器端 MDX 编译，**不做**远程 ESM 模块加载——用户端自己决定怎么写、怎么编译，壳子零内容格式知识。
- **manifest**：内容源根下 `manifest.json` —— 源信息（name/icon）+ 文章清单（id/title/date/category/tag + 每篇的 HTML 地址）。
- **渲染方式**：iframe 直接指向文章 HTML 的 URL（样式完全隔离，SVG 动画照常播放）；壳子侧文章列表/分类/搜索复用现有 ArticleViewer UI，数据来源多一条"运行时 fetch"。
- **工具（tools）继续走插件制度**，网络制度只覆盖文章（React 应用无法 HTML 化）。
- **浏览器策略约束（必须遵守）**：本机源必须用 `localhost` / `127.0.0.1`（https 壳子连 http://localhost 享受 mixed-content 豁免；局域网 IP 会被拦）；本地源 server 必须带 `Access-Control-Allow-Origin: *` 与 `Access-Control-Allow-Private-Network: true` 响应头。
- **源配置存储**：各用户浏览器的 localStorage（atomWithStorage），互不可见。

**实施分三步（每步独立可验证）**：

1. 协议格式定稿（manifest schema + HTML 产物约定）
2. 壳子侧：设置页"内容源"管理 UI + `/#/connect` 路由解析 + 动态文章列表 + iframe 渲染
3. 源侧：`pnpm pub:serve` —— 用 `react-dom/server` 的 `renderToStaticMarkup` 把本地 publishers 文章静态化为 HTML + 生成 manifest + 起带 CORS 头的本地 server

### 状态管理：统一 Jotai（禁止 Zustand）

状态库统一使用 **Jotai** —— 所有新增状态都用 Jotai atom（atom 放在拥有它的功能模块旁）。`immer` 可用于不可变更新。

- 持久化用 `atomWithStorage`，**一个字段一个 key**（如 `global-settings.theme`）。
- 非 React 调用点（loader、api 拦截器）用 `getDefaultStore()` 的 get/set，或模块导出的兼容对象（见 `globalSettingsStore.getState()` 模式）。
- 兼容旧调用方的 store（useGlobalSettings、useColorControl、useArticleViewerStore 等）以「atom 为状态本体 + 薄 hook 暴露旧 API」的方式存在；**不要再新增 Zustand store**（依赖已移除）。
- `src/dev/utils/migrateZustandStorage.ts`：一次性把旧 Zustand persist 单 key 迁到 Jotai 多 key，在 main.tsx 顶部调用。新增曾用 zustand 的历史 key 迁移时在这里补条目。

### UI 栈

- **Tailwind CSS v4** + **shadcn/ui**（new-york 风格）+ **Radix UI** 原语
- **Lucide React** 图标；`cn()` 在 `@shadcn/lib/utils`（clsx + tailwind-merge）
- shadcn 组件：`src/dev/shadcn/components/ui/`；MDX 样式化组件：`src/dev/components/mdx/`
- shadcn 配置在 `components.json`（别名指向 `@/dev/shadcn/...`）

### 样式架构（五层规范，新组件强制遵循）

| 层 | 工具 | 用途 |
|---|---|---|
| ① 设计 Token | CSS Variables（`@theme` + themes.css） | 颜色、字号、圆角、间距等全局标量 |
| ② 静态 UI | Tailwind | 布局、排版、断点、hover、离散状态 |
| ③ 实时动态标量 | React inline style 写 CSS 变量 | 坐标、缩放、透明度、进度等高频值 |
| ④ 动画/手势 | Motion for React | spring、drag、layout 过渡、enter/exit |
| ⑤ 复杂 CSS/SVG | CSS Modules / @emotion | keyframes、深层 selector、3D |

**Emotion 定位**：存量兼容层（pubComponents 大量使用 css prop），新代码不作为默认。**核心规则**：JS 计算数值 → 写入 CSS 变量 → CSS/Tailwind 消费变量；不要把高频变化的数值传给 Emotion 插值。

**CSS 变量命名**：全局 token 用 `--color-* / --radius-* / --font-*`（定义在 :root / [data-theme]）；组件动态变量一律带组件名前缀，定义在需要的最小 DOM 子树上。

### 主题系统

主题通过 `<html>` 上的 `data-theme` 属性设置（**不是** class）。支持 light、dark、system 等。CSS 变量使用 **oklch** 色彩空间。Google 色板在 `@assets/colors/googleColors`。

### 字体系统（免流量懒加载 + 独立字体仓库）

字体资产**不在本仓库**，托管在独立公开仓库 `guohub8080/guohub-fonts`，按用途分区：`cjk/`（中日韩，cn-font-split 分片）、`english/`（拉丁/等宽）。**不要把字体文件提交进本仓库**。

- **加载架构**：核心模块 `src/dev/store/useGlobalSettings/webfontLoader.ts`。默认**纯系统字体栈、零字体流量**；只有启用了某个 web 字体才按族懒注入该族 CSS（`font-display: swap` 渐进增强）。
- **四层 CDN 自动降级**：jsDelivr 主域 → fastly（大陆优化）→ guohub-fonts.pages.dev → guohub8080.github.io/guohub-fonts（兜底）。
- **新增字体族**：在 guohub-fonts 处理后，本仓库 `webfontLoader.ts` 的 WEBFONT_REGISTRY 加一行 + `webfontCatalog.ts` 补目录条目（key 必须与 CSS `font-family` 名一致）。
- 字体目录数据（`webfontCatalog.ts`）驱动 Settings 页的 `FontSelect` 分组下拉；站长默认字体在 `defaultValues.ts` 配置。

### 路径别名

在 `vite.config.ts`、`scripts/sync-publisher-tsconfig.cjs`（STATIC_PATHS → tsconfig.publisher.json）两处配置一致 —— 新增别名时两处都要同步。`tsconfig.app.json` extends `tsconfig.publisher.json` 自动继承。

主要别名：`@` → `src/`，`@dev`、`@apps`、`@comps`、`@assets`、`@utils`、`@api`、`@styles`、`@shadcn`、`@books`、`@mdx`、`@pub-html`、`@pub-svg`、`@sns`、`@pub-utils`、`@svg-anim`、`@book-svg-tool`、`@book-comps`、`@articles`、`@publishers`，以及各 publisher 私有配置声明的动态别名。可解析扩展名 `[".ts", ".tsx", ".js", ".jsx", ".mdx", ".md"]`。

## 规范

### 类型与空值判断：统一用 es-toolkit（禁止 lodash）

**所有源码一律用 [es-toolkit](https://es-toolkit.slash.me/)，禁止 lodash**（依赖已移除）。

- **isXxx 谓词**统一从 `es-toolkit/predicate` 导入（isNil、isNotNil、isUndefined、isString、isNumber、isFunction、isDate、isPlainObject 等）
- **仅 predicate 没有的**才用 `/compat`：`defaultTo`、`isArray`、`isEmpty`、`isInteger`、`isObject`，以及 lodash 兼容函数 `range/max/round/random/chunk`
- 一个文件同时用到两类时分两行写（predicate 一行、compat 一行）
- 非空判断用 `isNotNil`（类型守卫），判断为空仍用 `isNil`
- 空值默认用 `defaultTo(x, fallback)`，禁止 `??`
- 主动赋空值用 `void 0`，禁止直接写 `undefined`

### 路径导入规范

- **禁止超过两层的相对路径**（`../../../`）；必须用路径别名
- 同目录/相邻目录允许 `./Component`、`../Component`

### 其他

- **语言**：UI 文案、内容和大部分注释都是**中文**。
- **纯浏览器 Web 应用**（无原生壳），按 Web 标准开发，注意移动端浏览器兼容。

## 微信公众号兼容（expubgo 核心领域）

### HTML/CSS 白名单限制

微信会**过滤删除**：所有 `position`（relative/absolute/fixed/sticky）、`calc()`、部分伪元素。支持：flex 布局全套、盒模型、颜色背景、文字属性、`aspect-ratio`、`object-fit`、`opacity`、`background-image`。

**替代方案**：元素叠加用**负 margin**（logo 容器占固定高度 + 内容 `marginTop: -高度` 向上偏移）；定位用 flex；calc 用百分比。

### 第三方 HTML → React 组件转换规范

- 语义化标签替换：`<div>` → `<section>`；`<a>`/`<button>` → `<section>`/`<span>`（去交互），语义属性（data-testid 等）提取到注释，保留 aria-label
- 样式合并：按类顺序合并 CSS 类，内联样式最后覆盖，全部转 `CSSProperties` 对象
- 颜色/单位保持原始格式（rgb/十六进制/hsl 原样）；数字无单位、字符串带单位
- SVG 图标直接内联固定尺寸
- 组件文件结构：组件代码在前，`==== Styles ====` 分隔注释后集中放样式对象；相似样式用展开运算符继承
- 转换后的参考文件命名 `参考.tsx`，放在原始 `参考.md` 同目录

### SVG 白名单

微信公众号 SVG 属性有严格白名单（《中华人民共和国融媒体SVG交互设计技术规范》，参考 fudan.design/svg.html）。白名单数据在 `src/dev/pubUtils/genSvgKeySplines/svgAttrWhiteList.ts`。

## 安全区

整个 UI 围绕安全区构建。`index.html` 的 viewport meta **必须**包含 `viewport-fit=cover`（否则 iOS Safari 的 `env(safe-area-inset-*)` 恒为 0，静默失效）。导航栏吸收 `safe-area-inset-top`，`<main>` 吸收 bottom（横屏还有 left/right）；这些容器**永远不要写死顶部/底部 padding**。新增全屏/fixed/sticky 表面时先拿安全区对照检查。

## 工作流

- 每次对话结束后，**自动 commit 当前所有未提交的改动**（`git add -A`）。提交信息遵循 **Conventional Commits**（如 `feat(...)`、`refactor(...)`）。
- **暂时只 commit、不 push**：绝对禁止 `git push`（除非用户明确要求）。
- **不要每次改动后都跑 `pnpm build`**：轻量验证用 `npx tsc --noEmit -p tsconfig.app.json`；全量 `pnpm build` 仅在大范围重构、依赖变更、或用户明确要求时才跑。
- pre-commit hook 会 lint **暂存文件**（warning 放行、error 拦截）——首次触碰有预存 lint error 的旧文件时需顺带修复它们。

### 已知坑（实测踩过）

- **Mimosa hook 会拦截 commit**：高危误报（如构建产物里的模式匹配）或预存问题会阻断提交。工作区根目录的 `.mimosa/`、`.video_agent/` 已 gitignore；被拦时按 hook 提示修复后重试。`git add -A` 不会加它们（已忽略）。
- **根 `tsconfig.json` 是 solution 式空壳**（files:[] + references）：`npx tsc --noEmit`（无 -p）检查不到任何东西；真实验证必须 `npx tsc --noEmit -p tsconfig.app.json`。
- **预存类型错误尾巴**：src 下有约 158 个预存 tsc 错误（PropsSettings 的防御性字段、书籍示例与当前 lib API 的偏差等，logiguo 侧同样存在）。验证标准是**不新增**，顺手修复欢迎。
- **`getImgSizeAsync`/`getImgSizeByDefault` 在普通函数里调 hook**（渲染期无条件调用的既有模式），带 eslint-disable 注释，重构时注意保持调用时序。
- 改 `package.json`/`vite.config.ts` 等配置文件用 Write/Edit 工具，Bash 直接写会被 Mimosa PreToolUse 拦截；**Bash sed 改 *.ts/tsx 也会被拦**，源码改动一律走 Edit 工具。

## 联系方式

作者：guohub@foxmail.com · Bilibili：@方块郭

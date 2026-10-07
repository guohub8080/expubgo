# AGENTS.md

为在本仓库（**expubgo** —— 纯 Web 应用；GitHub 仓库 [guohub8080/expubgo](https://github.com/guohub8080/expubgo)）中工作的 AI agent 提供指引。

## 命令

包管理器：**pnpm**（本机 10.23.0，回归定版，实测 install/build/预渲染全绿）。**没有配置测试框架**。

**版本策略（10.23.0，勿升 11/12）**：刻意**不设 `packageManager` 字段**——四镜像平台读它会走 corepack 路径，而各平台 corepack 兼容性不可控；CI 统一 `npm install -g pnpm@10.23.0`。**12 系禁用**：其供应链检查（minimumReleaseAge/trustPolicy）查包元数据不携带 npmrc 凭据，对私有 GitHub Packages 必 401；10.30.3 纯 JS 版另有 Node 启动死循环。lockfile 9.0 格式任何 pnpm ≥10 可读。本机版本自管理已写死关闭（`~/Library/Preferences/pnpm/rc` 的 `manage-package-manager-versions=false`）。升级/换版本：`npm install -g pnpm@<版本> --registry=https://registry.npmmirror.com`（npmjs 直连慢）。

```bash
pnpm dev                  # 启动 Vite 开发服务器（固定端口 6768，自动清理占用进程）
pnpm build                # 本地调试构建（产物 → dist/）
pnpm build:github-pages   # GitHub Pages 专属（base: /expubgo/，产物 → github-pages/）
pnpm lint                 # ESLint（--max-warnings 0）
PUBLISHERS=<name> pnpm pkg  # 选择性构建：只打包指定 publisher 的单文件产物（dist-single-html/，不走预渲染）
```

构建产物按平台各建各出（`BUILD_OUT_DIR` 注入产物目录，命令/目录同名一一对应）：

| 平台 | 构建命令 | 产物目录 | base | 部署机制 | 地址 |
|---|---|---|---|---|---|
| GitHub Pages | `pnpm build:github-pages`（别名 `pnpm gh`） | `github-pages/` | `/expubgo/` | deploy.yml（push 自动触发，Pages 工作流） | guohub8080.github.io/expubgo/ |
| Cloudflare Pages | `pnpm build:cloudflare-pages` | `cloudflare-pages/` | `/` | deploy-mirrors.yml（CI 构建后 wrangler 推送） | expubgo.pages.dev |
| Netlify | `pnpm build:netlify-pages` | `netlify-pages/` | `/` | deploy-mirrors.yml（CI 构建后 netlify-cli 推送） | expubgo.netlify.app |
| Vercel | `pnpm build:vercel-pages` | `vercel-pages/` | `/` | Vercel Git 集成面板自建（vercel.json 指定命令与产物目录） | expubgo.vercel.app |

本地默认 `pnpm build` → `dist/`（日常调试用）。CF/Netlify 转 CI 推送的原因：其 Git 自动构建的 auto-install 先于一切用户配置，无法注入私有包认证（pnpm 不展开项目级凭据）。当前四份产物中仅 GitHub 的 base 不同，其余三份相同——结构上先分开，各平台可独立演化（如注入 VITE_* 镜像标识）。产物目录均已 gitignore，仓库永远只有源码。

路由是 **BrowserRouter 真路径**（无井号，`/home` 即地址），资源 base 根域镜像为绝对 `/`（预渲染产生嵌套目录页，`./` 相对基准会在深层路径错层；单文件模式独占 `./`）。**单文件 pkg 产物保留 hash 路由**（file:// 双击直开无服务器，真路径无文件可命中；`__SINGLE_FILE__` 构建期常量分流，见 `router/index.tsx`）。

**未知路径/深链回退**（四镜像各异）：GH Pages / Cloudflare 以 各产物目录的 `404.html`（预渲染 404 设计）应答未知路径，浏览器路由在**原 URL** 水合——未匹配渲染 NotFound 404 页（apps/NotFound.tsx，含回首页/返回上页按钮，不自动跳转），`/view/:netPublisher/:netArticle` 动态参数路由直接渲染文章；CF/Netlify 经 `_redirects`、Vercel 经 `vercel.json` 将 `/view/*` 分流到壳（200）。**hash 时代的外部分享链接**（`/#/x`）由各页注入的遗留重定向脚本折算成 `/x`（见 prerender.mjs 的 legacyHashRedirect）。

## 预渲染水合管线（pnpm build 尾段）

`vite build` 之后 `scripts/prerender.mjs` 追加一个 SSG pass，**无新依赖**（react-router v7 官方 SSR API + react-dom/server）：

- **共享路由树**：`src/dev/router/routes.tsx` 导出 `mainRoutes`（纯数据）——浏览器侧 `router/index.tsx` 用 `createHashRouter` 消费，预渲染侧 `scripts/prerender/entry.server.tsx` 用 `createStaticHandler/createStaticRouter/StaticRouterProvider` 消费。同树保证水合结构对齐
- **逐路径产出**：`listPrerenderPaths()` 从路由树静态枚举叶子路径（跳过参数段/通配/index 重定向），每条渲染成 `<产物目录>/<path>/index.html`（模板=构建壳，`#root` 带 `data-prerendered="true"`，加载屏标记被替换）。`main.tsx` 据此分流：`hydrateRoot`（预渲染页）或 `createRoot`（壳页/404）
- **hash 桥已退役**：真路径路由下不需要；改为注入遗留 hash 重定向（老分享链接 `#/x` → `/x`，GH Pages 变体拼回 `/expubgo` 前缀）
- **404 兜底**：`<产物目录>/404.html` = 纯壳，宿主以它应答未知路径 → 浏览器路由在原 URL 水合（动态参数路由直渲染，未匹配渲染 NotFound 404 页——404.html 只是引导壳，404 界面本体是水合后的 React 组件）；Vercel/Netlify 另有 200 回退配置（vercel.json / _redirects）
- **优雅回落**：单页渲染失败只跳过该路径（回落 SPA 行为），`prerender.mjs` 里的 `EXCLUDE` 收录已知不可渲染页
- **SSR 构建**（`vite.prerender.config.ts`）：别名/define 与浏览器构建共享（`vite.config.ts` 导出），`dedupe: ['react','react-dom']` 必抄（link 包双 React 实例坑），`ssr.noExternal: true`（前端 ESM 包的无扩展名导入 Node 解析不了）
- **Node 垫片**（`scripts/prerender/shims.node.ts`）：window/document/navigator 等最小桩（es-toolkit 规范：defaultTo/isNil），必须保持 entry.server 的第一条 import

**组件约定**：`createPortal` 在 SSR 里直接抛错——portal 组件必须挂载守卫（`useState(false)` + `useEffect` 置位，SSR 渲染 null），参照 `BookSide.tsx` / `Navigation/index.tsx` 的 `portalMounted` 模式；**不要**用 `!isUndefined(document)` 判断（预渲染 Node 有 DOM 垫片，判断会误判）。

## 架构

### 目录结构

- `src/dev/` —— 主 React 应用（apps、components、stores、router、styles、utils、shadcn UI、pubComponents 发布组件库、pubUtils 发布工具）
- `src/books/{Name}/` —— 纯内容的「书」章节，由约定式 loader 发现
- `publishers/{name}/` —— publisher 内容与组件（文章 + components + tools + publisher.config.ts）
- `src/dev/articles/` —— 文章系统核心（articlesLoader、publisher 注册）

> 微信交互组件/SMIL 生成器另有独立工具库 `@guohub8080/expub-tool`（私有，仓在 `/Users/guo/WebstormProjects/expub-tool`）。
> - **正式消费（现行）**：package.json 依赖 `^0.2.0`，走 `.npmrc` 的 GitHub Packages 注册表；认证经环境变量 `NODE_AUTH_TOKEN`（classic PAT 勾 read:packages）——CI 工作流已引用 `secrets.NODE_AUTH_TOKEN`（需在仓库 Settings → Secrets and variables → Actions 配置），Cloudflare Pages 在项目环境变量配置；本地安装前 `export NODE_AUTH_TOKEN=<PAT>`。**禁止把 `link:` 写回 package.json**（CI 无隔壁仓库，链接悬空必炸）
> - **本地敏捷开发**：临时叠加用 global link——expub-tool 仓内 `corepack pnpm link --global`，本仓 `pnpm link --global @guohub8080/expub-tool`（只改 node_modules 软链，不落 package.json）；expub-tool 改代码后 `corepack pnpm run build` 刷新 dist 本仓才可见；用完 `pnpm unlink --global` 恢复。详见该仓 AGENTS.md
> - 新代码优先从包导入（如 `@guohub8080/expub-tool/smil` 的 getEaseBezier）；`src/dev/pubUtils/getBezier` 是同源历史副本，存量引用不改
> - **XRay 数据通道库体在 `@guohub8080/expub-tool/xray`**（useDevXRay/devLayoutStore/词典/解值器，迁入）：`src/dev/pubUtils/devLayout` 是宿主薄包装（`setXRayEnabled(import.meta.env.DEV)` 门控 + re-export），五个调用点 import 路径不变；库内不做 dev 门控（import.meta.env 烤进 dist 会带死生产值）
> - link 走 realpath：若从包里引入 **React 组件** 出现 hooks 双实例报错，需在 vite.config.ts 加 `resolve.dedupe: ['react', 'react-dom']`（xray 迁入起包首次带 React 代码，dedupe 已常驻 vite.config）

### 路由

`createHashRouter`（**react-router v7，注意 import 来自 `react-router` 而非 `react-router-dom`**），定义在 `src/dev/router/index.tsx`；路径常量在 `src/dev/router/paths.ts`。布局链：`HashRouter → MainLayout (Navigation + Outlet + Background) → page | BookLayout`。

**懒加载约定**：Home、Settings、MainLayout（含 Navigation）首屏急加载；其余页面一律 `lazy()` + `Suspense`（Lazy 包装 + LoadingFallback）。未匹配路由重定向到 `/home/`。

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
- **manifest**：内容源根下 `manifest.json` —— 源信息 + 作者数组 `publishers`（一源多账号，每作者独立 `/view/<id>` 子页面；含 id/name/avatar/theme/weight）+ 每作者的 `articles`（id/title/date/author?/category?/tag? + 每篇的 HTML 地址，author 缺省回落发布者名）。schema 见 `src/dev/articles/networkSources.ts`。
- **渲染方式**：iframe 直接指向文章 HTML 的 URL（样式完全隔离，SVG 动画照常播放）；壳子侧文章列表/分类/搜索复用现有 ArticleViewer UI，数据来源多一条"运行时 fetch"。
- **工具（tools）继续走插件制度**，网络制度只覆盖文章（React 应用无法 HTML 化）。
- **浏览器策略约束（必须遵守）**：本机源必须用 `localhost` / `127.0.0.1`（https 壳子连 http://localhost 享受 mixed-content 豁免；局域网 IP 会被拦）；本地源 server 必须带 `Access-Control-Allow-Origin: *` 与 `Access-Control-Allow-Private-Network: true` 响应头。
- **源配置存储**：各用户浏览器的 localStorage（atomWithStorage），互不可见。

**实施分三步（每步独立可验证）**：

1. 协议格式定稿（manifest schema + HTML 产物约定）
2. 壳子侧：设置页"内容源"管理 UI + `/#/connect` 路由解析 + 动态文章列表 + iframe 渲染
3. 源侧：`pnpm pub:serve` —— 把本地 publishers 文章静态化为 HTML + 生成 manifest + 起带 CORS 头的本地 server。**编译器用 headless 浏览器快照（playwright 挂载组件 → effects 真实执行 → 序列化最终 DOM），不用 renderToStaticMarkup**（后者跳过 useEffect，setProperty/动画首帧类逻辑会丢失；站长明确不改存量组件代码）。产物仍是纯静态 HTML，壳子协议零感知。交互梯度：静态快照（本路线）→ SVG 动画（产物内原生活）→ 完整交互（单文件构建 pnpm pkg 产物当文章，iframe 完整运行）。**不做浏览器端 JSX/MDX 编译**（eval 破坏隔离、远程依赖复辟 ESM 路线、编译器体积）。pub:serve 双模式：`--dev` = vite dev server + CORS 头 + 动态 manifest 路由 + 每篇文章独立 HTML 入口（effects/交互/HMR 全活，"React 服务器"即 vite 本身，不做实时 renderToStaticMarkup——同样跳过 effects，无意义）；默认 = headless 快照静态产物 + 零逻辑静态 server（可托管任意静态空间）

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

### 字体系统（免流量懒加载）

字体资产**不在本仓库**，由外部字体仓库经多 CDN 分发（源清单、缓存语义与更新流程见 `webfontLoader.ts` 顶部注释）。**不要把字体文件提交进本仓库**。

- **加载架构**：核心模块 `src/dev/store/useGlobalSettings/webfontLoader.ts`。默认**纯系统字体栈、零字体流量**；只有启用了某个 web 字体才按族懒注入该族 CSS（`font-display: swap` 渐进增强）。
- **五层 CDN 延迟赛马**：assets.guohub.top/font（R2 自有域名；桶同时绑的 font.guohub.top 已解绑——其 CDN 曾缓存无 CORS 头的旧响应）→ guohub-fonts.pages.dev → guohub8080.github.io/guohub-fonts → jsDelivr 主域 → fastly（兜底）；首选 800ms 内成功则其余源零请求，全败回落系统栈。
- **新增字体族**：字体产物在外部字体仓库就绪后，本仓库 `webfontLoader.ts` 的 WEBFONT_REGISTRY 加一行 + `webfontCatalog.ts` 补目录条目（key 必须与 CSS `font-family` 名一致）。
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

### 预览页纯度原则（强制）

**预览页面必须原样呈现文章内容（尤其 mmbiz 原始直链）。** 用户的「复制」按钮逻辑 = 页面有什么就复制什么，直接粘贴进微信编辑器发布：

- **禁止**用 vite transform、运行时 replace 等任何方式改写页面里的资源 URL——页面被改写 = 复制产物被污染 = 发布废品（曾因此导致粘贴微信后整篇空白）
- 图片预览问题的解决层在 **vite server**（`/api/wechat-img` 代理，转发时补 Referer）；且 mmbiz 页面内直载大多可行，只有部分账号桶的图校验 Referer
- 复制到微信前的唯一合法变换 = **无变换**

**dev 预览的防盗链修复（现行方案）**：`public/sw-mmbiz.js` Service Worker（由 `src/dev/main.tsx` 仅在 `import.meta.env.DEV` 注册）在网络层把页面发出的 `mmbiz.qpic.cn` 请求透明转发到 `/api/wechat-img` 代理（vite 代理补微信 Referer）。页面 DOM 的链接不动，复制产物保持原样；真图/占位判别不能只看 `onload`（防盗链占位图也是 200，~2KB JPEG），要比对字节数或 PNG magic。

## 安全区

整个 UI 围绕安全区构建。`index.html` 的 viewport meta **必须**包含 `viewport-fit=cover`（否则 iOS Safari 的 `env(safe-area-inset-*)` 恒为 0，静默失效）。导航栏吸收 `safe-area-inset-top`，`<main>` 吸收 bottom（横屏还有 left/right）；这些容器**永远不要写死顶部/底部 padding**。新增全屏/fixed/sticky 表面时先拿安全区对照检查。

## 工作流

- 每次对话结束后，**自动 commit 当前所有未提交的改动**（`git add -A`）。提交信息遵循 **Conventional Commits**（如 `feat(...)`、`refactor(...)`）。
- **commit 与类型检查是两回事**：commit 就直接 commit，**不做类型检查**；类型检查是专门动作，需要验证时单独跑 `npx tsc --noEmit -p tsconfig.app.json`（发版前、怀疑类型问题时）。
- **暂时只 commit、不 push**：绝对禁止 `git push`（除非用户当次明确授权）。
- **不要每次改动后都跑 `pnpm build`**：全量 `pnpm build` 仅在大范围重构、依赖变更、或用户明确要求时才跑。
- **commit 与检查彻底分离**：本地 pre-commit 钩子已移除（每次提交都被 eslint+依赖校验拖慢数秒，收益不匹配）。commit 直接提交；lint / tsc 是独立动作，推送或发版前自行跑一次 `pnpm lint` 和 `npx tsc --noEmit -p tsconfig.app.json`。若误留预存 lint error 的旧文件，`pnpm lint` 全量跑时再修。

### 已知坑（实测踩过）

- **Mimosa hook 会拦截 commit**：高危误报（如构建产物里的模式匹配）或预存问题会阻断提交。工作区根目录的 `.mimosa/`、`.video_agent/` 已 gitignore；被拦时按 hook 提示修复后重试。`git add -A` 不会加它们（已忽略）。
- **根 `tsconfig.json` 是 solution 式空壳**（files:[] + references）：`npx tsc --noEmit`（无 -p）检查不到任何东西；真实验证必须 `npx tsc --noEmit -p tsconfig.app.json`。
- **预存类型错误尾巴**：src 下有约 158 个预存 tsc 错误（PropsSettings 的防御性字段、书籍示例与当前 lib API 的偏差等）。验证标准是**不新增**，顺手修复欢迎。
- **`getImgSizeAsync`/`getImgSizeByDefault` 在普通函数里调 hook**（渲染期无条件调用的既有模式），带 eslint-disable 注释，重构时注意保持调用时序。
- 改 `package.json`/`vite.config.ts` 等配置文件用 Write/Edit 工具，Bash 直接写会被 Mimosa PreToolUse 拦截；**Bash sed 改 *.ts/tsx 也会被拦**，源码改动一律走 Edit 工具。
- **vite 8 dev 下 define 不做静态替换**（实测 + 源码确认）：`__PUB_*__` 等自定义常量在 dev 由 clientInjections 插件以**全局变量**注入 `/@vite/client` 引的 env.mjs（`const defines = {...}` 挂 globalThis），build 才是静态替换。**curl 拉模块看到裸标识符是预期行为不是失效**——验证 define 要看浏览器 `window.__PUB_*` 或 env.mjs 内容；用 curl 判断 define 会误诊（曾因此白查一场"define 回归"）。
- **文章路由用文章自声明的 `meta.id`（哈希式大写 ID），不是中文目录名**：`/view/aieco/NATIONALDAY2026…` 才是合法 URL，`/view/aieco/国庆` 会**静默**落到网络兜底页显示"找不到网络文章"——排查"文章打不开"先 `getAllArticleIds()` 对 ID，别怀疑路由/define。另注意 dev server 重启可能吃到 node_modules/.vite 的陈旧转换缓存（vite 7 时代 define 静态替换的旧产物），表现为"旧 URL 能开、新 URL 不能"的假回归，重启无效时删缓存目录再起。
- **自定义 `@keyframes` 禁止占用 Tailwind 默认动画名（`spin`/`ping`/`pulse`/`bounce`）**（实测）：keyframes 同名是**全局覆盖**——SideList 内联 `<style>` 曾为选中卡片光晕定义 `@keyframes spin` 带 `translate(-50%,-50%)`（绝对定位居中写法），把 Tailwind 的纯 rotate `spin` 整个篡名，全应用 `animate-spin` 的 flex 行内图标（Loader2/RefreshCw）被拽偏半身，症状「转圈图标飘到上边」。已改名 `spin-glow` 修复。自建关键帧一律起专名（`spin-glow`/`spin-xxx`），要默认行为就直接用 `animate-spin` 别重定义。
- **publisher id 不得与网络源撞车**（实测）：本地 `publishers/guohub/` 的 `publisherId` 原为 `"fkg"`，与网络源（fkg-wechat manifest）的 publisher id 同名——统一 articleMap 同 id 合并后，Home 点进「方块郭的想象工厂」路由解析错乱、中栏空白。已把本地 id 改为 `"guohub"`（对齐文件夹名；网络侧 `fkg` 是 URL/书签锚不能动）。**已建自动检测**（`networkSources.collectPublisherIdCollisions` + `articlesLoader.getLocalPublisherIds`）：添加源时撞车直接拒绝接入（NetworkSourceError 报人话），刷新/重连时 console.error + toast 强提醒（不硬拒，免把已存源卡死）；新增本地 publisher 仍需自查 id 不与已连网络源重名。

## 联系方式

作者：guohub@foxmail.com · Bilibili：@方块郭

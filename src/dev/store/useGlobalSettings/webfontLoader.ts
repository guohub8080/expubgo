/**
 * Web 字体懒加载器（免流量字体方案的核心）
 *
 * 字体资产不放在本仓库，托管在独立字体仓库（guohub-fonts，个人跨项目通用），
 * 通过公开 CDN 按「族」懒注入 CSS：
 *
 * - 默认（系统字体栈）不注入任何 CSS，访客零字体流量
 * - 站长/访客启用了某个 web 字体时，才注入该族的 result.css，
 *   分片（unicode-range）由浏览器按页面实际用字惰性下载
 * - 各族均为 font-display: swap，注入前后都不阻塞渲染（渐进增强）：
 *   栈里先写好 family 名，CSS 未加载时浏览器自动跳过、回落系统字体，
 *   加载完成后自动升级为 web 字体观感
 *
 * 多源自动降级（大陆可达性）：jsDelivr 主域不稳定时依次降级到
 * fastly（jsDelivr 官方大陆优化域）→ Cloudflare Pages → 字体仓库
 * 自己的 GitHub Pages（与主站同可达性：读者能打开本站就一定能打开它）。
 * 全部失败则保持系统字体，不影响页面可用。
 *
 * 优先级：访客选择（localStorage）> 站长默认（defaultValues.ts）> 系统栈
 */
import { isNil, isNotNil } from 'es-toolkit/predicate'

/**
 * 字体仓库的 CDN 源列表，按优先级排序，失败自动降级到下一个（见 injectWithFallback）。
 *
 * 1. cdn.jsdelivr.net   —— jsDelivr 主域（多 CDN 联盟，海外最快）
 * 2. fastly.jsdelivr.net —— jsDelivr 官方大陆优化域（同内容，Fastly 边缘网络）
 * 3. *.pages.dev        —— Cloudflare Pages 托管的同一仓库（开通见字体仓库 README；
 *                          未开通时此层 404 会自动跳过，不影响链路。若 Cloudflare
 *                          项目名不是 guohub-fonts，需同步修改此 URL）
 * 4. github.io          —— 字体仓库自身的 GitHub Pages，与主站同可达性，最终兜底
 *
 * jsDelivr 两项必须用 tag 引用（@v1 永久不可变缓存，@main 只缓存 12 小时）。
 * 更新字体：字体仓库改动 → 打新 tag 并 push → 把下面两个 @v1 改成 @v2。
 */
const WEBFONT_CDN_SOURCES = [
  'https://cdn.jsdelivr.net/gh/guohub8080/guohub-fonts@v1.2.1',
  'https://fastly.jsdelivr.net/gh/guohub8080/guohub-fonts@v1.2.1',
  'https://guohub-fonts.pages.dev',
  'https://guohub8080.github.io/guohub-fonts',
] as const

/** 字体族定义：字体仓库内的相对路径 + 可选的专属 CDN 源 */
interface WebFontDef {
  /** 该族在字体仓库内的 CSS 相对路径 */
  path: string
  /**
   * 该族专属的 CDN 源列表（完整 URL，按优先级排列）。
   * 不填则使用全局 WEBFONT_CDN_SOURCES（guohub-fonts 的四层镜像）。
   * 适用场景：字体不在 guohub-fonts 仓库里——例如直接引用 Google Fonts
   * 的 css2 入口、或商用/私有字体托管在自己的对象存储上。
   * 注意：源的 CSS 里分片若是相对路径，会跟随该 CSS 所在域名解析。
   */
  sources?: readonly string[]
}

/** 可懒加载的 web 字体注册表：CSS family 名 → 该族的定义（路径/专属源）
 *  路径相对 guohub-fonts 仓库根，按用途分区：cjk/（中日韩分片）、english/（拉丁/等宽）、symbols/（符号预留）
 *  命名规范与字体仓库一致：全小写连字符，VF 以 -v 结尾；拉丁字族由 fontsource 同步（sync-latin.mjs） */
const WEBFONT_REGISTRY: Record<string, WebFontDef> = {
  // ---- CJK（cn-font-split 分片 / 小体积直存） ----
  'minsans-v': { path: 'cjk/minsans/result.css' },
  'syht-cn-v': { path: 'cjk/syht-cn/result.css' },
  'syst-cn-v': { path: 'cjk/syst-cn/result.css' },
  'smiley-sans': { path: 'cjk/smiley-sans/smiley-sans.css' },
  // ---- 拉丁/等宽（fontsource 分片） ----
  'jb-mono': { path: 'english/jb-mono/jb-mono.css' },
  'cascadia-mono-v': { path: 'english/cascadia-mono-v/cascadia-mono-v.css' },
  'fira-code-v': { path: 'english/fira-code-v/fira-code-v.css' },
  'inconsolata-v': { path: 'english/inconsolata-v/inconsolata-v.css' },
  'martian-mono-v': { path: 'english/martian-mono-v/martian-mono-v.css' },
  'spline-sans-mono-v': { path: 'english/spline-sans-mono-v/spline-sans-mono-v.css' },
  'inter-v': { path: 'english/inter-v/inter-v.css' },
  'source-sans-3-v': { path: 'english/source-sans-3-v/source-sans-3-v.css' },
  'noto-sans-v': { path: 'english/noto-sans-v/noto-sans-v.css' },
  'roboto-flex-v': { path: 'english/roboto-flex-v/roboto-flex-v.css' },
  'open-sans-v': { path: 'english/open-sans-v/open-sans-v.css' },
  'montserrat-v': { path: 'english/montserrat-v/montserrat-v.css' },
  'raleway-v': { path: 'english/raleway-v/raleway-v.css' },
  'manrope-v': { path: 'english/manrope-v/manrope-v.css' },
  'space-grotesk-v': { path: 'english/space-grotesk-v/space-grotesk-v.css' },
  'outfit-v': { path: 'english/outfit-v/outfit-v.css' },
  'plus-jakarta-sans-v': { path: 'english/plus-jakarta-sans-v/plus-jakarta-sans-v.css' },
  'oswald-v': { path: 'english/oswald-v/oswald-v.css' },
  'archivo-v': { path: 'english/archivo-v/archivo-v.css' },
  'public-sans-v': { path: 'english/public-sans-v/public-sans-v.css' },
  'work-sans-v': { path: 'english/work-sans-v/work-sans-v.css' },
  'source-serif-4-v': { path: 'english/source-serif-4-v/source-serif-4-v.css' },
  'newsreader-v': { path: 'english/newsreader-v/newsreader-v.css' },
  'literata-v': { path: 'english/literata-v/literata-v.css' },
  'noto-serif-v': { path: 'english/noto-serif-v/noto-serif-v.css' },
  'roboto-serif-v': { path: 'english/roboto-serif-v/roboto-serif-v.css' },
  'lora-v': { path: 'english/lora-v/lora-v.css' },
  'playfair-display-v': { path: 'english/playfair-display-v/playfair-display-v.css' },
  'merriweather-v': { path: 'english/merriweather-v/merriweather-v.css' },
  'fraunces-v': { path: 'english/fraunces-v/fraunces-v.css' },
  'crimson-pro-v': { path: 'english/crimson-pro-v/crimson-pro-v.css' },
  'bitter-v': { path: 'english/bitter-v/bitter-v.css' },
  'eb-garamond-v': { path: 'english/eb-garamond-v/eb-garamond-v.css' },
  'bodoni-moda-v': { path: 'english/bodoni-moda-v/bodoni-moda-v.css' },
  'cormorant-v': { path: 'english/cormorant-v/cormorant-v.css' },
  'vollkorn-v': { path: 'english/vollkorn-v/vollkorn-v.css' },
  'recursive-v': { path: 'english/recursive-v/recursive-v.css' },
  'caveat-v': { path: 'english/caveat-v/caveat-v.css' },
  'shantell-sans-v': { path: 'english/shantell-sans-v/shantell-sans-v.css' },
  'darker-grotesque-v': { path: 'english/darker-grotesque-v/darker-grotesque-v.css' },
  'rubik-v': { path: 'english/rubik-v/rubik-v.css' },
  'dm-sans-v': { path: 'english/dm-sans-v/dm-sans-v.css' },
  'figtree-v': { path: 'english/figtree-v/figtree-v.css' },
  'lexend-v': { path: 'english/lexend-v/lexend-v.css' },
  'sora-v': { path: 'english/sora-v/sora-v.css' },
  'jost-v': { path: 'english/jost-v/jost-v.css' },
  'quicksand-v': { path: 'english/quicksand-v/quicksand-v.css' },
  'saira-v': { path: 'english/saira-v/saira-v.css' },
  'epilogue-v': { path: 'english/epilogue-v/epilogue-v.css' },
  'anybody-v': { path: 'english/anybody-v/anybody-v.css' },
  'red-hat-mono-v': { path: 'english/red-hat-mono-v/red-hat-mono-v.css' },
  'ubuntu': { path: 'english/ubuntu/ubuntu.css' },
  'ibm-plex-sans': { path: 'english/ibm-plex-sans/ibm-plex-sans.css' },
  'ibm-plex-serif': { path: 'english/ibm-plex-serif/ibm-plex-serif.css' },
  'ibm-plex-mono': { path: 'english/ibm-plex-mono/ibm-plex-mono.css' },
  'libre-baskerville': { path: 'english/libre-baskerville/libre-baskerville.css' },
  'dm-serif-display': { path: 'english/dm-serif-display/dm-serif-display.css' },
  // 专属源示例（字体不在 guohub-fonts 时）：
  // 'noto-serif-sc': { path: '', sources: ['https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@200..900&display=swap'] },
}

/** 已注入的 family → link 元素（去重，一旦加载成功即保留在页面内） */
const injectedLinks = new Map<string, HTMLLinkElement>()

/** 首个加载成功的源（后续族直接从它开始，避免重复试错；仍保留继续降级能力） */
let workingSource: string | null = null

/** 构造某族的候选 URL 列表：专属源直接用；全局源按当前可用优先级拼接路径 */
function buildCandidateUrls(def: WebFontDef): string[] {
  if (isNotNil(def.sources)) return [...def.sources]
  const sources = isNil(workingSource)
    ? [...WEBFONT_CDN_SOURCES]
    : [workingSource, ...WEBFONT_CDN_SOURCES.filter((s) => s !== workingSource)]
  return sources.map((s) => `${s}/${def.path}`)
}

/** 按优先级依次注入 CSS，失败自动换下一个 URL */
function injectWithFallback(family: string, urls: string[]): void {
  const tryNext = (idx: number): void => {
    const url = urls[idx]
    if (isNil(url)) return // 全部源失败：保持系统字体（swap 已保证渲染不受影响）

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = url
    link.onload = () => {
      // 成功的 URL 若属于某个全局源，记住它（后续族直接从它开始，避免重复试错）
      const src = WEBFONT_CDN_SOURCES.find((s) => url.startsWith(s))
      if (isNotNil(src)) workingSource = src
    }
    link.onerror = () => {
      link.remove()
      tryNext(idx + 1)
    }
    injectedLinks.set(family, link)
    document.head.appendChild(link)
  }

  tryNext(0)
}

/**
 * 确保某个 web 字体族的 CSS 已注入 <head>。
 * 未知 family（含 'system'、系统字体名、null）静默忽略——
 * 这样调用方可以直接把字体设置的原始值传进来。
 */
export function ensureWebfont(family: string | null): void {
  if (isNil(family) || family === 'system') return
  const def = WEBFONT_REGISTRY[family]
  if (isNil(def) || injectedLinks.has(family)) return

  injectWithFallback(family, buildCandidateUrls(def))
}

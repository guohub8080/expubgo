/**
 * Web 字体目录（与 guohub-fonts 仓库的 families.json 对齐，编译期固化）
 *
 * 数据源：https://guohub-fonts.pages.dev/families.json
 * 同步方式：字体仓库变动后，把 families.json 的内容回填到本文件的 WEBFONT_CATALOG，
 *          并与 webfontLoader.ts 的 WEBFONT_REGISTRY 路径保持一致。
 *
 * category 语义（决定下拉分组与回退栈）：
 *   sans-serif 无衬线 / serif 衬线 / monospace 等宽 / display 展示 / handwriting 手写
 *   cjk-* 前缀为中日韩字族（本目录按用途细分）
 * kind 语义：vf = 可变字体（支持字重/轴连续调整）/ static = 静态字重
 */

export interface WebFontMeta {
  /** 显示名（下拉里给人看的） */
  label: string
  /** 官方 category（cjk- 前缀为本库扩展） */
  category: 'sans-serif' | 'serif' | 'monospace' | 'display' | 'handwriting' | `cjk-${string}`
  /** vf = 可变字体，static = 静态字重 */
  kind: 'vf' | 'static'
  /** 是否覆盖中文（CJK 族 true；拉丁族 false，中文会走回退栈） */
  coversChinese: boolean
}

export const WEBFONT_CATALOG: Record<string, WebFontMeta> = {
  // ---- CJK（中文） ----
  'minsans-v': { label: 'MiSans', category: 'cjk-sans', kind: 'vf', coversChinese: true },
  'syht-cn-v': { label: '思源黑体', category: 'cjk-sans', kind: 'vf', coversChinese: true },
  'syst-cn-v': { label: '思源宋体', category: 'cjk-serif', kind: 'vf', coversChinese: true },
  'smiley-sans': { label: '得意黑', category: 'cjk-display', kind: 'static', coversChinese: true },
  // ---- 无衬线（拉丁） ----
  'inter-v': { label: 'Inter', category: 'sans-serif', kind: 'vf', coversChinese: false },
  'source-sans-3-v': { label: 'Source Sans 3', category: 'sans-serif', kind: 'vf', coversChinese: false },
  'noto-sans-v': { label: 'Noto Sans', category: 'sans-serif', kind: 'vf', coversChinese: false },
  'roboto-flex-v': { label: 'Roboto Flex', category: 'sans-serif', kind: 'vf', coversChinese: false },
  'open-sans-v': { label: 'Open Sans', category: 'sans-serif', kind: 'vf', coversChinese: false },
  'montserrat-v': { label: 'Montserrat', category: 'sans-serif', kind: 'vf', coversChinese: false },
  'raleway-v': { label: 'Raleway', category: 'sans-serif', kind: 'vf', coversChinese: false },
  'manrope-v': { label: 'Manrope', category: 'sans-serif', kind: 'vf', coversChinese: false },
  'space-grotesk-v': { label: 'Space Grotesk', category: 'sans-serif', kind: 'vf', coversChinese: false },
  'outfit-v': { label: 'Outfit', category: 'sans-serif', kind: 'vf', coversChinese: false },
  'plus-jakarta-sans-v': { label: 'Plus Jakarta Sans', category: 'sans-serif', kind: 'vf', coversChinese: false },
  'oswald-v': { label: 'Oswald', category: 'sans-serif', kind: 'vf', coversChinese: false },
  'archivo-v': { label: 'Archivo', category: 'sans-serif', kind: 'vf', coversChinese: false },
  'public-sans-v': { label: 'Public Sans', category: 'sans-serif', kind: 'vf', coversChinese: false },
  'work-sans-v': { label: 'Work Sans', category: 'sans-serif', kind: 'vf', coversChinese: false },
  'rubik-v': { label: 'Rubik', category: 'sans-serif', kind: 'vf', coversChinese: false },
  'dm-sans-v': { label: 'DM Sans', category: 'sans-serif', kind: 'vf', coversChinese: false },
  'figtree-v': { label: 'Figtree', category: 'sans-serif', kind: 'vf', coversChinese: false },
  'lexend-v': { label: 'Lexend', category: 'sans-serif', kind: 'vf', coversChinese: false },
  'sora-v': { label: 'Sora', category: 'sans-serif', kind: 'vf', coversChinese: false },
  'jost-v': { label: 'Jost', category: 'sans-serif', kind: 'vf', coversChinese: false },
  'quicksand-v': { label: 'Quicksand', category: 'sans-serif', kind: 'vf', coversChinese: false },
  'saira-v': { label: 'Saira', category: 'sans-serif', kind: 'vf', coversChinese: false },
  'epilogue-v': { label: 'Epilogue', category: 'sans-serif', kind: 'vf', coversChinese: false },
  'ibm-plex-sans': { label: 'IBM Plex Sans', category: 'sans-serif', kind: 'static', coversChinese: false },
  'ubuntu': { label: 'Ubuntu', category: 'sans-serif', kind: 'static', coversChinese: false },
  // ---- 衬线（拉丁） ----
  'source-serif-4-v': { label: 'Source Serif 4', category: 'serif', kind: 'vf', coversChinese: false },
  'newsreader-v': { label: 'Newsreader', category: 'serif', kind: 'vf', coversChinese: false },
  'literata-v': { label: 'Literata', category: 'serif', kind: 'vf', coversChinese: false },
  'noto-serif-v': { label: 'Noto Serif', category: 'serif', kind: 'vf', coversChinese: false },
  'roboto-serif-v': { label: 'Roboto Serif', category: 'serif', kind: 'vf', coversChinese: false },
  'lora-v': { label: 'Lora', category: 'serif', kind: 'vf', coversChinese: false },
  'playfair-display-v': { label: 'Playfair Display', category: 'serif', kind: 'vf', coversChinese: false },
  'merriweather-v': { label: 'Merriweather', category: 'serif', kind: 'vf', coversChinese: false },
  'fraunces-v': { label: 'Fraunces', category: 'serif', kind: 'vf', coversChinese: false },
  'crimson-pro-v': { label: 'Crimson Pro', category: 'serif', kind: 'vf', coversChinese: false },
  'bitter-v': { label: 'Bitter', category: 'serif', kind: 'vf', coversChinese: false },
  'eb-garamond-v': { label: 'EB Garamond', category: 'serif', kind: 'vf', coversChinese: false },
  'bodoni-moda-v': { label: 'Bodoni Moda', category: 'serif', kind: 'vf', coversChinese: false },
  'cormorant-v': { label: 'Cormorant', category: 'serif', kind: 'vf', coversChinese: false },
  'vollkorn-v': { label: 'Vollkorn', category: 'serif', kind: 'vf', coversChinese: false },
  'ibm-plex-serif': { label: 'IBM Plex Serif', category: 'serif', kind: 'static', coversChinese: false },
  'libre-baskerville': { label: 'Libre Baskerville', category: 'serif', kind: 'static', coversChinese: false },
  'dm-serif-display': { label: 'DM Serif Display', category: 'serif', kind: 'static', coversChinese: false },
  // ---- 等宽 ----
  'jb-mono': { label: 'JetBrains Mono', category: 'monospace', kind: 'vf', coversChinese: false },
  'cascadia-mono-v': { label: 'Cascadia Mono', category: 'monospace', kind: 'vf', coversChinese: false },
  'fira-code-v': { label: 'Fira Code', category: 'monospace', kind: 'vf', coversChinese: false },
  'inconsolata-v': { label: 'Inconsolata', category: 'monospace', kind: 'vf', coversChinese: false },
  'martian-mono-v': { label: 'Martian Mono', category: 'monospace', kind: 'vf', coversChinese: false },
  'spline-sans-mono-v': { label: 'Spline Sans Mono', category: 'monospace', kind: 'vf', coversChinese: false },
  'red-hat-mono-v': { label: 'Red Hat Mono', category: 'monospace', kind: 'vf', coversChinese: false },
  'ibm-plex-mono': { label: 'IBM Plex Mono', category: 'monospace', kind: 'static', coversChinese: false },
  // ---- 展示/手写 ----
  'anybody-v': { label: 'Anybody', category: 'display', kind: 'vf', coversChinese: false },
  'shantell-sans-v': { label: 'Shantell Sans', category: 'display', kind: 'vf', coversChinese: false },
  'recursive-v': { label: 'Recursive', category: 'display', kind: 'vf', coversChinese: false },
  'caveat-v': { label: 'Caveat', category: 'handwriting', kind: 'vf', coversChinese: false },
  'darker-grotesque-v': { label: 'Darker Grotesque', category: 'display', kind: 'vf', coversChinese: false },
}

/** 下拉分组顺序与标题 */
export const CATEGORY_LABELS: Record<string, string> = {
  'cjk-sans': '中文 · 无衬线',
  'cjk-serif': '中文 · 衬线',
  'cjk-display': '中文 · 标题',
  'sans-serif': '无衬线 Sans',
  'serif': '衬线 Serif',
  'monospace': '等宽 Mono',
  display: '展示 Display',
  handwriting: '手写',
}

/** 按分组顺序输出目录（供 Select 分组渲染） */
export function catalogByCategory(): Array<{ key: string; label: string; fonts: Array<{ family: string; meta: WebFontMeta }> }> {
  const groups = new Map<string, Array<{ family: string; meta: WebFontMeta }>>()
  for (const [family, meta] of Object.entries(WEBFONT_CATALOG)) {
    const arr = groups.get(meta.category) ?? []
    arr.push({ family, meta })
    groups.set(meta.category, arr)
  }
  const order = [...Object.keys(CATEGORY_LABELS), ...[...groups.keys()].filter((k) => !(k in CATEGORY_LABELS))]
  return order
    .filter((k) => groups.has(k))
    .map((k) => ({ key: k, label: CATEGORY_LABELS[k] ?? k, fonts: groups.get(k)! }))
}

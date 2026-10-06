/**
 * 网络内容源（网络连接制度）—— 壳子侧 store 与协议实现
 *
 * 架构依据见 AGENTS.md「网络连接制度」：壳子永远是 HTTP 客户端，主动 fetch
 * 内容源的 manifest.json；每个源可承载多个作者（publishers 数组），每个作者
 * 注册为独立的 publisher，进入自己的 /view/<作者>/<文章> 子页面（iframe 渲染
 * 编译好的 HTML，与本地插件作者同权并列）。
 *
 * 数据流：
 * - networkSourcesAtom（持久化，localStorage）：已添加的源地址列表
 * - networkManifestsAtom（内存，会话级）：各源最近一次成功拉取的 manifest
 * - 添加源时同步 fetch 校验，成功才入列表；manifest 无效/不可达直接报错给 UI
 */
import { atom, useAtomValue, getDefaultStore } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { isNil, isString } from 'es-toolkit/predicate'
import toast from 'react-hot-toast'
import { getDayjs } from '@utils/utDateTime/exDayjs'
import { registerNetworkArticle, unregisterNetworkArticles, getLocalPublisherIds } from './articlesLoader'

/** 网络源 placeholder 组件（文章渲染由 /view/:netPublisher/:netArticle 参数路由的 iframe 承接） */
const NetworkArticleStub = () => null

/** manifest 作者名（string | string[]）折叠成单行字符串——author/摘要等纯文本场景用；
 *  卡片场景（BookCard 的 name）传原值，数组可渲染成两行 */
export function networkPublisherNameToString(name: string | string[]): string {
  return Array.isArray(name) ? name.join('') : name
}

/**
 * 把 manifest 同步进统一 articleMap（网络文章与本地文章在侧栏/搜索/筛选/最新文章上完全一致）。
 * 先按源标记清掉旧注册再全量注册（refresh 场景下文章列表变更也能正确同步）。
 */
function syncManifestToArticleMap(sourceUrl: string, manifest: NetworkManifest): void {
  unregisterNetworkArticles(sourceUrl)
  for (const p of manifest.publishers) {
    for (const a of p.articles) {
      registerNetworkArticle({
        id: a.id,
        title: a.title,
        date: getDayjs(`${a.date} 00:00:00`),
        author: a.author ?? networkPublisherNameToString(p.name),
        subtitle: a.subtitle,
        tag: a.tag,
        category: a.category,
        isSvgArticle: a.isSvgArticle,
        jsx: NetworkArticleStub,
        publisherId: p.id,
        publisherName: p.name,
        _filePath: `${sourceUrl}/${a.html}`,
        _network: sourceUrl,
      })
    }
  }
}

// ============================================ 协议类型（manifest.json schema v1） ============================================

/** manifest 内的单篇文章 */
export interface NetworkManifestArticle {
  /** 文章 id（源内唯一，用作路由段） */
  id: string
  title: string
  /** ISO 日期字符串，如 2026-09-18 */
  date: string
  /** 文章作者（列表显示用）；不填回落该文章所属发布者名 */
  author?: string
  /** 副标题（微信摘要），可选；操作面板「复制副标题」用 */
  subtitle?: string
  category?: string
  tag?: string[]
  /** SVG 交互文章标记：源 frontmatter 写 isSvgArticle: true，注册进 articleMap 后预览面板出现 SVG 专属功能区 */
  isSvgArticle?: boolean
  /** 编译好的文章 HTML 相对源根路径，如 articles/2026-09-18-post.html */
  html: string
}

/** manifest 内的单个作者（注册为独立 publisher） */
export interface NetworkManifestPublisher {
  /** 作者 id（要求与壳子内置/其他源的 publisherId 不冲突，冲突时本地静态路由优先遮蔽） */
  id: string
  /** 显示名（书脊/卡片标题）：字符串 = 单行；字符串数组 = 卡片逐行排（两行卡片） */
  name: string | string[]
  /** 头像相对源根路径，可选 */
  avatar?: string
  /** 头像圆角，可选（'999px'=圆形；缺省壳子按 12px 圆角矩形渲染） */
  avatarRadius?: string
  /** 书本卡片主题色（对齐现有 BookCard 的 PublisherTheme） */
  theme?: {
    spine: [string, string]
    cover: [string, string]
    textColor?: string
  }
  /** 排序权重，可选 */
  weight?: number
  articles: NetworkManifestArticle[]
}

/** 内容源根下的 manifest.json 结构 */
export interface NetworkManifest {
  /** 协议版本，当前为 1 */
  version: number
  publishers: NetworkManifestPublisher[]
}

// ============================================ atoms ============================================

/** 已添加的内容源（持久化；一源一项，url 为源根地址） */
export interface NetworkSource {
  url: string
  addedAt: number
}

export const networkSourcesAtom = atomWithStorage<NetworkSource[]>('network-sources', [])

/** 各源最近一次成功拉取的 manifest（内存态；刷新后由重连/访问时重新拉取） */
export const networkManifestsAtom = atom<Record<string, NetworkManifest>>({})

// ============================================ 协议校验与拉取 ============================================

class NetworkSourceError extends Error {}

/** 校验 manifest 结构，不合法抛错（信息直接展示给用户） */
function validateManifest(data: unknown): NetworkManifest {
  if (typeof data !== 'object' || data === null) throw new NetworkSourceError('manifest 不是有效的 JSON 对象')
  const m = data as Record<string, unknown>
  if (m.version !== 1) throw new NetworkSourceError(`manifest.version 不支持：${String(m.version)}（当前壳子支持 1）`)
  if (!Array.isArray(m.publishers)) throw new NetworkSourceError('manifest.publishers 缺失或不是数组')

  for (const p of m.publishers) {
    const pub = p as Record<string, unknown>
    if (!isString(pub.id) || pub.id === '') throw new NetworkSourceError('存在作者缺少 id')
    // name 支持字符串(单行)或字符串数组(卡片多行),两者皆非法才报错
    const nameOk = isString(pub.name) || (Array.isArray(pub.name) && pub.name.length > 0 && pub.name.every(isString))
    if (!nameOk) throw new NetworkSourceError(`作者 ${String(pub.id)} 缺少 name（字符串或字符串数组）`)
    if (!Array.isArray(pub.articles)) throw new NetworkSourceError(`作者 ${String(pub.id)} 缺少 articles 数组`)
    for (const a of pub.articles) {
      const art = a as Record<string, unknown>
      if (!isString(art.id) || !isString(art.title) || !isString(art.html)) {
        throw new NetworkSourceError(`作者 ${String(pub.id)} 的某篇文章缺少 id/title/html`)
      }
    }
  }
  return m as unknown as NetworkManifest
}

/**
 * 拉取并校验某源的 manifest。
 * @param sourceUrl 源根地址（如 http://localhost:6790），末尾斜杠会被规范化
 */
export async function fetchNetworkManifest(sourceUrl: string): Promise<NetworkManifest> {
  const root = sourceUrl.replace(/\/+$/, '')
  let resp: Response
  try {
    resp = await fetch(`${root}/manifest.json`, { cache: 'no-store' })
  } catch {
    throw new NetworkSourceError('无法连接源（网络不可达或源未开 CORS）——本机源请用 http://localhost:<端口>')
  }
  if (!resp.ok) throw new NetworkSourceError(`源返回 HTTP ${resp.status}（manifest.json 不存在？）`)
  let data: unknown
  try {
    data = await resp.json()
  } catch {
    throw new NetworkSourceError('manifest.json 不是有效的 JSON')
  }
  return validateManifest(data)
}

// ============================================ 写操作（getDefaultStore，非 React 调用点同样可用） ============================================

/**
 * 直接从 localStorage 读已存源（绕开 atomWithStorage 的 hydrate 时序——
 * getDefaultStore 首读返回默认值，异步 hydrate 仅通知订阅者；写操作若基于
 * 未 hydrate 的内存值会覆盖丢失已存源）。
 * 兼容两种落盘格式：jotai v2 实际写裸数组；历史版本曾写 {"state": <值>, "version": 0} 包装。
 */
function readPersistedSources(): NetworkSource[] {
  try {
    const raw = localStorage.getItem('network-sources')
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed as NetworkSource[]
    if (Array.isArray((parsed as { state?: unknown })?.state)) {
      return (parsed as { state: NetworkSource[] }).state
    }
    return []
  } catch {
    return []
  }
}

/**
 * publisher id 撞车检测（实测踩坑：本地 publisher 与网络源同 id 会在 articleMap/
 * 路由层合并错乱，Home 点进后中栏空白）。
 * 检查一个 manifest 的 publishers 是否与 ① 本地 publisher ② 其他网络源撞 id，
 * 返回人话描述列表（空数组 = 无冲突）。
 */
function collectPublisherIdCollisions(sourceUrl: string, manifest: NetworkManifest): string[] {
  const problems: string[] = []
  const localIds = getLocalPublisherIds()
  for (const p of manifest.publishers) {
    if (localIds.has(p.id)) {
      problems.push(`源 ${sourceUrl} 的作者 id「${p.id}」（${networkPublisherNameToString(p.name)}）与本地 publisher 撞车，请改其中一侧的 id`)
    }
  }
  const store = getDefaultStore()
  const others = store.get(networkManifestsAtom)
  for (const [otherRoot, otherManifest] of Object.entries(others)) {
    if (otherRoot === sourceUrl) continue
    const otherIds = new Set(otherManifest.publishers.map((x) => x.id))
    for (const p of manifest.publishers) {
      if (otherIds.has(p.id)) {
        problems.push(`源 ${sourceUrl} 的作者 id「${p.id}」（${networkPublisherNameToString(p.name)}）与已连源 ${otherRoot} 撞车`)
      }
    }
  }
  return problems
}

/**
 * 添加源：先拉取校验 manifest，成功才写入列表并缓存 manifest。
 * 返回拉取到的 manifest 供 UI 展示；失败抛 NetworkSourceError。
 * publisher id 与本地/其他源撞车时直接拒绝接入（防患于入口）。
 */
export async function addNetworkSource(sourceUrl: string): Promise<NetworkManifest> {
  const root = sourceUrl.trim().replace(/\/+$/, '')
  if (!/^https?:\/\//.test(root)) throw new NetworkSourceError('地址需以 http:// 或 https:// 开头')

  const manifest = await fetchNetworkManifest(root)
  const store = getDefaultStore()

  const persisted = readPersistedSources()
  if (persisted.some((s) => s.url === root)) throw new NetworkSourceError('该源已添加')

  // 撞车检测：添加路径硬拒——同 id 合并会在路由层炸出不可预期的空白页
  const collisions = collectPublisherIdCollisions(root, manifest)
  if (collisions.length > 0) throw new NetworkSourceError(collisions.join('；'))

  // 合并基线取 localStorage 实况（而非内存 atom），保证未 hydrate 场景不丢已存源
  store.set(networkSourcesAtom, [...persisted, { url: root, addedAt: Date.now() }])
  store.set(networkManifestsAtom, { ...store.get(networkManifestsAtom), [root]: manifest })
  syncManifestToArticleMap(root, manifest)
  return manifest
}

/** 删除源（同时清掉缓存的 manifest 与注册进 articleMap 的文章；合并基线同 add 取 localStorage 实况） */
export function removeNetworkSource(sourceUrl: string): void {
  const store = getDefaultStore()
  const root = sourceUrl.replace(/\/+$/, '')
  const persisted = readPersistedSources()
  store.set(networkSourcesAtom, persisted.filter((s) => s.url !== root))
  const manifests = { ...store.get(networkManifestsAtom) }
  delete manifests[root]
  store.set(networkManifestsAtom, manifests)
  unregisterNetworkArticles(root)
}

/** 重连某个已存源（刷新其 manifest 缓存并同步 articleMap）；失败抛错，不影响已存列表。
 *  撞车检测在此只提醒不拒绝（源已存在，硬拒会把用户卡死）：console.error + toast 强提示。 */
export async function refreshNetworkSource(sourceUrl: string): Promise<NetworkManifest> {
  const root = sourceUrl.replace(/\/+$/, '')
  const manifest = await fetchNetworkManifest(root)
  const collisions = collectPublisherIdCollisions(root, manifest)
  if (collisions.length > 0) {
    console.error(`[networkSources] publisher id 撞车：${collisions.join('；')}`)
    toast.error(`publisher id 撞车：${collisions[0]}${collisions.length > 1 ? `（等 ${collisions.length} 处）` : ''}`, { duration: 8000 })
  }
  const store = getDefaultStore()
  store.set(networkManifestsAtom, { ...store.get(networkManifestsAtom), [root]: manifest })
  syncManifestToArticleMap(root, manifest)
  return manifest
}

/** 重连某批源（刷新其 manifest 缓存）；失败抛错，不影响已存列表 */
export async function refreshNetworkSources(sources: NetworkSource[]): Promise<void> {
  await Promise.allSettled(sources.map((s) => refreshNetworkSource(s.url)))
}

/**
 * 应用启动时恢复网络源：拉取本会话尚无 manifest 的已存源并注册进 articleMap。
 * main.tsx 调用一次；在此之前的恢复只挂在 Home 挂载 effect 上，
 * 直接进文章列表等入口会话内不经过 Home，网络文章就不进列表（已修）。
 */
export function restoreNetworkSources(): void {
  const store = getDefaultStore()
  const persisted = readPersistedSources()
  if (persisted.length === 0) return
  const manifests = store.get(networkManifestsAtom)
  const missing = persisted.filter((s) => isNil(manifests[s.url]))
  if (missing.length === 0) return
  refreshNetworkSources(missing)
}

// ============================================ 查询（供路由/页面消费） ============================================

/** 全部（源 × 作者）展平：每项带源根，供 /view/<作者>/<文章> 解析 */
export interface NetworkPublisherRef {
  sourceUrl: string
  publisher: NetworkManifestPublisher
}

export function getNetworkPublishers(): NetworkPublisherRef[] {
  const manifests = getDefaultStore().get(networkManifestsAtom)
  const refs: NetworkPublisherRef[] = []
  for (const [sourceUrl, manifest] of Object.entries(manifests)) {
    for (const publisher of manifest.publishers) {
      refs.push({ sourceUrl, publisher })
    }
  }
  return refs
}

/** 解析网络文章：作者 id + 文章 id → iframe 的完整 URL；找不到返回 null */
export function resolveNetworkArticleUrl(publisherId: string, articleId: string): string | null {
  for (const { sourceUrl, publisher } of getNetworkPublishers()) {
    if (publisher.id !== publisherId) continue
    const article = publisher.articles.find((a) => a.id === articleId)
    if (isNil(article)) continue
    return `${sourceUrl}/${article.html.replace(/^\.\//, '').replace(/^\/+/, '')}`
  }
  return null
}

/** 某作者的 manifest 元信息（头像完整 URL 等）；供 UI 消费 */
export function getNetworkPublisherMeta(publisherId: string): NetworkPublisherRef | null {
  return getNetworkPublishers().find((r) => r.publisher.id === publisherId) ?? null
}

// ============================================ 消费侧薄 hook ============================================

export function useNetworkSources() {
  return useAtomValue(networkSourcesAtom)
}

export function useNetworkManifests() {
  return useAtomValue(networkManifestsAtom)
}

export function useNetworkSourceActions() {
  return {
    add: addNetworkSource,
    remove: removeNetworkSource,
    refresh: refreshNetworkSource,
  }
}

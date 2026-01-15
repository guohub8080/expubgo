import { Dayjs } from 'dayjs'
import { ReactNode, ComponentType } from 'react'
import { isString, isFunction } from 'es-toolkit/predicate'
import { publisherConfigModules, publisherArticleModules } from './publisherBranches.generated'

// ============================================ 类型定义 ============================================

export interface ArticleMeta {
  title: string
  date: Dayjs
  id: string
  subtitle?: string
  author?: string
  tag?: string[]
  category?: string
}

export interface ArticleData extends ArticleMeta {
  jsx: ComponentType
  publisherId?: string
  publisherName?: string | string[]
  _filePath: string
  _textContent?: string
}

export interface ArticleListItem {
  id: string
  title: string
  date: Dayjs
  author?: string
  tag?: string[]
  category?: string
  publisherId?: string
  path: string
  filePath: string
}

interface PublisherConfig {
  publisherId: string
  publisherName?: string | string[]
  articleDir?: string
  [key: string]: unknown
}

// ============================================ 文章存储 ============================================

const articleMap = new Map<string, ArticleData>()

// ============================================ 工具函数 ============================================

function generateUUID(): string {
  // 生成 32 位大写十六进制 UUID（无连字符）
  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16).toUpperCase()
  })
}

function validateArticleMeta(meta: Record<string, unknown>, filePath: string): ArticleMeta | null {
  // 检查必填字段
  if (!meta.title || !isString(meta.title)) {
    console.warn(`[articlesLoader] 跳过: ${filePath} - 缺少 title`)
    return null
  }

  if (!meta.date || !isFunction((meta.date as Dayjs).format)) {
    console.warn(`[articlesLoader] 跳过: ${filePath} - 缺少 date 或格式不正确`)
    return null
  }

  let id = meta.id
  if (!id || !isString(id)) {
    id = generateUUID()
  }

  return {
    title: meta.title as string,
    date: meta.date as Dayjs,
    id: id as string,
    subtitle: meta.subtitle as string | undefined,
    author: meta.author as string | undefined,
    tag: Array.isArray(meta.tag) ? meta.tag as string[] : undefined,
    category: meta.category as string | undefined,
  }
}

/**
 * 判断文章是否是 demo/示例文章（mock publisher 的占位文章）
 */
function isDemoArticle(id: string, title: string): boolean {
  // ID 包含 demo
  if (id.toLowerCase().includes('demo')) return true
  // 标题包含"示例文章"
  if (title.includes('示例文章')) return true
  return false
}

function registerArticle(data: ArticleData) {
  if (articleMap.has(data.id)) {
    console.warn(`[articlesLoader] ID 冲突: ${data.id} 已存在，跳过 ${data._filePath}`)
    return
  }
  // 跳过 demo 文章
  if (isDemoArticle(data.id, data.title)) {
    console.log(`[articlesLoader] 跳过 demo 文章: ${data.id} - ${data.title}`)
    return
  }
  // ID 不允许以下划线开头（下划线开头的 ID 保留给系统内部使用，如 _empty）
  if (data.id.startsWith('_')) {
    console.warn(`[articlesLoader] ID 以下划线开头，跳过: ${data.id} - ${data._filePath}`)
    return
  }
  articleMap.set(data.id, data)
}

// ============================================ 扫描逻辑 ============================================

/**
 * 扫描单个文件
 */
function scanFile(
  module: Record<string, unknown>,
  filePath: string,
  publisherInfo?: { id: string; name?: string | string[] }
) {
  const ext = filePath.split('.').pop()?.toLowerCase()

  // 处理 .tsx / .jsx
  if (ext === 'tsx' || ext === 'jsx') {
    const defaultExport = module.default
    if (!defaultExport || typeof defaultExport !== 'object') {
      console.warn(`[articlesLoader] 跳过: ${filePath} - 没有默认导出`)
      return
    }

    const meta = validateArticleMeta(defaultExport as Record<string, unknown>, filePath)
    if (!meta) return

    const jsx = (defaultExport as Record<string, unknown>).jsx
    if (!jsx || !isFunction(jsx)) {
      console.warn(`[articlesLoader] 跳过: ${filePath} - 缺少 jsx 组件`)
      return
    }

    registerArticle({
      ...meta,
      jsx: jsx as ComponentType,
      publisherId: publisherInfo?.id,
      publisherName: publisherInfo?.name,
      _filePath: filePath,
    })
    return
  }

  // 处理 .mdx
  if (ext === 'mdx') {
    // MDX 文件导出的是变量，不是默认对象
    const title = module.title
    const date = module.date
    const id = module.id || generateUUID()
    const subtitle = module.subtitle
    const author = module.author
    const tag = module.tag
    const category = module.category

    const meta = validateArticleMeta(
      { title, date, id, subtitle, author, tag, category } as Record<string, unknown>,
      filePath
    )
    if (!meta) return

    // MDX 的默认导出是内容组件
    const MDXContent = module.default
    if (!MDXContent || !isFunction(MDXContent)) {
      console.warn(`[articlesLoader] 跳过: ${filePath} - MDX 没有默认导出组件`)
      return
    }

    registerArticle({
      ...meta,
      jsx: MDXContent as ComponentType,
      publisherId: publisherInfo?.id,
      publisherName: publisherInfo?.name,
      _filePath: filePath,
    })
    return
  }
}

/**
 * 判断文件夹是否是文章单位（包含 index.tsx/index.jsx/index.mdx）
 */
function isArticleUnit(folderPath: string, modules: Record<string, Record<string, unknown>>): boolean {
  const indexExts = ['index.tsx', 'index.jsx', 'index.mdx']
  return indexExts.some(ext => {
    const indexPath = `${folderPath}/${ext}`
    return modules[indexPath] !== undefined
  })
}

/**
 * 递归扫描文件夹
 */
function scanFolder(
  folderPath: string,
  modules: Record<string, Record<string, unknown>>,
  publisherInfo?: { id: string; name?: string | string[] }
) {
  // 检查是否是文章单位
  if (isArticleUnit(folderPath, modules)) {
    // 优先使用 index.tsx，然后是 index.jsx，最后是 index.mdx
    const indexFiles = ['index.tsx', 'index.jsx', 'index.mdx']
    for (const indexFile of indexFiles) {
      const indexPath = `${folderPath}/${indexFile}`
      if (modules[indexPath]) {
        scanFile(modules[indexPath], indexPath, publisherInfo)
        return
      }
    }
  }

  // 不是文章单位，继续遍历子内容
  const processedFolders = new Set<string>()

  for (const filePath in modules) {
    if (!filePath.startsWith(folderPath + '/')) continue

    const relativePath = filePath.slice(folderPath.length + 1)
    const firstSegment = relativePath.split('/')[0]

    // 如果是直接子文件（不在子文件夹里）
    if (!relativePath.includes('/')) {
      scanFile(modules[filePath], filePath, publisherInfo)
      continue
    }

    // 如果是子文件夹，只处理一次
    const subFolderPath = `${folderPath}/${firstSegment}`
    if (!processedFolders.has(subFolderPath)) {
      processedFolders.add(subFolderPath)
      scanFolder(subFolderPath, modules, publisherInfo)
    }
  }
}

// ============================================ 加载入口 ============================================

/**
 * 加载所有文章
 */
function loadAllArticles() {
  // 1. 加载默认文章（src/dev/articles/examples/），publisherId 统一为 'expubgo'
  const defaultModules = import.meta.glob('./examples/**/*.{tsx,jsx,mdx}', { eager: true })
  scanFolder('./examples', defaultModules as Record<string, Record<string, unknown>>, {
    id: 'expubgo',
    name: '系统默认',
  })

  // 2. 加载 publisher 配置与文章模块
  // 按名字拆分的 glob 分支在生成文件 publisherBranches.generated.tsx 中（含本地目录名，已 gitignore），
  // 公共代码只消费其导出，选择性构建（tree-shake）由生成文件内的 __PUB_<NAME>__ 守卫完成
  const publisherConfigs = publisherConfigModules as Record<string, { default: PublisherConfig }>
  const allPublisherModules = publisherArticleModules

  for (const configPath in publisherConfigs) {
    const config = publisherConfigs[configPath].default
    if (!config.articleDir) continue

    const publisherDir = configPath.replace('/publisher.config.ts', '')
    const articleDir = `${publisherDir}/${config.articleDir.replace(/^\.\//, '')}`

    // 过滤出当前 publisher 的文章模块
    const publisherModules: Record<string, Record<string, unknown>> = {}
    for (const modulePath in allPublisherModules) {
      if (modulePath.startsWith(articleDir + '/')) {
        publisherModules[modulePath] = allPublisherModules[modulePath]
      }
    }

    if (Object.keys(publisherModules).length === 0) {
      console.warn(`[articlesLoader] Publisher ${config.publisherId} 的文章目录为空: ${articleDir}`)
      continue
    }

    scanFolder(articleDir, publisherModules, {
      id: config.publisherId,
      name: config.publisherName,
    })
  }

  console.log(`[articlesLoader] 共加载 ${articleMap.size} 篇文章`)
}

// 初始化加载
loadAllArticles()

// ============================================ 导出 API ============================================

/**
 * 根据文章 ID 获取文章数据
 */
export function getArticleById(articleId: string): ArticleData | undefined {
  return articleMap.get(articleId)
}

/**
 * 获取所有文章 ID
 */
export function getAllArticleIds(): string[] {
  return Array.from(articleMap.keys())
}

/**
 * 获取文章列表（用于侧边栏显示）
 */
export function getArticleListItems(): ArticleListItem[] {
  const items: ArticleListItem[] = []

  for (const [id, data] of articleMap) {
    // 生成路径: /view/<publisherId>/<id>
    const publisher = data.publisherId || 'expubgo'
    const path = `/view/${publisher}/${id}`

    items.push({
      id,
      title: data.title,
      date: data.date,
      author: data.author,
      tag: data.tag,
      category: data.category,
      publisherId: publisher,
      path,
      filePath: data._filePath,
    })
  }

  // 按日期降序排序（最新的在前）
  items.sort((a, b) => b.date.valueOf() - a.date.valueOf())

  return items
}

/**
 * 获取所有标签（去重排序）
 */
export function getAllTags(): string[] {
  const tagSet = new Set<string>()
  for (const data of articleMap.values()) {
    data.tag?.forEach(tag => tagSet.add(tag))
  }
  return Array.from(tagSet).sort((a, b) => a.localeCompare(b, 'zh-CN'))
}

/**
 * 获取所有分类（去重排序）
 */
export function getAllCategories(): string[] {
  const categorySet = new Set<string>()
  for (const data of articleMap.values()) {
    if (data.category) categorySet.add(data.category)
  }
  return Array.from(categorySet).sort((a, b) => a.localeCompare(b, 'zh-CN'))
}

/**
 * 生成文章路由配置
 * 统一格式: :publisherId/<id>
 */
export function generateArticleRoutes(): Array<{ path: string; element: ReactNode }> {
  const routes: Array<{ path: string; element: ReactNode }> = []

  for (const [id, data] of articleMap) {
    const ArticleComponent = data.jsx
    const publisher = data.publisherId || 'expubgo'
    routes.push({
      path: `${publisher}/${id}`,
      element: <ArticleComponent />,
    })
  }

  return routes
}

/**
 * 获取 publisher 最新的一篇文章 ID（按日期排序）
 */
export function getPublisherLatestArticleId(publisherId: string): string | undefined {
  let latestId: string | undefined
  let latestDate = 0

  for (const [id, data] of articleMap) {
    const articlePublisher = data.publisherId || 'expubgo'
    if (articlePublisher === publisherId) {
      const dateValue = data.date.valueOf()
      if (dateValue > latestDate) {
        latestDate = dateValue
        latestId = id
      }
    }
  }

  return latestId
}

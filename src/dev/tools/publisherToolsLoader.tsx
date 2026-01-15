/**
 * Publisher 工具加载器
 *
 * 让每个 publisher 能通过 publisher.config.ts 的 tools 字段自动注册工具卡片 + 路由。
 *
 * 约定：
 * - 工具代码放在 publishers/<p>/tools/<toolId>/index.tsx（默认导出 React 组件）
 * - 工具代码必须放在 articles/ 目录之外，避免被 articlesLoader 误扫为文章
 * - config.tools 是可选字段，不写就不出卡片
 *
 * 选择性构建兼容：用 __PUB_<NAME>__ 守卫，未启用 publisher 的工具分支被 tree-shake。
 */
import React from 'react'
import type { RouteObject } from 'react-router'
import type { CardData } from '@dev/apps/Home/cardsConfig'
import { publisherConfigModules, publisherImageModules, publisherToolModules } from '@dev/articles/publisherBranches.generated'

// ============================================ 类型 ============================================

/** publisher.config.ts 里 tools 字段的单项 */
export interface PublisherToolConfig {
    /** 工具 id，用于路由路径段（如 post-generator） */
    id: string
    /** 卡片标题 */
    title: string
    /** 卡片描述 */
    description: string
    /** 卡片主色（hex） */
    color: string
    /** 卡片图标的 SVG/PNG 相对路径（相对 publisher 根目录），可选 */
    iconImg?: string
}

interface PublisherConfigWithTools {
    publisherId: string
    publisherName?: string | string[]
    tools?: PublisherToolConfig[]
}

// ============================================ 扫描 publisher config（按名字拆分的 glob 分支在生成文件中，已 gitignore） ============================================

const publisherConfigs = publisherConfigModules as Record<string, { default: PublisherConfigWithTools }>

// 扫描每个 publisher 的工具组件（默认导出 React 组件）
// 工具约定路径：publishers/<p>/tools/<toolId>/index.tsx
interface ToolModule {
    default: React.ComponentType
}
const toolModules = publisherToolModules as Record<string, ToolModule>

// 扫描 publisher 目录下的图片资源，用于解析工具图标相对路径
const imageModules = publisherImageModules

// 各 publisher 的专属工具图标（约定：publishers/<p>/toolIcon.tsx default 导出 ReactNode；无此文件走默认字母图标）
const publisherToolIcons = import.meta.glob('/publishers/*/toolIcon.tsx', { eager: true, import: 'default' }) as Record<string, React.ReactNode>

// ============================================ 工具注册表构建 ============================================

/** 一个工具实例的完整描述（config + publisherId + 组件） */
interface PublisherToolEntry {
    publisherId: string
    /** publishers/ 下的目录名（用于匹配 toolIcon.tsx 与图片路径解析） */
    pubDir: string
    toolId: string
    config: PublisherToolConfig
    Component: React.ComponentType
    /** 路由路径段，如 tools/<publisherId>/<toolId> */
    routePath: string
}

/** 从 config 路径推断 publisher 目录名，如 /publishers/<name>/publisher.config.ts → <name> */
function inferPublisherDir(configPath: string): string {
    const m = configPath.match(/\/publishers\/([^/]+)\/publisher\.config\.ts$/)
    return m ? m[1] : ''
}

/** 从工具模块路径推断 publisher 目录名 + toolId，如 /publishers/<name>/tools/<toolId>/index.tsx */
function inferToolLocation(modulePath: string): { pubDir: string, toolId: string } {
    const m = modulePath.match(/\/publishers\/([^/]+)\/tools\/([^/]+)\/index\.tsx$/)
    return m ? { pubDir: m[1], toolId: m[2] } : { pubDir: '', toolId: '' }
}

/** 解析图标相对路径（./xxx）为 import 后的 url */
function resolveIconImg(iconImg: string | undefined, publisherDir: string): string | undefined {
    if (!iconImg) return undefined
    if (!iconImg.startsWith('./')) return iconImg
    const fullPath = `/publishers/${publisherDir}${iconImg.replace(/^\./, '')}`
    return imageModules[fullPath]
}

/** 汇总所有工具条目（config 与组件按 publisherId+toolId 配对） */
const toolEntries: PublisherToolEntry[] = (() => {
    const entries: PublisherToolEntry[] = []

    // 先把工具组件按 publisherDir+toolId 建索引
    const toolIndex = new Map<string, ToolModule>()
    for (const modulePath in toolModules) {
        const { pubDir, toolId } = inferToolLocation(modulePath)
        if (!pubDir || !toolId) continue
        toolIndex.set(`${pubDir}/${toolId}`, toolModules[modulePath])
    }

    // 遍历每个 publisher 的 config.tools，与工具组件配对
    for (const configPath in publisherConfigs) {
        const pubDir = inferPublisherDir(configPath)
        if (!pubDir) continue
        const config = publisherConfigs[configPath].default
        if (!config.tools || !Array.isArray(config.tools)) continue

        for (const toolConfig of config.tools) {
            const key = `${pubDir}/${toolConfig.id}`
            const toolMod = toolIndex.get(key)
            if (!toolMod) {
                console.warn(`[publisherTools] 工具组件缺失：${config.publisherId}/${toolConfig.id}（找不到 publishers/${pubDir}/tools/${toolConfig.id}/index.tsx）`)
                continue
            }
            entries.push({
                publisherId: config.publisherId,
                pubDir,
                toolId: toolConfig.id,
                config: toolConfig,
                Component: toolMod.default,
                routePath: `tools/${config.publisherId}/${toolConfig.id}`,
            })
        }
    }

    return entries
})()

// ============================================ 导出：首页卡片 ============================================

/** 生成单个工具的图标 JSX。
 *  和现有 cardsConfig 里的图标写法对齐：
 *  - 外层 <div className="w-9 h-9">
 *  - svg 用 className="w-full h-full" 填满外层（不是 w-9 h-9）
 *  - viewBox 用 1024 系（和现有图标视觉重量一致），带 -50 padding
 *  - 多个 path 用显式 fill 色块（不依赖 currentColor），主色取自 tool config
 *  - 不在 icon 上设 color，避免和 navbar 容器的 currentColor 机制冲突
 */
function renderToolIcon(entry: PublisherToolEntry): React.ReactNode {
    const iconUrl = resolveIconImg(entry.config.iconImg, entry.publisherId)
    if (iconUrl) {
        return (
            <div className="w-9 h-9">
                <img src={iconUrl} alt="" className="w-full h-full object-contain" />
            </div>
        )
    }
    // publisher 专属图标（约定 publishers/<p>/toolIcon.tsx default 导出；私有资产，公共代码不感知具体内容）
    const customIcon = publisherToolIcons[`/publishers/${entry.pubDir}/toolIcon.tsx`]
    if (customIcon) {
        return (
            <div className="w-9 h-9">
                {customIcon}
            </div>
        )
    }
    const c = entry.config.color
    return (
        <div className="w-9 h-9">
            <svg className="w-full h-full" viewBox="-50 -50 1124 1124" version="1.1" xmlns="http://www.w3.org/2000/svg">
                {/* 大写字母 A：粗壮的填充字形，主色取自 tool config */}
                <path d="M512 96c20.2 0 38.4 12.5 45.7 31.3l263.8 681.5c6.1 15.7 4 33.5-5.6 47.4-9.6 13.9-25.4 22.2-42.2 22.2h-72.9c-20.7 0-39.3-12.9-46.3-32.4l-29.4-82.1H354.9l-29.4 82.1c-7 19.5-25.6 32.4-46.3 32.4h-72.9c-16.8 0-32.6-8.3-42.2-22.2-9.6-13.9-11.7-31.7-5.6-47.4L466.3 127.3C473.6 108.5 491.8 96 512 96z m0 295.4l-78.4 218.7h156.8L512 391.4z" fill={c} />
            </svg>
        </div>
    )
}

/** 给首页 cardsConfig.tsx 用：把所有工具转成 CardData[] */
export const publisherToolCards: CardData[] = toolEntries.map(entry => ({
    id: `pub-tool-${entry.publisherId}-${entry.toolId}`,
    column: 'tools',
    title: entry.config.title,
    description: entry.config.description,
    icon: renderToolIcon(entry),
    href: entry.routePath,
    color: entry.config.color,
}))

// ============================================ 导出：路由 ============================================

/** 给 router/index.tsx 用：生成 /tools/<publisherId>/<toolId> 路由树 */
export function generatePublisherToolRoutes(): RouteObject[] {
    if (toolEntries.length === 0) return []

    // 按 publisherId 分组，每组挂一个 tools/:publisherId 父路由
    const byPublisher = new Map<string, PublisherToolEntry[]>()
    for (const entry of toolEntries) {
        if (!byPublisher.has(entry.publisherId)) byPublisher.set(entry.publisherId, [])
        byPublisher.get(entry.publisherId)!.push(entry)
    }

    const routes: RouteObject[] = []
    for (const [publisherId, entries] of byPublisher) {
        routes.push({
            path: `tools/${publisherId}`,
            children: entries.map(entry => ({
                path: entry.toolId,
                element: <entry.Component />,
            })),
        })
    }
    return routes
}

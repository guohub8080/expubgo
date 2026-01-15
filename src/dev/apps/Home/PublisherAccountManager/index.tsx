import React, { useMemo, useState } from "react"
import { useNavigate } from "react-router"
import { isString } from "es-toolkit/predicate"
import { cn } from "@shadcn/lib/utils"
import { getPublisherLatestArticleId, getArticleListItems } from "@dev/articles/articlesLoader"
import defaultPublisherConfig from "@dev/articles/default.publisher.tsx"
import { publisherConfigModules, publisherImageModules } from "@dev/articles/publisherBranches.generated"
import googleColors from "@dev/styles/static/googleColors.ts"

interface PublisherTheme {
  spine: [string, string]
  cover: [string, string]
  textColor?: string
}

interface PublisherConfig {
  publisherId: string
  publisherName: string | string[]
  avatar?: string | React.ReactNode
  avatarRadius?: string
  theme?: PublisherTheme
  alias: Record<string, string>
}

// publisher 配置与图片资源：按名字拆分的 glob 分支在生成文件中（含本地目录名，已 gitignore）
const configModules = publisherConfigModules as Record<string, unknown>

// 扫描启用 publisher 目录下的图片文件，用于解析相对路径 avatar
const imageModules = publisherImageModules

// 解析 avatar 路径：如果是相对路径，拼接成绝对路径后查找对应的模块
function resolveAvatar(
  avatar: string | React.ReactNode | undefined,
  configFilePath: string
): string | React.ReactNode | undefined {
  if (!avatar || !isString(avatar)) return avatar
  if (!avatar.startsWith("./")) return avatar

  const publisherDir = configFilePath.replace("/publisher.config.ts", "")
  const fullPath = publisherDir + avatar.replace(/^\./, "")
  return imageModules[fullPath]
}

export default function PublisherAccountManager() {
  const navigate = useNavigate()

  const allPublishers = useMemo<PublisherConfig[]>(() => {
    const result: PublisherConfig[] = []

    // 添加默认 publisher
    result.push({
      publisherId: defaultPublisherConfig.publisherId,
      publisherName: defaultPublisherConfig.publisherName,
      theme: defaultPublisherConfig.theme,
      weight: defaultPublisherConfig.weight,
      articleDir: defaultPublisherConfig.articleDir,
      alias: defaultPublisherConfig.alias,
      avatar: defaultPublisherConfig.avatar,
    })

    // 添加其他 publisher
    for (const path in configModules) {
      const module = configModules[path] as { default: PublisherConfig }
      const config = module.default
      result.push({
        ...config,
        avatar: resolveAvatar(config.avatar, path),
      })
    }

    // 按 weight 降序排序
    result.sort((a, b) => (b.weight || 0) - (a.weight || 0))

    return result
  }, [])

  // 获取每个 publisher 的文章数量
  const publisherArticleCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    const allArticles = getArticleListItems()
    for (const article of allArticles) {
      const pubId = article.publisherId || 'expubgo'
      counts[pubId] = (counts[pubId] || 0) + 1
    }
    return counts
  }, [])

  return (
    <div className="flex flex-col items-center gap-8 mt-8">
      {/* Publisher 提示胶囊 */}
      <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        <span className="text-xs font-medium">推文发布者</span>
      </div>

      {/* 书本风格卡片 */}
      <div className="flex flex-wrap justify-center gap-x-12 gap-y-16 pb-8">
        {allPublishers.map((publisher, index) => {
          const defaultThemes: PublisherTheme[] = [
            { spine: ["#b07a7a", "#c49272"], cover: ["#fff5f5", "#fff7ed"] },
            { spine: ["#8e7aab", "#a08ab8"], cover: ["#f5f3ff", "#faf5ff"] },
            { spine: ["#6a9e8a", "#7ab09a"], cover: ["#ecfdf5", "#f0fdfa"] },
            { spine: ["#b0a070", "#c4b480"], cover: ["#fffbeb", "#fefce8"] },
            { spine: ["#6a96b0", "#7aa8c0"], cover: ["#ecfeff", "#f0f9ff"] },
          ]
          const theme = publisher.theme || defaultThemes[index % defaultThemes.length]
          return (
            <BookCard
              key={publisher.publisherId}
              onClick={() => {
                const latestId = getPublisherLatestArticleId(publisher.publisherId)
                if (latestId) {
                  navigate(`/view/${publisher.publisherId}/${latestId}`)
                } else {
                  navigate(`/view/${publisher.publisherId}/_empty`)
                }
              }}
              initial={(isString(publisher.publisherName) ? publisher.publisherName : publisher.publisherName.join(''))[0]}
              name={publisher.publisherName}
              avatar={publisher.avatar}
              avatarRadius={publisher.avatarRadius}
              spineColors={theme.spine}
              coverColors={theme.cover}
              textColor={theme.textColor}
              articleCount={publisherArticleCounts[publisher.publisherId] || 0}
            />
          )
        })}
      </div>
    </div>
  )
}

export function BookCard({
  onClick,
  initial,
  name,
  avatar,
  spineColors,
  coverColors,
  avatarRadius,
  textColor,
  articleCount,
}: {
  onClick: () => void
  initial: string
  name: string | string[]
  avatar?: string | React.ReactNode
  spineColors: [string, string]
  coverColors: [string, string]
  avatarRadius?: string
  textColor?: string
  articleCount: number
}) {
  const spineGrad = `linear-gradient(to bottom, ${spineColors[0]}, ${spineColors[1]})`
  const coverGrad = `linear-gradient(to bottom right, ${coverColors[0]}, ${coverColors[1]})`
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer relative"
      style={{ width: 125, height: 155 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* 纸页梯形 - 左窄右宽透视 */}
      <div
        className="transition-all duration-300"
        style={{
          position: 'absolute',
          top: 2,
          left: 0,
          width: 129,
          height: 151,
          background: 'linear-gradient(to bottom right, rgba(255,255,255,0.9), rgba(255,255,255,0.4))',
          borderRadius: 10,
          border: '1px solid var(--color-border)',
          boxShadow: hovered ? '4px 6px 12px rgba(0,0,0,0.1)' : '2px 3px 6px rgba(0,0,0,0.06)',
          transform: hovered
            ? 'perspective(500px) rotateY(-5deg) translateX(5px)'
            : 'perspective(500px) rotateY(-5deg) translateY(2px)',
          transformOrigin: '0% 50%',
        }}
      />
      {/* 中间页 - hover时从两页之间探出 */}
      <div
        className="transition-all duration-300"
        style={{
          position: 'absolute',
          top: 1.5,
          left: 0.5,
          width: 128,
          height: 152,
          // 纯白底（横线在内层 div 上，便于左右留白、被封面完全遮住）
          backgroundColor: 'rgb(255,255,255)',
          borderRadius: 10,
          border: '1px solid var(--color-border)',
          zIndex: 6,
          transform: hovered
            ? 'perspective(400px) rotateY(-14deg) rotateZ(6deg) scale(0.9) translateX(18px) translateY(-7px)'
            : 'perspective(500px) rotateY(-2deg) rotateZ(0.3deg)',
          transformOrigin: '0% 50%',
          boxShadow: hovered ? '2px 3px 8px rgba(0,0,0,0.08)' : '1px 1px 3px rgba(0,0,0,0.03)',
        }}
      >
        {/* 横线纹理区域 - 限制在中间，左右留 paddingX，被封面遮住时不外露 */}
        <div style={{
          position: 'absolute',
          top: 10,
          bottom: 10,
          left: 14,
          right: 6,
          // 笔记本横线：灰色，每 14px 一条。先画 1px 线再留 13px 间隔，确保第一条线紧贴顶部
          backgroundImage: 'repeating-linear-gradient(to bottom, rgba(110, 110, 110, 0.16) 0px, rgba(110, 110, 110, 0.16) 1px, transparent 1px, transparent 14px)',
        }} />
        {/* 左侧装订孔（红色竖线，模拟活页本打孔线） */}
        <div style={{
          position: 'absolute',
          left: 6,
          top: 0,
          bottom: 0,
          width: 1,
          background: 'rgba(220, 38, 38, 0.25)',
        }} />
      </div>
      {/* 封面层 */}
      <div
        className={cn(
          "absolute top-0 left-0",
          "rounded-xl overflow-hidden",
          "flex flex-col",
          "border transition-all duration-300",
          "z-10",
          'border-border'
        )}
        style={{
          background: coverGrad,
          width: 125,
          height: 155,
          boxShadow: hovered ? '0 2px 8px rgba(0,0,0,0.12)' : 'none',
          transform: hovered
            ? 'translateY(0px) perspective(700px) rotateY(-25deg) '
            : 'none',
          transformOrigin: '0% 50%',
        }}
      >
        {/* 书脊 */}
        <div className="absolute left-0 top-0 bottom-0 w-[8px] z-10" style={{ background: spineGrad }}>
          <div className="absolute top-[20%] left-1.5 right-1 h-px bg-white/25" />
          <div className="absolute top-[50%] left-1.5 right-1 h-px bg-white/25" />
          <div className="absolute top-[80%] left-1.5 right-1 h-px bg-white/25" />
        </div>
        {/* 书脊分界线 */}
        <div className="absolute left-[8px] top-0 bottom-0 w-px bg-black/8 dark:bg-white/10 z-[2]" />
        {/* 封面光泽 */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-white/20 to-transparent rounded-tr-xl z-[1]" />
        {/* 封面内虚线 */}
        <div
          className="absolute top-2 bottom-2 left-[12px] w-[2px] pointer-events-none z-[3]"
          style={{ background: 'repeating-linear-gradient(to bottom, rgba(0,0,0,0.08) 0px, rgba(0,0,0,0.08) 5px, transparent 5px, transparent 10px)' }}
        />
        {/* 头像 */}
        <div className="h-[88px] flex flex-col items-center justify-end relative z-10 pb-1 pl-[8px]">
          {avatar ? (
            isString(avatar) ? (
              <img
                src={avatar}
                alt={isString(name) ? name : name.join('')}
                className="w-[64px] h-[64px] object-cover group-hover:scale-105 transition-transform duration-300"
                style={{ borderRadius: avatarRadius || '12px' }}
              />
            ) : (
              <div
                className="w-[64px] h-[64px] group-hover:scale-105 transition-transform duration-300"
                style={{ borderRadius: avatarRadius || '12px' }}
              >
                {avatar}
              </div>
            )
          ) : (
            <div
              className="w-[64px] h-[64px] flex items-center justify-center text-white text-xl font-medium group-hover:scale-105 transition-transform duration-300"
              style={{ background: spineGrad, borderRadius: avatarRadius || '12px' }}
            >
              {initial}
            </div>
          )}
        </div>
        {/* 书名 */}
        <div className="px-2 flex-1 flex items-center justify-center text-center relative z-10 ml-[6px]"
          style={{ color: textColor || googleColors.gray900 }}>
          {!isString(name) ? (
            <div className="flex flex-col leading-snug">
              {name.map((line, i) => (
                <span key={i} className="text-sm font-normal">{line}</span>
              ))}
            </div>
          ) : (
            <span className="text-base font-normal leading-tight truncate w-full">{name}</span>
          )}
        </div>
      </div>

      {/* 文章数量 */}
      <div className="absolute -bottom-8 left-0 right-0 flex justify-center">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-[11px] text-slate-600 dark:text-slate-300">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          {articleCount > 999 ? '999+' : articleCount}
        </span>
      </div>
    </div>
  )
}

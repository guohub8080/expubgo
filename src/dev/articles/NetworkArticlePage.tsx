/** @jsxImportSource react */
/**
 * 网络源文章渲染页（网络连接制度）
 *
 * 挂在 /view/:netPublisher/:netArticle 参数路由上（位于本地静态文章路由之后，
 * react-router 静态段优先——本地文章不受影响，未命中的落到这里查网络源）。
 *
 * 渲染方式：iframe 直接指向源端编译好的文章 HTML（样式完全隔离、SVG 动画照常）。
 * 刷新后直达该 URL 时 manifest 缓存为空 → 挂载时重连全部已存源后自动解析。
 */
import React, { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router'
import { Loader2, Unplug, Settings, RefreshCw } from 'lucide-react'
import { isNotNil, isNumber, isPlainObject } from 'es-toolkit/predicate'
import {
  useNetworkManifests,
  useNetworkSources,
  resolveNetworkArticleUrl,
  refreshNetworkSources,
} from '@dev/articles/networkSources'

export default function NetworkArticlePage() {
  const { netPublisher, netArticle } = useParams()
  const manifests = useNetworkManifests()
  const sources = useNetworkSources() // 订阅驱动：atomWithStorage 只有订阅者拿到 hydrated 值
  const [reconnecting, setReconnecting] = useState(false)

  const hasAnyManifest = Object.keys(manifests).length > 0
  // manifest 为空且存在已存源（刷新直达）时重连一轮
  useEffect(() => {
    if (hasAnyManifest || reconnecting || sources.length === 0) return
    setReconnecting(true)
    refreshNetworkSources(sources).finally(() => setReconnecting(false))
  }, [hasAnyManifest, reconnecting, sources])

  const url = useMemo(
    () => (netPublisher && netArticle ? resolveNetworkArticleUrl(netPublisher, netArticle) : null),
    // manifests 是故意依赖：重连写入 atom 后据此重算（eslint 误报为多余）
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [netPublisher, netArticle, manifests],
  )

  // 源端高度上报（协议：postMessage { type: 'expub-article-height', height }，origin 须为文章源）：
  // 上报后 iframe 等高于内容，frame 内不再出现竖向滚动条（滚动全在外层，与本地文章一致）；
  // 未上报的源回落视口高 + 内部滚动兜底
  const [reportedHeight, setReportedHeight] = useState<number | null>(null)
  useEffect(() => {
    if (!url) return
    let sourceOrigin: string
    try {
      sourceOrigin = new URL(url).origin
    } catch {
      return
    }
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== sourceOrigin) return
      const data = event.data
      if (isPlainObject(data) && data.type === 'expub-article-height' && isNumber(data.height) && data.height > 0) {
        setReportedHeight(Math.ceil(data.height))
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [url])

  // 换文章时清掉旧高度（等新源页重新上报）
  useEffect(() => { setReportedHeight(null) }, [url])

  if (reconnecting && !url) {
    return (
      <div className="flex items-center justify-center gap-2 py-20 text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        正在连接内容源…
      </div>
    )
  }

  if (!url) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        {/* 断连图标 + 标题（与 404 页同一视觉语言） */}
        <div className="flex size-14 items-center justify-center rounded-2xl border border-border/60 bg-muted/50">
          <Unplug className="size-7 text-primary/70" />
        </div>
        <h2 className="mt-5 text-lg font-medium text-foreground/90">无法获取文章</h2>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            远程网络可能已断开或文章已被移除。
        </p>
        {/* 文章标识胶囊：核对/复制用 */}
        <code className="mt-4 rounded-md border border-border/60 bg-muted/60 px-3 py-1.5 text-xs text-muted-foreground break-all">
          {netPublisher}/{netArticle}
        </code>
        <div className="mt-8 flex items-center gap-3">
          <Link
            to="/settings/"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:scale-[1.03] active:scale-[0.98]"
          >
            <Settings className="size-4" />
            跳转设置
          </Link>
          <button
            onClick={() => {
              if (reconnecting) return
              setReconnecting(true)
              refreshNetworkSources(sources).finally(() => setReconnecting(false))
            }}
            disabled={reconnecting}
            className="inline-flex items-center gap-2 rounded-lg border border-border/70 bg-background/60 px-4 py-2 text-sm font-medium text-foreground/80 shadow-sm transition-all hover:bg-muted/80 hover:scale-[1.03] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
          >
            <RefreshCw className={reconnecting ? 'size-4 animate-spin' : 'size-4'} />
            重新连接
          </button>
        </div>
      </div>
    )
  }

  // 跨域 iframe 无法读取内容高度：源端上报前采用视口高 + 内部滚动兜底
  // 不加边框/圆角/底色包装：对齐本地文章路由的直挂形态（generateArticleRoutes 裸挂组件，无框）
  return (
    <iframe
      src={url}
      title={`${netPublisher}/${netArticle}`}
      className="w-full"
      style={{ height: isNotNil(reportedHeight) ? `${reportedHeight}px` : '75vh', minHeight: 480 }}
      loading="lazy"
    />
  )
}

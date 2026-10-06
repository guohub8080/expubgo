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
import { Loader2 } from 'lucide-react'
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
      <div className="py-16 text-center space-y-2">
        <p className="text-muted-foreground">
          找不到网络文章 <code className="px-1 rounded bg-muted">{netPublisher}/{netArticle}</code>
          ——源可能已离线或文章已被移除
        </p>
        <p className="text-sm">
          到 <Link to="/settings/" className="text-primary underline">设置 · 网页连接</Link> 检查源状态
        </p>
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

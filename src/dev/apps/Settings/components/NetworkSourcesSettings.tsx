/** @jsxImportSource react */
/**
 * 设置页「网页连接」分区——网络内容源管理（网络连接制度壳子侧入口）
 *
 * 视觉结构（iOS Settings 的 inset grouped list 风格）：
 * - 添加表单 → 反馈条 → 分组小标题
 * - 分组容器：rounded-xl 浅底色、无边框；条目间细分割线（左缩进对齐文本，iOS 特征）
 * - 源信息行 = 分组头（地址小字 + 状态点 + 操作）；作者条目 = 列表行（squircle 头像 + 名称 + 篇数 + chevron）
 */
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Button } from '@shadcn/components/ui/button.tsx'
import { Input } from '@shadcn/components/ui/input.tsx'
import { Loader2, Plus, RefreshCw, Trash2, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react'
import { isNil } from 'es-toolkit/predicate'
import {
  useNetworkSources,
  useNetworkManifests,
  useNetworkSourceActions,
  refreshNetworkSources,
  networkPublisherNameToString,
} from '@dev/articles/networkSources'

/** 作者条目（iOS 列表行）：squircle 头像 + 名称 + 篇数 + chevron；底部分割线左缩进对齐文本 */
function PublisherEntry({ publisherId, name, avatar, articleCount, firstArticleId, hideTopDivider }: {
  publisherId: string
  name: string
  avatar?: string
  articleCount: number
  firstArticleId?: string
  /** 紧跟源信息行的首条目：分组头自带满宽底线，隐藏自身缩进线避免双线 */
  hideTopDivider?: boolean
}) {
  const initial = name.trim()[0] || '?'
  return (
    <Link
      to={`/view/${publisherId}/${firstArticleId ?? '_empty'}`}
      className={`group/pub relative flex items-center gap-3 px-3.5 py-2.5 transition-colors hover:bg-accent/70
                  ${hideTopDivider ? '' : 'before:absolute before:left-[54px] before:right-0 before:top-0 before:h-px before:bg-border/70'}`}
    >
      {avatar ? (
        <img src={avatar} alt="" className="size-8 rounded-[22%] object-cover shrink-0" />
      ) : (
        <div className="size-8 rounded-[22%] bg-gradient-to-br from-primary/25 to-primary/10 shrink-0
                        flex items-center justify-center text-sm font-semibold text-primary">
          {initial}
        </div>
      )}
      <span className="text-sm text-foreground truncate flex-1 min-w-0">{name}</span>
      <span className="text-[13px] text-muted-foreground tabular-nums shrink-0">{articleCount} 篇</span>
      <ChevronRight className="size-4 text-muted-foreground/40 shrink-0" strokeWidth={2.5} />
    </Link>
  )
}

/** 源信息行（分组头）：状态点 + 地址小字 + 操作；底部满宽分割线紧贴行底（分组头与首条目间不留空隙） */
function SourceHeader({ url, online, refreshing, onRefresh, onRemove }: {
  url: string
  online: boolean
  refreshing: boolean
  onRefresh: () => void
  onRemove: () => void
}) {
  return (
    <div className="flex items-center gap-2 px-3.5 pt-2 pb-1.5 border-b border-border/70">
      <span className="relative flex size-2 shrink-0" title={online ? '已连接' : '待连接（点重连拉取）'}>
        {online ? (
          <>
            <span className="absolute inline-flex size-full rounded-full bg-emerald-400/60 animate-ping" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </>
        ) : (
          <span className="relative inline-flex size-2 rounded-full bg-muted-foreground/30" />
        )}
      </span>
      <span
        className="text-xs text-muted-foreground truncate flex-1 min-w-0"
        style={{ fontFamily: 'var(--guohub-code-font-family)' }}
        title={url}
      >
        {url}
      </span>
      <Button size="icon" variant="ghost" className="size-6 text-muted-foreground/60 hover:text-foreground" title="重连"
        onClick={onRefresh} disabled={refreshing}>
        <RefreshCw className={`size-3 ${refreshing ? 'animate-spin' : ''}`} />
      </Button>
      <Button size="icon" variant="ghost" className="size-6 text-muted-foreground/60 hover:text-red-500" title="删除源"
        onClick={onRemove}>
        <Trash2 className="size-3" />
      </Button>
    </div>
  )
}

const NetworkSourcesSettings: React.FC = () => {
  const sources = useNetworkSources()
  const manifests = useNetworkManifests()
  const { add, remove, refresh } = useNetworkSourceActions()

  const [input, setInput] = useState('http://localhost:6790')
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successInfo, setSuccessInfo] = useState<string | null>(null)
  const [refreshingUrl, setRefreshingUrl] = useState<string | null>(null)

  // 挂载时自动拉取本会话还没有 manifest 的已存源（新会话/刷新后恢复作者列表）
  useEffect(() => {
    const missing = sources.filter((s) => isNil(manifests[s.url]))
    if (missing.length === 0) return
    refreshNetworkSources(missing)
  }, [sources, manifests])

  // 分组小标题统计
  const stats = React.useMemo(() => {
    let pubs = 0, articles = 0
    for (const m of Object.values(manifests)) {
      pubs += m.publishers.length
      articles += m.publishers.reduce((n, p) => n + p.articles.length, 0)
    }
    return { sources: sources.length, pubs, articles }
  }, [sources, manifests])

  const handleAdd = async () => {
    if (adding) return
    setAdding(true)
    setError(null)
    setSuccessInfo(null)
    try {
      const manifest = await add(input)
      const pubSummary = manifest.publishers.map((p) => `${networkPublisherNameToString(p.name)}（${p.articles.length} 篇）`).join('、')
      setSuccessInfo(`连接成功：${pubSummary}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setAdding(false)
    }
  }

  const handleRefresh = async (url: string) => {
    setRefreshingUrl(url)
    setError(null)
    setSuccessInfo(null)
    try {
      const manifest = await refresh(url)
      setSuccessInfo(`已刷新：${manifest.publishers.length} 个作者`)
    } catch (e) {
      setError(`刷新失败（${url}）：${e instanceof Error ? e.message : String(e)}`)
    } finally {
      setRefreshingUrl(null)
    }
  }

  return (
    <div className="space-y-2.5">
      {/* 添加表单 */}
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleAdd() }}
          placeholder="http://localhost:6790"
          spellCheck={false}
          className="pl-3 text-[13px]"
          style={{ fontFamily: 'var(--guohub-code-font-family)' }}
        />
        <Button onClick={handleAdd} disabled={adding || input.trim() === ''} variant="outline">
          {adding ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
          {adding ? '连接中' : '连接'}
        </Button>
      </div>

      {/* 反馈条 */}
      {successInfo && (
        <div className="flex items-start gap-2 rounded-lg border border-emerald-500/25 bg-emerald-500/8 px-3 py-2">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-sm text-emerald-700 dark:text-emerald-400 break-all leading-relaxed">{successInfo}</p>
        </div>
      )}
      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-500/25 bg-red-500/8 px-3 py-2">
          <AlertCircle className="size-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600 dark:text-red-400 break-all leading-relaxed">{error}</p>
        </div>
      )}

      {/* 源列表 / 空状态 */}
      {sources.length === 0 ? (
        <div className="rounded-xl border border-border bg-card px-6 py-8 text-center space-y-1.5">
          <p className="text-sm font-medium text-foreground">尚未连接任何内容源</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            在源端项目运行 <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-[11px]">pnpm pub:serve</code>，
            或输入任意符合协议的源地址进行连接
          </p>
          <p className="text-[11px] text-muted-foreground/70 leading-relaxed">
            本机源须用 <code className="px-1 rounded bg-muted font-mono">localhost</code>（局域网 IP 会被浏览器拦截）· 数据留在源端，不经过本站
          </p>
        </div>
      ) : (
        <>
          {/* 分组小标题 */}
          <p className="text-xs text-muted-foreground px-3.5">
            {stats.sources} 个源 · {stats.pubs} 位作者 · {stats.articles} 篇文章
          </p>
          {/* inset grouped 容器：明确外框（描边+卡底色+轻阴影），条目细分割线左缩进，末条无线 */}
          <div className="rounded-xl border border-border bg-card overflow-hidden [&>*:last-child]:before:hidden">
            {sources.map((s) => {
              const manifest = manifests[s.url]
              const entries: React.ReactNode[] = []
              if (manifest && manifest.publishers.length > 0) {
                manifest.publishers.forEach((p, idx) => {
                  const firstArticleId = p.articles.length > 0
                    ? [...p.articles].sort((a, b) => b.date.localeCompare(a.date))[0].id
                    : undefined
                  entries.push(
                    <PublisherEntry
                      key={`${s.url}:${p.id}`}
                      publisherId={p.id}
                      name={networkPublisherNameToString(p.name)}
                      avatar={p.avatar ? `${s.url}/${p.avatar.replace(/^\.\//, '').replace(/^\/+/, '')}` : undefined}
                      articleCount={p.articles.length}
                      firstArticleId={firstArticleId}
                      hideTopDivider={idx === 0}
                    />,
                  )
                })
              } else {
                entries.push(
                  <div key={`${s.url}:loading`} className="relative px-3.5 py-2.5 text-xs text-muted-foreground flex items-center gap-1.5">
                    {manifest ? '该源没有作者（manifest.publishers 为空）' : (<><Loader2 className="size-3 animate-spin" />正在拉取作者清单…</>)}
                  </div>,
                )
              }
              return (
                <React.Fragment key={s.url}>
                  <SourceHeader
                    url={s.url}
                    online={!isNil(manifest)}
                    refreshing={refreshingUrl === s.url}
                    onRefresh={() => handleRefresh(s.url)}
                    onRemove={() => remove(s.url)}
                  />
                  {entries}
                </React.Fragment>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

export default NetworkSourcesSettings

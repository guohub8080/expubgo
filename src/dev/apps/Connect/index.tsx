/** @jsxImportSource react */
/**
 * 内容源一键连接页（/#/connect?source=<源地址>）
 *
 * 本地工具（pub:push / pub:serve）打开该地址，壳子解析参数后主动连接源，
 * 体验上是"本地推给网页"，数据流仍是网页 fetch 本地（浏览器安全模型）。
 * 成功后展示作者清单并引导进入对应 view 子页面；无参数时提供手动输入。
 */
import React, { useEffect, useState } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router'
import { Button } from '@shadcn/components/ui/button.tsx'
import { Input } from '@shadcn/components/ui/input.tsx'
import { Badge } from '@shadcn/components/ui/badge.tsx'
import { Loader2, CheckCircle2 } from 'lucide-react'
import type { NetworkManifest } from '@dev/articles/networkSources'
import { addNetworkSource } from '@dev/articles/networkSources'

export default function ConnectPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const sourceParam = searchParams.get('source') ?? ''

  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [manifest, setManifest] = useState<NetworkManifest | null>(null)
  const [attempted, setAttempted] = useState(false)

  const doConnect = async (url: string) => {
    setConnecting(true)
    setError(null)
    try {
      const m = await addNetworkSource(url)
      setManifest(m)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setConnecting(false)
    }
  }

  // 有 source 参数时自动连接一次
  useEffect(() => {
    if (sourceParam && !attempted) {
      setAttempted(true)
      doConnect(sourceParam)
    }
  }, [sourceParam, attempted])

  const goHome = () => navigate('/home/')

  return (
    <div className="max-w-xl mx-auto p-6 space-y-5">
      <div className="text-center space-y-2 pt-6">
        <h1 className="text-2xl font-bold">连接内容源</h1>
        <p className="text-sm text-muted-foreground">
          壳子将主动访问源地址拉取作者与文章（数据留在源端）
        </p>
      </div>

      {connecting && (
        <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          正在连接 {sourceParam || '源'}
        </div>
      )}

      {manifest && !connecting && (
        <div className="space-y-4 rounded-lg border border-border/60 p-4">
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="size-4" />
            <span className="text-sm font-medium">连接成功</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {manifest.publishers.map((p) => (
              <Badge key={p.id} variant="secondary" className="font-normal">
                <Link to={`/view/${p.id}/${p.articles[0]?.id ?? ''}`} className="hover:underline">
                  {p.name}
                </Link>
                <span className="text-muted-foreground ml-1">{p.articles.length} 篇</span>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={goHome}>进入首页</Button>
            <Button size="sm" variant="outline" onClick={() => navigate('/settings/')}>管理内容源</Button>
          </div>
        </div>
      )}

      {!connecting && (
        <ManualConnect onConnect={doConnect} initial={sourceParam} hasError={!!error} />
      )}

      {error && <p className="text-sm text-red-500 break-all">{error}</p>}
    </div>
  )
}

// 手动输入区（无参数 / 自动连接失败时兜底）
function ManualConnect({ onConnect, initial, hasError }: {
  onConnect: (url: string) => void
  initial: string
  hasError: boolean
}) {
  const [value, setValue] = useState(initial || 'http://localhost:6790')
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        {hasError ? '自动连接失败，可检查源端后重试：' : '或手动输入源地址：'}
      </p>
      <div className="flex gap-2">
        <Input value={value} onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') onConnect(value) }}
          placeholder="http://localhost:6790" spellCheck={false} />
        <Button variant="outline" onClick={() => onConnect(value)}>连接</Button>
      </div>
    </div>
  )
}

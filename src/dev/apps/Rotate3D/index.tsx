import { useState } from "react"
import faviconSvg from "@assets/svgs/logoSvg/favicon.svg"
import { Slider } from "@shadcn/components/ui/slider"
import { Button } from "@shadcn/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@shadcn/components/ui/card"
import { useRotate3DStore, defaultTransform } from "./store/useRotate3DStore"

function buildCSSTransform(t: typeof defaultTransform): string {
  const parts: string[] = []
  if (t.perspective !== 0) parts.push(`perspective(${t.perspective}px)`)
  if (t.translateX !== 0 || t.translateY !== 0 || t.translateZ !== 0)
    parts.push(`translate3d(${t.translateX}px, ${t.translateY}px, ${t.translateZ}px)`)
  if (t.rotateX !== 0) parts.push(`rotateX(${t.rotateX}deg)`)
  if (t.rotateY !== 0) parts.push(`rotateY(${t.rotateY}deg)`)
  if (t.rotateZ !== 0) parts.push(`rotateZ(${t.rotateZ}deg)`)
  if (t.scaleX !== 1 || t.scaleY !== 1 || t.scaleZ !== 1)
    parts.push(`scale3d(${t.scaleX}, ${t.scaleY}, ${t.scaleZ})`)
  if (t.skewX !== 0) parts.push(`skewX(${t.skewX}deg)`)
  if (t.skewY !== 0) parts.push(`skewY(${t.skewY}deg)`)
  return parts.length > 0 ? parts.join(" ") : "none"
}

const presets = [
  { label: "等轴测", values: { rotateX: -35, rotateY: -45, perspective: 800 } },
  { label: "翻转卡片", values: { rotateY: 180, perspective: 1000 } },
  { label: "倾斜展开", values: { rotateY: -25, perspective: 700, translateX: 10 } },
  { label: "俯视", values: { rotateX: -60, perspective: 600 } },
  { label: "侧翻", values: { rotateX: 90, perspective: 800 } },
]

const origins = [
  ["0% 0%", "50% 0%", "100% 0%"],
  ["0% 50%", "50% 50%", "100% 50%"],
  ["0% 100%", "50% 100%", "100% 100%"],
]

function Field({ label, value, onChange, min, max, step = 1, unit = "" }: {
  label: string; value: number; onChange: (v: number) => void
  min: number; max: number; step?: number; unit?: string
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <label className="text-sm text-muted-foreground">{label}</label>
        <span className="text-sm font-mono tabular-nums">{value}{unit}</span>
      </div>
      <Slider min={min} max={max} step={step} value={[value]} onValueChange={([v]) => onChange(v)} />
    </div>
  )
}

export default function Rotate3D() {
  const { transform, update, reset } = useRotate3DStore()
  const [copied, setCopied] = useState(false)

  const cssTransform = buildCSSTransform(transform)
  const cssCode = `transform: ${cssTransform};${transform.transformOrigin !== "50% 50%" ? `\ntransform-origin: ${transform.transformOrigin};` : ""}`

  return (
    <div className="w-full px-4 pb-4 pt-0">
      <div className="w-full max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

          {/* 左侧：预览 + CSS */}
          <div className="lg:col-span-5">
            <Card className="overflow-hidden relative">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-base">预览</CardTitle>
                <Button variant="ghost" size="sm" onClick={reset} className="h-6 text-xs">重置</Button>
              </CardHeader>
              <div
                className="h-[400px] flex items-center justify-center"
                style={{ perspective: `${transform.perspective}px` }}
              >
                <div
                  className="w-[130px] h-[130px] rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-sm"
                  style={{
                    transform: `rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) rotateZ(${transform.rotateZ}deg) translate3d(${transform.translateX}px, ${transform.translateY}px, ${transform.translateZ}px) scale3d(${transform.scaleX}, ${transform.scaleY}, ${transform.scaleZ}) skewX(${transform.skewX}deg) skewY(${transform.skewY}deg)`,
                    transformOrigin: transform.transformOrigin,
                  }}
                >
                  <img src={faviconSvg} alt="" className="w-full h-full p-2" />
                </div>
              </div>
              {/* CSS 代码 */}
              <div className="border-t border-border bg-muted/30">
                <pre className="p-3 pb-10 text-sm font-mono whitespace-pre-wrap break-all leading-relaxed text-muted-foreground">{cssCode}</pre>
              </div>
              {/* 复制按钮 - 右下角 */}
              <div className="absolute bottom-2 right-2">
                <Button size="default" onClick={() => { navigator.clipboard.writeText(cssCode); setCopied(true); setTimeout(() => setCopied(false), 1500) }} className="h-9 text-sm px-4 shadow-sm">
                  {copied ? "已复制 ✓" : "复制代码"}
                </Button>
              </div>
            </Card>
          </div>

          {/* 中间：控制面板 */}
          <div className="lg:col-span-4 space-y-3">
            <Card className="p-4 gap-2">
              <CardHeader className="p-0">
                <CardTitle className="text-base">旋转</CardTitle>
              </CardHeader>
              <Field label="rotateX" value={transform.rotateX} onChange={(v) => update({ rotateX: v })} min={-180} max={180} unit="°" />
              <Field label="rotateY" value={transform.rotateY} onChange={(v) => update({ rotateY: v })} min={-180} max={180} unit="°" />
              <Field label="rotateZ" value={transform.rotateZ} onChange={(v) => update({ rotateZ: v })} min={-180} max={180} unit="°" />
              <Field label="perspective" value={transform.perspective} onChange={(v) => update({ perspective: v })} min={100} max={2000} unit="px" />
            </Card>
            <Card className="p-4 gap-2">
              <CardHeader className="p-0">
                <CardTitle className="text-base">位移</CardTitle>
              </CardHeader>
              <Field label="translateX" value={transform.translateX} onChange={(v) => update({ translateX: v })} min={-200} max={200} unit="px" />
              <Field label="translateY" value={transform.translateY} onChange={(v) => update({ translateY: v })} min={-200} max={200} unit="px" />
              <Field label="translateZ" value={transform.translateZ} onChange={(v) => update({ translateZ: v })} min={-200} max={200} unit="px" />
            </Card>
            <Card className="p-4 gap-2">
              <CardHeader className="p-0">
                <CardTitle className="text-base">缩放 & 倾斜</CardTitle>
              </CardHeader>
              <Field label="scaleX" value={transform.scaleX} onChange={(v) => update({ scaleX: v })} min={0} max={3} step={0.1} />
              <Field label="scaleY" value={transform.scaleY} onChange={(v) => update({ scaleY: v })} min={0} max={3} step={0.1} />
              <Field label="skewX" value={transform.skewX} onChange={(v) => update({ skewX: v })} min={-90} max={90} unit="°" />
              <Field label="skewY" value={transform.skewY} onChange={(v) => update({ skewY: v })} min={-90} max={90} unit="°" />
            </Card>
          </div>

          {/* 右侧：预设 + 变换原点 */}
          <div className="lg:col-span-3 space-y-3">
            <Card className="p-4 gap-2">
              <CardHeader className="p-0">
                <CardTitle className="text-base">预设</CardTitle>
              </CardHeader>
              <div className="space-y-2">
                {presets.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => update(p.values)}
                    className="w-full text-left text-sm px-3 py-2 rounded-lg border border-border hover:border-primary/40 hover:bg-primary/5 transition-colors"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </Card>

            <Card className="p-4 gap-2">
              <CardHeader className="p-0">
                <CardTitle className="text-base">变换原点</CardTitle>
              </CardHeader>
              <div className="grid grid-cols-3 gap-1.5 w-fit">
                {origins.flat().map((v) => (
                  <button
                    key={v}
                    onClick={() => update({ transformOrigin: v })}
                    className={`w-6 h-6 rounded-sm text-[9px] transition-colors ${
                      transform.transformOrigin === v
                        ? "bg-primary text-primary-foreground"
                        : "bg-neutral-300 dark:bg-neutral-600 text-muted-foreground hover:bg-neutral-400 dark:hover:bg-neutral-500"
                    }`}
                  />
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

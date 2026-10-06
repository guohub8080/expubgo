/** @jsxImportSource react */
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { Lock, Unlock, RotateCcw, Copy, ChevronLeft, ChevronRight, ArrowLeftRight } from 'lucide-react'
import { Button } from '@shadcn/components/ui/button.tsx'
import { NumberField, NumberFieldGroup, NumberFieldDecrement, NumberFieldIncrement, NumberFieldInput } from '@shadcn/components/ui/number-field.tsx'
import { Combobox, ComboboxInput, ComboboxContent, ComboboxList, ComboboxItem, ComboboxGroup, ComboboxLabel, ComboboxCollection, ComboboxTrigger } from '@shadcn/components/ui/combobox.tsx'
import toast from 'react-hot-toast'
import { isNil, isNotNil, isNumber, isPlainObject, isString, isBoolean } from 'es-toolkit/predicate'
import { defaultTo } from 'es-toolkit/compat'
import { Switch } from '@shadcn/components/ui/switch.tsx'
import googleColors from '@dev/styles/static/googleColors.ts'
import {
  devLayoutStore, type DevLayoutEntry, type KeySplinesField, type KeySplinesFamily, type KeySplinesPoint,
  KEY_SPLINES_FAMILIES, KEY_SPLINES_PRESETS, keySplinesPointOf,
  type PivotField, type PivotAnchor, PIVOT_ANCHORS, PIVOT_ANCHOR_RATIO, resolvePivot,
} from '@pub-utils/devLayout'
import { useArticleViewerStore } from '@apps/ArticleViewer/store/useArticleViewerStore'

/**
 * XRay 透视拖拽（Unity Inspector 语义）：面板 = 绑定条目的通用检查器。
 * 列表来自 devLayoutStore 注册表（useDevXRay 播种），注册了哪些字段就出现哪些调整项
 * （properties 里的数值字段各生成一个数字输入，无任何字段特判）；
 * 框选锚点用渲染体根标签登记的节点（文章自己的真实标签，通道零新增 DOM）；
 * 画布拖动直写通道的 x/y 字段。
 * 帧位跟踪 rAF 读写分相；拖拽 rAF 合流；编辑实时回流，预览即终稿。
 */

/** 浅色判断（hex）：决定徽章文字黑白 */
const isLightHex = (hex: string): boolean => {
  const match = hex.match(/^#?([0-9a-f]{6})$/i)
  if (isNil(match)) return false
  const colorNumber = parseInt(match[1], 16)
  return ((colorNumber >> 16) * 299 + ((colorNumber >> 8) & 255) * 587 + (colorNumber & 255) * 114) / 1000 > 128
}

/** 沿祖先找最近 svg 的 viewBox 宽（拖拽像素→SVG 单位的等比换算基准） */
function findViewBox(element: Element): { viewBoxWidth: number; svg: Element } | null {
  let node: Element | null = element
  while (node) {
    if (node.tagName.toLowerCase() === 'svg') {
      const viewBox = node.getAttribute('viewBox')
      if (viewBox) {
        const [originX, originY, viewBoxWidth] = viewBox.trim().split(/[\s,]+/).map(Number)
        if ([originX, originY, viewBoxWidth].every(Number.isFinite)) return { viewBoxWidth, svg: node }
      }
    }
    node = node.parentElement
  }
  return null
}

/** 条目按分组聚成下拉分区（组序 = 注册顺序，「未分组」置尾） */
function groupEntries(entries: DevLayoutEntry[]): Array<[string, DevLayoutEntry[]]> {
  const grouped = new Map<string, DevLayoutEntry[]>()
  entries.forEach((entry) => {
    const list = grouped.get(entry.group)
    if (isNotNil(list)) list.push(entry)
    else grouped.set(entry.group, [entry])
  })
  const ungrouped = grouped.get('未分组')
  if (isNotNil(ungrouped)) {
    grouped.delete('未分组')
    grouped.set('未分组', ungrouped)
  }
  return [...grouped.entries()]
}

/**
 * 检查器数字字段：properties 里的数值字段（key 除外）——注册了什么就调整什么。
 * 例外形态（如 scale/rot 为对象 { value, pivotX?, pivotY? }）按一层点路径展开
 * （scale.value / scale.pivotX / scale.pivotY），补丁经点路径只合并对应子字段。
 */
interface InspectorField { name: string; value: number; step: number; display: string; min?: number; max?: number }
const fieldStepOf = (fieldValue: number): number => (Number.isInteger(fieldValue) ? 1 : 0.05)
const inspectorFieldsOf = (entry: DevLayoutEntry): InspectorField[] => {
  const fields: InspectorField[] = []
  // 白名单模式：写了 fields 就只呈现列出的字段；不写则全自动化（数值字段各出一行）
  const allowlist = isNotNil(entry.fields)
  Object.entries(entry.properties).forEach(([fieldName, fieldValue]) => {
    if (fieldName === 'key') return
    const fieldConfig = entry.fields?.[fieldName]
    if (allowlist && isNil(fieldConfig)) return
    // { value, ... } 对象形态一律走「值行+Pivot 卡」（与 valuePivotFieldsOf 同源判定），不在此展开
    if (isPlainObject(fieldValue) && isNumber((fieldValue as ValuePivotField).value)) return
    // keySplines 卡专属形态（{ x1, y1, x2, y2 }）走专属卡，不在此展开
    if (isKeySplinesField(entry, fieldName, fieldValue)) return
    const display = isString(fieldConfig?.display) ? fieldConfig.display : fieldName
    if (isNumber(fieldValue)) {
      fields.push({
        name: fieldName,
        value: fieldValue,
        display,
        step: defaultTo(fieldConfig?.step, fieldStepOf(fieldValue)),
        min: fieldConfig?.min,
        max: fieldConfig?.max,
      })
    } else if (isPlainObject(fieldValue)) {
      Object.entries(fieldValue).forEach(([subFieldName, subFieldValue]) => {
        if (isNumber(subFieldValue)) fields.push({ name: `${fieldName}.${subFieldName}`, value: subFieldValue, display: `${fieldName}.${subFieldName}`, step: fieldStepOf(subFieldValue) })
      })
    }
  })
  return fields
}

/** scale/rot 对象字段形态（白名单模式下只出列出的）；pivot 双形态存在才出 Pivot 卡 */
interface ValuePivotField { value: number; pivot?: PivotField }
const valuePivotFieldsOf = (entry: DevLayoutEntry): Array<[string, ValuePivotField]> =>
  Object.entries(entry.properties)
    .filter(([, fieldValue]) => isPlainObject(fieldValue) && isNumber((fieldValue as ValuePivotField).value))
    .filter(([fieldName]) => isNil(entry.fields) || isNotNil(entry.fields[fieldName])) as Array<[string, ValuePivotField]>

/** keySplines 卡专属双形态（type 声明或字段名兜底）：预设态（语义）或自由态（四数），不展开为点路径 */
const isKeySplinesShape = (fieldValue: unknown): fieldValue is KeySplinesField =>
  isPlainObject(fieldValue)
  && (
    (isString((fieldValue as Record<string, unknown>).preset) && isBoolean((fieldValue as Record<string, unknown>).easeIn) && isBoolean((fieldValue as Record<string, unknown>).easeOut))
    || ['x1', 'y1', 'x2', 'y2'].every((axisKey) => isNumber((fieldValue as Record<string, unknown>)[axisKey]))
  )
const isKeySplinesField = (entry: DevLayoutEntry, fieldName: string, fieldValue: unknown): boolean =>
  (fieldName === 'keySplines' || entry.fields?.[fieldName]?.type === 'keySplines') && isKeySplinesShape(fieldValue)
const keySplinesFieldsOf = (entry: DevLayoutEntry): Array<[string, KeySplinesField]> =>
  Object.entries(entry.properties)
    .filter(([fieldName, fieldValue]) => isKeySplinesField(entry, fieldName, fieldValue))
    .filter(([fieldName]) => isNil(entry.fields) || isNotNil(entry.fields[fieldName])) as Array<[string, KeySplinesField]>

/** 字符串字段（type: 'string' 声明才出——字符串字段默认不进检查器）：普通文本输入行 */
interface StringField { name: string; value: string; display: string }
const stringFieldsOf = (entry: DevLayoutEntry): StringField[] => {
  const fields: StringField[] = []
  Object.entries(entry.properties).forEach(([fieldName, fieldValue]) => {
    if (entry.fields?.[fieldName]?.type !== 'string' || !isString(fieldValue)) return
    fields.push({
      name: fieldName,
      value: fieldValue,
      display: isString(entry.fields?.[fieldName]?.display) ? entry.fields[fieldName].display : fieldName,
    })
  })
  return fields
}

/** 检查器值行（addonBefore 形态；inGroup=嵌入组合框时前缀只圆左上角）。fieldLabel=显示名，fieldName=原始字段名（语义判定/补丁键用） */
function InspectorFieldRow({ fieldLabel, fieldName, value, step, min, max, onValueChange, inGroup = false }: { fieldLabel: string; fieldName: string; value: number; step: number; min?: number; max?: number; onValueChange: (nextValue: number) => void; inGroup?: boolean }) {
  // 字段语义区间：呈现注解优先；opacity 0~1 闭区间；其余维持正值下界（步进型分数 0.05 起）、无上界
  const isOpacityField = fieldName === 'opacity' || fieldName.endsWith('.opacity')
  const fieldMin = isNotNil(min) ? min : isOpacityField ? 0 : step === 1 ? undefined : 0.05
  const fieldMax = isNotNil(max) ? max : isOpacityField ? 1 : undefined
  return (
    <div
      className={inGroup ? 'flex h-8 items-stretch' : 'flex h-8 items-stretch overflow-hidden rounded-md border border-input bg-transparent shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50'}
    >
      <span
        className={`flex w-20 items-center justify-center border-r border-input bg-muted text-xs text-muted-foreground select-none ${inGroup ? 'rounded-tl-md' : 'rounded-l-md'}`}
        style={{ fontFamily: 'var(--guohub-code-font-family)' }}
      >
        {fieldLabel}
      </span>
      <NumberField value={value} onValueChange={(nextValue) => onValueChange(step === 1 ? Math.round(Number(defaultTo(nextValue, 0))) : Number(defaultTo(nextValue, value)) || value)} step={step} min={fieldMin} max={fieldMax} className="min-w-0 flex-1">
        <NumberFieldGroup className="h-full w-full rounded-none border-0 bg-transparent px-0 shadow-none focus-within:border-transparent focus-within:ring-0">
          <NumberFieldInput aria-label={fieldLabel} className="h-full rounded-none pl-2.5 text-sm" style={{ fontFamily: 'var(--guohub-code-font-family)' }} />
          <NumberFieldIncrement className="rounded-tr-none" />
          <NumberFieldDecrement className="rounded-br-none" />
        </NumberFieldGroup>
      </NumberField>
    </div>
  )
}

/** 检查器字符串行：与值行同规格（h-8 / w-20 前缀 / 代码字体），普通 input 无步进钮 */
function StringFieldRow({ fieldLabel, value, onValueChange }: { fieldLabel: string; value: string; onValueChange: (nextValue: string) => void }) {
  return (
    <div className="flex h-8 items-stretch overflow-hidden rounded-md border border-input bg-transparent shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50">
      <span
        className="flex w-20 items-center justify-center border-r border-input bg-muted text-xs text-muted-foreground select-none rounded-l-md"
        style={{ fontFamily: 'var(--guohub-code-font-family)' }}
      >
        {fieldLabel}
      </span>
      <input
        aria-label={fieldLabel}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        className="h-full min-w-0 flex-1 rounded-none border-0 bg-transparent pl-2.5 text-sm outline-none"
        style={{ fontFamily: 'var(--guohub-code-font-family)' }}
      />
    </div>
  )
}

/** pivot 九宫格锚名中文（键与 PIVOT_ANCHORS 的 PascalCase 对齐） */
const PIVOT_ANCHOR_CN: Record<PivotAnchor, string> = {
  TopLeft: '左上', TopCenter: '上中', TopRight: '右上',
  CenterLeft: '左中', Center: '居中', CenterRight: '右中',
  BottomLeft: '左下', BottomCenter: '下中', BottomRight: '右下',
}

/** 卡内数字输入：与值行同规格（h-8/text-sm/默认步进钮），保证自由模式字段与常规字段等高。step≥1 取整，<1 保留 3 位小数 */
function TinyNumberField({ value, onValue, ariaLabel, step = 1, min, max }: { value: number; onValue: (nextValue: number) => void; ariaLabel: string; step?: number; min?: number; max?: number }) {
  return (
    <NumberField value={value} onValueChange={(nextValue) => onValue(step >= 1 ? Math.round(Number(defaultTo(nextValue, value))) : Math.round(Number(defaultTo(nextValue, value)) * 1000) / 1000)} step={step} min={min} max={max} className="min-w-0 flex-1">
      <NumberFieldGroup className="h-8 w-full rounded-md shadow-none">
        <NumberFieldInput aria-label={ariaLabel} className="h-full rounded-md pl-2.5 text-sm shadow-none" style={{ fontFamily: 'var(--guohub-code-font-family)' }} />
        <NumberFieldIncrement />
        <NumberFieldDecrement />
      </NumberFieldGroup>
    </NumberField>
  )
}

/**
 * Pivot 卡（模式即数据形态）：编辑 scale/rotation 的 pivot——数据里写了 pivot 才渲染本卡。
 * 预设态 { anchor: 'TopLeft'… } = 九宫格；自由态 { x, y } = 坐标点。
 * ⇄ 切换 = 形态转换写回数据（预设→自由带出锚点坐标，自由→预设吸附最近锚）。
 */
function PivotCard({ fieldLabel, pivotField, elementWidth, elementHeight, onPivotReplace, onPivotCoordinateChange }: {
  fieldLabel: string
  pivotField: PivotField
  elementWidth?: number
  elementHeight?: number
  onPivotReplace: (nextPivot: PivotField) => void
  onPivotCoordinateChange: (partial: { x?: number; y?: number }) => void
}) {
  const isAnchorForm = 'anchor' in pivotField
  const hasGrid = isNumber(elementWidth) && isNumber(elementHeight)
  const gridElementWidth = defaultTo(elementWidth, 0)
  const gridElementHeight = defaultTo(elementHeight, 0)
  const anchorPointOf = (anchor: PivotAnchor): { x: number; y: number } =>
    ({ x: Math.round(PIVOT_ANCHOR_RATIO[anchor].ratioX * gridElementWidth), y: Math.round(PIVOT_ANCHOR_RATIO[anchor].ratioY * gridElementHeight) })
  const displayPoint = isAnchorForm ? resolvePivot(pivotField, gridElementWidth, gridElementHeight) : pivotField

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium select-none" style={{ fontFamily: 'var(--guohub-code-font-family)' }}>
          {fieldLabel} Pivot：{isAnchorForm ? PIVOT_ANCHOR_CN[pivotField.anchor] : ''}
        </span>
        <button
          type="button"
          title={isAnchorForm ? '切换为自由 Pivot（当前锚点坐标带入）' : '吸附回最近的九宫格锚点'}
          onClick={() => {
            if (isAnchorForm) {
              onPivotReplace({ x: Math.round(displayPoint.x), y: Math.round(displayPoint.y) })
              return
            }
            if (!hasGrid) return
            const nearest = PIVOT_ANCHORS.reduce((best, anchor) => {
              const point = anchorPointOf(anchor)
              if (isNil(best)) return { anchor, point }
              const bestDistance = Math.abs(best.point.x - pivotField.x) + Math.abs(best.point.y - pivotField.y)
              const pointDistance = Math.abs(point.x - pivotField.x) + Math.abs(point.y - pivotField.y)
              return pointDistance < bestDistance ? { anchor, point } : best
            }, null as { anchor: PivotAnchor; point: { x: number; y: number } } | null)
            if (isNotNil(nearest)) onPivotReplace({ anchor: nearest.anchor })
          }}
          style={{ height: 22, width: 24, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 0, borderRadius: 6, background: 'transparent', color: 'var(--color-muted-foreground)', cursor: 'pointer', flexShrink: 0 }}
          className="transition-colors hover:bg-accent hover:text-foreground"
        >
          <ArrowLeftRight className="size-3.5" />
        </button>
      </div>
      {!isAnchorForm ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
            X
            <TinyNumberField value={pivotField.x} onValue={(nextValue) => onPivotCoordinateChange({ x: nextValue })} ariaLabel="pivot.x" />
          </label>
          <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
            Y
            <TinyNumberField value={pivotField.y} onValue={(nextValue) => onPivotCoordinateChange({ y: nextValue })} ariaLabel="pivot.y" />
          </label>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 23px)', flexShrink: 0, alignSelf: 'center', border: '1px solid color-mix(in oklab, var(--color-muted-foreground) 45%, transparent)', borderRadius: 3, overflow: 'hidden' }}>
            {PIVOT_ANCHORS.map((anchor, gridIndex) => {
              const active = pivotField.anchor === anchor
              return (
                <button
                  key={anchor}
                  type="button"
                  title={PIVOT_ANCHOR_CN[anchor]}
                  aria-label={anchor}
                  onClick={() => { onPivotReplace({ anchor }) }}
                  className="transition-colors hover:bg-accent"
                  style={{
                    width: 23, height: 23, padding: 0, cursor: 'pointer',
                    borderRight: gridIndex % 3 !== 2 ? '1px solid color-mix(in oklab, var(--color-muted-foreground) 45%, transparent)' : undefined,
                    borderBottom: gridIndex < 6 ? '1px solid color-mix(in oklab, var(--color-muted-foreground) 45%, transparent)' : undefined,
                    background: active ? 'var(--color-primary)' : 'transparent',
                  }}
                />
              )
            })}
          </div>
          <div className="flex min-w-0 flex-1 flex-col" style={{ justifyContent: 'space-evenly' }}>
            <span className="text-sm text-muted-foreground select-none" style={{ fontFamily: 'var(--guohub-code-font-family)' }}>X {Math.round(displayPoint.x)}</span>
            <span className="text-sm text-muted-foreground select-none" style={{ fontFamily: 'var(--guohub-code-font-family)' }}>Y {Math.round(displayPoint.y)}</span>
          </div>
        </div>
      )}
    </div>
  )
}

/** keySplines 面板标签（预设表/解值器与 devLayout 同源共享） */
const KEY_SPLINES_FAMILY_CN: Record<KeySplinesFamily, string> = { linear: '线性', ease: '标准', quad: '二次', cubic: '三次', quart: '四次', quint: '五次', sine: '正弦', expo: '指数', circle: '圆形' }
type KeySplinesDirection = 'in' | 'out' | 'inOut'
const KEY_SPLINES_DIRECTIONS: Array<[KeySplinesDirection, string]> = [['in', '入'], ['out', '出'], ['inOut', '入出']]

/**
 * keySplines 卡（模式即数据形态）：预设态 { preset, easeIn, easeOut } 存语义（族 + 两参数），
 * 自由态 { x1, y1, x2, y2 } 存四数（刻意微调的真相，四数全 [0,1]——微信规则不含 y 越界形态）。
 * ⇄ 切换 = 形态转换写回数据（预设→自由带出表解四数，自由→预设吸附最近预设）。
 */
function KeySplinesCard({ fieldLabel, field, onFieldReplace, onPointChange }: {
  fieldLabel: string
  field: KeySplinesField
  onFieldReplace: (nextField: KeySplinesField) => void
  onPointChange: (partial: Partial<KeySplinesPoint>) => void
}) {
  const isPresetForm = 'preset' in field
  const activePoint: KeySplinesPoint = isPresetForm ? keySplinesPointOf(field.preset, field.easeIn, field.easeOut) : field
  const directionCn = (directionName: KeySplinesDirection) => defaultTo(KEY_SPLINES_DIRECTIONS.find(([name]) => name === directionName)?.[1], '')
  const presetTitle = !isPresetForm
    ? ''
    : !field.easeIn && !field.easeOut
      ? '线性'
      : `${KEY_SPLINES_FAMILY_CN[field.preset]}·${directionCn(field.easeIn && field.easeOut ? 'inOut' : field.easeIn ? 'in' : 'out')}`
  // 曲线预览：单位立方贝塞尔（P0=(0,0) P1=(1,1)）参数化采样 + 两控制点手柄
  const toPreviewX = (value: number) => 10 + value * 80
  const toPreviewY = (value: number) => 90 - value * 80
  const curvePath = (() => {
    const points: string[] = []
    for (let t = 0; t <= 1.0001; t += 0.02) {
      const invT = 1 - t
      const x = 3 * invT * invT * t * activePoint.x1 + 3 * invT * t * t * activePoint.x2 + t * t * t
      const y = 3 * invT * invT * t * activePoint.y1 + 3 * invT * t * t * activePoint.y2 + t * t * t
      points.push(`${toPreviewX(x).toFixed(2)},${toPreviewY(y).toFixed(2)}`)
    }
    return `M ${points.join(' L ')}`
  })()
  const chipStyle = (active: boolean): React.CSSProperties => ({
    height: 24, padding: '0 4px', borderRadius: 6, fontSize: 12, cursor: 'pointer', textAlign: 'center',
    border: '1px solid var(--color-border)',
    background: active ? 'var(--color-primary)' : 'transparent',
    color: active ? 'var(--color-primary-foreground)' : 'var(--color-muted-foreground)',
  })
  return (
    <div style={{ padding: '8px 32px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium select-none" style={{ fontFamily: 'var(--guohub-code-font-family)' }}>
          {fieldLabel}：{presetTitle}
        </span>
        <button
          type="button"
          title={isPresetForm ? '切换为自由曲线（当前四数带入）' : '吸附回最近的预设曲线'}
          onClick={() => {
            if (isPresetForm) {
              onFieldReplace({ ...activePoint })
              return
            }
            const nearest = (Object.entries(KEY_SPLINES_PRESETS) as Array<[KeySplinesFamily, Record<KeySplinesDirection, KeySplinesPoint>]>)
              .flatMap(([familyName, directions]) => (Object.entries(directions) as Array<[KeySplinesDirection, KeySplinesPoint]>).map(([directionName, point]) => ({ familyName, directionName, point })))
              .reduce((best, candidate) => {
                if (isNil(best)) return candidate
                const bestDistance = Math.abs(best.point.x1 - activePoint.x1) + Math.abs(best.point.y1 - activePoint.y1) + Math.abs(best.point.x2 - activePoint.x2) + Math.abs(best.point.y2 - activePoint.y2)
                const candidateDistance = Math.abs(candidate.point.x1 - activePoint.x1) + Math.abs(candidate.point.y1 - activePoint.y1) + Math.abs(candidate.point.x2 - activePoint.x2) + Math.abs(candidate.point.y2 - activePoint.y2)
                return candidateDistance < bestDistance ? candidate : best
              }, null as { familyName: KeySplinesFamily; directionName: KeySplinesDirection; point: KeySplinesPoint } | null)
            if (isNotNil(nearest)) {
              onFieldReplace({
                preset: nearest.familyName,
                easeIn: nearest.familyName !== 'linear' && nearest.directionName !== 'out',
                easeOut: nearest.familyName !== 'linear' && nearest.directionName !== 'in',
              })
            }
          }}
          style={{ height: 22, width: 24, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 0, borderRadius: 6, background: 'transparent', color: 'var(--color-muted-foreground)', cursor: 'pointer', flexShrink: 0 }}
          className="transition-colors hover:bg-accent hover:text-foreground"
        >
          <ArrowLeftRight className="size-3.5" />
        </button>
      </div>
      <svg viewBox="0 0 100 100" style={{ display: 'block', width: '100%', height: 96 }}>
        <line x1={10} y1={90} x2={90} y2={10} stroke="var(--color-border)" strokeWidth={0.75} />
        <line x1={toPreviewX(0)} y1={toPreviewY(0)} x2={toPreviewX(activePoint.x1)} y2={toPreviewY(activePoint.y1)} stroke="var(--color-muted-foreground)" strokeWidth={0.75} strokeDasharray="2 2" />
        <line x1={toPreviewX(1)} y1={toPreviewY(1)} x2={toPreviewX(activePoint.x2)} y2={toPreviewY(activePoint.y2)} stroke="var(--color-muted-foreground)" strokeWidth={0.75} strokeDasharray="2 2" />
        <path d={curvePath} fill="none" stroke="var(--color-primary)" strokeWidth={1.5} strokeLinecap="round" />
        <circle cx={toPreviewX(activePoint.x1)} cy={toPreviewY(activePoint.y1)} r={2} fill="var(--color-primary)" />
        <circle cx={toPreviewX(activePoint.x2)} cy={toPreviewY(activePoint.y2)} r={2} fill="var(--color-primary)" />
      </svg>
      {'preset' in field ? (
        <>
          {/* 三列等宽网格：九族铺成 3×3（chip 更宽，行数不限） */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
            {KEY_SPLINES_FAMILIES.map((familyName) => {
              // 线性 chip = 「无缓动」快捷键：值等于线性（linear 预设或双开关全关）即高亮
              const active = familyName === 'linear'
                ? field.preset === 'linear' || (!field.easeIn && !field.easeOut)
                : field.preset === familyName && (field.easeIn || field.easeOut)
              return (
                <button
                  key={familyName}
                  type="button"
                  onClick={() => {
                    if (familyName === 'linear') {
                      onFieldReplace({ preset: 'linear', easeIn: false, easeOut: false })
                      return
                    }
                    // 双关全关时点族 = 自动开启「入出」（否则曲线不响应）
                    const keepEase = field.easeIn || field.easeOut
                    onFieldReplace({ preset: familyName, easeIn: keepEase ? field.easeIn : true, easeOut: keepEase ? field.easeOut : true })
                  }}
                  className="transition-colors hover:bg-accent"
                  style={chipStyle(active)}
                >
                  {KEY_SPLINES_FAMILY_CN[familyName]}
                </button>
              )
            })}
          </div>
          {field.preset !== 'linear' && (
            <>
              <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground select-none">
                <span>进入缓动</span>
                <Switch
                  className="scale-[0.8] origin-right"
                  checked={field.easeIn}
                  onCheckedChange={(checked) => {
                    onFieldReplace({ preset: field.preset, easeIn: checked, easeOut: field.easeOut })
                  }}
                />
              </div>
              <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground select-none">
                <span>退出缓动</span>
                <Switch
                  className="scale-[0.8] origin-right"
                  checked={field.easeOut}
                  onCheckedChange={(checked) => {
                    onFieldReplace({ preset: field.preset, easeIn: field.easeIn, easeOut: checked })
                  }}
                />
              </div>
            </>
          )}
        </>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
            x1
            <TinyNumberField value={field.x1} onValue={(nextValue) => onPointChange({ x1: nextValue })} ariaLabel="x1" step={0.005} min={0} max={1} />
          </label>
          <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
            y1
            <TinyNumberField value={field.y1} onValue={(nextValue) => onPointChange({ y1: nextValue })} ariaLabel="y1" step={0.005} min={0} max={1} />
          </label>
          <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
            x2
            <TinyNumberField value={field.x2} onValue={(nextValue) => onPointChange({ x2: nextValue })} ariaLabel="x2" step={0.005} min={0} max={1} />
          </label>
          <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
            y2
            <TinyNumberField value={field.y2} onValue={(nextValue) => onPointChange({ y2: nextValue })} ariaLabel="y2" step={0.005} min={0} max={1} />
          </label>
        </div>
      )}
    </div>
  )
}

/** 面板宿主：ActionPanel 的 XRay 区注入的占位 div（Portal 目标；null 时兜底挂 body） */
export const xrayPanelHost: { current: HTMLDivElement | null } = { current: null }

export default function XRayLayoutLayer({
  active,
  rootRef: _rootRef,
  children,
}: {
  active: boolean
  rootRef: { current: HTMLDivElement | null }
  children: React.ReactNode
}) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [lockedKeys, setLockedKeys] = useState<ReadonlySet<string>>(() => new Set())
  const boxRef = useRef<HTMLDivElement>(null)
  /** 选择行元素：作为下拉弹层的锚——弹层宽=整行宽（面板内宽），而非仅触发器宽 */
  const selectionRowRef = useRef<HTMLDivElement>(null)
  const frameRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const dragRef = useRef<{ key: string; startClientX: number; startClientY: number; originX: number; originY: number; unitsPerPixel: number } | null>(null)
  const { xrayFrameColor, xraySelectedColor, xrayFillColor, xrayFillOpacity } = useArticleViewerStore()

  // 通道订阅：条目增删/字段变化驱动本层（列表、检查器、导出全部由此而来）
  useSyncExternalStore(devLayoutStore.subscribeEntries, devLayoutStore.getEntriesVersion)
  const entries = devLayoutStore.getEntries()
  const selectedEntry = isNotNil(selectedKey) ? defaultTo(entries.find((entry) => entry.key === selectedKey), null) : null
  const inspectorFields = isNotNil(selectedEntry) ? inspectorFieldsOf(selectedEntry) : []
  const valuePivotFields = isNotNil(selectedEntry) ? valuePivotFieldsOf(selectedEntry) : []
  const keySplinesFields = isNotNil(selectedEntry) ? keySplinesFieldsOf(selectedEntry) : []
  const stringFields = isNotNil(selectedEntry) ? stringFieldsOf(selectedEntry) : []
  const isSelectedLocked = isNotNil(selectedKey) && lockedKeys.has(selectedKey)

  // 框位跟踪：rAF 命令式写 style（节点从通道注册表取）；几何读写分相避免强制回流
  useEffect(() => {
    if (!active) return
    let frameId = 0
    const loop = () => {
      const containerRect = boxRef.current?.getBoundingClientRect()
      if (isNotNil(containerRect)) {
        const batch: Array<[HTMLDivElement, DOMRect]> = []
        frameRefs.current.forEach((frameElement, entryKey) => {
          const node = devLayoutStore.getNode(entryKey)
          if (isNil(node)) return
          batch.push([frameElement, node.getBoundingClientRect()])
        })
        for (const [frameElement, nodeRect] of batch) {
          if (nodeRect.width === 0 || nodeRect.height === 0) { frameElement.style.display = 'none'; continue }
          frameElement.style.display = 'block'
          frameElement.style.left = `${((nodeRect.x - containerRect.x) / containerRect.width) * 100}%`
          frameElement.style.top = `${((nodeRect.y - containerRect.y) / containerRect.height) * 100}%`
          frameElement.style.width = `${(nodeRect.width / containerRect.width) * 100}%`
          frameElement.style.height = `${(nodeRect.height / containerRect.height) * 100}%`
        }
      }
      frameId = requestAnimationFrame(loop)
    }
    frameId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frameId)
  }, [active])

  // 键盘微调 x/y 字段（存在才生效）：方向键 ±1 / Shift ±10
  useEffect(() => {
    if (!active || isNil(selectedEntry) || lockedKeys.has(selectedEntry.key)) return
    const onKeyDown = (event: KeyboardEvent) => {
      const tagName = document.activeElement?.tagName.toLowerCase()
      if (tagName === 'input' || tagName === 'textarea') return
      const stepSize = event.shiftKey ? 10 : 1
      const movement: Record<string, { deltaX: number; deltaY: number }> = {
        ArrowLeft: { deltaX: -stepSize, deltaY: 0 }, ArrowRight: { deltaX: stepSize, deltaY: 0 },
        ArrowUp: { deltaX: 0, deltaY: -stepSize }, ArrowDown: { deltaX: 0, deltaY: stepSize },
      }
      const movementDelta = movement[event.key]
      if (isNil(movementDelta)) return
      const currentX = selectedEntry.properties.x
      const currentY = selectedEntry.properties.y
      if (!isNumber(currentX) || !isNumber(currentY)) return
      event.preventDefault()
      devLayoutStore.patchProperties(selectedEntry.key, {
        x: currentX + movementDelta.deltaX,
        y: currentY + movementDelta.deltaY,
      })
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [active, selectedEntry, lockedKeys])

  /** 按注册顺序前后步进选择（自动滚动定位到节点） */
  const stepSelection = (direction: 1 | -1) => {
    if (entries.length === 0) return
    const currentIndex = entries.findIndex((entry) => entry.key === selectedKey)
    const nextEntry = entries[(currentIndex + direction + entries.length) % entries.length]
    setSelectedKey(nextEntry.key)
    devLayoutStore.getNode(nextEntry.key)?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }

  /** 画布拖框：位移按最近 svg 的等比换算率换算成 SVG 单位，rAF 每帧至多写一次通道 */
  const onFramePointerDown = (entry: DevLayoutEntry) => (event: React.PointerEvent) => {
    event.preventDefault()
    setSelectedKey(entry.key)
    if (lockedKeys.has(entry.key)) return
    const startX = entry.properties.x
    const startY = entry.properties.y
    if (!isNumber(startX) || !isNumber(startY)) return
    const node = devLayoutStore.getNode(entry.key)
    if (isNil(node)) return
    const viewBox = findViewBox(node)
    if (isNil(viewBox)) return
    // SVG 等比缩放：两轴同用 viewBox宽/svg实宽 的换算率
    const svgRect = viewBox.svg.getBoundingClientRect()
    if (svgRect.width < 1) return
    const unitsPerPixel = viewBox.viewBoxWidth / svgRect.width
    dragRef.current = { key: entry.key, startClientX: event.clientX, startClientY: event.clientY, originX: startX, originY: startY, unitsPerPixel }
    let pendingDelta: { deltaX: number; deltaY: number } | null = null
    let frameId = 0
    const flush = () => {
      frameId = 0
      const drag = dragRef.current
      if (isNil(drag) || isNil(pendingDelta)) return
      devLayoutStore.patchProperties(drag.key, {
        x: Math.round(drag.originX + pendingDelta.deltaX),
        y: Math.round(drag.originY + pendingDelta.deltaY),
      })
      pendingDelta = null
    }
    const onPointerMove = (moveEvent: PointerEvent) => {
      const drag = dragRef.current
      if (isNil(drag)) return
      pendingDelta = {
        deltaX: (moveEvent.clientX - drag.startClientX) * drag.unitsPerPixel,
        deltaY: (moveEvent.clientY - drag.startClientY) * drag.unitsPerPixel,
      }
      if (frameId === 0) frameId = requestAnimationFrame(flush)
    }
    const onPointerUp = () => {
      dragRef.current = null
      if (frameId !== 0) cancelAnimationFrame(frameId)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
  }

  const fillAlphaHex = Math.round(xrayFillOpacity * 2.55).toString(16).padStart(2, '0')
  const fillValid = /^#[0-9a-f]{6}$/i.test(xrayFillColor)

  return (
    <div ref={boxRef} style={{ position: 'relative' }}>
      {children}
      {/* 框线允许溢出预览区（能看到云飘哪去了）；层叠低于左右栏(zIndex 40)，盖不住面板 */}
      {active && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 30, pointerEvents: 'none' }}>
          {entries.map((entry) => {
            const isSelected = selectedKey === entry.key
            const isLocked = lockedKeys.has(entry.key)
            return (
              <div
                key={entry.key}
                ref={(frameElement) => { if (isNotNil(frameElement)) frameRefs.current.set(entry.key, frameElement); else frameRefs.current.delete(entry.key) }}
                title={isLocked ? `${entry.key}（已锁定）` : entry.key}
                onPointerDown={onFramePointerDown(entry)}
                style={{
                  position: 'absolute',
                  border: `2px dashed ${isLocked ? 'var(--color-muted-foreground)' : isSelected ? xraySelectedColor : xrayFrameColor}`,
                  background: !isLocked && isSelected && fillValid ? `${xrayFillColor}${fillAlphaHex}` : 'transparent',
                  boxSizing: 'border-box',
                  cursor: isLocked ? 'not-allowed' : 'move',
                  touchAction: 'none',
                  pointerEvents: 'auto',
                }}
              >
                <span
                  style={{
                    position: 'absolute', top: -1, left: -1, transform: 'translateY(-100%)',
                    background: isLocked ? 'var(--color-muted-foreground)' : isSelected ? xraySelectedColor : xrayFrameColor,
                    color: isLocked ? '#fff' : isLightHex(isSelected ? xraySelectedColor : xrayFrameColor) ? '#000' : '#fff',
                    fontSize: 10, lineHeight: '14px', padding: '0 4px',
                    borderRadius: '3px 3px 0 0', whiteSpace: 'nowrap', pointerEvents: 'none', fontFamily: 'var(--guohub-code-font-family)',
                  }}
                >
                  {entry.key}
                </span>
              </div>
            )
          })}
        </div>
      )}
      {active && createPortal(
        <div style={{ fontSize: 12, display: 'flex', flexDirection: 'column', gap: 16, fontFamily: 'var(--guohub-code-font-family)' }}>
          {/* 面板主体注入 ActionPanel XRay 区的宿主 div（随操作栏滚动）；
              宿主不存在（如移动端抽屉收起）时兜底挂 body 临时可用。
              空状态只有红字提示（不带「图层选择与属性」标题）；使用说明在区头部 ? 弹窗 */}
          {entries.length === 0 ? (
            <div className="pb-4" style={{ color: googleColors.red800 }}>未发现透视元素</div>
          ) : (
          <>
            <div className="text-sm font-medium select-none">图层选择与属性</div>
            {/* 选择行：分组下拉 + 前后步进（滚动定位）+ 锁定 */}
            <div ref={selectionRowRef} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Combobox
                value={defaultTo(selectedKey, undefined)}
                onValueChange={(nextKey: string | null) => {
                  if (isNil(nextKey)) return
                  setSelectedKey(nextKey)
                  devLayoutStore.getNode(nextKey)?.scrollIntoView({ block: 'center', behavior: 'smooth' })
                }}
              >
                <ComboboxTrigger
                  className="flex h-8 min-w-0 flex-1 items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs"
                  style={{ fontFamily: 'var(--guohub-code-font-family)', cursor: 'pointer' }}
                  aria-label="选择元素"
                >
                  <span className={`truncate ${isNil(selectedKey) ? 'text-muted-foreground' : ''}`}>{defaultTo(selectedEntry?.key, '选择元素')}</span>
                </ComboboxTrigger>
                <ComboboxContent anchor={selectionRowRef} className="min-w-0" style={{ fontFamily: 'var(--guohub-code-font-family)' }}>
                  <ComboboxInput placeholder="搜索元素…" showTrigger={false} aria-label="搜索元素" />
                  <ComboboxList className="p-0 pb-1">
                    {groupEntries(entries).map(([groupName, groupList]) => (
                      <ComboboxGroup key={groupName} items={groupList.map((entry) => entry.key)}>
                        <ComboboxLabel className="rounded-none bg-muted">{groupName}</ComboboxLabel>
                        <ComboboxCollection>
                          {(entryKey: string) => {
                            const entry = entries.find((candidate) => candidate.key === entryKey)
                            if (isNil(entry)) return null
                            return (
                              <ComboboxItem key={entryKey} value={entryKey} title={entryKey} className="mx-1 w-auto min-w-0 truncate">
                                <span className="min-w-0 flex-1 truncate">{lockedKeys.has(entryKey) ? '🔒 ' : ''}{entryKey}</span>
                              </ComboboxItem>
                            )
                          }}
                        </ComboboxCollection>
                      </ComboboxGroup>
                    ))}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
              <button type="button" title="上一个" onClick={() => stepSelection(-1)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 6, border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-muted-foreground)', cursor: 'pointer', flexShrink: 0 }}><ChevronLeft className="size-4" /></button>
              <button type="button" title="下一个" onClick={() => stepSelection(1)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 6, border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-muted-foreground)', cursor: 'pointer', flexShrink: 0 }}><ChevronRight className="size-4" /></button>
              <button
                type="button"
                title={isSelectedLocked ? '解锁（恢复拖拽）' : '锁定（不响应拖拽）'}
                disabled={isNil(selectedEntry)}
                onClick={() => {
                  if (isNil(selectedKey)) return
                  setLockedKeys((previous) => {
                    const next = new Set(previous)
                    if (next.has(selectedKey)) next.delete(selectedKey)
                    else next.add(selectedKey)
                    return next
                  })
                }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 32, borderRadius: 6, border: 0, color: isSelectedLocked ? 'var(--color-destructive)' : 'var(--color-muted-foreground)', cursor: 'pointer', flexShrink: 0, opacity: isNil(selectedEntry) ? 0.4 : 1 }}
              >
                {isSelectedLocked ? <Lock className="size-4" /> : <Unlock className="size-4" />}
              </button>
            </div>

            {/* 检查器：注册了哪些字段就出现哪些调整项；scale/rot 对象形态走「值行+Pivot 卡」组合 */}
            {isNotNil(selectedEntry) ? (
              inspectorFields.length + valuePivotFields.length + keySplinesFields.length + stringFields.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {inspectorFields.map((field) => (
                    <InspectorFieldRow
                      key={field.name}
                      fieldLabel={field.display}
                      fieldName={field.name}
                      value={field.value}
                      step={field.step}
                      min={field.min}
                      max={field.max}
                      onValueChange={(nextValue) => devLayoutStore.patchProperties(selectedEntry.key, { [field.name]: nextValue })}
                    />
                  ))}
                  {stringFields.map((field) => (
                    <StringFieldRow
                      key={field.name}
                      fieldLabel={field.display}
                      value={field.value}
                      onValueChange={(nextValue) => devLayoutStore.patchProperties(selectedEntry.key, { [field.name]: nextValue })}
                    />
                  ))}
                  {valuePivotFields.map(([fieldName, valuePivot]) => {
                    // 步长/区间/标签：呈现注解优先，type 声明次之，字段名特判兜底（scale 0.05 / rotation 1）
                    const fieldConfig = selectedEntry.fields?.[fieldName]
                    const fieldType = defaultTo(fieldConfig?.type, fieldName === 'scale' || fieldName === 'rotation' ? fieldName : undefined)
                    const valueStep = defaultTo(fieldConfig?.step, fieldType === 'scale' ? 0.05 : fieldType === 'rotation' ? 1 : fieldStepOf(valuePivot.value))
                    const valueLabel = isString(fieldConfig?.display) ? fieldConfig.display : fieldName
                    return (
                    <div
                      key={`${selectedEntry.key}.${fieldName}`}
                      className="overflow-hidden rounded-md border border-input bg-transparent shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50"
                    >
                      <InspectorFieldRow
                        fieldLabel={valueLabel}
                        fieldName={fieldName}
                        value={valuePivot.value}
                        step={valueStep}
                        min={fieldConfig?.min}
                        max={fieldConfig?.max}
                        onValueChange={(nextValue) => devLayoutStore.patchProperties(selectedEntry.key, { [`${fieldName}.value`]: nextValue })}
                        inGroup
                      />
                      {isNotNil(valuePivot.pivot) && (
                        <div className="border-t border-input" style={{ padding: '8px 32px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <PivotCard
                            fieldLabel={valueLabel}
                            pivotField={valuePivot.pivot}
                            elementWidth={isNumber(selectedEntry.properties.w) ? selectedEntry.properties.w : undefined}
                            elementHeight={isNumber(selectedEntry.properties.h) ? selectedEntry.properties.h : undefined}
                            onPivotReplace={(nextPivot) => devLayoutStore.patchProperties(selectedEntry.key, { [`${fieldName}.pivot`]: nextPivot })}
                            onPivotCoordinateChange={(partial) => devLayoutStore.patchProperties(selectedEntry.key, {
                              ...(isNumber(partial.x) ? { [`${fieldName}.pivot.x`]: partial.x } : {}),
                              ...(isNumber(partial.y) ? { [`${fieldName}.pivot.y`]: partial.y } : {}),
                            })}
                          />
                        </div>
                      )}
                    </div>
                    )
                  })}
                  {keySplinesFields.map(([fieldName, keySplinesField]) => (
                    <div
                      key={`${selectedEntry.key}.${fieldName}`}
                      className="overflow-hidden rounded-md border border-input bg-transparent shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50"
                    >
                      <KeySplinesCard
                        fieldLabel={isString(selectedEntry.fields?.[fieldName]?.display) ? selectedEntry.fields[fieldName].display : fieldName}
                        field={keySplinesField}
                        onFieldReplace={(nextField) => devLayoutStore.patchProperties(selectedEntry.key, { [fieldName]: nextField })}
                        onPointChange={(partial) => devLayoutStore.patchProperties(selectedEntry.key, {
                          ...(isNumber(partial.x1) ? { [`${fieldName}.x1`]: partial.x1 } : {}),
                          ...(isNumber(partial.y1) ? { [`${fieldName}.y1`]: partial.y1 } : {}),
                          ...(isNumber(partial.x2) ? { [`${fieldName}.x2`]: partial.x2 } : {}),
                          ...(isNumber(partial.y2) ? { [`${fieldName}.y2`]: partial.y2 } : {}),
                        })}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: 'var(--color-muted-foreground)' }}>该条目没有可调整的数值字段。</div>
              )
            ) : (
              <div style={{ color: 'var(--color-muted-foreground)' }}>未选中（点画布框或下拉选择）</div>
            )}

            {/* 操作区：一行一个按钮（同款 outline，不分主次） */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Button
                size="sm" variant="outline"
                onClick={() => {
                  entries.forEach((entry) => devLayoutStore.resetProperties(entry.key))
                  toast.success('已放弃全部更改，回到文章初始数据')
                }}
                title="放弃全部更改，回到文章初始数据"
              >
                <RotateCcw className="size-3" />
                放弃全部更改
              </Button>
              <Button
                size="sm" variant="outline"
                onClick={() => {
                  // 所见即所复制：只导出检查器暴露的调整项（数值字段 + scale/rot 的 value/pivot +
                  // keySplines 卡 + type:'string' 声明的字符串字段），未暴露数据不进 JSON
                  const exportData: Record<string, Record<string, unknown>> = {}
                  entries.forEach((entry) => {
                    const exported: Record<string, unknown> = {}
                    inspectorFieldsOf(entry).forEach((field) => { exported[field.name] = field.value })
                    valuePivotFieldsOf(entry).forEach(([fieldName, valuePivot]) => {
                      exported[fieldName] = {
                        value: valuePivot.value,
                        ...(isNotNil(valuePivot.pivot) ? { pivot: { ...valuePivot.pivot } } : {}),
                      }
                    })
                    keySplinesFieldsOf(entry).forEach(([fieldName, keySplinesField]) => {
                      exported[fieldName] = { ...keySplinesField }
                    })
                    stringFieldsOf(entry).forEach((field) => { exported[field.name] = field.value })
                    exportData[entry.key] = exported
                  })
                  navigator.clipboard.writeText(JSON.stringify(exportData, null, 2))
                  toast.success(`已复制 ${entries.length} 项调整信息 JSON`)
                }}
                title="复制全部调整信息 JSON"
              >
                <Copy className="size-3" />
                复制全部调整信息
              </Button>
            </div>
          </>
          )}
        </div>,
        defaultTo(xrayPanelHost.current, document.body),
      )}
    </div>
  )
}

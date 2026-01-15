/**
 * 字体选择下拉：从 webfontCatalog 目录生成分组选项
 *
 * - restrict：限定可选的 category（如代码字体只列 monospace + CJK 兜底）
 * - followValue / followLabel：提供「跟随」语义的默认项（传 null 则不显示该项）
 * - systemValue：提供「系统默认」退出项
 * - 选中非系统/follow 的值时，值本身就是 webfontLoader 注册表的 family key，
 *   懒加载由 GlobalSettingsEffects → ensureWebfont 自动完成
 */
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@shadcn/components/ui/select.tsx'
import { catalogByCategory } from '@dev/store/useGlobalSettings/webfontCatalog.ts'

interface FontSelectProps {
  value: string | null
  onChange: (value: string | null) => void
  placeholder: string
  /** 限定可选 category（cjk- 前缀匹配前缀段） */
  restrict?: string[]
  /** 排除覆盖中文的族（英文槽专用：CJK 字体在英文槽会按 CSS 栈先到先得吞掉中文渲染） */
  excludeChinese?: boolean
  /** 「跟随」项的 value（如 follow-chinese）；onChange 会把该值归一为 null */
  followValue?: string
  followLabel?: string
  /** 「系统默认」项的 value（如 system） */
  systemValue?: string
  systemLabel?: string
}

export function FontSelect({ value, onChange, placeholder, restrict, excludeChinese, followValue, followLabel, systemValue, systemLabel }: FontSelectProps) {
  const groups = catalogByCategory()
    .map((g) => ({ ...g, fonts: excludeChinese ? g.fonts.filter((f) => !f.meta.coversChinese) : g.fonts }))
    .filter((g) => {
      if (g.fonts.length === 0) return false
      if (!restrict) return true
      return restrict.some((r) => (r.endsWith('-') ? g.key.startsWith(r) : g.key === r))
    })

  const handle = (v: string) => {
    if (v === followValue || v === systemValue) onChange(null)
    else onChange(v)
  }

  // 显示值归一：null → follow/system 的占位（Select 需要非空 value 才显示）
  const display = value ?? followValue ?? systemValue ?? 'none'

  return (
    <Select value={display} onValueChange={handle}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {followValue && <SelectItem value={followValue}>{followLabel ?? '跟随'}</SelectItem>}
        {groups.map((g) => (
          <SelectGroup key={g.key}>
            <SelectLabel>{g.label}</SelectLabel>
            {g.fonts.map(({ family, meta }) => (
              <SelectItem key={family} value={family}>
                {meta.label}
                {meta.kind === 'vf' ? '' : '（静态）'}
                {meta.coversChinese ? '' : ''}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
        {systemValue && <SelectItem value={systemValue}>{systemLabel ?? '系统默认'}</SelectItem>}
      </SelectContent>
    </Select>
  )
}

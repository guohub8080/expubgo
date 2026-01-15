import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardAction } from '@shadcn/components/ui/card.tsx';
import { Button } from '@shadcn/components/ui/button.tsx';
import { Badge } from '@shadcn/components/ui/badge.tsx';
import { cn } from '@shadcn/lib/utils.ts';
import { FontSelect } from '@dev/components/settings/FontSelect';
import { Slider } from '@shadcn/components/ui/slider.tsx';
import useGlobalSettings from '@dev/store/useGlobalSettings';
import type { ThemeMode, BackgroundMode } from '@dev/store/useGlobalSettings/types';
import { useNavigate } from 'react-router';
import { isNil } from 'es-toolkit/predicate';
import { isEmpty } from 'es-toolkit/compat';
import { ArrowLeft } from 'lucide-react';

/**
 * 设置页面组件
 * 包含主题设置、中文字体、英文字体和代码字体设置
 */
const Settings: React.FC = () => {
  const navigate = useNavigate();

  // 从 useGlobalSettings 获取所有设置
  const {
    theme,
    setTheme,
    mainDynamicBackround,
    setMainDynamicBackround,
    chineseFontFamily,
    englishFontFamily,
    codeFontFamily,
    fontWeightLight,
    fontWeightNormal,
    fontWeightMedium,
    fontWeightSemibold,
    fontWeightBold,
    lastVisitedUrl,
    bookSideWidth,
    bookContentWidth,
    bookContentPadding,
    bookSideContentGap,
    setChineseFontFamily,
    setEnglishFontFamily,
    setCodeFontFamily,
    setFontWeightLight,
    setFontWeightNormal,
    setFontWeightMedium,
    setFontWeightSemibold,
    setFontWeightBold,
    setBookSideWidth,
    setBookContentWidth,
    setBookContentPadding,
    setBookSideContentGap,
    resetFontSettings,
    resetBookSettings,
  } = useGlobalSettings();

  // 返回上次浏览的页面
  const handleBackToLastVisited = () => {
    if (!isEmpty(lastVisitedUrl) && !isNil(lastVisitedUrl)) {
      navigate(lastVisitedUrl);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* 返回按钮 - 左上角 */}
      {!isEmpty(lastVisitedUrl) && !isNil(lastVisitedUrl) && (
        <div className="mb-4">
          <Button
            variant="default"
            size="sm"
            onClick={handleBackToLastVisited}
            className="rounded-full"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="mr-1">返回上次浏览</span>
          </Button>
        </div>
      )}

      {/* 标题区域 - 居中 */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">网页浏览偏好设置</h1>
        <p className="text-muted-foreground">欢迎来到 ExPubGo，这里是配置中心</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 主题设置 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">主题设置</CardTitle>
            <CardDescription>
              选择你喜欢的配色主题
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 主题色选择 */}
            <div className="space-y-3">
              <label className="text-sm font-medium">主题配色</label>
              <div className="flex flex-wrap gap-3">
                {[
                  { value: 'light', label: '默认', colorClass: 'bg-white border-gray-200' },
                  { value: 'dark', label: '暗色', colorClass: 'bg-gray-900 border-gray-700' },
                  { value: 'retro', label: '复古', colorClass: 'bg-[#8B7355] border-[#6B5344]' },
                  { value: 'midnight', label: '午夜', colorClass: 'bg-[#1a1a2e] border-[#16213e]' },
                  { value: 'forest', label: '森林', colorClass: 'bg-[#2d4a3e] border-[#3d6b54]' },
                  { value: 'caramel', label: '焦糖', colorClass: 'bg-[#a67c52] border-[#8b6239]' },
                  { value: 'mist', label: '薄雾', colorClass: 'bg-[#94a3b8] border-[#64748b]' },
                  { value: 'ocean', label: '深海', colorClass: 'bg-[#2563eb] border-[#1d4ed8]' },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setTheme(item.value as ThemeMode)}
                    className={cn(
                      'group relative w-20 h-14 rounded-xl border-2 transition-all duration-200 overflow-hidden flex-shrink-0',
                      theme === item.value
                        ? 'border-primary ring-2 ring-primary/20 scale-[1.02]'
                        : 'border-transparent hover:border-border hover:-translate-y-0.5'
                    )}
                  >
                    {/* 色块背景 */}
                    <div className={cn('absolute inset-0 border', item.colorClass)} />
                    {/* 文字标签 */}
                    <span className={cn(
                      'relative z-10 text-xs font-semibold px-2 py-1 rounded-md',
                      ['dark', 'retro', 'midnight', 'forest', 'caramel', 'mist', 'ocean'].includes(item.value)
                        ? 'bg-black/30 text-white'
                        : 'bg-white/70 text-gray-800'
                    )}>
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 背景样式选择 */}
            <div className="space-y-3">
              <label className="text-sm font-medium">背景样式</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'theme', label: '跟随主题', preview: 'from-slate-300 via-indigo-200 to-rose-200' },
                  { value: 'aurora', label: '极光', preview: 'from-emerald-400 via-cyan-400 to-blue-400' },
                  { value: 'gradient-ocean', label: '海洋', preview: 'from-sky-300 via-teal-200 to-emerald-200' },
                  { value: 'gradient-forest', label: '森林', preview: 'from-emerald-300 via-lime-200 to-teal-200' },
                  { value: 'gradient-dusk', label: '黄昏', preview: 'from-violet-300 via-fuchsia-200 to-rose-200' },
                  { value: 'gradient-midnight', label: '午夜', preview: 'from-slate-800 via-indigo-900 to-slate-900' },
                  { value: 'gradient-ember', label: '余烬', preview: 'from-red-900 via-orange-900 to-amber-900' },
                  { value: 'gradient-nebula', label: '星云', preview: 'from-purple-900 via-fuchsia-900 to-pink-900' },
                  { value: 'gradient-abyss', label: '深渊', preview: 'from-slate-950 via-cyan-950 to-slate-900' },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setMainDynamicBackround(item.value as BackgroundMode)}
                    className={cn(
                      'group relative w-16 h-10 rounded-xl border-2 transition-all duration-200 overflow-hidden',
                      mainDynamicBackround === item.value
                        ? 'border-primary ring-2 ring-primary/20 scale-[1.02]'
                        : 'border-transparent hover:border-border hover:-translate-y-0.5'
                    )}
                  >
                    <div className={cn('absolute inset-0 bg-gradient-to-br', item.preview)} />
                    <span className="relative z-10 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-black/30 text-white">
                      {item.label}
                    </span>
                  </button>
                ))}
                {[
                  { value: 'solid-forest', label: '墨绿', color: '#064e3b' },
                  { value: 'solid-wine', label: '酒红', color: '#4c0519' },
                  { value: 'solid-warmWhite', label: '米白', color: '#FAFAF7' },
                  { value: 'solid-lightGray', label: '浅灰', color: '#F4F4F5' },
                  { value: 'solid-coolBlue', label: '浅蓝', color: '#EDF2F7' },
                  { value: 'solid-rose', label: '玫瑰', color: '#FFF1F2' },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setMainDynamicBackround(item.value as BackgroundMode)}
                    className={cn(
                      'group relative w-16 h-10 rounded-xl border-2 transition-all duration-200 overflow-hidden',
                      mainDynamicBackround === item.value
                        ? 'border-primary ring-2 ring-primary/20 scale-[1.02]'
                        : 'border-transparent hover:border-border hover:-translate-y-0.5'
                    )}
                  >
                    <div className="absolute inset-0" style={{ backgroundColor: item.color }} />
                    <span className="relative z-10 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-black/20 text-white">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 书籍设置 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">书籍设置</CardTitle>
            <CardDescription>
              配置书籍阅读页面的布局参数
            </CardDescription>
            <CardAction>
              <Button
                variant="destructive"
                size="sm"
                onClick={resetBookSettings}
              >
                重置
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* 侧边栏宽度 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">侧边栏宽度</label>
                  <Badge variant="secondary">{bookSideWidth}px</Badge>
                </div>
                <Slider
                  value={[bookSideWidth]}
                  onValueChange={(value) => setBookSideWidth(value[0])}
                  min={200}
                  max={400}
                  step={10}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  调整书籍目录侧边栏的宽度（200-400px）
                </p>
              </div>

              {/* 内容区宽度 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">内容区宽度</label>
                  <Badge variant="secondary">{bookContentWidth}px</Badge>
                </div>
                <Slider
                  value={[bookContentWidth]}
                  onValueChange={(value) => setBookContentWidth(value[0])}
                  min={600}
                  max={1200}
                  step={10}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  调整书籍内容区域的最大宽度（600-1200px）
                </p>
              </div>

              {/* 内容区内边距 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">内容区内边距</label>
                  <Badge variant="secondary">{bookContentPadding}px</Badge>
                </div>
                <Slider
                  value={[bookContentPadding]}
                  onValueChange={(value) => setBookContentPadding(value[0])}
                  min={10}
                  max={60}
                  step={5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  调整内容区域的内边距（10-60px）
                </p>
              </div>

              {/* 侧边栏与内容区间距 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">侧边栏与内容区间距</label>
                  <Badge variant="secondary">{bookSideContentGap}px</Badge>
                </div>
                <Slider
                  value={[bookSideContentGap]}
                  onValueChange={(value) => setBookSideContentGap(value[0])}
                  min={0}
                  max={40}
                  step={5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  调整侧边栏和内容区之间的间距（0-40px）
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 字体设置 - 包含选择和字重 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl">字体设置</CardTitle>
            <CardDescription>
              配置字体和字重参数
            </CardDescription>
            <CardAction>
              <Button
                variant="destructive"
                size="sm"
                onClick={resetFontSettings}
              >
                重置
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {/* 字体选择 - 三列（目录驱动，全族按风格分组） */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 中文默认字体：仅 CJK 覆盖族 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">中文默认字体</label>
                  <FontSelect
                    value={chineseFontFamily}
                    onChange={setChineseFontFamily}
                    placeholder="选择中文默认字体"
                    restrict={['cjk-']}
                    systemValue="system"
                    systemLabel="系统默认字体"
                  />
                </div>

                {/* 英文默认字体：全部拉丁族（排除 CJK 族——CJK 字体在英文槽会截走中文渲染） */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">英文默认字体</label>
                  <FontSelect
                    value={englishFontFamily}
                    onChange={setEnglishFontFamily}
                    placeholder="跟随中文字体"
                    followValue="follow-chinese"
                    followLabel="跟随中文"
                    excludeChinese
                  />
                </div>

                {/* 代码字体：等宽优先 + CJK 兜底（代码里的中文注释） */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">代码字体</label>
                  <FontSelect
                    value={codeFontFamily}
                    onChange={setCodeFontFamily}
                    placeholder="跟随英文字体"
                    followValue="follow-english"
                    followLabel="跟随英文"
                    restrict={['monospace', 'cjk-']}
                    systemValue="system"
                    systemLabel="系统默认等宽字体"
                  />
                </div>
              </div>

              {/* 分隔线 */}
              <div className="border-t border-border" />

              {/* 字重设置 */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">字重调整</label>
                  <span className="text-xs text-muted-foreground">调整 Tailwind 字重类的具体数值</span>
                </div>
                <div className="space-y-5">
                  {/* font-light */}
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="min-w-[100px]">font-light</Badge>
                        <Badge variant="secondary">{fontWeightLight}</Badge>
                      </div>
                      <Slider
                        value={[fontWeightLight]}
                        onValueChange={(value) => setFontWeightLight(value[0])}
                        min={100}
                        max={900}
                        step={1}
                        className="flex-1"
                      />
                    </div>
                    <p className="text-base font-light sm:pl-[116px]">
                      轻字重预览 Light Weight Preview
                    </p>
                  </div>

                  {/* font-normal */}
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="default" className="min-w-[100px]">font-normal</Badge>
                        <Badge variant="default">{fontWeightNormal}</Badge>
                      </div>
                      <Slider
                        value={[fontWeightNormal]}
                        onValueChange={(value) => setFontWeightNormal(value[0])}
                        min={100}
                        max={900}
                        step={1}
                        className="flex-1"
                      />
                    </div>
                    <p className="text-base font-normal sm:pl-[116px]">
                      正常字重预览 Normal Weight Preview（默认）
                    </p>
                  </div>

                  {/* font-medium */}
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="min-w-[100px]">font-medium</Badge>
                        <Badge variant="secondary">{fontWeightMedium}</Badge>
                      </div>
                      <Slider
                        value={[fontWeightMedium]}
                        onValueChange={(value) => setFontWeightMedium(value[0])}
                        min={100}
                        max={900}
                        step={1}
                        className="flex-1"
                      />
                    </div>
                    <p className="text-base font-medium sm:pl-[116px]">
                      中等字重预览 Medium Weight Preview
                    </p>
                  </div>

                  {/* font-semibold */}
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="min-w-[100px]">font-semibold</Badge>
                        <Badge variant="secondary">{fontWeightSemibold}</Badge>
                      </div>
                      <Slider
                        value={[fontWeightSemibold]}
                        onValueChange={(value) => setFontWeightSemibold(value[0])}
                        min={100}
                        max={900}
                        step={1}
                        className="flex-1"
                      />
                    </div>
                    <p className="text-base font-semibold sm:pl-[116px]">
                      半粗字重预览 Semibold Weight Preview
                    </p>
                  </div>

                  {/* font-bold */}
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="min-w-[100px]">font-bold</Badge>
                        <Badge variant="secondary">{fontWeightBold}</Badge>
                      </div>
                      <Slider
                        value={[fontWeightBold]}
                        onValueChange={(value) => setFontWeightBold(value[0])}
                        min={100}
                        max={900}
                        step={1}
                        className="flex-1"
                      />
                    </div>
                    <p className="text-base font-bold sm:pl-[116px]">
                      粗字重预览 Bold Weight Preview
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 字体预览 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl">字体预览</CardTitle>
            <CardDescription>
              查看当前字体配置的实际效果
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-5 border rounded-lg bg-muted/50 space-y-5">
              {/* 中文预览 */}
              <div className="space-y-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-medium">
                  文字预览
                </span>
                <div className="text-lg leading-relaxed">
                  落霞与孤鹜齐飞，秋水共长天一色。
                </div>
                <div className="text-muted-foreground">
                  A lazy fox jumps over the quick brown dog.
                </div>
                <div className="text-sm text-muted-foreground/70 tracking-wide">
                  {",.!?;:\"\"'()'[]{}{'}{'}} 《》「」【】、。，；：！？…—·@#$%&*+-=/<>"}
                </div>
              </div>

              {/* 代码字体预览 */}
              <div className="space-y-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-slate-700 text-slate-200 text-xs font-medium">
                  代码预览
                </span>
                <div className="p-3 bg-slate-900 text-slate-100 rounded-lg code-font-family text-sm">
                  <div>// 这是代码字体预览</div>
                  <div>function hello() {'{'}</div>
                  <div className='px-4'>    console.log("Hello, World!");</div>
                  <div className='px-4'>  return "代码字体显示效果";</div>
                  <div>{'}'}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default Settings;

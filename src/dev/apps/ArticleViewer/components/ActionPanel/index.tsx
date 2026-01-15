/** @jsxImportSource react */
import React, { useState, useEffect } from 'react';
import { Copy, FileCode, Check, X, RefreshCw, RotateCcw } from 'lucide-react';
import { Button } from '@shadcn/components/ui/button.tsx';
import { Card } from '@shadcn/components/ui/card.tsx';
import { Slider } from '@shadcn/components/ui/slider.tsx';
import { Label } from '@shadcn/components/ui/label.tsx';
import { Switch } from '@shadcn/components/ui/switch.tsx';
import { Input } from '@shadcn/components/ui/input.tsx';
import { Badge } from '@shadcn/components/ui/badge.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '@shadcn/components/ui/popover.tsx';
import { HexColorPicker } from 'react-colorful';
import toast from 'react-hot-toast';
import { useArticleViewerStore, ARTICLE_VIEWER_LAYOUT } from '@apps/ArticleViewer/store/useArticleViewerStore';
import faviconSvg from '@dev/assets/svgs/logoSvg/favicon.svg';

/**
 * 右栏：操作功能组件
 * 专业的 UI/UX 设计，遵循现代设计原则
 */

// RGB 转 Hex 辅助函数
const rgbToHex = (rgb: string): string => {
  const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (!match) return '#787878';
  const [, r, g, b] = match;
  return '#' + [r, g, b].map(x => {
    const hex = parseInt(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

// 判断颜色是否为浅色（用于决定使用黑色还是白色圆点）
const isLightColor = (color: string): boolean => {
  // 处理 rgb() 格式
  const rgbMatch = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (rgbMatch) {
    const [, r, g, b] = rgbMatch;
    const brightness = (parseInt(r) * 299 + parseInt(g) * 587 + parseInt(b) * 114) / 1000;
    return brightness > 128;
  }

  // 处理 hex 格式
  const hexMatch = color.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (hexMatch) {
    const [, r, g, b] = hexMatch;
    const brightness = (parseInt(r, 16) * 299 + parseInt(g, 16) * 587 + parseInt(b, 16) * 114) / 1000;
    return brightness > 128;
  }

  // 默认返回 false（使用白色圆点）
  return false;
};

// 预设画布颜色
const CANVAS_PRESET_COLORS = [
  { value: 'transparent', label: '透明', display: '#ffffff' },
  { value: '#ffffff', label: '白色', display: '#ffffff' },
  { value: '#f8fafc', label: '浅灰', display: '#f8fafc' },
  { value: '#e2e8f0', label: '灰色', display: '#e2e8f0' },
  { value: '#94a3b8', label: '中灰', display: '#94a3b8' },
  { value: '#475569', label: '深灰', display: '#475569' },
  { value: '#1e293b', label: '暗灰', display: '#1e293b' },
  { value: '#000000', label: '黑色', display: '#000000' },
  { value: '#ef4444', label: '红色', display: '#ef4444' },
  { value: '#22c55e', label: '绿色', display: '#22c55e' },
  { value: '#3b82f6', label: '蓝色', display: '#3b82f6' },
] as const;

// 预设边框颜色
const BORDER_PRESET_COLORS = [
  { value: 'transparent', label: '透明', display: '#ffffff' },
  { value: '#ffffff', label: '白色', display: '#ffffff' },
  { value: '#000000', label: '黑色', display: '#000000' },
  { value: '#ef4444', label: '红色', display: '#ef4444' },
  { value: '#3b82f6', label: '蓝色', display: '#3b82f6' },
] as const;

export default function ActionPanel() {
  const {
    previewWidth,
    setPreviewWidth,
    previewMaxAvailableWidth,
    previewPadding,
    setPreviewPadding,
    showPreviewBorder,
    toggleShowPreviewBorder,
    previewBorderColor,
    setPreviewBorderColor,
    previewBackgroundColor,
    setPreviewBackgroundColor,
    previewContentRef,
    setMobileActionPanel,
    mobileShowActionPanel
  } = useArticleViewerStore();

  // 判断是否在移动端抽屉中（< 1024px 且抽屉打开）
  const [isMobileDrawer, setIsMobileDrawer] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileDrawer(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 复制成功状态
  const [copyRichTextSuccess, setCopyRichTextSuccess] = useState(false);
  const [copyHTMLSuccess, setCopyHTMLSuccess] = useState(false);

  // 复制富文本到剪贴板
  const handleCopyRichText = async () => {
    try {
      const contentDiv = previewContentRef.current;
      if (!contentDiv) {
        return;
      }

      const htmlContent = contentDiv.innerHTML;
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const plainText = contentDiv.textContent || '';

      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': blob,
          'text/plain': new Blob([plainText], { type: 'text/plain' })
        })
      ]);

      setCopyRichTextSuccess(true);
      setTimeout(() => setCopyRichTextSuccess(false), 1000);
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  // 复制HTML文字到剪贴板
  const handleCopyHTML = async () => {
    try {
      const contentDiv = previewContentRef.current;
      if (!contentDiv) {
        return;
      }

      const htmlContent = contentDiv.innerHTML
        .replace(/\s+/g, ' ')
        .replace(/>\s+</g, '><')
        .replace(/\s+\/>/g, '/>')
        .trim();

      await navigator.clipboard.writeText(htmlContent);

      setCopyHTMLSuccess(true);
      setTimeout(() => setCopyHTMLSuccess(false), 1000);
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  return (<>
    <div className="min-h-0 flex flex-col">
    {/* // 最外层的p-0不允许做任何修改 */}
    {/* <div className="h-full flex flex-col pt-0 pr-1 overflow-y-auto"> */}
      {/* 整个 ActionPanel 作为一张完整的卡片， pt-0不允许修改 */}
      {/* <Card className="bg-card pt-0 rounded-lg"> */}
        {/* Header 设计 */}
        <div className={`flex-shrink-0 border-b bg-slate-300 relative ${isMobileDrawer ? 'rounded-t-none' : 'rounded-t-lg'}`}>
          <div className="flex items-center justify-center py-3">
            <img
              src={faviconSvg}
              alt="ExPubGo"
              className="w-5 h-5"
            />
            <h2 className="text-sm font-medium text-foreground ml-2">预览选项</h2>
          </div>

          {/* 移动端关闭按钮 */}
          <button
            type="button"
            onClick={() => setMobileActionPanel(false)}
            className="lg:hidden absolute top-1/2 -translate-y-1/2 right-3 p-1.5 rounded-md hover:bg-white/20 transition-all duration-200"
            aria-label="关闭"
          >
            <X className="w-5 h-5 text-foreground/70 hover:text-foreground" />
          </button>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 min-h-0 overflow-y-auto pt-4 pb-2">
          <div className="space-y-6">
          {/* 预览设置区域 */}
          <section className="space-y-4">
            {/* 内容宽度控制  border-b px-6 pb-4 不允许修改*/}
              <div className="space-y-3 border-b px-6 pb-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">内容宽度</Label>
                  <Badge className="font-mono text-xs bg-primary text-primary-foreground">
                    {previewWidth}
                  </Badge>
                </div>
                <Slider
                  value={[previewWidth]}
                  onValueChange={(value: number[]) => setPreviewWidth(value[0])}
                  min={ARTICLE_VIEWER_LAYOUT.PREVIEW_MIN_WIDTH}
                  max={previewMaxAvailableWidth}
                  step={10}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{ARTICLE_VIEWER_LAYOUT.PREVIEW_MIN_WIDTH}</span>
                  <span>{previewMaxAvailableWidth}</span>
                </div>
              </div>

              {/* 内边距控制 border-b px-6 pb-4 不允许修改 */}
              <div className="space-y-3  border-b px-6 pb-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">内边距</Label>
                  <Badge className="font-mono text-xs bg-primary text-primary-foreground">
                    {previewPadding}
                  </Badge>
                </div>
                <Slider
                  value={[previewPadding]}
                  onValueChange={(value: number[]) => setPreviewPadding(value[0])}
                  min={0}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>0</span>
                  <span>100</span>
                </div>
              </div>

              {/* 画布颜色 */}
              <div className="space-y-3 border-b px-6 pb-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">画布颜色</Label>
                  <Badge className="font-mono text-xs bg-primary text-primary-foreground">
                    {previewBackgroundColor.toUpperCase()}
                  </Badge>
                </div>

                {/* 预设颜色选项 */}
                <div className="grid grid-cols-6 gap-2">
                  {CANVAS_PRESET_COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setPreviewBackgroundColor(color.value)}
                      className={`relative aspect-square w-full rounded-md border-2 transition-all duration-200 hover:scale-105 cursor-pointer
                        after:content-[''] after:absolute after:bottom-[-6px] after:left-1/2 after:-translate-x-1/2
                        after:w-3/4 after:h-1 after:bg-primary after:rounded-full after:transition-opacity after:duration-200
                        ${previewBackgroundColor === color.value ? 'after:opacity-100' : 'after:opacity-0'}`}
                      style={{
                        backgroundColor: color.display,
                        borderColor: 'rgb(226, 232, 240)',
                      }}
                      title={color.label}
                    >
                      {/* 透明背景的棋盘格 */}
                      {color.value === 'transparent' && (
                        <div
                          className="absolute inset-0 rounded-sm"
                          style={{
                            backgroundImage: `
                              linear-gradient(45deg, #e5e7eb 25%, transparent 25%),
                              linear-gradient(-45deg, #e5e7eb 25%, transparent 25%),
                              linear-gradient(45deg, transparent 75%, #e5e7eb 75%),
                              linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)
                            `,
                            backgroundSize: '16px 16px',
                            backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
                          }}
                        />
                      )}
                    </button>
                  ))}

                  {/* 自定义颜色取色器 - 简洁设计 */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className={`relative aspect-square w-full rounded-md border-2 border-dashed transition-all duration-200 hover:scale-105 cursor-pointer overflow-hidden
                          after:content-[''] after:absolute after:bottom-[-6px] after:left-1/2 after:-translate-x-1/2
                          after:w-3/4 after:h-1 after:bg-primary after:rounded-full after:transition-opacity after:duration-200
                          ${!CANVAS_PRESET_COLORS.some(c => c.value === previewBackgroundColor) ? 'after:opacity-100 border-primary/60' : 'after:opacity-0 border-muted-foreground/40 hover:border-primary/60'}`}
                        style={{
                          backgroundColor: !CANVAS_PRESET_COLORS.some(c => c.value === previewBackgroundColor)
                            ? previewBackgroundColor
                            : 'transparent',
                        }}
                        title="自定义颜色"
                      >
                        {/* 如果未选自定义颜色，显示4色块网格 */}
                        {CANVAS_PRESET_COLORS.some(c => c.value === previewBackgroundColor) && (
                          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 p-1.5 gap-1">
                            <div className="rounded-sm" style={{ backgroundColor: '#ef4444' }} />
                            <div className="rounded-sm" style={{ backgroundColor: '#22c55e' }} />
                            <div className="rounded-sm" style={{ backgroundColor: '#3b82f6' }} />
                            <div className="rounded-sm" style={{ backgroundColor: '#f59e0b' }} />
                          </div>
                        )}

                        {/* 如果已选自定义颜色，显示圆圈图标 */}
                        {!CANVAS_PRESET_COLORS.some(c => c.value === previewBackgroundColor) && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div
                              className="w-2 h-2 rounded-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                              style={{
                                backgroundColor: isLightColor(previewBackgroundColor) ? '#000000' : '#ffffff'
                              }}
                            />
                          </div>
                        )}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-6" align="center" sideOffset={10}>
                      <div className="flex flex-col items-center space-y-3">
                        {/* react-colorful 颜色选择器 - 居中 */}
                        <HexColorPicker
                          color={previewBackgroundColor === 'transparent' ? '#ffffff' : previewBackgroundColor}
                          onChange={(color) => setPreviewBackgroundColor(color.toUpperCase())}
                          style={{ width: '240px', height: '180px' }}
                        />
                        {/* 颜色值输入框 - 与选择器同宽对齐 */}
                        <div className="flex items-center gap-2" style={{ width: '240px' }}>
                          <div
                            className="w-10 h-10 rounded border-2 border-border flex-shrink-0"
                            style={{ backgroundColor: previewBackgroundColor }}
                          />
                          <Input
                            type="text"
                            value={previewBackgroundColor.toUpperCase()}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPreviewBackgroundColor(e.target.value.toUpperCase())}
                            className="font-mono text-sm flex-1"
                            placeholder="#FFFFFF"
                          />
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* 边框颜色 */}
              <div className="space-y-3 border-b px-6 pb-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">边框颜色</Label>
                  <Badge className="font-mono text-xs bg-primary text-primary-foreground">
                    {previewBorderColor.toUpperCase()}
                  </Badge>
                </div>

                {/* 预设颜色选项 */}
                <div className="grid grid-cols-6 gap-2">
                  {BORDER_PRESET_COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setPreviewBorderColor(color.value)}
                      className={`relative aspect-square w-full rounded-md border-2 transition-all duration-200 hover:scale-105 cursor-pointer
                        after:content-[''] after:absolute after:bottom-[-6px] after:left-1/2 after:-translate-x-1/2
                        after:w-3/4 after:h-1 after:bg-primary after:rounded-full after:transition-opacity after:duration-200
                        ${previewBorderColor === color.value ? 'after:opacity-100' : 'after:opacity-0'}`}
                      style={{
                        backgroundColor: color.display,
                        borderColor: 'rgb(226, 232, 240)',
                      }}
                      title={color.label}
                    >
                      {/* 透明背景的棋盘格 */}
                      {color.value === 'transparent' && (
                        <div
                          className="absolute inset-0 rounded-sm"
                          style={{
                            backgroundImage: `
                              linear-gradient(45deg, #e5e7eb 25%, transparent 25%),
                              linear-gradient(-45deg, #e5e7eb 25%, transparent 25%),
                              linear-gradient(45deg, transparent 75%, #e5e7eb 75%),
                              linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)
                            `,
                            backgroundSize: '16px 16px',
                            backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
                          }}
                        />
                      )}
                    </button>
                  ))}

                  {/* 自定义颜色取色器 */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className={`relative aspect-square w-full rounded-md border-2 border-dashed transition-all duration-200 hover:scale-105 cursor-pointer overflow-hidden
                          after:content-[''] after:absolute after:bottom-[-6px] after:left-1/2 after:-translate-x-1/2
                          after:w-3/4 after:h-1 after:bg-primary after:rounded-full after:transition-opacity after:duration-200
                          ${!BORDER_PRESET_COLORS.some(c => c.value === previewBorderColor) ? 'after:opacity-100 border-primary/60' : 'after:opacity-0 border-muted-foreground/40 hover:border-primary/60'}`}
                        style={{
                          backgroundColor: !BORDER_PRESET_COLORS.some(c => c.value === previewBorderColor)
                            ? previewBorderColor
                            : 'transparent',
                        }}
                        title="自定义颜色"
                      >
                        {/* 如果未选自定义颜色，显示4色块网格 */}
                        {BORDER_PRESET_COLORS.some(c => c.value === previewBorderColor) && (
                          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 p-1.5 gap-1">
                            <div className="rounded-sm" style={{ backgroundColor: '#ef4444' }} />
                            <div className="rounded-sm" style={{ backgroundColor: '#22c55e' }} />
                            <div className="rounded-sm" style={{ backgroundColor: '#3b82f6' }} />
                            <div className="rounded-sm" style={{ backgroundColor: '#f59e0b' }} />
                          </div>
                        )}

                        {/* 如果已选自定义颜色，显示圆圈图标 */}
                        {!BORDER_PRESET_COLORS.some(c => c.value === previewBorderColor) && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div
                              className="w-2 h-2 rounded-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                              style={{
                                backgroundColor: isLightColor(previewBorderColor) ? '#000000' : '#ffffff'
                              }}
                            />
                          </div>
                        )}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-6" align="center" sideOffset={10}>
                      <div className="flex flex-col items-center space-y-3">
                        {/* react-colorful 颜色选择器 - 居中 */}
                        <HexColorPicker
                          color={previewBorderColor === 'transparent' ? '#ffffff' : previewBorderColor}
                          onChange={(color) => setPreviewBorderColor(color.toUpperCase())}
                          style={{ width: '240px', height: '180px' }}
                        />
                        {/* 颜色值输入框 - 与选择器同宽对齐 */}
                        <div className="flex items-center gap-2" style={{ width: '240px' }}>
                          <div
                            className="w-10 h-10 rounded border-2 border-border flex-shrink-0"
                            style={{ backgroundColor: previewBorderColor }}
                          />
                          <Input
                            type="text"
                            value={previewBorderColor.toUpperCase()}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPreviewBorderColor(e.target.value.toUpperCase())}
                            className="font-mono text-sm flex-1"
                            placeholder="#FFFFFF"
                          />
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </section>

            {/* 功能按钮区域 - 2x2 田字格布局 */}
            <section className="space-y-3 px-6 pb-4">
              {/* 第一行：刷新预览 + 刷新页面 */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  className="flex items-center justify-center h-10 transition-all duration-200 hover:shadow-md cursor-pointer gap-2"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // 重新加载预览区域（重置 SVG 动画等）
                    if (previewContentRef.current) {
                      const content = previewContentRef.current.innerHTML;
                      previewContentRef.current.innerHTML = '';
                      setTimeout(() => {
                        if (previewContentRef.current) {
                          previewContentRef.current.innerHTML = content;
                        }
                      }, 0);
                    }
                  }}
                >
                  <RotateCcw className="h-4 w-4" />
                  <span className="text-sm font-medium">刷新预览</span>
                </Button>

                <Button
                  className="flex items-center justify-center h-10 transition-all duration-200 hover:shadow-md cursor-pointer gap-2"
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw className="h-4 w-4" />
                  <span className="text-sm font-medium">刷新页面</span>
                </Button>
              </div>

              {/* 第二行：复制富文本 + 复制HTML源码 */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  className="flex flex-col items-center justify-center h-20 transition-all duration-200 hover:shadow-md cursor-pointer gap-2"
                  variant="default"
                  onClick={handleCopyRichText}
                >
                  {copyRichTextSuccess ? (
                    <>
                      <Check className="h-5 w-5" />
                      <span className="text-sm font-medium">复制成功</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-5 w-5" />
                      <span className="text-sm font-medium">复制富文本</span>
                    </>
                  )}
                </Button>

                <Button
                  className="flex flex-col items-center justify-center h-20 transition-all duration-200 hover:shadow-md cursor-pointer gap-2"
                  variant="outline"
                  onClick={handleCopyHTML}
                >
                  {copyHTMLSuccess ? (
                    <>
                      <Check className="h-5 w-5" />
                      <span className="text-sm font-medium">复制成功</span>
                    </>
                  ) : (
                    <>
                      <FileCode className="h-5 w-5" />
                      <span className="text-sm font-medium">复制HTML源码</span>
                    </>
                  )}
                </Button>
              </div>
            </section>
          </div>
          </div>
      {/*  </Card> */}
    {/*  </div> */}
    </div>
 </> );
}

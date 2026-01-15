import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@shadcn/components/ui/card';
import { Button } from '@shadcn/components/ui/button';
import { Label } from '@shadcn/components/ui/label';
import { Slider } from '@shadcn/components/ui/slider';
import { Input } from '@shadcn/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@shadcn/components/ui/popover';
import { RgbaColorPicker } from 'react-colorful';
import { Copy, Check } from 'lucide-react';
import { useAtomValue } from 'jotai';
import { shadowConfigAtom } from '../store/useShadowStore';
import { generateCSSCode, parseColorString } from '../utils/shadowUtils';
import type { ColorFormat } from '../utils/shadowUtils';

interface ShadowPreviewProps {
  colorFormat: ColorFormat;
}

const ShadowPreview: React.FC<ShadowPreviewProps> = ({ colorFormat }) => {
  const config = useAtomValue(shadowConfigAtom);
  const [copied, setCopied] = useState(false);

  const [previewSize, setPreviewSize] = useState(150);
  const [previewBorderRadius, setPreviewBorderRadius] = useState(8);
  const [previewBgColor, setPreviewBgColor] = useState('rgba(245, 245, 244, 1)');
  const [bgColorPopoverOpen, setBgColorPopoverOpen] = useState(false);

  const cssCode = generateCSSCode(config, colorFormat);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cssCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  const handleBgColorChange = (color: { r: number; g: number; b: number; a: number }) => {
    setPreviewBgColor(`rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`);
  };

  const getBgRgbaObject = (colorStr: string) => {
    try {
      const parsed = parseColorString(colorStr);
      return { r: parsed.r, g: parsed.g, b: parsed.b, a: parsed.a };
    } catch {
      return { r: 245, g: 245, b: 244, a: 1 };
    }
  };

  const previewStyle: React.CSSProperties = {
    width: `${previewSize}px`,
    height: `${previewSize}px`,
    backgroundColor: 'white',
    borderRadius: `${previewBorderRadius}px`,
    ...(config.type === 'box-shadow'
      ? {
          boxShadow: `${config.inset ? 'inset ' : ''}${config.offsetX}px ${config.offsetY}px ${config.blur}px ${config.spread}px ${config.color}`
        }
      : {
          filter: `drop-shadow(${config.offsetX}px ${config.offsetY}px ${config.blur}px ${config.color})`
        })
  };

  return (
    <div className="space-y-3">
      {/* 预览区域 */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">阴影预览</CardTitle>
            <span className="text-xs text-muted-foreground font-mono">
              {config.type === 'box-shadow' ? 'box-shadow' : 'filter: drop-shadow'}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* 预览方块 */}
          <div
            className="w-full h-[400px] rounded-xl flex items-center justify-center relative overflow-hidden"
            style={{ backgroundColor: previewBgColor }}
          >
            <div style={previewStyle} />
          </div>

          {/* 紧凑控制条 */}
          <div className="flex items-center gap-3 px-1">
            {/* 背景颜色 */}
            <Popover open={bgColorPopoverOpen} onOpenChange={setBgColorPopoverOpen}>
              <PopoverTrigger asChild>
                <button
                  className="w-6 h-6 rounded-md border border-border/60 flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-primary/30 transition-all"
                  style={{ backgroundColor: previewBgColor }}
                  title="背景颜色"
                />
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3" align="start" side="bottom">
                <RgbaColorPicker
                  color={getBgRgbaObject(previewBgColor)}
                  onChange={handleBgColorChange}
                  style={{ width: '180px' }}
                />
              </PopoverContent>
            </Popover>

            <div className="w-px h-4 bg-border/50" />

            {/* 方块大小 */}
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <span className="text-[11px] text-muted-foreground">大小</span>
              <Slider
                value={[previewSize]}
                onValueChange={([v]) => setPreviewSize(v)}
                min={50} max={250} step={10}
                className="flex-1"
              />
              <span className="text-[11px] text-muted-foreground w-7 text-right tabular-nums">{previewSize}</span>
            </div>

            <div className="w-px h-4 bg-border/50" />

            {/* 圆角 */}
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <span className="text-[11px] text-muted-foreground">圆角</span>
              <Slider
                value={[previewBorderRadius]}
                onValueChange={([v]) => setPreviewBorderRadius(v)}
                min={0} max={125} step={1}
                className="flex-1"
              />
              <span className="text-[11px] text-muted-foreground w-7 text-right tabular-nums">{previewBorderRadius}</span>
            </div>
          </div>

          {/* CSS 代码 */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">CSS 代码</Label>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopy}
                className="h-6 px-2 gap-1 text-xs"
              >
                {copied ? (
                  <><Check className="w-3 h-3" />已复制</>
                ) : (
                  <><Copy className="w-3 h-3" />复制</>
                )}
              </Button>
            </div>
            <div className="bg-muted/40 rounded-lg px-3 py-2.5 font-mono text-xs leading-relaxed">
              <code className="text-foreground break-all">{cssCode}</code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShadowPreview;

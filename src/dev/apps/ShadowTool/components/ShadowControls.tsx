import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@shadcn/components/ui/card';
import { Label } from '@shadcn/components/ui/label';
import { Slider } from '@shadcn/components/ui/slider';
import { Tabs, TabsList, TabsTrigger } from '@shadcn/components/ui/tabs';
import { Input } from '@shadcn/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@shadcn/components/ui/popover';
import { RgbaColorPicker } from 'react-colorful';
import { useAtomValue, useSetAtom } from 'jotai';
import { shadowConfigAtom, updateShadowConfigAtom, type ShadowType, type OutputFormat } from '../store/useShadowStore';
import { parseRGBA, rgbaToString, formatColor, parseColorString, type ColorFormat } from '../utils/shadowUtils';

interface ShadowControlsProps {
  colorFormat: ColorFormat;
  onColorFormatChange: (format: ColorFormat) => void;
}

const ShadowControls: React.FC<ShadowControlsProps> = ({ colorFormat, onColorFormatChange }) => {
  const config = useAtomValue(shadowConfigAtom);
  const updateConfig = useSetAtom(updateShadowConfigAtom);

  // Popover 打开状态
  const [popoverOpen, setPopoverOpen] = useState(false);

  // 将 rgba 字符串转换为 react-colorful 的格式
  const getRgbaObject = (color: string) => {
    const parsed = parseRGBA(color);
    if (!parsed) {
      return { r: 0, g: 0, b: 0, a: 0.25 };
    }
    return parsed;
  };

  // 处理颜色变化
  const handleColorChange = (color: { r: number; g: number; b: number; a: number }) => {
    const newColor = rgbaToString(color.r, color.g, color.b, color.a);
    updateConfig({ color: newColor });
  };

  // 处理输入框变化
  const handleColorInputChange = (value: string) => {
    const parsed = parseColorString(value);
    if (parsed) {
      const newColor = rgbaToString(parsed.r, parsed.g, parsed.b, parsed.a);
      updateConfig({ color: newColor });
    }
  };

  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle className="text-base">阴影参数</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 阴影类型 */}
        <div className="space-y-2">
          <Label className="text-sm">阴影类型</Label>
          <Tabs
            value={config.type}
            onValueChange={(value: ShadowType) => updateConfig({ type: value })}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 h-9 bg-muted">
              <TabsTrigger
                value="box-shadow"
                className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Box Shadow
              </TabsTrigger>
              <TabsTrigger
                value="filter"
                className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Filter Drop
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* 输出格式 */}
        <div className="space-y-2">
          <Label className="text-sm">输出格式</Label>
          <Tabs
            value={config.outputFormat}
            onValueChange={(value: OutputFormat) => updateConfig({ outputFormat: value })}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 h-9 bg-muted">
              <TabsTrigger
                value="css"
                className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                原生 CSS
              </TabsTrigger>
              <TabsTrigger
                value="react"
                className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                React 格式
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* X 偏移 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm">X 偏移</Label>
            <span className="text-xs text-muted-foreground">{config.offsetX}px</span>
          </div>
          <Slider
            value={[config.offsetX]}
            onValueChange={([value]) => updateConfig({ offsetX: value })}
            min={-50}
            max={50}
            step={1}
            className="w-full"
          />
        </div>

        {/* Y 偏移 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Y 偏移</Label>
            <span className="text-xs text-muted-foreground">{config.offsetY}px</span>
          </div>
          <Slider
            value={[config.offsetY]}
            onValueChange={([value]) => updateConfig({ offsetY: value })}
            min={-50}
            max={50}
            step={1}
            className="w-full"
          />
        </div>

        {/* 模糊半径 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm">模糊半径</Label>
            <span className="text-xs text-muted-foreground">{config.blur}px</span>
          </div>
          <Slider
            value={[config.blur]}
            onValueChange={([value]) => updateConfig({ blur: value })}
            min={0}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        {/* 扩散半径 (仅 box-shadow) */}
        {config.type === 'box-shadow' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm">扩散半径</Label>
              <span className="text-xs text-muted-foreground">{config.spread}px</span>
            </div>
            <Slider
              value={[config.spread]}
              onValueChange={([value]) => updateConfig({ spread: value })}
              min={-50}
              max={50}
              step={1}
              className="w-full"
            />
          </div>
        )}

        {/* 阴影颜色 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm">阴影颜色</Label>
            {/* 格式切换 */}
            <Tabs
              value={colorFormat}
              onValueChange={(value) => onColorFormatChange(value as ColorFormat)}
              className="w-auto"
            >
              <TabsList className="h-7 bg-muted p-0.5">
                <TabsTrigger value="hex" className="text-xs h-6 px-2">HEX</TabsTrigger>
                <TabsTrigger value="rgb" className="text-xs h-6 px-2">RGB</TabsTrigger>
                <TabsTrigger value="hsl" className="text-xs h-6 px-2">HSL</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* 颜色输入区域 */}
          <div className="flex items-center gap-2">
            {/* 颜色方块 + 取色器 */}
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <button
                  className="w-10 h-10 rounded border-2 border-border flex-shrink-0 cursor-pointer hover:border-primary transition-colors"
                  style={{ backgroundColor: config.color }}
                />
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4" align="start" side="left">
                <RgbaColorPicker
                  color={getRgbaObject(config.color)}
                  onChange={handleColorChange}
                  style={{ width: '200px' }}
                />
              </PopoverContent>
            </Popover>

            {/* 颜色值输入框 */}
            <Input
              type="text"
              value={formatColor(config.color, colorFormat)}
              onChange={(e) => handleColorInputChange(e.target.value)}
              className="font-mono text-sm flex-1"
            />
          </div>
        </div>

        {/* 阴影不透明度滑块 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm">阴影不透明度</Label>
            <span className="text-xs text-muted-foreground">{getRgbaObject(config.color).a.toFixed(2)}</span>
          </div>
          <Slider
            value={[getRgbaObject(config.color).a]}
            onValueChange={([value]) => {
              const rgba = getRgbaObject(config.color);
              handleColorChange({ ...rgba, a: value });
            }}
            min={0}
            max={1}
            step={0.01}
            className="w-full"
          />
        </div>

        {/* Inset 开关 (仅 box-shadow) */}
        {config.type === 'box-shadow' && (
          <div className="space-y-2">
            <Label className="text-sm">阴影类型</Label>
            <Tabs
              value={config.inset ? 'inset' : 'outset'}
              onValueChange={(value) => updateConfig({ inset: value === 'inset' })}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 h-9 bg-muted">
                <TabsTrigger value="outset" className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  外阴影
                </TabsTrigger>
                <TabsTrigger value="inset" className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  内阴影
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ShadowControls;

import React from "react";
import { ColorMode } from "@dev/store/useColorControl";

interface ColorModeSelectorProps {
  value: ColorMode;
  onChange: (mode: ColorMode) => void;
  enableAlpha: boolean;
}

const colorModesBase = [
  { value: 'hex' as const, label: 'HEX', description: '#RRGGBB' },
  { value: 'rgb' as const, label: 'RGB', description: 'rgb(r,g,b)' },
  { value: 'hsl' as const, label: 'HSL', description: 'hsl(h,s%,l%)' },
  { value: 'oklch' as const, label: 'OKLCH', description: 'oklch(l,c,h)' },
];

const colorModesWithAlpha = [
  { value: 'hex' as const, label: 'HEX', description: '#RRGGBBAA' },
  { value: 'rgba' as const, label: 'RGBA', description: 'rgb(r,g,b,a)' },
  { value: 'hsla' as const, label: 'HSLA', description: 'hsla(h,s%,l%,a)' },
  { value: 'oklch' as const, label: 'OKLCH', description: 'oklch(l,c,h,a)' },
];

export function ColorModeSelector({ value, onChange, enableAlpha }: ColorModeSelectorProps) {
  // 根据透明度状态选择不同的颜色模式列表
  const colorModes = enableAlpha ? colorModesWithAlpha : colorModesBase;

  // 如果当前模式不在可用模式中（比如从rgba切换到不透明状态），需要切换到对应的模式
  React.useEffect(() => {
    if (!enableAlpha && (value === 'rgba' || value === 'hsla')) {
      // 如果透明度被关闭，切换到对应的非透明模式
      if (value === 'rgba') onChange('rgb');
      if (value === 'hsla') onChange('hsl');
    } else if (enableAlpha && (value === 'rgb' || value === 'hsl')) {
      // 如果透明度被打开，切换到对应的透明模式
      if (value === 'rgb') onChange('rgba');
      if (value === 'hsl') onChange('hsla');
    }
  }, [enableAlpha, value, onChange]);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {colorModes.map((mode) => (
          <button
            key={mode.value}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
              value === mode.value
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border bg-background text-foreground hover:bg-muted'
            }`}
            onClick={() => onChange(mode.value)}
            title={mode.description}
          >
            {/* 模式标签 */}
            <div className="text-sm font-medium">
              {mode.label}
            </div>

            {/* 模式描述 */}
            <div className="text-xs opacity-70">
              {mode.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
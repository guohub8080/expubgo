import React from "react";
import { Switch } from "@shadcn/components/ui/switch.tsx";
import { Slider } from "@shadcn/components/ui/slider.tsx";
import { Badge } from "@shadcn/components/ui/badge.tsx";

interface AlphaControlProps {
  enabled: boolean;
  alpha: number;
  onEnabledChange: (enabled: boolean) => void;
  onAlphaChange: (alpha: number) => void;
}

export function AlphaControl({ enabled, alpha, onEnabledChange, onAlphaChange }: AlphaControlProps) {
  return (
    <div className="space-y-2">
      {/* 状态显示和切换 */}
      <div className="flex items-center justify-between p-2 rounded-lg border">
        <div className="flex items-center gap-2">
          <Switch
            checked={enabled}
            onCheckedChange={onEnabledChange}
          />
          <span className="text-sm text-foreground">
            {enabled ? '包含透明度' : '不包含透明度'}
          </span>
        </div>

        <Badge
          variant="secondary"
          className={!enabled ? 'bg-gray-100 text-gray-500 border-gray-200' : 'bg-blue-100 text-blue-700 border-blue-200'}
        >
          {Math.round(alpha * 100)}%
        </Badge>
      </div>

      {/* 透明度滑块 - 简化版本 */}
      <div className={`${!enabled ? 'opacity-50' : ''}`}>
        <Slider
          value={[alpha * 100]}
          onValueChange={(value) => onAlphaChange(value[0] / 100)}
          max={100}
          step={1}
          className={`w-full ${!enabled ? '[&_[data-radix-slider-range]]:bg-gray-400 [&_[data-radix-slider-thumb]]:border-gray-400 [&_[data-radix-slider-track]]:bg-gray-200' : ''}`}
          disabled={!enabled}
        />
      </div>
    </div>
  );
}
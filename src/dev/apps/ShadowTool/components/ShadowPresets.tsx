import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@shadcn/components/ui/card';
import { useSetAtom } from 'jotai';
import { updateShadowConfigAtom } from '../store/useShadowStore';

const shadowPresets = [
  { name: '无阴影', config: { offsetX: 0, offsetY: 0, blur: 0, spread: 0, color: 'rgba(0, 0, 0, 0)' } },
  { name: '极轻微', config: { offsetX: 0, offsetY: 1, blur: 2, spread: 0, color: 'rgba(0, 0, 0, 0.05)' } },
  { name: '轻微', config: { offsetX: 0, offsetY: 2, blur: 4, spread: 0, color: 'rgba(0, 0, 0, 0.08)' } },
  { name: '中等', config: { offsetX: 0, offsetY: 4, blur: 8, spread: 0, color: 'rgba(0, 0, 0, 0.1)' } },
  { name: '明显', config: { offsetX: 0, offsetY: 6, blur: 12, spread: 0, color: 'rgba(0, 0, 0, 0.12)' } },
  { name: '强烈', config: { offsetX: 0, offsetY: 12, blur: 24, spread: 0, color: 'rgba(0, 0, 0, 0.2)' } },

  { name: 'TW sm', config: { offsetX: 0, offsetY: 1, blur: 2, spread: 0, color: 'rgba(0, 0, 0, 0.05)' } },
  { name: 'TW md', config: { offsetX: 0, offsetY: 4, blur: 6, spread: -1, color: 'rgba(0, 0, 0, 0.1)' } },
  { name: 'TW lg', config: { offsetX: 0, offsetY: 10, blur: 15, spread: -3, color: 'rgba(0, 0, 0, 0.1)' } },
  { name: 'TW xl', config: { offsetX: 0, offsetY: 20, blur: 25, spread: -5, color: 'rgba(0, 0, 0, 0.1)' } },
  { name: 'TW 2xl', config: { offsetX: 0, offsetY: 25, blur: 50, spread: -12, color: 'rgba(0, 0, 0, 0.25)' } },
  { name: 'Material1', config: { offsetX: 0, offsetY: 2, blur: 4, spread: 0, color: 'rgba(0, 0, 0, 0.14)' } },
  { name: 'Material2', config: { offsetX: 0, offsetY: 3, blur: 6, spread: 0, color: 'rgba(0, 0, 0, 0.16)' } },
  { name: 'Material3', config: { offsetX: 0, offsetY: 10, blur: 20, spread: 0, color: 'rgba(0, 0, 0, 0.19)' } },
  { name: 'Material4', config: { offsetX: 0, offsetY: 14, blur: 28, spread: 0, color: 'rgba(0, 0, 0, 0.22)' } },
  { name: 'BS sm', config: { offsetX: 0, offsetY: 1, blur: 2, spread: 0, color: 'rgba(0, 0, 0, 0.075)' } },
  { name: 'BS md', config: { offsetX: 0, offsetY: 4, blur: 6, spread: 0, color: 'rgba(0, 0, 0, 0.1)' } },
  { name: 'BS lg', config: { offsetX: 0, offsetY: 8, blur: 16, spread: 0, color: 'rgba(0, 0, 0, 0.12)' } },
  { name: 'BS xl', config: { offsetX: 0, offsetY: 16, blur: 32, spread: 0, color: 'rgba(0, 0, 0, 0.14)' } },
  { name: 'Apple', config: { offsetX: 0, offsetY: 4, blur: 12, spread: 0, color: 'rgba(0, 0, 0, 0.08)' } },
  { name: 'Apple lg', config: { offsetX: 0, offsetY: 12, blur: 40, spread: 0, color: 'rgba(0, 0, 0, 0.12)' } },
  { name: 'Ant Design', config: { offsetX: 0, offsetY: 2, blur: 8, spread: 0, color: 'rgba(0, 0, 0, 0.15)' } },
  { name: 'Chakra sm', config: { offsetX: 0, offsetY: 1, blur: 2, spread: 0, color: 'rgba(0, 0, 0, 0.05)' } },
  { name: 'Chakra md', config: { offsetX: 0, offsetY: 4, blur: 6, spread: -1, color: 'rgba(0, 0, 0, 0.1)' } },
  { name: 'Chakra lg', config: { offsetX: 0, offsetY: 10, blur: 15, spread: -3, color: 'rgba(0, 0, 0, 0.1)' } },
  { name: 'Chakra xl', config: { offsetX: 0, offsetY: 20, blur: 25, spread: -5, color: 'rgba(0, 0, 0, 0.1)' } },
  { name: 'Fluent sm', config: { offsetX: 0, offsetY: 2, blur: 4, spread: 0, color: 'rgba(0, 0, 0, 0.06)' } },
  { name: 'Fluent md', config: { offsetX: 0, offsetY: 4, blur: 8, spread: 0, color: 'rgba(0, 0, 0, 0.1)' } },
  { name: 'Fluent lg', config: { offsetX: 0, offsetY: 8, blur: 16, spread: 0, color: 'rgba(0, 0, 0, 0.14)' } },

  { name: '卡片', config: { offsetX: 0, offsetY: 2, blur: 8, spread: 0, color: 'rgba(0, 0, 0, 0.1)' } },
  { name: '按钮', config: { offsetX: 0, offsetY: 1, blur: 3, spread: 0, color: 'rgba(0, 0, 0, 0.15)' } },
  { name: '浮动', config: { offsetX: 0, offsetY: 8, blur: 16, spread: 0, color: 'rgba(0, 0, 0, 0.1)' } },
  { name: '弹窗', config: { offsetX: 0, offsetY: 12, blur: 40, spread: -5, color: 'rgba(0, 0, 0, 0.2)' } },
  { name: '内凹', config: { offsetX: 0, offsetY: 2, blur: 4, spread: -1, color: 'rgba(0, 0, 0, 0.15)' } },

  { name: '发光', config: { offsetX: 0, offsetY: 0, blur: 20, spread: 5, color: 'rgba(0, 0, 0, 0.15)' } },
  { name: '锐利', config: { offsetX: 0, offsetY: 4, blur: 0, spread: 0, color: 'rgba(0, 0, 0, 0.2)' } },
  { name: '底部加深', config: { offsetX: 0, offsetY: 8, blur: 12, spread: -4, color: 'rgba(0, 0, 0, 0.15)' } },
  { name: '环绕', config: { offsetX: 0, offsetY: 0, blur: 10, spread: -5, color: 'rgba(0, 0, 0, 0.1)' } },
];

const ShadowPresets: React.FC = () => {
  const updateConfig = useSetAtom(updateShadowConfigAtom);

  const applyPreset = (preset: typeof shadowPresets[0]) => {
    updateConfig({
      offsetX: preset.config.offsetX,
      offsetY: preset.config.offsetY,
      blur: preset.config.blur,
      spread: preset.config.spread,
      color: preset.config.color,
      inset: false
    });
  };

  return (
    <Card className="h-full overflow-hidden pb-0 pt-3">
      <CardHeader className="pb-1 pt-3 gap-0">
        <CardTitle className="text-base">预设</CardTitle>
      </CardHeader>
      <CardContent className="overflow-auto pb-0 px-3 pt-0" style={{ maxHeight: 'calc(100vh - 120px)' }}>
        <div className="grid grid-cols-3 gap-1.5 pb-3">
          {shadowPresets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className="group flex flex-col items-center gap-1 py-2 px-1 rounded-lg hover:bg-muted/60 transition-colors"
              title={preset.name}
            >
              <div
                className="w-10 h-10 rounded-md"
                style={{
                  backgroundColor: '#dbeafe',
                  boxShadow: `${preset.config.offsetX}px ${preset.config.offsetY}px ${preset.config.blur}px ${preset.config.spread}px ${preset.config.color}`
                }}
              />
              <span className="text-[11px] text-muted-foreground leading-tight truncate w-full text-center">{preset.name}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ShadowPresets;

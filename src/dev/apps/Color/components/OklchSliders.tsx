import * as React from 'react';
import { parseHexColor, rgbaToOklch, oklchToRgba, formatOklch } from '../utils/color';
import { CopyButton } from './CopyButton';
import type { OKLCH } from '../utils/color';
import '../styles/sliders.css';

interface OklchSlidersProps {
  /**
   * 当前颜色（十六进制字符串，不包含#号）
   */
  hex: string;
  /**
   * 颜色变化回调
   */
  onColorChange: (hex: string) => void;
  /**
   * 透明度启用状态
   */
  enableAlpha?: boolean;
  /**
   * 透明度变化回调
   */
  onAlphaChange?: (alpha: number) => void;
  /**
   * 当前透明度值 (0-1)
   */
  alpha?: number;
}

export const OklchSliders: React.FC<OklchSlidersProps> = ({ hex, onColorChange, enableAlpha = false, onAlphaChange, alpha = 1 }) => {
  const [oklchValues, setOklchValues] = React.useState({ l: 0.5, c: 0.2, h: 0 });
  const [decimalPlaces, setDecimalPlaces] = React.useState(4);

  // 当外部颜色变化时，更新OKLCH滑块值
  React.useEffect(() => {
    const rgba = parseHexColor(hex);
    if (rgba) {
      const oklch = rgbaToOklch(rgba);
      setOklchValues({
        l: oklch.l || 0.5,
        c: oklch.c || 0,
        h: oklch.h || 0
      });
    }
  }, [hex]);

  // 处理OKLCH滑块变化
  const handleOklchChange = (channel: 'l' | 'c' | 'h', value: number) => {
    const newOklch = { ...oklchValues, [channel]: value };
    setOklchValues(newOklch);

    // 将OKLCH值转换为RGB，然后转换为十六进制
    const oklchColor: OKLCH = {
      mode: 'oklch',
      l: newOklch.l,
      c: newOklch.c,
      h: newOklch.h,
      alpha: 1
    };
    const rgba = oklchToRgba(oklchColor);
    const newHex = `#${rgba.r.toString(16).padStart(2, '0')}${rgba.g.toString(16).padStart(2, '0')}${rgba.b.toString(16).padStart(2, '0')}`.replace(/^#/, '');
    onColorChange(newHex);
  };

  // 生成滑块的背景渐变
  const generateSliderBackground = (channel: 'l' | 'c' | 'h') => {
    if (channel === 'l') {
      // Lightness: 从黑到白
      return `linear-gradient(to right,
        oklch(0% ${oklchValues.c.toFixed(3)} ${oklchValues.h.toFixed(1)}deg),
        oklch(50% ${oklchValues.c.toFixed(3)} ${oklchValues.h.toFixed(1)}deg),
        oklch(100% ${oklchValues.c.toFixed(3)} ${oklchValues.h.toFixed(1)}deg))`;
    } else if (channel === 'c') {
      // Chroma: 从灰到彩
      return `linear-gradient(to right,
        oklch(${oklchValues.l.toFixed(3)} 0% ${oklchValues.h.toFixed(1)}deg),
        oklch(${oklchValues.l.toFixed(3)} 0.1 ${oklchValues.h.toFixed(1)}deg),
        oklch(${oklchValues.l.toFixed(3)} 0.2 ${oklchValues.h.toFixed(1)}deg),
        oklch(${oklchValues.l.toFixed(3)} 0.3 ${oklchValues.h.toFixed(1)}deg))`;
    } else {
      // Hue: 完整色环
      return `linear-gradient(to right,
        oklch(${oklchValues.l.toFixed(3)} ${oklchValues.c.toFixed(3)} 0deg),
        oklch(${oklchValues.l.toFixed(3)} ${oklchValues.c.toFixed(3)} 60deg),
        oklch(${oklchValues.l.toFixed(3)} ${oklchValues.c.toFixed(3)} 120deg),
        oklch(${oklchValues.l.toFixed(3)} ${oklchValues.c.toFixed(3)} 180deg),
        oklch(${oklchValues.l.toFixed(3)} ${oklchValues.c.toFixed(3)} 240deg),
        oklch(${oklchValues.l.toFixed(3)} ${oklchValues.c.toFixed(3)} 300deg),
        oklch(${oklchValues.l.toFixed(3)} ${oklchValues.c.toFixed(3)} 360deg))`;
    }
  };

  return (
    <div className="color-picker-card rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-foreground">OKLCH 滑块</h3>

        {/* 小数位数控制 */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">小数位数</span>
          <span className="text-sm font-mono text-zinc-600 bg-zinc-100 dark:bg-zinc-900/30 px-2 py-1 rounded" style={{ fontFamily: 'var(--guohub-theme-font-family)' }}>
            {decimalPlaces} 位
          </span>
          <input
            type="range"
            min="2"
            max="7"
            step="1"
            value={decimalPlaces}
            onChange={(e) => setDecimalPlaces(parseInt(e.target.value))}
            className="slider-rounded slider-zinc w-24 h-6 appearance-none cursor-pointer"
            style={{
              background: 'linear-gradient(to right, rgb(228, 228, 231), rgb(113, 113, 122))',
            }}
          />
        </div>
      </div>

      <div className="space-y-5">
        {/* Lightness 滑块 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Lightness</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono text-gray-600 bg-gray-100 dark:bg-gray-900/30 px-2 py-1 rounded" style={{ fontFamily: 'var(--guohub-theme-font-family)' }}>
                {(oklchValues.l * 100).toFixed(0)}%
              </span>
              <span className="text-sm font-mono text-white bg-gray-600 px-2 py-1 rounded" style={{ fontFamily: 'var(--guohub-theme-font-family)' }}>
                {oklchValues.l.toFixed(decimalPlaces)}
              </span>
            </div>
          </div>
          <div className="relative">
            <input
              type="range"
              min="0"
              max="1"
              step="0.001"
              value={oklchValues.l}
              onChange={(e) => handleOklchChange('l', parseFloat(e.target.value))}
              className="slider-rounded slider-lightness w-full h-8 appearance-none cursor-pointer"
              style={{
                background: generateSliderBackground('l'),
              }}
            />
          </div>
        </div>

        {/* Chroma 滑块 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-cyan-600 dark:text-cyan-400">Chroma</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono text-white bg-cyan-600 px-2 py-1 rounded" style={{ fontFamily: 'var(--guohub-theme-font-family)' }}>
                {oklchValues.c.toFixed(decimalPlaces)}
              </span>
            </div>
          </div>
          <div className="relative">
            <input
              type="range"
              min="0"
              max="0.4"
              step="0.001"
              value={oklchValues.c}
              onChange={(e) => handleOklchChange('c', parseFloat(e.target.value))}
              className="slider-rounded slider-chroma w-full h-8 appearance-none cursor-pointer"
              style={{
                background: generateSliderBackground('c'),
              }}
            />
          </div>
        </div>

        {/* Hue 滑块 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-teal-600 dark:text-teal-400">Hue</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono text-teal-600 bg-teal-100 dark:bg-teal-900/30 px-2 py-1 rounded" style={{ fontFamily: 'var(--guohub-theme-font-family)' }}>
                {(oklchValues.h / 3.6).toFixed(0)}%
              </span>
              <span className="text-sm font-mono text-white bg-teal-600 px-2 py-1 rounded" style={{ fontFamily: 'var(--guohub-theme-font-family)' }}>
                {oklchValues.h.toFixed(decimalPlaces)}°
              </span>
            </div>
          </div>
          <div className="relative">
            <input
              type="range"
              min="0"
              max="360"
              step="1"
              value={oklchValues.h}
              onChange={(e) => handleOklchChange('h', parseFloat(e.target.value))}
              className="slider-rounded slider-hue w-full h-8 appearance-none cursor-pointer"
              style={{
                background: generateSliderBackground('h'),
              }}
            />
          </div>
        </div>
      </div>

      {/* 复制颜色按钮 */}
      <div className="mt-4">
        <CopyButton
          value={
            enableAlpha
              ? `oklch(${oklchValues.l.toFixed(decimalPlaces)} ${oklchValues.c.toFixed(decimalPlaces)} ${oklchValues.h.toFixed(decimalPlaces)}deg / ${alpha.toFixed(decimalPlaces)})`
              : formatOklch({
                  mode: 'oklch',
                  l: oklchValues.l,
                  c: oklchValues.c,
                  h: oklchValues.h,
                  alpha: 1
                })
          }
        >
          {enableAlpha ? '复制OKLCH颜色' : '复制OKLCH颜色'}
        </CopyButton>
      </div>
    </div>
  );
};

export default OklchSliders;
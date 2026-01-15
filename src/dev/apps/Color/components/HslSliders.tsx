import * as React from 'react';
import { parseHexColor, toHex, rgbaToHsla, hslaToRgba } from '../utils/color';
import { CopyButton } from './CopyButton';
import '../styles/sliders.css';

interface HslSlidersProps {
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

export const HslSliders: React.FC<HslSlidersProps> = ({ hex, onColorChange, enableAlpha = false, onAlphaChange, alpha = 1 }) => {
  const [hslValues, setHslValues] = React.useState({ h: 0, s: 100, l: 50 });

  // 当外部颜色变化时，更新HSL滑块值
  React.useEffect(() => {
    const rgba = parseHexColor(hex);
    if (rgba) {
      const hsla = rgbaToHsla(rgba);
      setHslValues({
        h: hsla.h,
        s: hsla.s,
        l: hsla.l
      });
    }
  }, [hex]);

  // 处理HSL滑块变化
  const handleHslChange = (channel: 'h' | 's' | 'l', value: number) => {
    const newHsl = { ...hslValues, [channel]: value };
    setHslValues(newHsl);

    // 将HSL值转换为十六进制，保留当前的alpha值
    const alphaValue = enableAlpha ? (alpha || 1) : 1;
    const rgba = hslaToRgba({ ...newHsl, a: alphaValue });
    const newHex = toHex(rgba, enableAlpha).replace(/^#/, '');
    onColorChange(newHex);
  };

  // 生成滑块的背景渐变
  const generateSliderBackground = (channel: 'h' | 's' | 'l') => {
    const colors = [];

    if (channel === 'h') {
      // 色相滑块：从红到紫的完整色环
      for (let i = 0; i <= 360; i += 30) {
        colors.push(`hsl(${i}, 100%, 50%)`);
      }
      return `linear-gradient(to right, ${colors.join(', ')})`;
    } else if (channel === 's') {
      // 饱和度滑块：从灰色到纯色
      return `linear-gradient(to right, hsl(${hslValues.h}, 0%, ${hslValues.l}%), hsl(${hslValues.h}, 100%, ${hslValues.l}%))`;
    } else {
      // 亮度滑块：从黑到白，中间是当前色相和饱和度的颜色
      return `linear-gradient(to right, hsl(${hslValues.h}, ${hslValues.s}%, 0%), hsl(${hslValues.h}, ${hslValues.s}%, 50%), hsl(${hslValues.h}, ${hslValues.s}%, 100%))`;
    }
  };

  return (
    <div className="color-picker-card rounded-xl border bg-card p-4">
      <h3 className="text-base font-semibold text-foreground mb-3">HSL 滑块</h3>

      <div className="space-y-6">
        {/* Hue 滑块 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-purple-600 dark:text-purple-400">Hue</span>
            <span className="text-sm font-mono text-white bg-purple-600 px-2 py-1 rounded" style={{ fontFamily: 'var(--guohub-theme-font-family)' }}>
              {hslValues.h}°
            </span>
          </div>
          <div className="relative">
            <input
              type="range"
              min="0"
              max="360"
              value={hslValues.h}
              onChange={(e) => handleHslChange('h', parseInt(e.target.value))}
              className="slider-rounded slider-hue w-full h-8 appearance-none cursor-pointer"
              style={{
                background: generateSliderBackground('h'),
              }}
            />
          </div>
        </div>

        {/* Saturation 滑块 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-pink-600 dark:text-pink-400">Saturation</span>
            <span className="text-sm font-mono text-white bg-pink-600 px-2 py-1 rounded" style={{ fontFamily: 'var(--guohub-theme-font-family)' }}>
              {hslValues.s}%
            </span>
          </div>
          <div className="relative">
            <input
              type="range"
              min="0"
              max="100"
              value={hslValues.s}
              onChange={(e) => handleHslChange('s', parseInt(e.target.value))}
              className="slider-rounded slider-saturation w-full h-8 appearance-none cursor-pointer"
              style={{
                background: generateSliderBackground('s'),
              }}
            />
          </div>
        </div>

        {/* Lightness 滑块 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">Lightness</span>
            <span className="text-sm font-mono text-white bg-indigo-600 px-2 py-1 rounded" style={{ fontFamily: 'var(--guohub-theme-font-family)' }}>
              {hslValues.l}%
            </span>
          </div>
          <div className="relative">
            <input
              type="range"
              min="0"
              max="100"
              value={hslValues.l}
              onChange={(e) => handleHslChange('l', parseInt(e.target.value))}
              className="slider-rounded slider-lightness w-full h-8 appearance-none cursor-pointer"
              style={{
                background: generateSliderBackground('l'),
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
              ? `hsla(${hslValues.h}, ${hslValues.s}%, ${hslValues.l}%, ${alpha.toFixed(2)})`
              : `hsl(${hslValues.h}, ${hslValues.s}%, ${hslValues.l}%)`
          }
        >
          {enableAlpha ? '复制HSLA颜色' : '复制HSL颜色'}
        </CopyButton>
      </div>
    </div>
  );
};

export default HslSliders;
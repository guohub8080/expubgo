import * as React from 'react';
import { parseHexColor, toHex } from '../utils/color';
import { CopyButton } from './CopyButton';
import '../styles/sliders.css';

interface RgbSlidersProps {
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

export const RgbSliders: React.FC<RgbSlidersProps> = ({ hex, onColorChange, enableAlpha = false, onAlphaChange, alpha = 1 }) => {
  const [rgbValues, setRgbValues] = React.useState({ r: 255, g: 0, b: 0 });

  // 当外部颜色变化时，更新RGB滑块值
  React.useEffect(() => {
    const rgba = parseHexColor(hex);
    if (rgba) {
      setRgbValues({
        r: rgba.r,
        g: rgba.g,
        b: rgba.b
      });
    }
  }, [hex]);

  // 处理RGB滑块变化
  const handleRgbChange = (channel: 'r' | 'g' | 'b', value: number) => {
    const newRgb = { ...rgbValues, [channel]: value };
    setRgbValues(newRgb);

    // 将RGB值转换为十六进制，保留当前的alpha值
    const alphaValue = enableAlpha ? Math.round((alpha || 1) * 255) : 255;
    const newHex = toHex({ ...newRgb, a: alphaValue }, enableAlpha).replace(/^#/, '');
    onColorChange(newHex);
  };

  // 生成滑块的背景渐变
  const generateSliderBackground = (channel: 'r' | 'g' | 'b') => {
    // 使用简化的渐变，只生成起点、中间点和终点
    let startColor, endColor;
    switch (channel) {
      case 'r':
        startColor = `rgb(0, ${rgbValues.g}, ${rgbValues.b})`;
        endColor = `rgb(255, ${rgbValues.g}, ${rgbValues.b})`;
        break;
      case 'g':
        startColor = `rgb(${rgbValues.r}, 0, ${rgbValues.b})`;
        endColor = `rgb(${rgbValues.r}, 255, ${rgbValues.b})`;
        break;
      case 'b':
        startColor = `rgb(${rgbValues.r}, ${rgbValues.g}, 0)`;
        endColor = `rgb(${rgbValues.r}, ${rgbValues.g}, 255)`;
        break;
    }
    return `linear-gradient(to right, ${startColor}, ${endColor})`;
  };

  return (
    <div className="color-picker-card rounded-xl border bg-card p-4">
      <h3 className="text-base font-semibold text-foreground mb-3">RGB 滑块</h3>

      <div className="space-y-6">
        {/* Red 滑块 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-red-600 dark:text-red-400">Red</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono text-red-600 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded" style={{ fontFamily: 'var(--guohub-theme-font-family)' }}>
                HEX: {rgbValues.r.toString(16).padStart(2, '0').toUpperCase()}
              </span>
              <span className="text-sm font-mono text-white bg-red-600 px-2 py-1 rounded" style={{ fontFamily: 'var(--guohub-theme-font-family)' }}>
                {rgbValues.r}
              </span>
            </div>
          </div>
          <div className="relative">
            <input
              type="range"
              min="0"
              max="255"
              value={rgbValues.r}
              onChange={(e) => handleRgbChange('r', parseInt(e.target.value))}
              className="slider-rounded slider-red w-full h-8 appearance-none cursor-pointer"
              style={{
                background: generateSliderBackground('r'),
              }}
            />
          </div>
        </div>

        {/* Green 滑块 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-green-600 dark:text-green-400">Green</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded" style={{ fontFamily: 'var(--guohub-theme-font-family)' }}>
                HEX: {rgbValues.g.toString(16).padStart(2, '0').toUpperCase()}
              </span>
              <span className="text-sm font-mono text-white bg-green-600 px-2 py-1 rounded" style={{ fontFamily: 'var(--guohub-theme-font-family)' }}>
                {rgbValues.g}
              </span>
            </div>
          </div>
          <div className="relative">
            <input
              type="range"
              min="0"
              max="255"
              value={rgbValues.g}
              onChange={(e) => handleRgbChange('g', parseInt(e.target.value))}
              className="slider-rounded slider-green w-full h-8 appearance-none cursor-pointer"
              style={{
                background: generateSliderBackground('g'),
              }}
            />
          </div>
        </div>

        {/* Blue 滑块 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Blue</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono text-blue-600 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded" style={{ fontFamily: 'var(--guohub-theme-font-family)' }}>
                HEX: {rgbValues.b.toString(16).padStart(2, '0').toUpperCase()}
              </span>
              <span className="text-sm font-mono text-white bg-blue-600 px-2 py-1 rounded" style={{ fontFamily: 'var(--guohub-theme-font-family)' }}>
                {rgbValues.b}
              </span>
            </div>
          </div>
          <div className="relative">
            <input
              type="range"
              min="0"
              max="255"
              value={rgbValues.b}
              onChange={(e) => handleRgbChange('b', parseInt(e.target.value))}
              className="slider-rounded slider-blue w-full h-8 appearance-none cursor-pointer"
              style={{
                background: generateSliderBackground('b'),
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
              ? `rgba(${rgbValues.r}, ${rgbValues.g}, ${rgbValues.b}, ${alpha.toFixed(2)})`
              : `rgb(${rgbValues.r}, ${rgbValues.g}, ${rgbValues.b})`
          }
        >
          {enableAlpha ? '复制RGBA颜色' : '复制RGB颜色'}
        </CopyButton>
      </div>
    </div>
  );
};

export default RgbSliders;
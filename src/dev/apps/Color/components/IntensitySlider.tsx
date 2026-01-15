import * as React from 'react';
import { parseHexColor, toHex } from '../utils/color';
import '../styles/sliders.css';

interface IntensitySliderProps {
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

export const IntensitySlider: React.FC<IntensitySliderProps> = ({ hex, onColorChange, enableAlpha = false, onAlphaChange, alpha = 1 }) => {
  const [intensityValue, setIntensityValue] = React.useState(100); // 强度百分比
  const [baseColor, setBaseColor] = React.useState({ r: 255, g: 255, b: 255 }); // 基础颜色

  // 当外部颜色变化时，更新强度值和基础颜色
  React.useEffect(() => {
    try {
      const rgba = parseHexColor(hex);
      if (rgba) {
        // 使用感知亮度计算强度
        const perceivedBrightness = (0.299 * rgba.r + 0.587 * rgba.g + 0.114 * rgba.b) / 255;
        const intensity = Math.min(100, perceivedBrightness * 100);

        // 保存当前颜色作为基础颜色（去除强度影响）
        if (intensity > 0) {
          const factor = 100 / intensity;
          setBaseColor({
            r: Math.min(255, Math.round(rgba.r * factor)),
            g: Math.min(255, Math.round(rgba.g * factor)),
            b: Math.min(255, Math.round(rgba.b * factor))
          });
        } else {
          setBaseColor({ r: 255, g: 255, b: 255 });
        }

        setIntensityValue(Math.max(0, Math.round(intensity)));
      }
    } catch (error) {
      console.error('Color to intensity conversion error:', error);
      setIntensityValue(100);
      setBaseColor({ r: 255, g: 255, b: 255 });
    }
  }, [hex]);

  // 处理强度滑块变化
  const handleIntensityChange = (value: number) => {
    setIntensityValue(value);
    updateColorFromIntensity(value);
  };

  // 根据强度更新颜色
  const updateColorFromIntensity = (intensity: number) => {
    try {
      const factor = intensity / 100;
      const adjustedRgb = {
        r: Math.round(baseColor.r * factor),
        g: Math.round(baseColor.g * factor),
        b: Math.round(baseColor.b * factor),
        a: 255
      };

      const newHex = toHex(adjustedRgb, false).replace(/^#/, '');
      onColorChange(newHex);
    } catch (error) {
      console.error('Intensity to RGB conversion error:', error);
    }
  };

  // 生成强度滑块背景
  const generateIntensityBackground = () => {
    return `linear-gradient(to right, rgb(0, 0, 0), rgb(${baseColor.r}, ${baseColor.g}, ${baseColor.b}))`;
  };

  return (
    <div className="color-picker-card rounded-xl border bg-card p-4 flex flex-col">
      <h3 className="text-base font-semibold text-foreground mb-2">强度滑块</h3>

      <div className="flex-1 flex flex-col justify-center">
        <div className="space-y-3">
          <div className="space-y-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">强度</span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded" style={{ fontFamily: 'var(--guohub-theme-font-family)' }}>
              {intensityValue}%
            </span>
            <span className="text-xs font-mono text-white bg-yellow-600 px-2 py-1 rounded" style={{ fontFamily: 'var(--guohub-theme-font-family)' }}>
              {(intensityValue / 100).toFixed(2)}
            </span>
          </div>
        </div>
        <div className="relative">
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={intensityValue}
            onChange={(e) => handleIntensityChange(parseInt(e.target.value))}
            className="slider-rounded slider-yellow w-full h-8 appearance-none cursor-pointer"
            style={{
              background: generateIntensityBackground(),
            }}
          />
        </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntensitySlider;
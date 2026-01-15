import * as React from 'react';
import { parseHexColor, toHex } from '../utils/color';
import '../styles/sliders.css';

interface KelvinIntensitySlidersProps {
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
   * 当前透明度值 (0-1)
   */
  alpha?: number;
}

// 色温到RGB转换 (简化版本)
function kelvinToRgb(kelvin: number): { r: number; g: number; b: number } {
  const temp = kelvin / 100;
  let r, g, b;

  // 红色通道
  if (temp <= 66) {
    r = 255;
  } else {
    r = temp - 60;
    r = 329.698727446 * Math.pow(r, -0.1332047592);
    r = Math.max(0, Math.min(255, r));
  }

  // 绿色通道
  if (temp <= 66) {
    g = temp;
    g = 99.4708025861 * Math.log(g) - 161.1195681661;
    g = Math.max(0, Math.min(255, g));
  } else {
    g = temp - 60;
    g = 288.1221695283 * Math.pow(g, -0.0755148492);
    g = Math.max(0, Math.min(255, g));
  }

  // 蓝色通道
  if (temp >= 66) {
    b = 255;
  } else if (temp <= 19) {
    b = 0;
  } else {
    b = temp - 10;
    b = 138.5177312231 * Math.log(b) - 305.0447927307;
    b = Math.max(0, Math.min(255, b));
  }

  return { r: Math.round(r), g: Math.round(g), b: Math.round(b) };
}

// RGB到色温转换 (改进版本)
function rgbToKelvin(r: number, g: number, b: number): number {
  // 先归一化到0-1
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;

  // 转换为XYZ
  const X = rn * 0.412453 + gn * 0.357580 + bn * 0.180423;
  const Y = rn * 0.212671 + gn * 0.715160 + bn * 0.072169;
  const Z = rn * 0.019334 + gn * 0.119193 + bn * 0.950227;

  // 如果接近黑色，返回低色温
  if (Y < 0.01) {
    return 2000;
  }

  // 转换为xy色度坐标
  let x = X / (X + Y + Z);
  let y = Y / (X + Y + Z);

  // 计算相关色温 (McCamy近似算法)
  let n = (x - 0.3320) / (0.1858 - y);
  let CCT = 437 * Math.pow(n, 3) + 3601 * Math.pow(n, 2) + 6861 * n + 5517;

  // 限制在合理范围内
  CCT = Math.max(1000, Math.min(40000, CCT));

  return Math.round(CCT);
}

export const KelvinIntensitySliders: React.FC<KelvinIntensitySlidersProps> = ({ hex, onColorChange, enableAlpha = false, alpha = 1 }) => {
  const [kelvinValue, setKelvinValue] = React.useState(5500); // 日光色温
  const [intensityValue, setIntensityValue] = React.useState(100); // 强度百分比

  // 当外部颜色变化时，更新色温和强度值
  React.useEffect(() => {
    try {
      const rgba = parseHexColor(hex);
      if (rgba) {
        // 估算色温
        const kelvin = rgbToKelvin(rgba.r, rgba.g, rgba.b);
        // 使用感知亮度计算强度
        const perceivedBrightness = (0.299 * rgba.r + 0.587 * rgba.g + 0.114 * rgba.b) / 255;
        const intensity = Math.min(100, perceivedBrightness * 100);

        setKelvinValue(kelvin);
        setIntensityValue(Math.max(0, Math.round(intensity)));
      }
    } catch (error) {
      console.error('Color to kelvin/intensity conversion error:', error);
      setKelvinValue(5500);
      setIntensityValue(100);
    }
  }, [hex]);

  // 处理色温滑块变化
  const handleKelvinChange = (value: number) => {
    setKelvinValue(value);
    updateColorFromKelvin(value, intensityValue);
  };

  // 处理强度滑块变化
  const handleIntensityChange = (value: number) => {
    setIntensityValue(value);
    updateColorFromKelvin(kelvinValue, value);
  };

  // 根据色温和强度更新颜色
  const updateColorFromKelvin = (kelvin: number, intensity: number) => {
    try {
      const rgb = kelvinToRgb(kelvin);

      // 应用强度
      const factor = intensity / 100;
      const adjustedRgb = {
        r: Math.round(rgb.r * factor),
        g: Math.round(rgb.g * factor),
        b: Math.round(rgb.b * factor),
        a: 255
      };

      const newHex = toHex(adjustedRgb, false).replace(/^#/, '');
      onColorChange(newHex);
    } catch (error) {
      console.error('Kelvin to RGB conversion error:', error);
    }
  };

  // 生成色温滑块背景
  const generateKelvinBackground = () => {
    const colors = [];
    for (let k = 1000; k <= 10000; k += 500) {
      const rgb = kelvinToRgb(k);
      colors.push(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
    }
    return `linear-gradient(to right, ${colors.join(', ')})`;
  };

  // 生成强度滑块背景
  const generateIntensityBackground = () => {
    const baseRgb = kelvinToRgb(kelvinValue);
    return `linear-gradient(to right, rgb(0, 0, 0), rgb(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}))`;
  };

  return (
    <div className="color-picker-card rounded-xl border bg-card p-4">
      <h3 className="text-lg font-semibold text-foreground mb-4">温度 & 强度滑块</h3>

      <div className="space-y-5">
        {/* 色温滑块 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-orange-600 dark:text-orange-400">色温 (Kelvin)</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono text-orange-600 bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded" style={{ fontFamily: 'var(--guohub-theme-font-family)' }}>
                {kelvinValue < 4000 ? '暖光' : kelvinValue < 6500 ? '中性' : '冷光'}
              </span>
              <span className="text-sm font-mono text-white bg-orange-600 px-2 py-1 rounded" style={{ fontFamily: 'var(--guohub-theme-font-family)' }}>
                {kelvinValue}K
              </span>
            </div>
          </div>
          <div className="relative">
            <input
              type="range"
              min="1000"
              max="10000"
              step="100"
              value={kelvinValue}
              onChange={(e) => handleKelvinChange(parseInt(e.target.value))}
              className="slider-rounded slider-orange w-full h-8 appearance-none cursor-pointer"
              style={{
                background: generateKelvinBackground(),
              }}
            />
          </div>
        </div>

        {/* 强度滑块 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">强度</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded" style={{ fontFamily: 'var(--guohub-theme-font-family)' }}>
                {intensityValue}%
              </span>
              <span className="text-sm font-mono text-white bg-yellow-600 px-2 py-1 rounded" style={{ fontFamily: 'var(--guohub-theme-font-family)' }}>
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
  );
};

export default KelvinIntensitySliders;
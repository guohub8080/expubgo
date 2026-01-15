import * as React from 'react';
import { parseHexColor, rgbaToLab, labToRgba, formatLab } from '../utils/color';
import { CopyButton } from './CopyButton';
import '../styles/sliders.css';

interface LabSlidersProps {
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

export const LabSliders: React.FC<LabSlidersProps> = ({ hex, onColorChange, enableAlpha = false, onAlphaChange, alpha = 1 }) => {
  const [labValues, setLabValues] = React.useState({ l: 50, a: 0, b: 0 });

  // 当外部颜色变化时，更新LAB滑块值
  React.useEffect(() => {
    try {
      const rgba = parseHexColor(hex);
      if (rgba) {
        const lab = rgbaToLab(rgba);
        // 确保LAB值在有效范围内
        const l = Math.max(0, Math.min(100, lab.l || 50));
        const a = Math.max(-128, Math.min(127, lab.a || 0));
        const b = Math.max(-128, Math.min(127, lab.b || 0));

        setLabValues({
          l: Math.round(l * 100) / 100,
          a: Math.round(a * 100) / 100,
          b: Math.round(b * 100) / 100
        });
      }
    } catch (error) {
      console.error('RGB to LAB conversion error:', error);
      // 设置默认值
      setLabValues({ l: 50, a: 0, b: 0 });
    }
  }, [hex]);

  // 处理LAB滑块变化
  const handleLabChange = (channel: 'l' | 'a' | 'b', value: number) => {
    const newLab = { ...labValues, [channel]: value };
    setLabValues(newLab);

    try {
      // 将LAB值转换为RGB，然后转换为十六进制
      const rgba = labToRgba({
        mode: 'lab',
        l: newLab.l,
        a: newLab.a,
        b: newLab.b,
        alpha: 1
      });

      // 检查转换结果是否有效
      if (rgba && rgba.r >= 0 && rgba.r <= 255 && rgba.g >= 0 && rgba.g <= 255 && rgba.b >= 0 && rgba.b <= 255) {
        const newHex = `#${rgba.r.toString(16).padStart(2, '0')}${rgba.g.toString(16).padStart(2, '0')}${rgba.b.toString(16).padStart(2, '0')}`.replace(/^#/, '');
        onColorChange(newHex);
      }
    } catch (error) {
      console.error('LAB to RGB conversion error:', error);
    }
  };

  // 生成滑块的背景渐变（使用LAB值计算对应的RGB颜色）
  const generateSliderBackground = (channel: 'l' | 'a' | 'b') => {
    const colors = [];

    if (channel === 'l') {
      // Lightness: 从黑到白的渐变，保持当前a和b值
      for (let l = 0; l <= 100; l += 10) {
        try {
          const rgba = labToRgba({
            mode: 'lab',
            l: l,
            a: labValues.a,
            b: labValues.b,
            alpha: 1
          });
          if (rgba.r >= 0 && rgba.r <= 255 && rgba.g >= 0 && rgba.g <= 255 && rgba.b >= 0 && rgba.b <= 255) {
            colors.push(`rgb(${rgba.r}, ${rgba.g}, ${rgba.b})`);
          }
        } catch (e) {
          // 如果转换失败，使用灰色
          colors.push('rgb(128, 128, 128)');
        }
      }
    } else if (channel === 'a') {
      // a* 通道：从绿色(-128)到红色(+127)，保持当前l和b值
      for (let a = -128; a <= 127; a += 16) {
        try {
          const rgba = labToRgba({
            mode: 'lab',
            l: labValues.l,
            a: a,
            b: labValues.b,
            alpha: 1
          });
          if (rgba.r >= 0 && rgba.r <= 255 && rgba.g >= 0 && rgba.g <= 255 && rgba.b >= 0 && rgba.b <= 255) {
            colors.push(`rgb(${rgba.r}, ${rgba.g}, ${rgba.b})`);
          }
        } catch (e) {
          // 如果转换失败，使用灰色
          colors.push('rgb(128, 128, 128)');
        }
      }
    } else if (channel === 'b') {
      // b* 通道：从蓝色(-128)到黄色(+127)，保持当前l和a值
      for (let b = -128; b <= 127; b += 16) {
        try {
          const rgba = labToRgba({
            mode: 'lab',
            l: labValues.l,
            a: labValues.a,
            b: b,
            alpha: 1
          });
          if (rgba.r >= 0 && rgba.r <= 255 && rgba.g >= 0 && rgba.g <= 255 && rgba.b >= 0 && rgba.b <= 255) {
            colors.push(`rgb(${rgba.r}, ${rgba.g}, ${rgba.b})`);
          }
        } catch (e) {
          // 如果转换失败，使用灰色
          colors.push('rgb(128, 128, 128)');
        }
      }
    }

    // 如果没有有效的颜色，使用默认渐变
    if (colors.length === 0) {
      if (channel === 'l') {
        return 'linear-gradient(to right, rgb(0, 0, 0), rgb(255, 255, 255))';
      } else if (channel === 'a') {
        return 'linear-gradient(to right, rgb(0, 128, 0), rgb(128, 128, 128), rgb(255, 0, 0))';
      } else {
        return 'linear-gradient(to right, rgb(0, 0, 128), rgb(128, 128, 128), rgb(255, 255, 0))';
      }
    }

    return `linear-gradient(to right, ${colors.join(', ')})`;
  };

  return (
    <div className="color-picker-card rounded-xl border bg-card p-4">
      <h3 className="text-base font-semibold text-foreground mb-3">LAB 滑块</h3>

      <div className="space-y-6">
        {/* Lightness 滑块 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">Lightness</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono text-amber-600 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded" style={{ fontFamily: 'var(--guohub-theme-font-family)' }}>
                {(labValues.l / 100 * 100).toFixed(0)}%
              </span>
              <span className="text-sm font-mono text-white bg-amber-600 px-2 py-1 rounded" style={{ fontFamily: 'var(--guohub-theme-font-family)' }}>
                {labValues.l.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="relative">
            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={labValues.l}
              onChange={(e) => handleLabChange('l', parseFloat(e.target.value))}
              className="slider-rounded slider-lightness w-full h-8 appearance-none cursor-pointer"
              style={{
                background: generateSliderBackground('l'),
              }}
            />
          </div>
        </div>

        {/* a* 滑块 (绿-红轴) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">a* (绿-红)</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono text-white bg-emerald-600 px-2 py-1 rounded" style={{ fontFamily: 'var(--guohub-theme-font-family)' }}>
                {labValues.a.toFixed(1)}
              </span>
            </div>
          </div>
          <div className="relative">
            <input
              type="range"
              min="-128"
              max="127"
              step="0.1"
              value={labValues.a}
              onChange={(e) => handleLabChange('a', parseFloat(e.target.value))}
              className="slider-rounded slider-a w-full h-8 appearance-none cursor-pointer"
              style={{
                background: generateSliderBackground('a'),
              }}
            />
          </div>
        </div>

        {/* b* 滑块 (蓝-黄轴) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">b* (蓝-黄)</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono text-white bg-blue-600 px-2 py-1 rounded" style={{ fontFamily: 'var(--guohub-theme-font-family)' }}>
                {labValues.b.toFixed(1)}
              </span>
            </div>
          </div>
          <div className="relative">
            <input
              type="range"
              min="-128"
              max="127"
              step="0.1"
              value={labValues.b}
              onChange={(e) => handleLabChange('b', parseFloat(e.target.value))}
              className="slider-rounded slider-b w-full h-8 appearance-none cursor-pointer"
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
              ? `lab(${labValues.l.toFixed(2)}% ${labValues.a.toFixed(1)} ${labValues.b.toFixed(1)} / ${alpha.toFixed(2)})`
              : `lab(${labValues.l.toFixed(2)}% ${labValues.a.toFixed(1)} ${labValues.b.toFixed(1)})`
          }
        >
          {enableAlpha ? '复制LABA颜色' : '复制LAB颜色'}
        </CopyButton>
      </div>
    </div>
  );
};

export default LabSliders;
import * as React from 'react';
import iro from '@jaames/iro';
import { parseHexColor, toHex } from '../utils/color';

interface EmbeddedIroPickerProps {
  /**
   * 当前颜色（十六进制字符串，不包含#号）
   */
  hex: string;
  /**
   * 颜色变化回调
   */
  onColorChange: (hex: string) => void;
  /**
   * 透明度变化回调
   */
  onAlphaChange?: (alpha: number) => void;
  /**
   * 当前透明度值 (0-1)
   */
  alpha?: number;
  /**
   * 是否启用透明度控制
   */
  enableAlpha?: boolean;
  /**
   * 是否在简洁模式下显示（更小尺寸）
   */
  compact?: boolean;
}

export const EmbeddedIroPicker: React.FC<EmbeddedIroPickerProps> = ({
  hex,
  onColorChange,
  onAlphaChange,
  alpha = 1,
  enableAlpha = false,
  compact = false
}) => {
  const pickerRef = React.useRef<HTMLDivElement>(null);
  const colorPickerRef = React.useRef<any>(null);
  const [isInitialized, setIsInitialized] = React.useState(false);

  React.useEffect(() => {
    if (pickerRef.current && !colorPickerRef.current) {
      // 解析当前颜色
      const rgba = parseHexColor(hex);
      const initialColor = rgba ? `#${rgba.r.toString(16).padStart(2, '0')}${rgba.g.toString(16).padStart(2, '0')}${rgba.b.toString(16).padStart(2, '0')}` : '#ff0000';

      try {
        // 创建 iro.js 取色器配置
        const config: any = {
          width: compact ? 200 : 280,
          height: compact ? 200 : 280,
          color: initialColor,
          padding: 8,
          borderWidth: 1,
          borderColor: '#ffffff',
          wheelLightness: true,
          wheelAngle: 270,
          sliderSize: compact ? 12 : 16,
          layoutDirection: 'vertical'
        };

        // 添加透明度支持
        if (enableAlpha) {
          config.transparency = true;
          config.layout = [
            iro.ui.Wheel,
            iro.ui.Slider
          ];
        } else {
          config.layout = [
            iro.ui.Wheel
          ];
        }

        // 创建取色器实例
        colorPickerRef.current = new iro.ColorPicker(pickerRef.current, config);

        // 监听颜色变化事件
        colorPickerRef.current.on('color:change', (color: any) => {
          try {
            // 获取RGB值并转换为十六进制
            const rgb = color.rgb || color;
            const rgba = {
              r: rgb.r || 0,
              g: rgb.g || 0,
              b: rgb.b || 0,
              a: Math.round((color.alpha || 1) * 255)
            };
            const newHex = toHex(rgba, true).replace(/^#/, '');
            onColorChange(newHex);

            // 如果启用了透明度控制，同时回调透明度变化
            if (enableAlpha && onAlphaChange) {
              const newAlpha = color.alpha || 1;
              onAlphaChange(newAlpha);
            }
          } catch (error) {
            console.error('Error in color change handler:', error);
          }
        });

        setIsInitialized(true);
      } catch (error) {
        console.error('Error creating iro.js ColorPicker:', error);
      }
    }

    // 清理函数
    return () => {
      if (colorPickerRef.current) {
        try {
          if (colorPickerRef.current.destroy && typeof colorPickerRef.current.destroy === 'function') {
            colorPickerRef.current.destroy();
          }
        } catch (e) {
          console.warn('iro.js ColorPicker cleanup completed with warning:', e);
        }
        colorPickerRef.current = null;
        setIsInitialized(false);
      }
    };
  }, [compact, enableAlpha]);

  // 当外部颜色变化时，更新取色器颜色
  React.useEffect(() => {
    if (colorPickerRef.current && isInitialized) {
      const rgba = parseHexColor(hex);
      if (rgba) {
        const newColor = `#${rgba.r.toString(16).padStart(2, '0')}${rgba.g.toString(16).padStart(2, '0')}${rgba.b.toString(16).padStart(2, '0')}`;
        colorPickerRef.current.color.set(newColor);

        // 如果启用透明度控制，更新透明度
        if (enableAlpha && rgba.a !== undefined) {
          colorPickerRef.current.color.alpha = rgba.a / 255;
        }
      }
    }
  }, [hex, isInitialized, enableAlpha]);

  // 当透明度变化时更新取色器
  React.useEffect(() => {
    if (colorPickerRef.current && isInitialized && enableAlpha) {
      colorPickerRef.current.color.alpha = alpha;
    }
  }, [alpha, isInitialized, enableAlpha]);

  return (
    <div className="embedded-iro-picker">
      <div
        ref={pickerRef}
        className={`${compact ? 'w-[200px] h-[200px]' : 'w-[280px] h-[280px]'}`}
      />
    </div>
  );
};

export default EmbeddedIroPicker;
import * as React from 'react';
import iro from '@jaames/iro';
import { parseHexColor, toHex } from '../utils/color';

interface IroColorPickerProps {
  /**
   * 当前颜色（十六进制字符串，不包含#号）
   */
  hex: string;
  /**
   * 颜色变化回调
   */
  onColorChange: (hex: string) => void;
  /**
   * 选色器宽度
   */
  width?: number;
  /**
   * 选色器高度
   */
  height?: number;
  /**
   * 是否显示透明度控制
   */
  enableAlpha?: boolean;
  /**
   * 选色器类型
   */
  layout?: 'wheel' | 'square' | 'box';
  /**
   * 透明度变化回调
   */
  onAlphaChange?: (alpha: number) => void;
  /**
   * 当前透明度值 (0-1)
   */
  alpha?: number;
}

export const IroColorPicker: React.FC<IroColorPickerProps> = ({
  hex,
  onColorChange,
  width = 300,
  height = 300,
  enableAlpha = false,
  layout = 'wheel',
  onAlphaChange,
  alpha = 1
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
        // 创建最简单的配置
        const config: any = {
          width: width,
          color: initialColor,
          padding: 5
        };

        // 添加透明度支持
        if (enableAlpha) {
          config.transparency = true;
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
          // 尝试使用 destroy 方法（如果存在）
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
  }, []);

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
    <div className="iro-color-picker-container">
      <div ref={pickerRef} style={{ width, height }} />
      {enableAlpha && (
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>透明度</span>
            <span>{alpha.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={alpha}
            onChange={(e) => {
              if (onAlphaChange) {
                const newAlpha = parseFloat(e.target.value);
                onAlphaChange(newAlpha);
              }
            }}
            className="w-full h-2 bg-gradient-to-r from-transparent via-gray-500 to-black rounded-lg appearance-none cursor-pointer"
          />
        </div>
      )}
    </div>
  );
};

export default IroColorPicker;
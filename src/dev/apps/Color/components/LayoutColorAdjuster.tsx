import React, { useEffect, useRef, useState } from "react";
import iro from "@jaames/iro";
import { parseHexColor, toHex } from "../utils/color";

interface LayoutColorAdjusterProps {
  /**
   * 当前颜色（十六进制字符串，不包含#号）
   */
  hex: string;
  /**
   * 颜色变化回调
   */
  onColorChange: (hex: string) => void;
  /**
   * 布局类型
   */
  layout?: "compact-wheel" | "compact-slider" | "mini-wheel" | "mini-sliders";
  /**
   * 是否显示当前颜色值
   */
  showColorValue?: boolean;
  /**
   * 是否显示透明度控制
   */
  showAlphaControl?: boolean;
  /**
   * 当前透明度值 (0-1)
   */
  alpha?: number;
  /**
   * 透明度变化回调
   */
  onAlphaChange?: (alpha: number) => void;
}

export const LayoutColorAdjuster: React.FC<LayoutColorAdjusterProps> = ({
  hex,
  onColorChange,
  layout = "compact-wheel",
  showColorValue = true,
  showAlphaControl = false,
  alpha = 1,
  onAlphaChange,
}) => {
  const pickerRef = useRef<HTMLDivElement>(null);
  const colorPickerRef = useRef<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // 布局配置
  const layoutConfig = {
    "compact-wheel": {
      width: 160,
      height: 160,
      layout: [iro.ui.Wheel],
      sliderSize: 10,
    },
    "compact-slider": {
      width: 160,
      height: 40,
      layout: [iro.ui.Slider],
      sliderSize: 12,
    },
    "mini-wheel": {
      width: 120,
      height: 120,
      layout: [iro.ui.Wheel],
      sliderSize: 8,
    },
    "mini-sliders": {
      width: 160,
      height: 80,
      layout: [iro.ui.Slider, iro.ui.Slider, iro.ui.Slider],
      sliderSize: 10,
    },
  };

  // 解析当前颜色
  const rgba = parseHexColor(hex);
  const displayHex = rgba ? toHex(rgba, true) : "";

  // 初始化 iro.js 选择器
  useEffect(() => {
    if (pickerRef.current && !colorPickerRef.current) {
      try {
        const config = layoutConfig[layout];
        const rgba = parseHexColor(hex);
        const initialColor = rgba ? `#${rgba.r.toString(16).padStart(2, '0')}${rgba.g.toString(16).padStart(2, '0')}${rgba.b.toString(16).padStart(2, '0')}` : '#ff0000';

        // 创建 iro.js 配置
        const iroConfig: any = {
          width: config.width,
          height: config.height,
          color: initialColor,
          padding: 4,
          borderWidth: 1,
          borderColor: '#e5e7eb',
          wheelLightness: true,
          wheelAngle: 270,
          sliderSize: config.sliderSize,
          layoutDirection: 'horizontal',
          layout: config.layout,
        };

        // 添加透明度支持
        if (showAlphaControl) {
          iroConfig.transparency = true;
        }

        // 创建取色器实例
        colorPickerRef.current = new iro.ColorPicker(pickerRef.current, iroConfig);

        // 监听颜色变化事件
        colorPickerRef.current.on('color:change', (color: any) => {
          try {
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
            if (showAlphaControl && onAlphaChange) {
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
  }, [layout, showAlphaControl]);

  // 当外部颜色变化时，更新取色器颜色
  useEffect(() => {
    if (colorPickerRef.current && isInitialized) {
      const rgba = parseHexColor(hex);
      if (rgba) {
        const newColor = `#${rgba.r.toString(16).padStart(2, '0')}${rgba.g.toString(16).padStart(2, '0')}${rgba.b.toString(16).padStart(2, '0')}`;
        colorPickerRef.current.color.set(newColor);

        // 如果启用透明度控制，更新透明度
        if (showAlphaControl && rgba.a !== undefined) {
          colorPickerRef.current.color.alpha = rgba.a / 255;
        }
      }
    }
  }, [hex, isInitialized, showAlphaControl]);

  // 当透明度变化时更新取色器
  useEffect(() => {
    if (colorPickerRef.current && isInitialized && showAlphaControl) {
      colorPickerRef.current.color.alpha = alpha;
    }
  }, [alpha, isInitialized, showAlphaControl]);

  return (
    <div className="space-y-2">
      {/* iro.js 选择器 */}
      <div className="flex justify-center">
        <div
          ref={pickerRef}
          className={`${layout === "compact-wheel" ? "w-[160px] h-[160px]" : layout === "compact-slider" ? "w-[160px] h-[40px]" : layout === "mini-wheel" ? "w-[120px] h-[120px]" : "w-[160px] h-[80px]"}`}
        />
      </div>

      {/* 颜色值显示 */}
      {showColorValue && displayHex && (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-1">
            <div
              className="h-4 w-4 rounded-sm border"
              style={{ background: displayHex }}
            />
            <span className="font-mono text-xs">{displayHex}</span>
          </div>
        </div>
      )}

      {/* 透明度控制 */}
      {showAlphaControl && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>透明度</span>
            <span>{Math.round(alpha * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={alpha * 100}
            onChange={(e) => onAlphaChange && onAlphaChange(parseInt(e.target.value) / 100)}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted"
          />
        </div>
      )}
    </div>
  );
};

export default LayoutColorAdjuster;
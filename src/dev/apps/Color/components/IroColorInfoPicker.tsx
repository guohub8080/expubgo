import React, { useEffect, useMemo, useRef, useState } from "react";
import iro from "@jaames/iro";
import { parseHexColor, toHex, RGBA, rgbaToCss, rgbaToHsla } from "../utils/color";

interface IroColorInfoPickerProps {
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
   * 选择器尺寸
   */
  size?: "small" | "medium" | "large";
  /**
   * 布局类型
   */
  layout?: "wheel" | "wheel-slider" | "box" | "sliders";
  /**
   * 是否显示颜色信息
   */
  showColorInfo?: boolean;
  /**
   * 是否显示颜色格式
   */
  showFormats?: boolean;
}

export const IroColorInfoPicker: React.FC<IroColorInfoPickerProps> = ({
  hex,
  onColorChange,
  onAlphaChange,
  alpha = 1,
  enableAlpha = false,
  size = "medium",
  layout = "wheel-slider",
  showColorInfo = true,
  showFormats = true,
}) => {
  const pickerRef = useRef<HTMLDivElement>(null);
  const colorPickerRef = useRef<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // 解析当前颜色
  const rgba = useMemo<RGBA | null>(() => parseHexColor(hex), [hex]);
  const hsla = useMemo(() => (rgba ? rgbaToHsla(rgba) : null), [rgba]);

  // 显示的颜色值
  const displayHex = rgba ? toHex(rgba, true) : "";
  const displayRgba = rgba ? rgbaToCss(rgba) : "";
  const displayHsla = hsla ? `hsla(${hsla.h}, ${hsla.s}%, ${hsla.l}%, ${hsla.a})` : "";

  // 尺寸配置
  const sizeConfig = {
    small: { width: 200, height: 200, fontSize: "text-sm" },
    medium: { width: 280, height: 280, fontSize: "text-base" },
    large: { width: 360, height: 360, fontSize: "text-lg" },
  };

  // 布局配置
  const layoutConfig = {
    "wheel": [iro.ui.Wheel],
    "wheel-slider": [iro.ui.Wheel, iro.ui.Slider],
    "box": [iro.ui.Box, iro.ui.Slider],
    "sliders": [iro.ui.Slider, iro.ui.Slider, iro.ui.Slider],
  };

  // 初始化 iro.js 选择器
  useEffect(() => {
    if (pickerRef.current && !colorPickerRef.current) {
      try {
        // 解析当前颜色
        const rgba = parseHexColor(hex);
        const initialColor = rgba ? `#${rgba.r.toString(16).padStart(2, '0')}${rgba.g.toString(16).padStart(2, '0')}${rgba.b.toString(16).padStart(2, '0')}` : '#ff0000';

        // 创建 iro.js 配置
        const config: any = {
          width: sizeConfig[size].width,
          height: sizeConfig[size].height,
          color: initialColor,
          padding: 8,
          borderWidth: 1,
          borderColor: '#ffffff',
          wheelLightness: true,
          wheelAngle: 270,
          sliderSize: size === "small" ? 12 : 16,
          layoutDirection: 'vertical',
          layout: layoutConfig[layout],
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
  }, [size, layout, enableAlpha]);

  // 当外部颜色变化时，更新取色器颜色
  useEffect(() => {
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
  useEffect(() => {
    if (colorPickerRef.current && isInitialized && enableAlpha) {
      colorPickerRef.current.color.alpha = alpha;
    }
  }, [alpha, isInitialized, enableAlpha]);

  return (
    <div className="space-y-4">
      {/* iro.js 选择器 */}
      <div className="flex justify-center">
        <div
          ref={pickerRef}
          className={`${size === "small" ? "w-[200px] h-[200px]" : size === "medium" ? "w-[280px] h-[280px]" : "w-[360px] h-[360px]"}`}
        />
      </div>

      {/* 颜色信息显示 */}
      {showColorInfo && rgba && (
        <div className="rounded-xl border bg-card p-4">
          <div className="space-y-3">
            {/* 颜色预览 */}
            <div className="flex items-center gap-4">
              <div
                className="h-12 w-12 rounded-lg border shadow-sm"
                style={{ background: displayRgba }}
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">当前颜色</div>
                <div className={`font-mono ${sizeConfig[size].fontSize} font-semibold`}>
                  {displayHex}
                </div>
              </div>
            </div>

            {/* 颜色格式显示 */}
            {showFormats && (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">RGBA</div>
                  <div className="font-mono text-sm">{displayRgba}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">HSLA</div>
                  <div className="font-mono text-sm">{displayHsla}</div>
                </div>
              </div>
            )}

            {/* RGB 值显示 */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">R</div>
                <div className="font-mono text-sm font-semibold">{rgba.r}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">G</div>
                <div className="font-mono text-sm font-semibold">{rgba.g}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">B</div>
                <div className="font-mono text-sm font-semibold">{rgba.b}</div>
              </div>
            </div>

            {/* 透明度显示 */}
            {enableAlpha && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>透明度</span>
                  <span>{Math.round(alpha * 100)}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${alpha * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default IroColorInfoPicker;
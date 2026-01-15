import React, { useEffect, useRef, useState, useMemo } from "react";
import iro from "@jaames/iro";
import { parseHexColor, toHex, RGBA, rgbaToHsla, HSLA } from "../utils/color";

interface ColorPickerWithSlidersProps {
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
}

export const ColorPickerWithSliders: React.FC<ColorPickerWithSlidersProps> = ({
  hex,
  onColorChange,
  onAlphaChange,
  alpha = 1,
  enableAlpha = false,
}) => {
  const rgbPickerRef = useRef<HTMLDivElement>(null);
  const hslPickerRef = useRef<HTMLDivElement>(null);
  const alphaPickerRef = useRef<HTMLDivElement>(null);

  const rgbColorPickerRef = useRef<any>(null);
  const hslColorPickerRef = useRef<any>(null);
  const alphaColorPickerRef = useRef<any>(null);

  const [isInitialized, setIsInitialized] = useState(false);
  const isInternalUpdateRef = useRef(false);

  // 解析当前颜色
  const rgba = useMemo<RGBA | null>(() => parseHexColor(hex), [hex]);
  const hsla = useMemo<HSLA | null>(() => (rgba ? rgbaToHsla(rgba) : null), [rgba]);

  // 转换为 iro.js 可用的颜色格式
  const iroColor = useMemo(() => {
    if (!rgba) return "#ff0000";
    return `#${rgba.r.toString(16).padStart(2, '0')}${rgba.g.toString(16).padStart(2, '0')}${rgba.b.toString(16).padStart(2, '0')}`;
  }, [rgba]);

  // 计算显示用的颜色值
  const displayHex = rgba ? toHex(rgba, true) : "";
  const displayRgba = rgba ? `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a / 255})` : "";
  const rgbaCss = rgba ? `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a / 255})` : "#000000";

  // 处理 Hex 输入
  const handleHexInput = (value: string) => {
    const cleanValue = value.replace(/^#/, "");
    if (/^[0-9A-Fa-f]{6,8}$/.test(cleanValue)) {
      onColorChange(cleanValue);
    }
  };

  // 初始化 iro.js 滑块
  useEffect(() => {
    if (!rgbPickerRef.current || !hslPickerRef.current) return;

    try {
      // 创建 RGB 滑块组
      if (!rgbColorPickerRef.current) {
        rgbColorPickerRef.current = new iro.ColorPicker(rgbPickerRef.current, {
          width: 320,
          color: iroColor,
          layout: [
            { component: iro.ui.Slider, options: { sliderType: 'red', sliderSize: 20 } },
            { component: iro.ui.Slider, options: { sliderType: 'green', sliderSize: 20 } },
            { component: iro.ui.Slider, options: { sliderType: 'blue', sliderSize: 20 } },
          ],
          borderWidth: 1,
          borderColor: '#e5e7eb',
          padding: 0,
          layoutDirection: 'vertical',
        });

        rgbColorPickerRef.current.on('color:change', (color: any) => {
          if (isInternalUpdateRef.current) return;

          isInternalUpdateRef.current = true;
          const rgb = color.rgb;
          const newRgba: RGBA = {
            r: rgb.r || 0,
            g: rgb.g || 0,
            b: rgb.b || 0,
            a: rgba?.a || 255,
          };
          const newHex = toHex(newRgba, true).replace(/^#/, "");
          onColorChange(newHex);

          requestAnimationFrame(() => {
            isInternalUpdateRef.current = false;
          });
        });
      }

      // 创建 HSL 滑块组
      if (!hslColorPickerRef.current) {
        hslColorPickerRef.current = new iro.ColorPicker(hslPickerRef.current, {
          width: 320,
          color: iroColor,
          layout: [
            { component: iro.ui.Slider, options: { sliderType: 'hue', sliderSize: 20 } },
            { component: iro.ui.Slider, options: { sliderType: 'saturation', sliderSize: 20 } },
            { component: iro.ui.Slider, options: { sliderType: 'value', sliderSize: 20 } },
          ],
          borderWidth: 1,
          borderColor: '#e5e7eb',
          padding: 0,
          layoutDirection: 'vertical',
        });

        hslColorPickerRef.current.on('color:change', (color: any) => {
          if (isInternalUpdateRef.current) return;

          isInternalUpdateRef.current = true;
          const rgb = color.rgb;
          const newRgba: RGBA = {
            r: rgb.r || 0,
            g: rgb.g || 0,
            b: rgb.b || 0,
            a: rgba?.a || 255,
          };
          const newHex = toHex(newRgba, true).replace(/^#/, "");
          onColorChange(newHex);

          requestAnimationFrame(() => {
            isInternalUpdateRef.current = false;
          });
        });
      }

      // 创建透明度滑块
      if (enableAlpha && alphaPickerRef.current && !alphaColorPickerRef.current) {
        alphaColorPickerRef.current = new iro.ColorPicker(alphaPickerRef.current, {
          width: 320,
          color: iroColor,
          layout: [
            { component: iro.ui.Slider, options: { sliderType: 'alpha', sliderSize: 20 } },
          ],
          borderWidth: 1,
          borderColor: '#e5e7eb',
          padding: 0,
          transparency: true,
        });

        alphaColorPickerRef.current.on('color:change', (color: any) => {
          if (isInternalUpdateRef.current) return;

          isInternalUpdateRef.current = true;

          if (onAlphaChange && color.alpha !== undefined) {
            onAlphaChange(color.alpha);
          }

          if (rgba) {
            const newRgba = { ...rgba, a: Math.round(color.alpha * 255) };
            const newHex = toHex(newRgba, true).replace(/^#/, "");
            onColorChange(newHex);
          }

          requestAnimationFrame(() => {
            isInternalUpdateRef.current = false;
          });
        });
      }

      setIsInitialized(true);
    } catch (error) {
      console.error('Error creating iro.js pickers:', error);
    }

    // 清理函数
    return () => {
      if (rgbColorPickerRef.current) {
        try {
          rgbColorPickerRef.current.destroy?.();
        } catch (e) {
          console.warn('RGB picker cleanup warning:', e);
        }
        rgbColorPickerRef.current = null;
      }
      if (hslColorPickerRef.current) {
        try {
          hslColorPickerRef.current.destroy?.();
        } catch (e) {
          console.warn('HSL picker cleanup warning:', e);
        }
        hslColorPickerRef.current = null;
      }
      if (alphaColorPickerRef.current) {
        try {
          alphaColorPickerRef.current.destroy?.();
        } catch (e) {
          console.warn('Alpha picker cleanup warning:', e);
        }
        alphaColorPickerRef.current = null;
      }
      setIsInitialized(false);
    };
  }, [enableAlpha]);

  // 当外部颜色变化时，同步更新所有滑块
  useEffect(() => {
    if (!isInitialized || isInternalUpdateRef.current) return;

    try {
      if (rgbColorPickerRef.current) {
        rgbColorPickerRef.current.color.set(iroColor);
      }
      if (hslColorPickerRef.current) {
        hslColorPickerRef.current.color.set(iroColor);
      }
      if (alphaColorPickerRef.current && enableAlpha) {
        alphaColorPickerRef.current.color.set(iroColor);
        if (rgba?.a !== undefined) {
          alphaColorPickerRef.current.color.alpha = rgba.a / 255;
        }
      }
    } catch (error) {
      console.warn('Error updating picker colors:', error);
    }
  }, [iroColor, isInitialized, enableAlpha, rgba?.a]);

  if (!rgba || !hsla) {
    return <div className="text-muted-foreground">颜色格式无效</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8">
      {/* 左侧：纯色预览方块 */}
      <div className="flex items-center justify-center">
        <div className="w-full aspect-square rounded-3xl overflow-hidden relative group">
          {/* 主色块 */}
          <div
            className="w-full h-full transition-all duration-300 group-hover:scale-105"
            style={{ background: rgbaCss }}
            title="当前颜色预览"
          />

          {/* 悬浮信息卡片 */}
          <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 p-4 shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="text-white/60 text-xs font-medium mb-1">CURRENT COLOR</div>
            <div className="text-white font-mono text-xl font-bold">{displayHex}</div>
            <div className="text-white/80 font-mono text-sm mt-1">{displayRgba}</div>
          </div>
        </div>
      </div>

      {/* 右侧：滑块控制面板 */}
      <div className="space-y-5">
        {/* Hex 输入 */}
        <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card via-card to-muted/20 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-1 rounded-full bg-gradient-to-b from-blue-500 to-purple-500"></div>
            <label className="text-sm font-bold tracking-wide text-foreground">
              HEX 颜色代码
            </label>
          </div>

          <div className="flex items-center gap-3 rounded-xl border-2 border-border/70 bg-background/50 px-4 py-3 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all">
            <span className="text-lg font-bold text-muted-foreground">#</span>
            <input
              className="flex-1 bg-transparent text-lg font-mono font-semibold outline-none placeholder:text-muted-foreground/50"
              value={hex.toUpperCase()}
              onChange={(e) => handleHexInput(e.target.value)}
              placeholder="FF0000FF"
            />
            <div
              className="h-8 w-8 rounded-lg border-2 border-white shadow-lg ring-2 ring-black/10"
              style={{ background: rgbaCss }}
            />
          </div>
        </div>

        {/* RGB 滑块 */}
        <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card via-card to-red-50/30 dark:to-red-950/10 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-5">
            <div className="h-8 w-1 rounded-full bg-gradient-to-b from-red-500 via-green-500 to-blue-500"></div>
            <h3 className="text-sm font-bold tracking-wide text-foreground">
              RGB 色彩空间
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-5">
            <div className="text-center p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-800/30">
              <div className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">R</div>
              <div className="text-2xl font-bold font-mono text-red-700 dark:text-red-300">{rgba.r}</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200/50 dark:border-green-800/30">
              <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">G</div>
              <div className="text-2xl font-bold font-mono text-green-700 dark:text-green-300">{rgba.g}</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/30">
              <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">B</div>
              <div className="text-2xl font-bold font-mono text-blue-700 dark:text-blue-300">{rgba.b}</div>
            </div>
          </div>

          <div ref={rgbPickerRef} className="rounded-xl overflow-hidden" />
        </div>

        {/* HSL 滑块 */}
        <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card via-card to-violet-50/30 dark:to-violet-950/10 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-5">
            <div className="h-8 w-1 rounded-full bg-gradient-to-b from-pink-500 via-purple-500 to-indigo-500"></div>
            <h3 className="text-sm font-bold tracking-wide text-foreground">
              HSL 色彩空间
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-5">
            <div className="text-center p-3 rounded-xl bg-gradient-to-br from-red-50 via-yellow-50 to-blue-50 dark:from-red-950/20 dark:via-yellow-950/20 dark:to-blue-950/20 border border-purple-200/50 dark:border-purple-800/30">
              <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">HUE</div>
              <div className="text-2xl font-bold font-mono text-purple-700 dark:text-purple-300">{Math.round(hsla.h)}°</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-gradient-to-r from-gray-50 to-purple-50 dark:from-gray-950/20 dark:to-purple-950/20 border border-purple-200/50 dark:border-purple-800/30">
              <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">SAT</div>
              <div className="text-2xl font-bold font-mono text-purple-700 dark:text-purple-300">{Math.round(hsla.s)}%</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-gradient-to-r from-black/5 via-gray-50 to-white dark:from-black/50 dark:via-gray-950/20 dark:to-white/10 border border-purple-200/50 dark:border-purple-800/30">
              <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">LIGHT</div>
              <div className="text-2xl font-bold font-mono text-purple-700 dark:text-purple-300">{Math.round(hsla.l)}%</div>
            </div>
          </div>

          <div ref={hslPickerRef} className="rounded-xl overflow-hidden" />
        </div>

        {/* 透明度滑块 */}
        {enableAlpha && (
          <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card via-card to-slate-50/30 dark:to-slate-950/10 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-5">
              <div className="h-8 w-1 rounded-full bg-gradient-to-b from-transparent via-gray-400 to-black"></div>
              <h3 className="text-sm font-bold tracking-wide text-foreground">
                透明度通道
              </h3>
            </div>

            <div className="flex items-center justify-between mb-5">
              <div className="text-center p-3 px-6 rounded-xl bg-slate-50 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-800/30">
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">ALPHA</div>
                <div className="text-2xl font-bold font-mono text-slate-700 dark:text-slate-300">{Math.round(alpha * 100)}%</div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-800/30">
                <div
                  className="h-10 w-20 rounded-lg border-2 border-white shadow-md"
                  style={{
                    background: `
                      linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc),
                      linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)
                    `,
                    backgroundSize: '10px 10px',
                    backgroundPosition: '0 0, 5px 5px',
                  }}
                >
                  <div className="w-full h-full rounded-md" style={{ background: rgbaCss }} />
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">透明度</div>
                  <div className="font-mono text-sm font-semibold">{(alpha * 255).toFixed(0)}/255</div>
                </div>
              </div>
            </div>

            <div ref={alphaPickerRef} className="rounded-xl overflow-hidden" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorPickerWithSliders;

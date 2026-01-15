import React, { useMemo } from "react";
import { HSLA, RGBA, clamp, rgbaToCss, rgbaToHsla, toHex, parseHexColor } from "../utils/color";
import { EmbeddedIroPicker } from "./EmbeddedIroPicker";

interface PreviewPanelProps {
  /**
   * 基础色值
   */
  hex: string;
  setHex: (v: string) => void;
  rgba: RGBA | null;
  hsla: HSLA | null;
  invalid: boolean;
  onPickWithInput: () => void;
  onPickWithEyedropper: () => void;
  colorInputRef: React.RefObject<HTMLInputElement>;
  universalInput?: string;
  setUniversalInput?: (v: string) => void;
  detectedKind?: string;
  onRecognize?: () => void;
  displayHex: string;
  displayRgba: string;
  displayHsla: string;
  displayOklch?: string;

  // Store双向绑定相关props
  alpha?: number;
  setAlpha?: (alpha: number) => void;
  enableAlpha?: boolean;

  /**
   * 简洁模式：仅展示预览与两枚按钮（选择颜色 / 浏览器取色）
   * 用于"颜色信息"页左侧的大色块预览
   */
  simple?: boolean;
}

type TonalStop = {
  label: string;
  lightness: number;
  css: string;
};

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  hex,
  setHex,
  rgba,
  hsla,
  invalid,
  onPickWithInput,
  onPickWithEyedropper,
  colorInputRef,
  universalInput,
  setUniversalInput,
  detectedKind,
  onRecognize,
  displayHex,
  displayRgba,
  displayHsla,
  displayOklch,
  alpha = 1,
  setAlpha,
  enableAlpha = false,
  simple,
}) => {
  const tonalStops = useMemo<TonalStop[]>(() => {
    if (!hsla) return [];
    const offsets = [-28, -14, 0, 14, 28];
    return offsets.map((offset) => {
      const lightness = clamp(hsla.l + offset, 0, 100);
      const css = `hsla(${hsla.h}, ${hsla.s}%, ${lightness}%, ${hsla.a})`;
      return {
        label: offset === 0 ? "原色" : offset > 0 ? `L+${Math.abs(offset)}` : `L${offset}`,
        lightness,
        css,
      };
    });
  }, [hsla]);

  const previewStyle: React.CSSProperties = {
    background: rgba ? rgbaToCss(rgba) : "linear-gradient(135deg, #1f2937, #111827)",
  };

  const getTonalText = (l: number) => (l > 55 ? "#0f172a" : "#f8fafc");

  // 计算当前颜色的 RGBA 和 HSLA 值
  const currentRgba = useMemo(() => parseHexColor(hex), [hex]);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border bg-gradient-to-br from-muted/40 via-background to-background shadow-sm">
        <div className="relative overflow-hidden rounded-t-2xl" title="当前颜色预览">
          <div
            className="aspect-[4/3] min-h-[280px] transition-transform duration-200 hover:scale-[1.01]"
            style={previewStyle}
          />
          <div className="pointer-events-none absolute inset-x-6 bottom-6 rounded-2xl border border-white/20 bg-black/20 backdrop-blur-sm p-4 text-white shadow-lg">
            <div className="text-xs uppercase tracking-[0.22em] text-white/70">Active Color</div>
            <div className="mt-2 flex items-end gap-6">
              <div>
                <div className="text-3xl font-semibold leading-none">{displayHex || "#" + hex}</div>
                <div className="mt-1 text-sm text-white/70">{displayRgba}</div>
              </div>
              <div className="hidden min-[420px]:block text-sm text-white/70">{displayHsla}</div>
            </div>
          </div>
        </div>

        <div className="space-y-6 p-6">
          {/* 浏览器取色按钮 */}
          {simple && (
            <button
              className="w-full rounded-lg border bg-white px-3 py-2 text-sm font-medium shadow-sm transition hover:bg-primary hover:text-primary-foreground"
              onClick={onPickWithEyedropper}
            >
              🎯 浏览器取色
            </button>
          )}

          {!simple && (
            <div className="space-y-4">
              {/* HEX 输入区域 */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Hex 输入
                </label>
                <div className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 focus-within:ring-2 focus-within:ring-ring">
                  <span className="text-sm text-muted-foreground">#</span>
                  <input
                    className="h-7 w-full bg-transparent text-base outline-none"
                    value={hex}
                    onChange={(e) => setHex(e.target.value.replace(/^#/, ""))}
                    placeholder="f44d0dff"
                  />
                </div>
                {invalid && (
                  <p className="text-sm text-destructive">
                    颜色格式无法解析。支持 3/4/6/8 位十六进制，默认补全 alpha。
                  </p>
                )}
              </div>

              {/* 浏览器取色按钮 */}
              <button
                className="w-full rounded-lg border bg-white px-3 py-2 text-sm font-medium shadow-sm transition hover:bg-primary hover:text-primary-foreground"
                onClick={onPickWithEyedropper}
              >
                🎯 浏览器取色
              </button>
            </div>
          )}

          {/* 直接嵌入的 iro.js 选色器 */}
          <div className="flex justify-center">
            <EmbeddedIroPicker
              hex={hex}
              onColorChange={setHex}
              alpha={alpha}
              enableAlpha={enableAlpha}
              onAlphaChange={setAlpha}
              compact={simple}
            />
          </div>

          {/* RGB值显示 */}
          <div className="grid grid-cols-3 gap-2 text-xs text-center">
            <div>
              <div className="text-muted-foreground">R</div>
              <div className="font-mono">{currentRgba ? currentRgba.r : 0}</div>
            </div>
            <div>
              <div className="text-muted-foreground">G</div>
              <div className="font-mono">{currentRgba ? currentRgba.g : 0}</div>
            </div>
            <div>
              <div className="text-muted-foreground">B</div>
              <div className="font-mono">{currentRgba ? currentRgba.b : 0}</div>
            </div>
          </div>

          {!simple && tonalStops.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  色阶探索
                </span>
                <span className="text-xs text-muted-foreground">基于 HSL Lightness</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {tonalStops.map((stop) => (
                  <div
                    key={stop.label}
                    className="flex flex-col items-center gap-2 rounded-xl border bg-white/60 p-2 text-center shadow-sm"
                  >
                    <div
                      className="h-14 w-full rounded-lg border transition hover:translate-y-[-2px] hover:shadow-md"
                      style={{ background: stop.css, color: getTonalText(stop.lightness) }}
                    >
                      <div className="flex h-full items-center justify-center text-sm font-semibold">
                        {stop.label}
                      </div>
                    </div>
                    <span className="text-[10px] uppercase text-muted-foreground">
                      L {Math.round(stop.lightness)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* simple 模式下，不在左侧展示万能识别框 */}
          {!simple && (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  万能识别框
                </label>
                {detectedKind ? (
                  <span className="rounded-full border border-muted-foreground/30 bg-muted px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    {detectedKind}
                  </span>
                ) : null}
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  value={universalInput || ""}
                  onChange={(e) => setUniversalInput && setUniversalInput(e.target.value)}
                  placeholder="支持 HEX / RGB(A) / HSL(A) / OKLCH 等多种格式"
                />
                <button
                  className="rounded-lg border bg-white px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-accent hover:text-accent-foreground"
                  onClick={() => onRecognize && onRecognize()}
                >
                  识别
                </button>
              </div>
              <div className="mt-1 grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
                <span>当前 HEX：{displayHex || "--"}</span>
                <span className="hidden sm:block">HSL：{displayHsla || "--"}</span>
                <span>RGBA：{displayRgba || "--"}</span>
                {displayOklch ? <span>OKLCH：{displayOklch}</span> : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
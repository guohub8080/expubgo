import React, { useMemo, useState } from "react";
import { parseHexColor, toHex, RGBA, rgbaToHsla, rgbaToOklch, formatOklch, rgbaToCss, detectAndParseColor } from "../utils/color";
import toast from "react-hot-toast";
import { Switch } from "@shadcn/components/ui/switch";
import { Slider } from "@shadcn/components/ui/slider";

interface ColorFormatDisplayProps {
  /**
   * 当前颜色（十六进制字符串，不包含#号）
   */
  hex: string;
  /**
   * 颜色变化回调
   */
  onColorChange?: (hex: string) => void;
  /**
   * 透明度启用状态
   */
  enableAlpha?: boolean;
  /**
   * 透明度启用状态变化回调
   */
  onEnableAlphaChange?: (enabled: boolean) => void;
}

interface CopyButtonProps {
  value: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("已复制");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("复制失败");
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-md border bg-background hover:bg-muted transition-colors cursor-pointer"
      title="点击复制"
    >
      {copied ? (
        <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  );
};

export const ColorFormatDisplay: React.FC<ColorFormatDisplayProps> = ({
  hex,
  onColorChange,
  enableAlpha = false,
  onEnableAlphaChange,
}) => {
  const [colorInput, setColorInput] = useState("");

  // 解析颜色
  const rgba = useMemo<RGBA | null>(() => parseHexColor(hex), [hex]);
  const hsla = useMemo(() => (rgba ? rgbaToHsla(rgba) : null), [rgba]);
  const oklch = useMemo(() => (rgba ? rgbaToOklch(rgba) : null), [rgba]);

  const displayHex = rgba ? (enableAlpha ? toHex(rgba, true) : toHex(rgba, true).slice(0, 7)) : "";
  const displayRgba = rgba ? (enableAlpha ? rgbaToCss(rgba) : `rgb(${rgba.r}, ${rgba.g}, ${rgba.b})`) : "";
  const displayHsla = hsla ? (enableAlpha ? `hsla(${Math.round(hsla.h || 0)}, ${Math.round(hsla.s || 0)}%, ${Math.round(hsla.l || 0)}%, ${(hsla.a || 1).toFixed(2)})` : `hsl(${Math.round(hsla.h || 0)}, ${Math.round(hsla.s || 0)}%, ${Math.round(hsla.l || 0)}%)`) : "";
  const displayOklch = oklch ? (enableAlpha ? `oklch(${(oklch.l || 0).toFixed(4)} ${(oklch.c || 0).toFixed(4)} ${(oklch.h || 0).toFixed(2)} / ${(oklch.alpha || 1).toFixed(3)})` : `oklch(${(oklch.l || 0).toFixed(4)} ${(oklch.c || 0).toFixed(4)} ${(oklch.h || 0).toFixed(2)})`) : "";
  const rgbaCss = rgba ? rgbaToCss(rgba) : "#000000";

  // 处理颜色输入转换
  const handleColorInputConvert = () => {
    if (!colorInput.trim()) {
      toast.error("请输入颜色值");
      return;
    }

    const { rgba: parsedRgba, kind } = detectAndParseColor(colorInput);
    if (!parsedRgba) {
      toast.error("无法识别该颜色格式");
      return;
    }

    const newHex = toHex(parsedRgba, true).replace(/^#/, "");
    onColorChange?.(newHex);
    toast.success(`识别为 ${kind.toUpperCase()}`);
    setColorInput("");
  };

  if (!rgba || !hsla) {
    return <div className="text-muted-foreground">颜色格式无效</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[160px_1fr] gap-5">
      {/* 左侧：颜色预览和控制 */}
      <div className="flex flex-col gap-6">
        {/* 颜色预览方块 */}
        <div
          className="w-full max-w-xs aspect-square rounded-2xl mx-auto"
          style={{ background: rgbaCss }}
          title="当前颜色预览"
        />

        {/* 透明度开关 */}
        <div className="group flex items-center justify-between p-4 rounded-xl border border-border/50 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm hover:border-border transition-colors">
          <div>
            <div className="text-sm font-medium">透明通道</div>
            <div className="text-xs text-muted-foreground/70">Alpha 支持</div>
          </div>
          <Switch
            checked={enableAlpha}
            onCheckedChange={onEnableAlphaChange}
            className="scale-90"
          />
        </div>

        {/* 颜色转换输入框 */}
        <div className="relative">
          <input
            type="text"
            value={colorInput}
            onChange={(e) => setColorInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleColorInputConvert()}
            placeholder="粘贴颜色值，回车识别..."
            className="w-full px-4 py-3 text-sm rounded-xl border border-border/50 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:bg-white/50 dark:focus:bg-gray-900/50 transition-all"
          />
          {colorInput && (
            <button
              onClick={() => setColorInput("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-muted/50 transition-colors"
              title="清除"
            >
              <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* 右侧：Bento Box Grid 布局 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:gap-3">
        {/* HEX - 主要格式 */}
        <div
          className="group relative overflow-hidden rounded-xl border border-border/50 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm hover:border-border hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-center p-4"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(displayHex);
              toast.success("已复制");
            } catch {
              toast.error("复制失败");
            }
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <svg className="w-3.5 h-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="text-center">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-foreground/60 mb-2">HEX</div>
            <code className="text-4xl font-bold select-all block text-foreground leading-tight" style={{ fontFamily: 'misans' }}>{displayHex.toUpperCase()}</code>
          </div>
        </div>

        {/* RGB */}
        <div
          className="group relative overflow-hidden rounded-xl border border-border/50 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm hover:border-border hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-center p-4"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(displayRgba);
              toast.success("已复制");
            } catch {
              toast.error("复制失败");
            }
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/8 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <svg className="w-3.5 h-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="text-center">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-foreground/60 mb-2">RGB</div>
            <code className="text-2xl font-bold select-all block text-foreground leading-tight" style={{ fontFamily: 'misans' }}>{displayRgba.replace(/rgb\(/i, 'RGB(').replace(/rgba\(/i, 'RGBA(')}</code>
          </div>
        </div>

        {/* HSL */}
        <div
          className="group relative overflow-hidden rounded-xl border border-border/50 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm hover:border-border hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-center p-4"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(displayHsla);
              toast.success("已复制");
            } catch {
              toast.error("复制失败");
            }
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/8 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <svg className="w-3.5 h-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="text-center">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-foreground/60 mb-2">HSL</div>
            <code className="text-2xl font-bold select-all block text-foreground leading-tight" style={{ fontFamily: 'misans' }}>{displayHsla.replace(/hsl\(/i, 'HSL(').replace(/hsla\(/i, 'HSLA(')}</code>
          </div>
        </div>

        {/* OKLCH */}
        <div
          className="group relative overflow-hidden rounded-xl border border-border/50 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm hover:border-border hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-center p-4"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(displayOklch);
              toast.success("已复制");
            } catch {
              toast.error("复制失败");
            }
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/8 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <svg className="w-3.5 h-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="text-center">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-foreground/60 mb-2">OKLCH</div>
            <code className="text-xl font-bold select-all block text-foreground leading-tight" style={{ fontFamily: 'misans' }}>{displayOklch.replace(/oklch\(/i, 'OKLCH(')}</code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorFormatDisplay;

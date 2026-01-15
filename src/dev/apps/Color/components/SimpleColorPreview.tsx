import React, { useMemo } from "react";
import { RGBA, rgbaToCss } from "../utils/color";

interface SimpleColorPreviewProps {
  /**
   * 当前颜色（十六进制字符串，不包含#号）
   */
  hex: string;
  /**
   * 显示的颜色值格式
   */
  displayHex?: string;
  displayRgba?: string;
  displayHsla?: string;
  /**
   * 是否显示颜色值
   */
  showValues?: boolean;
  /**
   * 预览区域大小
   */
  size?: "small" | "medium" | "large";
  /**
   * 是否显示边框
   */
  bordered?: boolean;
}

export const SimpleColorPreview: React.FC<SimpleColorPreviewProps> = ({
  hex,
  displayHex,
  displayRgba,
  displayHsla,
  showValues = true,
  size = "medium",
  bordered = true,
}) => {
  // 解析颜色
  const rgba = useMemo(() => {
    try {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      const a = hex.length >= 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;
      return { r, g, b, a };
    } catch {
      return null;
    }
  }, [hex]);

  // 预览样式
  const previewStyle: React.CSSProperties = {
    background: rgba ? rgbaToCss(rgba) : "linear-gradient(135deg, #1f2937, #111827)",
  };

  // 尺寸类名
  const sizeClasses = {
    small: "aspect-square min-h-[120px]",
    medium: "aspect-[4/3] min-h-[200px]",
    large: "aspect-[4/3] min-h-[280px]",
  };

  // 边框类名
  const borderClasses = bordered ? "rounded-2xl border" : "";

  return (
    <div className={`overflow-hidden ${borderClasses} bg-gradient-to-br from-muted/40 via-background to-background shadow-sm`}>
      {/* 颜色预览区域 */}
      <div className={`relative ${sizeClasses[size]}`} title="颜色预览">
        <div
          className="h-full w-full transition-transform duration-200 hover:scale-[1.01]"
          style={previewStyle}
        />

        {/* 颜色值显示 */}
        {showValues && rgba && (
          <div className="pointer-events-none absolute inset-x-4 bottom-4 rounded-xl border border-white/20 bg-black/20 backdrop-blur-sm p-3 text-white shadow-lg">
            <div className="text-xs uppercase tracking-[0.22em] text-white/70">当前颜色</div>
            <div className="mt-2 space-y-1">
              {displayHex && (
                <div className="text-lg font-semibold leading-none">{displayHex}</div>
              )}
              {displayRgba && (
                <div className="text-sm text-white/70">{displayRgba}</div>
              )}
              {displayHsla && (
                <div className="text-sm text-white/70">{displayHsla}</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 底部信息栏（可选） */}
      {showValues && (
        <div className="p-4 bg-background/50">
          <div className="grid grid-cols-3 gap-2 text-xs text-center">
            <div>
              <div className="text-muted-foreground">R</div>
              <div className="font-mono">{rgba ? rgba.r : 0}</div>
            </div>
            <div>
              <div className="text-muted-foreground">G</div>
              <div className="font-mono">{rgba ? rgba.g : 0}</div>
            </div>
            <div>
              <div className="text-muted-foreground">B</div>
              <div className="font-mono">{rgba ? rgba.b : 0}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleColorPreview;
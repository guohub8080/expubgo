import React, { useState } from "react";
import { HexAlphaColorPicker, HslColorPicker, RgbColorPicker } from "react-colorful";
import { useColorControl } from "@dev/store/useColorControl";
import { parseHexColor, toHex, hslaToRgba, rgbaToHsla, clamp } from "../utils/color.ts";
import { AdvancedColorWheel } from "./AdvancedColorWheel.tsx";

export type PickerMode = "hex" | "hsl" | "rgb" | "wheel";

interface InlineColorPickerProps {
  hex: string;
  setHex: (hex: string) => void;
  width?: number;
  height?: number;
}

export const InlineColorPicker: React.FC<InlineColorPickerProps> = ({
  hex,
  setHex,
  width = 280,
  height = 280,
}) => {
  const colorControl = useColorControl();
  const [pickerMode, setPickerMode] = useState<PickerMode>("hex");

  // 获取当前颜色的RGBA值
  const currentRgba = parseHexColor(hex);
  const currentHsla = currentRgba ? rgbaToHsla(currentRgba) : null;

  // 根据不同模式转换颜色值
  const getColorForMode = () => {
    if (!currentRgba) return "#000000";

    switch (pickerMode) {
      case "hex":
        return "#" + hex;
      case "hsl":
        if (!currentHsla) return { h: 0, s: 0, l: 0, a: 1 };
        return {
          h: currentHsla.h,
          s: currentHsla.s,
          l: currentHsla.l,
          a: currentHsla.a / 255
        };
      case "rgb":
        return {
          r: currentRgba.r,
          g: currentRgba.g,
          b: currentRgba.b,
          a: currentRgba.a / 255
        };
      case "wheel":
        return "#" + hex;
      default:
        return "#" + hex;
    }
  };

  // 处理颜色变化
  const handleColorChange = (newColor: any) => {
    let newRgba;
    let newHexValue;

    switch (pickerMode) {
      case "hex":
      case "wheel":
        const cleanHex = newColor.replace(/^#/, "");
        newRgba = parseHexColor(cleanHex);
        if (newRgba) {
          newHexValue = cleanHex;
        }
        break;
      case "hsl":
        if (newColor.h !== undefined) {
          newRgba = hslaToRgba({
            h: clamp(newColor.h, 0, 360),
            s: clamp(newColor.s, 0, 100),
            l: clamp(newColor.l, 0, 100),
            a: clamp((newColor.a || 1) * 255, 0, 255)
          });
        }
        break;
      case "rgb":
        if (newColor.r !== undefined) {
          newRgba = {
            r: clamp(newColor.r, 0, 255),
            g: clamp(newColor.g, 0, 255),
            b: clamp(newColor.b, 0, 255),
            a: clamp((newColor.a || 1) * 255, 0, 255)
          };
        }
        break;
    }

    if (newRgba) {
      if (!newHexValue) {
        newHexValue = toHex(newRgba, true).replace(/^#/, "");
      }
      setHex(newHexValue);

      // 同步到store的透明度值
      if (colorControl.enableAlpha) {
        const alphaValue = newRgba.a / 255;
        // 避免无限循环，设置容差
        const currentAlpha = Math.round(currentRgba?.a || 255);
        const targetAlpha = Math.round(alphaValue * 255);
        if (Math.abs(currentAlpha - targetAlpha) > 2) {
          colorControl.setAlpha(alphaValue);
        }
      }
    }
  };

  const renderPicker = () => {
    switch (pickerMode) {
      case "hex":
        return (
          <div style={{ width, height }}>
            <HexAlphaColorPicker color={getColorForMode()} onChange={handleColorChange} />
          </div>
        );
      case "hsl":
        return (
          <div style={{ width, height }}>
            <HslColorPicker color={getColorForMode()} onChange={handleColorChange} />
          </div>
        );
      case "rgb":
        return (
          <div style={{ width, height }}>
            <RgbColorPicker color={getColorForMode()} onChange={handleColorChange} />
          </div>
        );
      case "wheel":
        return <AdvancedColorWheel hex={hex} setHex={setHex} width={width} height={height} />;
      default:
        return null;
    }
  };

  const pickerModes = [
    { value: "hex", label: "HEX", icon: "🎨" },
    { value: "hsl", label: "HSL", icon: "🌈" },
    { value: "rgb", label: "RGB", icon: "🔴" },
    { value: "wheel", label: "色轮", icon: "⭕" },
  ] as const;

  return (
    <div className="space-y-4">
      {/* 选色器模式切换 */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">选择模式</span>
        <div className="flex gap-1 rounded-lg border bg-background p-1">
          {pickerModes.map((mode) => (
            <button
              key={mode.value}
              onClick={() => setPickerMode(mode.value as PickerMode)}
              className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition ${
                pickerMode === mode.value
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              title={mode.label}
            >
              <span>{mode.icon}</span>
              <span className="hidden sm:inline">{mode.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 选色器主体 */}
      <div className="flex justify-center">
        {renderPicker()}
      </div>

      {/* 当前颜色信息 */}
      <div className="rounded-lg border bg-muted/30 p-3">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-muted-foreground">HEX:</span>
            <span className="ml-1 font-mono">#{hex}</span>
          </div>
          {currentRgba && (
            <>
              <div>
                <span className="text-muted-foreground">RGB:</span>
                <span className="ml-1 font-mono">
                  {currentRgba.r},{currentRgba.g},{currentRgba.b}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Alpha:</span>
                <span className="ml-1 font-mono">{(currentRgba.a / 255).toFixed(2)}</span>
              </div>
              {currentHsla && (
                <div>
                  <span className="text-muted-foreground">HSL:</span>
                  <span className="ml-1 font-mono">
                    {Math.round(currentHsla.h)}°,{Math.round(currentHsla.s)}%,{Math.round(currentHsla.l)}%
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
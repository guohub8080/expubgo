import React from "react";
import { HexAlphaColorPicker, HslColorPicker, RgbColorPicker } from "react-colorful";
import { parseHexColor, toHex, hslaToRgba, rgbaToHsla, clamp } from "../utils/color.ts";
import { useColorControl } from "@dev/store/useColorControl";
import { AdvancedColorWheel } from "./AdvancedColorWheel.tsx";

interface MultiColorPickersProps {
  hex: string;
  setHex: (hex: string) => void;
}

export const MultiColorPickers: React.FC<MultiColorPickersProps> = ({ hex, setHex }) => {
  const colorControl = useColorControl();

  // 获取当前颜色的RGBA值
  const currentRgba = parseHexColor(hex);
  const currentHsla = currentRgba ? rgbaToHsla(currentRgba) : null;

  // 处理HEX选色器变化
  const handleHexPickerChange = (newColor: string) => {
    const cleanHex = newColor.replace(/^#/, "");
    const newRgba = parseHexColor(cleanHex);
    if (newRgba) {
      setHex(cleanHex);
      syncAlphaToStore(newRgba);
    }
  };

  // 处理HSL选色器变化
  const handleHslPickerChange = (newColor: any) => {
    if (newColor.h !== undefined) {
      const newRgba = hslaToRgba({
        h: clamp(newColor.h, 0, 360),
        s: clamp(newColor.s, 0, 100),
        l: clamp(newColor.l, 0, 100),
        a: clamp((newColor.a || 1) * 255, 0, 255)
      });
      if (newRgba) {
        const newHex = toHex(newRgba, true).replace(/^#/, "");
        setHex(newHex);
        syncAlphaToStore(newRgba);
      }
    }
  };

  // 处理RGB选色器变化
  const handleRgbPickerChange = (newColor: any) => {
    if (newColor.r !== undefined) {
      const newRgba = {
        r: clamp(newColor.r, 0, 255),
        g: clamp(newColor.g, 0, 255),
        b: clamp(newColor.b, 0, 255),
        a: clamp((newColor.a || 1) * 255, 0, 255)
      };
      const newHex = toHex(newRgba, true).replace(/^#/, "");
      setHex(newHex);
      syncAlphaToStore(newRgba);
    }
  };

  // 同步透明度到store
  const syncAlphaToStore = (rgba: any) => {
    if (colorControl.enableAlpha && rgba) {
      const alphaValue = rgba.a / 255;
      // 避免无限循环，设置容差
      const currentAlpha = Math.round(currentRgba?.a || 255);
      const targetAlpha = Math.round(alphaValue * 255);
      if (Math.abs(currentAlpha - targetAlpha) > 2) {
        colorControl.setAlpha(alphaValue);
      }
    }
  };

  // 为不同选色器准备颜色值
  const hexPickerColor = "#" + hex;
  const hslPickerColor = currentHsla ? {
    h: currentHsla.h,
    s: currentHsla.s,
    l: currentHsla.l,
    a: currentHsla.a / 255
  } : { h: 0, s: 0, l: 0, a: 1 };
  const rgbPickerColor = currentRgba ? {
    r: currentRgba.r,
    g: currentRgba.g,
    b: currentRgba.b,
    a: currentRgba.a / 255
  } : { r: 0, g: 0, b: 0, a: 1 };

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-medium text-foreground">多种选色器</h3>

      {/* 网格布局显示多个选色器 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* HEX 正方形选色器 */}
        <div className="space-y-3">
          <div className="text-center">
            <span className="text-xs font-medium text-muted-foreground">HEX 选色器</span>
          </div>
          <div className="flex justify-center">
            <div className="w-[200px] h-[200px]">
              <HexAlphaColorPicker
                color={hexPickerColor}
                onChange={handleHexPickerChange}
              />
            </div>
          </div>
        </div>

        {/* HSL 选色器 */}
        <div className="space-y-3">
          <div className="text-center">
            <span className="text-xs font-medium text-muted-foreground">HSL 选色器</span>
          </div>
          <div className="flex justify-center">
            <div className="w-[200px] h-[200px]">
              <HslColorPicker
                color={hslPickerColor}
                onChange={handleHslPickerChange}
              />
            </div>
          </div>
        </div>

        {/* RGB 选色器 */}
        <div className="space-y-3">
          <div className="text-center">
            <span className="text-xs font-medium text-muted-foreground">RGB 选色器</span>
          </div>
          <div className="flex justify-center">
            <div className="w-[200px] h-[200px]">
              <RgbColorPicker
                color={rgbPickerColor}
                onChange={handleRgbPickerChange}
              />
            </div>
          </div>
        </div>

        {/* 色轮选色器 */}
        <div className="space-y-3">
          <div className="text-center">
            <span className="text-xs font-medium text-muted-foreground">色轮选色器</span>
          </div>
          <div className="flex justify-center">
            <AdvancedColorWheel
              hex={hex}
              setHex={setHex}
              width={200}
              height={200}
            />
          </div>
        </div>
      </div>

      {/* 当前颜色值显示 */}
      <div className="rounded-lg border bg-muted/30 p-4">
        <div className="text-xs font-medium text-muted-foreground mb-3">当前颜色值</div>
        <div className="grid grid-cols-2 gap-3 text-xs">
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
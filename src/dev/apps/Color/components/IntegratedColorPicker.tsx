import React, { useEffect, useMemo } from "react";
import { HexAlphaColorPicker } from "react-colorful";
import { useColorControl } from "@dev/store/useColorControl";
import { parseHexColor, toHex } from "../utils/color.ts";

interface IntegratedColorPickerProps {
  /**
   * 当前hex值
   */
  hex: string;
  /**
   * 设置hex值的函数
   */
  setHex: (hex: string) => void;
  width?: number;
  height?: number;
}

/**
 * 集成的颜色选择器组件，将颜色选择器与store状态完全整合
 */
export const IntegratedColorPicker: React.FC<IntegratedColorPickerProps> = ({
  hex,
  setHex,
  width = 240,
  height = 240,
}) => {
  const colorControl = useColorControl();

  // 解析当前颜色的RGBA值
  const currentRgba = useMemo(() => {
    return parseHexColor(hex);
  }, [hex]);

  // 用于颜色选择器显示的hex值
  const displayHex = useMemo(() => {
    if (!currentRgba) return hex;

    // 如果启用透明度，使用store中的alpha值
    if (colorControl.enableAlpha) {
      const alpha255 = Math.round(colorControl.alpha * 255);
      const syncedRgba = { ...currentRgba, a: alpha255 };
      return toHex(syncedRgba, true).replace(/^#/, "");
    }

    // 如果禁用透明度，强制alpha为255
    const syncedRgba = { ...currentRgba, a: 255 };
    return toHex(syncedRgba, false).replace(/^#/, "");
  }, [currentRgba, hex, colorControl.alpha, colorControl.enableAlpha]);

  // 当透明度开关状态变化时，同步更新颜色的hex值
  useEffect(() => {
    if (currentRgba) {
      if (colorControl.enableAlpha) {
        // 启用透明度：使用store中的alpha值
        const alpha255 = Math.round(colorControl.alpha * 255);
        const updatedRgba = { ...currentRgba, a: alpha255 };
        const updatedHex = toHex(updatedRgba, true).replace(/^#/, "");
        setHex(updatedHex);
      } else {
        // 禁用透明度：强制alpha为255 (完全不透明)
        const updatedRgba = { ...currentRgba, a: 255 };
        const updatedHex = toHex(updatedRgba, false).replace(/^#/, "");
        setHex(updatedHex);
      }
    }
  }, [colorControl.enableAlpha]);

  // 当store中的alpha值变化时，同步更新颜色的hex值
  useEffect(() => {
    if (currentRgba && colorControl.enableAlpha) {
      const currentAlpha = Math.round(currentRgba.a);
      const targetAlpha = Math.round(colorControl.alpha * 255);

      if (Math.abs(currentAlpha - targetAlpha) > 2) { // 设置容差避免无限循环
        const updatedRgba = { ...currentRgba, a: targetAlpha };
        const updatedHex = toHex(updatedRgba, true).replace(/^#/, "");
        setHex(updatedHex);
      }
    }
  }, [colorControl.alpha]);

  // 颜色选择器变化时的处理函数
  const handleColorChange = (newHex: string) => {
    const cleanHex = newHex.replace(/^#/, "");

    // 解析新的颜色值
    const newRgba = parseHexColor(cleanHex);
    if (newRgba) {
      // 更新hex值
      setHex(cleanHex);

      // 如果启用了透明度，同步更新store中的alpha值
      if (colorControl.enableAlpha) {
        const alphaValue = newRgba.a / 255;
        colorControl.setAlpha(alphaValue);
      }
    }
  };

  return (
    <div style={{ width, height }}>
      <HexAlphaColorPicker
        color={displayHex}
        onChange={handleColorChange}
      />
    </div>
  );
};
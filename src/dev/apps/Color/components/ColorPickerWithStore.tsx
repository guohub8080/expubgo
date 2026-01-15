import React, { useEffect, useMemo } from "react";
import { HexAlphaColorPicker } from "react-colorful";
import { parseHexColor, toHex } from "../utils/color.ts";

interface ColorPickerWithStoreProps {
  /**
   * 当前颜色的hex值（包含alpha）
   */
  hex: string;
  /**
   * 设置hex值的函数
   */
  setHex: (hex: string) => void;
  /**
   * 当前透明度值 (0-1)
   */
  alpha: number;
  /**
   * 设置透明度值的函数
   */
  setAlpha: (alpha: number) => void;
  /**
   * 是否启用透明度
   */
  enableAlpha: boolean;
  /**
   * 颜色选择器的宽度
   */
  width?: number;
  /**
   * 颜色选择器的高度
   */
  height?: number;
}

/**
 * 与store双向绑定的颜色选择器组件
 */
export const ColorPickerWithStore: React.FC<ColorPickerWithStoreProps> = ({
  hex,
  setHex,
  alpha,
  setAlpha,
  enableAlpha,
  width = 240,
  height = 240,
}) => {
  // 解析当前颜色的RGBA值
  const currentRgba = useMemo(() => {
    return parseHexColor(hex);
  }, [hex]);

  // 用于颜色选择器显示的hex值
  const displayHex = useMemo(() => {
    if (!currentRgba) return hex;

    // 直接使用当前hex值，让react-colorful自己处理
    return hex.length === 8 ? hex : hex + "ff";
  }, [hex, currentRgba]);

  // 颜色选择器变化时的处理函数
  const handleColorChange = (newHex: string) => {
    const cleanHex = newHex.replace(/^#/, "");

    // 直接更新hex值
    setHex(cleanHex);

    // 解析新的颜色值来更新alpha
    const newRgba = parseHexColor(cleanHex);
    if (newRgba && enableAlpha) {
      // 将0-255的alpha值转换为0-1
      const alphaValue = Math.round((newRgba.a / 255) * 100) / 100;
      setAlpha(alphaValue);
    }
  };

  // 外部alpha值变化时，同步更新hex中的alpha部分
  useEffect(() => {
    if (currentRgba && enableAlpha) {
      // 将0-1的alpha转换为0-255
      const targetAlpha = Math.round(alpha * 255);

      // 如果alpha值有显著变化，更新hex
      if (Math.abs(currentRgba.a - targetAlpha) > 2) { // 设置一个小的容差避免无限循环
        const updatedRgba = { ...currentRgba, a: targetAlpha };
        const updatedHex = toHex(updatedRgba, true).replace(/^#/, "");
        setHex(updatedHex);
      }
    }
  }, [alpha, currentRgba, enableAlpha, setHex]);

  return (
    <div style={{ width, height }}>
      <HexAlphaColorPicker
        color={displayHex}
        onChange={handleColorChange}
      />
    </div>
  );
};
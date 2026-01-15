import React, { useEffect, useRef, useState } from "react";
import iro from "@jaames/iro";

interface IroSliderProps {
  /**
   * 滑块类型
   */
  sliderType: "hue" | "saturation" | "value" | "red" | "green" | "blue" | "alpha" | "kelvin";
  /**
   * 当前颜色（十六进制格式，带#号）
   */
  color: string;
  /**
   * 颜色变化回调
   */
  onChange: (color: any) => void;
  /**
   * 滑块宽度（可选）
   */
  width?: number;
  /**
   * 滑块高度（可选）
   */
  sliderHeight?: number;
}

export const IroSlider: React.FC<IroSliderProps> = ({
  sliderType,
  color,
  onChange,
  width = 320,
  sliderHeight = 24,
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const colorPickerRef = useRef<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (sliderRef.current && !colorPickerRef.current) {
      try {
        // 创建 iro.js 配置
        const config: any = {
          width: width,
          color: color,
          layout: [
            {
              component: iro.ui.Slider,
              options: {
                sliderType: sliderType,
                sliderSize: sliderHeight,
              }
            }
          ],
          borderWidth: 1,
          borderColor: '#e5e7eb',
        };

        // 创建取色器实例
        colorPickerRef.current = new iro.ColorPicker(sliderRef.current, config);

        // 监听颜色变化事件
        colorPickerRef.current.on('color:change', (colorObj: any) => {
          onChange(colorObj);
        });

        setIsInitialized(true);
      } catch (error) {
        console.error('Error creating iro.js slider:', error);
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
          console.warn('iro.js slider cleanup completed with warning:', e);
        }
        colorPickerRef.current = null;
        setIsInitialized(false);
      }
    };
  }, [sliderType, width, sliderHeight]);

  // 当外部颜色变化时，更新滑块颜色
  useEffect(() => {
    if (colorPickerRef.current && isInitialized) {
      try {
        // 获取当前颜色
        const currentColor = colorPickerRef.current.color.hexString;
        // 只有当颜色真的改变时才更新，避免触发循环
        if (currentColor.toUpperCase() !== color.toUpperCase()) {
          colorPickerRef.current.color.set(color);
        }
      } catch (e) {
        console.warn('Error updating iro.js slider color:', e);
      }
    }
  }, [color, isInitialized]);

  return (
    <div ref={sliderRef} className="iro-slider-container" />
  );
};

export default IroSlider;

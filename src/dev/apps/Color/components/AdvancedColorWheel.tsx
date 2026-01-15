import React, { useEffect, useRef, useState } from "react";
import { parseHexColor, toHex, rgbaToHsla, hslaToRgba } from "../utils/color.ts";
import { useColorControl } from "@dev/store/useColorControl";

interface AdvancedColorWheelProps {
  hex: string;
  setHex: (hex: string) => void;
  width?: number;
  height?: number;
}

export const AdvancedColorWheel: React.FC<AdvancedColorWheelProps> = ({
  hex,
  setHex,
  width = 280,
  height = 280,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const colorControl = useColorControl();

  const currentRgba = parseHexColor(hex);
  const currentHsla = currentRgba ? rgbaToHsla(currentRgba) : null;

  // 将HSL转换为画布坐标
  const hslToCanvas = (h: number, s: number, l: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 10;

    // 色相决定角度，饱和度决定半径
    const angle = (h - 90) * (Math.PI / 180); // 调整角度使红色在顶部
    const r = (s / 100) * radius;

    return {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle)
    };
  };

  // 将画布坐标转换为HSL
  const canvasToHsl = (x: number, y: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 10;

    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // 色相
    let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;

    // 饱和度
    const saturation = Math.min(100, (distance / radius) * 100);

    // 明度保持当前值或使用默认值
    const lightness = currentHsla ? currentHsla.l : 50;

    return {
      h: Math.round(angle),
      s: Math.round(saturation),
      l: lightness
    };
  };

  // 绘制色轮
  const drawColorWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 10;

    // 清空画布
    ctx.clearRect(0, 0, width, height);

    // 绘制色轮
    for (let angle = 0; angle < 360; angle++) {
      for (let r = 0; r < radius; r++) {
        const saturation = (r / radius) * 100;
        const hsla = hslaToRgba({
          h: angle,
          s: saturation,
          l: 50, // 固定明度为50以获得最佳饱和度效果
          a: 255
        });

        if (hsla) {
          const x = centerX + r * Math.cos((angle - 90) * (Math.PI / 180));
          const y = centerY + r * Math.sin((angle - 90) * (Math.PI / 180));

          ctx.fillStyle = `rgb(${hsla.r}, ${hsla.g}, ${hsla.b})`;
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }

    // 绘制当前颜色指示器
    if (currentHsla) {
      const pos = hslToCanvas(currentHsla.h, currentHsla.s, currentHsla.l);

      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 8, 0, 2 * Math.PI);
      ctx.stroke();

      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 8, 0, 2 * Math.PI);
      ctx.stroke();
    }
  };

  // 处理鼠标事件
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    handleColorPick(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      handleColorPick(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleColorPick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const hsl = canvasToHsl(x, y);

    const newRgba = hslaToRgba({
      h: hsl.h,
      s: hsl.s,
      l: hsl.l,
      a: colorControl.enableAlpha ? Math.round(colorControl.alpha * 255) : 255
    });

    if (newRgba) {
      const newHex = toHex(newRgba, true).replace(/^#/, "");
      setHex(newHex);
    }
  };

  // 监听颜色变化，重绘色轮
  useEffect(() => {
    drawColorWheel();
  }, [hex, currentHsla]);

  return (
    <div className="space-y-4">
      {/* 色轮 */}
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="border rounded-lg cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>

      {/* 明度滑块 */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>明度 (Lightness)</span>
          <span>{currentHsla ? Math.round(currentHsla.l) : 50}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={currentHsla ? currentHsla.l : 50}
          onChange={(e) => {
            if (currentHsla) {
              const newRgba = hslaToRgba({
                h: currentHsla.h,
                s: currentHsla.s,
                l: parseInt(e.target.value),
                a: colorControl.enableAlpha ? Math.round(colorControl.alpha * 255) : 255
              });
              if (newRgba) {
                const newHex = toHex(newRgba, true).replace(/^#/, "");
                setHex(newHex);
              }
            }
          }}
          className="w-full h-2 bg-gradient-to-r from-black via-gray-500 to-white rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* 当前颜色信息 */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="text-center">
          <div className="text-muted-foreground">色相</div>
          <div className="font-mono">{currentHsla ? Math.round(currentHsla.h) : 0}°</div>
        </div>
        <div className="text-center">
          <div className="text-muted-foreground">饱和度</div>
          <div className="font-mono">{currentHsla ? Math.round(currentHsla.s) : 0}%</div>
        </div>
        <div className="text-center">
          <div className="text-muted-foreground">明度</div>
          <div className="font-mono">{currentHsla ? Math.round(currentHsla.l) : 0}%</div>
        </div>
      </div>
    </div>
  );
};
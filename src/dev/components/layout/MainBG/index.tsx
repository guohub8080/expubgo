/** @jsxImportSource react */
/**
 * 主背景组件 - 可切换不同背景效果
 */
import React from "react";
import { AuroraBackground } from "../../../shadcn/components/background/AuroraBackground";

// 背景类型枚举
export type BackgroundType =
  | "theme"
  | "aurora"
  | "gradient-ocean"
  | "gradient-forest"
  | "gradient-dusk"
  | "gradient-midnight"
  | "gradient-ember"
  | "gradient-nebula"
  | "gradient-abyss"
  | "solid-forest"
  | "solid-wine"
  | "solid-warmWhite"
  | "solid-lightGray"
  | "solid-coolBlue"
  | "solid-rose";

// 纯色背景调色板
const SOLID_COLORS: Record<string, string> = {
  "solid-forest": "#064e3b",
  "solid-wine": "#4c0519",
  "solid-warmWhite": "#FAFAF7",
  "solid-lightGray": "#F4F4F5",
  "solid-coolBlue": "#EDF2F7",
  "solid-rose": "#FFF1F2",
};

// 渐变背景配置
const GRADIENT_CONFIGS: Record<string, { colors: string; angle: number; overlay: string }> = {
  "gradient-ocean": {
    colors: "#7dd3fc, #5eead4, #86efac, #7dd3fc, #93c5fd, #7dd3fc",
    angle: 120,
    overlay: "bg-white/82 dark:bg-black/68",
  },
  "gradient-forest": {
    colors: "#86efac, #bef264, #5eead4, #86efac, #a3e635, #86efac",
    angle: 60,
    overlay: "bg-white/85 dark:bg-black/70",
  },
  "gradient-dusk": {
    colors: "#c4b5fd, #f9a8d4, #fda4af, #c4b5fd, #a5b4fc, #c4b5fd",
    angle: 45,
    overlay: "bg-white/80 dark:bg-black/65",
  },
  "gradient-midnight": {
    colors: "#1e293b, #312e81, #1e1b4b, #0f172a, #1e293b, #1e293b",
    angle: 90,
    overlay: "bg-white/5 dark:bg-black/35",
  },
  "gradient-ember": {
    colors: "#7f1d1d, #9a3412, #78350f, #7f1d1d, #991b1b, #7f1d1d",
    angle: 135,
    overlay: "bg-black/25",
  },
  "gradient-nebula": {
    colors: "#581c87, #701a75, #831843, #581c87, #4c1d95, #581c87",
    angle: 60,
    overlay: "bg-black/20",
  },
  "gradient-abyss": {
    colors: "#020617, #0c4a6e, #164e63, #020617, #083344, #020617",
    angle: 120,
    overlay: "bg-black/15",
  },
};

interface MainBGProps {
  type?: BackgroundType;
  className?: string;
}

const GradientBackground: React.FC<{ config: typeof GRADIENT_CONFIGS[string]; className: string }> = ({
  config,
  className,
}) => (
  <div className={`fixed inset-0 h-screen w-screen z-0 overflow-hidden ${className}`}>
    <div
      className="absolute inset-0 opacity-100 animate-gradient-shift"
      style={{
        background: `linear-gradient(${config.angle}deg, ${config.colors})`,
        backgroundSize: "400% 400%",
      }}
    />
    <div className={`absolute inset-0 ${config.overlay}`} />
  </div>
);

// 主题相关的渐变配置
const THEME_GRADIENTS: Record<string, { colors: string; angle: number; overlay: string }> = {
  light: {
    colors: "#cbd5e1, #e2e8f0, #f1f5f9, #e0e7ff, #ede9fe, #cbd5e1",
    angle: 120,
    overlay: "bg-white/60",
  },
  dark: {
    colors: "#1e293b, #334155, #475569, #1e293b, #0f172a, #1e293b",
    angle: 90,
    overlay: "bg-black/40",
  },
  retro: {
    colors: "#d4a574, #c9a86c, #b8956a, #a67c52, #8b6914, #d4a574",
    angle: 60,
    overlay: "bg-[#faf6f0]/85",
  },
  midnight: {
    colors: "#1e1b4b, #312e81, #4338ca, #1e1b4b, #0f172a, #1e1b4b",
    angle: 120,
    overlay: "bg-black/30",
  },
  forest: {
    colors: "#2d6a4f, #40916c, #52b788, #2d6a4f, #1b4332, #2d6a4f",
    angle: 135,
    overlay: "bg-[#f0f4f1]/88",
  },
  caramel: {
    colors: "#a67c52, #c49a6c, #d4a574, #a67c52, #8b6239, #a67c52",
    angle: 45,
    overlay: "bg-[#faf7f2]/90",
  },
  mist: {
    colors: "#475569, #64748b, #94a3b8, #475569, #334155, #475569",
    angle: 90,
    overlay: "bg-[#e2e8f0]/85",
  },
  ocean: {
    colors: "#1e3a5f, #2563eb, #3b82f6, #1e3a5f, #1d4ed8, #1e3a5f",
    angle: 120,
    overlay: "bg-[#f0f4f8]/88",
  },
};

const MainBG: React.FC<MainBGProps> = ({ type = "theme", className = "" }) => {
  const renderBackground = () => {
    // 跟随主题 - 使用主题相关的渐变
    if (type === "theme") {
      const theme = document.documentElement.getAttribute("data-theme") || "light";
      const config = THEME_GRADIENTS[theme] || THEME_GRADIENTS.light;
      return <GradientBackground config={config} className={className} />;
    }

    // 纯色背景
    if (type in SOLID_COLORS) {
      return (
        <div
          className={`fixed inset-0 h-screen w-screen z-0 ${className}`}
          style={{ backgroundColor: SOLID_COLORS[type] }}
        />
      );
    }

    // 渐变背景
    if (type in GRADIENT_CONFIGS) {
      return <GradientBackground config={GRADIENT_CONFIGS[type]} className={className} />;
    }

    switch (type) {
      case "aurora":
        return (
          <AuroraBackground className={`!fixed !inset-0 !h-screen !w-screen !z-0 !justify-start !items-stretch ${className}`}>
            <div />
          </AuroraBackground>
        );

      default:
        return null;
    }
  };

  return <>{renderBackground()}</>;
};

export default MainBG;

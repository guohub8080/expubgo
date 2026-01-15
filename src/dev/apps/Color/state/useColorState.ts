import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { HSLA, RGBA, oklchToRgba, parseHexColor, rgbaToCss, rgbaToHsla, toHex, rgbaToOklch, formatOklch, detectAndParseColor, DetectedKind } from "../utils/color.ts";

interface UseColorStateProps {
  /**
   * 外部传入的透明度值（与store双向绑定）
   */
  externalAlpha?: number;
  /**
   * 外部传入的透明度启用状态
   */
  enableAlpha?: boolean;
  /**
   * 外部透明度变化时的回调
   */
  onExternalAlphaChange?: (alpha: number) => void;
  /**
   * 外部透明度启用状态变化回调
   */
  onEnableAlphaChange?: (enabled: boolean) => void;
}


export function useColorState({ externalAlpha, enableAlpha = false, onExternalAlphaChange, onEnableAlphaChange }: UseColorStateProps = {}) {
  const defaultHex = "f44d0dff"; // 默认红色
  const [hex, setHex] = useState<string>(defaultHex);
  const [detectedKind, setDetectedKind] = useState<DetectedKind>('hex');
  const [universalInput, setUniversalInput] = useState<string>("");

  const rgba = useMemo<RGBA | null>(() => parseHexColor(hex), [hex]);
  const hsla = useMemo<HSLA | null>(() => (rgba ? rgbaToHsla(rgba) : null), [rgba]);
  const oklch = useMemo(() => (rgba ? rgbaToOklch(rgba) : null), [rgba]);

  // 监听外部透明度变化，更新HEX值
  useEffect(() => {
    if (enableAlpha && externalAlpha !== undefined && rgba) {
      // 保持RGB值不变，只更新透明度
      const newRgba = { ...rgba, a: Math.round(externalAlpha * 255) };
      const newHex = toHex(newRgba, true).replace(/^#/, '');
      setHex(newHex);
    }
  }, [externalAlpha, enableAlpha, rgba]);

  const displayHex = rgba ? toHex(rgba, true) : "";
  const displayRgba = rgba ? rgbaToCss(rgba) : "";
  const displayHsla = hsla ? `hsla(${hsla.h}, ${hsla.s}%, ${hsla.l}%, ${hsla.a})` : "";
  const displayOklch = oklch ? formatOklch(oklch) : "";

  const invalid = rgba == null;

  const colorInputRef = useRef<HTMLInputElement | null>(null);

  const handlePickWithInput = () => {
    colorInputRef.current?.click();
  };

  const handlePickWithEyedropper = async () => {
    try {
      // @ts-expect-error: Eyedropper not in TS lib yet for all targets
      if (window.EyeDropper) {
        // @ts-expect-error
        const eye = new window.EyeDropper();
        const res = await eye.open();
        // res.sRGBHex is like #RRGGBB
        const picked = res.sRGBHex.replace(/^#/, "");
        setHex(picked + "ff"); // 强制设置为不透明

        // 如果透明度开关是开着的，关闭它
        if (enableAlpha && onEnableAlphaChange) {
          setTimeout(() => {
            onEnableAlphaChange(false);
          }, 0);
        }

        toast.success("已从屏幕取色");
      } else if (navigator.clipboard && 'permissions' in navigator) {
        toast.error("当前浏览器不支持取色器");
      } else {
        toast.error("取色器不可用");
      }
    } catch (e: any) {
      if (e?.name !== "AbortError") {
        toast.error("取色失败");
      }
    }
  };

  const copyValue = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("已复制到剪贴板");
    } catch {
      toast.error("复制失败");
    }
  };

  const handleNativeColorChange = (val: string) => {
    // val is #rrggbb from <input type="color">
    const v = val.replace(/^#/, "");
    setHex(v + "ff");
  };

  const recognizeUniversalInput = () => {
    const { rgba, kind } = detectAndParseColor(universalInput);
    if (!rgba) {
      toast.error("无法识别该颜色格式");
      return;
    }
    setDetectedKind(kind);
    const newHex = toHex(rgba, true).replace(/^#/, "");
    setHex(newHex);

    // 检测透明度并自动切换开关
    const hasAlpha = rgba.a < 255; // alpha < 255 表示有透明度

    if (hasAlpha && !enableAlpha && onEnableAlphaChange) {
      // 识别到透明度但开关是关的 -> 打开开关
      setTimeout(() => {
        onEnableAlphaChange(true);
        // 更新透明度值
        if (onExternalAlphaChange) {
          onExternalAlphaChange(rgba.a / 255); // 转换为0-1范围
        }
      }, 0);
      toast.success(`识别为 ${kind.toUpperCase()} (含透明度)`);
    } else if (!hasAlpha && enableAlpha && onEnableAlphaChange) {
      // 无透明度但开关是开的 -> 关闭开关
      setTimeout(() => {
        onEnableAlphaChange(false);
      }, 0);
      toast.success(`识别为 ${kind.toUpperCase()} (无透明度)`);
    } else {
      toast.success(`识别为 ${kind.toUpperCase()}`);
    }
  };

  return {
    hex,
    setHex,
    rgba,
    hsla,
    oklch,
    invalid,
    displayHex,
    displayRgba,
    displayHsla,
    displayOklch,
    handlePickWithEyedropper,
    handlePickWithInput,
    handleNativeColorChange,
    colorInputRef,
    copyValue,
    universalInput,
    setUniversalInput,
    detectedKind,
    recognizeUniversalInput,
  };
}



import { ShadowConfig } from '../store/useShadowStore';

/**
 * 生成 box-shadow CSS 值
 */
export function generateBoxShadow(config: ShadowConfig, colorFormat: ColorFormat = 'hex'): string {
  const { offsetX, offsetY, blur, spread, color, inset } = config;

  // 将颜色格式化为指定格式
  const formattedColor = formatColor(color, colorFormat);

  const parts = [
    inset ? 'inset' : '',
    `${offsetX}px`,
    `${offsetY}px`,
    `${blur}px`,
    `${spread}px`,
    formattedColor
  ].filter(Boolean);

  return parts.join(' ');
}

/**
 * 生成 filter: drop-shadow() CSS 值
 */
export function generateDropShadow(config: ShadowConfig, colorFormat: ColorFormat = 'hex'): string {
  const { offsetX, offsetY, blur, color } = config;

  // 将颜色格式化为指定格式
  const formattedColor = formatColor(color, colorFormat);

  return `drop-shadow(${offsetX}px ${offsetY}px ${blur}px ${formattedColor})`;
}

/**
 * 生成完整的 CSS 代码
 */
export function generateCSSCode(config: ShadowConfig, colorFormat: ColorFormat = 'hex'): string {
  if (config.type === 'box-shadow') {
    const value = generateBoxShadow(config, colorFormat);

    if (config.outputFormat === 'css') {
      return `box-shadow: ${value};`;
    } else {
      // React 格式 (驼峰 + 双引号)
      return `boxShadow: "${value}"`;
    }
  } else {
    const value = generateDropShadow(config, colorFormat);

    if (config.outputFormat === 'css') {
      return `filter: ${value};`;
    } else {
      // React 格式
      return `filter: "${value}"`;
    }
  }
}

/**
 * 解析 RGBA 颜色字符串，返回各个分量
 */
export function parseRGBA(color: string): { r: number; g: number; b: number; a: number } | null {
  // 尝试匹配 rgba
  let match = color.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/);
  if (match) {
    return {
      r: parseInt(match[1]),
      g: parseInt(match[2]),
      b: parseInt(match[3]),
      a: match[4] ? parseFloat(match[4]) : 1
    };
  }

  // 尝试匹配 hex
  match = color.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (match) {
    return {
      r: parseInt(match[1], 16),
      g: parseInt(match[2], 16),
      b: parseInt(match[3], 16),
      a: 1
    };
  }

  return null;
}

/**
 * 将 RGBA 分量转为颜色字符串
 */
export function rgbaToString(r: number, g: number, b: number, a: number): string {
  if (a === 1) {
    return `rgb(${r}, ${g}, ${b})`;
  }
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/**
 * 将 hex 颜色转为 RGBA
 */
export function hexToRGBA(hex: string, alpha: number = 1): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return 'rgba(0, 0, 0, 1)';

  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);

  return rgbaToString(r, g, b, alpha);
}

/**
 * 将 RGBA 转为 hex 颜色
 */
export function rgbaToHex(color: string): string {
  const parsed = parseRGBA(color);
  if (!parsed) return '#000000';

  const toHex = (n: number) => {
    const hex = n.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(parsed.r)}${toHex(parsed.g)}${toHex(parsed.b)}`;
}

/**
 * RGB 转 HSL
 */
export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

/**
 * HSL 转 RGB
 */
export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

/**
 * 颜色格式类型
 */
export type ColorFormat = 'hex' | 'rgb' | 'hsl';

/**
 * 将颜色转换为指定格式
 */
export function formatColor(color: string, format: ColorFormat): string {
  const rgba = parseRGBA(color);
  if (!rgba) return color;

  const { r, g, b, a } = rgba;

  switch (format) {
    case 'hex':
      // 根据 alpha 值决定使用 6 位还是 8 位 hex
      const hex = rgbaToHex(color).toLowerCase();
      if (a === 1) {
        return hex;
      } else {
        // 添加 alpha 通道（两位十六进制）
        const alphaHex = Math.round(a * 255).toString(16).padStart(2, '0');
        return hex + alphaHex;
      }
    case 'rgb':
      // 当不透明度为1时，使用 rgb 格式；否则使用 rgba
      if (a === 1) {
        return `rgb(${r}, ${g}, ${b})`;
      } else {
        return `rgba(${r}, ${g}, ${b}, ${a})`;
      }
    case 'hsl': {
      const hsl = rgbToHsl(r, g, b);
      // 当不透明度为1时，使用 hsl 格式；否则使用 hsla
      if (a === 1) {
        return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
      } else {
        return `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${a})`;
      }
    }
    default:
      return color;
  }
}

/**
 * 解析颜色字符串，返回 rgba 对象
 */
export function parseColorString(colorStr: string): { r: number; g: number; b: number; a: number } | null {
  const str = colorStr.trim();

  // 解析 hex
  if (str.startsWith('#')) {
    // 尝试解析 8 位 hex (#RRGGBBAA)
    const hex8Match = str.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if (hex8Match) {
      const r = parseInt(hex8Match[1], 16);
      const g = parseInt(hex8Match[2], 16);
      const b = parseInt(hex8Match[3], 16);
      const a = parseInt(hex8Match[4], 16) / 255;
      return { r, g, b, a };
    }

    // 尝试解析 6 位 hex (#RRGGBB)
    return parseRGBA(str);
  }

  // 解析 rgb/rgba
  if (str.startsWith('rgb')) {
    return parseRGBA(str);
  }

  // 解析 hsl/hsla
  if (str.startsWith('hsl')) {
    const match = str.match(/hsla?\s*\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(?:,\s*([\d.]+))?\s*\)/);
    if (match) {
      const h = parseInt(match[1]);
      const s = parseInt(match[2]);
      const l = parseInt(match[3]);
      const a = match[4] ? parseFloat(match[4]) : 1;
      const rgb = hslToRgb(h, s, l);
      return { ...rgb, a };
    }
  }

  return null;
}

import * as React from 'react';
import toast from 'react-hot-toast';
import { rgbaToOklch, formatOklch } from '../utils/color';

interface TailwindColorProps {
  onColorChange: (hex: string) => void;
}

// Tailwind CSS颜色数据
const tailwindColors = {
  Slate: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    950: '#020617',
  },
  Gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
    950: '#030712',
  },
  Zinc: {
    50: '#FAFAFA',
    100: '#F4F4F5',
    200: '#E4E4E7',
    300: '#D4D4D8',
    400: '#A1A1AA',
    500: '#71717A',
    600: '#52525B',
    700: '#3F3F46',
    800: '#27272A',
    900: '#18181B',
    950: '#09090B',
  },
  Neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0A0A0A',
  },
  Stone: {
    50: '#FAFAFA',
    100: '#F5F5F4',
    200: '#E7E5E4',
    300: '#D6D3D1',
    400: '#A8A29E',
    500: '#78716C',
    600: '#57534E',
    700: '#44403C',
    800: '#292524',
    900: '#1C1917',
    950: '#0C0A09',
  },
  Red: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
    950: '#450A0A',
  },
  Orange: {
    50: '#FFF7ED',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',
    500: '#F97316',
    600: '#EA580C',
    700: '#C2410C',
    800: '#9A3412',
    900: '#7C2D12',
    950: '#431407',
  },
  Amber: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
    950: '#451A03',
  },
  Yellow: {
    50: '#FEFCE8',
    100: '#FEF9C3',
    200: '#FEF08A',
    300: '#FDE047',
    400: '#FACC15',
    500: '#EAB308',
    600: '#CA8A04',
    700: '#A16207',
    800: '#854D0E',
    900: '#713F12',
    950: '#422006',
  },
  Lime: {
    50: '#F7FEE7',
    100: '#ECFCCB',
    200: '#D9F99D',
    300: '#BEF264',
    400: '#A3E635',
    500: '#84CC16',
    600: '#65A30D',
    700: '#4D7C0F',
    800: '#3F6212',
    900: '#365314',
    950: '#1A2E05',
  },
  Green: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
    950: '#052E16',
  },
  Emerald: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
    950: '#022C22',
  },
  Teal: {
    50: '#F0FDFA',
    100: '#CCFBF1',
    200: '#99F6E4',
    300: '#5EEAD4',
    400: '#2DD4BF',
    500: '#14B8A6',
    600: '#0D9488',
    700: '#0F766E',
    800: '#115E59',
    900: '#134E4A',
    950: '#042F2E',
  },
  Cyan: {
    50: '#ECFEFF',
    100: '#CFFAFE',
    200: '#A5F3FC',
    300: '#67E8F9',
    400: '#22D3EE',
    500: '#06B6D4',
    600: '#0891B2',
    700: '#0E7490',
    800: '#155E75',
    900: '#164E63',
    950: '#083344',
  },
  Sky: {
    50: '#F0F9FF',
    100: '#E0F2FE',
    200: '#BAE6FD',
    300: '#7DD3FC',
    400: '#38BDF8',
    500: '#0EA5E9',
    600: '#0284C7',
    700: '#0369A1',
    800: '#075985',
    900: '#0C4A6E',
    950: '#082F49',
  },
  Blue: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
    950: '#172554',
  },
  Indigo: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1',
    600: '#4F46E5',
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
    950: '#1E1B4B',
  },
  Violet: {
    50: '#F5F3FF',
    100: '#EDE9FE',
    200: '#DDD6FE',
    300: '#C4B5FD',
    400: '#A78BFA',
    500: '#8B5CF6',
    600: '#7C3AED',
    700: '#6D28D9',
    800: '#5B21B6',
    900: '#4C1D95',
    950: '#2E1065',
  },
  Purple: {
    50: '#FAF5FF',
    100: '#F3E8FF',
    200: '#E9D5FF',
    300: '#D8B4FE',
    400: '#C084FC',
    500: '#A855F7',
    600: '#9333EA',
    700: '#7E22CE',
    800: '#6B21A8',
    900: '#581C87',
    950: '#3B0764',
  },
  Fuchsia: {
    50: '#FDF4FF',
    100: '#FAE8FF',
    200: '#F5D0FE',
    300: '#F0ABFC',
    400: '#E879F9',
    500: '#D946EF',
    600: '#C026D3',
    700: '#A21CAF',
    800: '#86198F',
    900: '#701A75',
    950: '#4A044E',
  },
  Pink: {
    50: '#FDF2F8',
    100: '#FCE7F3',
    200: '#FBCFE8',
    300: '#F9A8D4',
    400: '#F472B6',
    500: '#EC4899',
    600: '#DB2777',
    700: '#BE185D',
    800: '#9D174D',
    900: '#831843',
    950: '#500724',
  },
  Rose: {
    50: '#FFF1F2',
    100: '#FFE4E6',
    200: '#FECDD3',
    300: '#FDA4AF',
    400: '#FB7185',
    500: '#F43F5E',
    600: '#E11D48',
    700: '#BE123C',
    800: '#9F1239',
    900: '#881337',
    950: '#4C0519',
  },
};

type FormatType = 'hex' | 'hashHex' | 'rgb' | 'hsl' | 'oklch';

export const TailwindColor: React.FC<TailwindColorProps> = ({ onColorChange }) => {
  const [format, setFormat] = React.useState<FormatType>('hashHex');

  const copyToClipboard = async (color: string) => {
    try {
      await navigator.clipboard.writeText(color);
      toast.success(`已复制 ${color}`);

      // 如果是HEX格式，同时更新主颜色选择器
      if ((format === 'hex' || format === 'hashHex') && color.startsWith('#')) {
        const hexWithoutHash = color.replace('#', '');
        onColorChange(hexWithoutHash + 'ff'); // 添加不透明度
      }
    } catch (error) {
      toast.error('复制失败');
    }
  };

  const formatColor = (hex: string, formatType: FormatType): string => {
    switch (formatType) {
      case 'hex':
        return hex.replace('#', '');
      case 'hashHex':
        return hex;
      case 'rgb': {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgb(${r}, ${g}, ${b})`;
      }
      case 'hsl': {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0, s = 0; const l = (max + min) / 2;

        if (max !== min) {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

          switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
          }
        }

        return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
      }
      case 'oklch': {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        const rgba = { r, g, b, a: 255 };
        const oklch = rgbaToOklch(rgba);
        return formatOklch(oklch);
      }
      default:
        return hex;
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* 格式选择器 */}
      <div className="flex items-center justify-center gap-3">
        <span className="text-sm font-medium text-muted-foreground">格式</span>
        <div className="inline-flex items-center rounded-full border bg-background p-0.5">
          {(['hex', 'hashHex', 'rgb', 'hsl', 'oklch'] as FormatType[]).map((formatType) => {
            const labels = {
              'hex': 'HEX',
              'hashHex': '#HEX',
              'rgb': 'RGB',
              'hsl': 'HSL',
              'oklch': 'OKLCH'
            };
            return (
              <button
                key={formatType}
                onClick={() => setFormat(formatType)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                  format === formatType
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {labels[formatType]}
              </button>
            );
          })}
        </div>
      </div>

      {/* 颜色色条列表 */}
      <div className="space-y-4">
        {Object.entries(tailwindColors).map(([colorName, colorShades]) => (
          <div key={colorName} className="group flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
            {/* 颜色名称 */}
            <div className="sm:w-20 sm:text-right shrink-0">
              <span className="text-sm font-semibold text-foreground">{colorName}</span>
            </div>
            {/* 色条 */}
            <div className="w-full sm:flex-1 grid grid-cols-6 sm:flex sm:flex-nowrap rounded-xl overflow-visible cursor-pointer">
              {Object.entries(colorShades).map(([shade, hex]) => {
                const formattedColor = formatColor(hex, format);
                const isFirst = shade === '50';
                const isLast = shade === '950';
                return (
                  <div
                    key={shade}
                    className="h-8 sm:h-10 sm:flex-1 relative group/color"
                    style={{ backgroundColor: hex }}
                    onClick={() => copyToClipboard(formattedColor)}
                    title={`${colorName} ${shade}: ${formattedColor}`}
                  >
                    {/* 第一个色块带左边圆角 */}
                    {isFirst && <div className="absolute inset-y-0 left-0 w-2 rounded-l-xl pointer-events-none" style={{ backgroundColor: hex }} />}
                    {/* 最后一个色块带右边圆角 */}
                    {isLast && <div className="absolute inset-y-0 right-0 w-2 rounded-r-xl pointer-events-none" style={{ backgroundColor: hex }} />}
                    {/* 悬停放大效果 */}
                    <div
                      className="absolute inset-0 transition-transform duration-200 ease-out group-hover/color:scale-125 group-hover/color:z-10 cursor-pointer"
                      style={{ backgroundColor: hex }}
                    >
                      {/* 悬停显示色阶标签 */}
                      <span className="absolute inset-0 flex items-center justify-center text-xs sm:text-sm font-bold opacity-0 group-hover/color:opacity-100 transition-opacity duration-200"
                        style={{ color: parseInt(shade) >= 400 ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.7)' }}
                      >
                        {shade}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 提示 */}
      <div className="text-center text-xs text-muted-foreground/60 pt-4">
        点击色块复制到剪贴板 · HEX 格式会同步更新主颜色选择器
      </div>
    </div>
  );
};

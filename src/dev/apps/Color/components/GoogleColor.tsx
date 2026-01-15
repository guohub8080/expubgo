import * as React from 'react';
import toast from 'react-hot-toast';
import { rgbaToOklch, formatOklch } from '../utils/color';

interface GoogleColorProps {
  onColorChange: (hex: string) => void;
}

// Material Design颜色数据
const materialColors = {
  Red: {
    50: '#FFEBEE',
    100: '#FFCDD2',
    200: '#EF9A9A',
    300: '#E57373',
    400: '#EF5350',
    500: '#F44336',
    600: '#E53935',
    700: '#D32F2F',
    800: '#C62828',
    900: '#B71C1C',
  },
  Pink: {
    50: '#FCE4EC',
    100: '#F8BBD0',
    200: '#F48FB1',
    300: '#F06292',
    400: '#EC407A',
    500: '#E91E63',
    600: '#D81B60',
    700: '#C2185B',
    800: '#AD1457',
    900: '#880E4F',
  },
  Purple: {
    50: '#F3E5F5',
    100: '#E1BEE7',
    200: '#CE93D8',
    300: '#BA68C8',
    400: '#AB47BC',
    500: '#9C27B0',
    600: '#8E24AA',
    700: '#7B1FA2',
    800: '#6A1B9A',
    900: '#4A148C',
  },
  'Deep Purple': {
    50: '#EDE7F6',
    100: '#D1C4E9',
    200: '#B39DDB',
    300: '#9575CD',
    400: '#7E57C2',
    500: '#673AB7',
    600: '#5E35B1',
    700: '#512DA8',
    800: '#4527A0',
    900: '#311B92',
  },
  Indigo: {
    50: '#E8EAF6',
    100: '#C5CAE9',
    200: '#9FA8DA',
    300: '#7986CB',
    400: '#5C6BC0',
    500: '#3F51B5',
    600: '#3949AB',
    700: '#303F9F',
    800: '#283593',
    900: '#1A237E',
  },
  Blue: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    200: '#90CAF9',
    300: '#64B5F6',
    400: '#42A5F5',
    500: '#2196F3',
    600: '#1E88E5',
    700: '#1976D2',
    800: '#1565C0',
    900: '#0D47A1',
  },
  'Light Blue': {
    50: '#E1F5FE',
    100: '#B3E5FC',
    200: '#81D4FA',
    300: '#4FC3F7',
    400: '#29B6F6',
    500: '#03A9F4',
    600: '#039BE5',
    700: '#0288D1',
    800: '#0277BD',
    900: '#01579B',
  },
  Cyan: {
    50: '#E0F7FA',
    100: '#B2EBF2',
    200: '#80DEEA',
    300: '#4DD0E1',
    400: '#26C6DA',
    500: '#00BCD4',
    600: '#00ACC1',
    700: '#0097A7',
    800: '#00838F',
    900: '#006064',
  },
  Teal: {
    50: '#E0F2F1',
    100: '#B2DFDB',
    200: '#80CBC4',
    300: '#4DB6AC',
    400: '#26A69A',
    500: '#009688',
    600: '#00897B',
    700: '#00796B',
    800: '#00695C',
    900: '#004D40',
  },
  Green: {
    50: '#E8F5E9',
    100: '#C8E6C9',
    200: '#A5D6A7',
    300: '#81C784',
    400: '#66BB6A',
    500: '#4CAF50',
    600: '#43A047',
    700: '#388E3C',
    800: '#2E7D32',
    900: '#1B5E20',
  },
  'Light Green': {
    50: '#F1F8E9',
    100: '#DCEDC8',
    200: '#C5E1A5',
    300: '#AED581',
    400: '#9CCC65',
    500: '#8BC34A',
    600: '#7CB342',
    700: '#689F38',
    800: '#558B2F',
    900: '#33691E',
  },
  Lime: {
    50: '#F9FBE7',
    100: '#F0F4C3',
    200: '#E6EE9C',
    300: '#DCE775',
    400: '#D4E157',
    500: '#CDDC39',
    600: '#C0CA33',
    700: '#AFB42B',
    800: '#9E9D24',
    900: '#827717',
  },
  Yellow: {
    50: '#FFFDE7',
    100: '#FFF9C4',
    200: '#FFF59D',
    300: '#FFF176',
    400: '#FFEE58',
    500: '#FFEB3B',
    600: '#FDD835',
    700: '#FBC02D',
    800: '#F9A825',
    900: '#F57F17',
  },
  Amber: {
    50: '#FFF8E1',
    100: '#FFECB3',
    200: '#FFE082',
    300: '#FFD54F',
    400: '#FFCA28',
    500: '#FFC107',
    600: '#FFB300',
    700: '#FFA000',
    800: '#FF8F00',
    900: '#FF6F00',
  },
  Orange: {
    50: '#FFF3E0',
    100: '#FFE0B2',
    200: '#FFCC80',
    300: '#FFB74D',
    400: '#FFA726',
    500: '#FF9800',
    600: '#FB8C00',
    700: '#F57C00',
    800: '#EF6C00',
    900: '#E65100',
  },
  'Deep Orange': {
    50: '#FBE9E7',
    100: '#FFCCBC',
    200: '#FFAB91',
    300: '#FF8A65',
    400: '#FF7043',
    500: '#FF5722',
    600: '#F4511E',
    700: '#E64A19',
    800: '#D84315',
    900: '#BF360C',
  },
  Brown: {
    50: '#EFEBE9',
    100: '#D7CCC8',
    200: '#BCAAA4',
    300: '#A1887F',
    400: '#8D6E63',
    500: '#795548',
    600: '#6D4C41',
    700: '#5D4037',
    800: '#4E342E',
    900: '#3E2723',
  },
  Grey: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  'Blue Grey': {
    50: '#ECEFF1',
    100: '#CFD8DC',
    200: '#B0BEC5',
    300: '#90A4AE',
    400: '#78909C',
    500: '#607D8B',
    600: '#546E7A',
    700: '#455A64',
    800: '#37474F',
    900: '#263238',
  },
};

type FormatType = 'hex' | 'hashHex' | 'rgb' | 'hsl' | 'oklch';

export const GoogleColor: React.FC<GoogleColorProps> = ({ onColorChange }) => {
  const [format, setFormat] = React.useState<FormatType>('hashHex');

  const copyToClipboard = async (color: string, hex: string) => {
    try {
      await navigator.clipboard.writeText(color);
      toast.success(`已复制 ${color}`);

      // 如果是HEX格式，同时更新主颜色选择器
      if ((format === 'hex' || format === 'hashHex') && hex.startsWith('#')) {
        const hexWithoutHash = hex.replace('#', '');
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
        {Object.entries(materialColors).map(([colorName, colorShades]) => (
          <div key={colorName} className="group flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
            {/* 颜色名称 */}
            <div className="sm:w-24 sm:text-right shrink-0">
              <span className="text-sm font-semibold text-foreground">{colorName}</span>
            </div>
            {/* 色条 */}
            <div className="w-full sm:flex-1 grid grid-cols-5 sm:flex sm:flex-nowrap rounded-xl overflow-visible cursor-pointer">
              {Object.entries(colorShades).map(([shade, hex], index, arr) => {
                const formattedColor = formatColor(hex, format);
                const isFirst = index === 0;
                const isLast = index === arr.length - 1;
                return (
                  <div
                    key={shade}
                    className="h-8 sm:h-10 sm:flex-1 relative group/color"
                    style={{ backgroundColor: hex }}
                    onClick={() => copyToClipboard(formattedColor, hex)}
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

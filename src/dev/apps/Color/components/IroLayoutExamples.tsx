import * as React from 'react';
import iro from '@jaames/iro';
import { Pipette } from 'lucide-react';
import { parseHexColor, toHex } from '../utils/color';
import { RgbSliders } from './RgbSliders';
import { HslSliders } from './HslSliders';
import { OklchSliders } from './OklchSliders';
import { LabSliders } from './LabSliders';
import { KelvinSlider } from './KelvinSlider';
import { IntensitySlider } from './IntensitySlider';
import { CopyButton } from './CopyButton';
import { Switch } from "@shadcn/components/ui/switch";
import toast from 'react-hot-toast';

interface IroLayoutExamplesProps {
  /**
   * 当前颜色（十六进制字符串，不包含#号）
   */
  hex: string;
  /**
   * 颜色变化回调
   */
  onColorChange: (hex: string) => void;
  /**
   * 是否显示透明度控制
   */
  enableAlpha?: boolean;
  /**
   * 透明度启用状态变化回调
   */
  onEnableAlphaChange?: (enabled: boolean) => void;
  /**
   * 透明度变化回调
   */
  onAlphaChange?: (alpha: number) => void;
  /**
   * 当前透明度值 (0-1)
   */
  alpha?: number;
  /**
   * 取色功能回调
   */
  handlePickWithEyedropper?: () => void;
  /**
   * 万能输入功能回调
   */
  handlePickWithInput?: (input: string) => void;
  /**
   * 识别万能输入回调
   */
  recognizeUniversalInput?: () => void;
  /**
   * 万能输入框值
   */
  universalInput?: string;
  /**
   * 设置万能输入框值
   */
  setUniversalInput?: (value: string) => void;
}
type LayoutType = 'default' | 'box' | 'sliders' | 'circle';
export const IroLayoutExamples: React.FC<IroLayoutExamplesProps> = ({
  hex,
  onColorChange,
  enableAlpha = false,
  onEnableAlphaChange,
  onAlphaChange,
  alpha = 1,
  handlePickWithEyedropper,
  handlePickWithInput,
  recognizeUniversalInput,
  universalInput,
  setUniversalInput
}) => {
  const pickerRefs = React.useRef<Record<LayoutType, HTMLDivElement | null>>({
    default: null,
    box: null,
    sliders: null,
    circle: null,
  });

  const colorPickerRefs = React.useRef<Record<LayoutType, any>>({
    default: null,
    box: null,
    sliders: null,
    circle: null,
  });

  const [isInitialized, setIsInitialized] = React.useState<Record<LayoutType, boolean>>({
    default: false,
    box: false,
    sliders: false,
    circle: false,
  });
  // 初始化所有取色器
  React.useEffect(() => {
    const layouts: LayoutType[] = ['default', 'box', 'sliders', 'circle'];
    layouts.forEach((layout) => {
      const container = pickerRefs.current[layout];
      if (container && !colorPickerRefs.current[layout]) {
        try {
          const rgba = parseHexColor(hex);
          const initialColor = rgba ? `#${rgba.r.toString(16).padStart(2, '0')}${rgba.g.toString(16).padStart(2, '0')}${rgba.b.toString(16).padStart(2, '0')}` : '#ff0000';
          let config: any = {
            width: 250,
            color: initialColor,
            borderWidth: 1,
            borderColor: '#fff',
            padding: 5
          };
          // 根据布局类型设置不同的配置
          switch (layout) {
            case 'default':
              // 只有轮盘，去掉下面的滑块，并调整大小
              config.width = 300;  // 增大尺寸
              config.padding = 2;  // 减少内边距
              config.layout = [
                {
                  component: iro.ui.Wheel,
                }
              ];
              break;
            case 'box':
              // 只有方形，去掉下面的滑块，调整大小和位置
              config.width = 280;  // 增大尺寸
              config.padding = 3;  // 减少内边距，让方形偏下
              config.layout = [
                {
                  component: iro.ui.Box,
                }
              ];
              break;

            case 'sliders':
              // 全是滑块
              config.layout = [
                {
                  component: iro.ui.Slider,
                  options: {
                    sliderType: 'hue'
                  }
                },
                {
                  component: iro.ui.Slider,
                  options: {
                    sliderType: 'saturation'
                  }
                },
                {
                  component: iro.ui.Slider,
                  options: {
                    sliderType: 'value'
                  }
                },
                {
                  component: iro.ui.Slider,
                  options: {
                    sliderType: 'alpha'
                  }
                },
              ];
              break;

            case 'circle':
              // 圆形滑块
              config.layoutDirection = 'horizontal';
              config.layout = [
                {
                  component: iro.ui.Slider,
                  options: {
                    sliderType: 'value',
                    sliderShape: 'circle'
                  }
                },
              ];
              break;
          }

          // 添加透明度支持
          if (enableAlpha) {
            config.transparency = true;
          }

          // 创建取色器实例
          colorPickerRefs.current[layout] = new iro.ColorPicker(container, config);

          // 监听颜色变化事件
          colorPickerRefs.current[layout].on('color:change', (color: any) => {
            try {
              const rgb = color.rgb || color;
              const rgba = {
                r: rgb.r || 0,
                g: rgb.g || 0,
                b: rgb.b || 0,
                a: Math.round((color.alpha || 1) * 255)
              };
              const newHex = toHex(rgba, true).replace(/^#/, '');
              onColorChange(newHex);

              // 如果启用了透明度控制，同时回调透明度变化
              if (enableAlpha && onAlphaChange) {
                const newAlpha = color.alpha || 1;
                onAlphaChange(newAlpha);
              }
            } catch (error) {
              console.error(`Error in ${layout} color change handler:`, error);
            }
          });

          // 更新初始化状态
          setIsInitialized(prev => ({ ...prev, [layout]: true }));
        } catch (error) {
          console.error(`Error creating ${layout} layout picker:`, error);
        }
      }
    });

    
    // 清理函数
    return () => {
      const layouts: LayoutType[] = ['default', 'box', 'sliders', 'circle'];

      layouts.forEach((layout) => {
        if (colorPickerRefs.current[layout]) {
          try {
            if (colorPickerRefs.current[layout].destroy && typeof colorPickerRefs.current[layout].destroy === 'function') {
              colorPickerRefs.current[layout].destroy();
            }
          } catch (e) {
            console.warn(`${layout} layout picker cleanup completed with warning:`, e);
          }
          colorPickerRefs.current[layout] = null;
          setIsInitialized(prev => ({ ...prev, [layout]: false }));
        }
      });

      // 清理alpha滑块
      if (colorPickerRefs.current.alpha && colorPickerRefs.current.alpha.destroy) {
        try {
          colorPickerRefs.current.alpha.destroy();
        } catch (e) {
          console.warn('Alpha slider cleanup completed with warning:', e);
        }
        colorPickerRefs.current.alpha = null;
      }
    };
  }, []);

  // 更新alpha滑块状态
  React.useEffect(() => {
    if (colorPickerRefs.current.alpha && colorPickerRefs.current.alpha.set) {
      colorPickerRefs.current.alpha.set({
        transparency: enableAlpha,
        alpha: alpha
      });
    }
  }, [enableAlpha, alpha]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* 颜色预览卡片 - 重新设计布局 */}
      <div
        className="color-picker-card rounded-xl border bg-card p-0 overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg flex flex-col"
        onClick={async () => {
          try {
            const hexValue = `#${enableAlpha ? hex.toUpperCase() : hex.slice(0, 6).toUpperCase()}`;
            await navigator.clipboard.writeText(hexValue);
            toast.success(`已复制 ${hexValue}`);
          } catch (error) {
            console.error('复制失败:', error);
            toast.error('复制失败');
          }
        }}
      >
        <div className="h-48 relative">
          {/* 色块层 - 最上方 */}
          <div className="absolute inset-x-0 top-0 h-34 relative">
            {/* 棋盘背景 - 仅在启用透明度时显示 */}
            {enableAlpha && (
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(135deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(135deg, transparent 75%, #ccc 75%)',
                  backgroundSize: '16px 16px',
                  backgroundPosition: '0 0, 8px 0, 8px -8px, 0px 8px',
                  backgroundColor: '#fff'
                }}
              />
            )}
            {/* 颜色层 */}
            <div
              className="absolute inset-0"
              style={{
                background: enableAlpha
                  ? `rgba(${parseInt(hex.slice(0, 2), 16)}, ${parseInt(hex.slice(2, 4), 16)}, ${parseInt(hex.slice(4, 6), 16)}, ${alpha})`
                  : `#${hex}`
              }}
              title="点击复制颜色"
            />
          </div>

          {/* 底部信息层 */}
          <div className="absolute inset-x-0 bottom-0 h-14 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center px-3">
            {/* 左下角：HEX颜色代码 */}
            <div className="flex-1 flex justify-start">
              <span
                className="text-3xl font-mono font-bold text-gray-900 dark:text-white select-none"
                style={{ fontFamily: 'misans' }}
              >
                #{enableAlpha ? hex.toUpperCase() : hex.slice(0, 6).toUpperCase()}
              </span>
            </div>

            {/* 右下角：HEX按钮 - 阻止点击冒泡 */}
            <div
              className="ml-2"
              onClick={(e) => e.stopPropagation()}
            >
              <CopyButton value={enableAlpha ? hex.toUpperCase() : hex.slice(0, 6).toUpperCase()}>
                HEX
              </CopyButton>
            </div>
          </div>
        </div>
      </div>

      {/* 颜色工具卡片 */}
      <div className="color-picker-card rounded-xl border bg-card p-4 h-48 flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-base font-semibold text-foreground">获取颜色</h3>
          {/* 取色按钮 */}
          <button
            onClick={handlePickWithEyedropper}
            className="p-3 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors cursor-pointer"
            title="使用浏览器取色器"
          >
            <Pipette size={18} />
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  value={universalInput}
                  onChange={(e) => setUniversalInput?.(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && universalInput?.trim()) {
                      recognizeUniversalInput?.();
                      setUniversalInput?.('');
                    }
                  }}
                  placeholder="HEX, RGB, HSL, 颜色名称..."
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 pr-8"
                />
                {universalInput && (
                  <button
                    onClick={() => setUniversalInput?.('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
                    title="清空"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                )}
              </div>
              <div className="flex items-center justify-end">
                <button
                  onClick={() => {
                    if (universalInput?.trim()) {
                      recognizeUniversalInput?.();
                      setUniversalInput?.('');
                    }
                  }}
                  disabled={!universalInput?.trim()}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 cursor-pointer"
                >
                  识别颜色
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 透明度滑块卡片 */}
      <div className="color-picker-card rounded-xl border bg-card p-4 flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-base font-semibold text-foreground">
            {enableAlpha ? "包含透明度" : "不包含透明度"}
          </h3>
          <Switch
            checked={enableAlpha}
            onCheckedChange={onEnableAlphaChange}
            className="scale-90"
          />
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Alpha</span>
                <div className="flex items-center gap-2 transition-all duration-300 ease-in-out" style={{
                  opacity: enableAlpha ? 1 : 0,
                  transform: enableAlpha ? 'translateX(0)' : 'translateX(10px)',
                  visibility: enableAlpha ? 'visible' : 'hidden'
                }}>
                  <span className="text-sm font-mono text-white bg-gray-600 px-2 py-1 rounded" style={{ fontFamily: 'var(--guohub-theme-font-family)' }}>
                    {Math.round(alpha * 100)}%
                  </span>
                </div>
              </div>
              <div className="relative px-2 flex items-center">
                {/* 透明度滑块容器 */}
                <div className="rounded-full relative h-8 w-full">
                {/* 棋盘背景层 - 带动画显示隐藏 */}
                <div
                  className="rounded-full absolute inset-0 z-0 transition-opacity duration-300 ease-in-out"
                  style={{
                    pointerEvents: 'none',
                    opacity: enableAlpha ? 1 : 0,
                    backgroundImage:
                      'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(135deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(135deg, transparent 75%, #ccc 75%)',
                    backgroundSize: '10px 10px',
                    backgroundPosition: '0 0, 5px 0, 5px -5px, 0px 5px',
                    backgroundColor: '#fff'
                  }}
                />

                {/* 颜色渐变层 - 带动画显示隐藏 */}
                <div
                  className="rounded-full absolute inset-0 z-0 transition-opacity duration-300 ease-in-out"
                  style={{
                    pointerEvents: 'none',
                    opacity: enableAlpha ? 1 : 0,
                    background: `linear-gradient(to right,
                      rgba(${parseInt(hex.slice(0, 2), 16)}, ${parseInt(hex.slice(2, 4), 16)}, ${parseInt(hex.slice(4, 6), 16)}, 0),
                      rgba(${parseInt(hex.slice(0, 2), 16)}, ${parseInt(hex.slice(2, 4), 16)}, ${parseInt(hex.slice(4, 6), 16)}, 1))`
                  }}
                />

                {/* 禁用时的灰色背景 - 带动画显示隐藏 */}
                <div
                  className="rounded-full absolute inset-0 z-0 transition-opacity duration-300 ease-in-out"
                  style={{
                    pointerEvents: 'none',
                    opacity: enableAlpha ? 0 : 1,
                    backgroundColor: '#9ca3af'
                  }}
                />

                {/* 滑块 input */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={alpha * 100}
                  onChange={(e) => {
                    const newAlpha = parseInt(e.target.value) / 100;
                    onAlphaChange?.(newAlpha);
                  }}
                  disabled={!enableAlpha}
                  className="slider-rounded w-full h-8 appearance-none cursor-pointer absolute inset-0 z-10"
                  style={{
                    background: 'transparent',
                    // 当透明度关闭时隐藏滑块圆圈，带动画效果
                    opacity: enableAlpha ? 1 : 0,
                    pointerEvents: enableAlpha ? 'auto' : 'none',
                    transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
                    transform: enableAlpha ? 'scale(1)' : 'scale(0.8)'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* RGB 滑块 */}
      <RgbSliders
        hex={hex}
        onColorChange={onColorChange}
        enableAlpha={enableAlpha}
        onAlphaChange={onAlphaChange}
        alpha={alpha}
      />

      {/* HSL 滑块 */}
      <HslSliders
        hex={hex}
        onColorChange={onColorChange}
        enableAlpha={enableAlpha}
        onAlphaChange={onAlphaChange}
        alpha={alpha}
      />

      {/* OKLCH 滑块 */}
      <OklchSliders
        hex={hex}
        onColorChange={onColorChange}
        enableAlpha={enableAlpha}
        onAlphaChange={onAlphaChange}
        alpha={alpha}
      />

      {/* LAB 滑块 */}
      <LabSliders
        hex={hex}
        onColorChange={onColorChange}
        enableAlpha={enableAlpha}
        onAlphaChange={onAlphaChange}
        alpha={alpha}
      />

      
      {/* 色调圆盘 */}
      <div className="color-picker-card rounded-xl border bg-card p-4 flex flex-col">
        <h3 className="text-base font-semibold text-foreground mb-3">圆形选择</h3>
        <div className="flex-1 flex items-center justify-center">
          <div ref={(el) => pickerRefs.current.default = el} />
        </div>
      </div>

      {/* 方形选择器 */}
      <div className="color-picker-card rounded-xl border bg-card p-4 flex flex-col">
        <h3 className="text-base font-semibold text-foreground mb-3">方形选择</h3>
        <div className="flex-1 flex items-center justify-center">
          <div ref={(el) => pickerRefs.current.box = el} />
        </div>
      </div>

      {/* 色温滑块 */}
      <KelvinSlider
        hex={hex}
        onColorChange={onColorChange}
        enableAlpha={enableAlpha}
        onAlphaChange={onAlphaChange}
        alpha={alpha}
      />

      {/* 强度滑块 */}
      <IntensitySlider
        hex={hex}
        onColorChange={onColorChange}
        enableAlpha={enableAlpha}
        onAlphaChange={onAlphaChange}
        alpha={alpha}
      />
    </div>
  );
};

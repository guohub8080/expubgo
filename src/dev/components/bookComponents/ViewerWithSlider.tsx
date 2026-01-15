import { ReactNode, useRef, useState, useEffect } from "react";
import { Slider } from "@shadcn/components/ui/slider";

/**
 * ViewerWithSlider - 带宽度滑块的组件查看器
 *
 * 用于包裹预览组件，底部提供滑块控制最大宽度，方便调整预览效果。
 */
interface ViewerWithSliderProps {
  children: ReactNode;
  initialWidth?: number;
}

const ViewerWithSlider = (props: ViewerWithSliderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [maxWidth, setMaxWidth] = useState(650);
  const [currentWidth, setCurrentWidth] = useState(650);

  // 获取容器实际最大宽度，随窗口大小变化重新计算
  useEffect(() => {
    const updateMaxWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setMaxWidth(width);
        // 确保当前宽度不超过新的最大宽度
        setCurrentWidth(prev => Math.min(prev, width));
      }
    };

    updateMaxWidth();

    // 监听窗口大小变化
    window.addEventListener('resize', updateMaxWidth);
    return () => window.removeEventListener('resize', updateMaxWidth);
  }, []);

  return (
    <div className="mb-8">
      <div ref={containerRef} className="flex flex-col items-center gap-4 w-full">
        {/* 预览区域 */}
        <div
          className="bg-white dark:bg-gray-800 mx-auto"
          style={{
            width: `${currentWidth}px`,
            maxWidth: "100%",
          }}
        >
          {props.children}
        </div>

        {/* 滑块控制 */}
        <div className="flex items-center gap-4 w-full max-w-2xl px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-full">
          <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
            {currentWidth}px
          </span>
          <Slider
            value={[currentWidth]}
            onValueChange={(values) => setCurrentWidth(values[0])}
            min={100}
            max={maxWidth}
            step={10}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
};

export default ViewerWithSlider;

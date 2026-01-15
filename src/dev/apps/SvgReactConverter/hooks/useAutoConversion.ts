import { useState, useCallback, useEffect, useRef } from 'react';

interface UseAutoConversionProps {
  settings: any;
  conversionMode: 'svg-to-react' | 'react-to-svg';
  svgInput: string;
  reactInput: string;
  onAutoConvert: () => void;
  dependencies: any[];
}

export const useAutoConversion = ({
  settings,
  conversionMode,
  svgInput,
  reactInput,
  onAutoConvert,
  dependencies,
}: UseAutoConversionProps) => {
  const [isAutoConverting, setIsAutoConverting] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerAutoConvert = useCallback(() => {
    // 检查是否应该触发自动转换
    const hasInput = conversionMode === 'svg-to-react' ? svgInput.trim() : reactInput.trim();

    if (hasInput && onAutoConvert) {
      setIsAutoConverting(true);

      // 使用防抖，避免设置频繁变化时触发过多转换
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        onAutoConvert();
        setIsAutoConverting(false);
      }, 300); // 300ms 防抖
    }
  }, [conversionMode, svgInput, reactInput, onAutoConvert]);

  // 监听设置变化，自动触发转换
  useEffect(() => {
    if (onAutoConvert) {
      triggerAutoConvert();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        setIsAutoConverting(false);
      }
    };
  }, [settings, conversionMode, triggerAutoConvert, ...dependencies]);

  // 手动触发自动转换
  const manualAutoConvert = useCallback(() => {
    triggerAutoConvert();
  }, [triggerAutoConvert]);

  return {
    isAutoConverting,
    triggerAutoConvert: manualAutoConvert,
  };
};
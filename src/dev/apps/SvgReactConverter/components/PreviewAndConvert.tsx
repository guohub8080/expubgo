import React, { useRef } from 'react';
import { Card, CardContent } from '@shadcn/components/ui/card.tsx';
import { Button } from '@shadcn/components/ui/button.tsx';
import { Play, RefreshCw, ArrowRight } from 'lucide-react';
import { useAtomValue, useSetAtom } from 'jotai';
import { svgInputAtom, convertingAtom, reactOutputAtom } from '../store/useConverterStore';
import { useSvgConversion } from '../hooks/useSvgConversion';

// 谷色系配色
const googleColors = {
  orange50: '#fff3e0',
  orange500: '#ff9800',
  orange800: '#e65100',
  blue50: '#e3f2fd',
  blue500: '#2196f3',
  blue800: '#1565c0',
};

interface PreviewAndConvertProps {
  onConversionComplete?: () => void;
}

const PreviewAndConvert: React.FC<PreviewAndConvertProps> = ({ onConversionComplete }) => {
  const svgInput = useAtomValue(svgInputAtom);
  const converting = useAtomValue(convertingAtom);
  const setReactOutput = useSetAtom(reactOutputAtom);
  const setConverting = useSetAtom(convertingAtom);

  const previewRef = useRef<HTMLDivElement>(null);
  const { convertSvgToReact } = useSvgConversion(svgInput);

  // 手动转换按钮点击处理
  const handleManualConvert = async () => {
    if (!svgInput.trim()) return;

    setConverting(true);
    try {
      const result = await convertSvgToReact();
      if (result) {
        // convertSvgToReact 内部已经根据 settings.prettier 进行格式化
        setReactOutput(result);
      }
      // 通知父组件转换完成
      if (onConversionComplete) {
        onConversionComplete();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      setReactOutput(`// 转换错误: ${errorMessage}`);
    } finally {
      setConverting(false);
    }
  };

  return (
    <Card className="bg-card text-card-foreground rounded-xl border py-0 shadow-sm h-[220px] flex flex-col gap-0 shrink-0">
      <CardContent className="space-y-2 p-3 flex-1 flex flex-col">
        {/* SVG预览区域 */}
        <div className="mb-2 w-full h-[150px] min-h-[150px] flex items-center justify-center border border-border bg-muted/20 p-2 rounded-lg shrink-0">
          {svgInput.trim() ? (
            <div
              ref={previewRef}
              className="w-full h-full flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:w-auto [&>svg]:h-auto"
              dangerouslySetInnerHTML={{ __html: svgInput }}
            />
          ) : (
            <div className="flex flex-col items-center text-muted-foreground">
              <svg className="w-12 h-12 mb-2 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <circle cx="12" cy="14" r="3" />
              </svg>
              <span className="text-sm">SVG 预览</span>
            </div>
          )}
        </div>

        {/* 转换方向和按钮 */}
        <div className="flex items-center justify-between gap-2">
          {/* 转换方向指示 */}
          <div className="flex items-center gap-1 bg-muted/30 rounded-lg px-2 py-1">
            <div className="px-2 py-1 rounded text-xs font-medium text-center transition-all duration-300 select-none hover:scale-105"
                 style={{
                   backgroundColor: googleColors.orange50,
                   color: googleColors.orange800,
                   border: `1px solid ${googleColors.orange500}`,
                 }}>
              SVG
            </div>
            <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <div className="px-2 py-1 rounded text-xs font-medium text-center transition-all duration-300 select-none hover:scale-105"
                 style={{
                   backgroundColor: googleColors.blue50,
                   color: googleColors.blue800,
                   border: `1px solid ${googleColors.blue500}`,
                 }}>
              React
            </div>
          </div>

          {/* 转换按钮 */}
          <Button
            onClick={handleManualConvert}
            disabled={!svgInput.trim() || converting}
            size="sm"
            className="flex-1 max-w-[100px]"
          >
            {converting ? (
              <>
                <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                转换中
              </>
            ) : (
              <>
                <Play className="w-3 h-3 mr-1" />
                转换
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PreviewAndConvert;

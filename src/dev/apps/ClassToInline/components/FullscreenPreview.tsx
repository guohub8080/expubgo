import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@shadcn/components/ui/card.tsx";
import { Button } from "@shadcn/components/ui/button.tsx";
import { Eye, Monitor, Smartphone, Tablet, X } from "lucide-react";
import { useClassToInlineStore } from "@apps/ClassToInline/store/useClassToInlineStore";
import { cn } from "@shadcn/lib/utils.ts";

interface FullscreenPreviewProps {
  onClose: () => void;
}

type DeviceSize = 'desktop' | 'laptop' | 'tablet' | 'mobile' | 'custom';

const DEVICE_WIDTHS: Record<DeviceSize, number> = {
  desktop: 1920,
  laptop: 1440,
  tablet: 768,
  mobile: 375,
  custom: 800
};

const FullscreenPreview: React.FC<FullscreenPreviewProps> = ({ onClose }) => {
  const { htmlInput, cssInput } = useClassToInlineStore();
  const [deviceSize, setDeviceSize] = useState<DeviceSize>('laptop');
  const [customWidth, setCustomWidth] = useState(800);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 计算当前宽度
  const currentWidth = deviceSize === 'custom' ? customWidth : DEVICE_WIDTHS[deviceSize];

  // 处理拖拽调整宽度
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const newWidth = Math.max(300, Math.min(e.clientX - rect.left, window.innerWidth - 100));
      setCustomWidth(newWidth);
      setDeviceSize('custom');
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const previewContent = htmlInput && cssInput ? (
    <>
      <style>{cssInput}</style>
      <div dangerouslySetInnerHTML={{ __html: htmlInput }} />
    </>
  ) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-[95vw] h-[95vh] flex flex-col gap-0 overflow-hidden">
        <CardHeader className="gap-0 border-b h-14 flex items-center shrink-0">
          <CardTitle className="text-base flex items-center justify-between w-full">
            <span className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              全屏预览
            </span>

            <div className="flex items-center gap-2">
              {/* 设备尺寸选择 */}
              <div className="flex items-center gap-1 bg-muted/30 rounded-lg p-1">
                <Button
                  variant={deviceSize === 'desktop' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setDeviceSize('desktop')}
                  className={cn(
                    "h-7 px-2",
                    deviceSize === 'desktop' ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  )}
                  title="桌面 (1920px)"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant={deviceSize === 'laptop' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setDeviceSize('laptop')}
                  className={cn(
                    "h-7 px-2",
                    deviceSize === 'laptop' ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  )}
                  title="笔记本 (1440px)"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant={deviceSize === 'tablet' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setDeviceSize('tablet')}
                  className={cn(
                    "h-7 px-2",
                    deviceSize === 'tablet' ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  )}
                  title="平板 (768px)"
                >
                  <Tablet className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant={deviceSize === 'mobile' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setDeviceSize('mobile')}
                  className={cn(
                    "h-7 px-2",
                    deviceSize === 'mobile' ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  )}
                  title="手机 (375px)"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </Button>
              </div>

              {/* 当前宽度显示 */}
              <span className="text-xs text-muted-foreground min-w-[60px]">
                {Math.round(currentWidth)}px
              </span>

              {/* 关闭按钮 */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 p-0 overflow-hidden bg-muted">
          <div
            ref={containerRef}
            className="w-full h-full overflow-auto flex justify-center p-8"
            style={{ alignItems: 'flex-start' }}
          >
            {/* 预览容器 */}
            <div
              className="bg-white shadow-lg relative"
              style={{
                width: `${currentWidth}px`,
                minHeight: '400px',
                transition: isDragging ? 'none' : 'width 0.2s ease'
              }}
            >
              {/* 右侧拖拽调整手柄 */}
              <div
                className="absolute top-0 right-0 w-1 h-full cursor-ew-resize hover:bg-primary/50 active:bg-primary"
                onMouseDown={() => setIsDragging(true)}
              />

              {/* 预览内容 */}
              <div className="p-4">
                {previewContent || (
                  <div className="flex items-center justify-center h-64 text-muted-foreground">
                    暂无内容
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FullscreenPreview;

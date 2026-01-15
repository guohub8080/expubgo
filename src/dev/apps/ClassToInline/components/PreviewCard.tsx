import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@shadcn/components/ui/card.tsx";
import { Button } from "@shadcn/components/ui/button.tsx";
import { Eye, Maximize2 } from "lucide-react";
import { useClassToInlineStore } from "@apps/ClassToInline/store/useClassToInlineStore";

interface PreviewCardProps {
  onOpenFullscreen: () => void;
}

const PreviewCard: React.FC<PreviewCardProps> = ({ onOpenFullscreen }) => {
  const { htmlInput, cssInput } = useClassToInlineStore();
  const [iframeRef, setIframeRef] = useState<HTMLIFrameElement | null>(null);

  // 当内容变化时，更新 iframe
  React.useEffect(() => {
    if (iframeRef && htmlInput && cssInput) {
      const doc = iframeRef.contentDocument;
      if (doc) {
        doc.open();
        doc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <style>${cssInput}</style>
              <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { padding: 16px; }
              </style>
            </head>
            <body>
              ${htmlInput}
            </body>
          </html>
        `);
        doc.close();
      }
    }
  }, [iframeRef, htmlInput, cssInput]);

  const combinedContent = htmlInput && cssInput ? (
    <iframe
      ref={setIframeRef}
      title="preview"
      className="w-full h-full border-0"
      sandbox="allow-same-origin"
    />
  ) : (
    <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
      <p>预览将显示在这里...</p>
    </div>
  );

  return (
    <Card className="h-full flex flex-col gap-0 pt-2 pb-0 overflow-hidden">
      <CardHeader className="gap-0 border-b h-14 flex items-center">
        <CardTitle className="text-base flex items-center justify-between w-full">
          <span className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            预览
          </span>

          {/* 全屏预览按钮 */}
          {htmlInput && cssInput && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenFullscreen}
              className="h-6 w-6 p-0"
              title="全屏预览"
            >
              <Maximize2 className="w-3 h-3" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden bg-white">
        <div className="w-full h-full overflow-auto p-4">
          {combinedContent}
        </div>
      </CardContent>
    </Card>
  );
};

export default PreviewCard;

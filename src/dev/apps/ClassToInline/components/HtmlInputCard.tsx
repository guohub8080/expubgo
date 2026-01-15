import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@shadcn/components/ui/card.tsx";
import { Button } from "@shadcn/components/ui/button.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@shadcn/components/ui/popover.tsx";
import { Upload, Trash2, Maximize2, Type, Code, Copy } from "lucide-react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from "@shadcn/lib/utils.ts";
import { useClassToInlineStore } from "@apps/ClassToInline/store/useClassToInlineStore";
import { formatXmlWithAttributeBreaks } from "@apps/SvgReactConverter/utils/formatCode";
import { toast } from 'react-hot-toast';

interface HtmlInputCardProps {
  onOpenFullscreen: (title: string, content: string, language: 'xml' | 'jsx') => void;
}

const HtmlInputCard: React.FC<HtmlInputCardProps> = ({ onOpenFullscreen }) => {
  const { htmlInput, setHtmlInput, setResultOutput } = useClassToInlineStore();
  const [highlight, setHighlight] = useState<boolean>(false);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  const [formattedCode, setFormattedCode] = useState<string>('');

  // 格式化代码
  useEffect(() => {
    if (highlight && htmlInput) {
      formatXmlWithAttributeBreaks(htmlInput).then(setFormattedCode);
    } else if (!htmlInput) {
      setFormattedCode('');
    }
  }, [highlight, htmlInput]);

  // 文件上传处理
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setHtmlInput(content);
      };
      reader.readAsText(file);
    }
  };

  // 清空输入
  const handleClearInput = () => {
    setHtmlInput('');
    setResultOutput('');
    setShowClearConfirm(false);
  };

  // 复制到剪贴板
  const handleCopy = async () => {
    if (!htmlInput) return;
    try {
      await navigator.clipboard.writeText(htmlInput);
      toast.success('HTML 已复制到剪贴板');
    } catch (error) {
      console.error('复制失败:', error);
      toast.error('复制失败，请手动复制');
    }
  };

  return (
    <Card className="h-full flex flex-col gap-0 pt-2 pb-0 overflow-hidden">
      <CardHeader className="gap-0 border-b h-14 flex items-center">
        <CardTitle className="text-base flex items-center justify-between w-full">
          <span>HTML 输入</span>

          {/* 中间：代码/文本切换tab */}
          <div className="flex items-center gap-1 bg-muted/30 rounded-lg p-1">
            <Button
              variant={!highlight ? "default" : "ghost"}
              size="sm"
              onClick={() => setHighlight(false)}
              className={cn(
                "h-6 w-6 p-0",
                !highlight ? "bg-primary text-primary-foreground hover:bg-primary/90" : "hover:bg-muted"
              )}
              title="文本模式"
            >
              <Type className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant={highlight ? "default" : "ghost"}
              size="sm"
              onClick={() => setHighlight(true)}
              className={cn(
                "h-6 w-6 p-0",
                highlight ? "bg-primary text-primary-foreground hover:bg-primary/90" : "hover:bg-muted"
              )}
              title="代码模式"
            >
              <Code className="w-3.5 h-3.5" />
            </Button>
          </div>

          <div className="flex items-center gap-1">
            {/* 复制按钮 */}
            {htmlInput && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-6 w-6 p-0"
                title="复制HTML"
              >
                <Copy className="w-3 h-3" />
              </Button>
            )}

            {/* 文件上传 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => document.getElementById('html-file-input')?.click()}
              className="h-6 w-6 p-0"
            >
              <Upload className="w-3 h-3" />
            </Button>
            <input
              id="html-file-input"
              type="file"
              accept=".html,.htm"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* 清空按钮 - hover 触发确认 */}
            {htmlInput && (
              <Popover open={showClearConfirm} onOpenChange={setShowClearConfirm}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onMouseEnter={() => setShowClearConfirm(true)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2" align="end">
                  <Button size="sm" variant="destructive" onClick={handleClearInput}>
                    清空内容
                  </Button>
                </PopoverContent>
              </Popover>
            )}

            {/* 全屏查看按钮 */}
            {htmlInput && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenFullscreen('HTML 输入', htmlInput, 'xml')}
                className="h-6 w-6 p-0"
                title="全屏查看"
              >
                <Maximize2 className="w-3 h-3" />
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0" style={{ backgroundColor: highlight ? '#1E1E1E' : 'transparent' }}>
        <div className="w-full h-full overflow-auto">
          {highlight ? (
            <SyntaxHighlighter
              language="html"
              style={vscDarkPlus}
              customStyle={{
                fontFamily: 'var(--guohub-code-font-family) !important',
                fontSize: '14px',
                backgroundColor: 'transparent',
                minHeight: '100%',
                margin: 0,
                padding: '12px',
                whiteSpace: 'pre',
                tabSize: 2,
              }}
              wrapLines={false}
              wrapLongLines={false}
              PreTag="div"
              CodeTag="code"
            >
              {formattedCode || htmlInput || '<!-- 粘贴HTML代码到这里 -->'}
            </SyntaxHighlighter>
          ) : (
            <textarea
              value={htmlInput}
              onChange={(e) => setHtmlInput(e.target.value)}
              placeholder="粘贴HTML代码到这里..."
              className="w-full h-full p-3 border-0 resize-none font-mono text-sm bg-transparent focus:outline-none"
              style={{
                fontFamily: 'var(--guohub-code-font-family)',
              }}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HtmlInputCard;

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@shadcn/components/ui/card.tsx";
import { Button } from "@shadcn/components/ui/button.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@shadcn/components/ui/popover.tsx";
import { Upload, Trash2, Maximize2, Type, Code } from "lucide-react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from "@shadcn/lib/utils.ts";
import { useAtomValue, useSetAtom } from 'jotai';
import { svgInputAtom, reactOutputAtom } from '../store/useConverterStore';
import { formatXmlWithAttributeBreaks } from '../utils/formatCode';

interface SvgInputEditorProps {
  onOpenFullscreen: (title: string, content: string, language: 'xml' | 'jsx') => void;
}

const SvgInputEditor: React.FC<SvgInputEditorProps> = ({ onOpenFullscreen }) => {
  const svgInput = useAtomValue(svgInputAtom);
  const setSvgInput = useSetAtom(svgInputAtom);
  const setReactOutput = useSetAtom(reactOutputAtom);

  const [highlight, setHighlight] = useState<boolean>(false);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  const [formattedCode, setFormattedCode] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragCounterRef = useRef<number>(0);

  // 格式化代码
  useEffect(() => {
    if (highlight && svgInput) {
      formatXmlWithAttributeBreaks(svgInput).then(setFormattedCode);
    } else if (!svgInput) {
      setFormattedCode('');
    }
  }, [highlight, svgInput]);

  // 文件上传处理
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setSvgInput(content);
      };
      reader.readAsText(file);
    }
  };

  // 处理文件读取
  const readFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setSvgInput(content);
    };
    reader.readAsText(file);
  };

  // 拖拽事件处理
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounterRef.current = 0;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      const fileName = file.name.toLowerCase();
      if (fileName.endsWith('.svg') || fileName.endsWith('.xml')) {
        readFile(file);
      } else {
        // 可选：显示错误提示
        console.warn('不支持的文件格式，请上传 .svg 或 .xml 文件');
      }
    }
  };

  // 清空输入
  const handleClearInput = () => {
    setSvgInput('');
    setReactOutput('');
    setShowClearConfirm(false);
  };

  return (
    <Card
      className="h-full flex flex-col gap-0 pt-2 pb-0 overflow-hidden relative transition-colors"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <CardHeader className="gap-0 border-b h-14 flex items-center">
        <CardTitle className="text-base flex items-center justify-between w-full">
          <span>SVG 输入</span>

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
            {/* 文件上传 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => document.getElementById('svg-file-input')?.click()}
              className="h-6 w-6 p-0"
            >
              <Upload className="w-3 h-3" />
            </Button>
            <input
              id="svg-file-input"
              type="file"
              accept=".svg,.xml"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* 清空按钮 - hover 触发确认 */}
            {svgInput && (
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
            {svgInput && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenFullscreen('SVG 输入', svgInput, 'xml')}
                className="h-6 w-6 p-0"
                title="全屏查看"
              >
                <Maximize2 className="w-3 h-3" />
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden" style={{ backgroundColor: highlight ? '#1E1E1E' : 'transparent' }}>
        <div className="w-full h-full relative overflow-auto">
          {highlight ? (
            <div className="w-full h-full">
              <SyntaxHighlighter
                language="xml"
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
                codeTagProps={{
                  style: {
                    fontFamily: 'var(--guohub-code-font-family) !important',
                  }
                }}
              >
                {formattedCode || svgInput || '<!-- 粘贴SVG代码到这里 -->'}
              </SyntaxHighlighter>
            </div>
          ) : (
            <textarea
              value={svgInput}
              onChange={(e) => setSvgInput(e.target.value)}
              placeholder="粘贴SVG代码到这里..."
              className="w-full h-full p-3 border-0 resize-none font-mono text-sm bg-transparent focus:outline-none"
              style={{
                fontFamily: 'var(--guohub-code-font-family)',
              }}
            />
          )}
          {/* 拖拽提示遮罩 */}
          {isDragging && (
            <div className="absolute inset-0 bg-primary/10 backdrop-blur-sm border-2 border-dashed border-primary rounded-lg flex items-center justify-center z-10">
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-8 h-8 text-primary" />
                <span className="text-sm font-medium text-primary">拖放 SVG 文件到这里</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SvgInputEditor;

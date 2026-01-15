import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@shadcn/components/ui/card.tsx";
import { Button } from "@shadcn/components/ui/button.tsx";
import { Code } from "lucide-react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from "@shadcn/lib/utils.ts";
import { formatReactWithAttributeBreaks } from '../utils/formatCode';

interface CodeEditorCardProps {
  title: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  language: 'xml' | 'jsx';
  highlight: boolean;
  onToggleHighlight?: () => void;
  toolbarButtons?: React.ReactNode;
  leftToolbarButtons?: React.ReactNode;
  showToggle?: boolean;
}

const CodeEditorCard: React.FC<CodeEditorCardProps> = ({
  title,
  value,
  onChange,
  readOnly = false,
  placeholder = '',
  language,
  highlight,
  onToggleHighlight,
  toolbarButtons,
  leftToolbarButtons,
  showToggle = true
}) => {
  const [formattedCode, setFormattedCode] = useState<string>('');

  // 格式化代码
  useEffect(() => {
    if (highlight && value) {
      // 如果是 XML（HTML），不需要格式化，直接使用原始值
      if (language === 'xml') {
        setFormattedCode(value);
      } else {
        // JSX 需要格式化
        formatReactWithAttributeBreaks(value).then(setFormattedCode);
      }
    }
  }, [highlight, value, language]);
  return (
    <Card className="h-full flex flex-col gap-0 pt-2 pb-0 overflow-hidden">
      <CardHeader className="gap-0 border-b h-14 flex items-center">
        <CardTitle className="text-base flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            {/* 左侧工具栏按钮 */}
            {leftToolbarButtons}
            <span>{title}</span>
          </div>
          <div className="flex items-center gap-1">
            {/* 语法高亮切换 - 可选显示 */}
            {showToggle && onToggleHighlight && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleHighlight}
                className={cn(
                  "h-6 w-6 p-0",
                  highlight ? "bg-muted" : ""
                )}
              >
                <Code className="w-3 h-3" />
              </Button>
            )}

            {/* 其他工具栏按钮 */}
            {toolbarButtons}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden" style={{ backgroundColor: highlight ? '#1E1E1E' : 'transparent' }}>
        <div className="w-full h-full overflow-auto">
          {highlight ? (
            <div className="w-full h-full">
              <SyntaxHighlighter
                language={language}
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
                {formattedCode || value || placeholder}
              </SyntaxHighlighter>
            </div>
          ) : (
            <textarea
              value={value}
              onChange={onChange ? (e) => onChange(e.target.value) : undefined}
              placeholder={placeholder}
              readOnly={readOnly}
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

export default CodeEditorCard;

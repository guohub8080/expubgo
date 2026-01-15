import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@shadcn/components/ui/card.tsx";
import { Button } from "@shadcn/components/ui/button.tsx";
import { Copy, Check } from "lucide-react";
import { useClassToInlineStore } from "@apps/ClassToInline/store/useClassToInlineStore";

interface ResultOutputCardProps {
  onOpenFullscreen: (title: string, content: string, language: 'xml' | 'jsx') => void;
  onConvert?: () => void;
  isConverting?: boolean;
  canConvert?: boolean;
}

const ResultOutputCard: React.FC<ResultOutputCardProps> = ({
  onOpenFullscreen,
  onConvert,
  isConverting = false,
  canConvert = true
}) => {
  const { htmlInput, cssInput } = useClassToInlineStore();
  const [copied, setCopied] = useState(false);

  // 生成单个 HTML 文件（包含 CSS）
  const generateSingleHTML = () => {
    if (!htmlInput || !cssInput) return '';

    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
${cssInput}
    </style>
</head>
<body>
${htmlInput}
</body>
</html>`;
  };

  // 复制单个 HTML 到剪贴板
  const copySingleHTML = async () => {
    const singleHTML = generateSingleHTML();
    if (!singleHTML) return;

    try {
      await navigator.clipboard.writeText(singleHTML);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // 2秒后恢复
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  // 链接列表
  const inlineTools = [
    { name: 'Mailchimp Inline CSS', url: 'https://templates.mailchimp.com/resources/inline-css/', description: 'Mailchimp CSS 转 inline 工具' },
    { name: 'Juice', url: 'https://automattic.github.io/juice/', description: 'JavaScript CSS 内联工具' },
    { name: 'HTML Email Inline', url: 'https://htmlemail.io/inline/', description: 'HTML Email inline 转换器' },
  ];

  const variableTools = [
    { name: 'CSS Variable Remover', url: 'https://midorikocak.github.io/css-variable-remover/', description: 'CSS 变量转静态值' },
    { name: 'CSS Variables', url: 'https://css-variables.github.io/', description: 'CSS 变量转换工具' },
    { name: 'PostCSS CSS Variables', url: 'https://madlittlemods.github.io/postcss-css-variables/playground/', description: 'PostCSS CSS 变量 playground' },
  ];

  return (
    <Card className="h-full flex flex-col gap-0 pt-2 pb-0 overflow-hidden">
      <CardHeader className="gap-0 border-b h-14 flex items-center">
        <CardTitle className="text-base">站外处理</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-4 overflow-auto">
        {/* 合并单HTML按钮 */}
        {htmlInput && cssInput && (
          <div className="mb-4">
            <Button
              variant="default"
              onClick={copySingleHTML}
              className="w-full justify-start"
              disabled={copied}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  已复制到剪贴板
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  复制合并 HTML + CSS 的单文件
                </>
              )}
            </Button>
          </div>
        )}

        {/* 说明文字 */}
        <p className="text-xs text-muted-foreground mb-4">
          受制于浏览器安全限制，请使用站外工具将 CSS class 转换为 inline style
        </p>

        {/* 可用工具链接 */}
        <div className="grid grid-cols-2 gap-4">
          {/* CSS Variable 工具 */}
          <div className="rounded-lg border bg-card p-4">
            <h4 className="text-sm font-semibold mb-3">
              CSS Variable → Static
            </h4>
            <div className="space-y-1">
              {variableTools.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors group"
                >
                  <span className="font-medium">{link.name}</span>
                  <svg className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Class to Inline 工具 */}
          <div className="rounded-lg border bg-card p-4">
            <h4 className="text-sm font-semibold mb-3">
              Class → Inline
            </h4>
            <div className="space-y-1">
              {inlineTools.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors group"
                >
                  <span className="font-medium">{link.name}</span>
                  <svg className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultOutputCard;

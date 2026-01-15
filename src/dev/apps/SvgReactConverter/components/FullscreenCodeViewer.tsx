import React, { useState, useEffect } from 'react';
import { Button } from "@shadcn/components/ui/button.tsx";
import { X, Copy } from "lucide-react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { toast } from 'react-hot-toast';
import { formatXmlWithAttributeBreaks, formatReactWithAttributeBreaks } from '../utils/formatCode';

interface FullscreenCodeViewerProps {
  content: string;
  title: string;
  language: 'xml' | 'jsx';
  onClose: () => void;
}

const FullscreenCodeViewer: React.FC<FullscreenCodeViewerProps> = ({
  content,
  title,
  language,
  onClose
}) => {
  const [formattedCode, setFormattedCode] = useState<string>('');

  // 格式化代码
  useEffect(() => {
    if (content) {
      // 对于 XML（HTML），跳过格式化以避免解析错误
      if (language === 'xml') {
        setFormattedCode(content);
      } else {
        formatReactWithAttributeBreaks(content).then(setFormattedCode);
      }
    }
  }, [content, language]);
  // 复制到剪贴板
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success('代码已复制到剪贴板');
    } catch (error) {
      console.error('复制失败:', error);
      toast.error('复制失败，请手动复制');
    }
  };

  // ESC键关闭
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* macOS风格的毛玻璃背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      </div>

      {/* 顶部操作栏 */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-black/60 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-4">
            <div className="px-4 py-1.5 bg-white/10 text-white rounded-full text-sm font-medium border border-white/20 backdrop-blur-sm">
              {title}
            </div>
            {content.trim() && (
              <div className="text-sm text-white/70">
                {content.split('\n').length} 行 · {content.length} 字符
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* 复制按钮 */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={!content.trim()}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm"
            >
              <Copy className="w-4 h-4 mr-2" />
              复制代码
            </Button>

            {/* 关闭按钮 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20 hover:text-white backdrop-blur-sm"
            >
              <X className="w-4 h-4 mr-2" />
              关闭（ESC）
            </Button>
          </div>
        </div>
      </div>

      {/* 代码显示区域 - macOS窗口风格 */}
      <div className="flex items-center justify-center h-screen pt-16">
        <div className="w-full max-w-7xl h-[calc(100vh-6rem)] px-8">
          <div className="w-full h-full bg-gray-900/95 backdrop-blur-sm rounded-t-lg border border-white/10 shadow-2xl overflow-hidden flex flex-col">
            {/* macOS窗口标题栏 */}
            <div className="h-8 bg-gray-800/90 backdrop-blur-sm border-b border-white/5 px-4 flex items-center">
              {/* macOS窗口控制按钮 - 纯装饰 */}
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>

              {/* 窗口标题居中显示 */}
              <div className="flex-1 text-center">
                <div className="text-xs text-gray-400 font-medium">
                  {title}
                </div>
              </div>

              {/* 占位空间，保持标题居中 */}
              <div className="w-16"></div>
            </div>

            {/* 代码内容区域 */}
            <div className="flex-1 overflow-auto">
              <SyntaxHighlighter
                language={language}
                style={vscDarkPlus}
                customStyle={{
                  fontFamily: 'var(--guohub-code-font-family) !important',
                  fontSize: '14px',
                  backgroundColor: 'transparent',
                  height: '100%',
                  margin: 0,
                  borderRadius: 0,
                  overflow: 'auto',
                  padding: '1.5rem 1.5rem 1.5rem 3.5rem',
                  whiteSpace: 'pre',
                  tabSize: 2,
                }}
                wrapLines={false}
                wrapLongLines={false}
                showLineNumbers={true}
                PreTag="div"
                CodeTag="code"
                codeTagProps={{
                  style: {
                    fontFamily: 'var(--guohub-code-font-family) !important',
                  }
                }}
              >
                {formattedCode || content || '// 暂无内容'}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullscreenCodeViewer;

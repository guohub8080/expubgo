/**
 * MDX 代码块组件
 * 使用 react-syntax-highlighter 提供语法高亮
 */

import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

import './Pre.css';

interface PreProps extends React.HTMLProps<HTMLPreElement> {
  children?: React.ReactNode;
}

const Pre: React.FC<PreProps> = ({ children }) => {
  const [copied, setCopied] = useState(false);

  // 检查 children 是否是我们的 code 组件
  let codeContent = '';
  let className = '';

  if (React.isValidElement(children) && children.props) {
    // 从 props 中提取代码内容和类名
    const props = children.props as any;
    codeContent = props.children?.toString() || '';
    className = props.className || '';

    // 从 className 中提取语言（如 "language-javascript"）
    const languageMatch = className.match(/language-(\w+)/);
    const language = languageMatch ? languageMatch[1] : 'text';

    // 复制到剪贴板
    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(codeContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    };

    // 语言映射
    const languageMap: Record<string, string> = {
      'javascript': 'javascript',
      'js': 'javascript',
      'typescript': 'typescript',
      'ts': 'typescript',
      'tsx': 'tsx', // ✅ 添加 TSX 支持
      'jsx': 'jsx', // ✅ 添加 JSX 支持
      'xml': 'xml',
      'html': 'xml',
      'svg': 'xml',
      'css': 'css',
      'json': 'json',
      'bash': 'bash',
      'shell': 'bash',
      'text': 'text',
      'plaintext': 'text',
    };

    const highlightLanguage = languageMap[language] || 'text';

    // 自定义主题样式 - 基于 vscDarkPlus
    const customTheme = {
      ...vscDarkPlus,
      'pre[class*="language-"]': {
        ...vscDarkPlus['pre[class*="language-"]'],
        background: '#1e1e1e',
        margin: 0,
        padding: '1rem',
        fontSize: '0.875rem',
        lineHeight: '1.625',
        fontFamily: 'var(--guohub-code-font-family)',
        borderRadius: 0,
      },
      'code[class*="language-"]': {
        ...vscDarkPlus['code[class*="language-"]'],
        fontFamily: 'var(--guohub-code-font-family)',
      },
    };

    return (
      <div className="mb-6 rounded-xl overflow-hidden border border-slate-700 shadow-lg">
        {/* 代码块 */}
        <div className="overflow-x-auto mdx-code-scroll">
          <SyntaxHighlighter
            language={highlightLanguage}
            style={customTheme}
            wrapLongLines={false}
            useInlineStyles={true}
          >
            {codeContent}
          </SyntaxHighlighter>
        </div>

        {/* 底部栏 */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-t border-slate-700">
          {/* 左侧：语言类型 */}
          <div className="text-xs text-slate-400 font-medium uppercase">
            {language}
          </div>

          {/* 右侧：复制按钮 */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1 text-xs text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 rounded transition-colors"
          >
            {copied ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>已复制</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>复制</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // 如果没有找到 code 元素，显示错误
  return (
    <div className="mb-6">
      <div className="bg-yellow-900/20 text-yellow-200 p-6 rounded-xl border border-yellow-700">
        <div className="font-bold mb-2">⚠️ 不支持的代码块格式</div>
        <div className="text-sm">children 不是有效的 React 元素</div>
      </div>
    </div>
  );
};

export default Pre;

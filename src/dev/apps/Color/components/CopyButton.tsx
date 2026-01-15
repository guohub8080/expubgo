import * as React from 'react';

interface CopyButtonProps {
  /**
   * 要复制的值
   */
  value: string;
  /**
   * 按钮文字
   */
  children: React.ReactNode;
  /**
   * 额外的CSS类名
   */
  className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ value, children, className = '' }) => {
  const [isCopying, setIsCopying] = React.useState(false);

  const handleCopy = async () => {
    if (isCopying) return; // 防止重复点击

    try {
      await navigator.clipboard.writeText(value);
      setIsCopying(true);
      setTimeout(() => setIsCopying(false), 1500);
    } catch (error) {
      console.error('复制失败:', error);
      // 可以在这里添加错误提示
    }
  };

  return (
    <button
      onClick={handleCopy}
      disabled={isCopying}
      className={`w-full py-2 px-4 text-sm font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-80 disabled:cursor-not-allowed border border-gray-300 ${
        isCopying
          ? 'bg-green-50 hover:bg-green-100 text-green-700'
          : 'bg-white hover:bg-gray-50 text-gray-900'
      } ${className}`}
      style={{ fontFamily: 'var(--guohub-theme-font-family)' }}
    >
      {isCopying ? (
        <>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>复制成功</span>
        </>
      ) : (
        <>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          {children}
        </>
      )}
    </button>
  );
};

export default CopyButton;
/**
 * MDX 行内代码组件
 * 支持深色模式适配
 */

import useGlobalSettings from '../../../../store/useGlobalSettings';
import React from 'react';

interface CodeProps extends React.HTMLProps<HTMLElement> {
  children?: React.ReactNode;
}

const Code: React.FC<CodeProps> = ({ children, ...props }) => {
  const { articleLineHeight } = useGlobalSettings();
  return (
    <code
      className="bg-pink-100 dark:bg-pink-950 dark:text-pink-300 mx-0.5 text-pink-600 px-1.5 rounded-sm !text-sm"
      style={{
        fontFamily: 'var(--guohub-code-font-family) !important',
        // 不用 inline-block：原子盒放不下时整块掉行，配合段落 justify 会把前一行
        // 拉出巨大字间距；inline 让代码随文字流折行。
        // break-all：代码标识符/路径无自然断点，行尾任意字符处可断（长单词不留行尾空隙）
        whiteSpace: 'break-spaces',
        wordBreak: 'break-all',
        lineHeight: `${articleLineHeight}px !important`,
      }}
      {...props}
    >
      {children}
    </code>
  );
};

export default Code;

import * as prettier from 'prettier';
// @ts-ignore - Prettier v3 的插件导入方式
import parserBabel from 'prettier/plugins/babel';
// @ts-ignore
import parserEstree from 'prettier/plugins/estree';
// @ts-ignore
import parserHtml from 'prettier/plugins/html';

/**
 * 格式化 XML/SVG 代码
 */
export async function formatXmlWithAttributeBreaks(code: string): Promise<string> {
  if (!code || !code.trim()) {
    return code;
  }

  try {
    const formatted = await prettier.format(code, {
      parser: 'html',
      plugins: [parserHtml],
      printWidth: 80,
      tabWidth: 2,
      useTabs: false,
      htmlWhitespaceSensitivity: 'ignore',
    });
    return formatted;
  } catch (error) {
    console.error('格式化 XML 失败:', error);
    return code;
  }
}

/**
 * 格式化 React/JSX 代码
 */
export async function formatReactWithAttributeBreaks(code: string): Promise<string> {
  if (!code || !code.trim()) {
    return code;
  }

  try {
    const formatted = await prettier.format(code, {
      parser: 'babel-ts',
      plugins: [parserBabel, parserEstree],
      printWidth: 80,
      tabWidth: 2,
      useTabs: false,
      semi: true,
      singleQuote: false,
      trailingComma: 'es5',
      bracketSpacing: false,  // 紧凑的大括号
      jsxBracketSameLine: false,
      arrowParens: 'always',
      jsxSingleQuote: false,
    });
    return formatted;
  } catch (error) {
    console.error('格式化 React 代码失败:', error);
    return code;
  }
}

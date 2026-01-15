import { useCallback } from 'react';
import { toast } from 'react-hot-toast';

export const useReactConversion = (reactInput: string) => {
  const convertReactToSvg = useCallback(async () => {
    if (!reactInput.trim()) return '';

    try {
      // 简单的React组件解析（实际项目中需要更复杂的AST解析）
      // 这里提供一个基础实现

      // 提取JSX中的svg部分
      const svgMatch = reactInput.match(/<svg[^>]*>[\s\S]*?<\/svg>/);
      if (!svgMatch) {
        throw new Error('未找到SVG元素，请确保React组件中包含SVG');
      }

      let svgContent = svgMatch[0];

      // 移除React特有的属性
      svgContent = svgContent.replace(/\s*\{[^}]*\}/g, '');
      svgContent = svgContent.replace(/\s*className=/g, ' class=');
      svgContent = svgContent.replace(/\s*style=\{\{[^}]*\}\}/g, '');

      // 清理多余的空格
      svgContent = svgContent.replace(/>\s+</g, '><');

      // 格式化SVG
      const formattedSvg = formatSvg(svgContent);

      return formattedSvg;
    } catch (error) {
      console.error('转换出错:', error);
      throw error;
    }
  }, [reactInput]);

  const formatSvg = (svg: string): string => {
    // 简单的SVG格式化
    let formatted = svg;

    // 添加适当的换行和缩进
    formatted = formatted.replace(/></g, '>\n<');
    formatted = formatted.replace(/(<\/svg>)/g, '\n$1');

    const lines = formatted.split('\n');
    let indentLevel = 0;
    const formattedLines: string[] = [];

    lines.forEach((line) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;

      if (trimmedLine.startsWith('</')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }

      formattedLines.push('  '.repeat(indentLevel) + trimmedLine);

      if (trimmedLine.startsWith('<') && !trimmedLine.includes('</') && !trimmedLine.includes('/>')) {
        indentLevel++;
      }
    });

    return formattedLines.join('\n');
  };

  return {
    convertReactToSvg,
  };
};
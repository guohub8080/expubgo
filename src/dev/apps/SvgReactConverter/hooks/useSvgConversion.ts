import { useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useAtomValue } from 'jotai';
import { settingsAtom } from '../store/useConverterStore';
import {
  convertCSSClassesToInlineStyles,
  convertStyleStringToObject,
  removeIdsFromSVG,
  removeClassesFromSVG,
  formatElementAttributes
} from '../utils/svgUtils';
import { formatReactWithAttributeBreaks } from '../utils/formatCode';

export const useSvgConversion = (svgInput: string) => {
  const settings = useAtomValue(settingsAtom);

  const convertSvgToReact = useCallback(async () => {
    if (!svgInput.trim()) return '';

    try {
      // 基础SVG处理
      let processedSvg = svgInput.trim();

      // 移除XML声明和DOCTYPE
      processedSvg = processedSvg.replace(/<\?xml[^>]*\?>/g, '');
      processedSvg = processedSvg.replace(/<!DOCTYPE[^>]*>/g, '');

      // 移除HTML注释
      processedSvg = processedSvg.replace(/<!--[\s\S]*?-->/g, '');

      // 移除所有空行
      processedSvg = processedSvg.replace(/\n\s*\n/g, '\n').replace(/^\s*\n/gm, '').trim();

      // 宽高处理
      if (settings.widthHeightHandling === '100percent') {
        // 替换width和height为100%
        processedSvg = processedSvg.replace(/\s+width="[^"]*"/g, ' width="100%"');
        processedSvg = processedSvg.replace(/\s+height="[^"]*"/g, ' height="100%"');
      } else if (settings.widthHeightHandling === 'remove') {
        // 移除width和height属性
        processedSvg = processedSvg.replace(/\s+width="[^"]*"/g, '');
        processedSvg = processedSvg.replace(/\s+height="[^"]*"/g, '');
      }

      // 解析SVG
      const parser = new DOMParser();
      const doc = parser.parseFromString(processedSvg, 'image/svg+xml');
      const svgElement = doc.querySelector('svg');

      if (!svgElement) {
        throw new Error('无效的SVG格式');
      }

      // 提取和处理属性
      const attributes: Record<string, string> = {};
      Array.from(svgElement.attributes).forEach(attr => {
        // 处理特殊属性
        if (attr.name === 'class') {
          // 根据preserveMode决定是否保留class
          const shouldPreserveClass = settings.preserveMode === 'all' || settings.preserveMode === 'classes-only';

          if (shouldPreserveClass) {
            attributes[attr.name] = attr.value;
          }
        } else if (attr.name === 'id') {
          // 如果开启removeIds，直接跳过所有id属性
          if (settings.removeIds) {
            return;
          }
          // 根据preserveMode决定是否保留id
          const shouldPreserveId = settings.preserveMode === 'all' || settings.preserveMode === 'ids-only';

          if (shouldPreserveId) {
            attributes[attr.name] = attr.value;
          }
        } else if (attr.name === 'style') {
          // style 属性需要特殊处理
          if (settings.convertStyleToObject) {
            // 跳过，稍后会转换后重新添加
            return;
          }
          attributes[attr.name] = attr.value;
        } else if (attr.name === 'width' || attr.name === 'height') {
          // 根据宽高处理设置决定是否保留属性
          if (settings.widthHeightHandling === '100percent') {
            attributes[attr.name] = '100%';
          } else if (settings.widthHeightHandling === 'remove') {
            // 移除尺寸，让SVG自适应
            return;
          } else {
            // 保留模式：保留原始值
            attributes[attr.name] = attr.value;
          }
        } else {
          attributes[attr.name] = attr.value;
        }
      });

      // 处理 SVG 元素本身的 style 属性
      let svgStyleAttr = '';
      if (svgElement.hasAttribute('style') && settings.convertStyleToObject) {
        const styleValue = svgElement.getAttribute('style');
        if (styleValue) {
          // 复用 convertStyleStringToObject 的逻辑
          const styles: Record<string, string> = {};
          const styleDeclarations = styleValue.split(';').filter(s => s.trim());
          for (const declaration of styleDeclarations) {
            const colonIndex = declaration.indexOf(':');
            if (colonIndex === -1) continue;
            const property = declaration.substring(0, colonIndex).trim();
            const value = declaration.substring(colonIndex + 1).trim();
            if (property && value) {
              const camelCaseProperty = property.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
              styles[camelCaseProperty] = value;
            }
          }
          const entries = Object.entries(styles);
          if (entries.length === 0) {
            svgStyleAttr = '\nstyle={{}}';
          } else {
            // 使用相同的特殊标记格式
            const styleProps = entries
              .map(([key, value]) => `${key}: "${value}"`)
              .join(',\n');
            svgStyleAttr = `\nstyle={{__STYLE_START__\n${styleProps}\n__STYLE_END__}}`;
          }
        }
      }

      // 生成属性字符串 - 每个属性单独一行
      let propsString = '';

      if (Object.keys(attributes).length > 0) {
        propsString = '\n' + Object.entries(attributes)
          .map(([key, value]) => `  ${key}="${value}"`)
          .join('\n');
      }

      // 添加转换后的 style 属性
      if (svgStyleAttr) {
        propsString += svgStyleAttr;
      }

      // 添加换行和闭合标签
      if (propsString) {
        propsString += '\n';
      }

      // 提取内容并处理颜色
      let content = svgElement.innerHTML;

      // 移除内容中的所有空行
      content = content.replace(/\n\s*\n/g, '\n').replace(/^\s*\n/gm, '').trim();

      // 样式转换处理 - 按顺序处理
      // 1. 先处理展平：将style标签内的CSS展平到行内style
      if (settings.flattenStyles) {
        content = convertCSSClassesToInlineStyles(content);
      }

      // 2. 再处理style转object：将style属性从字符串格式转为对象格式
      if (settings.convertStyleToObject) {
        content = convertStyleStringToObject(content);
      }

      // 根据preserveMode移除ID和class属性
      if (settings.removeIds || settings.preserveMode === 'none' || settings.preserveMode === 'classes-only') {
        // 不保留ID时移除所有id属性
        content = removeIdsFromSVG(content);
      }

      if (settings.preserveMode === 'none' || settings.preserveMode === 'ids-only') {
        // 不保留class时移除所有class属性
        content = removeClassesFromSVG(content);
      }

      // 移除内部元素的 xmlns 属性（只保留 svg 根元素的）
      content = content.replace(/\s+xmlns(?::[a-z0-9]+)?\s*=\s*"[^"]*"/gi, '');
      content = content.replace(/\s+xmlns(?::[a-z0-9]+)?\s*=\s*'[^']*'/gi, '');

      // 移除内容中的多余空行
      content = content.replace(/\n\s*\n/g, '\n').trim();

      // 格式化元素属性，让每个属性单独一行
      content = formatElementAttributes(content);

      // 为内容添加缩进（每个子元素缩进 2 个空格）
      content = content.split('\n').map(line => '  ' + line).join('\n');

      // 检查是否为匿名组件
      const isAnonymous = !settings.componentName.trim();

      // 生成SVG属性字符串
      const svgAttributes = propsString;

      // 生成导入语句
      const imports = isAnonymous ? "import React from 'react';" : settings.importStatement;

      // 生成组件代码
      let componentCode = '';
      let exportStatement = '';

      if (isAnonymous) {
        // 匿名组件 - 根据函数形式生成不同代码
        if (settings.functionType === 'function') {
          componentCode = `export default function() {
  return (
    <svg${svgAttributes}>
${content}
    </svg>
  );
}`;
        } else if (settings.functionType === 'arrow-explicit') {
          componentCode = `export default () => {
  return (
    <svg${svgAttributes}>
${content}
    </svg>
  );
}`;
        } else {
          componentCode = `export default () => (
  <svg${svgAttributes}>
${content}
  </svg>
);`;
        }
      } else {
        // 有名称的组件 - 根据函数形式生成不同代码
        if (settings.functionType === 'function') {
          componentCode = `function ${settings.componentName}() {
  return (
    <svg${svgAttributes}>
${content}
    </svg>
  );
}`;
        } else if (settings.functionType === 'arrow-explicit') {
          componentCode = `const ${settings.componentName} = () => {
  return (
    <svg${svgAttributes}>
${content}
    </svg>
  );
}`;
        } else {
          componentCode = `const ${settings.componentName} = () => (
  <svg${svgAttributes}>
${content}
  </svg>
);`;
        }

        // 生成导出语句
        if (settings.exportType === 'named') {
          exportStatement = `export { ${settings.componentName} };`;
        } else if (settings.exportType === 'both') {
          exportStatement = `export default ${settings.componentName};\nexport { ${settings.componentName} };`;
        } else {
          exportStatement = `export default ${settings.componentName};`;
        }
      }

      // 生成最终代码
      let finalCode = [
        imports,
        componentCode,
        exportStatement
      ].filter(Boolean).join('\n\n');

      // 处理所有的style特殊标记（SVG根元素的style）
      // 将带标记的style转换为最终格式
      finalCode = finalCode.replace(/style=\{\{__STYLE_START__\n([\s\S]*?)\n__STYLE_END__\}\}/g, (_match, content) => {
        const lines = content.split('\n');
        const indentedLines = lines.map((line: string) => line.trim() ? `    ${line.trim()}` : '');
        return `style={{\n${indentedLines.join('\n')}\n  }}`;
      });

      // 格式化生成的 React 代码
      if (settings.prettier) {
        try {
          return await formatReactWithAttributeBreaks(finalCode);
        } catch (formatError) {
          console.warn('格式化失败，返回未格式化的代码:', formatError);
          return finalCode;
        }
      }

      return finalCode;
    } catch (error) {
      console.error('转换出错:', error);
      throw error;
    }
  }, [svgInput, settings]);

  return {
    convertSvgToReact,
  };
};
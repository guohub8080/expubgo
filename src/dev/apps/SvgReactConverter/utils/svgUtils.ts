// SVG转换相关的辅助函数

// 颜色提取辅助函数 - 收集SVG中的所有唯一颜色，用于替换为props
export const extractColorsFromSVG = (svgElement: SVGSVGElement): string[] => {
  const uniqueColors = new Set<string>();

  // 遍历整个SVG树，收集所有唯一的颜色值
  const traverseAndCollectColors = (element: Element) => {
    ['fill', 'stroke', 'stop-color', 'color'].forEach(attr => {
      const value = element.getAttribute(attr);
      if (value) {
        const color = value.trim();
        // 只收集具体的颜色值，过滤掉特殊值
        if (color &&
            color !== 'none' &&
            color !== 'currentColor' &&
            !color.startsWith('url(') &&
            !color.startsWith('var(')) {
          uniqueColors.add(color);
        }
      }
    });

    // 递归遍历子元素
    for (const child of element.children) {
      traverseAndCollectColors(child);
    }
  };

  traverseAndCollectColors(svgElement);

  // 返回唯一的颜色数组，最多10个
  return Array.from(uniqueColors).slice(0, 10);
};

// 将SVG中的颜色替换为props表达式
export const replaceColorsWithProps = (svgContent: string, colors: string[]): string => {
  let modifiedContent = svgContent;

  colors.forEach((color, index) => {
    // 创建匹配该颜色的正则表达式
    const colorRegex = new RegExp(`(fill|stroke|stop-color|color)\\s*=\\s*["']${color.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'gi');

    // 根据颜色数量决定props名称：单个颜色用color，多个用color1, color2...
    const propName = colors.length === 1 ? 'color' : `color${index + 1}`;

    // 替换为props表达式
    modifiedContent = modifiedContent.replace(colorRegex, `$1={props.${propName}}`);
  });

  return modifiedContent;
};

// 移除SVG中的id属性
export const removeIdsFromSVG = (svgContent: string): string => {
  // 移除所有id属性
  return svgContent.replace(/\bid\s*=\s*["'][^"']*["']/gi, '');
};

// 移除SVG中的class属性
export const removeClassesFromSVG = (svgContent: string): string => {
  // 移除所有class属性
  return svgContent.replace(/\bclass\s*=\s*["'][^"']*["']/gi, '');
};

// 解析SVG中的CSS样式并转换为行内样式
export const convertCSSClassesToInlineStyles = (svgContent: string): string => {
  // 提取<style>标签内容
  const styleMatch = svgContent.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  if (!styleMatch) {
    return svgContent;
  }

  const cssContent = styleMatch[1];
  const classToStyles = new Map<string, Record<string, string>>();

  // 解析CSS规则
  const cssRules = cssContent.match(/([^{]+)\s*\{\s*([^}]+)\s*\}/g) || [];

  for (const rule of cssRules) {
    const match = rule.match(/([^{]+)\s*\{\s*([^}]+)\s*\}/);
    if (match) {
      const selector = match[1].trim();
      const styles = match[2].trim();

      // 只处理class选择器（如 .icon-primary）
      if (selector.startsWith('.')) {
        const className = selector.substring(1);
        const styleMap: Record<string, string> = {};

        // 解析样式属性
        const styleDeclarations = styles.split(';').filter(s => s.trim());
        for (const declaration of styleDeclarations) {
          const [property, value] = declaration.split(':').map(s => s.trim());
          if (property && value) {
            // 将CSS属性名转换为React style属性名
            const reactProperty = property.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
            styleMap[reactProperty] = value;
          }
        }

        classToStyles.set(className, styleMap);
      }
    }
  }

  let processedContent = svgContent;

  // 替换class属性为行内样式
  classToStyles.forEach((styles, className) => {
    // 匹配class属性包含此className的元素
    const classRegex = new RegExp(`(\\bclass\\s*=\\s*["'][^"']*)\\b${className}\\b([^"']*["'])`, 'gi');

    processedContent = processedContent.replace(classRegex, (match) => {
      // 检查元素是否已有style属性
      const styleMatch = match.match(/\bstyle\s*=\s*"([^"]*)"/i);

      let finalStyles = { ...styles };

      if (styleMatch) {
        // 已有style：解析已有style，覆盖展平中的重复属性
        const existingStyleContent = styleMatch[1];

        // 解析已有的style属性
        existingStyleContent.split(';').forEach(declaration => {
          const colonIndex = declaration.indexOf(':');
          if (colonIndex === -1) return;

          const property = declaration.substring(0, colonIndex).trim();
          const value = declaration.substring(colonIndex + 1).trim();

          if (property && value) {
            // 转换为驼峰命名进行匹配
            const camelCaseProperty = property.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
            // 已有style中的属性覆盖展平的属性
            finalStyles[camelCaseProperty] = value;
          }
        });
      }

      // 构建最终的style字符串
      const styleString = Object.entries(finalStyles)
        .map(([prop, value]) => `${prop}: ${value}`)
        .join('; ');

      // 移除class中的className
      const remainingClasses = match.replace(/^class\s*=\s*["']/, '')
        .replace(/["']$/, '')
        .replace(new RegExp(`\\b${className}\\b\\s*`, 'g'), '')
        .trim();

      if (remainingClasses) {
        return match.replace(/class="[^"]*"/, `class="${remainingClasses}" style="${styleString}"`);
      } else {
        return match.replace(/class="[^"]*"/, `style="${styleString}"`);
      }
    });
  });

  // 移除<style>标签
  processedContent = processedContent.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

  return processedContent;
};

// 将style属性从字符串格式转换为React对象格式（驼峰命名）
export const convertStyleStringToObject = (svgContent: string): string => {
  // 匹配所有style属性（支持单引号和双引号）
  return svgContent.replace(/\bstyle\s*=\s*("([^"]*)"|'([^']*)')/gi, (match, _, doubleQuoteContent, singleQuoteContent) => {
    const styleContent = doubleQuoteContent || singleQuoteContent || '';
    const styles: Record<string, string> = {};

    // 解析样式属性
    const styleDeclarations = styleContent.split(';').filter(s => s.trim());
    for (const declaration of styleDeclarations) {
      const colonIndex = declaration.indexOf(':');
      if (colonIndex === -1) continue;

      const property = declaration.substring(0, colonIndex).trim();
      const value = declaration.substring(colonIndex + 1).trim();

      if (property && value) {
        // 将CSS属性名转换为驼峰命名
        const camelCaseProperty = property.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
        styles[camelCaseProperty] = value;
      }
    }

    // 生成React对象格式 - 直接生成最终格式，不使用标记
    const entries = Object.entries(styles);
    if (entries.length === 0) return 'style={{}}';

    // 生成多行格式（无缩进，缩进由外层统一处理）
    const styleProps = entries
      .map(([key, value]) => `${key}: "${value}"`)
      .join(',\n');

    return `style={{__STYLE_START__\n${styleProps}\n__STYLE_END__}}`;
  });
};

// 格式化 SVG 内容中的元素属性，让每个属性单独一行
export const formatElementAttributes = (svgContent: string): string => {
  // 匹配所有开始标签（包括自闭合标签）
  return svgContent.replace(/<(\w+)([^>]*?)\s*(\/?)>/gi, (match, tagName, attrs, selfClosing) => {
    // 如果没有属性，直接返回
    if (!attrs.trim()) return match;

    // 提取所有属性（包括style）
    const attributes: Array<{ type: 'normal' | 'style', name?: string, value?: string, content?: string }> = [];

    // 先检查是否有style属性
    const styleRegex = /style=\{\{__STYLE_START__\n([\s\S]*?)\n__STYLE_END__\}\}/g;
    let styleMatch = styleRegex.exec(attrs);
    let remainingAttrs = attrs;

    if (styleMatch) {
      // 保存style属性的内容
      attributes.push({
        type: 'style',
        content: styleMatch[1] // style属性的内容（不包括style={{和}}）
      });
      // 从attrs中移除style部分
      remainingAttrs = attrs.replace(styleMatch[0], '').trim();
    }

    // 提取其他普通属性
    const normalAttrRegex = /(\S+)\s*=\s*"([^"]*)"/gi;
    let attrMatch: RegExpExecArray | null;
    while ((attrMatch = normalAttrRegex.exec(remainingAttrs)) !== null) {
      attributes.push({
        type: 'normal',
        name: attrMatch[1],
        value: attrMatch[2]
      });
    }

    // 如果只有一个普通属性且没有style，保持单行
    if (attributes.length === 1 && attributes[0].type === 'normal') {
      return match;
    }

    // 格式化所有属性（每个属性一行）
    const formattedAttrs = attributes.map(attr => {
      if (attr.type === 'normal') {
        return `  ${attr.name}="${attr.value}"`;
      } else {
        // style属性：保持多行格式
        const styleLines = attr.content!.split('\n');
        const indentedStyleLines = styleLines.map(line => `    ${line.trim()}`);
        return `  style={{\n${indentedStyleLines.join('\n')}\n  }}`;
      }
    });

    return `<${tagName}\n${formattedAttrs.join('\n')}\n${selfClosing}>`;
  });
};
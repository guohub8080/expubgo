/**
 * 文档内容处理工具函数
 */

import React from 'react';
import { extractTitleFromMDX } from '../title';

/**
 * 处理不同文件类型的内容和标题
 * @param module 完整的模块对象（包含命名导出）
 * @param document 文档对象（默认导出）
 * @param fileType 文件类型
 * @param fileName 文件名（可选）
 * @returns 处理后的标题和JSX内容
 */
export function processDocumentContent(module: any, document: any, fileType: 'tsx' | 'md' | 'mdx', fileName?: string): {
  title: string;
  jsxContent: React.ReactNode;
} {
  if (fileType === 'md' || fileType === 'mdx') {
    // MD/MDX文件：优先从模块的 title 命名导出提取，否则使用文件名
    const MDXComponent = document;
    const jsxContent = React.createElement(MDXComponent);

    // 直接从模块对象中读取 title 命名导出
    let title = module?.title;

    // 如果无法提取标题，则从文件名提取
    if (!title && fileName) {
      // 处理文件夹形式的 index 文件：[1]translate/index.mdx -> translate
      const indexMatch = fileName.match(/^(\[\d+\][^\/]+)\/index\.(md|mdx)$/);
      if (indexMatch) {
        // 从文件夹名称提取 slug：[1]translate -> translate
        const folderName = indexMatch[1];
        const slugMatch = folderName.match(/^\[\d+\](.+)$/);
        title = slugMatch ? slugMatch[1] : '未命名文档';
      } else {
        // 普通文件：移除扩展名和前缀
        const nameWithoutExt = fileName.replace(/\.(md|mdx)$/, '');
        const nameWithoutPrefix = nameWithoutExt.replace(/^\[\d+\]/, '');
        title = nameWithoutPrefix || '未命名文档';
      }
    }

    return {
      title: title || '未命名文档',
      jsxContent
    };
  } else {
    // TSX文件：使用原有的title和jsx
    if (!document) {
      return {
        title: fileName || '未命名文档',
        jsxContent: React.createElement('div', {}, '文档加载失败')
      };
    }

    return {
      title: document.title,
      jsxContent: document.jsx
    };
  }
}

/**
 * 从MDX组件中提取第一个一级标题作为文档标题
 * MDX组件会被编译成React组件，我们需要从props中提取标题
 */

import { findFirstH1 } from './findFirstH1.ts';

/**
 * 从MDX组件中提取第一个一级标题作为文档标题
 * 支持从MDX文件的导出变量中读取title
 *
 * MDX文件可以这样定义标题：
 * export const title = "我的标题"
 *
 * 或使用frontmatter：
 * ---
 * title: "我的标题"
 * ---
 */
export function extractTitleFromMDX(mdxComponent: any): string {
  try {
    // 1. 优先检查 MDX 组件的 title 属性（从 export const title 导出）
    if (mdxComponent.title && typeof mdxComponent.title === 'string') {
      return mdxComponent.title;
    }

    // 2. Vite MDX 会将导出放在组件的属性上，检查所有属性
    const keys = Object.keys(mdxComponent);
    for (const key of keys) {
      if (key === 'title' && typeof mdxComponent[key] === 'string') {
        return mdxComponent[key];
      }
    }

    // 3. 如果都没有找到 title，返回 undefined（让调用方使用文件名）
    return undefined;
  } catch (error) {
    console.warn('提取MDX标题失败:', error);
    return undefined;
  }
}

import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import remarkGfm from 'remark-gfm'
import { publisherDefines, resolveAliasMap, moduleExtensions } from './vite.config.ts'

// SSR 别名 = 共享别名去掉浏览器专属项：path 在 Node 是内建模块，
// 浏览器构建的 path→path-browserify 映射在 SSR 里反而会把内建导入改写坏
const ssrAliasMap: Record<string, string> = { ...resolveAliasMap }
delete ssrAliasMap.path

/**
 * 预渲染 SSR 构建配置——把 scripts/prerender/entry.server.tsx 打包成可在 Node
 * 里直接 import 的 ESM（node_modules/.prerender/entry.server.mjs），由
 * scripts/prerender.mjs 驱动逐路径渲染。
 *
 * 与浏览器构建共享别名/publisher define/扩展名（vite.config.ts 导出），
 * 两棵树必须同源，水合才能对齐。
 * 不含：tailwind（SSR 不产 CSS，样式由浏览器 HTML 的 <link> 提供）、
 * terser/singlefile（仅浏览器产物）。
 */
export default defineConfig({
  define: publisherDefines,
  plugins: [
    react(),
    mdx({
      remarkPlugins: [remarkGfm],
      rehypePlugins: [],
      providerImportSource: '@mdx-js/react',
      include: ['**/*.{md,mdx,tsx}'],
    }),
  ],
  resolve: {
    // dedupe 与浏览器构建同源必抄：expub-tool（link 包）的 react 会解析到它自己
    // node_modules 的另一份（双实例 → hooks 报 null），强制整树单实例
    dedupe: ['react', 'react-dom'],
    alias: ssrAliasMap,
    extensions: moduleExtensions,
  },
  ssr: {
    // 全量打包依赖（仅 Node 内建模块外部化）：大量前端 ESM 包内部用目录导入/
    // 无扩展名导入（react-icons、react-syntax-highlighter 等），Node 运行时
    // 一律解析不了，外部化就炸——统一打进包内由构建器解析，一劳永逸
    noExternal: true,
  },
  build: {
    ssr: path.resolve(import.meta.dirname, 'scripts/prerender/entry.server.tsx'),
    outDir: path.resolve(import.meta.dirname, 'node_modules/.prerender'),
    emptyOutDir: true,
    minify: false,
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        format: 'es',
        entryFileNames: 'entry.server.mjs',
      },
    },
  },
  logLevel: 'warn',
})

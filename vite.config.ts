import path from "path"
import fs from "fs"
import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import terser from '@rollup/plugin-terser'
import mdx from '@mdx-js/rollup'
import remarkGfm from 'remark-gfm'
import { viteSingleFile } from 'vite-plugin-singlefile'

const isProduction = process.env.NODE_ENV === 'production';
const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const isSingleFile = process.env.SINGLE_FILE === 'true';

// ============================================ Publisher 选择性构建 ============================================
//
// 环境变量协议：
//   PUBLISHERS=<p1>,<p2>       逗号分隔的目录名列表
//   PUBLISHERS_MODE=include    include（默认，只打包列出的）/ exclude（打包列表之外的）
//
// 不传 PUBLISHERS → 全部启用（向后兼容，现有 pnpm build / pnpm gh 行为不变）
//
// 解析出的 enabledPublishers 会通过 define 注入为每个 publisher 的独立布尔常量 __PUB_<NAME>__，
// 与生成文件 publisherBranches.generated.tsx 内的 glob 守卫配对（见 scripts/generate-publisher-branches.cjs），
// 在构建期消除未启用 publisher 的 glob 分支，真正减小体积。
// ==============================================================================================================

// 从 publishers/ 目录动态扫描（含 publisher.config.ts 的直接子目录）——公共配置不硬编码任何目录名；
// 与 generate-publisher-branches.cjs 的扫描逻辑同源，保证 define 与生成文件内的守卫一致
const PUBLISHERS_ROOT = path.resolve(__dirname, 'publishers')
const ALL_PUBLISHERS: string[] = fs.existsSync(PUBLISHERS_ROOT)
  ? fs.readdirSync(PUBLISHERS_ROOT, { withFileTypes: true })
      .filter(e => e.isDirectory() && !e.name.startsWith('.'))
      .map(e => e.name)
      .filter(name => fs.existsSync(path.join(PUBLISHERS_ROOT, name, 'publisher.config.ts')))
  : []
const PUBLISHERS_ENV = (process.env.PUBLISHERS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean)
const PUBLISHERS_MODE = process.env.PUBLISHERS_MODE === 'exclude' ? 'exclude' : 'include'

// 计算启用的 publisher 列表
let enabledPublishers: string[]
if (PUBLISHERS_ENV.length === 0) {
  // 未指定 → 全部启用
  enabledPublishers = [...ALL_PUBLISHERS]
} else if (PUBLISHERS_MODE === 'exclude') {
  enabledPublishers = ALL_PUBLISHERS.filter(p => !PUBLISHERS_ENV.includes(p))
} else {
  // include 模式：只保留列表中存在的合法目录名，避免拼写错误悄悄失效
  enabledPublishers = PUBLISHERS_ENV.filter(p => ALL_PUBLISHERS.includes(p))
}

if (PUBLISHERS_ENV.length > 0) {
  const invalid = PUBLISHERS_ENV.filter(p => !ALL_PUBLISHERS.includes(p))
  if (invalid.length > 0) {
    console.warn(`[publisher-filter] 未知的 publisher 目录名将被忽略：${invalid.join(', ')}（可选值：${ALL_PUBLISHERS.join(', ')}）`)
  }
  console.log(`[publisher-filter] 本次构建启用的 publisher：${enabledPublishers.join(', ') || '（空）'}`)
}

// 单文件模式后处理：把 HTML 里所有外部 SVG/PNG/JPG 引用替换为 base64 data URI，并删除外部文件
function postInlineAssetsPlugin(): Plugin {
  return {
    name: 'post-inline-assets',
    enforce: 'post',
    apply: 'build',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist-pkg')
      const htmlPath = path.join(distDir, 'index.html')
      if (!fs.existsSync(htmlPath)) return

      let html = fs.readFileSync(htmlPath, 'utf-8')

      // 单文件模式：移除对 fonts/fonts.css 的 <link> 引用。
      // 该文件在源码 index.html 中被硬编码引入，但 fonts/ 目录实际不存在（死链），
      // 且 removeFontFacesPlugin 已删除所有 @font-face，单文件产物不需要外部字体。
      // 不清理的话，双击打开（file://）会因找不到 fonts.css 而报错。
      if (/<link[^>]+href=["']\.?\/?fonts\/fonts\.css["'][^>]*>/i.test(html)) {
        html = html.replace(/<link[^>]+href=["']\.?\/?fonts\/fonts\.css["'][^>]*>\s*/gi, '')
        console.log('[post-inline] removed dead link: fonts/fonts.css')
      }

      const assetsDir = path.join(distDir, 'assets')
      if (!fs.existsSync(assetsDir)) {
        fs.writeFileSync(htmlPath, html)
        return
      }

      const replacedFiles = new Set<string>()
      const mimeMap: Record<string, string> = {
        '.svg': 'image/svg+xml',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.ico': 'image/x-icon',
      }

      const walk = (dir: string) => {
        for (const name of fs.readdirSync(dir)) {
          const full = path.join(dir, name)
          const stat = fs.statSync(full)
          if (stat.isDirectory()) {
            walk(full)
            continue
          }
          const ext = path.extname(name).toLowerCase()
          const rel = path.relative(distDir, full).replace(/\\/g, '/')
          // 单文件模式：跳过字体文件（woff2/ttf/woff/eot），太大且不内联
          if (['.woff2', '.woff', '.ttf', '.eot'].includes(ext)) {
            console.log(`[post-inline] skip font: ${rel}`)
            continue
          }
          const mime = mimeMap[ext]
          if (!mime) continue
          const content = fs.readFileSync(full)
          const dataUri = `data:${mime};base64,${content.toString('base64')}`
          // 匹配 ./rel、/rel、rel 三种写法
          const escaped = rel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          const re = new RegExp(`(["'\\(])\\.?/?${escaped}(["'\\)])`, 'g')
          const before = html
          html = html.replace(re, `$1${dataUri}$2`)
          if (before !== html) {
            replacedFiles.add(full)
            console.log(`[post-inline] replaced: ${rel} (${(content.length / 1024).toFixed(1)} KB)`)
          }
        }
      }
      walk(assetsDir)

      // 删除 HTML 中所有内联的 woff2 字体 base64（避免单文件体积爆炸）
      const fontRegex = /url\(data:font\/woff2;base64,[A-Za-z0-9+/=]+\)/g
      const fontMatches = html.match(fontRegex)
      if (fontMatches) {
        console.log(`[post-inline] removed ${fontMatches.length} inline woff2 fonts from HTML`)
        html = html.replace(fontRegex, 'url()')
      }

      fs.writeFileSync(htmlPath, html)

      // 删除 fonts/ 目录：源码 index.html 引用的 ./fonts/fonts.css 是死链（fonts/ 不存在），
      // vite build 仍会创建一个空的 fonts/ 占位目录，单文件模式下无意义，直接删除。
      const fontsDir = path.join(distDir, 'fonts')
      if (fs.existsSync(fontsDir)) {
        try {
          fs.rmSync(fontsDir, { recursive: true, force: true })
          console.log('[post-inline] removed dead dir: fonts/')
        } catch { /* ignore */ }
      }

      // 删除已经被内联的外部资源文件
      for (const f of replacedFiles) {
        try { fs.unlinkSync(f) } catch { /* ignore */ }
      }
      // 清理空目录：所有路径锚定在 assetsDir 内并校验边界（防路径穿越）；
      // lstat 不跟随符号链接，避免经链接递归到产物目录之外
      const assetsRoot = path.resolve(assetsDir)
      const isInsideAssets = (p: string) => {
        const resolved = path.resolve(p)
        return resolved === assetsRoot || resolved.startsWith(assetsRoot + path.sep)
      }
      const cleanEmpty = (dir: string) => {
        if (!isInsideAssets(dir)) return
        if (!fs.existsSync(dir)) return
        for (const name of fs.readdirSync(dir)) {
          const full = path.join(dir, name)
          if (!isInsideAssets(full)) continue
          if (fs.lstatSync(full).isDirectory()) cleanEmpty(full)
        }
        try {
          if (fs.readdirSync(dir).length === 0) fs.rmdirSync(dir)
        } catch { /* ignore */ }
      }
      cleanEmpty(assetsDir)
    },
  }
}

// 单文件模式下：删除 CSS 中所有 @font-face 规则，避免字体文件被 base64 内联进 HTML
function removeFontFacesPlugin(): Plugin {
  return {
    name: 'remove-font-faces',
    enforce: 'post',
    transform(code, id) {
      if (!id.endsWith('.css')) return null
      const cleaned = code.replace(/@font-face\s*\{[^}]*\}/gs, '')
      const removed = (code.match(/@font-face\s*\{/g) || []).length
      if (removed > 0) {
        console.log(`[remove-font-faces] ${id}: removed ${removed} @font-face rules`)
      }
      return { code: cleaned, map: null }
    },
  }
}

// 单文件模式下：拦截所有 SVG import，强制返回 base64 data URI（避免成为外部文件后被丢失）
function inlineSvgPlugin(): Plugin {
  let count = 0
  return {
    name: 'inline-svg-as-data-uri',
    enforce: 'pre',
    resolveId(source, importer) {
      if (source.endsWith('.svg')) {
        // 让 vite 正常解析路径，但保留 raw query 让我们能拦截
        return null
      }
      return null
    },
    transform(_code, id) {
      const cleanId = id.split('?')[0]
      if (!cleanId.endsWith('.svg')) return null
      try {
        const svg = fs.readFileSync(cleanId)
        const base64 = svg.toString('base64')
        const dataUri = `data:image/svg+xml;base64,${base64}`
        count++
        console.log(`[inline-svg] #${count}: ${path.relative(process.cwd(), cleanId)}`)
        return {
          code: `export default ${JSON.stringify(dataUri)}`,
          map: null,
        }
      } catch (e) {
        console.warn(`[inline-svg] failed: ${cleanId}`, e)
        return null
      }
    },
  }
}

/**
 * 扫描 publishers/ 目录，读取每个 publisher 的 publisher.config.ts 生成 @短路径 别名
 *
 * 规则：
 * - 每个 publisher 目录必须包含 publisher.config.ts
 * - publisher.config.ts 必须导出 alias 对象：{ "@别名": "./相对路径" }
 * - 路径以 publisher 目录为基准解析
 *
 * 这样新增 publisher 时只需创建目录 + publisher.config.ts，无需修改 vite.config.ts
 */
function generatePublisherAliases(): Record<string, string> {
  const publishersDir = path.resolve(__dirname, './publishers')
  const aliases: Record<string, string> = {}

  if (!fs.existsSync(publishersDir)) {
    return aliases
  }

  // 静态别名 key 集合（避免与已有的 @dev/@apps 等冲突）
  const staticAliases = new Set([
    '@', '@dev', '@comps', '@apps', '@styles', '@assets',
    '@utils', '@vite-dev', '@api', '@pub-html', '@pub-svg',
    '@sns', '@pub-utils', '@svg-anim', '@svg-set',
    '@book-svg-tool', '@shadcn', '@books', '@articles',
    '@publishers', '@mdx', '@book-comps',
  ])
  const usedNames = new Set<string>()

  // 只扫描 publishers/ 的直接子目录，不递归进入下级
  for (const dirName of fs.readdirSync(publishersDir)) {
    const fullPath = path.join(publishersDir, dirName)
    const stat = fs.statSync(fullPath)

    // 跳过文件和隐藏目录
    if (!stat.isDirectory() || dirName.startsWith('.')) {
      continue
    }

    // publisher 选择性构建说明：
    // 别名仍为所有 publisher 注册（注册别名不会增加打包体积，只是路径映射）。
    // 真正的体积控制靠 articlesLoader / PublisherAccountManager / SideList 里的 glob 分支，
    // 那里的 isPublisherEnabled(id) 会被 define 折叠为常量，未启用 publisher 的 glob 整支被 tree-shake。
    // 这里不跳过别名，是为了避免「某处残留的跨 publisher 引用」因别名缺失而在构建期炸掉。

    // 读取 publisher.config.ts（扫描终点：有此文件的目录即为一个 publisher）
    const configPath = path.join(fullPath, 'publisher.config.ts')
    if (!fs.existsSync(configPath)) {
      throw new Error(
        `[publisher-alias] 缺少配置：publisher "${dirName}" 目录下未找到 publisher.config.ts`
      )
    }

    // 用正则解析 alias 对象
    const configContent = fs.readFileSync(configPath, 'utf-8')

    // 匹配 alias: { "@xxx": "./path", ... }
    const aliasMatch = configContent.match(/alias\s*:\s*\{([^}]+)\}/s)
    if (!aliasMatch) {
      throw new Error(
        `[publisher-alias] 配置错误：${dirName}/publisher.config.ts 中未找到 alias 对象`
      )
    }

    // 解析 alias 对象中的键值对
    const aliasBlock = aliasMatch[1]
    const pairRegex = /"(@[^"]+)"\s*:\s*"([^"]+)"/g
    let pairMatch
    let found = false

    while ((pairMatch = pairRegex.exec(aliasBlock)) !== null) {
      found = true
      const aliasName = pairMatch[1]
      const relativePath = pairMatch[2]

      // 冲突检测 1：与静态别名重复
      if (staticAliases.has(aliasName)) {
        throw new Error(
          `[publisher-alias] 别名冲突：publisher "${dirName}" 声明的 ${aliasName} 与静态别名冲突，请修改 publisher.config.ts`
        )
      }

      // 冲突检测 2：与其他 publisher 的别名重名
      if (usedNames.has(aliasName)) {
        throw new Error(
          `[publisher-alias] 别名冲突：${aliasName} 已被其他 publisher 使用，请修改 ${dirName}/publisher.config.ts`
        )
      }
      usedNames.add(aliasName)

      // 解析相对路径为绝对路径
      const targetPath = path.resolve(fullPath, relativePath)
      if (!fs.existsSync(targetPath)) {
        throw new Error(
          `[publisher-alias] 路径不存在：${dirName}/publisher.config.ts 中 ${aliasName} 指向的 "${relativePath}" 不存在`
        )
      }

      // 添加精确匹配别名（如 @demo → .../components）
      aliases[aliasName] = targetPath
      console.log(`[publisher-alias] ${aliasName} → ${path.relative(__dirname, targetPath)}`)

      // 如果目标路径是目录，同时添加 /* 前缀匹配别名（如 @demo/xxx → .../components/xxx）
      const stat = fs.statSync(targetPath)
      if (stat.isDirectory()) {
        const wildcardAlias = `${aliasName}/*`
        aliases[wildcardAlias] = targetPath
        console.log(`[publisher-alias] ${wildcardAlias} → ${path.relative(__dirname, targetPath)}`)
      }
    }

    if (!found) {
      throw new Error(
        `[publisher-alias] 配置错误：${dirName}/publisher.config.ts 中的 alias 对象格式不正确，应为 { "@别名": "./路径" }`
      )
    }
  }

  return aliases
}

// https://vitejs.dev/config/
export default defineConfig({
  // 统一使用相对路径，兼容所有部署平台（GitHub Pages、Cloudflare、Netlify、Vercel）
  // 无论部署到子路径还是根域名，资源引用都能正确解析
  // GitHub Pages 子路径模式用绝对路径（站点部署在 guohub8080.github.io/expubgo/）
  base: isGitHubPages ? '/expubgo/' : './',
  // 注入构建期常量：为每个 publisher 注入独立的布尔字面量 __PUB_<NAME>__。
  // 关键：必须用「布尔常量直接判断」，不能用 Array.includes()——
  // rollup/terser 会把 `false ? glob : {}` 整支消除（tree-shake），
  // 但不会折叠 `["p1"].includes("p2")` 这种运行时方法调用。
  define: Object.fromEntries(
    ALL_PUBLISHERS.map(name => [
      `__PUB_${name.toUpperCase()}__`,
      JSON.stringify(enabledPublishers.includes(name)),
    ])
  ),
  plugins: [
    isSingleFile && removeFontFacesPlugin(),
    isSingleFile && inlineSvgPlugin(),
    react(),
    tailwindcss(),
    mdx({
      // MDX 配置选项
      remarkPlugins: [remarkGfm], // 支持 GitHub Flavored Markdown (表格、删除线等)
      rehypePlugins: [],
      // 指定MDX组件映射
      providerImportSource: '@mdx-js/react',
      // 支持 TSX 文件
      include: ['**/*.{md,mdx,tsx}'],
    }),
    isProduction && terser(), // 只在生产环境下使用 terser 压缩
    isSingleFile && viteSingleFile({
      // 只内联 JS 和 CSS，图片字体等资源保留为外部文件
      inlinePattern: ['**/*.css', '**/*.js'],
    }),
    isSingleFile && postInlineAssetsPlugin(),
  ],
  // Worker 配置
  worker: {
    format: 'es',
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@dev": path.resolve(__dirname, "./src/dev"),
      "@comps": path.resolve(__dirname, "./src/dev/components"),
      "@apps": path.resolve(__dirname, "./src/dev/apps"),
      "@styles": path.resolve(__dirname, "./src/dev/styles"),
      "@assets": path.resolve(__dirname, "./src/dev/assets"),
      "@utils": path.resolve(__dirname, "./src/dev/utils"),
      "@vite-dev": path.resolve(__dirname, "./src/dev/utils/vite-dev"),
      "@api": path.resolve(__dirname, "./src/dev/api"),
      "@pub-html": path.resolve(__dirname, "./src/dev/pubComponents/PureHTML"),
      "@pub-svg": path.resolve(__dirname, "./src/dev/pubComponents/SVG"),
      "@sns": path.resolve(__dirname, "./src/dev/pubComponents/SnsTemplate"),
      "@pub-utils": path.resolve(__dirname, "./src/dev/pubUtils"),
      "@svg-anim": path.resolve(__dirname, "./src/dev/pubUtils/genSvgAnimate"),
      "@svg-set": path.resolve(__dirname, "./src/dev/pubUtils/genSvgAnimate/set"),
      "@book-svg-tool": path.resolve(__dirname, "./src/books/SvgToolFunctions"),
      "@shadcn": path.resolve(__dirname, "./src/dev/shadcn"),
      "@books": path.resolve(__dirname, "./src/books"),
      "@articles": path.resolve(__dirname, "./src/articles"),
      "@publishers": path.resolve(__dirname, "./publishers"),
      "@mdx": path.resolve(__dirname, "./src/dev/components/mdx"),
      "@book-comps": path.resolve(__dirname, "./src/dev/components/bookComponents"),
      // 动态扫描 publishers 目录生成 @短路径 别名
      ...generatePublisherAliases(),
      path: "path-browserify",
    },
    extensions: [".ts", ".tsx", ".js", ".jsx", ".mdx", ".md"]
  },

  // 开发环境配置
  server: {
    // 固定端口：避免 vite 自动顺延（5173→5174→...）导致 cloudflared/书签/文档里的 URL 失效
    // strictPort: 端口被占直接报错，配合 dev 脚本里的 lsof 强杀，保证始终是 6768
    // （logiguo 用 6868、guookcase 用 6767；三个项目同时 dev 时互不干扰）
    port: 6768,
    strictPort: true,
    host: true, // 允许局域网访问（手机同 WiFi 测试 + cloudflared tunnel）
    // 允许通过 cloudflared tunnel 绑定的域名访问（Vite 默认只允许 localhost，会 403）
    allowedHosts: ['dev.guohub.top'],
    proxy: {
      // 代理微信图片
      '/api/wechat-img': {
        target: 'https://mmbiz.qpic.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/wechat-img/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // 移除所有可能暴露来源的请求头
            proxyReq.removeHeader('referer');
            proxyReq.removeHeader('origin');
            proxyReq.removeHeader('host');
            // 设置伪装请求头，模拟微信客户端
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
            proxyReq.setHeader('Accept', 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8');
            proxyReq.setHeader('Accept-Encoding', 'gzip, deflate, br');
            proxyReq.setHeader('Accept-Language', 'zh-CN,zh;q=0.9,en;q=0.8');
            // 添加微信相关的 header
            proxyReq.setHeader('Sec-Fetch-Dest', 'image');
            proxyReq.setHeader('Sec-Fetch-Mode', 'no-cors');
            proxyReq.setHeader('Sec-Fetch-Site', 'cross-site');
          });
        }
      }
    }
  },

  build: {
    outDir: isSingleFile ? "dist-pkg" : "docs",
    minify: isProduction,
    // 单文件模式：用函数强制内联所有资源（包括 SVG，覆盖 Vite 默认排除 SVG 的行为）
    assetsInlineLimit: isSingleFile
      ? function (filePath, content) { return content.length < 100 * 1024 }
      : 4096,
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash][extname]',

        // 单文件模式：合并动态 import，关闭手动拆包
        ...(isSingleFile ? {
          inlineDynamicImports: true,
          manualChunks: undefined,
        } : {
          // 将第三方依赖库单独打包成一个文件
          manualChunks: {
            react: ['react', 'react-dom', 'react-use'],
            baseTool: ['es-toolkit', 'ramda', 'ahooks'],
            dayjs: ['dayjs'],
            monaco: ['monaco-editor', '@monaco-editor/react']
          }
        })
      }
    },
    commonjsOptions: {
      exclude: ['ckeditor/*'],
    },
  }
})

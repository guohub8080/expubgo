#!/usr/bin/env node
/**
 * 构建后预渲染 pass —— 在 vite build 之后运行：
 * 1) 用 vite.prerender.config.ts 把 SSR 入口打包到 node_modules/.prerender/
 * 2) 从路由树静态枚举全部叶子路径，逐路径渲染成 HTML 字符串
 * 3) 以 docs/index.html 为模板组装 docs/<path>/index.html（data-prerendered 水合标记）
 * 4) 注入遗留 hash 重定向（hash 路由时代的外部分享链接 #/x → 真路径 /x）
 * 5) 产出 docs/404.html（纯壳：未知路径由宿主以 404.html 应答 → 浏览器路由
 *    在原 URL 水合，动态参数路由可直渲染，未匹配 → BadRouteRedirect → 首页）
 * 6) 产出 docs/_redirects（Netlify 200 回退；真实文件优先命中）
 *
 * 路由协议：BrowserRouter 真路径（无井号）。单文件 pkg 产物不经本脚本
 * （保留 hash 路由，file:// 直开场景）。
 * 单页渲染失败不阻塞：该路径不产出文件，回落 404 壳的 SPA 行为。
 */
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const ROOT = process.cwd()
const DOCS = path.join(ROOT, 'docs')
// 部署子路径（GH Pages = /expubgo，根域镜像 = 空）：遗留 hash 链接重定向要拼回
const BASE = process.env.GITHUB_PAGES === 'true' ? '/expubgo' : ''
const ROOT_OPEN = '<div id="root">'
const DOCS_INDEX = path.join(DOCS, 'index.html')

// 已知回落页：SSR 打包器对 smil barrel + 该页 mdx 组合的产物缺陷
// （ReferenceError: v is not defined，浏览器端渲染正常），SPA 回落零损失
const EXCLUDE = new Set(['/svg-tool-functions/intro/svg-keys'])

const log = (...args) => console.log('[prerender]', ...args)

// 遗留 hash 重定向：hash 路由时代的外部分享链接（#/view/x?source=y）折算成
// 真路径；顺带清洗地址栏残留 hash（/home/#/home → /home/）。replaceState 语义无重载
const legacyHashRedirect = `<script>(function(){var h=location.hash;if(h.length<2||h.charAt(1)!=='/')return;location.replace('${BASE}'+h.slice(1));})()</script>`

function injectLegacy(html) {
  return html.replace('<body>', '<body>\n' + legacyHashRedirect)
}

function assemblePrerendered(template, contentHtml) {
  const openAt = template.indexOf(ROOT_OPEN)
  const bodyAt = template.indexOf('</body>')
  const rootCloseAt = template.lastIndexOf('</div>', bodyAt)
  if (openAt < 0 || bodyAt < 0 || rootCloseAt < openAt) {
    throw new Error('模板结构不符合预期：未找到 #root 或其闭合标签')
  }
  return (
    template.slice(0, openAt) +
    '<div id="root" data-prerendered="true">' +
    contentHtml +
    '\n' +
    template.slice(rootCloseAt)
  )
}

async function main() {
  if (!fs.existsSync(DOCS_INDEX)) {
    console.error('[prerender] 缺少 docs/index.html —— 请先完成 vite build（pnpm build 的前置步骤）')
    process.exit(1)
  }
  const rawTemplate = fs.readFileSync(DOCS_INDEX, 'utf-8')

  log('SSR 构建预渲染入口 …')
  const { build } = await import('vite')
  await build({ configFile: path.join(ROOT, 'vite.prerender.config.ts') })
  const entry = await import(
    pathToFileURL(path.join(ROOT, 'node_modules/.prerender/entry.server.mjs')).href
  )

  const paths = entry.listPrerenderPaths().filter((p) => !EXCLUDE.has(p))
  log(`路由树枚举到 ${paths.length} 条静态路径（排除已知回落 ${EXCLUDE.size} 条）`)

  let ok = 0
  const failures = []
  for (const p of paths) {
    try {
      const html = await entry.renderPath(p)
      if (html === null) {
        log(`跳过（重定向/无静态内容）：${p}`)
        continue
      }
      const outFile = path.join(DOCS, p, 'index.html')
      fs.mkdirSync(path.dirname(outFile), { recursive: true })
      fs.writeFileSync(outFile, injectLegacy(assemblePrerendered(rawTemplate, html)))
      ok += 1
    } catch (err) {
      failures.push([p, err])
      log(`渲染失败（该页回落 SPA 壳）：${p} —— ${(err && err.message) || err}`)
    }
  }

  // 壳页：不预渲染内容（root 保持加载屏占位 → createRoot 路径）。
  // 404.html 反向升级为预渲染页：用合成路径 /__404__ 渲染 404 设计本体烤进壳里
  // （命中布局 splat），错地址瞬间出图（零加载屏），水合只负责接按钮/填真实路径。
  // 预渲染标记 → hydrateRoot 路径；客户端路由在真实 URL 水合（与渲染路径不同但
  // 同树：布局 splat 的产出与具体路径无关，shownPath 占位首帧两侧一致）
  fs.writeFileSync(DOCS_INDEX, injectLegacy(rawTemplate))
  const notFoundHtml = await entry.renderPath('/__404__')
  if (notFoundHtml !== null) {
    fs.writeFileSync(path.join(DOCS, '404.html'), injectLegacy(assemblePrerendered(rawTemplate, notFoundHtml)))
    log('404.html 已预渲染（合成路径 /__404__）')
  } else {
    fs.writeFileSync(path.join(DOCS, '404.html'), injectLegacy(rawTemplate))
    log('404.html 预渲染失败（renderPath 返回 null），回落壳')
  }
  // GH Pages 保险：禁 Jekyll 处理（upload-pages-artifact 自带，直推 docs/ 场景兜底）
  fs.writeFileSync(path.join(DOCS, '.nojekyll'), '')
  // CF Pages / Netlify 200 回退——仅分流 /view/*（网络文章动态深链走壳水合，避免
  // 闪 404）；其余未知路径落到 404.html 约定（预渲染 404 直出）。Vercel 同策略见 vercel.json
  fs.writeFileSync(path.join(DOCS, '_redirects'), '/view/*  /index.html  200\n')

  log(`完成：${ok} 页预渲染，${failures.length} 页回落 SPA 壳`)
  if (failures.length > 0) {
    log('回落清单：')
    for (const [p, err] of failures) log(`  ${p} —— ${(err && err.message) || err}`)
  }
}

main().catch((err) => {
  console.error('[prerender] 致命错误：', err)
  process.exit(1)
})

#!/usr/bin/env node
/**
 * 扫描 publishers/ 目录，生成「按 publisher 拆分的 import.meta.glob 分支」模块
 *
 * 为什么需要生成：import.meta.glob 第一参数必须是静态字面量（不能插变量），
 * 而按 publisher 拆分 glob + __PUB_<NAME>__ 守卫是选择性构建（tree-shake）的前提。
 * 把含真实目录名的分支代码放进本生成文件（gitignore，仅本地/CI 现场生成），
 * 公开源码（articlesLoader / SideList / publisherToolsLoader / PublisherAccountManager）
 * 只 import 本模块的导出，全程零目录名。
 *
 * 生成物：src/dev/articles/publisherBranches.generated.tsx
 * - publishers/ 为空（CI / 全新 clone）时生成空对象版本，保证构建链可跑
 */

const fs = require('fs')
const path = require('path')

const PROJECT_ROOT = path.resolve(__dirname, '..')
const PUBLISHERS_DIR = path.join(PROJECT_ROOT, 'publishers')
const OUT_PATH = path.join(PROJECT_ROOT, 'src/dev/articles/publisherBranches.generated.tsx')

function scanPublishers() {
  if (!fs.existsSync(PUBLISHERS_DIR)) return []
  return fs
    .readdirSync(PUBLISHERS_DIR, { withFileTypes: true })
    .filter(e => e.isDirectory() && !e.name.startsWith('.'))
    .map(e => e.name)
    .filter(name => fs.existsSync(path.join(PUBLISHERS_DIR, name, 'publisher.config.ts')))
}

const publishers = scanPublishers()
const constName = n => `__PUB_${n.toUpperCase()}__`

let body
if (publishers.length === 0) {
  body = `// 本地 publishers/ 为空（CI / 全新 clone）：全部导出为空对象
export const publisherConfigModules: Record<string, unknown> = {}
export const publisherArticleModules: Record<string, Record<string, unknown>> = {}
export const publisherImageModules: Record<string, string> = {}
export const publisherToolModules: Record<string, unknown> = {}
`
} else {
  const declares = publishers.map(n => `declare const ${constName(n)}: boolean`).join('\n')
  const configBranches = publishers
    .map(n => `  ...(${constName(n)} ? import.meta.glob('/publishers/${n}/publisher.config.ts', { eager: true }) : {}),`)
    .join('\n')
  const articleBranches = publishers
    .map(n => `  ...(${constName(n)}\n    ? import.meta.glob('/publishers/${n}/**/*.{tsx,jsx,mdx}', { eager: true }) as Record<string, Record<string, unknown>>\n    : {}),`)
    .join('\n')
  const imageBranches = publishers
    .map(n => `  ...(${constName(n)} ? import.meta.glob('/publishers/${n}/**/*.{png,jpg,jpeg,svg,gif,webp}', { eager: true, import: 'default' }) as Record<string, string> : {}),`)
    .join('\n')
  const toolBranches = publishers
    .map(n => `  ...(${constName(n)} ? import.meta.glob('/publishers/${n}/tools/*/index.tsx', { eager: true }) : {}),`)
    .join('\n')

  body = `// 选择性构建守卫（vite define 同源注入，勿手改）
${declares}

/** 各 publisher 的 publisher.config.ts 模块（key 为 /publishers/<name>/publisher.config.ts） */
export const publisherConfigModules: Record<string, unknown> = {
${configBranches}
}

/** 各 publisher 的全部源文件模块（文章扫描用，key 为文件路径） */
export const publisherArticleModules: Record<string, Record<string, unknown>> = {
${articleBranches}
}

/** 各 publisher 的图片资源（key 为文件路径，value 为构建后 URL） */
export const publisherImageModules: Record<string, string> = {
${imageBranches}
}

/** 各 publisher 的工具组件模块（key 为 /publishers/<name>/tools/<toolId>/index.tsx） */
export const publisherToolModules: Record<string, unknown> = {
${toolBranches}
}
`
}

const header = `// ⚠️ 自动生成（scripts/generate-publisher-branches.cjs）——勿手改、勿提交（已 gitignore）
// 含本地 publisher 真实目录名，仅存在于本地磁盘 / CI 构建现场。
`

fs.writeFileSync(OUT_PATH, header + body + '\n')
console.log(`[gen-pub-branches] ${OUT_PATH}（${publishers.length} 个 publisher）`)

#!/usr/bin/env node
/**
 * CI 认证预置（preinstall）——安装私有包 @guohub8080/expub-tool 的前置条件。
 *
 * 背景：pnpm 出于防投毒考虑，不展开项目级 .npmrc 里的 ${ENV} 凭据；且 pnpm 的
 * fetch（下载 tarball，私有包 401 在此发生）**先于** preinstall 等生命周期脚本，
 * 所以本脚本必须被显式前置到安装命令：`node scripts/ci-auth.mjs && pnpm install`
 * （GH 工作流、Vercel vercel.json 的 installCommand、CF/Netlify 的安装命令均已如此）。
 * package.json 里保留的 preinstall 挂钩是兜底无害项：无 NODE_AUTH_TOKEN 时 no-op。
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const token = process.env.NODE_AUTH_TOKEN

// 幂等：清掉本脚本写过的旧行再追加（不触碰用户手写的其他行）
const NPMRC = path.join(os.homedir(), '.npmrc')
const LINE = '//npm.pkg.github.com/:_authToken='

if (token !== undefined && token.length > 0) {
  const existing = fs.existsSync(NPMRC) ? fs.readFileSync(NPMRC, 'utf-8') : ''
  const kept = existing.split('\n').filter((l) => !l.startsWith(LINE))
  kept.push(LINE + token)
  fs.writeFileSync(NPMRC, kept.join('\n').replace(/\n{2,}$/, '') + '\n')
  console.log('[ci-auth] NODE_AUTH_TOKEN 检测到，已写入用户级 .npmrc（GitHub Packages）')
} else {
  console.log('[ci-auth] 无 NODE_AUTH_TOKEN，跳过（本地/无需认证环境）')
}

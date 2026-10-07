/**
 * Netlify 私有包认证插件——onPreBuild 在 Netlify 安装依赖**之前**执行，
 * 恰好是写认证的时机（项目级 .npmrc 的 ${ENV} 凭据不被 pnpm 展开，
 * 自动安装阶段又无法前置 shell 命令，故用官方插件钩子）。
 * 本地/无变量环境 no-op。.cjs：项目 package.json 为 type:module，
 * CommonJS 插件必须显式扩展名。
 */
module.exports = {
  onPreBuild: () => {
    const fs = require('node:fs')
    const os = require('node:os')
    const path = require('node:path')

    const token = process.env.NODE_AUTH_TOKEN
    const PREFIX = '//npm.pkg.github.com/:_authToken='

    if (token === undefined || token.length === 0) {
      console.log('[netlify-auth] 无 NODE_AUTH_TOKEN，跳过')
      return
    }

    const npmrc = path.join(os.homedir(), '.npmrc')
    const existing = fs.existsSync(npmrc) ? fs.readFileSync(npmrc, 'utf-8') : ''
    const kept = existing.split('\n').filter((l) => !l.startsWith(PREFIX))
    kept.push(PREFIX + token)
    fs.writeFileSync(npmrc, kept.join('\n').replace(/\n{2,}$/, '') + '\n')
    console.log('[netlify-auth] NODE_AUTH_TOKEN 已写入用户级 .npmrc')
  },
}

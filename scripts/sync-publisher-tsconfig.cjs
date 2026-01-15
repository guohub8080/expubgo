#!/usr/bin/env node
/**
 * 扫描 publishers/ 目录，自动更新 tsconfig.publisher.json 的 paths
 *
 * 规则：
 * - 读取 publisher.config.ts 中的 alias 配置
 * - 指向该目录下的相对路径
 */

const fs = require('fs')
const path = require('path')

const PROJECT_ROOT = path.resolve(__dirname, '..')
const TSCONFIG_PATH = path.join(PROJECT_ROOT, 'tsconfig.publisher.json')
const PUBLISHERS_DIR = path.join(PROJECT_ROOT, 'publishers')

// 需要保留的非 publisher 路径别名
const STATIC_PATHS = {
  "@/*": ["./src/*"],
  "@dev/*": ["./src/dev/*"],
  "@apps/*": ["./src/dev/apps/*"],
  "@comps/*": ["./src/dev/components/*"],
  "@assets/*": ["./src/dev/assets/*"],
  "@utils/*": ["./src/dev/utils/*"],
  "@vite-dev/*": ["./src/dev/utils/vite-dev/*"],
  "@api/*": ["./src/dev/api/*"],
  "@styles/*": ["./src/dev/styles/*"],
  "@pub-html/*": ["./src/dev/pubComponents/PureHTML/*"],
  "@pub-svg/*": ["./src/dev/pubComponents/SVG/*"],
  "@sns/*": ["./src/dev/pubComponents/SnsTemplate/*"],
  "@pub-utils/*": ["src/dev/pubUtils/*"],
  "@svg-anim": ["src/dev/pubUtils/genSvgAnimate"],
  "@svg-anim/*": ["src/dev/pubUtils/genSvgAnimate/*"],
  "@svg-set/*": ["src/dev/pubUtils/genSvgAnimate/set/*"],
  "@book-svg-tool/*": ["./src/books/SvgToolFunctions/*"],
  "@book-comps": ["./src/dev/components/bookComponents"],
  "@book-comps/*": ["./src/dev/components/bookComponents/*"],
  "@shadcn/*": ["./src/dev/shadcn/*"],
  "@books/*": ["./src/books/*"],
  "@articles/*": ["./src/articles/*"],
  "@publishers/*": ["./publishers/*"],
  "@music12doc/*": ["./src/books/Music12Document/*"],
  "@tonicml/*": ["./src/dev/tonicml/*"],
  "@mdx/*": ["./src/dev/components/mdx/*"],
}

// 静态别名 key 集合（用于冲突检测）
const STATIC_ALIAS_KEYS = new Set(Object.keys(STATIC_PATHS))

function scanPublishers() {
  const paths = {}
  const usedNames = new Set() // 检测 publisher 之间的重名

  if (!fs.existsSync(PUBLISHERS_DIR)) {
    return paths
  }

  // 只扫描 publishers/ 的直接子目录，不递归进入下级
  for (const dirName of fs.readdirSync(PUBLISHERS_DIR)) {
    const fullPath = path.join(PUBLISHERS_DIR, dirName)
    const stat = fs.statSync(fullPath)

    if (!stat.isDirectory() || dirName.startsWith('.')) {
      continue
    }

    // 读取 publisher.config.ts（扫描终点：有此文件的目录即为一个 publisher）
    const configPath = path.join(fullPath, 'publisher.config.ts')
    if (!fs.existsSync(configPath)) {
      throw new Error(
        `[sync] 缺少配置：publisher "${dirName}" 目录下未找到 publisher.config.ts`
      )
    }

    // 用正则解析 alias 对象
    const configContent = fs.readFileSync(configPath, 'utf-8')
    const aliasMatch = configContent.match(/alias\s*:\s*\{([^}]+)\}/s)
    if (!aliasMatch) {
      throw new Error(
        `[sync] 配置错误：${dirName}/publisher.config.ts 中未找到 alias 对象`
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
      const aliasKey = `${aliasName}/*`

      // 冲突检测 1：与静态别名重复
      if (STATIC_ALIAS_KEYS.has(aliasKey)) {
        throw new Error(
          `[sync] 别名冲突：publisher "${dirName}" 声明的 ${aliasName} 与静态别名冲突，请修改 publisher.config.ts`
        )
      }

      // 冲突检测 2：与其他 publisher 的别名重名
      if (usedNames.has(aliasName)) {
        throw new Error(
          `[sync] 别名冲突：${aliasName} 已被其他 publisher 使用，请修改 ${dirName}/publisher.config.ts`
        )
      }
      usedNames.add(aliasName)

      // 解析相对路径
      const targetDir = path.join('publishers', dirName, relativePath)

      // 添加精确匹配别名（如 @demo → .../components）
      paths[aliasName] = [`./${targetDir}`]
      console.log(`[sync] ${aliasName} → ./${targetDir}`)

      // 添加 /* 前缀匹配别名（如 @demo/xxx → .../components/xxx）
      paths[aliasKey] = [`./${targetDir}/*`]
      console.log(`[sync] ${aliasKey} → ./${targetDir}/*`)
    }

    if (!found) {
      throw new Error(
        `[sync] 配置错误：${dirName}/publisher.config.ts 中的 alias 对象格式不正确，应为 { "@别名": "./路径" }`
      )
    }
  }

  return paths
}

function updateTsConfig() {
  // tsconfig.publisher.json 是 gitignore 的生成物：CI / 全新 clone 上不存在，
  // 此时以最小骨架初始化（与本地生成物结构一致），避免 readFileSync ENOENT 中断构建
  const tsConfig = fs.existsSync(TSCONFIG_PATH)
    ? JSON.parse(fs.readFileSync(TSCONFIG_PATH, 'utf-8'))
    : { compilerOptions: { baseUrl: '.' } }

  const publisherPaths = scanPublishers()

  tsConfig.compilerOptions = tsConfig.compilerOptions || {}
  tsConfig.compilerOptions.paths = {
    ...STATIC_PATHS,
    ...publisherPaths,
  }

  fs.writeFileSync(TSCONFIG_PATH, JSON.stringify(tsConfig, null, 2) + '\n')
  console.log('[sync] tsconfig.publisher.json 已更新')
}

updateTsConfig()

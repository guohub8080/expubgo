/**
 * 获取 public 目录资源的正确 URL
 *
 * 适配任何 base 配置（/、./、/expubgo/ 等）
 * 使用方式：
 *   <img src={publicAssetUrl('logo.png')} />
 *   <link href={publicAssetUrl('fonts/myfont.woff2')} />
 */
export function publicAssetUrl(path: string): string {
  // 统一去掉前导 /
  const cleanPath = path.startsWith('/') ? path.slice(1) : path

  // Vite 注入的 base URL
  const base = import.meta.env.BASE_URL || '/'

  // 相对路径模式：直接返回文件名
  if (base === './' || base === '') {
    return cleanPath
  }

  // 绝对路径模式：拼接 base 前缀
  const prefix = base.endsWith('/') ? base.slice(0, -1) : base
  return `${prefix}/${cleanPath}`
}

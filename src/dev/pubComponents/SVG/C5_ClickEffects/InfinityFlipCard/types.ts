/**
 * InfinityFlipCard - 无限循环翻转卡片
 * Types 定义
 */

import type { mpProps } from "@styles/funcs/mp"

export interface InfinityFlipCardProps {
  /** 背景图 URL（底层静态背景） */
  bgUrl?: string
  /** 背面图片 URL */
  backUrl: string
  /** 正面图片 URL */
  frontUrl: string
  /** ViewBox 宽度（可选），默认 750 */
  viewBoxW?: number
  /** ViewBox 高度（可选），默认 850 */
  viewBoxH?: number
  /** 动画时长倍数（可选），默认 1 表示原始时长 */
  durationSeconds?: number
  /** margin/padding 快捷配置 */
  mp?: mpProps
}

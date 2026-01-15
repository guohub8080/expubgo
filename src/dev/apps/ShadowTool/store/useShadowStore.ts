import { atom } from "jotai"

// 阴影类型
export type ShadowType = 'box-shadow' | 'filter'

// 输出格式
export type OutputFormat = 'css' | 'react'

// 阴影配置
export interface ShadowConfig {
	type: ShadowType
	offsetX: number
	offsetY: number
	blur: number
	spread: number // 仅 box-shadow 使用
	color: string
	inset: boolean // 仅 box-shadow 使用
	outputFormat: OutputFormat
}

export const defaultConfig: ShadowConfig = {
	type: 'box-shadow',
	offsetX: 0,
	offsetY: 4,
	blur: 8,
	spread: 0,
	color: 'rgba(0, 0, 0, 0.25)',
	inset: false,
	outputFormat: 'css',
}

// 当前阴影配置
export const shadowConfigAtom = atom<ShadowConfig>(defaultConfig)

// 更新：partial 合并
export const updateShadowConfigAtom = atom(
	null,
	(get, set, updates: Partial<ShadowConfig>) => {
		set(shadowConfigAtom, { ...get(shadowConfigAtom), ...updates })
	}
)

// 重置
export const resetShadowConfigAtom = atom(null, (_get, set) => {
	set(shadowConfigAtom, defaultConfig)
})

import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

// SVG转换配置接口
export interface SvgConverterSettings {
	componentName: string
	widthHeightHandling: 'preserve' | 'remove' | '100percent'
	importStatement: string
	flattenStyles: boolean
	convertStyleToObject: boolean
	removeIds: boolean
	prettier: boolean
	functionType: 'arrow-implicit' | 'arrow-explicit' | 'function'
	exportType: 'default' | 'named' | 'both'
}

// PropsSettings 用到的属性配置类型
export interface PropDetailConfig {
	type: 'string' | 'number' | 'boolean' | 'ReactNode' | 'function' | 'object' | 'array' | 'enum'
	required: boolean
	default?: string
	enumValues?: string[]
	description?: string
}

export type PropsAccessType = 'public' | 'private' | 'protected'

// 默认配置
const defaultSettings: SvgConverterSettings = {
	componentName: 'SvgComponent',
	widthHeightHandling: 'preserve',
	importStatement: "import React from 'react';",
	flattenStyles: false,
	convertStyleToObject: false,
	removeIds: false,
	prettier: true,
	functionType: 'arrow-implicit',
	exportType: 'default',
}

// ────── settings（整体持久化）──────
export const settingsAtom = atomWithStorage<SvgConverterSettings>('svg-converter.settings', defaultSettings)

export const updateSettingsAtom = atom(
	null,
	(get, set, newSettings: Partial<SvgConverterSettings>) => {
		set(settingsAtom, { ...get(settingsAtom), ...newSettings })
	}
)

export const resetSettingsAtom = atom(null, (_get, set) => {
	set(settingsAtom, defaultSettings)
})

// ────── state：svgInput / converting 纯内存 ──────
export const svgInputAtom = atom<string>('')

// ────── state：reactOutput / consoleLogs 持久化 ──────
export const reactOutputAtom = atomWithStorage<string>('svg-converter.reactOutput', '')
export const consoleLogsAtom = atomWithStorage<string[]>('svg-converter.consoleLogs', [])

export const addConsoleLogAtom = atom(
	null,
	(get, set, log: string) => {
		set(consoleLogsAtom, [...get(consoleLogsAtom), log])
	}
)

export const clearConsoleLogsAtom = atom(null, (get, set) => {
	set(consoleLogsAtom, [])
})

// converting 纯内存（旧 onRehydrateStorage 强制 false，atom 默认就是 false，天然复刻）
export const convertingAtom = atom<boolean>(false)

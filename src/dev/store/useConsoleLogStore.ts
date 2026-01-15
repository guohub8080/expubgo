import { atom, getDefaultStore } from "jotai"

export interface ConsoleLogEntry {
	message: string
	level: 'log' | 'info' | 'warn' | 'error' | 'debug'
	timestamp: number
	url: string
	line?: number
	column?: number
}

const MAX_LOGS = 1000

// 日志数组（纯内存，不持久化）
export const logsAtom = atom<ConsoleLogEntry[]>([])

// ---- 非 React 工具函数（供 utils/logger、utils/consoleLogger、ErrorBoundary 用）----
// 用 getDefaultStore 保持原有的同步 getState() 调用语义

/** 追加一条日志，超过上限截断最旧的 */
export function addLog(log: ConsoleLogEntry): void {
	const store = getDefaultStore()
	const logs = store.get(logsAtom)
	const newLogs = [...logs, log]
	store.set(logsAtom, newLogs.length > MAX_LOGS ? newLogs.slice(-MAX_LOGS) : newLogs)
}

/** 取全部日志（同步） */
export function getLogs(): ConsoleLogEntry[] {
	return getDefaultStore().get(logsAtom)
}

/** 取格式化的日志字符串（同步） */
export function getFormattedLogs(): string {
	return getDefaultStore().get(logsAtom).map((log) => {
		const timestamp = new Date(log.timestamp).toLocaleTimeString()
		const level = log.level.toUpperCase()
		return `[${timestamp}] [${level}] ${log.message}`
	}).join('\n')
}

/** 清空日志 */
export function clearLogs(): void {
	getDefaultStore().set(logsAtom, [])
}

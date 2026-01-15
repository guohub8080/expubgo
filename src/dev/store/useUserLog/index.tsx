import { atom, useAtomValue, getDefaultStore } from "jotai"
import { atomWithStorage } from "jotai/utils"
import type { UserInfo } from "./types.ts"
import { DEFAULT_VALUES } from "./defaultValues.ts"

// ────── 持久化的数据字段（白名单：5 字段全部持久化）──────
export const apiBaseUrlAtom = atomWithStorage<string>('user-log.apiBaseUrl', DEFAULT_VALUES.apiBaseUrl)
export const jwtTokenAtom = atomWithStorage<string>('user-log.jwtToken', DEFAULT_VALUES.jwtToken)
export const tokenExpiresAtAtom = atomWithStorage<number | null>('user-log.tokenExpiresAt', DEFAULT_VALUES.tokenExpiresAt)
export const userInfoAtom = atomWithStorage<UserInfo | null>('user-log.userInfo', DEFAULT_VALUES.userInfo)

// isLoggedIn 改为 derived atom（基于 jwtToken 派生，不再单独存）
export const isLoggedInAtom = atom((get) => get(jwtTokenAtom).length > 0)

// ────── 非 React 工具函数（供 api/client.ts 在 fetch 拦截器里同步读写）──────
export const userLogStore = {
	getState() {
		const store = getDefaultStore()
		return {
			apiBaseUrl: store.get(apiBaseUrlAtom),
			jwtToken: store.get(jwtTokenAtom),
			tokenExpiresAt: store.get(tokenExpiresAtAtom),
			userInfo: store.get(userInfoAtom),
			isLoggedIn: store.get(isLoggedInAtom),
			/** 同步重置多个字段 */
			set(patch: Partial<{
				apiBaseUrl: string
				jwtToken: string
				tokenExpiresAt: number | null
				userInfo: UserInfo | null
				isLoggedIn: boolean
			}>) {
				const s = getDefaultStore()
				if ('apiBaseUrl' in patch) s.set(apiBaseUrlAtom, patch.apiBaseUrl!)
				if ('jwtToken' in patch) s.set(jwtTokenAtom, patch.jwtToken!)
				if ('tokenExpiresAt' in patch) s.set(tokenExpiresAtAtom, patch.tokenExpiresAt!)
				if ('userInfo' in patch) s.set(userInfoAtom, patch.userInfo!)
			},
			/** 登出（清空 token/userInfo/expiresAt）*/
			logout() {
				const s = getDefaultStore()
				s.set(jwtTokenAtom, '')
				s.set(userInfoAtom, null)
				s.set(tokenExpiresAtAtom, null)
			},
		}
	},
}

/**
 * 用户登录状态 Hook
 * 返回一个对象，含数据字段 + 各操作方法（兼容旧调用方 `const { ... } = useUserLog()`）
 */
export default function useUserLog() {
	const apiBaseUrl = useAtomValue(apiBaseUrlAtom)
	const jwtToken = useAtomValue(jwtTokenAtom)
	const tokenExpiresAt = useAtomValue(tokenExpiresAtAtom)
	const userInfo = useAtomValue(userInfoAtom)
	const isLoggedIn = useAtomValue(isLoggedInAtom)

	return {
		apiBaseUrl,
		jwtToken,
		tokenExpiresAt,
		userInfo,
		isLoggedIn,

		setApiBaseUrl: (url: string) => getDefaultStore().set(apiBaseUrlAtom, url),

		setJwtToken: (token: string) => getDefaultStore().set(jwtTokenAtom, token),

		setTokenExpiresAt: (expiresAt: number | null) => getDefaultStore().set(tokenExpiresAtAtom, expiresAt),

		setUserInfo: (info: UserInfo | null) => getDefaultStore().set(userInfoAtom, info),

		login: (token: string, info?: UserInfo, expiresAt?: number) => {
			const store = getDefaultStore()
			store.set(jwtTokenAtom, token)
			store.set(userInfoAtom, info ?? null)
			store.set(tokenExpiresAtAtom, expiresAt ?? null)
		},

		logout: () => {
			const store = getDefaultStore()
			store.set(jwtTokenAtom, '')
			store.set(userInfoAtom, null)
			store.set(tokenExpiresAtAtom, null)
		},

		resetStore: () => {
			const store = getDefaultStore()
			store.set(apiBaseUrlAtom, DEFAULT_VALUES.apiBaseUrl)
			store.set(jwtTokenAtom, DEFAULT_VALUES.jwtToken)
			store.set(tokenExpiresAtAtom, DEFAULT_VALUES.tokenExpiresAt)
			store.set(userInfoAtom, DEFAULT_VALUES.userInfo)
		},
	}
}

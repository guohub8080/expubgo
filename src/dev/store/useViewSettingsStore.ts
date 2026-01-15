import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

/**
 * 视图设置 atoms
 * bgColor/viewPadding 持久化；articleScroll/maxScroll 纯内存
 */

// 持久化字段
export const bgColorAtom = atomWithStorage<string>('view-settings.bgColor', "#A8A8A8")
export const viewPaddingAtom = atomWithStorage<number>('view-settings.viewPadding', 20)

// 内存字段
export const articleScrollAtom = atom<number>(0)
export const maxScrollAtom = atom<number>(0)

import { useEffect } from 'react';
import { atom, useAtomValue, getDefaultStore } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { isUndefined } from "es-toolkit/predicate"
import type { ThemeMode, BackgroundMode } from './types.ts';
import { DEFAULT_VALUES } from './defaultValues.ts';
import { buildThemeFontStack, buildCodeFontStack, buildJapaneseFontStack } from './fontStackBuilder.ts';
import { ensureWebfont } from './webfontLoader.ts';

// ============================================================
// 主题副作用（应用到 DOM，监听系统主题）
// ============================================================

/** 应用主题到 DOM */
const applyTheme = (theme: ThemeMode) => {
	if (isUndefined(document)) return;
	const root = document.documentElement;
	if (theme === 'system') {
		const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
		root.setAttribute('data-theme', systemTheme);
	} else {
		root.setAttribute('data-theme', theme);
	}
};

let systemThemeListener: ((e: MediaQueryListEvent) => void) | null = null;

const setupSystemThemeListener = (theme: ThemeMode) => {
	if (isUndefined(window)) return;
	const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
	if (systemThemeListener) {
		mediaQuery.removeEventListener('change', systemThemeListener);
		systemThemeListener = null;
	}
	if (theme === 'system') {
		systemThemeListener = (e: MediaQueryListEvent) => {
			const root = document.documentElement;
			root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
		};
		mediaQuery.addEventListener('change', systemThemeListener);
	}
};

// ============================================================
// 持久化的数据字段（atomWithStorage，与 migrate 工具的 key 一致）
// ============================================================
const st = <T,>(key: string, def: T) => atomWithStorage<T>(`global-settings.${key}`, def);

export const themeAtom = st<ThemeMode>('theme', DEFAULT_VALUES.theme);
export const mainDynamicBackroundAtom = st<BackgroundMode>('mainDynamicBackround', DEFAULT_VALUES.mainDynamicBackround);
export const navigationHeightAtom = st<number>('navigationHeight', DEFAULT_VALUES.navigationHeight);
export const chineseFontFamilyAtom = st<string | null>('chineseFontFamily', DEFAULT_VALUES.chineseFontFamily);
export const englishFontFamilyAtom = st<string | null>('englishFontFamily', DEFAULT_VALUES.englishFontFamily);
export const codeFontFamilyAtom = st<string | null>('codeFontFamily', DEFAULT_VALUES.codeFontFamily);
export const japaneseFontFamilyAtom = st<string | null>('japaneseFontFamily', DEFAULT_VALUES.japaneseFontFamily);
export const fontWeightLightAtom = st<number>('fontWeightLight', DEFAULT_VALUES.fontWeightLight);
export const fontWeightNormalAtom = st<number>('fontWeightNormal', DEFAULT_VALUES.fontWeightNormal);
export const fontWeightMediumAtom = st<number>('fontWeightMedium', DEFAULT_VALUES.fontWeightMedium);
export const fontWeightSemiboldAtom = st<number>('fontWeightSemibold', DEFAULT_VALUES.fontWeightSemibold);
export const fontWeightBoldAtom = st<number>('fontWeightBold', DEFAULT_VALUES.fontWeightBold);
export const articleLineHeightAtom = st<number>('articleLineHeight', DEFAULT_VALUES.articleLineHeight);
export const bookSideWidthAtom = st<number>('bookSideWidth', DEFAULT_VALUES.bookSideWidth);
export const bookContentWidthAtom = st<number>('bookContentWidth', DEFAULT_VALUES.bookContentWidth);
export const bookContentPaddingAtom = st<number>('bookContentPadding', DEFAULT_VALUES.bookContentPadding);
export const bookSideContentGapAtom = st<number>('bookSideContentGap', DEFAULT_VALUES.bookSideContentGap);
export const isBookTocShowAtom = st<boolean>('isBookTocShow', DEFAULT_VALUES.isBookTocShow);

// 纯内存字段（不持久化）
export const isBookPageAtom = atom<boolean>(DEFAULT_VALUES.isBookPage);
export const lastVisitedUrlAtom = atom<string>(DEFAULT_VALUES.lastVisitedUrl);
export const isNavigationPanelOpenAtom = atom<boolean>(DEFAULT_VALUES.isNavigationPanelOpen);

// ============================================================
// 非 React 调用兼容（books loader 用 globalSettingsStore.getState().setIsBookPage）
// ============================================================
export const globalSettingsStore = {
	getState() {
		const s = getDefaultStore()
		return {
			setIsBookPage: (v: boolean) => s.set(isBookPageAtom, v),
		}
	},
}

// ============================================================
// React hook（兼容旧调用：const { theme, setTheme, ... } = useGlobalSettings()）
// 默认导出，含数据字段 + 全部操作方法
// ============================================================
export default function useGlobalSettings() {
	const theme = useAtomValue(themeAtom)
	const mainDynamicBackround = useAtomValue(mainDynamicBackroundAtom)
	const navigationHeight = useAtomValue(navigationHeightAtom)
	const chineseFontFamily = useAtomValue(chineseFontFamilyAtom)
	const englishFontFamily = useAtomValue(englishFontFamilyAtom)
	const codeFontFamily = useAtomValue(codeFontFamilyAtom)
	const japaneseFontFamily = useAtomValue(japaneseFontFamilyAtom)
	const fontWeightLight = useAtomValue(fontWeightLightAtom)
	const fontWeightNormal = useAtomValue(fontWeightNormalAtom)
	const fontWeightMedium = useAtomValue(fontWeightMediumAtom)
	const fontWeightSemibold = useAtomValue(fontWeightSemiboldAtom)
	const fontWeightBold = useAtomValue(fontWeightBoldAtom)
	const articleLineHeight = useAtomValue(articleLineHeightAtom)
	const bookSideWidth = useAtomValue(bookSideWidthAtom)
	const bookContentWidth = useAtomValue(bookContentWidthAtom)
	const bookContentPadding = useAtomValue(bookContentPaddingAtom)
	const bookSideContentGap = useAtomValue(bookSideContentGapAtom)
	const isBookTocShow = useAtomValue(isBookTocShowAtom)
	const isBookPage = useAtomValue(isBookPageAtom)
	const lastVisitedUrl = useAtomValue(lastVisitedUrlAtom)
	const isNavigationPanelOpen = useAtomValue(isNavigationPanelOpenAtom)

	// tsx 里泛型箭头函数会与 JSX 冲突，用普通 function 声明
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function setAtom(a: any, v: unknown) { getDefaultStore().set(a, v) }

	return {
		theme, mainDynamicBackround, navigationHeight,
		chineseFontFamily, englishFontFamily, codeFontFamily, japaneseFontFamily,
		fontWeightLight, fontWeightNormal, fontWeightMedium, fontWeightSemibold, fontWeightBold,
		articleLineHeight,
		bookSideWidth, bookContentWidth, bookContentPadding, bookSideContentGap,
		isBookTocShow, isBookPage, lastVisitedUrl, isNavigationPanelOpen,

		setTheme: (t: ThemeMode) => { applyTheme(t); setupSystemThemeListener(t); setAtom(themeAtom, t) },
		toggleTheme: () => {
			const s = getDefaultStore()
			const newTheme: ThemeMode = s.get(themeAtom) === 'dark' ? 'light' : 'dark'
			applyTheme(newTheme); setupSystemThemeListener(newTheme)
			s.set(themeAtom, newTheme)
		},
		setMainDynamicBackround: (bg: BackgroundMode) => setAtom(mainDynamicBackroundAtom, bg),
		setNavigationHeight: (h: number) => setAtom(navigationHeightAtom, h),
		setChineseFontFamily: (f: string | null) => setAtom(chineseFontFamilyAtom, f),
		setEnglishFontFamily: (f: string | null) => setAtom(englishFontFamilyAtom, f),
		setCodeFontFamily: (f: string | null) => setAtom(codeFontFamilyAtom, f),
		setJapaneseFontFamily: (f: string | null) => setAtom(japaneseFontFamilyAtom, f),
		setFontWeightLight: (w: number) => setAtom(fontWeightLightAtom, w),
		setFontWeightNormal: (w: number) => setAtom(fontWeightNormalAtom, w),
		setFontWeightMedium: (w: number) => setAtom(fontWeightMediumAtom, w),
		setFontWeightSemibold: (w: number) => setAtom(fontWeightSemiboldAtom, w),
		setFontWeightBold: (w: number) => setAtom(fontWeightBoldAtom, w),
		setArticleLineHeight: (h: number) => setAtom(articleLineHeightAtom, h),
		setBookSideWidth: (w: number) => setAtom(bookSideWidthAtom, w),
		setBookContentWidth: (w: number) => setAtom(bookContentWidthAtom, w),
		setBookContentPadding: (p: number) => setAtom(bookContentPaddingAtom, p),
		setBookSideContentGap: (g: number) => setAtom(bookSideContentGapAtom, g),
		setIsBookTocShow: (s: boolean) => setAtom(isBookTocShowAtom, s),
		toggleBookTocShow: () => { const st = getDefaultStore(); st.set(isBookTocShowAtom, !st.get(isBookTocShowAtom)) },
		setIsBookPage: (b: boolean) => setAtom(isBookPageAtom, b),
		setLastVisitedUrl: (u: string) => setAtom(lastVisitedUrlAtom, u),
		setIsNavigationPanelOpen: (o: boolean) => setAtom(isNavigationPanelOpenAtom, o),
		toggleNavigationPanel: () => { const st = getDefaultStore(); st.set(isNavigationPanelOpenAtom, !st.get(isNavigationPanelOpenAtom)) },
		resetStore: () => {
			const s = getDefaultStore()
			s.set(themeAtom, DEFAULT_VALUES.theme)
			s.set(mainDynamicBackroundAtom, DEFAULT_VALUES.mainDynamicBackround)
			s.set(navigationHeightAtom, DEFAULT_VALUES.navigationHeight)
			s.set(chineseFontFamilyAtom, DEFAULT_VALUES.chineseFontFamily)
			s.set(englishFontFamilyAtom, DEFAULT_VALUES.englishFontFamily)
			s.set(codeFontFamilyAtom, DEFAULT_VALUES.codeFontFamily)
			s.set(japaneseFontFamilyAtom, DEFAULT_VALUES.japaneseFontFamily)
			s.set(fontWeightLightAtom, DEFAULT_VALUES.fontWeightLight)
			s.set(fontWeightNormalAtom, DEFAULT_VALUES.fontWeightNormal)
			s.set(fontWeightMediumAtom, DEFAULT_VALUES.fontWeightMedium)
			s.set(fontWeightSemiboldAtom, DEFAULT_VALUES.fontWeightSemibold)
			s.set(fontWeightBoldAtom, DEFAULT_VALUES.fontWeightBold)
			s.set(articleLineHeightAtom, DEFAULT_VALUES.articleLineHeight)
			s.set(bookSideWidthAtom, DEFAULT_VALUES.bookSideWidth)
			s.set(bookContentWidthAtom, DEFAULT_VALUES.bookContentWidth)
			s.set(bookContentPaddingAtom, DEFAULT_VALUES.bookContentPadding)
			s.set(bookSideContentGapAtom, DEFAULT_VALUES.bookSideContentGap)
			s.set(isBookTocShowAtom, DEFAULT_VALUES.isBookTocShow)
		},
		resetFontSettings: () => {
			const s = getDefaultStore()
			s.set(chineseFontFamilyAtom, DEFAULT_VALUES.chineseFontFamily)
			s.set(englishFontFamilyAtom, DEFAULT_VALUES.englishFontFamily)
			s.set(codeFontFamilyAtom, DEFAULT_VALUES.codeFontFamily)
			s.set(japaneseFontFamilyAtom, DEFAULT_VALUES.japaneseFontFamily)
			s.set(fontWeightLightAtom, DEFAULT_VALUES.fontWeightLight)
			s.set(fontWeightNormalAtom, DEFAULT_VALUES.fontWeightNormal)
			s.set(fontWeightMediumAtom, DEFAULT_VALUES.fontWeightMedium)
			s.set(fontWeightSemiboldAtom, DEFAULT_VALUES.fontWeightSemibold)
			s.set(fontWeightBoldAtom, DEFAULT_VALUES.fontWeightBold)
			s.set(articleLineHeightAtom, DEFAULT_VALUES.articleLineHeight)
		},
		resetBookSettings: () => {
			const s = getDefaultStore()
			s.set(bookSideWidthAtom, DEFAULT_VALUES.bookSideWidth)
			s.set(bookContentWidthAtom, DEFAULT_VALUES.bookContentWidth)
			s.set(bookContentPaddingAtom, DEFAULT_VALUES.bookContentPadding)
			s.set(bookSideContentGapAtom, DEFAULT_VALUES.bookSideContentGap)
			s.set(isBookTocShowAtom, DEFAULT_VALUES.isBookTocShow)
		},
	}
}

// ============================================================
// 副作用 Effect 组件（挂载到 app root，订阅 atom 写 CSS 变量 / 应用主题）
// 替代旧 store 的 onRehydrateStorage + 默认导出里的两个 useEffect
// ============================================================
export function GlobalSettingsEffects() {
	const theme = useAtomValue(themeAtom)
	const chineseFontFamily = useAtomValue(chineseFontFamilyAtom)
	const englishFontFamily = useAtomValue(englishFontFamilyAtom)
	const codeFontFamily = useAtomValue(codeFontFamilyAtom)
	const japaneseFontFamily = useAtomValue(japaneseFontFamilyAtom)
	const fontWeightLight = useAtomValue(fontWeightLightAtom)
	const fontWeightNormal = useAtomValue(fontWeightNormalAtom)
	const fontWeightMedium = useAtomValue(fontWeightMediumAtom)
	const fontWeightSemibold = useAtomValue(fontWeightSemiboldAtom)
	const fontWeightBold = useAtomValue(fontWeightBoldAtom)

	// 主题变化（含首次 rehydrate 后应用）→ DOM
	useEffect(() => {
		applyTheme(theme)
		setupSystemThemeListener(theme)
	}, [theme])

	// 字体变化 → CSS 变量 + 按族懒注入 web 字体
	useEffect(() => {
		const themeFontStack = buildThemeFontStack(chineseFontFamily, englishFontFamily)
		document.documentElement.style.setProperty('--guohub-theme-font-family', themeFontStack)
		const codeFontStack = buildCodeFontStack(codeFontFamily, themeFontStack, chineseFontFamily, englishFontFamily)
		document.documentElement.style.setProperty('--guohub-code-font-family', codeFontStack)
		const japaneseFontStack = buildJapaneseFontStack(japaneseFontFamily, chineseFontFamily)
		document.documentElement.style.setProperty('--guohub-jp-font-family', japaneseFontStack)

		// 免流量：只为当前实际启用的 web 字体族注入 CSS（默认全系统栈 = 零字体流量）
		for (const family of [chineseFontFamily, englishFontFamily, codeFontFamily, japaneseFontFamily]) {
			ensureWebfont(family)
		}
	}, [chineseFontFamily, englishFontFamily, codeFontFamily, japaneseFontFamily])

	// 字重变化 → CSS 变量
	useEffect(() => {
		document.documentElement.style.setProperty('--font-light', String(fontWeightLight))
		document.documentElement.style.setProperty('--font-normal', String(fontWeightNormal))
		document.documentElement.style.setProperty('--font-medium', String(fontWeightMedium))
		document.documentElement.style.setProperty('--font-semibold', String(fontWeightSemibold))
		document.documentElement.style.setProperty('--font-bold', String(fontWeightBold))
	}, [fontWeightLight, fontWeightNormal, fontWeightMedium, fontWeightSemibold, fontWeightBold])

	return null
}

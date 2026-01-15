/**
 * 一次性迁移：把 Zustand persist 的单 key JSON 拆成 Jotai atomWithStorage 的多 key。
 *
 * Zustand persist 格式：localStorage["xxx"] = JSON.stringify({ state: {...}, version: 0 })
 * Jotai atomWithStorage 格式：localStorage["xxx.field"] = JSON.stringify(value)
 *
 * 迁移规则：读旧 key 的 state，按字段映射写入新 key，然后删旧 key。
 * 幂等：无旧 key 则跳过。迁移后旧 key 不再生成（新代码不再写它）。
 * 必须在 app 挂载、任何 atom 首次读 storage 之前执行（main.tsx 顶部）。
 */

// Zustand persist 的存储格式
interface ZustandPersistShape<T = Record<string, unknown>> {
	state: T
	version?: number
}

/**
 * 迁移单个旧 key：从 zustand persist 包裹的 JSON 中提取 state，按 fieldMap 拆分。
 * fieldMap: { 旧字段名: 新完整 key }
 */
function splitZustandKey(
	oldKey: string,
	fieldMap: Record<string, string>,
	defaults: Record<string, unknown>,
) {
	try {
		const raw = localStorage.getItem(oldKey)
		if (!raw) return // 无旧数据，跳过

		const parsed = JSON.parse(raw) as ZustandPersistShape
		// zustand persist 有时直接存裸 state（无 {state,version} 包裹），兼容两种
		const state = (parsed && parsed.state) ? parsed.state : parsed

		for (const [field, newKey] of Object.entries(fieldMap)) {
			// 新 key 已存在（之前已迁移过）则跳过，避免覆盖用户新设置
			if (localStorage.getItem(newKey) !== null) continue
			const value = field in state ? state[field] : defaults[field]
			if (value !== undefined) {
				localStorage.setItem(newKey, JSON.stringify(value))
			}
		}
		// 迁移完成，删旧 key
		localStorage.removeItem(oldKey)
		console.info(`[migrate] ${oldKey} → ${Object.keys(fieldMap).length} atoms`)
	} catch (e) {
		// 迁移失败保留旧 key，不影响启动
		console.warn(`[migrate] ${oldKey} 迁移失败，保留旧数据`, e)
	}
}

/**
 * 执行所有迁移。在 main.tsx 应用挂载前调用一次。
 */
export function migrateZustandStorage() {
	// 1. global-settings：排除 isBookPage/lastVisitedUrl/isNavigationPanelOpen，其余数据字段都迁移
	splitZustandKey('global-settings', {
		theme: 'global-settings.theme',
		mainDynamicBackround: 'global-settings.mainDynamicBackround',
		navigationHeight: 'global-settings.navigationHeight',
		chineseFontFamily: 'global-settings.chineseFontFamily',
		englishFontFamily: 'global-settings.englishFontFamily',
		codeFontFamily: 'global-settings.codeFontFamily',
		japaneseFontFamily: 'global-settings.japaneseFontFamily',
		fontWeightLight: 'global-settings.fontWeightLight',
		fontWeightNormal: 'global-settings.fontWeightNormal',
		fontWeightMedium: 'global-settings.fontWeightMedium',
		fontWeightSemibold: 'global-settings.fontWeightSemibold',
		fontWeightBold: 'global-settings.fontWeightBold',
		articleLineHeight: 'global-settings.articleLineHeight',
		bookSideWidth: 'global-settings.bookSideWidth',
		bookContentWidth: 'global-settings.bookContentWidth',
		bookContentPadding: 'global-settings.bookContentPadding',
		bookSideContentGap: 'global-settings.bookSideContentGap',
		isBookTocShow: 'global-settings.isBookTocShow',
	}, {})

	// 2. user-log：全部 4 数据字段（isLoggedIn 改为派生，不迁移）
	splitZustandKey('user-log', {
		apiBaseUrl: 'user-log.apiBaseUrl',
		jwtToken: 'user-log.jwtToken',
		tokenExpiresAt: 'user-log.tokenExpiresAt',
		userInfo: 'user-log.userInfo',
	}, {})

	// 3. view-settings-storage：bgColor/viewPadding
	splitZustandKey('view-settings-storage', {
		bgColor: 'view-settings.bgColor',
		viewPadding: 'view-settings.viewPadding',
	}, {})

	// 4. class-to-inline-store：htmlInput/cssInput
	splitZustandKey('class-to-inline-store', {
		htmlInput: 'class-to-inline.htmlInput',
		cssInput: 'class-to-inline.cssInput',
	}, {})

	// 5. svg-converter-store：settings 整体 + state.reactOutput + state.consoleLogs
	// 这个是嵌套结构，特殊处理
	splitZustandKeyNested('svg-converter-store', {
		'settings': 'svg-converter.settings',
		'state.reactOutput': 'svg-converter.reactOutput',
		'state.consoleLogs': 'svg-converter.consoleLogs',
	})

	// 6. post-generator-tree：只持久化了 tree 字段（partialize）
	splitZustandKey('post-generator-tree', {
		tree: 'post-generator.tree',
	}, {})

	// 7. pub-editor-storage（ArticleViewer）：持久化 8 字段（ref/移动端抽屉等不迁移）
	splitZustandKey('pub-editor-storage', {
		showSideList: 'pub-editor.showSideList',
		showActionPanel: 'pub-editor.showActionPanel',
		previewWidth: 'pub-editor.previewWidth',
		previewMaxWidth: 'pub-editor.previewMaxWidth',
		previewPadding: 'pub-editor.previewPadding',
		showPreviewBorder: 'pub-editor.showPreviewBorder',
		previewBorderColor: 'pub-editor.previewBorderColor',
		previewBackgroundColor: 'pub-editor.previewBackgroundColor',
	}, {})

	// 8. mockup3d-config 已废弃（Mockup3D 功能随 logiguo 架构对齐移除）——直接删旧 key
	localStorage.removeItem('mockup3d-config')
}

/** 嵌套字段提取（用于 svg-converter 的 state.reactOutput 这种） */
function splitZustandKeyNested(
	oldKey: string,
	fieldMap: Record<string, string>, // "state.reactOutput" → "new-key"
) {
	try {
		const raw = localStorage.getItem(oldKey)
		if (!raw) return
		const parsed = JSON.parse(raw) as ZustandPersistShape
		const state = (parsed && parsed.state) ? parsed.state : parsed

		for (const [dottedField, newKey] of Object.entries(fieldMap)) {
			if (localStorage.getItem(newKey) !== null) continue
			// 按点号路径取值
			const value = dottedField.split('.').reduce<unknown>((obj, key) =>
				(obj as Record<string, unknown>)?.[key], state)
			if (value !== undefined) {
				localStorage.setItem(newKey, JSON.stringify(value))
			}
		}
		localStorage.removeItem(oldKey)
		console.info(`[migrate] ${oldKey} → ${Object.keys(fieldMap).length} atoms (nested)`)
	} catch (e) {
		console.warn(`[migrate] ${oldKey} 迁移失败，保留旧数据`, e)
	}
}

import { atom, useAtomValue, useSetAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

/**
 * ArticleViewer 布局常量
 */
export const ARTICLE_VIEWER_LAYOUT = {
  SIDE_LIST_WIDTH: 320,      // 左侧文章列表宽度
  ACTION_PANEL_WIDTH: 320,   // 右侧操作面板宽度
  PREVIEW_MAX_WIDTH: 650,    // 预览区最大宽度
  PREVIEW_MIN_WIDTH: 300,    // 预览区最小宽度
  PREVIEW_DEFAULT_PADDING: 30, // 预览区默认内边距
} as const;

/**
 * ArticleViewer 状态管理（Jotai atoms）
 * 管理侧边栏的显示/隐藏状态（包括移动端抽屉）
 */

// ────── 持久化字段 ──────
const st = <T,>(key: string, def: T) => atomWithStorage<T>(`pub-editor.${key}`, def);

export const showSideListAtom = st<boolean>('showSideList', true);
export const showActionPanelAtom = st<boolean>('showActionPanel', true);
export const previewWidthAtom = st<number>('previewWidth', ARTICLE_VIEWER_LAYOUT.PREVIEW_MAX_WIDTH);
export const previewMaxWidthAtom = st<number>('previewMaxWidth', ARTICLE_VIEWER_LAYOUT.PREVIEW_MAX_WIDTH);
export const previewPaddingAtom = st<number>('previewPadding', ARTICLE_VIEWER_LAYOUT.PREVIEW_DEFAULT_PADDING);
export const showPreviewBorderAtom = st<boolean>('showPreviewBorder', false);
export const previewBorderColorAtom = st<string>('previewBorderColor', 'transparent');
export const previewBackgroundColorAtom = st<string>('previewBackgroundColor', '#ffffff');

// ────── 纯内存字段 ──────
export const mobileShowSideListAtom = atom<boolean>(false);
export const mobileShowActionPanelAtom = atom<boolean>(false);
export const showFullscreenMenuAtom = atom<boolean>(false);
// 预览区域最大可用宽度（根据容器动态计算）
export const previewMaxAvailableWidthAtom = atom<number>(ARTICLE_VIEWER_LAYOUT.PREVIEW_MAX_WIDTH);

// 预览区内容 DOM 引用：ref 不需要响应式，模块级单例即可（旧 store 也是非持久化字段）
const previewContentRefBox: { current: HTMLDivElement | null } = { current: null };

// ────── write atoms（toggle 语义）──────
export const toggleSideListAtom = atom(null, (get, set) => set(showSideListAtom, !get(showSideListAtom)));
export const toggleActionPanelAtom = atom(null, (get, set) => set(showActionPanelAtom, !get(showActionPanelAtom)));
export const toggleShowPreviewBorderAtom = atom(null, (get, set) => set(showPreviewBorderAtom, !get(showPreviewBorderAtom)));

/**
 * 消费侧薄 hook（保持原 useArticleViewerStore API，组件零改动）
 */
export function useArticleViewerStore() {
  const showSideList = useAtomValue(showSideListAtom);
  const showActionPanel = useAtomValue(showActionPanelAtom);
  const mobileShowSideList = useAtomValue(mobileShowSideListAtom);
  const mobileShowActionPanel = useAtomValue(mobileShowActionPanelAtom);
  const showFullscreenMenu = useAtomValue(showFullscreenMenuAtom);
  const previewWidth = useAtomValue(previewWidthAtom);
  const previewMaxAvailableWidth = useAtomValue(previewMaxAvailableWidthAtom);
  const previewMaxWidth = useAtomValue(previewMaxWidthAtom);
  const previewPadding = useAtomValue(previewPaddingAtom);
  const showPreviewBorder = useAtomValue(showPreviewBorderAtom);
  const previewBorderColor = useAtomValue(previewBorderColorAtom);
  const previewBackgroundColor = useAtomValue(previewBackgroundColorAtom);

  const toggleSideList = useSetAtom(toggleSideListAtom);
  const toggleActionPanel = useSetAtom(toggleActionPanelAtom);
  const toggleShowPreviewBorder = useSetAtom(toggleShowPreviewBorderAtom);

  const setShowSideList = useSetAtom(showSideListAtom);
  const setShowActionPanel = useSetAtom(showActionPanelAtom);
  const setMobileSideList = useSetAtom(mobileShowSideListAtom);
  const setMobileActionPanel = useSetAtom(mobileShowActionPanelAtom);
  const setFullscreenMenu = useSetAtom(showFullscreenMenuAtom);
  const setPreviewWidth = useSetAtom(previewWidthAtom);
  const setPreviewMaxAvailableWidth = useSetAtom(previewMaxAvailableWidthAtom);
  const setPreviewMaxWidth = useSetAtom(previewMaxWidthAtom);
  const setPreviewPadding = useSetAtom(previewPaddingAtom);
  const setPreviewBorderColor = useSetAtom(previewBorderColorAtom);
  const setPreviewBackgroundColor = useSetAtom(previewBackgroundColorAtom);

  return {
    showSideList,
    showActionPanel,
    mobileShowSideList,
    mobileShowActionPanel,
    showFullscreenMenu,
    previewWidth,
    previewMaxAvailableWidth,
    previewMaxWidth,
    previewPadding,
    showPreviewBorder,
    previewBorderColor,
    previewBackgroundColor,
    previewContentRef: previewContentRefBox,

    toggleSideList,
    toggleActionPanel,
    toggleShowPreviewBorder,

    setSideList: setShowSideList,
    setActionPanel: setShowActionPanel,
    setMobileSideList,
    setMobileActionPanel,
    setFullscreenMenu,
    setPreviewWidth,
    setPreviewMaxAvailableWidth,
    setPreviewMaxWidth,
    setPreviewPadding,
    setPreviewBorderColor,
    setPreviewBackgroundColor,
    setPreviewContentRef: (ref: HTMLDivElement | null) => { previewContentRefBox.current = ref; },
  };
}

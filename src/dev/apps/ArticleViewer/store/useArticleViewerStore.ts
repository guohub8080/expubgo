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
  // 三栏最小拼宽 = 左 320 + 间距 20 + 中 650 + 间距 20 + 右 320 + 10 缓冲；低于此值左栏走抽屉。
  // Navigation 按钮与 ArticleViewer 布局必须同用此值——曾各自 1280/1340 不一致，
  // 在 1280~1339 死区点击按钮走了内联分支，而内联栏被布局阈值隐藏，点了没反应
  LEFT_DRAWER_BREAKPOINT: 1340,
  RIGHT_DRAWER_BREAKPOINT: 1024,
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
// SVG 交互文章：鼠标事件桥（桌面 mousedown/up → touchstart/end，默认关——必须显式开启，
// 避免静默桥接搅乱真实触摸测试，见 AGENTS「事件桥」教训）
export const svgMouseBridgeAtom = st<boolean>('svgMouseBridge', false);
// SVG 交互文章：冻结时间功能开关（开后显示定格检查控件）
export const svgTimeFreezeAtom = st<boolean>('svgTimeFreeze', false);
// 微信图片点击弹出模拟（真 <img> 点按弹查看器，svg 背景图天然不弹——任意文章可用，
// 用于本地验证「防误弹/强弹出」策略，不必上真机）
export const imgPopSimAtom = st<boolean>('imgPopSim', false);
// SVG 交互：XRay 透视拖拽（框选 data-layout-key 元素可视化调位，默认关）
export const svgXRayAtom = st<boolean>('svgXRay', false);
// 预览选项区块折叠态（width/padding/canvas/border/xray* → 缺省即折叠，显式 false 才展开；
// key 带 2 = 弃用旧 key（旧值里残留显式展开态，换 key 让「默认全折叠」立即生效））
export const panelSectionCollapsedAtom = st<Record<string, boolean>>('panelSectionCollapsed2', {});
// XRay 透视拖拽：位置框/选中边框/选中内容填充颜色（仅 dev 框线视觉，不进产物）
export const xrayFrameColorAtom = st<string>('xrayFrameColor', '#1976D2');
export const xraySelectedColorAtom = st<string>('xraySelectedColor', '#DC2626');
export const xrayFillColorAtom = st<string>('xrayFillColor', '#DC2626');
export const xrayFillOpacityAtom = st<number>('xrayFillOpacity', 70);

// ────── 纯内存字段 ──────
export const mobileShowSideListAtom = atom<boolean>(false);
export const mobileShowActionPanelAtom = atom<boolean>(false);
export const showFullscreenMenuAtom = atom<boolean>(false);
// 预览区域最大可用宽度（根据容器动态计算）
export const previewMaxAvailableWidthAtom = atom<number>(ARTICLE_VIEWER_LAYOUT.PREVIEW_MAX_WIDTH);

// 预览区内容 DOM 引用：ref 不需要响应式，模块级单例即可（旧 store 也是非持久化字段）
const previewContentRefBox: { current: HTMLDivElement | null } = { current: null };

// 刷新预览 nonce：+1 令文章容器按 React key 重挂载（全新 DOM、SMIL/状态归零，替代旧 innerHTML hack）
export const previewRefreshNonceAtom = atom(0);
export const bumpPreviewRefreshAtom = atom(null, (_get, set) => set(previewRefreshNonceAtom, (n) => n + 1));

// 刷新预览的滚动还原位：刷新按钮存当时的 window.scrollY，PreviewArea 等内容长回后
// 跳回原阅读处并清空（一次性消费）。重挂载瞬间内容高度塌陷，滚动会被钳到顶，所以要还原。
export const previewScrollRestoreAtom = atom<number | null>(null);

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
  const svgMouseBridge = useAtomValue(svgMouseBridgeAtom);
  const svgTimeFreeze = useAtomValue(svgTimeFreezeAtom);
  const imgPopSim = useAtomValue(imgPopSimAtom);
  const svgXRay = useAtomValue(svgXRayAtom);
  const panelSectionCollapsed = useAtomValue(panelSectionCollapsedAtom);
  const xrayFrameColor = useAtomValue(xrayFrameColorAtom);
  const xraySelectedColor = useAtomValue(xraySelectedColorAtom);
  const xrayFillColor = useAtomValue(xrayFillColorAtom);
  const xrayFillOpacity = useAtomValue(xrayFillOpacityAtom);
  const previewRefreshNonce = useAtomValue(previewRefreshNonceAtom);

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
  const setSvgMouseBridge = useSetAtom(svgMouseBridgeAtom);
  const setSvgTimeFreeze = useSetAtom(svgTimeFreezeAtom);
  const setImgPopSim = useSetAtom(imgPopSimAtom);
  const setSvgXRay = useSetAtom(svgXRayAtom);
  const setPanelSectionCollapsed = useSetAtom(panelSectionCollapsedAtom);
  const setXrayFrameColor = useSetAtom(xrayFrameColorAtom);
  const setXraySelectedColor = useSetAtom(xraySelectedColorAtom);
  const setXrayFillColor = useSetAtom(xrayFillColorAtom);
  const setXrayFillOpacity = useSetAtom(xrayFillOpacityAtom);
  const refreshPreview = useSetAtom(bumpPreviewRefreshAtom);
  const previewScrollRestore = useAtomValue(previewScrollRestoreAtom);
  const setPreviewScrollRestore = useSetAtom(previewScrollRestoreAtom);

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
    svgMouseBridge,
    svgTimeFreeze,
    imgPopSim,
    svgXRay,
    panelSectionCollapsed,
    xrayFrameColor,
    xraySelectedColor,
    xrayFillColor,
    xrayFillOpacity,
    previewRefreshNonce,
    previewScrollRestore,
    setPreviewScrollRestore,
    refreshPreview,
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
    setSvgMouseBridge,
    setSvgTimeFreeze,
    setImgPopSim,
    setSvgXRay,
    setXrayFrameColor,
    setXraySelectedColor,
    setXrayFillColor,
    setXrayFillOpacity,
    togglePanelSection: (key: string) => setPanelSectionCollapsed(prev => ({ ...prev, [key]: !(prev[key] ?? true) })),
    setPreviewContentRef: (ref: HTMLDivElement | null) => { previewContentRefBox.current = ref; },
  };
}

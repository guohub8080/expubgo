import React, { useState, useEffect } from 'react';
import { getDefaultStore } from 'jotai';
import SideList from './components/SideList';
import PreviewArea from './components/PreviewArea';
import ActionPanel from './components/ActionPanel';
import { Sheet, SheetContent, SheetTitle } from '@shadcn/components/ui/sheet.tsx';
import { useArticleViewerStore, previewWidthAtom, ARTICLE_VIEWER_LAYOUT } from './store/useArticleViewerStore';
import useGlobalSettings from '@dev/store/useGlobalSettings';
import { Card } from '@shadcn/components/ui/card.tsx';

/**
 * ArticleViewer 主布局组件
 * 三栏布局：左侧文章列表 + 中间预览区 + 右侧操作功能
 *
 * 布局说明：
 * - 宽屏模式：三栏作为整体居中，左右侧边栏在预览区两侧，各有20px间距
 * - 左栏 (SideList): 文章列表，sticky 定位，固定宽度 280px
 * - 中栏 (PreviewArea): 文章预览，正常流，最大宽度 800px
 * - 右栏 (ActionPanel): 操作功能，sticky 定位，固定宽度 320px
 *
 * 响应式逻辑：
 * - Desktop (≥1340px): 三栏都显示，整体居中
 * - Medium (1024px-1339px): 中栏+右栏显示，左侧通过抽屉打开
 * - Tablet & Mobile (<1024px): 只显示中栏，左右侧边栏都通过抽屉打开
 */
export default function ArticleViewer() {
  // 获取导航栏高度
  const { navigationHeight } = useGlobalSettings();

  // 检测是否应该使用抽屉模式
  // <1340px 左侧使用抽屉（避免挤压中间预览区），<1024px 左右都使用抽屉
  const [shouldUseLeftDrawer, setShouldUseLeftDrawer] = useState(false);
  const [shouldUseRightDrawer, setShouldUseRightDrawer] = useState(false);

  // 中栏容器引用，用于计算可用宽度
  const mainContainerRef = React.useRef<HTMLDivElement>(null);

  // PC 端和移动端状态管理
  const {
    showSideList,
    showActionPanel,
    setSideList,
    setActionPanel,
    mobileShowSideList,
    mobileShowActionPanel,
    setMobileSideList,
    setMobileActionPanel,
    setPreviewMaxAvailableWidth,
    setPreviewWidth,
    previewMaxWidth
  } = useArticleViewerStore();

  // 监听窗口大小变化并自动调整侧边栏显示 + 计算预览区最大可用宽度
  useEffect(() => {
    let lastBreakpoint: 'narrow' | 'medium' | 'wide' | null = null;

    const handleResize = () => {
      const width = window.innerWidth;

      // 检测是否应该使用抽屉模式（1340px = 320+20+650+20+320 + 10px缓冲）
      setShouldUseLeftDrawer(width < 1340);
      setShouldUseRightDrawer(width < 1024);

      // 确定当前断点
      let currentBreakpoint: 'narrow' | 'medium' | 'wide';
      if (width >= 1340) {
        currentBreakpoint = 'wide';
      } else if (width >= 1024) {
        currentBreakpoint = 'medium';
      } else {
        currentBreakpoint = 'narrow';
      }

      // 只在断点变化时自动调整侧边栏，避免覆盖用户的手动操作
      if (lastBreakpoint !== currentBreakpoint) {
        if (currentBreakpoint === 'wide') {
          // 宽屏（≥1280px）：三栏都显示
          setSideList(true);
          setActionPanel(true);
        } else if (currentBreakpoint === 'medium') {
          // 中屏（1024px-1339px）：中栏+右栏，左侧抽屉
          setSideList(false);
          setActionPanel(true);
        } else {
          // 窄屏（<1024px）：只显示中栏，左右都抽屉
          setSideList(false);
          setActionPanel(false);
        }
        lastBreakpoint = currentBreakpoint;
      }

      // 计算中栏实际可用宽度
      // 布局未完成时 offsetWidth 可能为 0（懒加载首帧竞态），必须跳过，
      // 否则 Math.min(650, 0) = 0 会经 atomWithStorage 把 previewWidth 永久污染成 0
      if (mainContainerRef.current && mainContainerRef.current.offsetWidth > 0) {
        const containerWidth = mainContainerRef.current.offsetWidth;
        // 不减去任何间距，确保内容与容器无缝贴合
        const availableWidth = containerWidth;
        // 取最小值：配置的最大宽度 vs 实际可用宽度
        const maxAllowedWidth = Math.min(ARTICLE_VIEWER_LAYOUT.PREVIEW_MAX_WIDTH, availableWidth);
        setPreviewMaxAvailableWidth(maxAllowedWidth);

        // 函数式读取当前值，避免把 previewWidth 放进依赖数组（否则每次调宽度都重建 effect 并重置断点记忆）
        const currentWidth = getDefaultStore().get(previewWidthAtom);
        // 超出可用宽度时收敛；低于最小宽度（历史脏数据，如曾被污染成 0）时恢复为可用最大宽度
        if (currentWidth > maxAllowedWidth || currentWidth < ARTICLE_VIEWER_LAYOUT.PREVIEW_MIN_WIDTH) {
          setPreviewWidth(maxAllowedWidth);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // 使用 ResizeObserver 监听容器大小变化
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    if (mainContainerRef.current) {
      resizeObserver.observe(mainContainerRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
    };
  }, [setSideList, setActionPanel, setPreviewMaxAvailableWidth, setPreviewWidth]);

  // 计算实际显示的栏数和布局方式
  const showLeftColumn = showSideList && !shouldUseLeftDrawer;
  const showRightColumn = showActionPanel && !shouldUseRightDrawer;
  const visibleColumns = [showLeftColumn, true, showRightColumn].filter(Boolean).length;

  return (
    <div
      className="w-full relative flex justify-center"
      style={{ minHeight: `calc(100vh - ${navigationHeight}px)` }}
    >
      {/* 左侧抽屉 - 小于1280px时使用 */}
      <Sheet open={mobileShowSideList} onOpenChange={setMobileSideList}>
        <SheetContent side="left" className="p-0" hideClose={true} style={{ width: `${ARTICLE_VIEWER_LAYOUT.SIDE_LIST_WIDTH}px` }}>
          <SheetTitle className="sr-only">文章列表</SheetTitle>
          <SideList inDrawer />
        </SheetContent>
      </Sheet>

      {/* 右侧抽屉 - 小于1024px时使用 */}
      <Sheet open={mobileShowActionPanel} onOpenChange={setMobileActionPanel}>
        <SheetContent side="right" className="p-0" hideClose={true} style={{ width: `${ARTICLE_VIEWER_LAYOUT.ACTION_PANEL_WIDTH}px` }}>
          <SheetTitle className="sr-only">预览选项</SheetTitle>
          <ActionPanel />
        </SheetContent>
      </Sheet>

      {/* 三栏容器 - 根据显示栏数动态居中 */}
      <div
        className="flex w-full relative"
        style={{
          maxWidth: visibleColumns === 3 ? '1440px' :
            visibleColumns === 2 ? '1200px' :
              '800px',
          justifyContent: 'center',
          gap: '20px',
        }}
      >
        {/* 左栏：文章列表 - sticky 定位 */}
        {showLeftColumn && (
          <aside
            className="flex-shrink-0 pt-2 pb-2 pl-5 sticky"
            style={{
              width: `${ARTICLE_VIEWER_LAYOUT.SIDE_LIST_WIDTH}px`,
              height: `calc(100vh - ${navigationHeight}px)`,
              top: `${navigationHeight}px`,
            }}
          >
            <SideList />
          </aside>
        )}

        {/* 中栏：预览区 - 正常流 */}
        <main
          ref={mainContainerRef}
          className="flex-1"
          style={{
            maxWidth: `${previewMaxWidth}px`,
            minWidth: 0,
          }}
        >
          <PreviewArea />
        </main>

        {/* 右栏：操作功能 - sticky 定位 */}
        {showRightColumn && (
          <aside
            className="flex-shrink-0 sticky pt-2 pb-2 pr-5 flex flex-col"
            style={{
              width: `${ARTICLE_VIEWER_LAYOUT.ACTION_PANEL_WIDTH}px`,
              maxHeight: `calc(100vh - ${navigationHeight}px)`,
              top: `${navigationHeight}px`,
            }}
          >
            <Card className="bg-card rounded-lg pt-0 pb-0 gap-0 min-h-0 flex flex-col overflow-hidden">
              <ActionPanel />
            </Card>
          </aside>
        )}
      </div>
    </div>
  );
}


/** @jsxImportSource react */
/**
 * BookLayout - 图书式布局组件
 *
 * 布局模型（2026-09 重构版）：
 * - 桌面（≥650）：fixed 侧栏 + 「黄盒」内容行。黄盒 = max宽 BOOK_CONTENT_ROW_MAX_WIDTH 的居中容器，
 *   内含 [侧栏主占位][正文格]；目录关闭时主占位归零、两侧限宽占位动态挤入，正文收敛到
 *   NO_TOC_CONTENT_WIDTH 并保持居中——全部间距由 bookUniMargin 统一驱动
 * - 移动（<650）：无占位无 fixed，目录走 Sheet 抽屉，正文全宽 + 统一边距
 * - 开关时序两阶段：关闭时侧栏先淡出(0.2s)、正文延时 200ms 再挤占；打开时占位先展开让位、
 *   侧栏延时 200ms 淡入——正文与菜单永不同时抢空间
 *
 * 侧栏细节（fixed 定位、同构行对齐）见 BookSide.tsx；章节手风琴/滚动记忆见 internal/Sidebar.tsx
 */
import React from "react";
import { Outlet } from 'react-router';
import { useWindowSize } from "react-use";
import BookSide from "./BookSide.tsx";
import BookSideMobile from "./BookSideMobile.tsx";
import { BookLayoutConfigProvider } from "./internal/BookLayoutContext.tsx";
import { HeadingNumberProvider } from "../../mdx/contexts/HeadingNumberContext.tsx";
import useGlobalSettings, { globalSettingsStore } from "@dev/store/useGlobalSettings";
import { BOOK_MOBILE_BREAKPOINT, BOOK_CONTENT_ROW_MAX_WIDTH } from "./internal/bookBreakpoint.ts";
import type { BookLoader } from "./types/BookLoader.ts";

interface BookLayoutProps {
  loader: BookLoader;
}

/** 关目录时正文的目标内容宽（px）——限宽占位的挤占量由此动态推出 */
const NO_TOC_CONTENT_WIDTH = 650;

/** 两阶段开关时序中正文动作的延时（ms），与 BookSide 的侧栏淡入/淡出时长配合 */
const BODY_INSET_TRANSITION_DELAY = 200;

const BookLayout: React.FC<BookLayoutProps> = ({ loader }) => {
  // isBookPage 标记：Navigation 依赖它切换书页状态（目录按钮、标题等）
  React.useLayoutEffect(() => {
    globalSettingsStore.getState().setIsBookPage(true);
    window.scrollTo(0, 0);
    return () => {
      globalSettingsStore.getState().setIsBookPage(false);
    };
  }, [loader]);

  // 目录开关、侧栏宽度、统一边距（全局设置，Settings 可调）——
  // bookUniMargin 一统两处边距：内容行对视口的安全边距 + 侧栏与正文的缝（gap 并入其中）
  const { isBookTocShow, bookSideWidth, bookUniMargin, setIsBookTocShow } = useGlobalSettings();

  const { width: windowWidth } = useWindowSize();
  const isMobile = windowWidth < BOOK_MOBILE_BREAKPOINT;

  // 跨断点时的目录状态：窄→宽自动打开，宽→窄自动关闭。
  // ref 记住上一次断点，只在真正跨越时动作——初始挂载不算（保留用户持久偏好）
  const prevIsMobileRef = React.useRef(isMobile);
  React.useEffect(() => {
    if (prevIsMobileRef.current === isMobile) return;
    prevIsMobileRef.current = isMobile;
    if (isMobile) {
      if (isBookTocShow) setIsBookTocShow(false);
    } else {
      if (!isBookTocShow) setIsBookTocShow(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  // 限宽占位的动态挤占量（目录关时）：目标让正文内容宽收敛到 NO_TOC_CONTENT_WIDTH。
  // 黄盒实际宽 = min(BOOK_CONTENT_ROW_MAX_WIDTH, 视口宽 − 2×bookUniMargin)，随窗口变化；
  // 占位 = clamp((黄盒宽 − 650)/2, 0)——窗口收窄时占位按比例缩小、正文平滑接管，窄于 650 归零
  const rowWidth = Math.min(BOOK_CONTENT_ROW_MAX_WIDTH, windowWidth - bookUniMargin * 2);
  const bodyInset = Math.max((rowWidth - NO_TOC_CONTENT_WIDTH) / 2, 0);

  // ============ 移动端分支：目录走抽屉，正文全宽 + 统一边距 ============
  if (isMobile) {
    return (
      <BookLayoutConfigProvider basePrefix={`/${loader.config.slug}`}>
        <HeadingNumberProvider>
          <div className="w-full min-h-screen overflow-x-hidden">
            <BookSideMobile loader={loader} />
            <div
              className="w-full mx-auto min-w-0"
              style={{
                paddingLeft: bookUniMargin,
                paddingRight: bookUniMargin,
                paddingTop: 0,
              }}
            >
              <Outlet />
            </div>
          </div>
        </HeadingNumberProvider>
      </BookLayoutConfigProvider>
    );
  }

  // ============ 桌面分支 ============
  return (
    <BookLayoutConfigProvider basePrefix={`/${loader.config.slug}`}>
      <HeadingNumberProvider>
        {/* fixed 侧栏：portal 到 body 避开路由进场动画的 transform 劫持、
            与黄盒同构的隐形行对齐左缘、navbar 下撑到底、opacity 显隐——细节见 BookSide.tsx */}
        <BookSide loader={loader} />

        {/* 全屏居中容器：黄盒在其中水平居中 */}
        <div style={{ width: "100%", minWidth: "100%", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
          {/* 黄盒：内容行的 max 宽容器，左右各留 bookUniMargin 安全边 */}
          <div style={{
            width: "100%", height: "100%", maxWidth: BOOK_CONTENT_ROW_MAX_WIDTH, minWidth: 0,
            display: "flex", justifyContent: "center", alignItems: "center",
            marginLeft: bookUniMargin, marginRight: bookUniMargin
          }}>
            {/* 侧栏主占位：宽度 = 侧栏宽 + 统一边距（正文为 fixed 侧栏让位）；
                目录关时归零；关闭时延时收缩等侧栏淡完（两阶段），打开时不延时 */}
            <div
              style={{
                flexShrink: 0,
                width: isBookTocShow ? bookSideWidth + bookUniMargin : 0,
                minWidth: isBookTocShow ? bookSideWidth + bookUniMargin : 0,
                maxWidth: isBookTocShow ? bookSideWidth + bookUniMargin : 0,
                transition: `all 0.3s ease ${isBookTocShow ? "0ms" : `${BODY_INSET_TRANSITION_DELAY}ms`}`,
              }}
            />

            {/* 正文格：minWidth 0 覆盖 flex 子项默认 min-content 下限，允许压缩 */}
            <div style={{ minWidth: 0, width: "100%", paddingTop: bookUniMargin, display: "flex" }}>
              {/* 限宽占位（左）：目录关时动态挤入 bodyInset，把正文收敛到 650 并保持居中 */}
              <div
                style={{
                  flexShrink: 0,
                  width: isBookTocShow ? 0 : bodyInset,
                  transition: `all 0.3s ease ${isBookTocShow ? "0ms" : `${BODY_INSET_TRANSITION_DELAY}ms`}`,
                }}
              />
              <div style={{ minWidth: 0, width: "100%" }}>
                <Outlet />
              </div>
              {/* 限宽占位（右）：与左侧对称 */}
              <div
                style={{
                  flexShrink: 0,
                  width: isBookTocShow ? 0 : bodyInset,
                  transition: `all 0.3s ease ${isBookTocShow ? "0ms" : `${BODY_INSET_TRANSITION_DELAY}ms`}`,
                }}
              />
            </div>
          </div>
        </div>
      </HeadingNumberProvider>
    </BookLayoutConfigProvider>
  );
};

export default BookLayout;

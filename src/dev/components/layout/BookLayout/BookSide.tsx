/** @jsxImportSource react */
/**
 * BookSide - 书页 fixed 侧栏（新 BookLayout 配套，单组件封装）
 *
 * 使用方式：在 BookLayout 里一行 <BookSide loader={loader} />。
 *
 * 内部三层定位（职责封装，外部无感）：
 * 1. fixed 铺满层（portal 到 body，避开路由容器的 translateY 进场动画——transform 祖先
 *    会劫持 fixed 包含块，曾致首帧侧栏下移闪跳）+ flex 居中；
 * 2. 同构行：与黄盒完全相同的宽度规则（width 100% / maxWidth / margin / shrink），
 *    其左缘与黄盒左缘必然重合——纯 CSS 对齐，无视口宽/滚动条口径偏差；
 * 3. absolute 盒：top = navbar 下、高度 calc(100svh - navbar)、opacity 显隐（不卸载，保住侧栏滚动位置）。
 *
 * 边距统一使用全局 bookUniMargin（与黄盒两侧同源），宽度 bookSideWidth（--sidebar-width）。
 */
import React from "react";
import { createPortal } from "react-dom";
import { BookSidebarProvider } from "./internal/BookSidebarProvider.tsx";
import { BookSidebar } from "./internal/Sidebar.tsx";
import useGlobalSettings from "../../../store/useGlobalSettings";
import { BOOK_CONTENT_ROW_MAX_WIDTH } from "./internal/bookBreakpoint.ts";
import type { BookLoader } from "./types/BookLoader.ts";

/**
 * 打开时序的侧栏淡入延时（ms）：占位块先展开把正文挤过去（让位 0.3s），
 * 侧栏延时到大半让位完成后再浮现——与关闭时序（侧栏先走、正文延时挤占）对称
 */
const SIDEBAR_FADE_IN_DELAY = 200;

interface BookSideProps {
  loader: BookLoader;
}

const BookSide = ({ loader }: BookSideProps) => {
  const { isBookTocShow, bookSideWidth, bookUniMargin, navigationHeight } = useGlobalSettings();

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      {/* 同构行：复刻黄盒的宽度规则，左缘与黄盒恒对齐 */}
      <div
        style={{
          width: "100%",
          maxWidth: BOOK_CONTENT_ROW_MAX_WIDTH,
          minWidth: 0,
          marginLeft: bookUniMargin,
          marginRight: bookUniMargin,
          height: 0,
          position: "relative",
          alignSelf: "flex-start",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: `${navigationHeight}px`,
            height: `calc(100svh - ${navigationHeight}px)`,
            left: 0,
            opacity: isBookTocShow ? 1 : 0,
            pointerEvents: isBookTocShow ? "auto" : "none",
            // 打开延时淡入（先让位再出现），关闭立即淡出（先走，正文再挤占）——两阶段对称时序
            transition: `opacity 0.2s ease ${isBookTocShow ? `${SIDEBAR_FADE_IN_DELAY}ms` : "0ms"}`,
          }}
        >
          <BookSidebarProvider
            className="contents"
            style={{ "--sidebar-width": `${bookSideWidth}px` } as React.CSSProperties}
          >
            <BookSidebar loader={loader} />
          </BookSidebarProvider>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default BookSide;

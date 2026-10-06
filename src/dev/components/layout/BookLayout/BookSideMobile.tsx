/** @jsxImportSource react */
/**
 * BookSideMobile - 移动端侧栏（独立实现，不依赖 wrapper 的 isMobile 分支）
 *
 * Sheet 抽屉直接装载 collapsible=none 的侧栏内容——wrapper 源码里 none 分支排在
 * isMobile 判断之前，完全不碰那条不可靠的 context 断点链。
 * 开关 = 全局 isBookTocShow（与桌面目录开关同一状态，navbar 按钮直接控制）。
 */
import React from "react";
import { useLocation } from "react-router";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@shadcn/components/ui/sheet.tsx";
import { BookSidebarProvider } from "./internal/BookSidebarProvider.tsx";
import { BookSidebar } from "./internal/Sidebar.tsx";
import useGlobalSettings from "@dev/store/useGlobalSettings";
import type { BookLoader } from "./types/BookLoader.ts";

interface BookSideMobileProps {
  loader: BookLoader;
}

const BookSideMobile = ({ loader }: BookSideMobileProps) => {
  const { isBookTocShow, setIsBookTocShow, bookSideWidth } = useGlobalSettings();
  const location = useLocation();

  // 点击菜单项导航后自动收起抽屉。
  // 依赖只放 pathname：setIsBookTocShow 每次渲染都是新引用（useGlobalSettings 返回内联函数），
  // 放进依赖会导致每次渲染都重跑 effect，把刚点开的抽屉立即关回去（打不开的 bug 根源）
  React.useEffect(() => {
    setIsBookTocShow(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <Sheet open={isBookTocShow} onOpenChange={(open) => setIsBookTocShow(open)}>
      <SheetContent
        side="right"
        className="p-0 overflow-hidden border-l bg-sidebar text-sidebar-foreground [&>button]:flex [&>button]:items-center [&>button]:justify-center [&>button]:size-8 [&>button_svg]:size-5 [&>button]:top-3 [&>button]:right-3"
        style={{ width: `${bookSideWidth}px`, maxWidth: "85vw" }}
      >
        <SheetHeader className="sr-only">
          <SheetTitle>目录</SheetTitle>
          <SheetDescription>书籍章节导航</SheetDescription>
        </SheetHeader>
          {/* 移动端全高抽屉：variant=sidebar 平铺（无浮动卡片的圆角/边框/阴影），上下呼吸 padding 清零 */}
          <BookSidebarProvider
            style={{ "--sidebar-width": `${bookSideWidth}px` } as React.CSSProperties}
          >
            <BookSidebar
              loader={loader}
              variant="sidebar"
              style={{ paddingTop: 0, paddingBottom: 0 }}
            />
          </BookSidebarProvider>
      </SheetContent>
    </Sheet>
  );
};

export default BookSideMobile;

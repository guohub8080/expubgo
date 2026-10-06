/**
 * BookSidebarWrapper - Sidebar 容器组件（internal）
 * 从 shadcn sidebar.tsx 的 Sidebar 函数复制
 */

import * as React from "react"
import { cn } from "@shadcn/lib/utils.ts"
import useGlobalSettings from "@dev/store/useGlobalSettings"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@shadcn/components/ui/sheet.tsx"
import { useBookSidebar } from "./BookSidebarProvider.tsx"

const SIDEBAR_WIDTH_MOBILE = "18rem"

export function BookSidebarWrapper({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  containerStyle,
  ...props
}: React.ComponentProps<"div"> & {
  side?: "left" | "right"
  variant?: "sidebar" | "floating" | "inset"
  collapsible?: "offcanvas" | "icon" | "none"
  containerStyle?: React.CSSProperties
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useBookSidebar()
  const { bookUniMargin } = useGlobalSettings()

  if (collapsible === "none") {
    return (
      <div
        data-slot="sidebar"
        data-variant={variant}
        data-side={side}
        // group + data-variant 供 inner 的 group-data-[variant=floating] 卡片样式（圆角/边框/阴影）继续生效；
        // 外层无背景（透明）——浮动卡片自己的 bg-sidebar 在 inner 上，padding 呼吸区透出页面背景
        className={cn(
          "group text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col",
          className
        )}
        {...props}
        // 统一边距作上下呼吸（水平为零：内容满宽贴侧栏边界）；保留外部传入的 style 项
        style={{
          paddingTop: bookUniMargin,
          paddingBottom: bookUniMargin,
          ...(props.style as React.CSSProperties),
        }}
      >
        <div
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          className="bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm"
        >
          {children}
        </div>
      </div>
    )
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          data-sidebar="sidebar"
          data-slot="sidebar"
          data-mobile="true"
          className="bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden"
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
            } as React.CSSProperties
          }
          side={side}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div
      className="group peer text-sidebar-foreground hidden md:block"
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
      data-slot="sidebar"
    >
      {/* This is what handles the sidebar gap on desktop */}
      <div
        data-slot="sidebar-gap"
        className={cn(
          "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
          "group-data-[collapsible=offcanvas]:w-0",
          "group-data-[side=right]:rotate-180",
          variant === "floating" || variant === "inset"
            ? "group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
        )}
      />
      <div
        data-slot="sidebar-container"
        className={cn(
          "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex",
          side === "left"
            ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
            : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
          // Adjust the padding for floating and inset variants.
          variant === "floating" || variant === "inset"
            ? "p-2 group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
          className
        )}
        style={containerStyle}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          className="bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm"
        >
          {children}
        </div>
      </div>
    </div>
  )
}




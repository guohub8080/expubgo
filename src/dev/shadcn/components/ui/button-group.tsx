import * as React from "react"

import { cn } from "../../lib/utils.ts"

/**
 * 连体按钮组：一行多段、段间竖线分隔（segmented）。
 * 外层容器承担 outline 按钮的边框/圆角/阴影，子项无独立边框，
 * hover 各自反馈；段数不限，等宽用子项 flex-1。
 */
function ButtonGroup({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="button-group"
      role="group"
      className={cn(
        "flex w-full items-stretch overflow-hidden rounded-md border border-input bg-background shadow-xs dark:bg-input/30",
        className
      )}
      {...props}
    />
  )
}

/**
 * 按钮组子项：首尾圆角由容器裁切；非首项左缘画分隔线。
 */
function ButtonGroupItem({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      data-slot="button-group-item"
      className={cn(
        "flex flex-1 cursor-pointer items-center justify-center gap-2 px-3 text-sm font-medium whitespace-nowrap transition-colors outline-none",
        "hover:bg-accent hover:text-accent-foreground dark:hover:bg-input/50",
        "focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "disabled:pointer-events-none disabled:opacity-50",
        "not-first:border-l not-first:border-border [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

export { ButtonGroup, ButtonGroupItem }

/**
 * 表格化按钮区：多行结构，行间横线、格间竖线、外围统一边框圆角（table 观感）。
 * 行内段数不限（子项 flex-1 等宽），单段行即整行；每格高度/配色可 className 自定义。
 */
function ButtonTable({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="button-table"
      role="group"
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-md border border-input bg-background shadow-xs dark:bg-input/30",
        className
      )}
      {...props}
    />
  )
}

/** 按钮表的一行：行内横排若干 ButtonGroupItem（格子），行与行之间横线分隔 */
function ButtonTableRow({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="button-table-row"
      className={cn(
        "flex items-stretch not-first:border-t not-first:border-border",
        className
      )}
      {...props}
    />
  )
}

export { ButtonTable, ButtonTableRow }

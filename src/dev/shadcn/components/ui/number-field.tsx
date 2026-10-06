"use client"

import * as React from "react"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { NumberField as NumberFieldPrimitive } from "@base-ui/react/number-field"
import { cn } from "../../lib/utils.ts"

/**
 * shadcn 风格数字输入（Base UI NumberField 封装，外观对齐 ui/input.tsx）
 * 参考 shadcn 官方新一代组件路线（Radix 团队的 Base UI 原语）；
 * 官方 React 版尚未发布（shadcn-ui/ui#10170），此为同构本地封装。
 */
function NumberField({
  className,
  ...props
}: React.ComponentProps<typeof NumberFieldPrimitive.Root>) {
  return (
    <NumberFieldPrimitive.Root
      data-slot="number-field"
      className={className}
      {...props}
    />
  )
}

function NumberFieldGroup({
  className,
  ...props
}: React.ComponentProps<typeof NumberFieldPrimitive.Group>) {
  return (
    <NumberFieldPrimitive.Group
      data-slot="number-field-group"
      className={cn(
        "border-input dark:bg-input/30 relative flex h-9 w-full min-w-0 rounded-md border bg-transparent shadow-xs transition-[color,box-shadow] outline-none",
        "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

function NumberFieldDecrement({
  className,
  ...props
}: React.ComponentProps<typeof NumberFieldPrimitive.Decrement>) {
  return (
    <NumberFieldPrimitive.Decrement
      data-slot="number-field-decrement"
      className={cn(
        "text-muted-foreground/80 hover:text-foreground hover:bg-accent absolute right-px bottom-px flex h-[calc(50%-0.5px)] w-8 items-center justify-center rounded-br-md border-l border-input transition-colors outline-none focus-visible:ring-[2px] focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      <ChevronDownIcon className="size-3" />
    </NumberFieldPrimitive.Decrement>
  )
}

function NumberFieldIncrement({
  className,
  ...props
}: React.ComponentProps<typeof NumberFieldPrimitive.Increment>) {
  return (
    <NumberFieldPrimitive.Increment
      data-slot="number-field-increment"
      className={cn(
        "text-muted-foreground/80 hover:text-foreground hover:bg-accent absolute right-px top-px flex h-[calc(50%-0.5px)] w-8 items-center justify-center rounded-tr-md border-l border-b border-input transition-colors outline-none focus-visible:ring-[2px] focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      <ChevronUpIcon className="size-3" />
    </NumberFieldPrimitive.Increment>
  )
}

function NumberFieldInput({
  className,
  ...props
}: React.ComponentProps<typeof NumberFieldPrimitive.Input>) {
  return (
    <NumberFieldPrimitive.Input
      data-slot="number-field-input"
      className={cn(
        "selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground dark:bg-input/30 h-full w-full min-w-0 rounded-md border-0 bg-transparent p-0 pl-3 pr-10 text-base shadow-xs outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export {
  NumberField,
  NumberFieldGroup,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
}

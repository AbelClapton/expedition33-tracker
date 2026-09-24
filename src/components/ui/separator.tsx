"use client"

import { Separator as SeparatorPrimitive } from "@base-ui/react/separator"

import { cn } from "@/lib/utils"

function Separator({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorPrimitive.Props) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(
        "shrink-0 bg-linear-to-r from-transparent via-border to-transparent data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch data-vertical:bg-linear-to-b",
        className
      )}
      {...props}
    />
  )
}

export { Separator }

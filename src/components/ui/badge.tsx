import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Tags are the same stretched hexagon as a button, one size down, and share its
 * hairline/face pairs so a tag and the button beside it read as one family.
 */
const badgeVariants = cva(
  "group/badge chamfer chamfer-square h-6 [--chamfer-h:1.5rem] inline-flex w-fit shrink-0 items-center justify-center gap-1 border-0 px-3 py-0.5 text-[0.67rem] font-medium tracking-[0.12em] uppercase whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "chamfer-gold text-primary",
        secondary: "chamfer-teal text-secondary",
        destructive: "chamfer-crimson text-destructive",
        outline: "chamfer-plate text-[#d0c5af]",
        ghost: "chamfer-ghost text-muted-foreground",
        link: "chamfer-ghost p-0 tracking-normal normal-case text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props,
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  });
}

export { Badge, badgeVariants };

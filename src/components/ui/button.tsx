import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Buttons wear the chamfer: a stretched hexagon, pointed on the long axis, cut on
 * the short one. `globals.css` draws it as two clipped layers under the element, so
 * focus rings and hit areas stay ordinary rectangles - a variant only picks the
 * hairline and the face.
 */
const buttonVariants = cva(
  "group/button chamfer relative inline-flex shrink-0 items-center justify-center border-0 font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-ring/40 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "chamfer-gold text-primary",
        outline: "chamfer-plate text-[#d0c5af] hover:text-foreground",
        secondary: "chamfer-teal text-secondary",
        ghost:
          "chamfer-ghost text-muted-foreground hover:text-foreground aria-expanded:text-foreground",
        destructive: "chamfer-crimson text-destructive",
        link: "chamfer-ghost p-0 tracking-normal normal-case text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-9 [--chamfer-h:2.25rem] gap-1.5 px-4 text-[0.78rem] tracking-[0.11em] uppercase has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "chamfer-square h-7 [--chamfer-h:1.75rem] gap-1 px-2 text-[0.7rem] tracking-[0.1em] uppercase has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 [--chamfer-h:2rem] gap-1 px-3 text-[0.74rem] tracking-[0.1em] uppercase has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-10 [--chamfer-h:2.5rem] gap-1.5 px-5 text-[0.8rem] tracking-[0.12em] uppercase has-data-[icon=inline-end]:pr-3.5 has-data-[icon=inline-start]:pl-3.5",
        icon: "chamfer-square size-8 [--chamfer-h:2rem]",
        "icon-xs":
          "chamfer-square size-6 [--chamfer-h:1.5rem] [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "chamfer-square size-7 [--chamfer-h:1.75rem]",
        "icon-lg": "chamfer-square size-9 [--chamfer-h:2.25rem]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };

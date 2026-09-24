import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-md border bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "border-primary/70 bg-linear-to-b from-[#3a3016] to-[#1b1912] text-primary shadow-[0_0_0_1px_rgb(242_202_80_/_15%),0_0_22px_rgb(242_202_80_/_20%)_inset] hover:from-[#4a3b1b] hover:to-[#252016]",
        outline:
          "border-border bg-[#1a1c1f] text-[#d0c5af] hover:bg-[#23262a] hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground",
        secondary:
          "border-secondary/60 bg-linear-to-b from-[#07403c] to-[#042927] text-secondary shadow-[0_0_0_1px_rgb(89_218_209_/_20%),0_0_18px_rgb(89_218_209_/_12%)_inset] hover:from-[#0a4d48] hover:to-[#063431]",
        ghost:
          "border-transparent text-muted-foreground hover:border-border hover:bg-muted/40 hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground",
        destructive:
          "border-destructive/60 bg-linear-to-b from-[#4d1617] to-[#2f1112] text-destructive hover:from-[#5a1a1b] hover:to-[#391415] focus-visible:border-destructive/50 focus-visible:ring-destructive/20",
        link: "border-transparent p-0 text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-9 gap-1.5 px-3 text-[0.78rem] tracking-[0.11em] uppercase has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-7 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-[0.7rem] tracking-[0.1em] uppercase in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.74rem] tracking-[0.1em] uppercase in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-10 gap-1.5 px-4 text-[0.8rem] tracking-[0.12em] uppercase has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-md",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

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
  )
}

export { Button, buttonVariants }

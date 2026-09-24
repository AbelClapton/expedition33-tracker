"use client";

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";

import { cn } from "@/lib/utils";

/**
 * The diamond checkbox - a 12px hairline square turned 45 degrees with a 6px
 * solid diamond inside it, matching the Library prototype's mark 1:1 (its
 * `w-3 h-3` / `w-1.5 h-1.5`). Deliberately no fill and no glow: the shape stays
 * a crisp etched outline, which is what makes it read lighter than a filled box.
 *
 * `keepMounted` is load-bearing - Base UI unmounts the indicator while the box
 * is unchecked, so without it the inner diamond could never preview on hover.
 */
function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer group/check relative grid size-3 shrink-0 rotate-45 place-content-center border border-primary/30 transition-colors outline-none",
        "hover:border-primary focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25",
        "data-checked:border-primary",
        "after:absolute after:-inset-2.5 after:content-['']",
        "disabled:cursor-not-allowed disabled:opacity-40 group-has-disabled/field:opacity-40",
        "aria-invalid:border-destructive",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        keepMounted
        data-slot="checkbox-indicator"
        className={cn(
          "block size-1.5 bg-primary opacity-0 transition-opacity",
          "group-hover/check:opacity-40 group-data-checked/check:opacity-100",
        )}
      />
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, isActivePath } from "./navItems";

export function TrackerMobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-border/60 bg-[#0f1114]/95 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-lg md:hidden">
      {NAV_ITEMS.map((item) => {
        const active = isActivePath(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              buttonVariants({
                variant: active ? "default" : "ghost",
                size: "sm",
              }),
              "h-auto flex-col gap-1 py-2 text-[0.58rem] tracking-[0.12em]",
            )}
          >
            <span className="material-symbols-outlined text-base">
              {item.icon}
            </span>
            {item.label}
          </Link>
        );
      })}

      {/* Screen the design keeps a slot for, not built yet */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-auto flex-col gap-1 py-2 text-[0.58rem] tracking-[0.12em]"
      >
        <Sparkles className="size-4" />
        Synergy
      </Button>
    </nav>
  );
}

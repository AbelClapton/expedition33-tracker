"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { assetPath } from "@/lib/assetPath";
import { NAV_ITEMS, isActivePath } from "./navItems";

export function TrackerTopNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 top-0 z-50 hidden h-16 items-center justify-between px-8 md:flex">
      <div className="flex items-center gap-4">
        <span className="font-heading text-[32px] tracking-tight text-primary [text-shadow:0_0_15px_rgba(242,202,80,0.25)]">
          Picto Tracker
        </span>
      </div>

      <div className="hidden h-full items-center gap-4 md:flex">
        <div className="flex gap-8 rounded-full border border-transparent bg-surface-container-low/0 px-6 py-2 backdrop-blur-sm transition-all duration-500 hover:border-outline-variant/20 hover:bg-surface-container-low/40">
          {NAV_ITEMS.map((item) => {
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`group relative font-meta text-[11px] uppercase tracking-widest transition-colors ${active ? "text-primary" : "text-[var(--collection-ink-muted)] hover:text-primary"}`}
              >
                {item.label.toUpperCase()}
                <span
                  className={`absolute -bottom-1 left-0 h-px w-full origin-left bg-primary transition-transform ${active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                />
              </Link>
            );
          })}

          {/* Screens the design keeps a slot for, not built yet */}
          <a
            href="#"
            className="group relative font-meta text-[11px] uppercase tracking-widest text-[var(--collection-ink-muted)] transition-colors hover:text-primary"
          >
            ARMORY
            <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-primary transition-transform group-hover:scale-x-100" />
          </a>
          <a
            href="#"
            className="group relative font-meta text-[11px] uppercase tracking-widest text-[var(--collection-ink-muted)] transition-colors hover:text-primary"
          >
            CHRONICLE
            <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-primary transition-transform group-hover:scale-x-100" />
          </a>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-full border border-transparent bg-surface-container-low/0 p-1 transition-all duration-500 hover:border-outline-variant/20 hover:bg-surface-container-low/40">
          <button
            type="button"
            className="material-symbols-outlined p-2 text-primary/80 transition-colors hover:text-primary"
          >
            person_search
          </button>
          <button
            type="button"
            className="material-symbols-outlined p-2 text-primary/80 transition-colors hover:text-primary"
          >
            settings
          </button>
          <div className="ml-1 h-8 w-8 overflow-hidden rounded-full border border-primary/20">
            <Image
              alt="Portrait"
              className="h-full w-full object-cover grayscale transition-all duration-500 hover:grayscale-0"
              src={assetPath("/images/architect-portrait.jpg")}
              width={32}
              height={32}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}

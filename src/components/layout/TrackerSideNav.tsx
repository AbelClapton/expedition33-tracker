"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, isActivePath } from "./navItems";

export function TrackerSideNav() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-full w-56 flex-col pb-12 pt-24 md:flex">
      <div className="mb-10 flex items-center gap-4 px-8 opacity-60 transition-opacity duration-500 hover:opacity-100">
        <div className="flex h-10 w-10 rotate-45 items-center justify-center border border-primary/10 shadow-[0_0_15px_rgba(242,202,80,0.05)]">
          <span
            className="material-symbols-outlined -rotate-45 text-xl text-primary"
            style={{ fontVariationSettings: '"FILL" 1' }}
          >
            architecture
          </span>
        </div>
        <div>
          <p className="font-heading text-[15px] leading-tight tracking-wide text-primary">
            The Architect
          </p>
          <p className="font-meta text-[9px] uppercase tracking-[0.15em] text-outline">
            Level 99 Seeker
          </p>
        </div>
      </div>

      <div className="flex flex-grow flex-col">
        {NAV_ITEMS.map((item) => {
          const active = isActivePath(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`group flex items-center gap-4 px-8 py-3.5 transition-all duration-500 ${active ? "text-primary" : "text-[#99907c] hover:text-white"}`}
            >
              <span
                className={`material-symbols-outlined text-xl transition-transform group-hover:scale-110 ${active ? "drop-shadow-[0_0_10px_rgba(242,202,80,0.35)]" : ""}`}
                style={
                  active ? { fontVariationSettings: '"FILL" 1' } : undefined
                }
              >
                {item.icon}
              </span>
              <span className="font-meta text-[11px] uppercase tracking-[0.2em]">
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Screens the design keeps a slot for, not built yet */}
        <a
          href="#"
          className="group flex items-center gap-4 px-8 py-3.5 text-[#99907c] transition-all duration-500 hover:text-white"
        >
          <span className="material-symbols-outlined text-xl transition-transform group-hover:scale-110">
            shield
          </span>
          <span className="font-meta text-[11px] uppercase tracking-[0.2em]">
            Armory
          </span>
        </a>
        <a
          href="#"
          className="group flex items-center gap-4 px-8 py-3.5 text-[#99907c] transition-all duration-500 hover:text-white"
        >
          <span className="material-symbols-outlined text-xl transition-transform group-hover:scale-110">
            auto_fix_high
          </span>
          <span className="font-meta text-[11px] uppercase tracking-[0.2em]">
            Altar
          </span>
        </a>
        <a
          href="#"
          className="group flex items-center gap-4 px-8 py-3.5 text-[#99907c] transition-all duration-500 hover:text-white"
        >
          <span className="material-symbols-outlined text-xl transition-transform group-hover:scale-110">
            history_edu
          </span>
          <span className="font-meta text-[11px] uppercase tracking-[0.2em]">
            Chronicle
          </span>
        </a>
      </div>

      <div className="mb-10 mt-auto px-8">
        <button
          type="button"
          className="w-full border border-primary/10 bg-transparent py-4 font-meta text-[10px] uppercase tracking-[0.3em] text-primary transition-all hover:border-primary/40 hover:bg-primary/5 active:scale-95"
        >
          Forge Synergy
        </button>
      </div>

      <div className="space-y-4 px-8">
        <a
          href="#"
          className="flex items-center gap-3 font-meta text-[10px] tracking-[0.2em] text-[#99907c] transition-colors hover:text-white"
        >
          <span className="material-symbols-outlined text-sm">help</span>
          SUPPORT
        </a>
        <a
          href="#"
          className="flex items-center gap-3 font-meta text-[10px] tracking-[0.2em] text-[#99907c] transition-colors hover:text-white"
        >
          <span className="material-symbols-outlined text-sm">castle</span>
          SANCTUM
        </a>
      </div>
    </aside>
  );
}

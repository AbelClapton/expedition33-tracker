interface TrackerSideNavProps {
  children?: React.ReactNode;
}

/**
 * Sidebar frame of the tracker shell.
 *
 * Global routing lives in the top bar, so the sidebar is a slot: each screen
 * supplies its own list - the Library fills it with the collectible layers.
 */
export function TrackerSideNav({ children }: TrackerSideNavProps) {
  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-full w-60 flex-col overflow-y-auto pb-12 pt-24 md:flex">
      <div className="mb-8 flex items-center gap-4 px-8 opacity-60 transition-opacity duration-500 hover:opacity-100">
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

      {children}
    </aside>
  );
}

import { ChangeEvent, useState } from "react";
import { cn } from "@/lib/utils";
import {
  CollectionRuneFilter,
  CollectionSortMode,
  CollectionViewMode,
} from "../types";
import styles from "../collection.module.css";

interface CollectionToolbarProps {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  selectedRunes: CollectionRuneFilter[];
  onToggleRune: (rune: CollectionRuneFilter) => void;
  onClearRunes: () => void;
  sortMode: CollectionSortMode;
  onSortModeChange: (mode: CollectionSortMode) => void;
  viewMode: CollectionViewMode;
  onViewModeChange: (mode: CollectionViewMode) => void;
  totalCount: number;
  filteredCount: number;
  foundCount: number;
}

const runeFilters: Array<{
  key: CollectionRuneFilter;
  icon: string;
  label: string;
}> = [
  { key: "offense", icon: "flare", label: "Offense" },
  { key: "defense", icon: "shield", label: "Defense" },
  { key: "support", icon: "help", label: "Support" },
  { key: "control", icon: "filter_vintage", label: "Control" },
  { key: "resource", icon: "auto_fix_high", label: "Resource" },
];

const sortOrder: CollectionSortMode[] = ["name", "levelDesc", "levelAsc"];

export function CollectionToolbar({
  searchQuery,
  onSearchQueryChange,
  selectedRunes,
  onToggleRune,
  onClearRunes,
  sortMode,
  onSortModeChange,
  viewMode,
  onViewModeChange,
  totalCount,
  filteredCount,
  foundCount,
}: CollectionToolbarProps) {
  const [showRuneFilters, setShowRuneFilters] = useState(false);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearchQueryChange(event.currentTarget.value);
  };

  const cycleSortMode = () => {
    const currentIndex = sortOrder.indexOf(sortMode);
    const nextIndex = (currentIndex + 1) % sortOrder.length;
    onSortModeChange(sortOrder[nextIndex]);
  };

  const sortModeLabel =
    sortMode === "name" ? "A-Z" : sortMode === "levelDesc" ? "HIGH" : "LOW";

  return (
    <header className="mb-10 border-b border-white/10 pb-6 md:mb-12">
      <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex w-full flex-1 items-center gap-6">
          <label className="group minimal-search-wrap relative w-full max-w-xs">
            <span className="sr-only">Search pictos</span>
            <input
              type="search"
              value={searchQuery}
              onChange={onChange}
              placeholder="Whisper to the Archive..."
              className="w-full border-0 bg-transparent px-2 py-2 pr-7 text-sm text-white placeholder:text-[var(--collection-ink-soft)] outline-none"
            />
            <span className="pointer-events-none material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-[18px] text-primary/30 transition-colors group-focus-within:text-primary">
              flare
            </span>
          </label>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setShowRuneFilters((value) => !value)}
              className={cn(
                styles.runeButton,
                "flex h-8 w-8 rotate-45 items-center justify-center border border-white/20 bg-white/5 transition-all duration-500 hover:border-white/60 hover:bg-white/10",
                showRuneFilters && "border-white/60 bg-white/10",
              )}
              aria-label="Filter runes"
            >
              <span className="material-symbols-outlined -rotate-45 text-[18px] text-white/60">
                filter_vintage
              </span>
            </button>

            <button
              type="button"
              onClick={cycleSortMode}
              className={cn(
                styles.runeButton,
                "flex h-8 w-8 rotate-45 items-center justify-center border border-white/20 bg-white/5 transition-all duration-500 hover:border-white/60 hover:bg-white/10",
              )}
              aria-label="Change sort mode"
              title={`Sort ${sortModeLabel}`}
            >
              <span className="material-symbols-outlined -rotate-45 text-[18px] text-white/60">
                reorder
              </span>
            </button>
          </div>
        </div>

        <div className="flex w-full items-center justify-between gap-4 md:w-auto md:justify-end">
          <span className="whitespace-nowrap font-meta text-[9px] uppercase tracking-[0.12em] text-[var(--collection-ink-soft)] sm:tracking-[0.3em]">
            Display Mode
          </span>
          {/* the same stretched diamond as the checkbox, drawn as a track */}
          <div className="chamfer chamfer-track flex [--chamfer-h:1.5rem] p-0.5">
            <button
              type="button"
              onClick={() => onViewModeChange("detailed")}
              aria-pressed={viewMode === "detailed"}
              className={cn(
                "chamfer chamfer-square flex h-5 min-w-[calc(6ch+2.5rem)] [--chamfer-h:1.25rem] items-center px-5 font-meta text-[9px] uppercase tracking-[0.2em] transition-all duration-300",
                viewMode === "detailed"
                  ? "chamfer-selected text-[#241a00]"
                  : "chamfer-ghost text-[var(--collection-ink-muted)] hover:text-primary",
              )}
            >
              Detailed
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("compact")}
              aria-pressed={viewMode === "compact"}
              className={cn(
                "chamfer chamfer-square flex h-5 min-w-[calc(6ch+2.5rem)] [--chamfer-h:1.25rem] items-center px-5 font-meta text-[9px] uppercase tracking-[0.2em] transition-all duration-300",
                viewMode === "compact"
                  ? "chamfer-selected text-[#241a00]"
                  : "chamfer-ghost text-[var(--collection-ink-muted)] hover:text-primary",
              )}
            >
              Compact
            </button>
          </div>
        </div>
      </div>

      {showRuneFilters && (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/10 pt-3">
          <span className="text-[0.6rem] uppercase tracking-[0.18em] text-[var(--collection-ink-soft)]">
            Rune Filters
          </span>
          {runeFilters.map((filter) => {
            const active = selectedRunes.includes(filter.key);
            return (
              <button
                key={filter.key}
                type="button"
                className={cn(
                  "chamfer chamfer-square flex h-7 [--chamfer-h:1.75rem] items-center gap-1 px-2.5 transition-all",
                  active
                    ? "chamfer-selected text-[#241a00]"
                    : "chamfer-plate text-[var(--collection-ink-muted)]",
                )}
                onClick={() => onToggleRune(filter.key)}
                aria-label={filter.label}
                title={filter.label}
              >
                <span className="material-symbols-outlined text-[15px]">
                  {filter.icon}
                </span>
                <span className="text-[0.58rem] tracking-[0.08em]">
                  {filter.label}
                </span>
              </button>
            );
          })}
          <button
            type="button"
            className="chamfer chamfer-square chamfer-ghost h-7 [--chamfer-h:1.75rem] px-2.5 text-[0.58rem] text-[var(--collection-ink-muted)] transition-all hover:text-[var(--collection-ink)]"
            onClick={onClearRunes}
            disabled={selectedRunes.length === 0}
          >
            Clear
          </button>
          <span className="ml-auto text-[0.72rem] text-[var(--collection-ink-soft)]">
            {filteredCount}/{totalCount} shown • {foundCount} found
          </span>
        </div>
      )}
    </header>
  );
}

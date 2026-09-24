import { ChangeEvent, useState } from 'react';
import { cn } from '@/lib/utils';
import { CollectionRuneFilter, CollectionSortMode, CollectionViewMode } from '../types';
import styles from '../collection.module.css';

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

const runeFilters: Array<{ key: CollectionRuneFilter; icon: string; label: string }> = [
    { key: 'offense', icon: 'flare', label: 'Offense' },
    { key: 'defense', icon: 'shield', label: 'Defense' },
    { key: 'support', icon: 'help', label: 'Support' },
    { key: 'control', icon: 'filter_vintage', label: 'Control' },
    { key: 'resource', icon: 'auto_fix_high', label: 'Resource' }
];

const sortOrder: CollectionSortMode[] = ['name', 'levelDesc', 'levelAsc'];

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
    foundCount
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
        sortMode === 'name'
            ? 'A-Z'
            : sortMode === 'levelDesc'
                ? 'HIGH'
                : 'LOW';

    return (
        <header className="mb-10 border-b border-white/10 pb-6 md:mb-12">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                <div className="flex w-full flex-1 items-center gap-6">
                    <label className="group relative w-full max-w-xs">
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
                        <span className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent transition-all group-focus-within:h-0.5 group-focus-within:via-primary/80" />
                    </label>

                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => setShowRuneFilters(value => !value)}
                            className={cn(
                                styles.runeButton,
                                'flex h-8 w-8 rotate-45 items-center justify-center border border-white/20 bg-white/5 transition-all duration-500 hover:border-white/60 hover:bg-white/10',
                                showRuneFilters && 'border-white/60 bg-white/10'
                            )}
                            aria-label="Filter runes"
                        >
                            <span className="material-symbols-outlined -rotate-45 text-[18px] text-white/60">filter_vintage</span>
                        </button>

                        <button
                            type="button"
                            onClick={cycleSortMode}
                            className={cn(styles.runeButton, 'flex h-8 w-8 rotate-45 items-center justify-center border border-white/20 bg-white/5 transition-all duration-500 hover:border-white/60 hover:bg-white/10')}
                            aria-label="Change sort mode"
                            title={`Sort ${sortModeLabel}`}
                        >
                            <span className="material-symbols-outlined -rotate-45 text-[18px] text-white/60">reorder</span>
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <span className="font-meta text-[9px] uppercase tracking-[0.3em] text-[var(--collection-ink-soft)]">Display Mode</span>
                    <div className="flex rounded-full border border-white/10 bg-white/5 p-0.5">
                        <button
                            type="button"
                            onClick={() => onViewModeChange('detailed')}
                            className={cn(
                                'px-4 py-1 font-meta text-[9px] uppercase tracking-[0.2em] transition-all duration-300',
                                viewMode === 'detailed'
                                    ? 'rounded-full bg-primary text-[var(--collection-primary-ink)]'
                                    : 'text-[var(--collection-ink-muted)] hover:text-primary'
                            )}
                        >
                            Detailed
                        </button>
                        <button
                            type="button"
                            onClick={() => onViewModeChange('compact')}
                            className={cn(
                                'px-4 py-1 font-meta text-[9px] uppercase tracking-[0.2em] transition-all duration-300',
                                viewMode === 'compact'
                                    ? 'rounded-full bg-primary text-[var(--collection-primary-ink)]'
                                    : 'text-[var(--collection-ink-muted)] hover:text-primary'
                            )}
                        >
                            Compact
                        </button>
                    </div>
                </div>
            </div>

            {showRuneFilters && (
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/10 pt-3">
                    <span className="text-[0.6rem] uppercase tracking-[0.18em] text-[var(--collection-ink-soft)]">Rune Filters</span>
                    {runeFilters.map(filter => {
                        const active = selectedRunes.includes(filter.key);
                        return (
                            <button
                                key={filter.key}
                                type="button"
                                className={cn(
                                    'flex h-7 items-center gap-1 rounded-full border px-2 transition-all',
                                    active
                                        ? 'border-primary bg-primary text-[var(--collection-primary-ink)]'
                                        : 'border-white/20 bg-black/20 text-[var(--collection-ink-muted)]'
                                )}
                                onClick={() => onToggleRune(filter.key)}
                                aria-label={filter.label}
                                title={filter.label}
                            >
                                <span className="material-symbols-outlined text-[15px]">{filter.icon}</span>
                                <span className="text-[0.58rem] tracking-[0.08em]">{filter.label}</span>
                            </button>
                        );
                    })}
                    <button
                        type="button"
                        className="h-7 rounded-full border border-white/15 px-2 text-[0.58rem] text-[var(--collection-ink-muted)] transition-all hover:border-white/30"
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

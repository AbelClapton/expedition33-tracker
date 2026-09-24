'use client';

import { ChangeEvent } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { CollectionRuneFilter, CollectionSortMode, CollectionViewMode } from '../types';
import { collectionRuneFilters, collectionSortModes, getCollectionSortLabel } from '../utils/collectionControls';

interface CollectionSidebarProps {
    searchQuery: string;
    onSearchQueryChange: (value: string) => void;
    selectedRunes: CollectionRuneFilter[];
    runeCounts: Record<CollectionRuneFilter, number>;
    onToggleRune: (rune: CollectionRuneFilter) => void;
    onClearRunes: () => void;
    sortMode: CollectionSortMode;
    onSortModeChange: (mode: CollectionSortMode) => void;
    viewMode: CollectionViewMode;
    onViewModeChange: (mode: CollectionViewMode) => void;
    totalCount: number;
    filteredCount: number;
    foundCount: number;
    onResetFilters: () => void;
}

interface SidebarSectionProps {
    title: string;
    description?: string;
    children: React.ReactNode;
}

function SidebarSection({ title, description, children }: SidebarSectionProps) {
    return (
        <section className="space-y-3">
            <div className="space-y-1">
                <p className="font-meta text-[0.65rem] uppercase tracking-[0.22em] text-[var(--collection-ink-soft)]">{title}</p>
                {description ? <p className="text-[0.74rem] leading-5 text-[var(--collection-ink-muted)]">{description}</p> : null}
            </div>
            {children}
        </section>
    );
}

function SearchField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange(event.currentTarget.value);
    };

    return (
        <label className="group relative block">
            <span className="sr-only">Search pictos</span>
            <Input
                type="search"
                value={value}
                onChange={handleChange}
                placeholder="Whisper to the Archive..."
                className="pr-8 placeholder:text-[var(--collection-ink-soft)]"
            />
            <span className="pointer-events-none material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-[18px] text-primary/40 transition-colors group-focus-within:text-primary">
                flare
            </span>
        </label>
    );
}

function FilterChip({
    icon,
    label,
    count,
    active,
    onClick
}: {
    icon: string;
    label: string;
    count: number;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <Button
            type="button"
            variant={active ? 'default' : 'outline'}
            size="sm"
            onClick={onClick}
            className={cn(
                'w-full justify-between normal-case tracking-[0.08em]',
                !active && 'border-white/10 text-[#d0c5af] shadow-none hover:border-primary/40 hover:text-primary'
            )}
            aria-pressed={active}
        >
            <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">{icon}</span>
                <span>{label}</span>
            </span>
            <Badge variant={active ? 'secondary' : 'outline'} className="h-5 min-w-7 justify-center px-2 text-[0.58rem] tracking-[0.12em]">
                {count}
            </Badge>
        </Button>
    );
}

export function CollectionSidebar({
    searchQuery,
    onSearchQueryChange,
    selectedRunes,
    runeCounts,
    onToggleRune,
    onClearRunes,
    sortMode,
    onSortModeChange,
    viewMode,
    onViewModeChange,
    totalCount,
    filteredCount,
    foundCount,
    onResetFilters
}: CollectionSidebarProps) {
    const completion = totalCount > 0 ? Math.round((foundCount / totalCount) * 100) : 0;
    const activeRuneCount = selectedRunes.length;

    return (
        <aside className="lg:sticky lg:top-6">
            <div className="space-y-5 rounded-[0.25rem] border border-white/8 bg-[linear-gradient(180deg,rgba(31,34,39,0.92),rgba(12,14,17,0.98))] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-sm md:p-6">
                <div className="space-y-2">
                    <p className="font-meta text-[0.65rem] uppercase tracking-[0.28em] text-[var(--collection-ink-soft)]">Collection Filters</p>
                    <h2 className="text-xl tracking-[0.04em] text-[var(--collection-primary)]">Rune Icon Filters</h2>
                    <p className="max-w-xs text-sm leading-6 text-[var(--collection-ink-muted)]">
                        Narrow the archive, cycle the ledger sort, and keep the recovered pictos in view.
                    </p>
                </div>

                <SidebarSection title="Search" description="Match names, effects, or locations in the archive.">
                    <SearchField value={searchQuery} onChange={onSearchQueryChange} />
                </SidebarSection>

                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-white/8 bg-black/20 p-3">
                        <p className="font-meta text-[0.58rem] uppercase tracking-[0.2em] text-[var(--collection-ink-soft)]">Shown</p>
                        <p className="mt-1 text-2xl text-white">{filteredCount}</p>
                    </div>
                    <div className="rounded-lg border border-white/8 bg-black/20 p-3">
                        <p className="font-meta text-[0.58rem] uppercase tracking-[0.2em] text-[var(--collection-ink-soft)]">Found</p>
                        <p className="mt-1 text-2xl text-secondary">{foundCount}</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between text-[0.66rem] uppercase tracking-[0.2em] text-[var(--collection-ink-soft)]">
                        <span>Archive completion</span>
                        <span>{completion}%</span>
                    </div>
                    <Progress value={completion} />
                </div>

                <Separator className="bg-gradient-to-r from-transparent via-white/12 to-transparent" />

                <SidebarSection
                    title="Rune Filters"
                    description={activeRuneCount > 0 ? `${activeRuneCount} rune group${activeRuneCount === 1 ? '' : 's'} active.` : 'Select one or more rune families.'}
                >
                    <div className="space-y-2">
                        {collectionRuneFilters.map(filter => (
                            <FilterChip
                                key={filter.key}
                                icon={filter.icon}
                                label={filter.label}
                                count={runeCounts[filter.key]}
                                active={selectedRunes.includes(filter.key)}
                                onClick={() => onToggleRune(filter.key)}
                            />
                        ))}
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-1">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={onClearRunes}
                            disabled={selectedRunes.length === 0}
                            className="normal-case tracking-[0.08em] text-[var(--collection-ink-muted)] hover:text-primary"
                        >
                            Clear runes
                        </Button>

                        <p className="text-[0.68rem] uppercase tracking-[0.16em] text-[var(--collection-ink-soft)]">
                            {selectedRunes.length === 0 ? 'All families visible' : `${selectedRunes.length} selected`}
                        </p>
                    </div>
                </SidebarSection>

                <Separator className="bg-gradient-to-r from-transparent via-white/12 to-transparent" />

                <SidebarSection title="Sort" description={`Current order: ${getCollectionSortLabel(sortMode)}`}>
                    <div className="grid gap-2">
                        {collectionSortModes.map(option => (
                            <Button
                                key={option.key}
                                type="button"
                                variant={sortMode === option.key ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => onSortModeChange(option.key)}
                                className={cn(
                                    'justify-between normal-case tracking-[0.08em]',
                                    sortMode !== option.key && 'border-white/10 text-[#d0c5af] shadow-none hover:border-primary/40 hover:text-primary'
                                )}
                                aria-pressed={sortMode === option.key}
                                title={option.hint}
                            >
                                <span>{option.label}</span>
                                <span className="text-[0.6rem] uppercase tracking-[0.18em] opacity-70">{option.hint}</span>
                            </Button>
                        ))}
                    </div>
                </SidebarSection>

                <SidebarSection title="Display" description="Switch between a detailed record and a compact ledger.">
                    <div className="grid grid-cols-2 gap-2 rounded-lg border border-white/8 bg-black/20 p-1">
                        <Button
                            type="button"
                            variant={viewMode === 'detailed' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => onViewModeChange('detailed')}
                            className={cn(
                                'normal-case tracking-[0.08em]',
                                viewMode !== 'detailed' && 'text-[var(--collection-ink-muted)] hover:text-primary'
                            )}
                        >
                            Detailed
                        </Button>
                        <Button
                            type="button"
                            variant={viewMode === 'compact' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => onViewModeChange('compact')}
                            className={cn(
                                'normal-case tracking-[0.08em]',
                                viewMode !== 'compact' && 'text-[var(--collection-ink-muted)] hover:text-primary'
                            )}
                        >
                            Compact
                        </Button>
                    </div>
                </SidebarSection>

                <Separator className="bg-gradient-to-r from-transparent via-white/12 to-transparent" />

                <div className="flex items-center justify-between gap-4">
                    <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[var(--collection-ink-soft)]">
                        {filteredCount}/{totalCount} shown
                    </p>
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={onResetFilters}
                        className="normal-case tracking-[0.08em]"
                    >
                        Reset archive
                    </Button>
                </div>
            </div>
        </aside>
    );
}
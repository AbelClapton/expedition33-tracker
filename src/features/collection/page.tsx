'use client';

import { TrackerShell } from '@/components/layout/TrackerShell';
import { luminas, pictos } from '@/engine/data';
import { CollectionToolbar } from './components/CollectionToolbar';
import { PictoCardGrid } from './components/PictoCardGrid';
import { useCollectionState } from './hooks/useCollectionState';

export default function CollectionPage() {
    const {
        cards,
        searchQuery,
        setSearchQuery,
        selectedRunes,
        toggleRune,
        clearRunes,
        sortMode,
        setSortMode,
        viewMode,
        setViewMode,
        isFound,
        toggleFound,
        totalCount,
        filteredCount,
        foundCount
    } = useCollectionState(pictos, luminas);

    return (
        <TrackerShell>
            <div>
                <CollectionToolbar
                    searchQuery={searchQuery}
                    onSearchQueryChange={setSearchQuery}
                    selectedRunes={selectedRunes}
                    onToggleRune={toggleRune}
                    onClearRunes={clearRunes}
                    sortMode={sortMode}
                    onSortModeChange={setSortMode}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    totalCount={totalCount}
                    filteredCount={filteredCount}
                    foundCount={foundCount}
                />

                <PictoCardGrid
                    cards={cards}
                    viewMode={viewMode}
                    isFound={isFound}
                    onToggleFound={toggleFound}
                />
            </div>
        </TrackerShell>
    );
}

"use client";

import { TrackerShell } from "@/components/layout/TrackerShell";
import { luminas, pictos } from "@/engine/data";
import {
  DEFAULT_COLLECTION_LAYER_ID,
  resolveCollectionLayer,
} from "./collectionLayers";
import { CollectionEntryList } from "./components/CollectionEntryList";
import {
  CollectionLayerNav,
  CollectionLayerTabs,
} from "./components/CollectionLayerNav";
import { CollectionLayerPending } from "./components/CollectionLayerPending";
import { CollectionToolbar } from "./components/CollectionToolbar";
import { PictoCardGrid } from "./components/PictoCardGrid";
import { useCollectionState } from "./hooks/useCollectionState";
import { useFoundEntries } from "./hooks/useFoundEntries";
import type { CollectionEntry } from "./types";

interface CollectionPageProps {
  /** Registry id of the layer to render; /collections serves the default one. */
  layerId?: string;
  /** Entries of that layer, loaded server-side so only this page pays for them. */
  entries?: CollectionEntry[];
}

export default function CollectionPage({
  layerId = DEFAULT_COLLECTION_LAYER_ID,
  entries,
}: CollectionPageProps) {
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
    foundCount,
  } = useCollectionState(pictos, luminas);

  const layer = resolveCollectionLayer(layerId);
  const entryLayer = entries && entries.length > 0 ? entries : null;
  const entryFound = useFoundEntries(layer.id);

  // Live progress for the layer on screen; the rest of the sidebar reads the
  // generated counts instead.
  const counts = {
    [DEFAULT_COLLECTION_LAYER_ID]: { found: foundCount, total: totalCount },
    ...(entryLayer
      ? {
          [layer.id]: {
            found: entryFound.foundIds.length,
            total: entryLayer.length,
          },
        }
      : {}),
  };

  return (
    <TrackerShell sidebar={<CollectionLayerNav counts={counts} />}>
      <div>
        <CollectionLayerTabs counts={counts} />

        {layer.id === DEFAULT_COLLECTION_LAYER_ID ? (
          <>
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
          </>
        ) : entryLayer ? (
          <CollectionEntryList
            layer={layer}
            entries={entryLayer}
            foundSet={entryFound.foundSet}
            onToggleFound={entryFound.toggleFound}
          />
        ) : (
          <CollectionLayerPending layer={layer} />
        )}
      </div>
    </TrackerShell>
  );
}

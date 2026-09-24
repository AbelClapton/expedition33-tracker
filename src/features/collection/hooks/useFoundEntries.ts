"use client";

import { useCallback, useMemo } from "react";
import { foundEntriesKey } from "@/hooks/foundKeys";
import { localStorageStore } from "@/hooks/localStorageStore";
import { trackedKeyFor, untrackKeys } from "@/hooks/useTracking";
import { useLocalStorage } from "@/hooks/useLocalStorage";

/**
 * localStorage key for one Library layer, from the shared `foundKeys` map - the
 * tracking rules read the same keys to keep collected entries out of the tracked
 * list. Never renamed: they hold real player progress.
 */
export { foundEntriesKey };

/** Module-level, because it doubles as the server snapshot for the store. */
const EMPTY_IDS: string[] = [];

/**
 * The shared store behind one layer's found ids. Keyed, so asking twice - from a
 * hook, or from the atlas' pin cards - hands back the same subscription list and
 * a write from either side reaches both.
 */
export function foundEntriesStore(layerId: string) {
  return localStorageStore<string[]>(foundEntriesKey(layerId), EMPTY_IDS);
}

/**
 * Mark one Library entry found / not found without mounting a hook, for the map's
 * pin cards (their markup is built outside React). Writes the same key the
 * Library rows do, so a card and its row cannot disagree.
 */
export function setFoundEntry(
  layerId: string,
  id: string | number,
  found: boolean,
) {
  const value = String(id);

  // what is collected is no longer something to hunt down
  if (found) untrackKeys([trackedKeyFor(layerId, value)]);

  foundEntriesStore(layerId).set((previous) => {
    const has = previous.includes(value);
    if (found === has) return previous;

    return found
      ? [...previous, value]
      : previous.filter((item) => item !== value);
  });
}

/**
 * Found state for one Library layer, keyed by the layer's own entry ids.
 *
 * The key is derived from the layer, and the store behind `useLocalStorage` is keyed
 * too, so `/collections/<layer>` reusing this component from one layer to the next
 * reads the new layer's ids on its own - and can never write one layer's ids over
 * another's, which a `useState` + storage-effect version has to fight to avoid.
 */
export function useFoundEntries(layerId: string) {
  const [foundIds, setFoundIds] = useLocalStorage<string[]>(
    foundEntriesKey(layerId),
    EMPTY_IDS,
  );
  const foundSet = useMemo(() => new Set(foundIds), [foundIds]);

  const toggleFound = useCallback(
    (id: string | number) => {
      const value = String(id);

      // collecting an entry drops it from the tracked list
      if (!foundSet.has(value)) untrackKeys([trackedKeyFor(layerId, value)]);

      setFoundIds((previous) =>
        previous.includes(value)
          ? previous.filter((item) => item !== value)
          : [...previous, value],
      );
    },
    [foundSet, layerId, setFoundIds],
  );

  return {
    foundIds,
    foundSet,
    toggleFound,
    isFound: (id: string | number) => foundSet.has(String(id)),
  };
}

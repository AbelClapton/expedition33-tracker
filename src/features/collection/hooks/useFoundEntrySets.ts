"use client";

import { useEffect, useState } from "react";
import { foundEntriesStore } from "./useFoundEntries";

function readSets(layerIds: string[]): Record<string, Set<string>> {
  const sets: Record<string, Set<string>> = {};

  for (const id of layerIds) {
    sets[id] = new Set(foundEntriesStore(id).getSnapshot().map(String));
  }

  return sets;
}

/**
 * Found sets for many Library layers at once, for views that filter across
 * layers (the atlas' found / not-found control). One `useFoundEntries` per layer
 * would work too, but that is a hook per layer and the counts here have to be
 * read together anyway.
 *
 * Reads the same `collection-found-<layerId>` keys the Library writes - through the
 * shared stores, so a mark made anywhere in the tab moves the map at once.
 */
export function useFoundEntrySets(
  layerIds: string[],
): Record<string, Set<string>> {
  const key = layerIds.join("|");
  // empty until the effect reads the keys, so the first render matches the server
  const [sets, setSets] = useState<Record<string, Set<string>>>({});

  useEffect(() => {
    const ids = key ? key.split("|") : [];
    const reload = () => setSets(readSets(ids));

    reload();
    // One store per layer, so a write from either side - a Library row, an atlas
    // pin card, another tab (the store follows `storage` itself) - lands here.
    const unsubscribes = ids.map((id) =>
      foundEntriesStore(id).subscribe(reload),
    );

    return () => {
      for (const unsubscribe of unsubscribes) unsubscribe();
    };
  }, [key]);

  return sets;
}

import { useMemo } from "react";
import { FOUND_PICTOS_KEY, PICTOS_LAYER_ID } from "./foundKeys";
import { localStorageStore } from "./localStorageStore";
import { trackedKeyFor, untrackKeys } from "./useTracking";
import { useLocalStorage } from "./useLocalStorage";

/**
 * Which pictos the player has found. Shared by the collection grid (where they
 * are toggled) and the map's found / not-found filter.
 *
 * The key is spelled out in `foundKeys.ts` and must not change: it holds real
 * player progress.
 */
export { FOUND_PICTOS_KEY };

/** Module-level, because the store behind the hook uses it as its server snapshot. */
const EMPTY_IDS: string[] = [];

/**
 * Mark a set of pickups found / not found without mounting a hook, for the map's
 * pin cards.
 *
 * A pin stands for a picto while the tracker stores one entry per pickup, so the
 * card has to move the whole set: `isPictoPinFound` counts a pin found when *any*
 * pickup is, and leaving the rest unmarked would make the next click read as
 * "already found".
 */
export function setPictosFound(ids: string[], found: boolean) {
  if (ids.length === 0) return;

  // what is collected is no longer something to hunt down
  if (found) untrackKeys(ids.map((id) => trackedKeyFor(PICTOS_LAYER_ID, id)));

  localStorageStore<string[]>(FOUND_PICTOS_KEY, EMPTY_IDS).set((previous) => {
    const next = new Set(previous);

    for (const id of ids) {
      if (found) next.add(id);
      else next.delete(id);
    }

    return [...next];
  });
}

export function useFoundPictos() {
  const [foundIds, setFoundIds] = useLocalStorage<string[]>(
    FOUND_PICTOS_KEY,
    EMPTY_IDS,
  );
  const foundSet = useMemo(() => new Set(foundIds), [foundIds]);

  const toggleFound = (id: string) => {
    // collecting a picto drops it from the tracked list
    if (!foundSet.has(id)) untrackKeys([trackedKeyFor(PICTOS_LAYER_ID, id)]);

    setFoundIds((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    );
  };

  return { foundIds, foundSet, toggleFound };
}

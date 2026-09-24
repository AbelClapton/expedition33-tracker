"use client";

import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";
import { foundKeyFor } from "./foundKeys";
import { localStorageStore } from "./localStorageStore";

/**
 * Tracking: the entries the player is still out to get.
 *
 * Deliberately not "wishlist" - the tracker's vocabulary is the expedition's
 * (Library, Archive, Atlas, Found, Seekers), and these are the entries you have
 * marked to hunt down.
 *
 * Stored as `<layerId>:<entryId>` so entries from different sources cannot
 * collide (engine ids, wiki pin ids and reference-map ids all end up here).
 *
 * The key is still spelled `collection-quarry`: it was named before the feature
 * was renamed, and it holds real player intent, so it must not change.
 */
export const TRACKED_KEY = "collection-quarry";

export const trackedKeyFor = (layerId: string, id: string | number) =>
  `${layerId}:${String(id)}`;

/** Module-level, because the store uses it as its server snapshot too. */
const EMPTY_KEYS: string[] = [];

/**
 * One store for the whole tab, shared with everything that renders a toggle.
 *
 * A Track toggle sits on every picto card, every list row and every map card -
 * hundreds of instances at once - so per-instance state would let the second
 * click rewrite storage from a stale snapshot and drop the first entry.
 */
const trackedStore = localStorageStore<string[]>(TRACKED_KEY, EMPTY_KEYS);

/** Module-level, because the found stores use it as their server snapshot. */
const NO_FOUND_IDS: string[] = [];

/** The store holding one layer's found entries - the same one the Library writes. */
const foundStore = (layerId: string) =>
  localStorageStore<string[]>(foundKeyFor(layerId), NO_FOUND_IDS);

/** Whether the collection already holds this entry. */
export function entryIsFound(layerId: string, id: string | number) {
  const value = String(id);

  return foundStore(layerId)
    .getSnapshot()
    .some((entry) => String(entry) === value);
}

/** Drop tracked keys, for entries that have just been collected. */
export function untrackKeys(keys: string[]) {
  if (keys.length === 0) return;

  trackedStore.set((previous) => {
    const drop = new Set(keys);
    const next = previous.filter((key) => !drop.has(key));

    // same array back when nothing matched, so no subscriber re-renders
    return next.length === previous.length ? previous : next;
  });
}

/**
 * A collected entry cannot stay tracked, so stored pairs are reconciled once: the
 * first mount of the hook (every card and row mounts it, so this runs early)
 * drops anything the collection already holds. Never during render, idempotent,
 * and the writers keep the rule from then on.
 */
let reconciled = false;

function reconcileTracked() {
  if (reconciled) return;
  reconciled = true;

  const keys = trackedStore.getSnapshot();
  if (keys.length === 0) return;

  const byLayer = new Map<string, string[]>();

  for (const key of keys) {
    const separator = key.indexOf(":");
    if (separator < 1) continue;

    const layerId = key.slice(0, separator);
    byLayer.set(layerId, [...(byLayer.get(layerId) ?? []), key]);
  }

  const collected: string[] = [];

  for (const [layerId, layerKeys] of byLayer) {
    const found = new Set(foundStore(layerId).getSnapshot().map(String));

    for (const key of layerKeys) {
      if (found.has(key.slice(key.indexOf(":") + 1))) collected.push(key);
    }
  }

  untrackKeys(collected);
}

/** Toggle an entry, from anywhere. Kept outside React: there is only one list. */
export const toggleTrackedKey = (layerId: string, id: string | number) => {
  const key = trackedKeyFor(layerId, id);
  const tracked = trackedStore.getSnapshot();

  // What you have already collected is not something you are still out to get.
  // Removal stays open, so a pair stored before this rule can still be cleared.
  if (!tracked.includes(key) && entryIsFound(layerId, id)) return;

  trackedStore.set((previous) =>
    previous.includes(key)
      ? previous.filter((entry) => entry !== key)
      : [...previous, key],
  );
};

export function useTracking() {
  const trackedKeys = useSyncExternalStore(
    trackedStore.subscribe,
    trackedStore.getSnapshot,
    trackedStore.getServerSnapshot,
  );

  const trackedSet = useMemo(() => new Set(trackedKeys), [trackedKeys]);

  // one pass over the stored list per tab, and never during render
  useEffect(reconcileTracked, []);

  /** Per-layer counts, so a sidebar can show how much of each layer is tracked. */
  const trackedByLayer = useMemo(() => {
    const counts: Record<string, number> = {};

    for (const key of trackedKeys) {
      const layerId = key.slice(0, key.indexOf(":"));
      counts[layerId] = (counts[layerId] ?? 0) + 1;
    }

    return counts;
  }, [trackedKeys]);

  const toggleTracked = useCallback(
    (layerId: string, id: string | number) => toggleTrackedKey(layerId, id),
    [],
  );

  const isTracked = useCallback(
    (layerId: string, id: string | number) =>
      trackedSet.has(trackedKeyFor(layerId, id)),
    [trackedSet],
  );

  return {
    trackedKeys,
    trackedSet,
    trackedByLayer,
    trackedCount: trackedKeys.length,
    isTracked,
    toggleTracked,
  };
}

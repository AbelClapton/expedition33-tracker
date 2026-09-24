"use client";

/**
 * One subscribable store per localStorage key.
 *
 * Hand-rolled instead of `useState` + `useEffect` because of server rendering:
 * `useSyncExternalStore` is told which value the server rendered with, so hydration
 * cannot mismatch, and the read happens after the first render instead of during it.
 * Reading localStorage in a `useState` initialiser - the obvious version - makes the
 * client's first render disagree with the server's HTML, and React answers that by
 * throwing the tree away and re-rendering it. Everything downstream of these keys
 * (progress counts, found state, the picto grid, the sidebar) renders from the value,
 * so one bad read mismatches a whole page.
 *
 * A store also fixes a second problem for free: a write from any hook instance in the
 * tab reaches all of them. Where a toggle appears hundreds of times on one page (the
 * picto grid, the atlas' cards), per-instance state lets the second click rewrite the
 * key from a stale snapshot and drop the first entry.
 */
type Listener = () => void;

export interface LocalStorageStore<T> {
  subscribe: (listener: Listener) => () => void;
  getSnapshot: () => T;
  getServerSnapshot: () => T;
  /** Set a value, or update from the current one - which is read if it has not been yet. */
  set: (updater: T | ((previous: T) => T)) => void;
}

const stores = new Map<string, LocalStorageStore<unknown>>();

/**
 * The store for a key, created on first use and shared from then on.
 *
 * `initialValue` is captured on creation and used both for a missing key and as the
 * server snapshot, so it must be stable (the module-level empty array, not a fresh
 * literal) - `useSyncExternalStore` compares snapshots by reference.
 */
export function localStorageStore<T>(
  key: string,
  initialValue: T,
): LocalStorageStore<T> {
  const existing = stores.get(key) as LocalStorageStore<T> | undefined;
  if (existing) return existing;

  let value = initialValue;
  let loaded = false;
  const listeners = new Set<Listener>();

  /** Unreadable or absent keys fall back to the initial value rather than throwing. */
  const parse = (raw: string | null): T => {
    if (raw === null) return initialValue;

    try {
      return JSON.parse(raw) as T;
    } catch {
      return initialValue;
    }
  };

  const emit = () => {
    for (const listener of listeners) listener();
  };

  const store: LocalStorageStore<T> = {
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot: () => {
      // the lazy read: never during the first render, always by the time it settles
      if (!loaded && typeof window !== "undefined") {
        loaded = true;
        value = parse(window.localStorage.getItem(key));
      }

      return value;
    },
    getServerSnapshot: () => initialValue,
    set: (updater) => {
      const next =
        typeof updater === "function"
          ? (updater as (previous: T) => T)(store.getSnapshot())
          : updater;

      value = next;
      loaded = true;

      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // a full or blocked storage must not break the toggle that got us here
      }

      emit();
    },
  };

  // Another tab writing the same key (the map's filter follows the collection).
  // Registered once per key, for the life of the tab: keys are few and stable.
  if (typeof window !== "undefined") {
    window.addEventListener("storage", (event) => {
      if (event.key !== key) return;

      loaded = true;
      value = parse(event.newValue);
      emit();
    });
  }

  stores.set(key, store as LocalStorageStore<unknown>);

  return store;
}

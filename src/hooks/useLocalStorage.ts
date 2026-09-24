import { useSyncExternalStore } from "react";
import { localStorageStore } from "./localStorageStore";

/**
 * localStorage-backed state, shared by every hook instance using the key.
 *
 * A thin wrapper over `localStorageStore`, which holds the reasoning: reading storage
 * during the first render is a hydration mismatch, and per-instance state lets two
 * toggles of the same key clobber each other. Pass a module-level constant for
 * `initialValue` (e.g. `EMPTY_IDS`) - it doubles as the server snapshot, and
 * `useSyncExternalStore` compares snapshots by reference.
 */
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const store = localStorageStore(key, initialValue);
  const value = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );

  return [value, store.set] as const;
};

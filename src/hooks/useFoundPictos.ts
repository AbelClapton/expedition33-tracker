import { useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";

/**
 * Which pictos the player has found. Shared by the collection grid (where they
 * are toggled) and the map's found / not-found filter.
 *
 * The key is spelled out and must not change: it holds real player progress.
 */
export const FOUND_PICTOS_KEY = "collection-found-pictos";

export function useFoundPictos() {
  const [foundIds, setFoundIds] = useLocalStorage<string[]>(
    FOUND_PICTOS_KEY,
    [],
  );
  const foundSet = useMemo(() => new Set(foundIds), [foundIds]);

  const toggleFound = (id: string) => {
    setFoundIds((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    );
  };

  return { foundIds, foundSet, toggleFound };
}

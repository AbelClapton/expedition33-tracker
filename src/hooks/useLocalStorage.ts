import { useEffect, useState } from "react";

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    const rawValue = localStorage.getItem(key);
    if (!rawValue) return initialValue;

    try {
      return JSON.parse(rawValue) as T;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  // Another tab writing the same key (the map's filter follows the collection)
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const onStorage = (event: StorageEvent) => {
      if (event.key !== key) return;

      if (event.newValue === null) {
        setState(initialValue);
        return;
      }

      try {
        setState(JSON.parse(event.newValue) as T);
      } catch {
        setState(initialValue);
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
    // initialValue is only a fallback for a cleared key, so it is not a dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [state, setState] as const;
};

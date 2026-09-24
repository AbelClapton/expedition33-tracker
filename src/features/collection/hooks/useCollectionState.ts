import { useMemo, useState } from "react";
import { Lumina, Picto } from "@/engine/types";
import { useFoundPictos } from "@/hooks/useFoundPictos";
import {
  CollectionRuneFilter,
  CollectionSortMode,
  CollectionViewMode,
} from "../types";
import { buildCollectionCards } from "../utils/collectionMappers";

interface UseCollectionStateResult {
  cards: ReturnType<typeof buildCollectionCards>;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedRunes: CollectionRuneFilter[];
  toggleRune: (rune: CollectionRuneFilter) => void;
  clearRunes: () => void;
  sortMode: CollectionSortMode;
  setSortMode: (mode: CollectionSortMode) => void;
  viewMode: CollectionViewMode;
  setViewMode: (value: CollectionViewMode) => void;
  foundIds: string[];
  isFound: (id: string) => boolean;
  toggleFound: (id: string) => void;
  totalCount: number;
  filteredCount: number;
  foundCount: number;
}

export function useCollectionState(
  pictos: Picto[],
  luminas: Lumina[],
): UseCollectionStateResult {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRunes, setSelectedRunes] = useState<CollectionRuneFilter[]>(
    [],
  );
  const [sortMode, setSortMode] = useState<CollectionSortMode>("name");
  const [viewMode, setViewMode] = useState<CollectionViewMode>("detailed");
  const { foundIds, foundSet, toggleFound } = useFoundPictos();

  const allCards = useMemo(
    () => buildCollectionCards(pictos, luminas),
    [pictos, luminas],
  );

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const cards = useMemo(() => {
    const filteredCards = allCards.filter((card) => {
      const queryMatch =
        normalizedQuery.length === 0 ||
        card.name.toLowerCase().includes(normalizedQuery) ||
        card.effect.toLowerCase().includes(normalizedQuery) ||
        card.location.toLowerCase().includes(normalizedQuery);

      const runeMatch =
        selectedRunes.length === 0 ||
        card.runes.some((rune) => selectedRunes.includes(rune));

      return queryMatch && runeMatch;
    });

    return [...filteredCards].sort((left, right) => {
      if (sortMode === "levelDesc") {
        return right.level - left.level;
      }

      if (sortMode === "levelAsc") {
        return left.level - right.level;
      }

      return left.name.localeCompare(right.name);
    });
  }, [allCards, normalizedQuery, selectedRunes, sortMode]);

  const toggleRune = (rune: CollectionRuneFilter) => {
    setSelectedRunes((previous) =>
      previous.includes(rune)
        ? previous.filter((item) => item !== rune)
        : [...previous, rune],
    );
  };

  const clearRunes = () => {
    setSelectedRunes([]);
  };

  return {
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
    foundIds,
    isFound: (id: string) => foundSet.has(id),
    toggleFound,
    totalCount: allCards.length,
    filteredCount: cards.length,
    foundCount: allCards.filter((card) => foundSet.has(card.id)).length,
  };
}

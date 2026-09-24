export type CollectionViewMode = "detailed" | "compact";
export type CollectionSortMode = "name" | "levelDesc" | "levelAsc";

export type CollectionRuneFilter =
  | "offense"
  | "defense"
  | "support"
  | "control"
  | "resource";

export interface CollectionStat {
  label: string;
  value: number;
}

export interface CollectionCardModel {
  id: string;
  name: string;
  location: string;
  effect: string;
  level: number;
  imagePath: string;
  stats: CollectionStat[];
  runes: CollectionRuneFilter[];
}

/**
 * One marker from the reference map, as written by scripts/fetch-collectables.mjs.
 * `lat`/`lng` are MapGenie mercator degrees, kept for the atlas step - nothing
 * renders them yet.
 */
export interface CollectionEntry {
  id: number;
  name: string;
  category: string;
  region: string | null;
  description?: string;
  lat: number;
  lng: number;
}

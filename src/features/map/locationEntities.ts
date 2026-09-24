import { pictos } from "@/engine/data";
import { pictoIconPath } from "@/engine/utils/pictoIcon";
import locationPins from "./data/locationPins.json";

/** A collectable that sits inside a location — currently always a picto. */
export type LocationEntity = {
  id: string;
  name: string;
  level: number;
  icon: string;
  /** The wiki's own "where to find it" text, used as the row's tooltip. */
  found: string;
};

/**
 * Which pictos belong to which location.
 *
 * The wiki's map data has no location-to-entity nesting (every marker sits in
 * exactly one flat layer), and its location pages do not list collectables. What
 * does name the location is the tracker's own picto data, e.g.
 * "Found within Frozen Hearts - On top of train wreck", so the index is derived
 * from that text.
 */
let LOCATION_ENTITIES: Record<string, LocationEntity[]> | null = null;

/** The collectables recorded inside a location, lowest level first. */
export function locationEntities(name: string): LocationEntity[] {
  // Built on first use: the matcher below has to be initialised first.
  LOCATION_ENTITIES ??= buildIndex();
  return LOCATION_ENTITIES[name] ?? [];
}

const LOCATION_NAMES = [
  ...new Set((locationPins as { name: string }[]).map((pin) => pin.name)),
];

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Same as normalize, but keeps commas: the matcher needs to see list separators. */
function normalizeForMatch(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9,]+/g, " ")
    .replace(/,/g, " , ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(value: string): string[] {
  return value.trim().split(" ").filter(Boolean);
}

/**
 * A conjunction without a comma in front of it glues the match onto the noun
 * phrase before it - "ground beneath red and white tree" is not a mention of
 * White Tree. A comma makes it a real list item: "...near Anthonypo, and Endless
 * Tower Stage 4".
 */
function isStandaloneMention(haystack: string, at: number): boolean {
  const before = tokens(haystack.slice(0, at));
  const conjunction = before[before.length - 1];
  if (conjunction !== "and" && conjunction !== "or") return true;
  return before[before.length - 2] === ",";
}

// Longest name first, so "Old Lumiere" is consumed before "Lumiere" can match
// inside it (same for "Sirene's Dress" and "Stone Wave Cliffs Cave").
const MATCHERS = LOCATION_NAMES.map((name) => ({
  name,
  needle: ` ${normalize(name)} `,
})).sort((a, b) => b.needle.length - a.needle.length);

/** Every location named in a picto's "where to find it" text. */
function locationsNamedIn(text: string): string[] {
  // Padded so a needle can match whole words at either end of the text.
  let haystack = ` ${normalizeForMatch(text)} `;
  const found: string[] = [];

  for (const { name, needle } of MATCHERS) {
    let named = false;

    // Consume every occurrence, so a shorter name nested inside a longer match
    // ("Lumiere" in "Old Lumiere") can never match as well.
    for (;;) {
      const at = haystack.indexOf(needle);
      if (at === -1) break;
      if (isStandaloneMention(haystack, at)) named = true;
      haystack =
        haystack.slice(0, at) +
        " ".repeat(needle.length) +
        haystack.slice(at + needle.length);
    }

    if (named) found.push(name);
  }

  return found;
}

function buildIndex(): Record<string, LocationEntity[]> {
  const index: Record<string, LocationEntity[]> = {};
  for (const name of LOCATION_NAMES) index[name] = [];

  for (const picto of pictos) {
    for (const location of locationsNamedIn(picto.location)) {
      index[location].push({
        id: picto.id,
        name: picto.name,
        level: picto.level,
        icon: pictoIconPath(picto.id),
        found: picto.location,
      });
    }
  }

  for (const entities of Object.values(index)) {
    entities.sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
  }

  return index;
}

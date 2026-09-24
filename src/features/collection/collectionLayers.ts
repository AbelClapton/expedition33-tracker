/**
 * The collectible layers of the Library.
 *
 * One entry per set of things you can collect in the game, so the sidebar, the
 * routes and (later) the per-layer data all read from this single list. Adding a
 * layer here is what makes it reachable - everything else is data work.
 *
 * `expectedMarkers` is the count the reference interactive map holds for that
 * category; the real per-layer counts live in `data/layers.json`, which
 * `scripts/fetch-collectables.mjs` writes from that same map. `available` says the
 * tracker holds the layer's data - the engine owns pictos, the generated files
 * under `data/` cover the rest.
 */

import { assetPath } from "@/lib/assetPath";
import { PICTO_PIN_ICON } from "@/engine/utils/pictoIcon";

/**
 * Layer marks that are real art rather than a glyph. `PICTO_PIN_ICON` is the wiki's
 * lumina-points icon (shared with the atlas pins and the card footers); the chroma
 * mark is the diamond supplied directly for this layer.
 */
const CHROMA_PIN_ICON = assetPath("/images/chroma/chroma-icon.webp");

export type CollectionLayerGroupId =
  | "lumina"
  | "gear"
  | "records"
  | "curiosities";

export interface CollectionLayerGroup {
  id: CollectionLayerGroupId;
  label: string;
}

export interface CollectionLayer {
  /** URL segment under /collections. */
  id: string;
  /** Sidebar row + page heading. */
  label: string;
  group: CollectionLayerGroupId;
  /** Material Symbols glyph. */
  icon: string;
  /**
   * Game art we actually hold for the layer, already run through `assetPath`.
   * When set it replaces the glyph in the Library nav (sidebar, mobile tabs,
   * pending card); everything else - the atlas pins, in particular - keeps
   * drawing `icon`.
   */
  iconImage?: string;
  /** Pin tint on the atlas, kept in the same warm/teal family as the map chrome. */
  color: string;
  /** Exact filter label on the reference interactive map, used to pull its data. */
  mapCategory: string;
  /** Pins the reference map holds for `mapCategory`. */
  expectedMarkers: number;
  /** True once the tracker actually holds this layer's data. */
  available: boolean;
  blurb: string;
}

export const COLLECTION_LAYER_GROUPS: CollectionLayerGroup[] = [
  { id: "lumina", label: "Pictos & Lumina" },
  { id: "gear", label: "Gear" },
  { id: "records", label: "Records" },
  { id: "curiosities", label: "Curiosities" },
];

export const COLLECTION_LAYERS: CollectionLayer[] = [
  {
    id: "pictos",
    label: "Pictos",
    group: "lumina",
    icon: "auto_awesome",
    // the same art the atlas pins and the card footers use for a picto
    iconImage: PICTO_PIN_ICON,
    color: "#f2ca50",
    mapCategory: "Pictos",
    expectedMarkers: 252,
    available: true,
    blurb:
      "Equippable passives, one card per pickup, with its lumina effect and location.",
  },
  {
    id: "lumina",
    label: "Colour of Lumina",
    group: "lumina",
    icon: "flare",
    color: "#f2ca50",
    mapCategory: "Colour of Lumina",
    expectedMarkers: 236,
    available: true,
    blurb:
      "The points you spend to equip lumina, picked up across the continent.",
  },
  {
    id: "chroma",
    label: "Chroma",
    group: "lumina",
    icon: "palette",
    iconImage: CHROMA_PIN_ICON,
    color: "#59dad1",
    mapCategory: "Chroma",
    expectedMarkers: 150,
    available: true,
    blurb: "Pigments that recolour a weapon or outfit once applied.",
  },
  {
    id: "chroma-catalysts",
    label: "Chroma Catalysts",
    group: "lumina",
    icon: "deployed_code",
    color: "#8fd9e8",
    mapCategory: "Chroma Catalyst",
    expectedMarkers: 156,
    available: true,
    blurb: "Materials that unlock the deeper chroma tiers.",
  },
  {
    id: "recoat",
    label: "Recoat",
    group: "lumina",
    icon: "format_paint",
    color: "#b9a2f2",
    mapCategory: "Recoat",
    expectedMarkers: 21,
    available: true,
    blurb: "Rare finishes applied on top of an existing chroma.",
  },
  {
    id: "weapons",
    label: "Weapons",
    group: "gear",
    icon: "swords",
    color: "#e08c5a",
    mapCategory: "Weapon",
    expectedMarkers: 121,
    available: true,
    blurb: "Every weapon per character, with its stats and where it drops.",
  },
  {
    id: "outfits",
    label: "Outfits",
    group: "gear",
    // a garment read, not the hanger the layer used to borrow (`checkroom`)
    icon: "apparel",
    color: "#d98cb3",
    mapCategory: "Outfit",
    expectedMarkers: 70,
    available: true,
    blurb: "Outfit sets found or bought across the expedition.",
  },
  {
    id: "hairstyles",
    label: "Hairstyles",
    group: "gear",
    icon: "cut",
    color: "#c9a06a",
    mapCategory: "Haircut",
    expectedMarkers: 105,
    available: true,
    blurb: "Haircuts unlocked per character, including the vendor sets.",
  },
  {
    id: "tints",
    label: "Tints",
    group: "gear",
    // a bottle: the tint shards are flasks of pigment (`liquor` is a glass AND a
    // bottle - two shapes - so it mushes at the nav's 20px)
    icon: "water_bottle",
    color: "#a8d08d",
    mapCategory: "Tint",
    expectedMarkers: 37,
    available: true,
    blurb: "Tint shards that recolour an outfit's palette.",
  },
  {
    id: "journal-entries",
    label: "Journal Entries",
    group: "records",
    icon: "menu_book",
    color: "#d8cfae",
    mapCategory: "Journal Entry",
    expectedMarkers: 49,
    available: true,
    blurb: "Expedition journal pages, each with its own entry text.",
  },
  {
    id: "music-records",
    label: "Music Records",
    group: "records",
    icon: "album",
    color: "#8fb8f2",
    mapCategory: "Music Record",
    expectedMarkers: 34,
    available: true,
    blurb: "Records that add a track to the camp gramophone.",
  },
  {
    id: "quest-items",
    label: "Quest Items",
    group: "curiosities",
    icon: "key",
    color: "#f2b357",
    mapCategory: "Quest Item",
    expectedMarkers: 21,
    available: true,
    blurb: "Key items carried for a side quest until they are handed over.",
  },
  {
    id: "paint-cages",
    label: "Paint Cages",
    group: "curiosities",
    icon: "lock",
    color: "#b48cf2",
    mapCategory: "Paint Cage",
    expectedMarkers: 20,
    available: true,
    blurb: "Cages that free a paint creature when broken open.",
  },
  {
    id: "underwater-treasure",
    label: "Underwater Treasure",
    group: "curiosities",
    icon: "water",
    color: "#6fc2e8",
    mapCategory: "Underwater Treasure",
    expectedMarkers: 12,
    available: true,
    blurb: "Chests reachable only by diving in the later areas.",
  },
  {
    id: "lost-gestrals",
    label: "Lost Gestrals",
    group: "curiosities",
    icon: "emoji_nature",
    color: "#9fd3a0",
    mapCategory: "Lost Gestral",
    expectedMarkers: 9,
    available: true,
    blurb: "Gestrals to find and send home for a reward.",
  },
];

/** The layer `/collections` itself renders. */
export const DEFAULT_COLLECTION_LAYER_ID = "pictos";

export const COLLECTION_LAYER_IDS = COLLECTION_LAYERS.map((layer) => layer.id);

export function getCollectionLayer(
  id: string | null | undefined,
): CollectionLayer | undefined {
  return COLLECTION_LAYERS.find((layer) => layer.id === id);
}

/** Same, but never undefined - unknown ids fall back to the default layer. */
export function resolveCollectionLayer(
  id: string | null | undefined,
): CollectionLayer {
  return getCollectionLayer(id) ?? COLLECTION_LAYERS[0];
}

/** True for the default layer's own route and its canonical /collections/<id>. */
export function isCollectionLayerActive(
  pathname: string | null,
  id: string,
): boolean {
  if (!pathname) return false;
  if (id === DEFAULT_COLLECTION_LAYER_ID && pathname === "/collections")
    return true;
  return pathname === `/collections/${id}`;
}

export function collectionLayersInGroup(
  group: CollectionLayerGroupId,
): CollectionLayer[] {
  return COLLECTION_LAYERS.filter((layer) => layer.group === group);
}

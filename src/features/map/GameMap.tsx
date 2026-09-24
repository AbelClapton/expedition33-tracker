"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { ArrowLeft, Layers, Minus, Plus, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { PICTO_PIN_ICON } from "@/engine/utils/pictoIcon";
import { useFoundPictos, setPictosFound } from "@/hooks/useFoundPictos";
import { useTracking, trackedKeyFor } from "@/hooks/useTracking";
import {
  COLLECTION_LAYER_GROUPS,
  COLLECTION_LAYERS,
  DEFAULT_COLLECTION_LAYER_ID,
  type CollectionLayerGroupId,
} from "@/features/collection/collectionLayers";
import { useFoundEntrySets } from "@/features/collection/hooks/useFoundEntrySets";
import { setFoundEntry } from "@/features/collection/hooks/useFoundEntries";
import { assetPath } from "@/lib/assetPath";
import locationPins from "./data/locationPins.json";
import { LAYER_PINS } from "./data/pins.generated";
import { locationEntities, type LocationEntity } from "./locationEntities";
import { pictoCardDetails } from "./pictoDetails";
import {
  isPictoPinFound,
  enginePictosFor,
  pictoPinTrackedKeys,
} from "./pictoStatus";
import { ENTRY_MEDIA } from "@/features/collection/data/media.generated";
import type { CardDetails, MapPin as Pin } from "./types";

// Fix Leaflet default icon
delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// --------------------------------------------
// Standard slippy map utilities
// --------------------------------------------
function getTileCoords(
  lat: number,
  lng: number,
  zoom: number,
): { x: number; y: number } {
  const n = Math.pow(2, zoom);
  const x = Math.floor(((lng + 180) / 360) * n);
  const latRad = (lat * Math.PI) / 180;
  const y = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n,
  );
  return { x, y };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// --------------------------------------------
// Artwork extent
// --------------------------------------------
// The tiles draw the source artwork (8192x9709) scaled so its height fills the
// world; the width comes along by the same factor.
const ART_ASPECT = 8192 / 9709;
const MERCATOR_LAT_LIMIT = 85.0511287798;
const TILE_SIZE = 256;
const MIN_TILE_ZOOM = 2;
const MAX_TILE_ZOOM = 7;

/** Zoom the atlas opens at when it is asked to show one entry rather than the world. */
const FOCUS_ZOOM = 6;

/**
 * The entry a Library row asked for, from `?pin=<layerId>:<entryId>`.
 *
 * Read straight off `location` rather than through `useSearchParams`: this component
 * is client-only (the map page imports it with `ssr: false`), so the value is known
 * before the first paint - no search-params Suspense boundary, and the map opens
 * narrowed instead of flashing every pin first.
 */
interface FocusTarget {
  layerId: string;
  pinId: string;
}

function readFocusTarget(): FocusTarget | null {
  if (typeof window === "undefined") return null;

  const value = new URLSearchParams(window.location.search).get("pin");
  if (!value) return null;

  const [layerId, ...rest] = value.split(":");
  const pinId = rest.join(":");

  return layerId && pinId ? { layerId, pinId } : null;
}

function artworkBounds(): L.LatLngBounds {
  return L.latLngBounds(
    L.latLng(-MERCATOR_LAT_LIMIT, -180),
    L.latLng(MERCATOR_LAT_LIMIT, -180 + 360 * ART_ASPECT),
  );
}

/** Lowest zoom whose artwork still covers the viewport, so no blank space can show. */
function fillZoom(map: L.Map): number {
  const { x, y } = map.getSize();
  const worldPx = Math.max(y, x / ART_ASPECT);
  const zoom = Math.ceil(Math.log2(worldPx / TILE_SIZE));
  return Math.min(MAX_TILE_ZOOM, Math.max(MIN_TILE_ZOOM, zoom));
}

/** Nudge a centre so the whole viewport stays inside the artwork at this zoom. */
function fitCenter(map: L.Map, center: L.LatLng, zoom: number): L.LatLng {
  const size = map.getSize();
  const world = TILE_SIZE * 2 ** zoom;
  const art = { x: world * ART_ASPECT, y: world };
  const half = { x: size.x / 2, y: size.y / 2 };
  const projected = map.project(center, zoom);
  const axis = (value: number, halfSize: number, artSize: number) =>
    Math.min(Math.max(value, halfSize), Math.max(halfSize, artSize - halfSize));

  return map.unproject(
    L.point(axis(projected.x, half.x, art.x), axis(projected.y, half.y, art.y)),
    zoom,
  );
}

const PIN_ICON_SIZE = 34;

const pinImage = (src: string) =>
  `<img src="${src}" alt="" draggable="false" />`;

// Dev serves tiles through the /api/tile cache route; the static Pages build has no server,
// so it points straight at the wiki pyramid (same artwork, `.jpg` template). See next.config.ts.
const TILE_TEMPLATE =
  process.env.NEXT_PUBLIC_TILE_URL ?? "/api/tile/{z}/{x}/{y}";

/** Same template, one concrete tile - used when a tile is opened on its own. */
const tileUrl = (zoom: number, x: number, y: number) =>
  TILE_TEMPLATE.replace("{z}", `${zoom}`)
    .replace("{x}", `${x}`)
    .replace("{y}", `${y}`);

// Fallback for a pin whose wiki entry carries no icon art
const LOCATION_FALLBACK_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="7.5" /><circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none" /></svg>`;

/** Layer pin: the layer's own glyph in its own colour, no third-party art. */
const pinGlyph = (glyph: string, color: string, size: number) =>
  `<span class="material-symbols-outlined pin-glyph" style="color:${color};font-size:${Math.round(size * 1.2)}px">${glyph}</span>`;

// Layer registry: each entry becomes a row in the layer panel and its own layer group
const NO_ENTITIES: LocationEntity[] = [];

interface MapLayer {
  id: string;
  label: string;
  /** Panel section, so 16 layers stay readable. */
  group: string;
  pins: Pin[];
  markerClass: string;
  size: number;
  /** `size` is the on-screen icon box, so a glyph pin scales like an image pin does. */
  iconFor: (pin: Pin, size: number) => string;
  entitiesFor: (pin: Pin) => LocationEntity[];
  /** Extra card content for this pin, when the tracker knows the entry behind it. */
  detailsFor?: (pin: Pin) => CardDetails | null;
  /**
   * How the found filter matches this layer's pins:
   * - `picto` - by name, against the engine picto ids the Library marks
   * - `entry` - by the pin's own id, against `collection-found-<layerId>`
   * - `none`  - the collection cannot mark it (locations)
   */
  foundKind: FoundKind;
  /**
   * Whether a pin's card should list what sits inside it. Only the location
   * layer does, so other cards do not end a rich entry with an empty list.
   */
  listsEntities?: boolean;
  /**
   * The Track keys this pin answers to, when the layer's ids are not the ones
   * the Library stores (the wiki picto pins borrow the engine picto ids behind
   * their name). Defaults to `<layerId>:<pinId>`.
   */
  trackedKeys?: (pin: Pin) => string[];
}

/** The Track keys a pin can answer to. Empty when there is nothing to point at. */
function pinTrackedKeys(layer: MapLayer, pin: Pin): string[] {
  return layer.trackedKeys?.(pin) ?? [trackedKeyFor(layer.id, pin.id)];
}

type FoundKind = "picto" | "entry" | "none";

const GROUP_LABELS = Object.fromEntries(
  COLLECTION_LAYER_GROUPS.map((group) => [group.id, group.label]),
) as Record<CollectionLayerGroupId, string>;

/**
 * The fetched art and prose for a Library entry, as card content.
 *
 * Keyed by `<layerId>:<entryId>`, which is also the pin's id for these layers,
 * so a pin gets its own art, stats and "how to get it" without extra plumbing.
 */
function entryDetailsFor(layerId: string) {
  return (pin: Pin): CardDetails | null => {
    const media = ENTRY_MEDIA[`${layerId}:${pin.id}`];
    if (!media) return null;

    return {
      ...(media.image ? { image: assetPath(media.image) } : {}),
      meta: media.meta,
      stats: media.stats,
      sections: media.sections,
    };
  };
}

/** The world layer, plus pictos, which is the one Library layer with its own pins. */
const GUIDE_LAYERS: MapLayer[] = [
  {
    id: "locations",
    label: "Locations",
    group: "World",
    pins: locationPins as Pin[],
    markerClass: "location-pin",
    // a touch larger than the collectable glyphs, and each shows its own wiki art
    size: PIN_ICON_SIZE + 4,
    iconFor: (pin: Pin) =>
      pinImage(assetPath(pin.icon ?? "")) || LOCATION_FALLBACK_ICON,
    // the collectables that sit inside the location
    entitiesFor: (pin: Pin) => locationEntities(pin.name),
    listsEntities: true,
    foundKind: "none",
  },
  {
    id: "pictos",
    label: "Pictos",
    group: GROUP_LABELS.lumina,
    // one pin per pickup the Library lists: the wiki's exact pins where it has them,
    // the reference map's markers near their area for the rest
    pins: (LAYER_PINS.pictos ?? []) as Pin[],
    markerClass: "picto-pin",
    size: PIN_ICON_SIZE,
    // one shared icon for every picto
    iconFor: () => pinImage(PICTO_PIN_ICON),
    entitiesFor: () => NO_ENTITIES,
    // the picto's own art, stats and lumina effect, straight from the engine
    detailsFor: pictoCardDetails,
    // pictos are the one layer the Library marks by name, so they match that way
    foundKind: "picto",
    // the wiki pin borrows the ids of the engine pictos behind its name
    trackedKeys: (pin: Pin) =>
      pictoPinTrackedKeys(pin.name, DEFAULT_COLLECTION_LAYER_ID),
  },
];

/**
 * One atlas layer per Library layer that has pins and is not already a guide layer.
 * The reference canvas draws everything inside an area as a separate inset at its own
 * scale, so those markers cannot be placed here yet - the Library still lists them.
 */
const GUIDE_LAYER_IDS = new Set(GUIDE_LAYERS.map((layer) => layer.id));

const COLLECTABLE_LAYERS: MapLayer[] = COLLECTION_LAYERS.filter(
  (layer) =>
    !GUIDE_LAYER_IDS.has(layer.id) && (LAYER_PINS[layer.id]?.length ?? 0) > 0,
).map((layer) => ({
  id: layer.id,
  label: layer.label,
  group: GROUP_LABELS[layer.group],
  pins: LAYER_PINS[layer.id],
  // a layer whose mark we hold as art draws it; the rest borrow a Material glyph
  markerClass: layer.iconImage ? "art-pin" : "glyph-pin",
  size: PIN_ICON_SIZE,
  iconFor: (_pin: Pin, size: number) =>
    layer.iconImage
      ? pinImage(layer.iconImage)
      : pinGlyph(layer.icon, layer.color, size),
  entitiesFor: () => NO_ENTITIES,
  // their own art, stats and where-to-find prose, where the fetch found any
  detailsFor: entryDetailsFor(layer.id),
  // their pins carry the Library entry's own id, so found state matches directly
  foundKind: "entry",
}));

const MAP_LAYERS: MapLayer[] = [...GUIDE_LAYERS, ...COLLECTABLE_LAYERS];

/** Layers whose progress the found / not-found control can speak about. */
const FOUND_LAYER_IDS = MAP_LAYERS.filter(
  (layer) => layer.foundKind !== "none",
).map((layer) => layer.id);

interface FoundSources {
  /** Engine picto ids, for the layer that matches by name. */
  pictos: Set<string>;
  /** `collection-found-<layerId>` sets, keyed by layer id. */
  byLayer: Record<string, Set<string>>;
}

const FOUND_FILTERS = [
  { id: "all", label: "All", width: "flex-1" },
  { id: "tracked", label: "Tracked", width: "flex-1" },
  { id: "found", label: "Found", width: "flex-1" },
  // the long label gets more of the row so it stays on one line
  { id: "missing", label: "Not found", width: "flex-[1.5]" },
] as const;

type FoundFilter = (typeof FOUND_FILTERS)[number]["id"];

// iconFor always returns a usable markup string
function pinIconMarkup(layer: MapLayer, pin: Pin, size = layer.size): string {
  const markup = layer.iconFor(pin, size);
  return markup.includes('src=""') ? LOCATION_FALLBACK_ICON : markup;
}

function pinMatches(pin: Pin, query: string, inherited = ""): boolean {
  if (!query) return true;
  return `${pin.name} ${pin.note ?? ""} ${inherited}`
    .toLowerCase()
    .includes(query);
}

/** Names of the entities a pin holds, so a search for one keeps its location visible. */
function entitySearchText(layer: MapLayer, pin: Pin): string {
  return layer
    .entitiesFor(pin)
    .map((entity) => entity.name)
    .join(" ")
    .toLowerCase();
}

/** Area entries are drawn near their area, so they can be hidden wholesale. */
function pinVisible(pin: Pin, showAreaPins: boolean): boolean {
  return showAreaPins || !pin.approx;
}

/**
 * Whether a pin is the one the URL asked for.
 *
 * Pictos are the exception: the atlas' picto pins carry the wiki's and the reference
 * map's own ids while the Library keys its cards by engine picto id, so a picto pin
 * also answers to the engine ids behind its name - the same bridge found state and
 * Track use. A name can hold several engine entries (one per pickup), so asking for
 * one pickup legitimately lights up every pin that shares the picto's name.
 */
function pinIsRequested(layer: MapLayer, pin: Pin, focus: FocusTarget): boolean {
  if (layer.id !== focus.layerId) return false;
  if (String(pin.id) === focus.pinId) return true;

  return (
    layer.foundKind === "picto" &&
    enginePictosFor(pin.name).some((picto) => picto.id === focus.pinId)
  );
}

/** Whether the collection records this pin - the one rule the filter is built on. */
function pinIsFound(layer: MapLayer, pin: Pin, found: FoundSources): boolean {
  if (layer.foundKind === "none") return false;

  return layer.foundKind === "picto"
    ? isPictoPinFound(pin.name, found.pictos)
    : (found.byLayer[layer.id]?.has(pin.id) ?? false);
}

/** The found / not found / Track filter applies to every layer the collection can mark. */
function statusMatches(
  layer: MapLayer,
  pin: Pin,
  filter: FoundFilter,
  found: FoundSources,
  tracked: ReadonlySet<string>,
): boolean {
  if (layer.foundKind === "none" || filter === "all") return true;
  if (filter === "tracked") {
    return pinTrackedKeys(layer, pin).some((key) => tracked.has(key));
  }

  const isFound = pinIsFound(layer, pin, found);
  return filter === "found" ? isFound : !isFound;
}

/**
 * Stable stand-in for the tracked set while Track is not the active filter.
 * Switching it in keeps a Track toggle from rebuilding every layer group - which
 * would tear down the markers, and the card the player is reading with them.
 */
const NO_TRACK_FILTER: ReadonlySet<string> = new Set();

/**
 * Same stand-in for the found sets, for the same reason: a card's Found checkbox
 * only has to refresh that card, while switching the real sets into the visibility
 * effect rebuilds every layer group and closes the popup being read.
 */
const NO_FOUND_FILTER: FoundSources = { pictos: new Set(), byLayer: {} };

// Markers are icons, not teardrop pins, so the icon centre marks the coordinate
function pinIcon(layer: MapLayer, pin: Pin): L.DivIcon {
  // one size at every zoom: the art scales underneath, the marks do not
  const size = layer.size;

  return L.divIcon({
    className: pin.approx
      ? `${layer.markerClass} pin-approx`
      : layer.markerClass,
    html: pinIconMarkup(layer, pin, size),
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
    tooltipAnchor: [0, -size / 2],
  });
}

function pinCardHtml(
  layer: MapLayer,
  pin: Pin,
  icon: string,
  options: {
    query?: string;
    entities?: boolean;
    tracked?: boolean;
    /** Which entry the toggle writes, when the layer bridges pin ids. */
    trackedKey?: string;
    /** Whether the collection already holds this pin. */
    found?: boolean;
    /**
     * The hover card: name, mark, facts and one line of prose, with a pointer to
     * the full card. The click popup is the one that carries everything.
     */
    summary?: boolean;
  } = {},
): string {
  // whatever the tracker knows about the entry behind this pin
  const details = layer.detailsFor?.(pin) ?? null;
  // the entry's own art when we have it, the layer glyph otherwise
  const hero = details?.image
    ? `<img class="picto-card__hero" src="${details.image}" alt="" draggable="false" />`
    : `<span class="picto-card__icon">${icon}</span>`;
  const chips = (details?.meta ?? [])
    .map((chip) => `<span class="picto-card__chip">${escapeHtml(chip)}</span>`)
    .join("");
  // the pin's own level only stands in when the details do not already say it
  const level =
    pin.level && !details?.meta?.some((chip) => chip.startsWith("Lv"))
      ? `<span class="picto-card__chip">Lv ${pin.level}</span>`
      : "";
  const stats = details?.stats?.length
    ? `<dl class="picto-card__stats">${details.stats
        .map(
          (stat) =>
            `<div><dt>${escapeHtml(stat.label)}</dt><dd>${escapeHtml(stat.value)}</dd></div>`,
        )
        .join("")}</dl>`
    : "";
  const sections = (details?.sections ?? [])
    .map(
      (section) => `
          <div class="picto-card__section">
            <p class="picto-card__section-title">${escapeHtml(section.title)}</p>
            <p class="picto-card__section-body">${escapeHtml(section.body)}</p>
          </div>`,
    )
    .join("");
  // The reference map's note and the entry's own "where to find it" prose say the same
  // thing, so the note only stands in where the tracker has no prose of its own.
  const note =
    pin.note &&
    !details?.sections?.some((section) => section.title === "Where to find it")
      ? `<p class="picto-card__note">${escapeHtml(pin.note)}</p>`
      : "";
  // say so in the card too, not just in the pin's weight
  const approx = pin.approx
    ? `<p class="picto-card__approx">Approximate · ${escapeHtml(pin.area ?? "area")}</p>`
    : "";
  // The one line a summary spends: what the entry does, or where it was found. The
  // sections are already picked so the first is the headline fact (a picto's lumina
  // effect, an entry's "where to find it"), and the pin's own note stands in for the
  // layers the tracker has no prose for.
  const glance = details?.sections?.[0]?.body || pin.note || "";

  if (options.summary) {
    return `
        <div class="picto-card picto-card--summary">
          <div class="picto-card__head">
            ${hero}
            <div>
              <p class="picto-card__name">${escapeHtml(pin.name)}</p>
              ${chips || level ? `<p class="picto-card__chips">${chips}${level}</p>` : ""}
            </div>
          </div>
          ${glance ? `<p class="picto-card__glance">${escapeHtml(glance)}</p>` : ""}
          ${approx}
          <p class="picto-card__hint">Click the pin for the full entry</p>
        </div>`;
  }

  // Only the click popup carries the entity list; the hover card stays a glance
  const section =
    options.entities && layer.listsEntities
      ? entitySectionHtml(
          pin,
          layer.entitiesFor(pin),
          (options.query ?? "").trim().toLowerCase(),
        )
      : "";

  // Found and Track share a row so they read as one set of controls; a layer with
  // nothing to mark (locations) gets neither
  const actions = `${foundControlHtml(layer, pin, options.found === true)}${trackButtonHtml(
    layer,
    pin,
    options.tracked === true,
    options.trackedKey,
    options.found === true,
  )}`;

  return `
        <div class="picto-card">
          <div class="picto-card__head">
            ${hero}
            <div>
              <p class="picto-card__name">${escapeHtml(pin.name)}</p>
              ${chips || level ? `<p class="picto-card__chips">${chips}${level}</p>` : ""}
            </div>
          </div>
          ${stats}
          ${sections}
          ${note}
          ${approx}
          ${actions ? `<div class="picto-card__actions">${actions}</div>` : ""}
          ${section}
        </div>`;
}

/**
 * The entries a pin's Found control writes: the engine pictos behind its name for
 * the layer that matches by name, the pin's own id for the layers whose pin ids
 * *are* the Library's entry ids.
 */
function foundIdsFor(layer: MapLayer, pin: Pin): string[] {
  if (layer.foundKind === "picto") {
    return enginePictosFor(pin.name).map((picto) => picto.id);
  }

  if (layer.foundKind === "entry") return [String(pin.id)];

  return [];
}

/** Write a pin's found state to the same storage the Library's rows read. */
function setPinFound(layer: MapLayer, pin: Pin, found: boolean) {
  const ids = foundIdsFor(layer, pin);
  if (ids.length === 0) return;

  if (layer.foundKind === "picto") setPictosFound(ids, found);
  else setFoundEntry(layer.id, ids[0], found);
}

/**
 * The card's Found control - the Library's diamond checkbox as markup, because a
 * card is an HTML string and the React primitive cannot be mounted inside it. The
 * map's delegated click handler keys off `data-found`.
 */
function foundControlHtml(layer: MapLayer, pin: Pin, found: boolean): string {
  if (foundIdsFor(layer, pin).length === 0) return "";

  const action = `${found ? "Unmark" : "Mark"} ${pin.name} as found`;

  return `<button type="button" class="picto-checkbox" role="checkbox" aria-checked="${found}" data-found="${escapeHtml(`${layer.id}:${pin.id}`)}" aria-label="${escapeHtml(action)}" title="${escapeHtml(action)}"><span class="picto-checkbox__box"></span><span class="picto-checkbox__label" aria-hidden="true">Found</span></button>`;
}

/** The per-card toggle, matched by the map's delegated click handler. */
function trackButtonHtml(
  layer: MapLayer,
  pin: Pin,
  tracked: boolean,
  trackedKey?: string,
  found = false,
): string {
  // no Library entry behind this pin means there is nothing to track
  if (layer.foundKind === "none") return "";

  const key = trackedKey ?? pinTrackedKeys(layer, pin)[0];
  if (!key) return "";

  // a collected entry is not something you are still out to get: the control is
  // off, and `toggleTrackedKey` refuses the write anyway
  if (found) {
    return `<button type="button" class="picto-card__track" disabled title="Already collected">Track</button>`;
  }

  return `<button type="button" class="picto-card__track" data-tracked="${escapeHtml(key)}" aria-pressed="${tracked}">${tracked ? "Tracked" : "Track"}</button>`;
}

/** One collectable row; the wiki's "where to find it" text rides along as a tooltip. */
function entityRowHtml(entity: LocationEntity, matched: boolean): string {
  return `<li class="picto-list__item" data-match="${matched ? "1" : "0"}" title="${escapeHtml(entity.found)}"><img src="${entity.icon}" alt="" draggable="false" /><span class="picto-list__name">${escapeHtml(entity.name)}</span><span class="picto-list__level">Lv&nbsp;${entity.level}</span></li>`;
}

/**
 * The collectables held by a location. Rows that miss the search stay in the DOM
 * and are hidden by CSS, so "show all" is a class swap rather than a rebuild.
 */
function entitySectionHtml(
  pin: Pin,
  entities: LocationEntity[],
  query: string,
): string {
  const title = (count: string) =>
    `<p class="picto-card__entities-title"><span>Collectables · Pictos</span><span class="picto-card__entities-count">${count}</span></p>`;

  if (!entities.length) {
    return `
          <div class="picto-card__entities">
            ${title("0")}
            <p class="picto-card__empty">No pictos recorded here.</p>
          </div>`;
  }

  // The location's own name matched, so everything inside it is on topic
  const wholeLocationMatches =
    Boolean(query) &&
    `${pin.name} ${pin.note ?? ""}`.toLowerCase().includes(query);
  const rows = entities.map((entity) => ({
    entity,
    matched:
      !query ||
      wholeLocationMatches ||
      entity.name.toLowerCase().includes(query),
  }));
  const hidden = rows.filter((row) => !row.matched).length;
  const footer = hidden
    ? `
            <p class="picto-card__footer">
              <span>${hidden} hidden by the search</span>
              <button type="button" class="picto-card__reveal" data-show-all>Show all</button>
            </p>
            <p class="picto-card__footer picto-card__footer--revealed">
              <span>Showing all ${entities.length}</span>
              <button type="button" class="picto-card__reveal" data-show-all>Matches only</button>
            </p>`
    : "";

  return `
          <div class="picto-card__entities">
            ${title(hidden ? `${entities.length - hidden}/${entities.length}` : `${entities.length}`)}
            <ul class="picto-list">${rows
              .map((row) => entityRowHtml(row.entity, row.matched))
              .join("")}</ul>
            ${footer}
          </div>`;
}

// Diamond plates stay fully opaque in every state - the map must never show through them
const ZOOM_BUTTON_CLASS =
  "flex h-9 w-9 rotate-45 items-center justify-center border border-[#5e5331] bg-[#1e2023] text-[#e2e2e6] shadow-[0_10px_26px_rgba(0,0,0,0.55)] transition-colors duration-200 hover:border-[#f2ca50] hover:bg-[#3a3526] hover:text-[#f2ca50] focus-visible:border-[#f2ca50] focus-visible:bg-[#3a3526] focus-visible:text-[#f2ca50] focus-visible:outline-none active:border-[#f2ca50] active:bg-[#4a432c] active:text-[#f2ca50] disabled:cursor-not-allowed disabled:border-[#333538] disabled:bg-[#191b1f] disabled:text-[#6b6559] disabled:shadow-none";

// --------------------------------------------
// Main Map Component
// --------------------------------------------
export default function GameMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerRefs = useRef<Record<string, L.LayerGroup>>({});
  const markerRefs = useRef<Record<string, { marker: L.Marker; pin: Pin }[]>>(
    {},
  );
  /**
   * The single entry the Library linked to, if any.
   *
   * Everything on the map answers to it: only that pin is drawn, and the panel says
   * so with a way back out. Read once, so the URL stays the source of truth for the
   * opening view and the user's own layer switches are not fought over afterwards.
   */
  const [focus, setFocus] = useState<FocusTarget | null>(readFocusTarget);
  const focused = focus !== null;
  // every layer starts visible; the panel's Show all / Hide all switch them in bulk
  const [hiddenLayers, setHiddenLayers] = useState<Record<string, boolean>>({});
  // one query for the whole panel, shared by every layer
  const [searchQuery, setSearchQuery] = useState("");
  // found / not found, from the same localStorage the collection writes
  const [foundFilter, setFoundFilter] = useState<FoundFilter>("all");
  const { foundSet } = useFoundPictos();
  const entryFoundSets = useFoundEntrySets(FOUND_LAYER_IDS);
  const tracking = useTracking();
  const trackedSet = tracking.trackedSet;
  const toggleTracked = tracking.toggleTracked;
  // the Track filter only changes what is visible while it is the active one
  const trackFilter = foundFilter === "tracked" ? trackedSet : NO_TRACK_FILTER;
  // the found sets a pin's card and the filter both read
  const found: FoundSources = useMemo(
    () => ({ pictos: foundSet, byLayer: entryFoundSets }),
    [foundSet, entryFoundSets],
  );
  // and the filter only gets them while it is actually asking about found state
  const foundFilterSources =
    foundFilter === "found" || foundFilter === "missing"
      ? found
      : NO_FOUND_FILTER;
  /**
   * Cards bake the Track *and* Found state in, so a change has to refresh them.
   * Only the entry that changed is refreshed; the set is left empty when the
   * change came from somewhere else (another tab), which falls back to a full
   * refresh.
   */
  const cardSyncRef = useRef({ dirty: new Set<string>(), mounted: false });
  // read at build time, so the builders themselves can stay stable
  const trackedSetRef = useRef(trackedSet);
  const foundRef = useRef(found);

  useEffect(() => {
    trackedSetRef.current = trackedSet;
    foundRef.current = found;
  }, [trackedSet, found]);

  /** Card markup is a string, so both toggle states have to be baked in when it is built. */
  const buildCard = useCallback(
    (
      layer: MapLayer,
      pin: Pin,
      options: { query?: string; entities?: boolean },
    ) => {
      // a pin is tracked when any of its keys is, and the toggle writes that one
      const keys = pinTrackedKeys(layer, pin);
      const activeKey =
        keys.find((key) => trackedSetRef.current.has(key)) ?? keys[0];

      return pinCardHtml(layer, pin, pinIconMarkup(layer, pin), {
        ...options,
        // `entities` marks the click popup everywhere, and the popup is the full card
        summary: options.entities !== true,
        trackedKey: activeKey,
        tracked: activeKey ? trackedSetRef.current.has(activeKey) : false,
        found: pinIsFound(layer, pin, foundRef.current),
      });
    },
    [],
  );
  // the sidebar opens by default where there is room for it
  const [layersOpen, setLayersOpen] = useState(
    () => typeof window === "undefined" || window.innerWidth >= 768,
  );
  // entries that live inside an area are drawn near it: keep them unless asked otherwise
  const [showAreaPins, setShowAreaPins] = useState(true);
  const [currentZoom, setCurrentZoom] = useState(3);
  // the floor moves with the viewport, so the custom control needs it as state
  const [zoomFloor, setZoomFloor] = useState(MIN_TILE_ZOOM);

  /**
   * Whether a pin survives the single-entry view.
   *
   * A Library row's map link asks for one entry, and the point of it is that the map
   * shows *only* that one - so this is applied to every layer, including the ones the
   * found filter does not speak about.
   */
  const pinFocused = useCallback(
    (layer: MapLayer, pin: Pin) =>
      !focus || pinIsRequested(layer, pin, focus),
    [focus],
  );

  const matchedByLayer = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return Object.fromEntries(
      MAP_LAYERS.map((layer) => [
        layer.id,
        layer.pins.filter(
          (pin) =>
            pinFocused(layer, pin) &&
            // the Area entries switch does not get to hide the entry that was asked for
            (focused || pinVisible(pin, showAreaPins)) &&
            pinMatches(pin, query, entitySearchText(layer, pin)) &&
            statusMatches(layer, pin, foundFilter, found, trackedSet),
        ).length,
      ]),
    ) as Record<string, number>;
  }, [
    searchQuery,
    foundFilter,
    found,
    showAreaPins,
    trackedSet,
    pinFocused,
    focused,
  ]);

  // Progress across every layer the filter speaks about, not just pictos
  const foundCounts = useMemo(() => {
    let foundPins = 0;
    let total = 0;

    for (const layer of MAP_LAYERS) {
      if (layer.foundKind === "none") continue;
      total += layer.pins.length;
      foundPins += layer.pins.filter((pin) =>
        pinIsFound(layer, pin, found),
      ).length;
    }

    return { found: foundPins, total };
  }, [found]);

  const toggleLayer = (id: string) =>
    setHiddenLayers((hidden) => ({ ...hidden, [id]: !hidden[id] }));

  /** The bulk switches, one per button: every layer on, or every layer off. */
  const showAllLayers = () =>
    setHiddenLayers(Object.fromEntries(MAP_LAYERS.map((l) => [l.id, false])));

  const hideAllLayers = () =>
    setHiddenLayers(Object.fromEntries(MAP_LAYERS.map((l) => [l.id, true])));

  // Middle‑click tile opener
  useEffect(() => {
    const container = mapRef.current;
    if (!container) return;
    const onAuxClick = (e: MouseEvent) => {
      if (e.button === 1) {
        e.preventDefault();
        const map = mapInstanceRef.current;
        if (!map) return;
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const latlng = map.containerPointToLatLng(L.point(x, y));
        const zoom = map.getZoom();
        const { x: tileX, y: tileY } = getTileCoords(
          latlng.lat,
          latlng.lng,
          zoom,
        );
        const url = tileUrl(zoom, tileX, tileY);
        window.open(url, "_blank");
      }
    };
    container.addEventListener("auxclick", onAuxClick);
    return () => container.removeEventListener("auxclick", onAuxClick);
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const bounds = artworkBounds();
    const map = L.map(mapRef.current, {
      maxBounds: bounds,
      maxBoundsViscosity: 1.0,
      maxZoom: MAX_TILE_ZOOM,
      // the tracker draws its own diamond control instead
      zoomControl: false,
    });

    // Open on the artwork's north-west corner, already inside bounds and filling the screen.
    // No animation, so this holds even if the tab is not painting yet.
    const openingZoom = fillZoom(map);
    map.setView(
      fitCenter(map, bounds.getNorthWest(), openingZoom),
      openingZoom,
      {
        animate: false,
      },
    );
    map.setMinZoom(openingZoom);
    setZoomFloor(openingZoom);

    L.tileLayer(TILE_TEMPLATE, {
      attribution: "Expedition 33 Wiki",
      minZoom: MIN_TILE_ZOOM,
      maxZoom: MAX_TILE_ZOOM,
      tileSize: TILE_SIZE,
      noWrap: true,
      bounds: bounds,
    }).addTo(map);

    // A bigger window needs a higher floor, and the view has to be pulled back inside.
    // Instant, so resizing never shows the space around the artwork.
    const refill = () => {
      const minZoom = fillZoom(map);
      const zoom = Math.max(minZoom, map.getZoom());
      map.setView(fitCenter(map, map.getCenter(), zoom), zoom, {
        animate: false,
      });
      map.setMinZoom(minZoom);
      setZoomFloor(minZoom);
    };
    map.on("resize", refill);
    map.on("zoomend", () => setCurrentZoom(map.getZoom()));
    setCurrentZoom(map.getZoom());
    // Leaflet only watches window resizes, so also react to the container changing size
    const resizeObserver = new ResizeObserver(() => map.invalidateSize());
    resizeObserver.observe(mapRef.current);

    mapInstanceRef.current = map;

    // Build every layer's markers once; visibility and filtering are applied separately
    for (const layer of MAP_LAYERS) {
      markerRefs.current[layer.id] = layer.pins.map((pin) => {
        const icon = pinIconMarkup(layer, pin);
        const tooltip = pinCardHtml(layer, pin, icon, { summary: true });
        const popup = pinCardHtml(layer, pin, icon, { entities: true });
        const marker = L.marker([pin.lat, pin.lng], {
          icon: pinIcon(layer, pin),
          title: pin.name,
          riseOnHover: true,
        })
          .bindTooltip(tooltip, {
            className: "picto-card-tooltip",
            direction: "top",
            offset: [0, -20],
            opacity: 1,
          })
          .bindPopup(popup, { className: "picto-card-popup", maxWidth: 320 });

        // clicking a pin on desktop replaces the hover card instead of stacking on it
        marker.on("popupopen", () => marker.closeTooltip());
        marker.on("add", () => {
          const element = marker.getElement();
          element?.addEventListener("focus", () => marker.openTooltip());
          element?.addEventListener("blur", () => marker.closeTooltip());
        });

        return { marker, pin };
      });
      layerRefs.current[layer.id] = L.layerGroup();
    }

    return () => {
      resizeObserver.disconnect();
      for (const group of Object.values(layerRefs.current))
        map.removeLayer(group);
      layerRefs.current = {};
      markerRefs.current = {};
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Layer visibility + search filtering
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const query = searchQuery.trim().toLowerCase();

    for (const layer of MAP_LAYERS) {
      const group = layerRefs.current[layer.id];
      if (!group) continue;

      group.clearLayers();

      if (!hiddenLayers[layer.id]) {
        for (const { marker, pin } of markerRefs.current[layer.id] ?? []) {
          // a location survives the search when any entity inside it matches
          const matches =
            pinFocused(layer, pin) &&
            (focused || pinVisible(pin, showAreaPins)) &&
            pinMatches(pin, query, entitySearchText(layer, pin)) &&
            statusMatches(
              layer,
              pin,
              foundFilter,
              foundFilterSources,
              trackFilter,
            );
          if (matches) group.addLayer(marker);
        }
        group.addTo(map);
      } else {
        map.removeLayer(group);
      }
    }

    // Entity lists are baked into the card markup, so refresh the pins that hold them
    for (const layer of MAP_LAYERS) {
      for (const { marker, pin } of markerRefs.current[layer.id] ?? []) {
        if (!layer.entitiesFor(pin).length) continue;
        marker.setTooltipContent(buildCard(layer, pin, { query }));
        marker.setPopupContent(
          buildCard(layer, pin, { entities: true, query }),
        );
      }
    }
  }, [
    hiddenLayers,
    searchQuery,
    foundFilter,
    foundFilterSources,
    showAreaPins,
    trackFilter,
    pinFocused,
    focused,
    buildCard,
  ]);

  // Every card carries the Track toggle, so a change refreshes the card that has one
  useEffect(() => {
    const sync = cardSyncRef.current;
    if (!sync.mounted) {
      sync.mounted = true;
      return;
    }

    const refreshAll = sync.dirty.size === 0;

    for (const layer of MAP_LAYERS) {
      for (const { marker, pin } of markerRefs.current[layer.id] ?? []) {
        if (
          !refreshAll &&
          !pinTrackedKeys(layer, pin).some((key) => sync.dirty.has(key))
        ) {
          continue;
        }
        marker.setTooltipContent(buildCard(layer, pin, {}));
        marker.setPopupContent(buildCard(layer, pin, { entities: true }));
      }
    }

    sync.dirty.clear();
  }, [trackedSet, foundSet, entryFoundSets, buildCard]);

  // "Show all" inside a card swaps a class; Found and Track write to storage.
  //
  // CAPTURE phase on purpose: Leaflet's own container listener closes the popup on
  // any click, and a bubbling listener here runs after it - so the card would vanish
  // the moment a control inside it was used. Stopping the event on the way down
  // keeps the card open, and keeps it out of Leaflet's map-click handling.
  useEffect(() => {
    const container = mapRef.current;
    if (!container) return;

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const trackButton = target?.closest(
        "[data-tracked]",
      ) as HTMLElement | null;

      if (trackButton) {
        event.preventDefault();
        event.stopPropagation();
        const [layerId, ...rest] = String(trackButton.dataset.tracked).split(
          ":",
        );
        const key = String(trackButton.dataset.tracked);
        const next = trackButton.getAttribute("aria-pressed") !== "true";

        // paint the toggle before the state lands, so the card does not flash
        trackButton.setAttribute("aria-pressed", String(next));
        trackButton.textContent = next ? "Tracked" : "Track";
        cardSyncRef.current.dirty.add(key);

        toggleTracked(layerId, rest.join(":"));
        return;
      }

      // The card's Found checkbox: the same "paint, then write" order as Track, and
      // the pin's Track keys double as the keys that refresh its card.
      const foundControl = target?.closest(
        "[data-found]",
      ) as HTMLElement | null;

      if (foundControl) {
        event.preventDefault();
        event.stopPropagation();

        const [layerId, ...rest] = String(foundControl.dataset.found).split(
          ":",
        );
        const layer = MAP_LAYERS.find((item) => item.id === layerId);
        const pin = layer?.pins.find(
          (item) => String(item.id) === rest.join(":"),
        );

        if (!layer || !pin) return;

        const next = foundControl.getAttribute("aria-checked") !== "true";
        const label = `${next ? "Unmark" : "Mark"} ${pin.name} as found`;

        // paint the box before the state lands, so the card does not flash
        foundControl.setAttribute("aria-checked", String(next));
        foundControl.setAttribute("aria-label", label);
        foundControl.setAttribute("title", label);

        for (const key of pinTrackedKeys(layer, pin)) {
          cardSyncRef.current.dirty.add(key);
        }

        setPinFound(layer, pin, next);
        return;
      }

      const button = target?.closest("[data-show-all]");
      const card = button?.closest(".picto-card");
      if (!button || !card) return;
      event.preventDefault();
      event.stopPropagation();
      card.classList.toggle("picto-card--revealed");
    };

    container.addEventListener("click", onClick, true);
    return () => container.removeEventListener("click", onClick, true);
  }, [toggleTracked]);

  const stepZoom = (delta: number) => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.setZoom(map.getZoom() + delta);
  };

  /** The pin the URL asked for, once the registry is in hand. */
  const focusedPin = useMemo(() => {
    if (!focus) return null;

    const layer = MAP_LAYERS.find((item) => item.id === focus.layerId);

    return layer?.pins.find((pin) => pinIsRequested(layer, pin, focus)) ?? null;
  }, [focus]);

  // The focused entry: centre on it and open its card, now that the markers exist
  useEffect(() => {
    if (!focus || !focusedPin) return;

    const map = mapInstanceRef.current;
    const match = (markerRefs.current[focus.layerId] ?? []).find(
      ({ pin }) => pin === focusedPin,
    );
    if (!map || !match) return;

    map.setView(
      [match.pin.lat, match.pin.lng],
      Math.min(MAX_TILE_ZOOM, Math.max(zoomFloor, FOCUS_ZOOM)),
      { animate: false },
    );
    match.marker.openPopup();
  }, [focus, focusedPin, zoomFloor]);

  /** Leave the single-entry view. The param goes too, so a reload is the whole atlas. */
  const clearFocus = () => {
    setFocus(null);
    window.history.replaceState({}, "", window.location.pathname);
  };

  /** What the focused pin is called, for the panel's notice. */
  const focusedName = focusedPin?.name ?? null;

  const atZoomFloor = currentZoom <= zoomFloor;
  const atZoomCeiling = currentZoom >= MAX_TILE_ZOOM;

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />

      {/* Left rail: back to the shell on top, then the layer sidebar */}
      <aside className="absolute left-6 top-6 z-[1000] flex w-[286px] flex-col gap-3">
        <div className="flex items-center gap-2">
          <Link
            href="/collections"
            aria-label="Back to the Library"
            title="Back to the Library"
            className="flex h-9 flex-1 items-center gap-2 border border-[#5e5331] bg-[#1e2023] px-3 text-[#e2e2e6] shadow-[0_10px_26px_rgba(0,0,0,0.55)] transition-colors duration-200 hover:border-[#f2ca50] hover:bg-[#3a3526] hover:text-[#f2ca50] focus-visible:border-[#f2ca50] focus-visible:bg-[#3a3526] focus-visible:text-[#f2ca50] focus-visible:outline-none"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
            <span className="font-meta text-[10px] uppercase tracking-[0.2em]">
              Library
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setLayersOpen((open) => !open)}
            aria-expanded={layersOpen}
            aria-label="Toggle layers"
            title="Layers"
            className="flex h-9 w-9 items-center justify-center border border-[#5e5331] bg-[#1e2023] text-[#e2e2e6] shadow-[0_10px_26px_rgba(0,0,0,0.55)] transition-colors duration-200 hover:border-[#f2ca50] hover:bg-[#3a3526] hover:text-[#f2ca50] focus-visible:border-[#f2ca50] focus-visible:text-[#f2ca50] focus-visible:outline-none"
          >
            <Layers className="h-4 w-4" />
          </button>
        </div>

        {focus ? (
          <div className="flex items-center gap-2 rounded-lg border border-[#f2ca50]/40 bg-[#1e2023]/95 px-3 py-2 shadow-xl backdrop-blur-sm">
            <span className="material-symbols-outlined text-[18px] text-[#f2ca50]">
              location_on
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-meta text-[9px] uppercase tracking-[0.16em] text-[#99907c]">
                Showing one entry
              </span>
              <span className="block truncate font-sans text-xs text-[#e2e2e6]">
                {focusedName ?? focus.pinId}
              </span>
            </span>
            <button
              type="button"
              onClick={clearFocus}
              className="shrink-0 border border-[#5e5331] px-2 py-1 font-meta text-[9px] uppercase tracking-[0.16em] text-[#e2e2e6] transition-colors hover:border-[#f2ca50] hover:text-[#f2ca50] focus-visible:border-[#f2ca50] focus-visible:text-[#f2ca50] focus-visible:outline-none"
            >
              Show the map
            </button>
          </div>
        ) : null}

        {layersOpen && (
          <div className="flex max-h-[calc(100vh-3rem)] min-h-0 flex-col overflow-hidden rounded-lg border border-[#f2ca50]/30 bg-[#1e2023]/95 shadow-xl backdrop-blur-sm">
            <div className="min-h-0 space-y-3 overflow-y-auto p-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#99907c]" />
                <Input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search the atlas"
                  aria-label="Search the atlas"
                  className="pl-6 text-xs"
                />
                {searchQuery.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-[#99907c] transition-colors hover:text-[#e2e2e6]"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <div className="space-y-1.5 border-t border-[#333538] pt-3">
                <div className="flex items-center justify-between">
                  <span className="font-meta text-[9px] uppercase tracking-[0.14em] text-[#99907c]">
                    Found
                  </span>
                  <span className="font-mono text-[10px] text-[#d0c5af]">
                    {foundCounts.found}/{foundCounts.total}
                  </span>
                </div>
                <div
                  className="chamfer chamfer-track flex [--chamfer-h:1.5rem] p-0.5"
                  role="group"
                  aria-label="Filter collectables by whether they are found"
                >
                  {FOUND_FILTERS.map((option) => {
                    const active = foundFilter === option.id;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setFoundFilter(option.id)}
                        aria-pressed={active}
                        className={`chamfer chamfer-square ${option.width} flex h-5 min-w-[calc(6ch+1.5rem)] [--chamfer-h:1.25rem] items-center justify-center whitespace-nowrap px-3 font-meta text-[9px] uppercase tracking-[0.1em] transition-colors ${active ? "chamfer-selected text-[#241a00]" : "chamfer-ghost text-[#99907c] hover:text-[#e2e2e6]"}`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-[#333538] pt-3">
                {/* an option, not an entry: it keeps the checkbox the layer rows do not */}
                <div className="flex items-start gap-3">
                  <Checkbox
                    className="mt-0.5"
                    checked={showAreaPins}
                    onCheckedChange={setShowAreaPins}
                    aria-label="Show entries that sit inside a location"
                  />
                  <div>
                    {/* the label is a block with its own line height: as an inline span
                        the parent's 16px strut pushed the text well below the box */}
                    <span className="block font-meta text-[9px] leading-4 uppercase tracking-[0.14em] text-[#99907c]">
                      Area entries
                    </span>
                    <p className="mt-0.5 text-[10px] leading-tight text-[#99907c]/80">
                      Entries that sit inside a location, drawn near it rather
                      than exactly.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 border-t border-[#333538] pt-3">
                {/* the bulk switches head the list they act on: plain text, no chip */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={showAllLayers}
                    className="font-meta text-[9px] uppercase tracking-[0.1em] text-[#99907c] underline-offset-4 transition-colors hover:text-[#f2ca50] hover:underline focus-visible:text-[#f2ca50] focus-visible:underline focus-visible:outline-none"
                  >
                    Show all
                  </button>
                  <button
                    type="button"
                    onClick={hideAllLayers}
                    className="font-meta text-[9px] uppercase tracking-[0.1em] text-[#99907c] underline-offset-4 transition-colors hover:text-[#f2ca50] hover:underline focus-visible:text-[#f2ca50] focus-visible:underline focus-visible:outline-none"
                  >
                    Hide all
                  </button>
                </div>

                {MAP_LAYERS.map((layer, index) => {
                  const total = layer.pins.length;
                  const matched = matchedByLayer[layer.id] ?? total;
                  // a hidden layer mutes whole: label, icon and count alike
                  const hidden = hiddenLayers[layer.id] === true;
                  const newGroup =
                    index === 0 || MAP_LAYERS[index - 1].group !== layer.group;

                  return (
                    <div key={layer.id}>
                      {newGroup ? (
                        <p className="pb-1 pt-2 font-meta text-[9px] uppercase tracking-[0.22em] text-[#99907c]">
                          {layer.group}
                        </p>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => toggleLayer(layer.id)}
                        aria-pressed={!hidden}
                        aria-label={`${hidden ? "Show" : "Hide"} ${layer.label}`}
                        title={`${hidden ? "Show" : "Hide"} ${layer.label}`}
                        className={`flex w-full items-center gap-2 py-0.5 text-left transition duration-200 hover:bg-white/[0.04] focus-visible:bg-white/[0.04] focus-visible:outline-none ${hidden ? "opacity-50 grayscale" : ""}`}
                      >
                        <span
                          className="flex h-[18px] w-[18px] shrink-0 items-center justify-center text-[#f2ca50] [&_img]:h-full [&_img]:w-full [&_img]:object-contain [&_svg]:h-full [&_svg]:w-full"
                          dangerouslySetInnerHTML={{
                            __html: pinIconMarkup(layer, layer.pins[0], 15),
                          }}
                        />
                        <span className="min-w-0 flex-1 truncate text-sm text-[#e2e2e6]">
                          {layer.label}
                        </span>
                        <span className="shrink-0 font-mono text-[10px] tabular-nums text-[#d0c5af]">
                          {matched === total ? total : `${matched}/${total}`}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>

              <p className="text-xs leading-relaxed text-[#99907c]">
                {Object.values(matchedByLayer).every((count) => count === 0)
                  ? "Nothing matches the current search and status filter."
                  : "A location stays put while a picto inside it matches. An entry with no surveyed spot is pinned inside its location."}
              </p>
            </div>
          </div>
        )}
      </aside>

      {/* Zoom, bottom right - the debug panel used to live here */}
      <div className="absolute bottom-6 right-6 z-[1000] flex flex-col gap-6">
        <button
          type="button"
          onClick={() => stepZoom(1)}
          disabled={atZoomCeiling}
          aria-label="Zoom in"
          title="Zoom in"
          className={ZOOM_BUTTON_CLASS}
        >
          <Plus className="h-4 w-4 -rotate-45" strokeWidth={1.75} />
        </button>

        <button
          type="button"
          onClick={() => stepZoom(-1)}
          disabled={atZoomFloor}
          aria-label="Zoom out"
          title="Zoom out"
          className={ZOOM_BUTTON_CLASS}
        >
          <Minus className="h-4 w-4 -rotate-45" strokeWidth={1.75} />
        </button>
      </div>

      <style jsx global>{`
        .leaflet-div-icon.picto-pin,
        .leaflet-div-icon.location-pin,
        .leaflet-div-icon.art-pin,
        .leaflet-div-icon.glyph-pin {
          display: grid;
          place-items: center;
          background: transparent;
          border: 0;
        }
        /* collectable layers draw their own glyph instead of borrowing art; the
           font-size comes from the icon box, so they scale with the zoom like the
           image pins do */
        .pin-glyph {
          line-height: 1;
          font-variation-settings:
            "FILL" 1,
            "wght" 500,
            "GRAD" 0,
            "opsz" 24;
          text-shadow:
            0 0 3px #080a0e,
            0 0 7px rgba(8, 10, 14, 0.95);
          transition:
            transform 120ms ease,
            filter 120ms ease,
            opacity 120ms ease;
        }
        .glyph-pin:hover .pin-glyph,
        .glyph-pin:focus-visible .pin-glyph {
          transform: scale(1.18);
          filter: brightness(1.25);
        }
        /* a layer mark we hold as art, in place of the borrowed glyph */
        .art-pin img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: brightness(1.3) drop-shadow(0 0 2px rgba(8, 10, 14, 0.9));
          transition:
            transform 120ms ease,
            filter 120ms ease;
        }
        .art-pin:hover img,
        .art-pin:focus-visible img {
          transform: scale(1.2);
          filter: brightness(1.5) drop-shadow(0 0 6px rgba(89, 218, 209, 0.85));
        }
        .picto-pin img,
        .location-pin img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: brightness(1.4) drop-shadow(0 0 2px rgba(8, 10, 14, 0.9));
          transition:
            transform 120ms ease,
            filter 120ms ease;
        }
        .picto-pin:hover img,
        .picto-pin:focus-visible img {
          transform: scale(1.2);
          filter: brightness(1.6) drop-shadow(0 0 6px rgba(89, 218, 209, 0.85));
        }
        .location-pin {
          color: #f2ca50;
        }
        .location-pin:hover img,
        .location-pin:focus-visible img {
          transform: scale(1.2);
          filter: brightness(1.5) drop-shadow(0 0 6px rgba(242, 202, 80, 0.9));
        }
        .location-pin svg {
          width: 78%;
          height: 78%;
          filter: drop-shadow(0 0 2px rgba(8, 10, 14, 0.9));
          transition:
            transform 120ms ease,
            filter 120ms ease;
        }
        .location-pin:hover svg,
        .location-pin:focus-visible svg {
          transform: scale(1.2);
          filter: drop-shadow(0 0 6px rgba(242, 202, 80, 0.9));
        }
        .picto-card-tooltip,
        .picto-card-popup .leaflet-popup-content-wrapper {
          background: #1e2023;
          border: 1px solid rgba(242, 202, 80, 0.45);
          border-radius: 6px;
          color: #e2e2e6;
          padding: 0;
          box-shadow: 0 10px 26px rgba(0, 0, 0, 0.6);
        }
        .picto-card-tooltip {
          max-width: 320px;
          white-space: normal;
        }
        .picto-card-tooltip:before {
          border-top-color: rgba(242, 202, 80, 0.45);
        }
        .picto-card-popup .leaflet-popup-content {
          margin: 0;
          width: auto !important;
        }
        .picto-card-popup .leaflet-popup-tip {
          background: #1e2023;
        }
        .picto-card {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 268px;
          max-width: 100%;
          padding: 10px 12px;
          font-family: "Space Grotesk", monospace;
        }
        .picto-card__head {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .picto-card__icon {
          display: grid;
          place-items: center;
          width: 32px;
          height: 32px;
          flex: none;
          color: #f2ca50;
        }
        .picto-card__icon img,
        .picto-card__icon svg {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .picto-card__name {
          margin: 0;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.02em;
          color: #f2ca50;
        }
        .picto-card__level {
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #59dad1;
        }
        /* the entry's own art, when the tracker has it */
        .picto-card__hero {
          width: 44px;
          height: 44px;
          flex: none;
          object-fit: contain;
          filter: drop-shadow(0 0 6px rgba(242, 202, 80, 0.25));
        }
        .picto-card__chips {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin: 2px 0 0;
        }
        .picto-card__chip {
          border: 1px solid #4d4635;
          padding: 0 4px;
          font-family: "Space Grotesk", monospace;
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #59dad1;
        }
        .picto-card__stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(56px, 1fr));
          gap: 6px;
          margin: 0;
          border-top: 1px solid #333538;
          border-bottom: 1px solid #333538;
          padding: 7px 0;
        }
        .picto-card__stats div {
          text-align: center;
        }
        .picto-card__stats dt {
          font-family: "Space Grotesk", monospace;
          font-size: 8px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #99907c;
        }
        .picto-card__stats dd {
          margin: 1px 0 0;
          font-size: 14px;
          color: #e2e2e6;
        }
        .picto-card__section {
          border-top: 1px solid #333538;
          padding-top: 7px;
        }
        .picto-card__section:first-of-type {
          border-top: 0;
          padding-top: 0;
        }
        .picto-card__section-title {
          margin: 0 0 3px;
          font-family: "Space Grotesk", monospace;
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #f2ca50;
        }
        .picto-card__section-body {
          margin: 0;
          font-size: 11px;
          line-height: 1.5;
          white-space: normal;
          color: #d5c8a7;
        }
        .picto-card__note {
          margin: 0;
          font-size: 11px;
          line-height: 1.5;
          white-space: normal;
          color: #b9b3a6;
        }
        .picto-card__approx {
          margin: 6px 0 0;
          font-family: "Space Grotesk", monospace;
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #99907c;
        }
        /* The hover card: enough to know what the pin is, and that clicking it is
           worth doing. The popup is the full entry. */
        .picto-card--summary {
          gap: 6px;
        }
        .picto-card--summary .picto-card__name {
          font-size: 12px;
        }
        .picto-card__glance {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          line-clamp: 3;
          overflow: hidden;
          margin: 0;
          font-size: 11px;
          line-height: 1.45;
          white-space: normal;
          color: #d5c8a7;
        }
        .picto-card__hint {
          margin: 2px 0 0;
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(242, 202, 80, 0.7);
        }
        .picto-card__actions {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 10px;
        }
        /* the Library's diamond checkbox, as markup: a 12px square turned 45deg
           with a 6px solid diamond inside it */
        .picto-checkbox {
          display: flex;
          flex: none;
          align-items: center;
          gap: 8px;
          border: 0;
          padding: 0;
          background: none;
          cursor: pointer;
        }
        .picto-checkbox__box {
          display: grid;
          place-content: center;
          width: 12px;
          height: 12px;
          transform: rotate(45deg);
          border: 1px solid rgba(242, 202, 80, 0.3);
          transition: border-color 120ms ease;
        }
        .picto-checkbox__box::after {
          content: "";
          width: 6px;
          height: 6px;
          background: #f2ca50;
          opacity: 0;
          transition: opacity 120ms ease;
        }
        .picto-checkbox:hover .picto-checkbox__box,
        .picto-checkbox:focus-visible .picto-checkbox__box,
        .picto-checkbox[aria-checked="true"] .picto-checkbox__box {
          border-color: #f2ca50;
        }
        .picto-checkbox:hover .picto-checkbox__box::after {
          opacity: 0.4;
        }
        .picto-checkbox[aria-checked="true"] .picto-checkbox__box::after {
          opacity: 1;
        }
        .picto-checkbox__label {
          font-family: "Space Grotesk", monospace;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #99907c;
          transition: color 120ms ease;
        }
        .picto-checkbox[aria-checked="true"] .picto-checkbox__label {
          color: #f2ca50;
        }
        .picto-checkbox:focus-visible {
          outline: none;
          box-shadow: 0 0 0 2px rgba(242, 202, 80, 0.25);
        }
        .picto-card__track {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;
          border: 1px solid #4d4635;
          border-radius: 2px;
          padding: 6px 10px;
          background: transparent;
          font-family: "Space Grotesk", monospace;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #99907c;
          cursor: pointer;
          transition:
            border-color 160ms ease,
            color 160ms ease,
            background-color 160ms ease;
        }
        .picto-card__track:hover,
        .picto-card__track:focus-visible {
          border-color: #f2ca50;
          color: #f2ca50;
        }
        /* collected pins are not something to hunt down */
        .picto-card__track:disabled {
          border-color: #333538;
          color: #6b6559;
          cursor: not-allowed;
        }
        /* tracked is the gold of every other Track control, not teal */
        .picto-card__track[aria-pressed="true"] {
          border-color: #f2ca50;
          background: rgba(242, 202, 80, 0.1);
          color: #f2ca50;
        }
        .picto-card__entities {
          display: flex;
          flex-direction: column;
          gap: 6px;
          border-top: 1px solid #333538;
          padding-top: 8px;
        }
        .picto-card__entities-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin: 0;
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #99907c;
        }
        .picto-card__entities-count {
          flex: none;
          border: 1px solid #4d4635;
          border-radius: 2px;
          padding: 1px 5px;
          font-size: 10px;
          letter-spacing: 0.06em;
          color: #d0c5af;
        }
        .picto-card__empty {
          margin: 0;
          font-size: 11px;
          color: #8f8878;
        }
        .picto-list {
          display: flex;
          flex-direction: column;
          gap: 2px;
          max-height: 210px;
          margin: 0;
          padding: 0;
          overflow-y: auto;
          list-style: none;
        }
        .picto-list__item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 2px 3px;
          border-radius: 3px;
        }
        .picto-list__item img {
          width: 20px;
          height: 20px;
          flex: none;
          object-fit: contain;
          filter: drop-shadow(0 0 2px rgba(8, 10, 14, 0.9));
        }
        .picto-list__name {
          flex: 1;
          min-width: 0;
          overflow: hidden;
          font-size: 11px;
          color: #e2e2e6;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .picto-list__level {
          flex: none;
          font-size: 9px;
          letter-spacing: 0.08em;
          color: #59dad1;
        }
        .picto-card__footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin: 0;
          font-size: 10px;
          color: #99907c;
        }
        .picto-card__footer--revealed,
        .picto-card--revealed .picto-card__footer {
          display: none;
        }
        .picto-card--revealed .picto-card__footer--revealed {
          display: flex;
        }
        .picto-card__reveal {
          flex: none;
          border: 1px solid #4d4635;
          border-radius: 3px;
          background: #26282c;
          padding: 2px 7px;
          font-family: inherit;
          font-size: 10px;
          color: #f2ca50;
          cursor: pointer;
          transition:
            border-color 120ms ease,
            background-color 120ms ease;
        }
        .picto-card__reveal:hover,
        .picto-card__reveal:focus-visible {
          border-color: #f2ca50;
          background: #3a3526;
          outline: none;
        }
        .picto-card:not(.picto-card--revealed)
          .picto-list__item[data-match="0"] {
          display: none;
        }
        /* Revealed non-matches keep their place but read as out of scope */
        .picto-card--revealed .picto-list__item[data-match="0"] {
          opacity: 0.4;
          filter: grayscale(1);
        }
      `}</style>
    </div>
  );
}

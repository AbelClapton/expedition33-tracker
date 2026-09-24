"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  ArrowLeft,
  Bug,
  ChevronDown,
  Grid3X3,
  Layers,
  Minus,
  Palette,
  Plus,
  Hash,
  Search,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { PICTO_PIN_ICON } from "@/engine/utils/pictoIcon";
import { useFoundPictos } from "@/hooks/useFoundPictos";
import { assetPath } from "@/lib/assetPath";
import pictoPins from "./data/pictoPins.json";
import locationPins from "./data/locationPins.json";
import { locationEntities, type LocationEntity } from "./locationEntities";
import { isPictoPinFound } from "./pictoStatus";

type Pin = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  level?: number;
  note?: string;
  icon?: string;
};

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

function tileToLatLngBounds(
  x: number,
  y: number,
  zoom: number,
): L.LatLngBounds {
  const n = Math.pow(2, zoom);
  const lngMin = (x / n) * 360 - 180;
  const latMax =
    (Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / n))) * 180) / Math.PI;
  const lngMax = ((x + 1) / n) * 360 - 180;
  const latMin =
    (Math.atan(Math.sinh(Math.PI * (1 - (2 * (y + 1)) / n))) * 180) / Math.PI;
  return L.latLngBounds(L.latLng(latMin, lngMin), L.latLng(latMax, lngMax));
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
// Markers grow as you zoom in, so they stay readable against magnified art
const PIN_GROWTH = 1.25;
const PIN_MAX_SCALE = 2.4;

function pinScale(zoom: number, floor: number): number {
  return Math.min(PIN_MAX_SCALE, Math.max(1, PIN_GROWTH ** (zoom - floor)));
}

const pinImage = (src: string) =>
  `<img src="${src}" alt="" draggable="false" />`;

// Dev serves tiles through the /api/tile cache route; the static Pages build has no server,
// so it points straight at the wiki pyramid (same artwork, `.jpg` template). See next.config.ts.
const TILE_TEMPLATE = process.env.NEXT_PUBLIC_TILE_URL ?? "/api/tile/{z}/{x}/{y}";

/** Same template, one concrete tile - used when a tile is opened on its own. */
const tileUrl = (zoom: number, x: number, y: number) =>
  TILE_TEMPLATE.replace("{z}", `${zoom}`)
    .replace("{x}", `${x}`)
    .replace("{y}", `${y}`);

// Fallback for a pin whose wiki entry carries no icon art
const LOCATION_FALLBACK_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="7.5" /><circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none" /></svg>`;

// Layer registry: each entry becomes a row in the layer panel and its own layer group
const NO_ENTITIES: LocationEntity[] = [];

const MAP_LAYERS = [
  {
    id: "pictos",
    label: "Pictos",
    pins: pictoPins as Pin[],
    markerClass: "picto-pin",
    size: PIN_ICON_SIZE,
    // one shared icon for every picto
    iconFor: () => pinImage(PICTO_PIN_ICON),
    entitiesFor: () => NO_ENTITIES,
    // pictos are the only pins the collection marks as found, so the status filter applies here
    tracksFound: true,
  },
  {
    id: "locations",
    label: "Locations",
    pins: locationPins as Pin[],
    markerClass: "location-pin",
    // a touch larger than the picto glyphs, and each shows its own wiki art
    size: PIN_ICON_SIZE + 4,
    iconFor: (pin: Pin) => pinImage(assetPath(pin.icon ?? "")) || LOCATION_FALLBACK_ICON,
    // the collectables that sit inside the location
    entitiesFor: (pin: Pin) => locationEntities(pin.name),
    tracksFound: false,
  },
] as const;

type MapLayer = (typeof MAP_LAYERS)[number];

const FOUND_FILTERS = [
  { id: "all", label: "All", width: "flex-1" },
  { id: "found", label: "Found", width: "flex-1" },
  // the long label gets more of the row so it stays on one line
  { id: "missing", label: "Not found", width: "flex-[1.5]" },
] as const;

type FoundFilter = (typeof FOUND_FILTERS)[number]["id"];

// iconFor always returns a usable markup string
function pinIconMarkup(layer: MapLayer, pin: Pin): string {
  const markup = layer.iconFor(pin);
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

/** The found filter only speaks about pins the collection can mark, i.e. pictos. */
function statusMatches(
  layer: MapLayer,
  pin: Pin,
  filter: FoundFilter,
  foundIds: Set<string>,
): boolean {
  if (!layer.tracksFound || filter === "all") return true;
  const found = isPictoPinFound(pin.name, foundIds);
  return filter === "found" ? found : !found;
}

// Markers are icons, not teardrop pins, so the icon centre marks the coordinate
function pinIcon(layer: MapLayer, pin: Pin, scale = 1): L.DivIcon {
  const size = Math.round(layer.size * scale);

  return L.divIcon({
    className: layer.markerClass,
    html: pinIconMarkup(layer, pin),
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
  options: { query?: string; entities?: boolean } = {},
): string {
  const level = pin.level
    ? `<span class="picto-card__level">Lv ${pin.level}</span>`
    : "";
  const note = pin.note
    ? `<p class="picto-card__note">${escapeHtml(pin.note)}</p>`
    : "";
  // Only the click popup carries the entity list; the hover card stays a glance
  const section = options.entities
    ? entitySectionHtml(
        pin,
        layer.entitiesFor(pin),
        (options.query ?? "").trim().toLowerCase(),
      )
    : "";

  return `
        <div class="picto-card">
          <div class="picto-card__head">
            <span class="picto-card__icon">${icon}</span>
            <div>
              <p class="picto-card__name">${escapeHtml(pin.name)}</p>
              ${level}
            </div>
          </div>
          ${note}
          ${section}
        </div>`;
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
  const gridLayerRef = useRef<L.LayerGroup | null>(null);
  const layerRefs = useRef<Record<string, L.LayerGroup>>({});
  const markerRefs = useRef<Record<string, { marker: L.Marker; pin: Pin }[]>>(
    {},
  );
  const [hiddenLayers, setHiddenLayers] = useState<Record<string, boolean>>({});
  // scale the pins are currently drawn at, recomputed on zoom
  const pinScaleRef = useRef(1);
  // one query for the whole panel, shared by every layer
  const [searchQuery, setSearchQuery] = useState("");
  // found / not found, from the same localStorage the collection writes
  const [foundFilter, setFoundFilter] = useState<FoundFilter>("all");
  const { foundSet } = useFoundPictos();
  const [layersOpen, setLayersOpen] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [gridColor, setGridColor] = useState("#f2ca50");
  const [showGridLabels, setShowGridLabels] = useState(true);
  const [currentZoom, setCurrentZoom] = useState(3);
  // the floor moves with the viewport, so the custom control needs it as state
  const [zoomFloor, setZoomFloor] = useState(MIN_TILE_ZOOM);
  const floatingTooltipRef = useRef<HTMLDivElement | null>(null);

  const matchedByLayer = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return Object.fromEntries(
      MAP_LAYERS.map((layer) => [
        layer.id,
        layer.pins.filter(
          (pin) =>
            pinMatches(pin, query, entitySearchText(layer, pin)) &&
            statusMatches(layer, pin, foundFilter, foundSet),
        ).length,
      ]),
    ) as Record<string, number>;
  }, [searchQuery, foundFilter, foundSet]);

  // How much of the picto layer the found filter has to work with
  const pictoStatusCounts = useMemo(() => {
    const pins = MAP_LAYERS.find((layer) => layer.tracksFound)?.pins ?? [];
    const found = pins.filter((pin) =>
      isPictoPinFound(pin.name, foundSet),
    ).length;
    return { found, total: pins.length };
  }, [foundSet]);

  const toggleLayer = (id: string) =>
    setHiddenLayers((hidden) => ({ ...hidden, [id]: !hidden[id] }));

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
      applyPinScale();
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
        const tooltip = pinCardHtml(layer, pin, icon);
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

    // Grow the pins with the zoom: redraw them at the new size, which also keeps
    // the popup/tooltip anchors sitting against the icon.
    const applyPinScale = () => {
      const scale = pinScale(map.getZoom(), map.getMinZoom());
      if (scale === pinScaleRef.current) return;
      pinScaleRef.current = scale;

      for (const layer of MAP_LAYERS) {
        for (const { marker, pin } of markerRefs.current[layer.id] ?? []) {
          marker.setIcon(pinIcon(layer, pin, scale));
        }
      }
    };
    map.on("zoomend", applyPinScale);

    return () => {
      resizeObserver.disconnect();
      if (gridLayerRef.current) map.removeLayer(gridLayerRef.current);
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
            pinMatches(pin, query, entitySearchText(layer, pin)) &&
            statusMatches(layer, pin, foundFilter, foundSet);
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
        const icon = pinIconMarkup(layer, pin);
        marker.setTooltipContent(pinCardHtml(layer, pin, icon, { query }));
        marker.setPopupContent(
          pinCardHtml(layer, pin, icon, { entities: true, query }),
        );
      }
    }
  }, [hiddenLayers, searchQuery, foundFilter, foundSet]);

  // "Show all" inside a card: swap a class instead of rebuilding the list
  useEffect(() => {
    const container = mapRef.current;
    if (!container) return;

    const onShowAll = (event: MouseEvent) => {
      const button = (event.target as HTMLElement | null)?.closest(
        "[data-show-all]",
      );
      const card = button?.closest(".picto-card");
      if (!button || !card) return;
      event.preventDefault();
      event.stopPropagation();
      card.classList.toggle("picto-card--revealed");
    };

    container.addEventListener("click", onShowAll);
    return () => container.removeEventListener("click", onShowAll);
  }, []);

  // Grid overlay (L.rectangle – never drifts)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (showGrid && !gridLayerRef.current) {
      const gridLayer = L.layerGroup().addTo(map);
      const updateGrid = () => {
        gridLayer.clearLayers();
        const zoom = map.getZoom();
        const bounds = map.getBounds();
        const nw = bounds.getNorthWest();
        const se = bounds.getSouthEast();
        const startTile = getTileCoords(nw.lat, nw.lng, zoom);
        const endTile = getTileCoords(se.lat, se.lng, zoom);
        for (let x = startTile.x; x <= endTile.x; x++) {
          for (let y = startTile.y; y <= endTile.y; y++) {
            const tileBounds = tileToLatLngBounds(x, y, zoom);
            const rect = L.rectangle(tileBounds, {
              color: gridColor,
              weight: 1,
              fill: false,
              interactive: true,
            });
            if (showGridLabels) {
              rect.bindTooltip(`${x},${y}`, {
                permanent: false,
                direction: "center",
                className: "grid-tooltip",
              });
            }
            rect.addTo(gridLayer);
          }
        }
      };
      map.on("moveend", updateGrid);
      map.on("zoomend", updateGrid);
      updateGrid();
      gridLayerRef.current = gridLayer;
    } else if (!showGrid && gridLayerRef.current) {
      map.removeLayer(gridLayerRef.current);
      gridLayerRef.current = null;
      map.off("moveend");
      map.off("zoomend");
    } else if (showGrid && gridLayerRef.current) {
      // Rebuild on color/label change
      const layer = gridLayerRef.current;
      map.removeLayer(layer);
      gridLayerRef.current = null;
      setShowGrid(false);
      setTimeout(() => setShowGrid(true), 0);
    }
  }, [showGrid, gridColor, showGridLabels]);

  // Floating debug tooltip – shows X (horizontal) then Y (vertical)
  // Floating debug tooltip – shows map-local coordinates (origin at top-left of tile 0,0)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const createTooltip = () => {
      if (floatingTooltipRef.current) return;
      const div = document.createElement("div");
      div.className = "debug-floating-tooltip";
      div.style.position = "absolute";
      div.style.backgroundColor = "#1e2023";
      div.style.color = "#e2e2e6";
      div.style.padding = "6px 12px";
      div.style.borderRadius = "4px";
      div.style.fontFamily = "Space Grotesk, monospace";
      div.style.fontSize = "12px";
      div.style.borderLeft = "3px solid #f2ca50";
      div.style.pointerEvents = "none";
      div.style.zIndex = "10000";
      div.style.whiteSpace = "nowrap";
      document.body.appendChild(div);
      floatingTooltipRef.current = div;
    };

    const updateTooltip = (latlng: L.LatLng) => {
      if (!floatingTooltipRef.current) return;
      const zoom = map.getZoom();
      const n = Math.pow(2, zoom);
      const lng = latlng.lng;
      const latRad = (latlng.lat * Math.PI) / 180;

      // Tile coordinates
      const tileX = Math.floor(((lng + 180) / 360) * n);
      const tileY = Math.floor(
        ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) /
          2) *
          n,
      );

      // Pixel offset inside the tile (0..256)
      const pixelX = Math.floor((((lng + 180) / 360) * n - tileX) * 256);
      const pixelY = Math.floor(
        (((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) /
          2) *
          n -
          tileY) *
          256,
      );

      // Map-local coordinates (origin = top-left of tile (0,0))
      const mapX = tileX * 256 + pixelX;
      const mapY = tileY * 256 + pixelY;

      floatingTooltipRef.current.innerHTML = `🗺️ ${mapX}, ${mapY}<br/>🎴 ${tileX}, ${tileY}`;
      const point = map.latLngToContainerPoint(latlng);
      floatingTooltipRef.current.style.left = `${point.x + 15}px`;
      floatingTooltipRef.current.style.top = `${point.y - 30}px`;
    };

    if (debugMode) {
      createTooltip();
      const onMouseMove = (e: L.LeafletMouseEvent) => updateTooltip(e.latlng);
      const onMouseOut = () => {
        if (floatingTooltipRef.current)
          floatingTooltipRef.current.style.display = "none";
      };
      const onMouseOver = () => {
        if (floatingTooltipRef.current)
          floatingTooltipRef.current.style.display = "block";
      };
      map.on("mousemove", onMouseMove);
      map.on("mouseout", onMouseOut);
      map.on("mouseover", onMouseOver);
      return () => {
        map.off("mousemove", onMouseMove);
        map.off("mouseout", onMouseOut);
        map.off("mouseover", onMouseOver);
        floatingTooltipRef.current?.remove();
        floatingTooltipRef.current = null;
      };
    } else {
      floatingTooltipRef.current?.remove();
      floatingTooltipRef.current = null;
    }
  }, [debugMode]);

  const stepZoom = (delta: number) => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.setZoom(map.getZoom() + delta);
  };

  const atZoomFloor = currentZoom <= zoomFloor;
  const atZoomCeiling = currentZoom >= MAX_TILE_ZOOM;

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />

      {/* Back to the shell, then the diamond zoom control (insets absorb the rotated corners) */}
      <div className="absolute left-[23px] top-[23px] z-[1000] flex flex-col gap-6">
        <Link
          href="/collections"
          aria-label="Back to the Library"
          title="Back to the Library"
          className="flex h-9 items-center gap-2 border border-[#5e5331] bg-[#1e2023] px-3 text-[#e2e2e6] shadow-[0_10px_26px_rgba(0,0,0,0.55)] transition-colors duration-200 hover:border-[#f2ca50] hover:bg-[#3a3526] hover:text-[#f2ca50] focus-visible:border-[#f2ca50] focus-visible:bg-[#3a3526] focus-visible:text-[#f2ca50] focus-visible:outline-none"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
          <span className="font-meta text-[10px] uppercase tracking-[0.2em]">
            Library
          </span>
        </Link>

        <div className="flex flex-col gap-6">
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
      </div>

      {/* Floating layer menu */}
      <div className="absolute right-4 top-4 z-[1000] w-[240px]">
        <div className="overflow-hidden rounded-lg border border-[#f2ca50]/30 bg-[#1e2023] shadow-xl backdrop-blur-sm">
          <button
            type="button"
            onClick={() => setLayersOpen((open) => !open)}
            aria-expanded={layersOpen}
            className={`flex w-full items-center justify-between gap-2 p-3 text-left ${layersOpen ? "border-b border-[#333538]" : ""}`}
          >
            <span className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-[#f2ca50]" />
              <span className="font-sans text-sm font-medium tracking-wide text-[#e2e2e6]">
                LAYERS
              </span>
            </span>
            <ChevronDown
              className={`h-4 w-4 text-[#99907c] transition-transform ${layersOpen ? "rotate-180" : ""}`}
            />
          </button>
          {layersOpen && (
            <div className="space-y-3 p-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#99907c]" />
                <Input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search pictos & locations"
                  aria-label="Search pictos and locations on the map"
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
                    Picto status
                  </span>
                  <span className="font-mono text-[10px] text-[#d0c5af]">
                    {pictoStatusCounts.found}/{pictoStatusCounts.total}
                  </span>
                </div>
                <div
                  className="flex overflow-hidden rounded border border-[#4d4635]"
                  role="group"
                  aria-label="Filter pictos by whether they are found"
                >
                  {FOUND_FILTERS.map((option) => {
                    const active = foundFilter === option.id;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setFoundFilter(option.id)}
                        aria-pressed={active}
                        className={`${option.width} whitespace-nowrap px-2 py-1 font-meta text-[9px] uppercase tracking-[0.1em] transition-colors ${active ? "bg-[#3a3526] text-[#f2ca50]" : "text-[#99907c] hover:bg-[#26282c] hover:text-[#e2e2e6]"}`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2 border-t border-[#333538] pt-3">
                {MAP_LAYERS.map((layer) => {
                  const total = layer.pins.length;
                  const matched = matchedByLayer[layer.id] ?? total;

                  return (
                    <div
                      key={layer.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="flex h-[18px] w-[18px] items-center justify-center text-[#f2ca50] [&_img]:h-full [&_img]:w-full [&_img]:object-contain [&_svg]:h-full [&_svg]:w-full"
                          dangerouslySetInnerHTML={{
                            __html: pinIconMarkup(layer, layer.pins[0]),
                          }}
                        />
                        <span className="text-sm text-[#e2e2e6]">
                          {layer.label}
                        </span>
                        <span className="rounded border border-[#4d4635] px-1.5 py-0.5 font-mono text-[10px] text-[#d0c5af]">
                          {matched === total ? total : `${matched}/${total}`}
                        </span>
                      </div>
                      <Switch
                        checked={!hiddenLayers[layer.id]}
                        onCheckedChange={() => toggleLayer(layer.id)}
                        aria-label={`Toggle ${layer.label}`}
                      />
                    </div>
                  );
                })}
              </div>

              <p className="text-xs leading-relaxed text-[#99907c]">
                {Object.values(matchedByLayer).every((count) => count === 0)
                  ? "Nothing matches the current search and status filter."
                  : "A location stays put while a picto inside it matches. Click one for the list."}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-6 right-6 z-[1000] w-[320px]">
        <Collapsible open={debugMode} onOpenChange={setDebugMode}>
          <div className="bg-[#1e2023] rounded-lg border border-[#f2ca50]/30 shadow-xl backdrop-blur-sm overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b border-[#333538]">
              <div className="flex items-center gap-2">
                <Bug className="h-4 w-4 text-[#f2ca50]" />
                <span className="font-sans text-sm font-medium tracking-wide text-[#e2e2e6]">
                  CHROMA DEBUG
                </span>
              </div>
              <Switch checked={debugMode} onCheckedChange={setDebugMode} />
            </div>
            <CollapsibleContent>
              <div className="p-3 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Grid3X3 className="h-4 w-4 text-[#59dad1]" />
                      <span className="text-sm text-[#e2e2e6]">
                        Grid Overlay
                      </span>
                    </div>
                    <Switch checked={showGrid} onCheckedChange={setShowGrid} />
                  </div>
                  {showGrid && (
                    <div className="pl-6 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Palette className="h-3 w-3 text-[#99907c]" />
                          <span className="text-xs text-[#d0c5af]">Color</span>
                        </div>
                        <input
                          type="color"
                          value={gridColor}
                          onChange={(e) => setGridColor(e.target.value)}
                          className="w-6 h-6 rounded border border-[#4d4635] bg-transparent cursor-pointer"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Hash className="h-3 w-3 text-[#99907c]" />
                          <span className="text-xs text-[#d0c5af]">
                            Tile Labels
                          </span>
                        </div>
                        <Switch
                          checked={showGridLabels}
                          onCheckedChange={setShowGridLabels}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="text-center text-xs text-[#99907c] pt-1 border-t border-[#333538] mt-2">
                  🖱️ Middle‑click map → opens tile image
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </div>
      <style jsx global>{`
        .grid-tooltip {
          background-color: #1e2023 !important;
          border: 1px solid #f2ca50 !important;
          color: #f2ca50 !important;
          font-family: "Space Grotesk", monospace !important;
          font-size: 10px !important;
          font-weight: 500 !important;
          border-radius: 2px !important;
          box-shadow: 0 0 4px rgba(242, 202, 80, 0.3) !important;
        }
        .grid-tooltip:before {
          border-top-color: #f2ca50 !important;
        }
        .leaflet-div-icon.picto-pin,
        .leaflet-div-icon.location-pin {
          display: grid;
          place-items: center;
          background: transparent;
          border: 0;
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
        .picto-card__note {
          margin: 0;
          font-size: 11px;
          line-height: 1.5;
          white-space: normal;
          color: #b9b3a6;
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

// Regenerates the Library layer data under src/features/collection/data from the
// reference interactive map (ign.com/maps/clair-obscur-expedition-33/the-continent,
// which is MapGenie map 760 behind the scenes), plus the continent pins the atlas
// can show under src/features/map/data.
//
//   node scripts/fetch-collectables.mjs                 # download (cached) + write data
//   node scripts/fetch-collectables.mjs --check         # only report counts / drift
//   node scripts/fetch-collectables.mjs --verify-transform   # refit the coordinate transform
//
// Source: https://mapgenie.io/api/v1/maps/760/data -> { regions, locations }.
// Every location is one marker: { id, region_id, category_id, title, description,
// latitude, longitude }. The payload carries NO category metadata, so the
// category_id -> name table below comes from the reference map's own legend
// (the "types" blob in its page HTML, which lists `initialTypes` + typeName).
// Every count in that legend was checked against the generated files.
//
// Which layers to write is read from the registry itself
// (src/features/collection/collectionLayers.ts) so the two cannot drift: a layer
// whose `mapCategory` is not in the legend here fails the run.
//
// COORDINATES: the payload's canvas is a mosaic - region "Continent" is the
// overworld (the artwork this tracker's atlas renders) and the other 23 regions
// are per-area detail boxes drawn beside it, each at its own scale. So only the
// Continent markers can be placed on our map, through the fitted transform below;
// the nested ones are kept in the Library and will need their own handling.

import fs from 'node:fs/promises';
import path from 'node:path';

const MAP_DATA_URL = 'https://mapgenie.io/api/v1/maps/760/data';
const CACHE_FILE = '.cache/mapgenie-760.json';
const WIKI_MAP_URL = 'https://static0.fextralifeimages.com/file/expedition33/vm6a399e85571e0d705eec027e.js';
const WIKI_CACHE_FILE = '.cache/fextralife-map.js';
const OUT_DIR = 'src/features/collection/data';
const PIN_DIR = 'src/features/map/data';
const REGISTRY_FILE = 'src/features/collection/collectionLayers.ts';

const ART_ASPECT = 8192 / 9709;
const WIKI_LOCATIONS_UID = 'l6a174e88fc6943e42a81790e';
const GENIE_LOCATION_CATEGORY = 12838;
/** The one region on the reference canvas that shares this tracker's artwork. */
const CONTINENT_REGION = 'Continent';
/** Margin (in artwork units) a projected pin must clear on every side. */
const ARTWORK_INSET = 0.002;
/**
 * Regions whose name does not match a wiki location, mapped to the one that stands
 * in for them. "Inside the Monolith" is the interior of the landmark we do have.
 */
const REGION_ALIASES = {
    'Inside the Monolith': 'The Monolith',
};
/** Phyllotaxis: consecutive entries in a cluster never line up. */
const GOLDEN_ANGLE = 2.399963229728653;
const CLUSTER_STEP_PX = 13;
const MAX_CLUSTER_PX = 230;

/**
 * MapGenie mercator -> normalised x/y over the artwork our atlas renders.
 *
 * Fitted on the locations both maps list: 48 names match 1:1, and a per-axis
 * scale+offset lands them at ~13 px MAE per axis on the 8192x9709 artwork
 * (a full affine is no better - cross terms are ~0.3% - so the residual is
 * hand-placement slop on the wiki's side, not projection error).
 * Re-derive with --verify-transform.
 */
const ARTWORK_TRANSFORM = {
    xScale: 1221.856972693,
    xOffset: -608.049323441,
    yScale: 1022.187391553,
    yOffset: -508.59865634,
};

/** Layers the engine already owns, so the map data must not overwrite them. */
const ENGINE_SOURCED = new Set(['pictos']);

/** category_id -> [name, reference-map group], from the reference map's legend. */
const CATEGORIES = {
    12839: ['Area', 'Locations'],
    12838: ['Location', 'Locations'],
    12865: ['Point of Interest', 'Locations'],
    12841: ['Rest Point', 'Locations'],
    12842: ['Shortcut', 'Locations'],
    12840: ['Underwater Treasure', 'Locations'],
    12871: ['Haircut', 'Collectibles'],
    12844: ['Journal Entry', 'Collectibles'],
    12864: ['Lost Gestral', 'Collectibles'],
    12843: ['Music Record', 'Collectibles'],
    12870: ['Outfit', 'Collectibles'],
    12849: ['Paint Cage', 'Collectibles'],
    12846: ['Pictos', 'Collectibles'],
    12847: ['Quest Item', 'Collectibles'],
    12848: ['Tint', 'Collectibles'],
    12845: ['Weapon', 'Collectibles'],
    12850: ['Chroma', 'Items'],
    12851: ['Chroma Catalyst', 'Items'],
    12852: ['Colour of Lumina', 'Items'],
    12853: ['Recoat', 'Items'],
    12857: ['Enemy', 'Creatures'],
    12855: ['Optional Boss', 'Creatures'],
    12854: ['Story Boss', 'Creatures'],
    12856: ['World Boss', 'Creatures'],
    12861: ['Side Quest', 'Quests'],
    12869: ['Character', 'Other'],
    12866: ['Grapple', 'Other'],
    12868: ['Interactable', 'Other'],
    12860: ['Merchant', 'Other'],
    12862: ['Miscellaneous', 'Other'],
    12872: ['Paint Cage Lock', 'Other'],
    12867: ['Rope', 'Other'],
    27221: ['Paint Spike', 'Other'],
};

const CATEGORY_BY_NAME = new Map(Object.entries(CATEGORIES).map(([id, [name]]) => [name, Number(id)]));

/**
 * Reads `{ id, mapCategory }` pairs out of the registry, its single source of truth.
 *
 * Anchored on the COLLECTION_LAYERS array rather than the whole file: the group list
 * above it has `{ id: ... }` objects too, and a regex free to span both paired the
 * first group with the first layer's category - which is how the pictos layer was
 * silently missing from every run (and how a picto entry file briefly landed on
 * `lumina` before the real one overwrote it). The count check keeps a future registry
 * change loud instead of quiet.
 */
async function readRegistryLayers() {
    const source = await fs.readFile(REGISTRY_FILE, 'utf8');
    const start = source.indexOf('export const COLLECTION_LAYERS');
    const end = source.indexOf('\n];', start);

    if (start < 0 || end < 0) {
        throw new Error(`could not find the COLLECTION_LAYERS array in ${REGISTRY_FILE}`);
    }

    const body = source.slice(start, end);
    const layers = [];
    const entry = /\{\s*id:\s*"([^"]+)"[\s\S]*?mapCategory:\s*"([^"]+)"/g;
    let match;

    while ((match = entry.exec(body)) !== null) {
        layers.push({ id: match[1], mapCategory: match[2] });
    }

    const declared = (body.match(/\bid:\s*"/g) ?? []).length;

    if (layers.length === 0) {
        throw new Error(`no layers parsed out of ${REGISTRY_FILE}`);
    }

    if (layers.length !== declared) {
        throw new Error(
            `parsed ${layers.length} of ${declared} layers from ${REGISTRY_FILE} - its shape changed`,
        );
    }

    return layers;
}

async function loadPayload() {
    try {
        const cached = await fs.readFile(CACHE_FILE, 'utf8');
        return JSON.parse(cached);
    } catch {
        process.stdout.write(`downloading ${MAP_DATA_URL}\n`);
        const res = await fetch(MAP_DATA_URL, {
            headers: { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', accept: 'application/json' },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status} from ${MAP_DATA_URL}`);

        const body = await res.text();
        await fs.mkdir(path.dirname(CACHE_FILE), { recursive: true });
        await fs.writeFile(CACHE_FILE, body);
        return JSON.parse(body);
    }
}

/**
 * Marker descriptions are MapGenie markdown. Keep the prose, drop the markup:
 * links become their label (the targets point back at their map), bold/italics
 * lose their delimiters, and the remaining whitespace is collapsed.
 */
function toPlainText(markdown) {
    if (!markdown) return '';

    return markdown
        .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
        .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/[*_`]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

/** `chroma-catalysts` -> `chromaCatalysts`, for the generated barrel. */
function toIdentifier(id) {
    return id.replace(/-([a-z0-9])/g, (_, char) => char.toUpperCase());
}

/** Name matching ignores the wiki's parenthetical suffixes and punctuation. */
function toBaseName(value) {
    return String(value ?? '')
        .replace(/\s*[\(\[].*$/, '')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');
}

function toEntry(location, regionNames) {
    const [category] = CATEGORIES[location.category_id] ?? [];
    const description = toPlainText(location.description);

    return {
        id: location.id,
        name: location.title.trim(),
        category,
        region: regionNames.get(location.region_id) ?? null,
        ...(description ? { description } : {}),
        lat: Number(Number(location.latitude).toFixed(6)),
        lng: Number(Number(location.longitude).toFixed(6)),
    };
}

/** MapGenie lat/lng -> the world-normalised mercator pair the transform consumes. */
function toMercator(lat, lng) {
    return {
        mx: (lng + 180) / 360,
        my: (1 - Math.asinh(Math.tan((lat * Math.PI) / 180)) / Math.PI) / 2,
    };
}

/** Same point, named x/y for the polygon tests (which also feed the artwork fit). */
function mercatorPoint(lat, lng) {
    const { mx, my } = toMercator(lat, lng);
    return { x: mx, y: my };
}

/** Normalised artwork x/y -> the tracker's own lat/lng (same maths as fetch-map-pins.mjs). */
function artworkToLatLng(x, y) {
    return {
        lat: +((Math.atan(Math.sinh(Math.PI * (1 - 2 * y))) * 180) / Math.PI).toFixed(5),
        lng: +(x * ART_ASPECT * 360 - 180).toFixed(5),
    };
}

/** A MapGenie marker projected onto the artwork: `x`/`y` are normalised, `lat`/`lng` ours. */
function projectMarker(location, transform) {
    const { mx, my } = toMercator(Number(location.latitude), Number(location.longitude));
    const x = transform.xScale * mx + transform.xOffset;
    const y = transform.yScale * my + transform.yOffset;

    return { x, y, ...artworkToLatLng(x, y) };
}

/** Inside the artwork, with a hair of margin so a pin never sits half off the edge. */
function onArtwork({ x, y }) {
    return x >= ARTWORK_INSET && x <= 1 - ARTWORK_INSET && y >= ARTWORK_INSET && y <= 1 - ARTWORK_INSET;
}

/** Per-axis least squares, rejecting the wiki's hand-placement outliers along the way. */
function fitAxis(pairs, pickA, pickB, artPixels, keepWithinPx) {
    let current = pairs;
    let fit = null;

    for (let pass = 0; pass < 4; pass += 1) {
        const n = current.length;
        const meanA = current.reduce((total, p) => total + pickA(p), 0) / n;
        const meanB = current.reduce((total, p) => total + pickB(p), 0) / n;
        const varA = current.reduce((total, p) => total + (pickA(p) - meanA) ** 2, 0);
        const cov = current.reduce((total, p) => total + (pickA(p) - meanA) * (pickB(p) - meanB), 0);
        const scale = cov / varA;
        const offset = meanB - scale * meanA;
        const errors = current.map((p) => (pickB(p) - (scale * pickA(p) + offset)) * artPixels);
        const mae = errors.reduce((total, e) => total + Math.abs(e), 0) / n;
        fit = { scale, offset, mae, pairs: n };

        const kept = current.filter((_, index) => Math.abs(errors[index]) < keepWithinPx);
        if (kept.length === current.length) break;
        current = kept;
    }

    return fit;
}

/** Ray casting, so a marker's own box can be found rather than trusted to its region id. */
function ringContains(ring, point) {
    let inside = false;

    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        const a = ring[i];
        const b = ring[j];
        const crosses =
            a.y > point.y !== b.y > point.y &&
            point.x < ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y) + a.x;
        if (crosses) inside = !inside;
    }

    return inside;
}

/**
 * The mosaic's boxes, each with the wiki location pin that stands in for it.
 *
 * The reference canvas draws the overworld as one box and every area as another, at
 * its own scale, so a marker's `region_id` is not always the box it is drawn in -
 * several hundred markers are tagged `Continent` yet sit in an area box. Testing the
 * region polygons finds the box they are really in, which is what makes an anchor
 * available for all but a handful of markers.
 */
async function buildRegionBoxes(payload) {
    const markers = await loadWikiMarkers();
    const byName = new Map();

    for (const marker of markers) {
        if (!marker.layers?.includes(WIKI_LOCATIONS_UID)) continue;
        const key = toBaseName(marker.popup?.title ?? marker.tooltip ?? '');
        if (key) byName.set(key, { x: marker.x, y: marker.y });
    }

    return (payload.regions ?? []).map((region) => ({
        id: region.id,
        title: region.title,
        anchor: byName.get(toBaseName(REGION_ALIASES[region.title] ?? region.title)),
        rings: (region.features ?? [])
            .map((feature) => feature.geometry?.coordinates ?? [])
            .flat(1)
            .map((ring) => ring.map(([lng, lat]) => mercatorPoint(lat, lng))),
    }));
}

function boxFor(boxes, point) {
    return boxes.find((box) => box.rings.some((ring) => ringContains(ring, point)));
}

/**
 * A few markers sit in the gutter between boxes on the reference canvas. They are
 * closer to one area than any other, so that is where they get drawn - still marked
 * approximate, but never dropped, so the counts match the Library.
 */
function nearestAnchoredBox(boxes, point) {
    let best = null;
    let bestDistance = Infinity;

    for (const box of boxes) {
        if (!box.anchor || box.rings.length === 0) continue;
        const xs = box.rings.flat().map((p) => p.x);
        const ys = box.rings.flat().map((p) => p.y);
        const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
        const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
        const distance = (cx - point.x) ** 2 + (cy - point.y) ** 2;
        if (distance < bestDistance) {
            bestDistance = distance;
            best = box;
        }
    }

    return best;
}

function toPin(location, point, area) {
    const note = toPlainText(location.description);

    return {
        id: String(location.id),
        name: location.title.trim(),
        lat: point.lat,
        lng: point.lng,
        ...(area ? { approx: true, area } : {}),
        ...(note ? { note } : {}),
    };
}

/**
 * Every entry of a layer becomes a pin.
 *
 * Overworld markers keep their projected position. Markers drawn inside an area box
 * cannot be placed exactly - that box is its own inset at its own scale - so they are
 * drawn near that area's location pin on a short spiral, flagged `approx`. Nothing is
 * hidden, it is just honest about which pins are guesses.
 */
function buildPins(locations, boxes) {
    const pins = [];
    const clusters = new Map();
    let unplaced = 0;

    for (const location of locations) {
        const mercator = mercatorPoint(Number(location.latitude), Number(location.longitude));
        const point = projectMarker(location, ARTWORK_TRANSFORM);
        const byRegion = boxes.find((candidate) => candidate.id === location.region_id);

        // the overworld box is the one that maps onto our artwork
        if ((boxFor(boxes, mercator) ?? byRegion)?.title === CONTINENT_REGION && onArtwork(point)) {
            pins.push(toPin(location, point));
            continue;
        }

        const box =
            [boxFor(boxes, mercator), byRegion].find((candidate) => candidate?.anchor) ??
            nearestAnchoredBox(boxes, mercator);

        if (!box?.anchor) {
            unplaced += 1;
            continue;
        }

        clusters.set(box.id, [...(clusters.get(box.id) ?? []), location]);
    }

    let approx = 0;
    for (const [boxId, cluster] of clusters) {
        const { anchor, title } = boxes.find((box) => box.id === boxId);
        // stable order, so a re-run keeps every pin in the same spot
        cluster.sort((left, right) => left.title.localeCompare(right.title) || left.id - right.id);

        cluster.forEach((location, index) => {
            const radius = Math.min(MAX_CLUSTER_PX, CLUSTER_STEP_PX * Math.sqrt(index + 0.5));
            const angle = index * GOLDEN_ANGLE;
            const x = clampArtwork(anchor.x + (radius * Math.cos(angle)) / 8192);
            const y = clampArtwork(anchor.y + (radius * Math.sin(angle)) / 9709);
            pins.push(toPin(location, artworkToLatLng(x, y), title));
            approx += 1;
        });
    }

    pins.sort((left, right) => left.name.localeCompare(right.name) || left.id.localeCompare(right.id));

    return { pins, approx, exact: pins.length - approx, unplaced };
}

function clampArtwork(value) {
    return Math.min(1 - ARTWORK_INSET, Math.max(ARTWORK_INSET, value));
}

/** The wiki's own picto pins, written by `pnpm pins:map` - fewer pins, but placed exactly. */
async function loadWikiPictoPins() {
    try {
        return JSON.parse(await fs.readFile(path.join(PIN_DIR, 'pictoPins.json'), 'utf8'));
    } catch {
        return [];
    }
}

/**
 * How many pickups the tracker stores per picto name.
 *
 * The Library lists a picto once per pickup ("accelerating-heal-9"), while both maps
 * know one marker per pickup under a single name. This is what keeps the atlas pinning
 * the same number of pictos the Library lists.
 */
/**
 * Wiki picto spellings that differ from the tracker's name.
 *
 * The map carries the same list in `src/features/map/pictoStatus.ts` - keep them in
 * step. Without it the wiki's "Augment Counter I" reads as a picto the engine does not
 * have, and its two pins count as two pickups of a picto the Library stores once.
 */
const PICTO_NAME_ALIASES = {
    augmentcounteri: 'augmentedcounteri',
};

/** Name matching ignores the wiki's parenthetical suffixes and punctuation. */
function pictoKey(value) {
    const key = toBaseName(value);
    return PICTO_NAME_ALIASES[key] ?? key;
}

async function loadPictoPickupCounts() {
    const file = path.join('src', 'engine', 'data', 'pictos.json');
    const counts = new Map();

    for (const picto of JSON.parse(await fs.readFile(file, 'utf8'))) {
        const key = pictoKey(picto.name);
        counts.set(key, (counts.get(key) ?? 0) + 1);
    }

    return counts;
}

/**
 * Pictos draw on both maps, because neither source is complete on its own.
 *
 * The reference map lists every pickup, but draws all of them inside an area inset, so
 * here they can only be approximated. The wiki map draws 42 of them on the same artwork
 * we use, exactly, and with a written note - so a wiki pin takes the place of one of
 * that name's reference-map markers. The result is one pin per pickup the Library
 * lists, and none of them missing.
 */
async function buildPictoPins(locations, boxes) {
    const { pins, unplaced } = buildPins(locations, boxes);
    const wiki = await loadWikiPictoPins();
    const pickups = await loadPictoPickupCounts();
    const taken = new Map();
    const final = [];

    // the wiki's exact pins come first, so they win a name's pickups over a marker.
    // Its pins keep their note; the reference map's notes restate the effect, stats and
    // level the engine card already lays out, so those stay bare markers with a position.
    const candidates = [
        ...wiki,
        ...pins.map((pin) => ({
            id: pin.id,
            name: pin.name,
            lat: pin.lat,
            lng: pin.lng,
            ...(pin.approx ? { approx: true, area: pin.area } : {}),
        })),
    ];

    for (const pin of candidates) {
        const key = pictoKey(pin.name);
        const allowance = pickups.get(key) ?? 1;
        const count = taken.get(key) ?? 0;

        if (count >= allowance) continue;

        taken.set(key, count + 1);
        final.push(pin);
    }

    final.sort(
        (left, right) => left.name.localeCompare(right.name) || left.id.localeCompare(right.id),
    );

    const exact = final.filter((pin) => !pin.approx).length;

    return { pins: final, exact, approx: final.length - exact, unplaced };
}

/** The wiki map config, cached like the MapGenie payload. */
async function loadWikiMarkers() {
    let source;
    try {
        source = await fs.readFile(WIKI_CACHE_FILE, 'utf8');
    } catch {
        process.stdout.write(`downloading ${WIKI_MAP_URL}\n`);
        const res = await fetch(WIKI_MAP_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status} from ${WIKI_MAP_URL}`);
        source = await res.text();
        await fs.mkdir(path.dirname(WIKI_CACHE_FILE), { recursive: true });
        await fs.writeFile(WIKI_CACHE_FILE, source);
    }

    let config = null;
    globalThis.window = {};
    globalThis.ValnetMap = function (_id, value) {
        config = value;
    };
    globalThis.ValnetMap.prototype.load = function () {};
    globalThis.document = {
        createElement: () => ({ set innerHTML(_value) {}, setAttribute() {} }),
        querySelector: () => ({ before() {}, remove() {} }),
    };
    eval(source);

    return config?.markers ?? [];
}

/**
 * Refits ARTWORK_TRANSFORM from the locations both maps list and reports the error,
 * so the hardcoded coefficients can be checked instead of trusted.
 */
async function verifyTransform(payload) {
    const markers = await loadWikiMarkers();
    const wiki = markers.filter((marker) => marker.layers?.includes(WIKI_LOCATIONS_UID));
    const theirs = (payload.locations ?? []).filter((l) => l.category_id === GENIE_LOCATION_CATEGORY);
    const byName = new Map();
    for (const location of theirs) {
        const key = toBaseName(location.title);
        byName.set(key, [...(byName.get(key) ?? []), location]);
    }

    const pairs = [];
    for (const marker of wiki) {
        const matches = byName.get(toBaseName(marker.popup?.title ?? marker.tooltip ?? '')) ?? [];
        if (matches.length !== 1) continue;
        const { mx, my } = toMercator(Number(matches[0].latitude), Number(matches[0].longitude));
        pairs.push({ mx, my, wx: marker.x, wy: marker.y });
    }

    if (pairs.length < 20) throw new Error(`only ${pairs.length} name-matched locations to fit on`);

    const x = fitAxis(pairs, (p) => p.mx, (p) => p.wx, 8192, 40);
    const y = fitAxis(pairs, (p) => p.my, (p) => p.wy, 9709, 40);

    let worst = 0;
    let mean = 0;
    for (const p of pairs) {
        const dx = p.wx - (ARTWORK_TRANSFORM.xScale * p.mx + ARTWORK_TRANSFORM.xOffset);
        const dy = p.wy - (ARTWORK_TRANSFORM.yScale * p.my + ARTWORK_TRANSFORM.yOffset);
        const error = Math.hypot(dx * 8192, dy * 9709);
        worst = Math.max(worst, error);
        mean += error;
    }

    process.stdout.write(
        `refit on ${pairs.length} matched locations (kept x ${x.pairs} / y ${y.pairs}):\n` +
            `  fitted     x = ${x.scale.toFixed(9)} * mx + ${x.offset.toFixed(9)}   MAE ${x.mae.toFixed(1)}px\n` +
            `  fitted     y = ${y.scale.toFixed(9)} * my + ${y.offset.toFixed(9)}   MAE ${y.mae.toFixed(1)}px\n` +
            `  hardcoded  x = ${ARTWORK_TRANSFORM.xScale} * mx + ${ARTWORK_TRANSFORM.xOffset}\n` +
            `  hardcoded  y = ${ARTWORK_TRANSFORM.yScale} * my + ${ARTWORK_TRANSFORM.yOffset}\n` +
            `  hardcoded transform over those pairs: mean ${(mean / pairs.length).toFixed(1)}px, worst ${worst.toFixed(1)}px\n`,
    );

    return pairs.length;
}

async function main() {
    const checkOnly = process.argv.includes('--check');
    const layers = await readRegistryLayers();
    const payload = await loadPayload();

    if (process.argv.includes('--verify-transform')) {
        await verifyTransform(payload);
        return;
    }

    const regionNames = new Map((payload.regions ?? []).map((region) => [region.id, region.title]));
    const regionBoxes = await buildRegionBoxes(payload);
    const byCategory = new Map();

    for (const location of payload.locations ?? []) {
        if (!byCategory.has(location.category_id)) byCategory.set(location.category_id, []);
        byCategory.get(location.category_id).push(location);
    }

    const summary = {};
    const problems = [];
    const continentPins = {};

    for (const layer of layers) {
        const categoryId = CATEGORY_BY_NAME.get(layer.mapCategory);

        if (!categoryId) {
            problems.push(`${layer.id}: mapCategory "${layer.mapCategory}" is not in the category legend`);
            continue;
        }

        const locations = byCategory.get(categoryId) ?? [];
        const engineSourced = ENGINE_SOURCED.has(layer.id);

        // Every entry gets a pin: exact on the overworld, spiral-offset inside an area.
        const { pins, exact, approx, unplaced } = engineSourced
            ? await buildPictoPins(locations, regionBoxes)
            : buildPins(locations, regionBoxes);
        if (pins.length > 0) continentPins[layer.id] = pins;

        if (engineSourced) {
            // the engine owns this layer's entries, so only its pins are ours to write
            if (!checkOnly) {
                process.stdout.write(
                    `${layer.id}: ${pins.length} pins (${exact} exact, ${approx} near their area` +
                        `${unplaced > 0 ? `, ${unplaced} unplaced` : ''})\n`,
                );
            }
            continue;
        }

        const entries = locations
            .map((location) => toEntry(location, regionNames))
            .sort((left, right) => left.name.localeCompare(right.name) || left.id - right.id);

        summary[layer.id] = {
            category: layer.mapCategory,
            group: CATEGORIES[categoryId][1],
            count: entries.length,
            pins: pins.length,
            exact,
            approx,
            ...(unplaced > 0 ? { unplaced } : {}),
        };

        if (checkOnly) continue;

        await fs.mkdir(OUT_DIR, { recursive: true });
        await fs.writeFile(path.join(OUT_DIR, `${layer.id}.json`), `${JSON.stringify(entries, null, 1)}\n`);
    }

    if (problems.length > 0) {
        for (const problem of problems) process.stderr.write(`warning: ${problem}\n`);
        process.exitCode = 1;
    }

    if (!checkOnly) {
        const index = {
            generatedFrom: 'mapgenie map 760 (the-continent), see scripts/fetch-collectables.mjs',
            layers: summary,
        };
        await fs.writeFile(path.join(OUT_DIR, 'layers.json'), `${JSON.stringify(index, null, 1)}\n`);

        // Barrel for the routes: only the server imports this, so a layer's entries
        // travel to the browser as props of that layer's page and nothing else.
        const identifiers = Object.keys(summary).map((id) => [id, toIdentifier(id)]);
        await fs.writeFile(
            path.join(OUT_DIR, 'index.generated.ts'),
            [
                '// GENERATED by scripts/fetch-collectables.mjs - do not edit by hand.',
                'import type { CollectionEntry } from "../types";',
                ...identifiers.map(([id, name]) => `import ${name} from "./${id}.json";`),
                '',
                '/** Entries per Library layer id, for the layers the reference map sources. */',
                'export const LAYER_ENTRIES: Record<string, CollectionEntry[]> = {',
                ...identifiers.map(([id, name]) => `  "${id}": ${name} as CollectionEntry[],`),
                '};',
                '',
            ].join('\n'),
        );

        // Atlas pins: only the continent markers can be placed on our artwork, and
        // only for layers that have any, so the map decides what to show from this.
        const pinIds = Object.keys(continentPins);
        await fs.mkdir(PIN_DIR, { recursive: true });
        for (const id of pinIds) {
            await fs.writeFile(
                path.join(PIN_DIR, `${id}Pins.json`),
                `${JSON.stringify(continentPins[id], null, 2)}\n`,
            );
        }

        const pinIdentifiers = pinIds.map((id) => [id, toIdentifier(id)]);
        await fs.writeFile(
            path.join(PIN_DIR, 'pins.generated.ts'),
            [
                '// GENERATED by scripts/fetch-collectables.mjs - do not edit by hand.',
                'import type { MapPin } from "../types";',
                ...pinIdentifiers.map(([id, name]) => `import ${name} from "./${id}Pins.json";`),
                '',
                '/**',
                ' * Layer pins for the atlas: overworld entries at their projected position,',
                ' * entries inside an area drawn near that area\'s location pin with `approx`,',
                ' * so the map can show every entry the Library lists.',
                ' */',
                'export const LAYER_PINS: Record<string, MapPin[]> = {',
                ...pinIdentifiers.map(([id, name]) => `  "${id}": ${name} as MapPin[],`),
                '};',
                '',
            ].join('\n'),
        );
    }

    const rows = Object.entries(summary).sort(([, left], [, right]) => right.count - left.count);
    for (const [id, info] of rows) {
        process.stdout.write(
            `${String(info.count).padStart(4)}  ${id.padEnd(20)} ${info.group} / ${info.category}  ` +
                `(${info.exact} exact, ${info.approx} approx${info.unplaced ? `, ${info.unplaced} unplaced` : ''})\n`,
        );
    }
    process.stdout.write(
        `${checkOnly ? 'checked' : 'wrote'} ${rows.length} layers, ` +
            `${rows.reduce((total, [, info]) => total + info.count, 0)} entries, ` +
            `${rows.reduce((total, [, info]) => total + info.pins, 0)} pins\n`,
    );
}

await main();

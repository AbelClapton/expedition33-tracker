// Regenerates the map pin data files under src/features/map/data from the
// Fextralife interactive map.
//
//   node scripts/fetch-map-pins.mjs
//
// The map frame loads a config blob under
//   https://static0.fextralifeimages.com/file/expedition33/<mapId>.js
// which holds every pin as a normalised x/y over the source artwork
// (Clair-Obscur-Expedition-33-v2-8192.jpg, 8192x9709). The tracker's Leaflet map
// places that same artwork so its full height maps to the world height, width
// scaled to match, hence:
//   lng = x * (8192 / 9709) * 360 - 180
//   lat = atan(sinh(pi * (1 - 2y))) * 180 / pi
// Verified against the hand-placed Anti-Stun pin (-61.51746, 25.38940): the
// extracted one lands at (-61.48076, 25.49204).

import fs from 'node:fs/promises';

const MAP_DATA_URL =
    process.argv.slice(2).find((arg) => arg.startsWith('http')) ??
    'https://static0.fextralifeimages.com/file/expedition33/vm6a399e85571e0d705eec027e.js';

const IMAGE_W = 8192;
const IMAGE_H = 9709;

// Layer uids come from the map config's layer tree; run with --layers to list them.
const LAYERS = [
    { uid: 'l6a174e88fc6943e42a81791d', label: 'Pictos', file: 'pictoPins.json', linkPictos: true },
    { uid: 'l6a174e88fc6943e42a81790e', label: 'Locations', file: 'locationPins.json', linkIcons: true },
];

// Per-location marker art from the wiki (84x84 PNGs), stored as local assets.
// Files are named after the location, not the wiki's filename (which has typos).
const ICON_DIR = 'public/images/locations';
const iconCache = new Map();
const iconNames = new Map();

function slugify(value) {
    return value
        .normalize('NFKD')
        .replace(/[\u2018\u2019']/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/** Downloads a wiki icon once per distinct URL and returns its public path. */
async function localIcon(url, label) {
    if (!url) return null;
    if (!iconCache.has(url)) {
        iconCache.set(
            url,
            (async () => {
                const ext = (/\.[a-z0-9]+$/i.exec(url.split('?')[0])?.[0] ?? '.png').toLowerCase();
                const base = slugify(label) || 'location';
                // two locations can share a name but not art, so disambiguate
                const taken = iconNames.get(base);
                const name = !taken || taken === url ? base : `${base}-${iconNames.size % 9 || 2}`;
                iconNames.set(name === base ? base : name, url);

                const path = `${ICON_DIR}/${name}${ext}`;
                try {
                    await fs.access(path);
                } catch {
                    const res = await fetch(url);
                    if (!res.ok) throw new Error(`icon HTTP ${res.status}: ${url}`);
                    await fs.mkdir(ICON_DIR, { recursive: true });
                    await fs.writeFile(path, Buffer.from(await res.arrayBuffer()));
                }
                return `/${path.replace(/^public\//, '')}`;
            })(),
        );
    }
    return iconCache.get(url);
}

function toLatLng(x, y) {
    return {
        lat: +((Math.atan(Math.sinh(Math.PI * (1 - 2 * y))) * 180) / Math.PI).toFixed(5),
        lng: +(x * (IMAGE_W / IMAGE_H) * 360 - 180).toFixed(5),
    };
}

function cleanText(html) {
    return (html ?? '')
        .replace(/<br\s*\/?>/gi, ' ')
        .replace(/<\/(li|p|ul|ol)>/gi, '. ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        // the source files are UTF-8 that was once decoded as latin1
        .replace(/â€™/g, "'")
        .replace(/â€˜/g, "'")
        .replace(/â€œ/g, '"')
        .replace(/â€\u009d/g, '"')
        .replace(/â€“/g, '-')
        .replace(/â€”/g, '-')
        .replace(/\s+/g, ' ')
        .replace(/\s+([.,;:!?])/g, '$1')
        .replace(/\.\s*\./g, '.')
        .trim();
}

function readConfig(source) {
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
    if (!config) throw new Error('No ValnetMap config found in the downloaded data.');
    return config;
}

const response = await fetch(MAP_DATA_URL);
if (!response.ok) throw new Error(`Failed to download map data: HTTP ${response.status}`);
const config = readConfig(await response.text());

if (process.argv.includes('--layers')) {
    const walk = (layers, prefix = '') => {
        for (const layer of layers ?? []) {
            if (layer.uid) console.log(`  ${layer.uid}  ${prefix}${layer.label ?? ''}`);
            if (layer.layers) walk(layer.layers, `${prefix}${layer.label ?? ''} > `);
        }
    };
    walk(config.layers);
} else {
    await generate(config);
}

async function generate(config) {
    const normalise = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, '');
    const trackerPictos = JSON.parse(await fs.readFile('src/engine/data/pictos.json', 'utf8'));
    const trackerByName = new Map();
    for (const picto of trackerPictos) {
        const key = normalise(picto.name);
        trackerByName.set(key, [...(trackerByName.get(key) ?? []), picto]);
    }

    await fs.mkdir('src/features/map/data', { recursive: true });

    for (const layer of LAYERS) {
        const pins = [];
        for (const marker of config.markers ?? []) {
            if (!marker.layers?.includes(layer.uid)) continue;

            const name = cleanText(marker.popup?.title ?? marker.tooltip);
            const note = cleanText(marker.popup?.description);
            const { lat, lng } = toLatLng(marker.x, marker.y);
            const matches = layer.linkPictos ? trackerByName.get(normalise(name)) ?? [] : [];
            const icon = layer.linkIcons ? await localIcon(marker.src, name) : null;

            pins.push({
                id: `${layer.file.replace('Pins.json', '')}-${marker.uid}`,
                name,
                lat,
                lng,
                ...(icon ? { icon } : {}),
                ...(matches.length === 1 ? { pictoId: matches[0].id, level: matches[0].level } : {}),
                ...(note ? { note } : {}),
            });
        }

        pins.sort((a, b) => a.name.localeCompare(b.name) || a.lat - b.lat);
        await fs.writeFile(`src/features/map/data/${layer.file}`, `${JSON.stringify(pins, null, 2)}\n`);

        const duplicates = pins.length - new Set(pins.map((p) => `${p.name}@${p.lat},${p.lng}`)).size;
        console.log(`wrote ${pins.length} ${layer.label} pins to src/features/map/data/${layer.file}`);
        console.log(`  with a note: ${pins.filter((p) => p.note).length}`);
        if (layer.linkPictos) console.log(`  linked to a tracker picto: ${pins.filter((p) => p.pictoId).length}`);
        if (layer.linkIcons) {
            const withIcon = pins.filter((p) => p.icon);
            const files = new Set(withIcon.map((p) => p.icon));
            console.log(`  icons: ${withIcon.length} pins -> ${files.size} files, ${iconCache.size} distinct wiki urls`);
            if (withIcon.length !== pins.length) console.log(`  pins without icon art: ${pins.length - withIcon.length}`);
        }
        if (duplicates) console.log(`  identical name+position: ${duplicates}`);
    }
}

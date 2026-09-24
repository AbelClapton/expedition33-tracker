/**
 * Fetches per-entry art and prose for the gear and picto layers.
 *
 * Sources, verified by hand before this script existed:
 * - Fextralife `/Weapons`  - one icon per weapon (thumb/<a>/<bb>/<Name>_<char>_weapon_...png)
 * - Fextralife `/Outfits`  - card grid of every outfit and haircut, art on the card
 * - Fextralife `/Items`    - card grid of the quest items and the tints
 * - IGN `All_Weapons`      - per weapon: Drop Power, Element, Scalers, Unlockable Passives, Obtained
 * - IGN outfits/haircuts   - per entry: the in-game look, "How to Get" and where it was obtained
 * - IGN `All_Pictos_...`   - per picto: level, type, lumina cost, stat bonus, obtained
 *
 * Run: pnpm collectables:media [--refresh] [--dry] [--only=<layerId>]
 * Writes `src/features/collection/data/media.generated.ts` and files under
 * `public/images/<layer>/`. Images already on disk are skipped, and a `--only` run
 * keeps the layers it did not rebuild (it used to drop them).
 */
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const CACHE = path.join(ROOT, ".cache", "media");
const IMAGES = path.join(ROOT, "public", "images");
const OUT = path.join(ROOT, "src", "features", "collection", "data", "media.generated.ts");

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131 Safari/537.36";

const FL = "https://expedition33.wiki.fextralife.com";
const IGN = "https://www.ign.com/wikis/clair-obscur-expedition-33/";
const OYSTER = "https://oyster.ignimgs.com/mediawiki/apis.ign.com/clair-obscur-expedition-33";

const args = process.argv.slice(2);
const has = (flag) => args.includes(flag);
const valueOf = (name) =>
  args.find((arg) => arg.startsWith(`${name}=`))?.split("=")[1];

const refresh = has("--refresh");
const dry = has("--dry");
const only = valueOf("--only");

/* ------------------------------------------------------------------ helpers */

/** `&#x27;` and friends turn up inside wiki file names. */
const decodeEntities = (value) =>
  value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
      String.fromCodePoint(Number.parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"');

const strip = (html) =>
  decodeEntities(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;|&rsquo;|&apos;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

const slug = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const normalise = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "");

/** MediaWiki stores files under md5(name)[0]/md5(name)[0:2]/ - no lookup needed. */
const wikiUrlForFile = (file, width) => {
  const name = decodeEntities(file).replace(/ /g, "_");
  const hash = createHash("md5").update(name).digest("hex");

  // the originals are 90KB+ PNGs; asking for a JPEG cuts that by 85%
  return `${OYSTER}/${hash[0]}/${hash.slice(0, 2)}/${encodeURIComponent(name)}?width=${width}&format=jpg&quality=80`;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const cached = async (key, url) => {
  const file = path.join(CACHE, `${key}.html`);

  if (!refresh && existsSync(file)) {
    return readFile(file, "utf8");
  }

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": UA } });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

      const html = await res.text();
      await mkdir(CACHE, { recursive: true });
      await writeFile(file, html);
      return html;
    } catch (error) {
      if (attempt === 3) throw error;
      await sleep(600 * attempt);
    }
  }
};

const download = async (url, file) => {
  if (existsSync(file)) return "kept";

  const res = await fetch(url, { headers: { "User-Agent": UA, Referer: FL } });
  if (!res.ok) throw new Error(`${res.status} for ${url}`);

  const buffer = Buffer.from(await res.arrayBuffer());
  if (buffer.byteLength < 200) throw new Error(`too small: ${url}`);

  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, buffer);
  return "saved";
};

const rows = (table) =>
  [...table.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)].map(([, row]) =>
    [...row.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g)].map(([, cell]) => cell),
  );

const tables = (html) =>
  [...html.matchAll(/<table[\s\S]*?<\/table>/g)].map(([table]) => table);

/* ------------------------------------------------------- our own entry lists */

const ITEM_LAYER_IDS = ["quest-items", "tints"];

const LAYER_ENTRIES = {};
for (const layer of ["weapons", "outfits", "hairstyles", ...ITEM_LAYER_IDS]) {
  LAYER_ENTRIES[layer] = JSON.parse(
    await readFile(
      path.join(ROOT, "src", "features", "collection", "data", `${layer}.json`),
      "utf8",
    ),
  );
}

/** Entry name without the character suffix, which the sources spell differently. */
const baseName = (name) => name.replace(/\s*\([^)]*\)\s*$/, "").trim();
const characterOf = (name) => name.match(/\(([^)]+)\)\s*$/)?.[1] ?? "";

/** "Abysseram (Gustave/Verso)" -> candidates the sources may use. */
const characterList = (name) =>
  characterOf(name)
    .split("/")
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);

/* ----------------------------------------------------------- source: icons */

const CHARACTERS = ["gustave", "lune", "maelle", "sciel", "verso", "monoco"];

/**
 * `50px-Abyseram_gustave_weapon_expedition_33_wiki_guide.png` ->
 * `{ name: "Abyseram", characters: ["gustave"] }`.
 *
 * The thumb prefix and the `_weapon` marker are what these files have in
 * common; some spell the tail out with hyphens instead of underscores.
 */
const weaponIconFile = (file) => {
  const raw = decodeURIComponent(file)
    .replace(/^\d+px-/, "")
    .replace(/\.(png|jpe?g|webp)$/i, "");

  const tokens = raw.split(/[_-](?:weapon|expedition)/i)[0].split(/[_-]/);
  const characters = [];

  while (tokens.length > 1 && CHARACTERS.includes(tokens.at(-1).toLowerCase())) {
    characters.unshift(tokens.pop().toLowerCase());
  }

  return { name: tokens.join(" "), characters };
};

/**
 * One icon per weapon, keyed twice.
 *
 * The href is the wiki's own weapon page (`/Ballaro`) and is the key that matters:
 * several Monoco weapons are illustrated with a *different* weapon's file - `Ballaro`
 * serves `Sirenaro_monoco_weapon_...` - and the files disagree with the page names in
 * other ways too (`Urnaro-monoco-weapon-...-min.png`, `Baguettaroweapons_..._70px.png`).
 * Keying on the file name alone matched 97 of 121 weapons; the href matches 120.
 *
 * The file-derived name is kept as a second key, for entries the wiki names
 * differently, and the href wins whenever both exist.
 */
const fextralifeWeaponIcons = async () => {
  const html = await cached("fextralife-weapons", `${FL}/Weapons`);

  const byFile = new Map();
  const byPage = new Map();

  for (const [, href, src] of html.matchAll(
    /<a[^>]+href="(\/[^"#?]+)"[^>]*>\s*<img[^>]+src="([^"]+)"/g,
  )) {
    const file = decodeURIComponent(src.split("/").pop() ?? "");
    if (!/weapon/i.test(file)) continue;

    const { name, characters } = weaponIconFile(file);
    const page = href.slice(1);
    const icon = {
      // the size the listing page itself requests, so the file is guaranteed to exist
      url: src,
      page: `${FL}${href}`,
      characters,
    };

    if (normalise(name)) byFile.set(normalise(name), { ...icon, name });
    if (normalise(page)) byPage.set(normalise(page), { ...icon, name: page });
  }

  const icons = new Map([...byFile, ...byPage]);

  console.log(
    `fextralife weapon icons: ${icons.size} (${byPage.size} by page name)`,
  );

  return icons;
};

/* ------------------------------------------------------- source: wiki cards */

/**
 * Keys a card name can be found under.
 *
 * The wiki words its entries the long way ("Baguette Outfit (Gustave)") and the
 * Library drops the noun ("Baguette (Gustave)"), so both spellings are indexed and
 * the character suffix - the brackets normalise away - is what separates them.
 */
const cardKeys = (name) => {
  const bare = name.replace(/\b(outfits?|haircuts?)\b/gi, " ");
  return [normalise(name), normalise(bare)].filter(Boolean);
};

/**
 * Fextralife listing pages that lay their entries out as a card grid.
 *
 * `/Outfits` (every outfit and haircut, IGN covers only the vendor sets) and
 * `/Items` (the quest items and the tints) both put each entry in an `<h4 id>` with
 * its art as the first image and the name in the id, so no cell parsing is needed.
 *
 * The `<img>` is the file the listing page itself asks for (100px, a couple of
 * 200px), and the Library draws the art at 72px, so that size is enough.
 */
const fextralifeCards = async (key, page) => {
  const html = await cached(key, `${FL}/${page}`);

  const cards = new Map();

  for (const [, id, cell] of html.matchAll(
    /<h[34] id="([^"]+)">([\s\S]*?)<\/h[34]>/g,
  )) {
    const image = cell.match(/<img[^>]+src="([^"]+)"/)?.[1];
    if (!image) continue;

    const name = decodeEntities(id).replace(/_/g, " ");
    for (const cardKey of cardKeys(name)) cards.set(cardKey, { name, image });
  }

  console.log(`fextralife ${page}: ${cards.size}`);
  return cards;
};

let outfitCards;
const fextralifeOutfitCards = async () =>
  (outfitCards ??= fextralifeCards("fextralife-outfits", "Outfits"));

let itemCards;
const fextralifeItemCards = async () =>
  (itemCards ??= fextralifeCards("fextralife-items", "Items"));

/* -------------------------------------------------------- source: IGN stats */

/** Field names the weapon tables use, whatever shape they are laid out in. */
const WEAPON_FIELDS = {
  power: ["Drop Power", "Power (Lv. 20)"],
  element: ["Element"],
  scalers: ["Attribute Scalers"],
  passives: ["Unlockable Passives"],
  obtained: ["Obtained"],
};

const isFieldLabel = (value) =>
  Object.values(WEAPON_FIELDS).flat().includes(value);

/** Vertical tables put the label beside or above its value; read whichever is there. */
const readWeaponFields = (flat) => {
  const fields = {};

  for (const [rowIndex, row] of flat.entries()) {
    for (const [cellIndex, cell] of row.entries()) {
      const field = Object.entries(WEAPON_FIELDS).find(([, names]) =>
        names.includes(cell),
      )?.[0];
      if (!field || fields[field]) continue;

      const beside = row[cellIndex + 1];
      const below = flat[rowIndex + 1]?.[cellIndex];
      const value = beside && !isFieldLabel(beside) ? beside : below;

      if (value && !isFieldLabel(value) && value !== "N/A") fields[field] = value;
    }
  }

  return fields;
};

/** The passives sit in their own `Level n | text` block under a single label. */
const readVerticalPassives = (flat) => {
  const start = flat.findIndex((row) => row[0] === "Unlockable Passives");
  if (start < 0) return [];

  const passives = [];

  for (const row of flat.slice(start + 1)) {
    const [level, text] = row;
    if (!level || !text || isFieldLabel(level)) break;

    passives.push(`${level}: ${text}`);
  }

  return passives;
};

/**
 * IGN weapon page: a page of mixed table shapes.
 *
 * Three layouts carry real data and the rest is layout noise, so each is read on
 * its own terms: `Weapon | Element | ...` rows, `Level n <Weapon>` blocks, and the
 * vertical `Name / <Weapon> / label value` tables.
 */
const ignWeapons = async () => {
  const html = await cached("ign-weapons", `${IGN}All_Weapons`);

  const weapons = new Map();

  const record = (name) => {
    const key = normalise(name);
    if (!key) return null;

    if (!weapons.has(key)) {
      weapons.set(key, { name, element: "", scalers: "", power: 0, passives: [] });
    }

    return weapons.get(key);
  };

  const applyFields = (weapon, fields, level, passiveLines) => {
    if (fields.element) weapon.element = fields.element;
    if (fields.scalers) weapon.scalers = fields.scalers;

    const power = Number((fields.power ?? "").replace(/[^0-9]/g, ""));
    if (power > weapon.power) weapon.power = power;

    // vertical tables read their passives as a block, the other shapes as a cell
    const lines = passiveLines ?? [fields.passives];

    for (const passive of lines) {
      if (!passive || passive === "N/A" || isFieldLabel(passive)) continue;

      const line = level && !passive.includes(":") ? `Lv ${level}: ${passive}` : passive;
      if (!weapon.passives.includes(line)) weapon.passives.push(line);
    }
  };

  for (const table of tables(html)) {
    const flat = rows(table).map((row) => row.map(strip));

    // horizontal: a header row naming the columns
    const headerRow = flat.findIndex((row) => row.includes("Weapon"));
    if (headerRow >= 0) {
      const columns = flat[headerRow];
      const at = (name) => columns.indexOf(name);

      for (const row of flat.slice(headerRow + 1)) {
        const weapon = record(row[at("Weapon")]);
        if (!weapon) continue;

        applyFields(weapon, {
          element: row[at("Element")],
          scalers: row[at("Attribute Scalers")],
        });
      }
      continue;
    }

    // `Level n <Weapon>` with a header row and then the values
    const levelRow = flat.findIndex((row) => /^Level\s+\d+\s+/.test(row[0] ?? ""));
    if (levelRow >= 0) {
      const level = flat[levelRow][0].match(/^Level\s+(\d+)\s+(.*)$/i);
      const values = flat[levelRow + 2];
      const header = flat[levelRow + 1] ?? [];
      const weapon = level ? record(level[2]) : null;
      if (!level || !values || !weapon) continue;

      applyFields(
        weapon,
        Object.fromEntries(
          Object.entries(WEAPON_FIELDS).map(([field, names]) => {
            const column = names.map((name) => header.indexOf(name)).find((index) => index >= 0);
            return [field, column === undefined ? "" : values[column]];
          }),
        ),
        level[1],
      );
      continue;
    }

    // vertical: the weapon name on the second row, labels below it
    if (flat[0]?.[0] === "Name" && flat[1]?.[0]) {
      const weapon = record(flat[1][0]);
      if (weapon) {
        // the page repeats some weapons, and the repeat is the sloppier copy
        const passives = weapon.passives.length ? [] : readVerticalPassives(flat);
        applyFields(weapon, readWeaponFields(flat.slice(2)), null, passives);
      }    }
  }

  console.log(`ign weapons: ${weapons.size}`);
  return weapons;
};

/** IGN outfits + haircuts page: one table per character, art in the name cell. */
const ignOutfitsAndHaircuts = async () => {
  const html = await cached(
    "ign-outfits",
    `${IGN}Outfits_and_Haircuts_Guide:_All_Locations`,
  );

  const entries = new Map();

  for (const table of tables(html)) {
    const character = strip(table.match(/All\s+(\w+)\s+Outfits and Haircuts/i)?.[1] ?? "");

    for (const row of rows(table)) {
      const name = strip(row[0] ?? "");
      if (!name || name === "Name") continue;

      // the art is lazy-loaded: the file name sits in alt, the path is an md5 of it
      const file = row[0]?.match(/<img[^>]+alt="([^"]+\.(?:png|jpe?g|webp))"/i)?.[1];
      if (!file) continue;

      // "Baguette Outfit (Gustave)" and "Baguette (Gustave)" are the same entry
      const key = normalise(name.replace(/\b(outfit|haircut)s?\b/gi, " "));

      entries.set(key, {
        name,
        character,
        how: strip(row[1] ?? ""),
        obtained: strip(row[2] ?? ""),
        // card-sized: the art is shown at ~80px, so 240px covers hi-dpi without the weight
        image: wikiUrlForFile(file, 240),
      });
    }
  }

  console.log(`ign outfits + haircuts: ${entries.size}`);
  return entries;
};

/* ------------------------------------------------------------ name matching */

/** Levenshtein distance, for the handful of typos between wiki and entry names. */
const distance = (a, b) => {
  const rowsOf = a.length + 1;
  const cols = b.length + 1;
  let previous = Array.from({ length: cols }, (_, index) => index);

  for (let row = 1; row < rowsOf; row += 1) {
    const current = [row];
    for (let col = 1; col < cols; col += 1) {
      current[col] = Math.min(
        previous[col] + 1,
        current[col - 1] + 1,
        previous[col - 1] + (a[row - 1] === b[col - 1] ? 0 : 1),
      );
    }
    previous = current;
  }

  return previous[cols - 1];
};

/**
 * Match our entries to a source index by normalised name, falling back to the
 * nearest name within an edit distance of 2 (the wikis misspell a few weapons).
 *
 * Exact matches are deliberately shared: the sources key a weapon once while the
 * Library keys it per wielder. The `taken` guard only covers fuzzy matches.
 */
const matchIndex = (entries, index, labelFor) => {
  const keys = [...index.keys()];
  const taken = new Set();
  const matches = new Map();
  const unmatched = [];

  for (const entry of entries) {
    const keysOf = [
      normalise(baseName(entry.name)),
      normalise(entry.name),
      ...characterList(entry.name).map((character) =>
        normalise(`${baseName(entry.name)}${character}`),
      ),
    ];

    const exact = keysOf.find((key) => index.has(key));
    if (exact) {
      matches.set(entry.id, index.get(exact));
      continue;
    }

    let best = null;
    for (const key of keys) {
      if (taken.has(key)) continue;

      const score = Math.min(
        ...keysOf.map((candidate) => distance(candidate, key)),
      );
      if (score <= 2 && (!best || score < best.score)) best = { key, score };
    }

    if (best) {
      matches.set(entry.id, index.get(best.key));
      taken.add(best.key);
      continue;
    }

    unmatched.push(labelFor(entry));
  }

  console.log(
    `  matched ${matches.size}/${entries.length}${
      unmatched.length ? `, unmatched: ${unmatched.slice(0, 8).join(", ")}${unmatched.length > 8 ? ` (+${unmatched.length - 8})` : ""}` : ""
    }`,
  );

  return matches;
};

/* -------------------------------------------------------------------- main */

const media = {};

const put = (layerId, entryId, value) => {
  media[`${layerId}:${entryId}`] = {
    ...(media[`${layerId}:${entryId}`] ?? {}),
    ...value,
  };
};

/** A file name per entry, so a re-run reuses what is already on disk. */
const fileNameFor = (layerId, entry) =>
  `${entry.id}-${slug(entry.name).slice(0, 48)}`;

/**
 * A thumb URL and its fallbacks.
 *
 * Wiki thumbs are rendered on demand, so a wider size 404s until someone asks
 * for it: try the bigger one, then the size the listing page already uses, then
 * the untouched original.
 */
const thumbCandidates = (url) => {
  const thumb = url.match(/^(.*)\/thumb\/(.+?)\/\d+px-(.+)$/);
  if (!thumb) return [url];

  const [, host, path, file] = thumb;
  return [
    `${host}/thumb/${path}/100px-${file}`,
    `${host}/thumb/${path}/50px-${file}`,
    `${host}/${path}/${file}`,
    `${host}/${path}`,
  ];
};

const downloadFor = async (layerId, entry, url, suffix = "") => {
  const requested = new URL(url).searchParams.get("format");
  const urlPath = new URL(url).pathname;
  const extension = (
    requested ?? urlPath.match(/\.(png|jpe?g|webp|gif)$/i)?.[1] ?? "png"
  ).toLowerCase();
  const file = path.join(
    IMAGES,
    layerId,
    `${fileNameFor(layerId, entry)}${suffix}.${extension}`,
  );

  if (dry) return `/images/${layerId}/${path.basename(file)}`;

  for (const candidate of thumbCandidates(url)) {
    try {
      await download(candidate, file);
      return `/images/${layerId}/${path.basename(file)}`;
    } catch {
      // try the next size
    }
  }

  console.warn(`  ! ${layerId} ${entry.name}: no art at ${url}`);
  return null;
};

/* ------------------------------------------------------------------- weapons */

const buildWeapons = async () => {
  const layerId = "weapons";
  const entries = LAYER_ENTRIES.weapons;

  const icons = await fextralifeWeaponIcons();
  const stats = await ignWeapons();

  const iconMatches = matchIndex(entries, icons, (entry) => entry.name);
  const statMatches = matchIndex(entries, stats, (entry) => entry.name);

  for (const entry of entries) {
    const icon = iconMatches.get(entry.id);
    const stat = statMatches.get(entry.id);

    const image = icon ? await downloadFor(layerId, entry, icon.url, "-icon") : null;

    const sections = [
      stat?.scalers && { title: "Attribute scalers", body: stat.scalers },
      stat?.passives.length && {
        title: "Unlockable passives",
        body: stat.passives.join(" · "),
      },
      (entry.description || entry.region) && {
        title: "Where to find it",
        body: [entry.description, entry.region && `Region: ${entry.region}`]
          .filter(Boolean)
          .join(" · "),
      },
    ].filter(Boolean);

    if (!image && !sections.length) continue;

    put(layerId, entry.id, {
      ...(image ? { image } : {}),
      meta: [stat?.element, ...characterList(entry.name)].filter(Boolean),
      stats: stat?.power
        ? [{ label: "Drop Power", value: String(stat.power) }]
        : [],
      sections,
    });
  }
};

/* ---------------------------------------------------- outfits and hairstyles */

const buildGear = async (layerId) => {
  const entries = LAYER_ENTRIES[layerId];
  const source = await ignOutfitsAndHaircuts();

  const matches = matchIndex(entries, source, (entry) => entry.name);

  // IGN has the in-game look but never listed every set; the wiki page fills those
  const fallback = matchIndex(
    entries,
    await fextralifeOutfitCards(),
    (entry) => entry.name,
  );

  for (const entry of entries) {
    const found = matches.get(entry.id) ?? fallback.get(entry.id);
    if (!found) continue;

    const image = await downloadFor(layerId, entry, found.image, "-art");

    put(layerId, entry.id, {
      ...(image ? { image } : {}),
      meta: [characterOf(entry.name), layerId === "outfits" ? "Outfit" : "Haircut"].filter(
        Boolean,
      ),
      sections: [
        found.how && { title: "How to get it", body: found.how },
        (entry.description || entry.region) && {
          title: "Where to find it",
          body: [entry.description, entry.region && `Region: ${entry.region}`]
            .filter(Boolean)
            .join(" · "),
        },
      ].filter(Boolean),
    });
  }
};

/* --------------------------------------------------- quest items and tints */

/** Names the wiki's item cards spell differently from our own data. */
const ITEM_NAME_ALIASES = {
  "Glowing Rock Crystal I": "Rock Crystal",
  "Glowing Rock Crystal II": "Rock Crystal",
  "Glowing Rock Crystal III": "Rock Crystal",
};

/** The wiki numbers its repeats, our data keys them by nothing but the name. */
const ITEM_NAME_SEQUENCES = {
  "Piece of Cake": ["Piece of Cake 1", "Piece of Cake 2", "Piece of Cake 3"],
};

/** Our entries, renamed to what the wiki calls them. */
const itemSourceEntries = (entries) => {
  const seen = new Map();

  return entries.map((entry) => {
    const alias = ITEM_NAME_ALIASES[entry.name];
    if (alias) return { ...entry, name: alias };

    const sequence = ITEM_NAME_SEQUENCES[entry.name];
    if (!sequence) return entry;

    const index = seen.get(entry.name) ?? 0;
    seen.set(entry.name, index + 1);
    return { ...entry, name: sequence[Math.min(index, sequence.length - 1)] };
  });
};

/** Quest items and tints, both off the wiki's one `Items` page. */
const buildItems = async (layerId) => {
  const entries = LAYER_ENTRIES[layerId];
  const cards = await fextralifeItemCards();

  const matches = matchIndex(
    itemSourceEntries(entries),
    cards,
    (entry) => entry.name,
  );

  for (const entry of entries) {
    const found = matches.get(entry.id);
    if (!found) continue;

    const image = await downloadFor(layerId, entry, found.image, "-art");
    if (image) put(layerId, entry.id, { image });
  }
};

/* ---------------------------------------------------------------------- main */

console.log(
  `fetching entry media${dry ? " (dry)" : ""}${refresh ? " (refresh)" : ""}`,
);

if (!only || only === "weapons") await buildWeapons();
if (!only || only === "outfits") await buildGear("outfits");
if (!only || only === "hairstyles") await buildGear("hairstyles");
for (const layerId of ITEM_LAYER_IDS) {
  if (!only || only === layerId) await buildItems(layerId);
}

/**
 * What the last run wrote, so a `--only` run adds to the file instead of replacing
 * it - the layers it skipped are not rebuilt, and dropping them would silently strip
 * their art from the Library.
 */
const previousMedia = async () => {
  if (!existsSync(OUT)) return {};

  const text = await readFile(OUT, "utf8");
  const start = text.indexOf("= ", text.indexOf("ENTRY_MEDIA"));

  try {
    return JSON.parse(text.slice(start + 2).trim().replace(/;$/, ""));
  } catch {
    return {};
  }
};

const sorted = Object.fromEntries(
  Object.entries(only ? { ...(await previousMedia()), ...media } : media).sort(
    ([a], [b]) => a.localeCompare(b),
  ),
);

const banner = `/**
 * Per-entry media, written by scripts/fetch-entry-media.mjs. Do not edit by hand.
 *
 * Keyed by \`<layerId>:<entryId>\`, the same key the Quarry and the found sets use.
 * Images live under \`public/images/<layer>/\`.
 */
export interface EntryMedia {
  /** The entry's own art, when one exists. */
  image?: string;
  /** Short facts for the card's chip row. */
  meta?: string[];
  /** Labelled values for the card's stat grid. */
  stats?: Array<{ label: string; value: string }>;
  /** Prose blocks: how to get it, where it was obtained. */
  sections?: Array<{ title: string; body: string }>;
}

export const ENTRY_MEDIA: Record<string, EntryMedia> = `;

if (!dry) {
  await writeFile(OUT, `${banner}${JSON.stringify(sorted, null, 2)};\n`);
  console.log(`wrote ${Object.keys(sorted).length} entries to ${path.relative(ROOT, OUT)}`);
} else {
  console.log(JSON.stringify(sorted, null, 1).slice(0, 2000));
}

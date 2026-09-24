# Map markers — TODO

Checklist of every marker type on the reference interactive map, so we can grow the
tracker's map beyond the two layers it ships today.

**Source:** <https://www.ign.com/maps/clair-obscur-expedition-33/the-continent>
**Snapshot:** 2026-09-24 — 2,815 markers across 33 categories (Complete 0 / Incomplete 2,815).

IGN's map for this game is MapGenie under the hood — it pulls tiles from
`tiles.mapgenie.io/games/clair-obscur-expedition-33/the-continent/default-v10/{z}/{x}/{y}.jpg`
and its icon sprite from `cdn.mapgenie.io/images/games/clair-obscur-expedition-33/markers@2x.png`
(36 sprite cells, indexed by `markers.json?v=11`). The 2,815 count matches MapGenie map id 760
one-for-one, so **one payload covers every category**: `mapgenie.io/api/v1/maps/760/data`
(category ids + title/description/region per marker; the category _names_ come from the map's own
legend, see `scripts/fetch-collectables.mjs`).

Fextralife only exposes 12 layers, so the wiki is the fallback (better prose, fewer types),
not the primary source for this work.

## Done

- [x] **Pictos** — 252 · wiki layer + `pictoPins.json`, `foundKind: "picto"`, links to `pictos.json` (251 entries)
- [x] **Location** — 74 · wiki layer + `locationPins.json` (69) with per-location art

## Collectables — in the Library

`pnpm collectables:fetch` writes these to `src/features/collection/data/<layer>.json` and each one
renders at `/collections/<layer>`. Counts below match the reference map exactly.

- [x] **Colour of Lumina** — 236 · `/collections/lumina` · no engine data: `luminas.json` is the _passive_ library (210 rules), 1:1 with the 210 distinct picto names via `pictos[].luminaId` — it holds no pickup locations
- [x] **Chroma Catalyst** — 156 · `/collections/chroma-catalysts`
- [x] **Chroma** — 150 · `/collections/chroma`
- [x] **Weapon** — 121 · `/collections/weapons`
- [x] **Haircut** — 105 · `/collections/hairstyles`
- [x] **Outfit** — 70 · `/collections/outfits`
- [x] **Journal Entry** — 49 · `/collections/journal-entries`
- [x] **Tint** — 37 · `/collections/tints`
- [x] **Music Record** — 34 · `/collections/music-records`
- [x] **Recoat** — 21 · `/collections/recoat`
- [x] **Quest Item** — 21 · `/collections/quest-items`
- [x] **Paint Cage** — 20 · `/collections/paint-cages`
- [x] **Underwater Treasure** — 12 · `/collections/underwater-treasure`
- [x] **Lost Gestral** — 9 · `/collections/lost-gestrals`
- [ ] **Miscellaneous** — 1 · not worth a layer of its own yet

## On the atlas now

The wiki map draws the continent, so that is what our atlas can hold: `scripts/fetch-collectables.mjs`
projects the reference map's `Continent` region onto our artwork (`ARTWORK_TRANSFORM`, per-axis
scale+offset) and writes `src/features/map/data/<layer>Pins.json` for each layer that has any. Those
layers appear in the map's LAYERS panel, grouped, hidden by default - except Locations and Pictos, which
are on to begin with. Pictos is the one layer whose pins come from both maps (see below).

**Every entry is on the map.** Overworld markers are exact; markers drawn inside an area box are placed
near that area's wiki location pin on a golden-angle spiral and flagged `approx` (50% opacity, "Approximate
· <area>" in the card). The sidebar's **Area entries** switch (default on) hides that class wholesale.

Pins per layer: pictos 251 (75 exact - the wiki's own pins plus the reference markers that fall in the
overworld box), lumina 236 (68 exact), chroma-catalysts 156 (13), chroma 150 (20), weapons 121 (32),
hairstyles 105 (66), outfits 70 (30), journal-entries 49 (20), tints 37 (2), music-records 34 (20),
recoat 21 (2), quest-items 21 (0), paint-cages 20 (0), underwater-treasure 12 (12), lost-gestrals 9 (9).
1,292 pins for the Library's 1,292 entries, nothing dropped, so the map's counts match it exactly.

Which box a marker is in comes from point-in-polygon tests against the region polygons rather than from its
`region_id`: several hundred markers are tagged `Continent` yet drawn in an area box, and a few dozen sit in
the gutters between boxes (those take the nearest anchored box).

Accuracy, measured against the wiki's own markers rather than the ones used to fit:

- 48 name-matched locations give a per-axis fit with ~13 px MAE on the 8192x9709 artwork; a full affine
  is no better (cross terms ~0.3%), so the residual is hand-placement slop on the wiki's side.
- Held-out check on the 42 wiki Pictos pins (never used in the fit): 33 compare against a same-name
  continent marker, median 45 px, 24 of 33 within 100 px, best matches 6-17 px. The four >400 px cases are
  pictos with several pickups, where the nearest same-name marker is simply a different pickup.
- `node scripts/fetch-collectables.mjs --verify-transform` refits and prints both coefficient sets, so the
  hardcoded transform can be re-checked instead of trusted.

## Still to do

- **Exact positions inside areas.** The reference canvas draws each area as its own inset at its own scale,
  so those 747 pins are approximate by construction - they say which area an entry is in, not where. A
  per-area local fit would need anchor points inside each area; a second basemap on its tiles (they
  hotlink: 200, image/jpeg) would place all 2,815 exactly.
- **Pictos merged (2026-09-24).** The layer is no longer the wiki's 42 pins: `buildPictoPins` keeps those
  (exact, with their notes) and adds the reference map's markers for the rest, capped per name at the number
  of pickups the engine stores - 251 pins, so the atlas total is 1,292 and matches the Library. What is left
  is the same inset problem as below: 176 of the 251 are placed near their area.
- **Layer prose.** MapGenie's notes are short and location-oriented; the wiki's per-layer prose (and the
  engine's picto effects) are better where they exist. `scripts/fetch-entry-media.mjs` covers this for the
  gear layers (per-entry art + IGN's "How to get it"); the layers with no art source yet - tints, recoat,
  music records, journal entries, quest items, paint cages, underwater treasure, lost gestrals - still show
  only the reference map's note.
- **Media gaps, by source.** Weapon icons are complete (121/121) now that the wiki page *names* are the
  match key; weapon stat blocks are 103/121 (IGN's tables miss the same ~18), outfits 68/70 and hairstyles
  89/105 (no Anniversary haircuts or Renoir outfits in IGN's guide). Per-picto art does not exist on either
  wiki, so pictos keep the 11 bundled stand-ins.

## Atlas-only categories (not collectables)

These describe the world rather than something you collect. They could use the same approximate treatment,
but nothing in the Library asks for them yet.

- [ ] **Enemy** — 315 · wiki layer
- [ ] **Optional Boss** — 97 · wiki rolls this into one "Bosses" layer
- [ ] **Story Boss** — 18
- [ ] **World Boss** — 15

### World / navigation

Thin value per pin, huge pin counts — probably need clustering or off-by-default layers.

- [ ] **Grapple** — 359
- [ ] **Character** — 158
- [ ] **Rope** — 96
- [ ] **Rest Point** — 86
- [ ] **Area** — 77
- [ ] **Point of Interest** — 70
- [ ] **Paint Cage Lock** — 60
- [ ] **Merchant** — 45 · wiki layer
- [ ] **Paint Spike** — 26
- [ ] **Side Quest** — 14
- [ ] **Shortcut** — 7
- [ ] **Interactable** — 4

## Sources checked

**IGN map (= MapGenie map 760)** — the source of the Library layers. One caveat found while
trying to place its markers on our atlas: its canvas is a **mosaic**. The 24 `regions` are
non-overlapping inset boxes, not one continuous world — `Continent` (616 markers) is the overworld,
and the other 23 (Spring Meadows 86, Sirene 133, Inside the Monolith 208, Verso's Drafts 208, …) are
per-area detail boxes drawn beside it, each at its own scale. So there is **no global transform** from
their coordinates to our Fextralife artwork: only the `Continent` region shares our geographic space,
and even that fits only approximately (48 name-matched locations against our wiki pins give
scale+offset with ~13 px MAE per axis on the 8192×9709 artwork, but a full affine is no better, so the
residual is pin-placement slop on both sides, not projection error).

Coverage of our 14 layers inside that shared region is thin, because most collectibles sit in the inset
areas: lost-gestrals 9/9, underwater-treasure 12/12, hairstyles 66/105, music-records 20/34,
outfits 30/70, lumina 68/236, weapons 32/121, chroma 20/150, chroma-catalysts 13/156,
journal-entries 20/49, tints 2/37, recoat 2/21, quest-items 0/21, paint-cages 0/20.

Their tiles **do** hotlink (`tiles.mapgenie.io/games/clair-obscur-expedition-33/the-continent/default-v10/{z}/{x}/{y}.jpg`
returned 200 / 43 KB JPEG with a browser UA), so a second basemap on their canvas would place all
2,815 markers exactly — that is the only route to a complete atlas, at the cost of another
third-party dependency.

**Fextralife wiki map** (`expedition33.wiki.fextralife.com/Interactive_Map`) — 374 markers in 12 leaf
layers, and it is the artwork our atlas already renders, so its coordinates need no transform. But it
is a worse item database: its collectable layers are not per-item (`Enemies` has 37 markers under
1 distinct name, `Tints (Materials)` 73 under 5, `Chroma` 11 under 2), and where it does name items it
is far thinner than MapGenie (Weapons 46 markers/26 names vs 121/117, Expedition Journals 7 vs 49,
Music Records 5 vs 34). Verdict: not a data source; keep it as the atlas artwork and as prose for the
handful of layers it covers.

## Not a category but present in the sprite

Reserved sprite cells with no filter row on the map — ignore unless we want them:
`easter_egg`, `primary_quest`, `secondary_quest`.

## Progress tracking

The map's built-in Complete/Incomplete toggle is per-marker. Our own found / not-found control covers
every layer the collection can mark, driven by `MapLayer.foundKind`:

- `picto` — the pin's _name_ is matched against engine picto ids (`src/features/map/pictoStatus.ts`),
  because a picto pin maps to one or more engine entries.
- `entry` — the pin's own `id` is one of the library entries, so it is looked up directly in
  `collection-found-<layerId>`. That is how all 12 collectable layers work, and why the fetch script keeps
  the marker id as the pin id.
- `none` — Locations, which are never hidden by progress.

A new category therefore only needs a stable id per pin plus a `localStorage` list, mirroring the Library.

## Implementation notes

- Every collectable category below is **already registered as a Library layer** in
  `src/features/collection/collectionLayers.ts` and served at `/collections/<id>`: `pictos`, `lumina`,
  `chroma`, `chroma-catalysts`, `recoat`, `weapons`, `outfits`, `hairstyles`, `tints`, `journal-entries`,
  `music-records`, `quest-items`, `paint-cages`, `underwater-treasure`, `lost-gestrals`. Filling one in is
  a data job plus flipping its `available` flag - the route, sidebar row and pending body already exist.
- The remaining categories on this list are atlas-only (Area, Location, Point of Interest, Rest Point,
  Shortcut, Enemy, the three boss types, Character, Grapple, Rope, Paint Cage Lock, Paint Spike, Interactable,
  Merchant, Side Quest, Miscellaneous) - they describe the world rather than something you collect, so they
  belong to `MAP_LAYERS` in `src/features/map/GameMap.tsx`, not to the Library.
- A layer is one entry in `MAP_LAYERS` (`src/features/map/GameMap.tsx`) plus a pins JSON in
  `src/features/map/data/`. Layers build their own `L.layerGroup`, panel row, swatch and
  search text — no other wiring needed.
- Pin art: the MapGenie sprite has one 33x44 cell per category (`markers.json?v=11`), so
  `iconFor` can crop it instead of downloading 84x84 wiki art per pin.
- Marker coordinates in the MapGenie payload are normalised 0..1 over the same artwork we
  already transform (`lng = x * (8192/9709) * 360 - 180`, `lat = atan(sinh(pi*(1-2y)))`),
  so pins will land on our existing tiles without re-deriving geometry.
- Check the map's terms before shipping: MapGenie's ToS forbids reverse engineering and
  scripted loading of their assets (same caveat already noted for GameTrek). Derived
  coordinates + our own wiki art stays on safer ground than hotlinking their sprite.

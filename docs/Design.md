---
name: Chroma Expedition
colors:
  surface: "#111316"
  surface-dim: "#111316"
  surface-bright: "#37393d"
  surface-container-lowest: "#0c0e11"
  surface-container-low: "#1a1c1f"
  surface-container: "#1e2023"
  surface-container-high: "#282a2d"
  surface-container-highest: "#333538"
  on-surface: "#e2e2e6"
  on-surface-variant: "#d0c5af"
  inverse-surface: "#e2e2e6"
  inverse-on-surface: "#2f3034"
  outline: "#99907c"
  outline-variant: "#4d4635"
  surface-tint: "#e9c349"
  primary: "#f2ca50"
  on-primary: "#3c2f00"
  primary-container: "#d4af37"
  on-primary-container: "#554300"
  inverse-primary: "#735c00"
  secondary: "#59dad1"
  on-secondary: "#003734"
  secondary-container: "#00a8a0"
  on-secondary-container: "#003532"
  tertiary: "#ffbfb4"
  on-tertiary: "#690000"
  tertiary-container: "#ff9686"
  on-tertiary-container: "#8f0402"
  error: "#ffb4ab"
  on-error: "#690005"
  error-container: "#93000a"
  on-error-container: "#ffdad6"
  primary-fixed: "#ffe088"
  primary-fixed-dim: "#e9c349"
  on-primary-fixed: "#241a00"
  on-primary-fixed-variant: "#574500"
  secondary-fixed: "#79f6ed"
  secondary-fixed-dim: "#59dad1"
  on-secondary-fixed: "#00201e"
  on-secondary-fixed-variant: "#00504c"
  tertiary-fixed: "#ffdad4"
  tertiary-fixed-dim: "#ffb4a8"
  on-tertiary-fixed: "#410000"
  on-tertiary-fixed-variant: "#920703"
  background: "#111316"
  on-background: "#e2e2e6"
  surface-variant: "#333538"
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: "700"
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: "700"
    lineHeight: 40px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: "600"
    lineHeight: 32px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: "400"
    lineHeight: 28px
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: "400"
    lineHeight: 20px
  label-caps:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: "500"
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-padding: 24px
  gutter: 16px
  edge-margin: 32px
---

## Current Implemented State (2026-06-15)

> The vocabulary below (surfaces, the chamfer, the checkbox-as-only-toggle) is the **current** shape
> language. Where the prose further down still reads as Stitch-era spec (pills, 4px corners, switches),
> the sections describing implemented state win.

This section reflects current shipped UI, including Stitch-aligned collection work.

### Reusable Layout Components

- Shared top nav lives in src/components/layout/TrackerTopNav.tsx. It is the only global navigation
  (Library / Canvas / Atlas); the placeholder Armory + Chronicle entries were dropped.
- Shared side nav lives in src/components/layout/TrackerSideNav.tsx. It is a **frame with a slot**, not a nav:
  global routing moved to the top bar, so each screen passes its own list via `TrackerShell`'s `sidebar` prop.
  Omit the prop and the shell renders no sidebar and no left offset.
- Shared shell wrapper (background, offsets, nav composition) lives in src/components/layout/TrackerShell.tsx.
- Shared mobile bottom nav lives in src/components/layout/TrackerMobileBottomNav.tsx.
- Collection page now consumes these shared layout components instead of feature-local nav copies.

### Collections Layers

- The Library is a set of **collectible layers**, one per thing you collect in the game, declared once in
  `src/features/collection/collectionLayers.ts` (`COLLECTION_LAYERS`: id, label, group, icon, reference map
  category, expected marker count, available flag, blurb). Adding a layer there is what makes it reachable.
- Routes: `/collections` serves the default layer (Pictos), `/collections/<layer>` serves any other.
  `src/app/collections/[layer]/page.tsx` prerenders all of them (`generateStaticParams` + `dynamicParams = false`),
  so the static export ships one HTML file per layer and unknown slugs 404.
- The sidebar (`CollectionLayerNav`) groups the layers as Pictos & Lumina / Gear / Records / Curiosities, with
  live progress for layers that have data, a Quarry mark (target glyph + count) for layers with something in
  the Quarry, and "N markers · coming soon" for the rest. `CollectionLayerTabs` is
  the same list as a horizontal strip below `md`, where the sidebar is hidden.
- `CollectionLayerPending` is the body of a registered-but-empty layer: it names the reference map category and
  its marker count so the data pass knows what it is filling in. Deliberately not a spinner.
- `available: false` means no data yet; `expectedMarkers` is the reference map's count and is never shown as progress.

#### Layer data

- `scripts/fetch-collectables.mjs` (`pnpm collectables:fetch`) writes one file per layer into
  `src/features/collection/data/`, plus `layers.json` (per-layer totals) and `index.generated.ts` (a barrel).
  It parses the registry for `{ id, mapCategory }`, so a layer whose category is missing from its legend
  table fails the run instead of silently writing nothing. `--check` reports counts without writing.
- The payload is downloaded once to `.cache/` (gitignored); the script's category names come from the
  reference map's own legend, and every generated count was checked against it.
- Entries are `{ id, name, category, region, description, lat, lng }`; the markdown in `description` is
  flattened to prose (links become their label) and `media[]` images are deliberately not carried over.
- Only the _server_ route imports the barrel, so a layer's entries reach the browser as props of that
  layer's page — the pictos page does not pay for the other 14 layers.
- Bodies: pictos keeps its card grid; a layer with entries renders `CollectionEntryList` (search, All/Found/
  Not found, an optional **character** row, per-row found toggle, Quarry, region tag); a layer without
  entries renders `CollectionLayerPending`.
- The character filter reads the wielder out of the entry name - `Abysseram (Gustave/Verso)`,
  `Baguette (Maelle)` - because that suffix is the only character data the reference map gives us
  (`src/features/collection/characters.ts`, canonical order Gustave..Monoco). It renders only when a layer
  spans more than one character, so weapons/outfits/hairstyles get it and journal entries/tints do not.
- A row is: **art (72px), then the entry, then the actions at the end** - region badge above a **Found
  checkbox with its label**, then the Track chip. The badge itself is the map link
  (`/map?pin=<layerId>:<entryId>`), which is how the atlas shows one entry on its own. The picto cards have
  no region to hang that off, so they carry a small **Map** chip after the Found control in both views - it
  links the same way, with the card's engine picto id.
- Progress is per layer, in `collection-found-<layerId>` (never rename - it holds player progress).
  `useFoundEntries` re-reads when the layer changes, because `/collections/<layer>` reuses the same
  component from one layer to the next; the sidebar gets live counts for the layer on screen and totals
  for the others.
- Reading and writing those keys goes through `src/hooks/localStorageStore.ts`: one subscribable store per
  key, handed to components by `useLocalStorage` (and `useQuarry`). Two rules live in that file because
  both have bitten this repo:
  - **never read storage during the first render.** A `useState` initialiser that calls `getItem` makes the
    client's first render disagree with the server's HTML, which React reports as a hydration mismatch and
    answers by throwing the tree away; the store reads lazily after mount and tells React what the server
    rendered with, so hydration matches and the value arrives one render later.
  - **never keep one key in per-instance state.** Where a toggle appears hundreds of times on a page (251
    picto cards, every row, every map card), the second click would rewrite the key from a stale snapshot
    and drop the first entry.
- The fallback for an empty key must be a module-level constant (e.g. `EMPTY_IDS`), because the store also
  uses it as the server snapshot and `useSyncExternalStore` compares snapshots by reference.
- **A tick anywhere moves every view.** `setFoundEntry(layerId, id, found)` and `setPictosFound(ids, found)`
  write through those same stores for callers outside React (the atlas' pin cards, whose markup is a string),
  and `useFoundEntrySets` subscribes to the per-layer stores instead of listening for `storage` events - so a
  mark made on the map moves the Library rows _and_ the map's own counters and filter, without a reload.
- `lat`/`lng` are MapGenie mercator degrees, _not_ this tracker's artwork space. The atlas gets them
  through `ARTWORK_TRANSFORM` in the fetch script instead - see Atlas Layers below.

#### Entry media

- `scripts/fetch-entry-media.mjs` (`pnpm collectables:media`) adds the art and prose a card needs:
  per-weapon icons (Fextralife), per-weapon Drop Power / Element / Attribute Scalers / passives (IGN
  `All_Weapons`), and per-outfit + per-haircut art with "How to get it" (IGN's outfits guide).
- Output is `media.generated.ts` - `ENTRY_MEDIA['<layerId>:<entryId>'] = { image, meta, stats, sections }`,
  the same key shape the Quarry and the found sets use - plus files under `public/images/<layer>/`
  (~254 images, ~2.5MB; IGN art is requested as `?width=240&format=jpg` because the PNGs are 90KB+ each).
- The script is idempotent: pages are cached in `.cache/media/`, images already on disk are kept, `--dry`
  parses without downloading, `--only=<layer>` runs one layer. Names are matched by normalised name with
  a Levenshtein fallback of 2, because the wikis misspell a few weapons (`Abysseram` vs `Abyseram`).
- Weapon icons are keyed on the **href** (the wiki's own weapon page), not the file name: several Monoco
  weapons are illustrated with a _different_ weapon's file (`Ballaro` serves `Sirenaro_monoco_weapon_...`),
  and the files disagree with the page names in other ways (`Urnaro-monoco-weapon-...-min.png`,
  `Baguettaroweapons_..._70px.png`). Keying on the file name matched 97 of 121 weapons, the href matches
  120 and the fuzzy pass catches the last one. Widest thumb first, then the 50px one the listing page
  itself uses, then the original file - the wider sizes only exist for some files.
- Coverage: weapons **121/121 icons** and 103/121 stat blocks, outfits 68/70, hairstyles 89/105. The icon
  count is the href's doing (see below); the remaining gaps are real - IGN's guide has no Anniversary
  haircuts or Renoir outfits, and its picto list only carries ~29 of the 251 pictos, so pictos are
  deliberately left out of this pass and keep the engine's own stats, lumina effect and pickup prose.
- Cards use it in both directions: `GameMap`'s `entryDetailsFor(layerId)` turns a media record into
  `CardDetails` for a pin, and `CollectionEntryList` shows the same art, chips, stat line and prose per row.

#### The Quarry

- The saved selection is the **Quarry** - not "wishlist": it is what the player is still out to get, and
  it matches the site's vocabulary (Library / Archive / Atlas / Canvas / Recovered / Seekers). The UI and
  the code call it **Track** (`useTracking`, `toggleTracked`, `trackedKeyFor`, `data-tracked`).
- `src/hooks/useTracking.ts` is one module-level store behind `useSyncExternalStore`, keyed
  `collection-quarry`, with values `<layerId>:<entryId>`. It has to be shared: a toggle sits on every picto
  card (251), every list row and every map card, and per-instance state would let the second click rewrite
  storage from a stale snapshot and drop the first entry.
- A wiki picto pin borrows the engine ids behind its name (`pictoPinTrackedKeys`) so the map and the Library
  write the same key - the same trick `foundKind: "picto"` uses for found state.
- **A collected entry cannot be tracked.** Enforced at the store, not at the button:
  `toggleTrackedKey` refuses to *add* a key whose entry is found (`entryIsFound`, reading the layer's found
  key from `src/hooks/foundKeys.ts`), every found writer calls `untrackKeys` for the entries it just
  collected, and `useTracking` reconciles the stored list once per tab so a pair saved before this rule is
  dropped on the next load. Removing stays open, so a stale pair can always be cleared. In the UI the Track
  control is `disabled` with a "… is already collected" title wherever the entry is found - picto cards, list
  rows and the atlas' cards - and the atlas renders it without its `data-tracked` attribute, so the delegated
  card handler cannot reach it even if the disabled attribute were removed.
- `src/hooks/foundKeys.ts` is the leaf module holding the per-layer found keys: the tracking rules read it,
  and the tracking module cannot import the found hooks without a cycle.
- The map's Track filter only re-evaluates layer groups while it is the active filter (`NO_TRACK_FILTER`
  stands in otherwise), so toggling an entry never tears down the marker whose card is open. Toggling paints
  the button first and refreshes only the card for that entry (`cardSyncRef`).

### Atlas Layers

- Layout: the layer sidebar is the **left rail** (`absolute`, 286px, open by default above `md`), with the
  Back to the Library link at its top and a toggle button beside it. Zoom controls sit bottom-right, where
  the old Chroma Debug panel used to be - that panel and its grid overlay are gone.
- `MAP_LAYERS` (`src/features/map/GameMap.tsx`) is built in two parts: the guide layers (`GUIDE_LAYERS`:
  Locations, Pictos) and one layer per Library layer that has pins (`COLLECTABLE_LAYERS`, derived from
  `COLLECTION_LAYERS` x `LAYER_PINS`, minus the guide layer ids so Pictos cannot appear twice). Adding a
  Library layer is enough to give it an atlas layer.
- **Pictos merge both maps.** The reference map lists every pickup (252) but draws all of them inside an
  area inset, so here they can only be approximated; the wiki map draws 42 of them on the artwork this
  atlas renders, exactly, with a written note. `buildPictoPins` (fetch script) puts the wiki's pins first
  and caps each picto name at the number of pickups the _engine_ stores, so the layer has **one pin per
  pickup the Library lists (251)** - 75 at a wiki/projected position, 176 near their area - and a second
  pin never appears for a name that already has an exact one. The reference map's own note is dropped on
  those pins: it only restates the effect, stats and level the engine card already lays out.
- The recovered total is therefore the Library's **1,292** (1,041 reference-map pins + 251 pictos), which is
  what the guide layer had been short of while it used the wiki's 42 pins.
- **Single-entry view.** `/map?pin=<layerId>:<entryId>` (what a Library row's Map badge and a picto card's
  Map chip link to) draws only that one pin - every other layer's pins are filtered out, the layer holding it
  is switched on if it was off, the map centres on it at `FOCUS_ZOOM` and its card opens. The param is read
  from `location` rather than `useSearchParams` because the map is client-only (`ssr: false`), so the first
  paint is already narrowed instead of flashing every pin. The panel shows a "showing one entry" notice with
  a way out, which also drops the param, so a reload is the whole atlas again. The focused entry is
  deliberately let through the **Area entries** switch - otherwise asking for an approximate entry could show
  an empty map.
- **Pictos are addressed by name.** The atlas' picto pins carry the wiki's and the reference map's own ids,
  while the Library keys its cards by **engine picto id**, so `pinIsRequested` lets a picto pin answer to the
  engine ids behind its name (`enginePictosFor`) - the same bridge found state and Track use. A name can hold
  several engine entries (one per pickup), so asking for one pickup lights up every pin that shares the
  picto's name: `/map?pin=pictos:augmented-counter-1-31-grour` draws all three of its pickups.
- Collectable pins are glyph pins: the layer's own Material symbol in the layer's `color`, sized from the
  icon box (`pinGlyph(glyph, color, size)`), so they scale with the zoom exactly like the image pins do.
  Styles are `.glyph-pin` / `.pin-glyph` in the map's styled-jsx block. Pictos use `.picto-pin` and the
  shared picto glyph instead, art and all.
- **Every entry is on the map.** Overworld markers keep their projected position; markers drawn inside an
  area box are placed near that area's location pin on a golden-angle spiral and flagged `approx`
  (rendered at 50% opacity, `Approximate · <area>` in the card). The sidebar's **Area entries** switch
  (default on) hides that whole class in one go, for when approximate pins are noise.
- Which box a marker is in comes from **point-in-polygon tests** against the region polygons, not from its
  `region_id`: several hundred markers are tagged `Continent` yet drawn in an area box, and a few dozen sit
  in the gutters between boxes (those fall back to the nearest anchored box). That is why the panel counts
  now match the Library exactly - nothing is dropped.
- The panel groups rows by `layer.group` (World / Pictos & Lumina / Gear / Records / Curiosities), shows
  `matched/total` per layer with the **full entry count**, and has a master switch that shows or hides every
  layer at once. Bulk-added layers start hidden (`defaultHidden`) so the default view is Locations + Pictos.
- Coordinates: the reference canvas is a mosaic, so only its overworld box shares our artwork -
  `ARTWORK_TRANSFORM` (per-axis scale+offset) projects it, and area boxes are anchored through the wiki
  location of the same name (`REGION_ALIASES` covers the ones that differ, e.g. Inside the Monolith).
- The map's found / not-found filter covers every layer the collection can mark. Each layer declares
  `foundKind`: `picto` matches a pin by name against the engine picto ids, `entry` matches the pin's own
  id against `collection-found-<layerId>`, and `none` (Locations) is never filtered. `useFoundEntrySets`
  reads the per-layer keys in one go for the map; the control's header shows progress across all tracked
  layers.
- Every pin card carries the same **Found checkbox** as the Library (written as markup, because a card is an
  HTML string), on the same row as the Track chip. A picto pin marks *every* engine pickup behind its name,
  since a pin stands for the picto while the tracker stores one entry per pickup. Two guards keep the card
  alive while you tick items off:
  - the delegated card handler listens in the **capture** phase, because Leaflet closes the popup on any
    click its own container listener sees;
  - the visibility effect is handed `NO_FOUND_FILTER` rather than the real sets unless Found / Not found is
    the active filter - the found-state twin of `NO_TRACK_FILTER`, and the reason ticking a box does not
    tear down 1,292 markers and the card being read.
- A pin has **two cards**, both from `pinCardHtml`:
  - the **hover card is a summary** - mark, name, level/type chips, one line of prose clamped to three lines
    (a picto's lumina effect, an entry's "where to find it", or the pin's own note standing in for layers
    with no prose) and the area line for an approximate pin, plus a pointer to the full card;
  - the **click popup is the full entry** - hero art, chips, stat grid, every section, the Found / Track
    controls, and the entity list.

  `entities` marks the popup everywhere in the file, so the builder derives `summary` from it rather than
  every call site passing both flags. The summary deliberately carries no controls: Leaflet tooltips are
  not interactive, so a checkbox in one could never be clicked.
- Pins for a Library layer carry that entry's own art (`detailsFor: entryDetailsFor(layerId)`), so their
  full card is the entry's: hero art, chips, stat grid, lumina effect or scalers/passives, and where to
  find it. Only the layer that lists what sits inside it (`listsEntities`, Locations) renders the entity
  list, and only layers the collection can mark render the Track toggle - a card says nothing it has no
  data for.

### Collections Header Behavior

- Header uses minimal underlined search field with right flare icon.
- Two rune-style icon buttons control filter visibility and sort cycling.
- Display mode toggle remains right-aligned (Detailed / Compact).

### Collections Card Behavior

- Cards use `.distressed-surface` (shared, see below) rather than a per-card copy of the distressed
  background + texture + glow layers.
- Mouse proximity glow tracks cursor through CSS vars (`--mouse-x`, `--mouse-y`, `--glow-opacity`).
- Card title is wrapped (no ellipsis truncation).
- Stats row is fixed 4 columns:
  - col 1-2 = actual stats,
  - col 3 = intentionally empty,
  - col 4 = Level.
- Location line removed from card body.
- Lumina cost appears before lumina icon in footer and uses larger text size.
- Lumina effect text resolves from Lumina `description` or first `rules` description fallback.

### Sidebar Interaction State

- Active row uses primary highlight plus a filled glyph.
- Inactive rows and group headings use exact Stitch tone `#99907c`.
- Inactive rows become white on hover.

### Background / Atmosphere

- Shell background uses dark overlay + artwork image + strong vignette to match Stitch contrast.
- Ornament backdrop (`src/components/layout/OrnamentBackdrop.tsx`, mounted once in `TrackerShell`): two
  decorative planes of the same tiled lattice, painted _above_ the vignette so the gilding reads as etched
  into the dark rather than dimmed by it.
  - Each plane is a masked _zone_ (viewport-anchored) wrapping a transformed _plane_. Mask on the wrapper,
    transform on the child - that keeps the zones pinned to the viewport while the pattern drifts inside them.
  - `--surface`: 190px lattice raked 12deg, blooming off the lower-left and bottom-centre.
    `--vault`: 160px lattice raked 26deg with a -12deg twist in the top-right, reading as a ceiling receding
    away. The two zones are disjoint, so the layers cannot moire against each other.
  - Both drift on mismatched slow clocks (97s and 139s, about 0.35px/s) and the vault also breathes on a 61s
    opacity clock, so the haze is alive without ever pulling the eye. All animations are off under
    `prefers-reduced-motion`; the vault zone is hidden below 768px where one plane is enough.
  - Artwork is original SVG in `public/ornaments/` (same idiom, not the game's art). Intensity is set by
    `--ornament-field-opacity` / `--ornament-vault-opacity`, rhythm by `--ornament-field-tile` /
    `--ornament-vault-tile`; mask falloffs live on `.ornament-backdrop__*` in `globals.css`.
- The backdrop is **not** on `/map` or `/builder` - both bypass `TrackerShell` and provide their own shell.

### Surface Vocabulary (Chiaroscuro Overlays)

The atmosphere used to be re-implemented per surface. It now lives once in `globals.css` under
`@layer components` and every surface opts in by class.

| Class                  | What it is                                                                                                                                                                                                                                                                                                                                                             |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.chiaroscuro-wash`    | A section that wants its own pool of light instead of the page's: gold bloom at the top fading into the darkest surface.                                                                                                                                                                                                                                               |
| `.vignette-overlay`    | Non-interactive peripheral vignette, `transparent 30%` to `85%` black.                                                                                                                                                                                                                                                                                                 |
| `.distressed-surface`  | The card/list surface: gradient, hairline border, grain, and a gold pool that follows the cursor. `::before` is the grain, `::after` is the cursor pool. Both decor layers sit at a **negative z-index**, so inside the element's isolated stacking context they paint above its own background but _below_ its content - a list's rows are not veiled by the texture. |
| `.proximity-glow`      | A standalone cursor-tracking glow for surfaces that are not cards.                                                                                                                                                                                                                                                                                                     |
| `.chroma-etch`         | Engraved gold lettering (`text-shadow`) for headings sitting on dark glass.                                                                                                                                                                                                                                                                                            |
| `.found-glow`          | The teal bloom on a completed/"found" action.                                                                                                                                                                                                                                                                                                                          |
| `.clair-obscur-glass`  | Panel glass for rails and filter columns: 18px blur, left hairline.                                                                                                                                                                                                                                                                                                    |
| `.minimal-search-wrap` | Wraps an underline-only search input; `:focus-within` thickens and lights the hairline.                                                                                                                                                                                                                                                                                |
| `.chroma-scroll`       | Thin gold scrollbar. The thumb is the chamfer in one dimension: inset from the track and tapered to a point at each end, so it reads as the same diamond.                                                                                                                                                                                                              |

The two cursor-tracking surfaces read `--mouse-x`, `--mouse-y` and `--glow-opacity`, which the hover
handler sets on the element. The grain is an inline `feTurbulence` SVG data-URI so nothing in the shell
reaches for an external texture host.

### Chamfer Shape System

The shape language is one geometry: a **stretched diamond** - a true 90 degree point on the long axis, cut
on the short one - which is the diamond checkbox grown up into a full control. It replaced the previous mix
of `rounded-full` pills and 4px corners.

The element itself stays **rectangular**. The shape is drawn by two `clip-path`d pseudo-layers beneath it:
`::before` is the hairline, pinned at `inset: 0` so the border always sits on the control's own edge and
never moves, and `::after` is the face, pulled in from it by `--chamfer-inset`. The face is `1px` inside at
rest; the hover and active states raise the inset so the fill separates from the border instead of touching
it. `isolation: isolate` plus negative z-indexes keeps the element's own text and focus ring untouched, so a
chamfered control still has a normal rectangular focus ring and hit area.

**The cut is half the control's height, and that is what makes the point exactly 90 degrees.** A fixed
`rem` cut cannot do this - the angle is a function of the box's aspect ratio - so the height and the cut
travel together: `--chamfer-h` is the control's own height, `--chamfer-size` is `calc(var(--chamfer-h) / 2)`,
and every size declares `--chamfer-h` next to its Tailwind height utility (`h-8 [--chamfer-h:2rem]`). A
square control therefore comes out a true diamond - the cut equals half the width too.

```css
clip-path: polygon(
  var(--chamfer-size) 0,
  calc(100% - var(--chamfer-size)) 0,
  100% 50%,
  calc(100% - var(--chamfer-size)) 100%,
  var(--chamfer-size) 100%,
  0 50%
);
```

Variants are named component classes, not arbitrary Tailwind variables:

| Class                                     | Role                                                                                                                    |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `.chamfer`                                | Base. `--chamfer-h: 2.25rem` (the h-9 default), `--chamfer-inset: 1px`.                                                 |
| `.chamfer-square`                         | The compact-control fallback height (`1.75rem`, h-7) for controls that do not declare one.                              |
| `.chamfer-gold`                           | Primary action.                                                                                                         |
| `.chamfer-teal`                           | Secondary / completed action.                                                                                           |
| `.chamfer-plate`                          | Neutral plate.                                                                                                          |
| `.chamfer-ghost`                          | Transparent until hover - the resting state of a segment or chip.                                                       |
| `.chamfer-crimson`                        | Destructive.                                                                                                            |
| `.chamfer-selected`                       | The active segment: the border stays on the segment's edge and only the face moves, `--chamfer-inset: 3px`, solid gold. |
| `.chamfer-track`                          | The channel a row of segments or chips sits in.                                                                         |
| `.chamfer-meter` / `.chamfer-meter-track` | A chroma meter's pointed fill, and the recessed channel it is inset in.                                                 |

A segment in a `.chamfer-track` hovers the way a checkbox does, via
`.chamfer-track .chamfer-ghost:hover`: the face blooms at 40% and the border is **dropped** rather than lit, so a
hovered segment is the bare bloom and nothing else. Its inset is `0`, not the active state's `3px`, because
the active state's gold reaches the item's own edge - a bare face has to reach the edge too, or the item
would visibly shrink under the pointer. Both states therefore show one height and differ only in brightness,
which is how the checkbox previews its own check. Per item, never the whole control: only the hovered
segment changes, and the selected one keeps its gold border.

> **The translucent bloom depends on the transparent border.** The hairline layer is a solid fill, so a
> translucent face composites _over_ it and the ring vanishes. The hover works because it sets
> `--chamfer-edge: transparent` as well - keep the two together, or go back to an opaque bloom.

Every track segment also carries a content minimum of `6ch`, written as `min-w-[calc(6ch+<padding>)]` so the
minimum applies to the **text**, not the padded box - a short label like `All` cannot collapse into a diamond
too small to read. Segment content gets `px-4` (library), `px-3` (atlas panel) or `px-5` (Display Mode).

### Vocabulary: the Track, and Found

- The feature formerly called the **Quarry** is the **Track**: you mark an entry you are still out to get.
  The label on the control is `Track` / `Tracked`, the Library status filter is `Tracked`, and the atlas
  filter reads `All · Tracked · Found · Not found`. The control carries **no icon** - the word is enough.
  Code follows the same word (`useTracking`, `trackedKeyFor`, `trackedSet`, `isTracked`, `toggleTracked`).
  The storage key is still `collection-quarry` on purpose: it holds real player intent and must not change.
- **"Recovered" is now "Found"** everywhere (the Library list header, the atlas panel, the sidebar rows).
  The atlas' found-progress counters were renamed `foundCounts` so they cannot be confused with the Track.
- In the Library rows a region chip (e.g. `CONTINENT`) **is** the map link: it names where the entry is and
  opens the atlas on that one entry with everything else hidden. There is no separate Map button.

### Controls: Every Toggle Is a Checkbox, Every Group Is a Track

- **`src/components/ui/switch.tsx` was deleted.** There is no switch primitive. Every binary control is the
  diamond `Checkbox` (`src/components/ui/checkbox.tsx`): a `size-3` (12px) `rotate-45` square with a hairline
  `border-primary/30`, and a `size-1.5` (6px) primary diamond inside that previews at 40% on hover and locks
  in at 100% when checked. Those sizes are the prototype's own (`w-3 h-3` / `w-1.5 h-1.5`), 1:1. It is
  deliberately **unfilled and unglowed** - the shape stays a crisp etched outline rather than a filled box,
  which is what makes it read light. The hit area is widened with `after:-inset-2.5` so a 12px diamond is
  still comfortably tappable.
  - The `Indicator` needs `keepMounted`: Base UI unmounts it while unchecked
    (`shouldRender = keepMounted || mounted`), so without it the hover preview can never fire.
- That includes the atlas' master "Toggle all layers", the per-area "Area entries", every layer row, and the
  "found" mark on compact picto cards - they are all the same checkbox. In the atlas panel every one of them
  **leads its row**, so the whole panel has a single checkbox column down its left edge.
- **Long toggles are not switches, they are tracks.** Where the control is really a choice between two or
  more named states (Collections `Display Mode`, the atlas found filter, the Library status and character
  filters), it renders as a `.chamfer-track` row of `.chamfer-square` segments - `.chamfer-selected` for the
  active one, `.chamfer-ghost` otherwise.
- `Button` and `Badge` variants map onto the same chamfer classes (`default` to `chamfer-gold`, `outline` to
  `chamfer-plate`, `secondary` to `chamfer-teal`, `ghost` to `chamfer-ghost`, `destructive` to
  `chamfer-crimson`), and all `rounded-*` utilities were dropped from their sizes. Anything using these
  primitives inherits the shape language automatically.

## Brand & Style

The design system is a digital reflection of the Belle Époque's decorative opulence fused with the stark, dramatic lighting of _Chiaroscuro_. It serves as a "Picto Tracker"—a tool for documenting surrealist dreamscapes and tactical information.

The aesthetic is characterized as a **Moving Painting**. It rejects the flat, sterile nature of modern SaaS interfaces in favor of a **Tactile Surrealist** style. The UI should evoke an emotional response of mystery, discovery, and high-stakes elegance.

**Visual Pillars:**

- **Chiaroscuro Lighting:** High-contrast interactions where elements emerge from deep shadows into pools of warm light.
- **Belle Époque Geometry:** Intricate, symmetrical framing inspired by Art Deco architecture but rendered with the organic decay of a dreamscape.
- **Chroma Etching:** Interactive elements appear "etched" into the UI, glowing with internal light rather than being placed on top of it.
- **Materiality:** Surfaces should feel like oil-on-canvas, aged parchment, or polished charcoal.

## Colors

The palette is rooted in the "Clair Obscur" philosophy: light only exists to define the dark.

- **Primary (Gold/Amber):** Used for "Chroma" highlights, active states, and essential narrative paths. It represents the warmth of the sun in a dying world.
- **Secondary (Ethereal Teal):** Used for supernatural elements, "Picto" data points, and secondary actions. It provides a cool, ghostly contrast to the gold.
- **Tertiary (Crimson):** Reserved for high-alert states, health indicators, or "The Paint" itself. Deeply saturated and visceral.
- **Neutral (Midnight Charcoal):** The canvas. A range of near-blacks that use subtle blue or violet undertones to prevent a "flat" black look.

**Color Application:**
Use radial gradients for backgrounds to simulate "spotlight" effects. Avoid uniform fills. Every container should have a slight luminance variance to mimic hand-painted depth.

## Typography

This design system employs a tiered typographic strategy to balance narrative atmosphere with functional legibility.

- **The Narrative Tier (Playfair Display):** For headers, character names, and location titles. Its high contrast and elegant serifs evoke the Belle Époque period.
- **The Functional Tier (Hanken Grotesk):** For descriptions and lore entries. It is a modern, clean sans-serif that remains readable even when placed over textured backgrounds.
- **The Metadata Tier (Space Grotesk):** For technical stats, coordinates, and "Picto" data. The geometric, slightly technical feel suggests the analytical nature of the Expedition's tracking tools.

**Styling Note:** Headlines should often be rendered in Gold or Ivory with a subtle "drop-glow" rather than a drop-shadow.

## Layout & Spacing

The layout philosophy follows a **Fixed Narrative Grid**. Content is treated like a framed gallery piece.

- **The Frame:** Every screen should have a "safe zone" or an ornamental border. Centrally-aligned content is preferred for dramatic focus.
- **Asymmetry:** To mirror the surrealist influence, occasional breaks in the grid (e.g., a photo overlapping a text box) are encouraged to create a sense of movement.
- **Responsive Behavior:**
  - **Desktop:** A 12-column grid with wide "theatrical" margins (64px+).
  - **Tablet:** 8-column grid with increased vertical spacing.
  - **Mobile:** 4-column grid where ornamental borders are simplified to corner accents to maximize screen real estate.

## Elevation & Depth

In this design system, depth is created through **Luminance and Texture** rather than traditional elevation.

- **Tonal Layers:** Backgrounds are the darkest layer. "Plates" or cards use a slightly lighter charcoal with a "Canvas" texture overlay at 5% opacity.
- **Glow Borders:** Instead of shadows, elevated elements use "Chroma Outlines"—thin (1px) borders with an outer glow in Gold or Teal. The glow intensity indicates the importance of the element.
- **Vignetting:** Use heavy peripheral vignettes on all primary screens to draw the eye toward the center, reinforcing the Chiaroscuro theme.
- **Inner Shadows:** Buttons and inputs should use deep inner shadows to feel "pressed" or "etched" into the world's fabric.

## Shapes

The shape language combines the **Softness of Art Nouveau** with the **Geometry of Art Deco**.

- **Controls - the Chamfer:** Every button, tag, chip, segment and toggle is a stretched hexagon, drawn by
  the `.chamfer` system described above. There are no pills and no soft 4px corners on controls. The element
  box stays rectangular, so focus rings and hit areas are unaffected.
- **Ornamental Accents:** The diamond is the atom of the language - the checkbox is a rotated square, and the
  chamfer is that diamond stretched along the control's long axis.
- **Containers:** Panels and list surfaces keep a subtle 4px radius ("etched stone") and take their depth from
  `.distressed-surface` / `.chiaroscuro-wash` rather than from corners.
- **Clipping:** For character portraits or "Picto" snapshots, use "Archway" or "Hexagonal" masks rather than simple rectangles or circles.

## Components

- **Buttons:** Stretched-diamond chamfer plates (`.chamfer-gold` default, `.chamfer-plate` outline, `.chamfer-teal` secondary). Hover raises the hairline to full gold and blooms an inner glow (`--chamfer-glow`).
- **Tags / Badges:** The same chamfer one size down. In the Library rows a badge doubles as a link (the region chip opens the atlas on that entry).
- **Picto Cards:** Used for tracking snapshots. They use `.distressed-surface` (grain + cursor pool + gold hover border) with a 4px container radius.
- **Progress Bars (Chroma Meters):** A pointed channel with a pointed gold fill inset inside it - the fill is 8px in a 12px channel, and both use the same 90 degree points. The fill is a flat gold, no ramp.
- **Checkboxes:** Small etched diamonds - a `rotate-45` square with a hairline gold border and a gold diamond that blooms in the middle when checked. This is the **only** binary control; there is no switch.
- **Segmented Controls / Toggles:** A `.chamfer-track` channel holding `.chamfer-square` segments, each with at least `6ch` of content width plus its padding. The active one is a solid gold diamond with a gold border on the segment's edge; a hovered one is a bare 40% gold bloom of the same height and no border at all. Only the item under the pointer changes.
- **Input Fields:** Underlined only, via `.minimal-search-wrap` - the hairline brightens and thickens on `:focus-within`.
- **Lists:** One `.distressed-surface` panel with `divide-y divide-white/5` between rows.
- **Modals:** These are "Overlays" that blur the background and appear as a centralized scroll or framed canvas piece.

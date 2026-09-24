# Picto Tracker

A fan-made collection, build and map tracker for _Clair Obscur: Expedition 33_.

- **Library** (`/collections`) - every picto, filterable, with progress saved in `localStorage`
- **Builder** (`/builder`) - synergy scoring between Luminas
- **Map** (`/map`) - Leaflet map of the game world with picto and location pins

## Getting Started

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm pins:map     # regenerate map pins + location art from the wiki
```

## Deploying to GitHub Pages

The live site is a static export served from the `gh-pages` branch:

```bash
pnpm build:pages           # export into out/
pnpm build:pages --serve   # ...and preview it at http://localhost:4300/expedition33-tracker/
pnpm publish:pages         # export, then force-push out/ to gh-pages
```

Publishing pushes a branch rather than running GitHub Actions: the `gh` token here has no
`workflow` scope, so a `.github/workflows/` file cannot be pushed.

Three things differ in the export build, all driven by `STATIC_EXPORT=1` in `next.config.ts`:

|         | dev                                        | Pages                             |
| ------- | ------------------------------------------ | --------------------------------- |
| routing | root `/`                                   | `basePath: /expedition33-tracker` |
| tiles   | `/api/tile/{z}/{x}/{y}` proxy + disk cache | the wiki's pyramid, hotlinked     |
| images  | optimised by Next                          | served as-is                      |

Because Pages serves from a subpath, any path into `public/` that is built at runtime goes
through `assetPath()` in `src/lib/assetPath.ts` - `next/link` and `next/font` handle the
prefix themselves, but `next/image`, the Leaflet marker templates and `url()` in hand-written
CSS do not.

Map artwork is not redistributed: `public/tiles/` is a local dev cache, gitignored, and
dropped from the export.

## Synergy Pattern Detector

The tracker uses a pattern-based detector in [src/engine/utils/synergy.ts](src/engine/utils/synergy.ts) to score how well two Luminas combine.

### How It Works

1. Every pair of Luminas is compared rule-by-rule.
2. Each rule pair is evaluated by a registry of detectors.
3. Every matched detector contributes a named pattern and score.
4. Pair totals are the sum of all pattern scores (positive and negative).

The matrix shape is:

- `matrix[luminaA.id][luminaB.id].total`
- `matrix[luminaA.id][luminaB.id].patterns[]`

### Detector Coverage

Current detector categories include:

- Trigger alignment (same activation windows)
- Status pipelines (provider -> consumer, self/target)
- Status enhancement and status-based scaling
- Resource pipelines (AP, Shield, Gradient Charge)
- Buff lifecycle interactions (apply/remove)
- Cost and condition enablement (AP cost, health/shield conditions)
- Mechanic unlocks (break/free-aim/flag enablers)
- Status-to-resource conversion
- Negative conflicts (currently parry AP disable conflict)

### Notes On Type Safety

The detector supports data-driven rule variants that may exist in JSON but not yet be listed in strict TypeScript unions. To keep detection robust without unsafe widening of core domain types, the detector uses guarded runtime field checks for optional/extended fields (for example condition or cost variants).

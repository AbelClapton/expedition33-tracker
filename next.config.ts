import type { NextConfig } from "next";

/**
 * Two build shapes out of one codebase.
 *
 * `pnpm dev` / `pnpm build` - the normal server build, served from the root, with
 * /api/tile proxying + caching the wiki's tile pyramid into `public/tiles/`.
 *
 * `pnpm build:pages` (STATIC_EXPORT=1) - what GitHub Pages gets: plain files, no Node
 * runtime. That flips three things:
 *   - `output: "export"` writes `out/` instead of `.next/`
 *   - `basePath` shifts every route and every `_next` asset under /expedition33-tracker,
 *     matching the Pages URL. Runtime asset paths go through `assetPath()`.
 *   - the tile proxy cannot exist, so Leaflet fetches the upstream wiki pyramid directly
 *     (hotlinking is allowed; the artwork still is not redistributed from this repo).
 */
const REPO = "expedition33-tracker";
// The wiki pyramid's tiles are `.jpg`, while the dev cache route takes the bare z/x/y
// triple, so the templated suffix differs between the two.
const TILE_UPSTREAM =
  "https://expedition33.wiki.fextralife.com/file/Expedition-33/map-e54af741-6dd0-41ea-8af0-551a9b8c99ac/map-tiles.1";
const TILE_TEMPLATE_DEV = "/api/tile/{z}/{x}/{y}";
const TILE_TEMPLATE_PAGES = `${TILE_UPSTREAM}/{z}/{x}/{y}.jpg`;

const isStaticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  output: isStaticExport ? "export" : undefined,
  basePath: isStaticExport ? `/${REPO}` : undefined,
  // no image optimizer on Pages either
  images: { unoptimized: isStaticExport },
  // emit `collections/index.html` so GitHub Pages serves directory-style URLs
  trailingSlash: isStaticExport,
  env: {
    NEXT_PUBLIC_BASE_PATH: isStaticExport ? `/${REPO}` : "",
    NEXT_PUBLIC_TILE_URL: isStaticExport
      ? TILE_TEMPLATE_PAGES
      : TILE_TEMPLATE_DEV,
  },
};

export default nextConfig;

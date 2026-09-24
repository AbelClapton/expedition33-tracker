/**
 * GitHub Pages serves this app from a repo subpath, so the deployment build sets
 * NEXT_PUBLIC_BASE_PATH (see next.config.ts) and any path into `public/` that is built
 * at runtime - rather than written in JSX - has to go through here.
 *
 * `next/link` and `next/font` handle the prefix themselves; `next/image` does not, and
 * neither do the Leaflet marker templates or `url()` in hand-written CSS.
 *
 * Local dev leaves the variable empty, so the paths stay root-absolute.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function assetPath(path: string): string {
  return path.startsWith("/") ? `${BASE_PATH}${path}` : path;
}

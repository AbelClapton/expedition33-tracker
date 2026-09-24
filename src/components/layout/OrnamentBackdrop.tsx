/**
 * Belle Époque ornament haze for the app background.
 *
 * Two decorative planes of the same tiled lattice, each masked into its own off-centre
 * zone so the ornament only surfaces in patches and dissolves back into the dark:
 *   - `--surface`  broad plane off the lower-left
 *   - `--vault`    plane in the top-right
 * (hidden on phones - one plane is enough there)
 *
 * The planes are flat: no perspective, no rake. The masks alone decide where the lattice
 * appears, so the pattern reads as haze on the page rather than as a receding surface -
 * and the mask blooms wander on clocks of their own, so the darkness concealing the
 * lattice moves too, not just the lattice inside it.
 *
 * Plane drift and mask wander both run on very slow, mismatched clocks so the haze is
 * alive without asking for attention. Everything is switched off under
 * `prefers-reduced-motion`.
 *
 * Tune in `globals.css`: --ornament-field-opacity, --ornament-field-tile,
 * --ornament-vault-opacity, --ornament-vault-tile. Artwork: `public/ornaments/`
 * (`art-deco-lattice.png`; the earlier hand-drawn `belle-epoque-lattice.svg` is kept
 * beside it - swap the filename above to get it back).
 */
import type { CSSProperties } from "react";
import { assetPath } from "@/lib/assetPath";

export function OrnamentBackdrop() {
  // Inline because the CSS bundle cannot know the deploy base path (GitHub Pages serves
  // from a repo subpath); `globals.css` falls back to the root-absolute URL.
  //
  // Art is a raster tile: a 512px png that repeats EXACTLY at 512 (the 1024px source was
  // a 2x2 of it, and the generator's watermark sat only in the far corner of the extra
  // quadrants). It is drawn at half size - see --ornament-{field,vault}-tile.
  const art = {
    "--ornament-art": `url("${assetPath("/ornaments/art-deco-lattice.png")}")`,
  } as CSSProperties;

  return (
    <div aria-hidden className="ornament-backdrop" style={art}>
      <div className="ornament-backdrop__zone ornament-backdrop__zone--surface">
        <div className="ornament-backdrop__plane ornament-backdrop__plane--surface" />
      </div>
      <div className="ornament-backdrop__zone ornament-backdrop__zone--vault">
        <div className="ornament-backdrop__plane ornament-backdrop__plane--vault" />
      </div>
    </div>
  );
}

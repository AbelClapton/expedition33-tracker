/**
 * Belle Époque ornament haze for the app background.
 *
 * Two decorative planes of the same tiled lattice, each raked into perspective and
 * masked into its own off-centre zone so the ornament only surfaces in patches and
 * dissolves back into the dark:
 *   - `--surface`  broad plane off the lower-left, lightly raked
 *   - `--vault`    steeply raked plane in the top-right, reading as a receding ceiling
 * (hidden on phones - one plane is enough there)
 *
 * Both drift on very slow, mismatched clocks so the haze is alive without asking for
 * attention. Animations are switched off under `prefers-reduced-motion`.
 *
 * Tune in `globals.css`: --ornament-field-opacity, --ornament-field-tile,
 * --ornament-vault-opacity, --ornament-vault-tile. Artwork: `public/ornaments/`.
 */
import type { CSSProperties } from "react";
import { assetPath } from "@/lib/assetPath";

export function OrnamentBackdrop() {
    // Inline because the CSS bundle cannot know the deploy base path (GitHub Pages serves
    // from a repo subpath); `globals.css` falls back to the root-absolute URL.
    const art = {
        "--ornament-art": `url("${assetPath("/ornaments/belle-epoque-lattice.svg")}")`,
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

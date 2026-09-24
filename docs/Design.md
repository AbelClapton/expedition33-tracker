---
name: Chroma Expedition
colors:
  surface: '#111316'
  surface-dim: '#111316'
  surface-bright: '#37393d'
  surface-container-lowest: '#0c0e11'
  surface-container-low: '#1a1c1f'
  surface-container: '#1e2023'
  surface-container-high: '#282a2d'
  surface-container-highest: '#333538'
  on-surface: '#e2e2e6'
  on-surface-variant: '#d0c5af'
  inverse-surface: '#e2e2e6'
  inverse-on-surface: '#2f3034'
  outline: '#99907c'
  outline-variant: '#4d4635'
  surface-tint: '#e9c349'
  primary: '#f2ca50'
  on-primary: '#3c2f00'
  primary-container: '#d4af37'
  on-primary-container: '#554300'
  inverse-primary: '#735c00'
  secondary: '#59dad1'
  on-secondary: '#003734'
  secondary-container: '#00a8a0'
  on-secondary-container: '#003532'
  tertiary: '#ffbfb4'
  on-tertiary: '#690000'
  tertiary-container: '#ff9686'
  on-tertiary-container: '#8f0402'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffe088'
  primary-fixed-dim: '#e9c349'
  on-primary-fixed: '#241a00'
  on-primary-fixed-variant: '#574500'
  secondary-fixed: '#79f6ed'
  secondary-fixed-dim: '#59dad1'
  on-secondary-fixed: '#00201e'
  on-secondary-fixed-variant: '#00504c'
  tertiary-fixed: '#ffdad4'
  tertiary-fixed-dim: '#ffb4a8'
  on-tertiary-fixed: '#410000'
  on-tertiary-fixed-variant: '#920703'
  background: '#111316'
  on-background: '#e2e2e6'
  surface-variant: '#333538'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '500'
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

This section reflects current shipped UI, including Stitch-aligned collection work.

### Reusable Layout Components

- Shared top nav lives in src/components/layout/TrackerTopNav.tsx.
- Shared side nav lives in src/components/layout/TrackerSideNav.tsx.
- Shared shell wrapper (background, offsets, nav composition) lives in src/components/layout/TrackerShell.tsx.
- Shared mobile bottom nav lives in src/components/layout/TrackerMobileBottomNav.tsx.
- Collection page now consumes these shared layout components instead of feature-local nav copies.

### Collections Header Behavior

- Header uses minimal underlined search field with right flare icon.
- Two rune-style icon buttons control filter visibility and sort cycling.
- Display mode toggle remains right-aligned (Detailed / Compact).

### Collections Card Behavior

- Cards use Stitch-like distressed background + texture + glow layers.
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

- Active nav item uses primary highlight.
- Inactive nav items (including Support/Sanctum) use exact Stitch tone `#99907c`.
- Inactive items become white on hover.

### Background / Atmosphere

- Shell background uses dark overlay + artwork image + strong vignette to match Stitch contrast.
- Ornament backdrop (`src/components/layout/OrnamentBackdrop.tsx`, mounted once in `TrackerShell`): two
  decorative planes of the same tiled lattice, painted *above* the vignette so the gilding reads as etched
  into the dark rather than dimmed by it.
  - Each plane is a masked *zone* (viewport-anchored) wrapping a transformed *plane*. Mask on the wrapper,
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


## Brand & Style

The design system is a digital reflection of the Belle Époque's decorative opulence fused with the stark, dramatic lighting of *Chiaroscuro*. It serves as a "Picto Tracker"—a tool for documenting surrealist dreamscapes and tactical information. 

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

- **Primary Corners:** Use a subtle 4px (Soft) radius for standard containers to maintain a structured, "etched stone" feel.
- **Ornamental Accents:** Use "Diamond" or "Kite" shapes for checkboxes and small icons.
- **Clipping:** For character portraits or "Picto" snapshots, use "Archway" or "Hexagonal" masks rather than simple rectangles or circles.

## Components

- **Buttons:** Large, high-contrast elements. The "Default" state is a dark fill with a Gold etched border. The "Hover" state triggers a "Chroma Bloom"—where the internal glow fills the button.
- **Picto Cards:** Used for tracking snapshots. They feature a heavy inner border and a parchment-style caption area at the bottom.
- **Progress Bars (Chroma Meters):** These should look like glowing liquid filling a glass tube. Use a gradient from Crimson to Gold.
- **Checkboxes:** Stylized as small, etched diamonds. When checked, a Teal "spark" or glow appears in the center.
- **Input Fields:** Underlined only (no full box) with a "flicker" animation on the cursor to mimic an oil lamp's light.
- **Lists:** Separated by "Etched Dividers"—thin lines that fade out at the edges, perhaps featuring a small geometric filigree in the center.
- **Modals:** These are "Overlays" that blur the background and appear as a centralized scroll or framed canvas piece.
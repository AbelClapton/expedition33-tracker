import Image from "next/image";
import type { CollectionLayer } from "../collectionLayers";

interface LayerIconProps {
  layer: CollectionLayer;
  /** Rendered size in px, for both the art and the glyph. */
  size: number;
  /** Filled variant of the glyph, for the active row. */
  filled?: boolean;
  className?: string;
}

/**
 * A layer's mark: its own game art where the tracker holds any (`iconImage`,
 * already run through `assetPath`), otherwise the Material glyph. The glyph is
 * tinted by `currentColor`, so it follows the row; art cannot be recoloured, so
 * the dormant variant steps the opacity down instead.
 *
 * Plain component - it is rendered by `CollectionLayerNav` (a client component)
 * and by `CollectionLayerPending`, so it must stay renderable from either side.
 */
export function LayerIcon({
  layer,
  size,
  filled = false,
  className = "",
}: LayerIconProps) {
  if (layer.iconImage) {
    return (
      <Image
        src={layer.iconImage}
        alt=""
        width={size}
        height={size}
        className={`shrink-0 object-contain ${filled ? "" : "opacity-60"} ${className}`}
      />
    );
  }

  return (
    <span
      className={`material-symbols-outlined shrink-0 ${className}`}
      style={{
        fontSize: size,
        ...(filled ? { fontVariationSettings: '"FILL" 1' } : {}),
      }}
    >
      {layer.icon}
    </span>
  );
}

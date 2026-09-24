/** One marker on the atlas, already in this tracker's lat/lng space. */
export interface MapPin {
  id: string;
  name: string;
  lat: number;
  lng: number;
  level?: number;
  note?: string;
  /** Public path to the pin's art, when the source has per-pin art. */
  icon?: string;
  /**
   * True when the entry lives inside an area, so it is drawn near that area rather
   * than at its real spot (the reference canvas keeps those insets at their own scale).
   */
  approx?: boolean;
  /** The area an approximate pin belongs to, for the card. */
  area?: string;
}

/**
 * Extra card content for a pin, resolved from whatever the tracker knows about
 * the entry behind it. Layers supply their own resolver, so the card gets richer
 * as data lands without every layer knowing about every source.
 */
export interface CardDetails {
  /** Leading art for the card. */
  image?: string;
  /** Small chips beside the name, e.g. level and pickup count. */
  meta?: string[];
  /** Label/value grid. */
  stats?: { label: string; value: string }[];
  /** Titled prose blocks. */
  sections?: { title: string; body: string }[];
}

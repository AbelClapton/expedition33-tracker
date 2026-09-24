/**
 * The screens that actually exist, in nav order. Every nav renders this list, so
 * adding a route here is the only edit needed to surface it in all three.
 */
export type NavItem = {
  href: string;
  label: string;
  /** Material Symbols glyph, matching the Stitch nav art. */
  icon: string;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/collections", label: "Library", icon: "auto_stories" },
  { href: "/builder", label: "Canvas", icon: "architecture" },
  { href: "/map", label: "Atlas", icon: "diamond" },
];

/** True for the item's own route and anything nested under it. */
export function isActivePath(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

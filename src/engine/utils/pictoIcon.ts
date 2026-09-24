import { assetPath } from "@/lib/assetPath";

const ICON_COUNT = 11;

/** Art used for every picto marker on the map, and for the layers legend. */
export const PICTO_PIN_ICON = assetPath(
  "/images/pictos/lumina-points-icon-clair-obscur-expedition-33-wiki-guide-36px.png",
);

function hash(value: string): number {
  let output = 0;

  for (let index = 0; index < value.length; index += 1) {
    output = (output << 5) - output + value.charCodeAt(index);
    output |= 0;
  }

  return Math.abs(output);
}

/** Deterministic stand-in art for a collection card, until per-picto sprites exist. */
export function pictoIconPath(pictoId: string): string {
  const iconIndex = (hash(pictoId) % ICON_COUNT) + 1;
  return assetPath(
    `/images/pictos/${iconIndex}-pictos-equipment-clair-obscur-expedition-33-wiki-guide75px.png`,
  );
}

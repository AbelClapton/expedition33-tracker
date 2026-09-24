import { luminas } from "@/engine/data";
import type { Picto } from "@/engine/types";
import { describeRule } from "@/engine/utils/describeRule";
import { pictoIconPath } from "@/engine/utils/pictoIcon";
import { assetPath } from "@/lib/assetPath";
import { enginePictosFor } from "./pictoStatus";
import type { CardDetails, MapPin } from "./types";

const LUMINA_BY_ID = new Map(luminas.map((lumina) => [lumina.id, lumina]));

function statRows(picto: Picto) {
  const { health, speed, defense, critRate } = picto.stats;

  return [
    { label: "Health", value: health },
    { label: "Speed", value: speed },
    { label: "Defense", value: defense },
    { label: "Crit", value: critRate, suffix: "%" },
  ]
    .filter((stat) => stat.value > 0)
    .map((stat) => ({
      label: stat.label,
      value: `${stat.value}${stat.suffix ?? ""}`,
    }));
}

/**
 * Everything the tracker holds about the picto behind a pin: its own icon art,
 * the stats of its best copy, the lumina it grants and where the game hides it.
 *
 * A picto is stored once per pickup, so the card takes the highest-level entry as
 * the headline and lists every pickup's location underneath.
 */
export function pictoCardDetails(pin: MapPin): CardDetails | null {
  const entries = enginePictosFor(pin.name);
  if (entries.length === 0) return null;

  const best = entries.reduce((top, entry) =>
    entry.level > top.level ? entry : top,
  );
  const lumina = LUMINA_BY_ID.get(best.luminaId);
  const effect =
    lumina?.description?.trim() ||
    (lumina?.rules?.length ? describeRule(lumina.rules[0]) : "");
  const locations = [
    ...new Set(entries.map((entry) => entry.location).filter(Boolean)),
  ];

  return {
    image: assetPath(pictoIconPath(best.id)),
    meta: [
      `Lv ${best.level}`,
      entries.length > 1 ? `${entries.length} pickups` : null,
    ].filter((chip): chip is string => Boolean(chip)),
    stats: statRows(best),
    sections: [
      lumina ? { title: `Lumina · ${lumina.name}`, body: effect } : null,
      locations.length > 0
        ? {
            title: entries.length > 1 ? "Where to find it" : "Pickup",
            body: locations.join(" · "),
          }
        : null,
    ].filter((section): section is { title: string; body: string } =>
      Boolean(section?.body),
    ),
  };
}

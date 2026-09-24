import { Lumina, Picto, Stats } from "@/engine/types";
import { describeRule } from "@/engine/utils/describeRule";
import { pictoIconPath } from "@/engine/utils/pictoIcon";
import {
  CollectionCardModel,
  CollectionRuneFilter,
  CollectionStat,
} from "../types";

function toCollectionStats(stats: Stats): CollectionStat[] {
  const output: CollectionStat[] = [];

  if (stats.health > 0) {
    output.push({ label: "Health", value: stats.health });
  }

  if (stats.speed > 0) {
    output.push({ label: "Speed", value: stats.speed });
  }

  if (stats.defense > 0) {
    output.push({ label: "Defense", value: stats.defense });
  }

  return output;
}

function deriveRunes(
  name: string,
  effect: string,
  stats: Stats,
): CollectionRuneFilter[] {
  const text = `${name} ${effect}`.toLowerCase();
  const runes = new Set<CollectionRuneFilter>();

  const offenseKeywords = [
    "critical",
    "damage",
    "attack",
    "burn",
    "strike",
    "hit",
  ];
  const defenseKeywords = [
    "shield",
    "parry",
    "block",
    "defense",
    "damage taken",
    "protect",
  ];
  const supportKeywords = ["heal", "regen", "ap", "ally", "revive", "restores"];
  const controlKeywords = [
    "stun",
    "freeze",
    "mark",
    "break",
    "redirect",
    "slow",
  ];
  const resourceKeywords = ["gradient", "tint", "consum", "resource", "cost"];

  if (offenseKeywords.some((keyword) => text.includes(keyword)))
    runes.add("offense");
  if (defenseKeywords.some((keyword) => text.includes(keyword)))
    runes.add("defense");
  if (supportKeywords.some((keyword) => text.includes(keyword)))
    runes.add("support");
  if (controlKeywords.some((keyword) => text.includes(keyword)))
    runes.add("control");
  if (resourceKeywords.some((keyword) => text.includes(keyword)))
    runes.add("resource");

  if (stats.defense > 0) runes.add("defense");
  if (stats.critRate > 0) runes.add("offense");

  if (runes.size === 0) {
    runes.add("support");
  }

  return [...runes];
}

export function buildCollectionCards(
  pictos: Picto[],
  luminas: Lumina[],
): CollectionCardModel[] {
  const luminaMap = new Map(luminas.map((lumina) => [lumina.id, lumina]));

  return pictos.map((picto) => {
    const lumina = luminaMap.get(picto.luminaId);
    const effect =
      lumina?.description?.trim() ||
      (lumina?.rules?.length ? describeRule(lumina.rules[0]) : "") ||
      "No effect description available.";

    return {
      id: picto.id,
      name: picto.name,
      location: picto.location,
      effect,
      level: picto.level,
      imagePath: pictoIconPath(picto.id),
      stats: toCollectionStats(picto.stats),
      runes: deriveRunes(picto.name, effect, picto.stats),
    };
  });
}

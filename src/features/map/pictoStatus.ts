import { pictos } from "@/engine/data";

const normalise = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "");

/**
 * Wiki pin spellings that differ from the tracker's name, so pins the game does
 * record as found cannot sit permanently in "not found".
 */
const NAME_ALIASES: Record<string, string> = {
  augmentcounteri: "augmentedcounteri",
};

/**
 * Engine picto ids grouped by name.
 *
 * The map's pins only carry a `pictoId` when a name is unambiguous, so matching
 * on the name links more of them (40 of 42 pins). The two that stay unlinked are
 * spelling differences in the wiki, e.g. "Augment Counter I" vs the tracker's
 * "Augmented Counter I".
 */
const ENGINE_IDS_BY_NAME: Record<string, string[]> = (() => {
  const index: Record<string, string[]> = {};

  for (const picto of pictos) {
    const key = normalise(picto.name);
    index[key] = [...(index[key] ?? []), picto.id];
  }

  return index;
})();

/**
 * A pin counts as found when any picto sharing its name is marked found, which
 * matters for the 31 names the tracker stores more than once (one entry per
 * pickup, so the pin cannot be narrowed to a single id).
 */
export function isPictoPinFound(name: string, foundIds: Set<string>): boolean {
  const key = normalise(name);
  const ids =
    ENGINE_IDS_BY_NAME[key] ?? ENGINE_IDS_BY_NAME[NAME_ALIASES[key]] ?? [];

  return ids.some((id) => foundIds.has(id));
}

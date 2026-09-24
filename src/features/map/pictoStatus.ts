import { pictos } from "@/engine/data";
import type { Picto } from "@/engine/types";

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
 * Engine picto entries grouped by name.
 *
 * A name can hold several entries because the tracker stores one per pickup, so
 * a pin links to a *set* rather than an id. The map's pins only carry a
 * `pictoId` when a name is unambiguous, which is why this index exists at all.
 */
export const ENGINE_PICTOS_BY_NAME: Record<string, Picto[]> = (() => {
  const index: Record<string, Picto[]> = {};

  for (const picto of pictos) {
    const key = normalise(picto.name);
    index[key] = [...(index[key] ?? []), picto];
  }

  return index;
})();

/** The engine entries behind a pin's name, alias-aware. */
export function enginePictosFor(name: string): Picto[] {
  const key = normalise(name);

  return (
    ENGINE_PICTOS_BY_NAME[key] ?? ENGINE_PICTOS_BY_NAME[NAME_ALIASES[key]] ?? []
  );
}

/**
 * A pin counts as found when any picto sharing its name is marked found, which
 * matters for the 31 names the tracker stores more than once (one entry per
 * pickup, so the pin cannot be narrowed to a single id).
 */
export function isPictoPinFound(name: string, foundIds: Set<string>): boolean {
  return enginePictosFor(name).some((picto) => foundIds.has(picto.id));
}

/**
 * The Track keys a wiki picto pin answers to.
 *
 * The Library keys pictos by their engine id while the map's pins carry wiki
 * ids, so a pin has to borrow the ids behind its name - exactly the way found
 * state is matched. Empty when no engine picto shares the name.
 */
export function pictoPinTrackedKeys(name: string, layerId: string): string[] {
  return enginePictosFor(name).map((picto) => `${layerId}:${picto.id}`);
}

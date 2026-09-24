/**
 * Where an entry's "found" state lives, per layer.
 *
 * A leaf module on purpose: the found hooks write these keys, and the tracking
 * rules have to read them - a collected entry must not stay tracked - while the
 * tracking module cannot import those hooks without a cycle.
 *
 * Pictos are the engine's own layer, so their entries record themselves in one key
 * rather than in `collection-found-pictos`-per-layer. Every key here holds real
 * player progress: spelled once, never renamed.
 */
export const PICTOS_LAYER_ID = "pictos";

export const FOUND_PICTOS_KEY = "collection-found-pictos";

/** One Library layer's found key. */
export function foundEntriesKey(layerId: string) {
  return `collection-found-${layerId}`;
}

/** The found key behind a layer's entries, whatever kind of layer it is. */
export function foundKeyFor(layerId: string) {
  return layerId === PICTOS_LAYER_ID ? FOUND_PICTOS_KEY : foundEntriesKey(layerId);
}

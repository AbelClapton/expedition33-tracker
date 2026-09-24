/**
 * The six playable characters, in the order the game introduces them.
 *
 * Entries that belong to one (or two) of them carry the name in parentheses -
 * "Abysseram (Gustave/Verso)", "Baguette (Maelle)", "Esquie (Monoco)" - and that is
 * the only character data the reference map gives us. So the Library's character
 * filter reads it from the entry name rather than from a field that does not exist.
 */
export const CHARACTERS = [
  "Gustave",
  "Lune",
  "Maelle",
  "Sciel",
  "Verso",
  "Monoco",
] as const;

export type Character = (typeof CHARACTERS)[number];

/** The characters an entry name mentions, in canonical order. */
export function charactersOf(name: string): Character[] {
  const suffix = name.match(/\(([^)]+)\)\s*$/)?.[1];
  if (!suffix) return [];

  const named = suffix.split("/").map((part) => part.trim().toLowerCase());

  return CHARACTERS.filter((character) =>
    named.includes(character.toLowerCase()),
  );
}

/**
 * The characters a layer actually covers, so the filter offers real choices and
 * a layer with no character-suffixed entries (journal entries, music records) shows
 * no filter at all.
 */
export function charactersIn(entries: Array<{ name: string }>): Character[] {
  const found = new Set<Character>();

  for (const entry of entries) {
    for (const character of charactersOf(entry.name)) found.add(character);
  }

  return CHARACTERS.filter((character) => found.has(character));
}

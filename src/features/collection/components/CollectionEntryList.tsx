"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { assetPath } from "@/lib/assetPath";
import { useTracking, trackedKeyFor } from "@/hooks/useTracking";
import { ENTRY_MEDIA } from "../data/media.generated";
import { charactersIn, charactersOf, type Character } from "../characters";
import type { CollectionLayer } from "../collectionLayers";
import type { CollectionEntry } from "../types";

type StatusFilter = "all" | "tracked" | "found" | "missing";
type CharacterFilter = Character | "all";

const STATUS_FILTERS: Array<{ id: StatusFilter; label: string }> = [
  { id: "all", label: "All" },
  { id: "tracked", label: "Tracked" },
  { id: "found", label: "Found" },
  { id: "missing", label: "Not found" },
];

interface CollectionEntryListProps {
  layer: CollectionLayer;
  entries: CollectionEntry[];
  foundSet: Set<string>;
  onToggleFound: (id: string | number) => void;
}

/**
 * Body of a Library layer that has no dedicated card design yet: one row per
 * marker from the reference map, with its region, its note and a found toggle.
 * The found set is keyed by the marker id, so progress is per pickup - the same
 * shape the picto grid uses.
 */
export function CollectionEntryList({
  layer,
  entries,
  foundSet,
  onToggleFound,
}: CollectionEntryListProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [character, setCharacter] = useState<CharacterFilter>("all");
  const tracking = useTracking();

  const normalizedQuery = query.trim().toLowerCase();

  // only offered when the layer really spans more than one character
  const characters = useMemo(() => charactersIn(entries), [entries]);

  const foundCount = useMemo(
    () => entries.filter((entry) => foundSet.has(String(entry.id))).length,
    [entries, foundSet],
  );

  const trackedCount = tracking.trackedByLayer[layer.id] ?? 0;

  const visibleEntries = useMemo(
    () =>
      entries.filter((entry) => {
        const isFound = foundSet.has(String(entry.id));
        const isTracked = tracking.trackedSet.has(
          trackedKeyFor(layer.id, entry.id),
        );
        const queryMatch =
          normalizedQuery.length === 0 ||
          entry.name.toLowerCase().includes(normalizedQuery) ||
          (entry.description ?? "").toLowerCase().includes(normalizedQuery) ||
          (entry.region ?? "").toLowerCase().includes(normalizedQuery);
        const statusMatch =
          status === "all" ||
          (status === "found"
            ? isFound
            : status === "tracked"
              ? isTracked
              : !isFound);
        const characterMatch =
          character === "all" || charactersOf(entry.name).includes(character);

        return queryMatch && statusMatch && characterMatch;
      }),
    [
      entries,
      foundSet,
      normalizedQuery,
      status,
      character,
      tracking.trackedSet,
      layer.id,
    ],
  );

  const completion =
    entries.length > 0 ? Math.round((foundCount / entries.length) * 100) : 0;

  return (
    <section className="space-y-5">
      <div className="chiaroscuro-wash rounded-[0.25rem] border border-white/8 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-sm md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="font-meta text-[0.6rem] uppercase tracking-[0.28em] text-[var(--collection-ink-soft)]">
              {layer.mapCategory} · from the continent map
            </p>
            <h2 className="font-heading text-2xl tracking-[0.04em] text-[var(--collection-primary)]">
              {layer.label}
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-[var(--collection-ink-muted)]">
              {layer.blurb}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-meta text-[0.58rem] uppercase tracking-[0.2em] text-[var(--collection-ink-soft)]">
                Found
              </p>
              <p className="mt-1 text-2xl text-[var(--collection-ink)]">
                {foundCount}
                <span className="text-[var(--collection-ink-soft)]">
                  /{entries.length}
                </span>
              </p>
              {trackedCount > 0 ? (
                <p className="mt-1 font-meta text-[0.58rem] uppercase tracking-[0.16em] text-[var(--collection-primary)]/80">
                  {trackedCount} tracked
                </p>
              ) : null}
            </div>
            <div className="hidden w-32 sm:block">
              <Progress value={completion} />
              <p className="mt-2 text-right font-meta text-[0.6rem] tracking-[0.14em] text-[var(--collection-ink-soft)]">
                {completion}%
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <label className="group minimal-search-wrap relative block min-w-[16rem] flex-1">
            <span className="sr-only">Search {layer.label}</span>
            <Input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.currentTarget.value)}
              placeholder="Whisper to the Archive..."
              className="pr-8 placeholder:text-[var(--collection-ink-soft)]"
            />
            <span className="pointer-events-none material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-[18px] text-primary/40 transition-colors group-focus-within:text-primary">
              flare
            </span>
          </label>

          <div className="chamfer chamfer-track flex items-center gap-0.5 p-0.5">
            {STATUS_FILTERS.map((filter) => (
              <Button
                key={filter.id}
                type="button"
                variant="ghost"
                size="sm"
                aria-pressed={status === filter.id}
                onClick={() => setStatus(filter.id)}
                className={cn(
                  "chamfer-square min-w-[calc(6ch+2rem)] px-4 py-1 font-meta text-[9px] uppercase tracking-[0.2em]",
                  status === filter.id
                    ? "chamfer-selected text-[#241a00]"
                    : "chamfer-ghost text-[var(--collection-ink-soft)] hover:text-primary",
                )}
              >
                {filter.label}
              </Button>
            ))}
          </div>

          <p className="font-meta text-[9px] uppercase tracking-[0.2em] text-[var(--collection-ink-soft)]">
            {visibleEntries.length} shown
          </p>
        </div>

        {/* the wielder, read from the entry names - weapons, outfits and hairstyles
            are the layers that name one */}
        {characters.length > 1 ? (
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="font-meta text-[9px] uppercase tracking-[0.2em] text-[var(--collection-ink-soft)]">
              Character
            </span>
            {/* one line, scrolls on a narrow card rather than wrapping the group */}
            <div className="chamfer chamfer-track chroma-scroll flex max-w-full items-center gap-0.5 overflow-x-auto p-0.5">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-pressed={character === "all"}
                onClick={() => setCharacter("all")}
                className={cn(
                  "chamfer-square min-w-[calc(6ch+2rem)] shrink-0 px-4 py-1 font-meta text-[9px] uppercase tracking-[0.2em]",
                  character === "all"
                    ? "chamfer-selected text-[#241a00]"
                    : "chamfer-ghost text-[var(--collection-ink-soft)] hover:text-primary",
                )}
              >
                All
              </Button>
              {characters.map((option) => (
                <Button
                  key={option}
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-pressed={character === option}
                  onClick={() => setCharacter(option)}
                  className={cn(
                    "chamfer-square min-w-[calc(6ch+2rem)] shrink-0 px-4 py-1 font-meta text-[9px] uppercase tracking-[0.2em]",
                    character === option
                      ? "chamfer-selected text-[#241a00]"
                      : "chamfer-ghost text-[var(--collection-ink-soft)] hover:text-primary",
                  )}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {visibleEntries.length === 0 ? (
        <p className="rounded-[0.25rem] border border-white/8 bg-black/20 p-6 text-center text-sm text-[var(--collection-ink-soft)]">
          Nothing in {layer.label} matches that.
        </p>
      ) : (
        <ul className="distressed-surface divide-y divide-white/5 overflow-hidden rounded-[0.25rem]">
          {visibleEntries.map((entry) => {
            const isFound = foundSet.has(String(entry.id));
            const isTracked = tracking.trackedSet.has(
              trackedKeyFor(layer.id, entry.id),
            );
            const media = ENTRY_MEDIA[`${layer.id}:${entry.id}`];
            // the row already says where it is, so only the extra prose is repeated here
            const extra = (media?.sections ?? []).filter(
              (section) => section.title !== "Where to find it",
            );

            return (
              <li
                key={entry.id}
                className="flex items-start gap-4 px-4 py-3 transition-colors hover:bg-white/[0.02]"
              >
                {media?.image ? (
                  <div className="relative mt-0.5 h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-[0.15rem] border border-white/10 bg-black/40">
                    <Image
                      src={assetPath(media.image)}
                      alt=""
                      fill
                      sizes="72px"
                      className="object-contain p-1"
                    />
                  </div>
                ) : null}

                <div className="min-w-0 flex-1 space-y-1.5">
                  <p className="text-sm text-[var(--collection-ink)]">
                    {entry.name}
                  </p>

                  {media?.meta?.length || media?.stats?.length ? (
                    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-meta text-[9px] uppercase tracking-[0.14em]">
                      {(media?.meta ?? []).map((fact) => (
                        <span
                          key={fact}
                          className="border border-white/10 px-1.5 py-0.5 text-[var(--collection-ink-soft)]"
                        >
                          {fact}
                        </span>
                      ))}
                      {(media?.stats ?? []).map((stat) => (
                        <span
                          key={stat.label}
                          className="text-[var(--collection-primary)]/80"
                        >
                          {stat.label}{" "}
                          <span className="text-[var(--collection-ink)]">
                            {stat.value}
                          </span>
                        </span>
                      ))}
                    </p>
                  ) : null}

                  {entry.description ? (
                    <p className="max-w-3xl text-[0.78rem] leading-5 text-[var(--collection-ink-muted)]">
                      {entry.description}
                    </p>
                  ) : null}

                  {extra.map((section) => (
                    <p
                      key={section.title}
                      className="max-w-3xl text-[0.78rem] leading-5 text-[var(--collection-ink-muted)]"
                    >
                      <span className="font-meta text-[9px] uppercase tracking-[0.16em] text-[var(--collection-primary)]/70">
                        {section.title}
                      </span>{" "}
                      {section.body}
                    </p>
                  ))}
                </div>

                {/* the actions sit at the end of the row; the region above them is
                    the map link - it names where the entry is AND opens the atlas
                    on it with everything else hidden */}
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <Badge
                    variant="outline"
                    render={
                      <Link
                        href={`/map?pin=${encodeURIComponent(
                          trackedKeyFor(layer.id, entry.id),
                        )}`}
                        title={`Show ${entry.name} on the map`}
                        className="hover:text-primary"
                      >
                        {entry.region ?? "Map"}
                      </Link>
                    }
                    className="font-meta text-[9px] tracking-[0.12em] text-[var(--collection-ink-soft)]"
                  />

                  <div className="flex items-center gap-3">
                    <label className="flex cursor-pointer select-none items-center gap-2">
                      <Checkbox
                        checked={isFound}
                        onCheckedChange={() => onToggleFound(entry.id)}
                        aria-label={
                          isFound
                            ? `Unmark ${entry.name} as found`
                            : `Mark ${entry.name} as found`
                        }
                      />
                      <span
                        aria-hidden="true"
                        className={cn(
                          "font-meta text-[9px] uppercase tracking-[0.18em] transition-colors",
                          isFound
                            ? "text-primary"
                            : "text-[var(--collection-ink-soft)]",
                        )}
                      >
                        Found
                      </span>
                    </label>

                    {/* the entry you are still out to get - collected entries are not */}
                    <button
                      type="button"
                      onClick={() => tracking.toggleTracked(layer.id, entry.id)}
                      disabled={isFound}
                      aria-pressed={isTracked}
                      title={
                        isFound
                          ? `${entry.name} is already collected`
                          : isTracked
                            ? `Stop tracking ${entry.name}`
                            : `Track ${entry.name}`
                      }
                      className={cn(
                        "chamfer chamfer-square flex h-6 w-[4.5rem] items-center justify-center [--chamfer-h:1.5rem] font-meta text-[9px] uppercase tracking-[0.18em] transition-all disabled:cursor-not-allowed",
                        isFound
                          ? "chamfer-ghost text-[var(--collection-ink-soft)] opacity-30"
                          : isTracked
                            ? "chamfer-gold text-primary"
                            : "chamfer-plate text-[var(--collection-ink-soft)] hover:text-primary",
                      )}
                    >
                      Track
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

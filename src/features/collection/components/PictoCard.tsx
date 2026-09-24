"use client";

import Image from "next/image";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { PICTO_PIN_ICON } from "@/engine/utils/pictoIcon";
import { useTracking } from "@/hooks/useTracking";
import { CollectionCardModel, CollectionViewMode } from "../types";
import styles from "../collection.module.css";

/** Layer id the picto cards belong to, so their Track keys match the rest of the site. */
const PICTO_LAYER_ID = "pictos";

interface PictoCardProps {
  card: CollectionCardModel;
  isFound: boolean;
  viewMode: CollectionViewMode;
  onToggleFound: (id: string) => void;
}

/**
 * The card's jump to the atlas: `/map?pin=pictos:<id>`, the same shape every Library
 * row links with. The map resolves the engine id against the pins whose name holds
 * it, since the atlas' picto pins carry the wikis' own ids.
 */
function MapLink({ id, name }: { id: string; name: string }) {
  const title = `Show ${name} on the map`;

  return (
    <Link
      href={`/map?pin=${encodeURIComponent(`${PICTO_LAYER_ID}:${id}`)}`}
      title={title}
      aria-label={title}
      className="chamfer chamfer-square chamfer-plate flex h-6 w-[3.25rem] shrink-0 items-center justify-center [--chamfer-h:1.5rem] font-meta text-[9px] uppercase tracking-[0.18em] text-[var(--collection-ink-soft)] transition-colors hover:text-primary"
    >
      Map
    </Link>
  );
}

/** The card's Track toggle: a picto you are still out to get. */
function TrackButton({
  id,
  name,
  tracked,
  onToggle,
  found = false,
  compact = false,
}: {
  id: string;
  name: string;
  tracked: boolean;
  onToggle: () => void;
  /** Collected pictos are not something to hunt down, so their toggle is off. */
  found?: boolean;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={found}
      aria-pressed={tracked}
      title={
        found
          ? `${name} is already collected`
          : tracked
            ? `Stop tracking ${name}`
            : `Track ${name}`
      }
      className={`chamfer chamfer-square flex h-6 shrink-0 items-center justify-center [--chamfer-h:1.5rem] transition-all disabled:cursor-not-allowed ${
        found
          ? "chamfer-ghost text-[var(--collection-ink-soft)] opacity-30"
          : tracked
            ? "chamfer-gold text-primary"
            : "chamfer-ghost text-[var(--collection-ink-soft)] opacity-60 hover:opacity-100"
      } ${compact ? "w-[3.75rem]" : "w-[4.5rem]"}`}
      data-tracked={`${PICTO_LAYER_ID}:${id}`}
    >
      <span
        className={`font-meta uppercase tracking-[0.16em] ${compact ? "text-[9px]" : "text-[10px]"}`}
      >
        {tracked ? "Tracked" : "Track"}
      </span>
    </button>
  );
}

export function PictoCard({
  card,
  isFound,
  viewMode,
  onToggleFound,
}: PictoCardProps) {
  const tracking = useTracking();
  const isTracked = tracking.isTracked(PICTO_LAYER_ID, card.id);
  const toggleTracked = () => tracking.toggleTracked(PICTO_LAYER_ID, card.id);
  const statSlots = card.stats
    .filter((stat) => stat.label.trim().length > 0 && stat.value > 0)
    .slice(0, 2);

  if (viewMode === "compact") {
    return (
      <article
        className={`${styles.card} ${styles.cardCompact}`}
        data-view-mode="compact"
        data-collection-card
      >
        <div className={styles.proximityGlow} aria-hidden="true" />
        <div className={styles.cardGlow} aria-hidden="true" />
        <div className={styles.cardTexture} aria-hidden="true" />

        <div className={styles.compactRow}>
          <div className="flex min-w-0 items-center gap-3">
            <div className={`${styles.iconShell} rotate-45`}>
              <Image
                src={card.imagePath}
                alt=""
                width={20}
                height={20}
                className="h-5 w-5 object-contain"
              />
            </div>

            <h3
              className={`${styles.cardTitle} truncate text-sm leading-[0.92] text-[var(--collection-primary)]`}
              title={card.name}
            >
              {card.name}
            </h3>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <TrackButton
              id={card.id}
              name={card.name}
              tracked={isTracked}
              onToggle={toggleTracked}
              found={isFound}
              compact
            />

            <Checkbox
              checked={isFound}
              onCheckedChange={() => onToggleFound(card.id)}
              aria-label={
                isFound
                  ? `Unmark ${card.name} as found`
                  : `Mark ${card.name} as found`
              }
            />

            <MapLink id={card.id} name={card.name} />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={styles.card}
      data-view-mode="detailed"
      data-collection-card
    >
      <div className={styles.proximityGlow} aria-hidden="true" />
      <div className={styles.cardGlow} aria-hidden="true" />
      <div className={styles.cardTexture} aria-hidden="true" />

      <div className="relative z-10 flex flex-shrink-0 items-center justify-start gap-3 py-0">
        <div className={`${styles.iconShell} rotate-45`}>
          <Image
            src={card.imagePath}
            alt=""
            width={20}
            height={20}
            className="h-5 w-5 object-contain"
          />
        </div>

        <div className="min-w-0 pr-1">
          <h3
            className={`${styles.cardTitle} text-base leading-[0.92] text-[var(--collection-primary)]`}
          >
            {card.name}
          </h3>
        </div>
      </div>

      <div className={styles.details}>
        <div className="relative z-10 mt-4 grid grid-cols-4 gap-4 border-y border-white/10 py-2">
          {[0, 1].map((index) => {
            const stat = statSlots[index];

            if (!stat) {
              return (
                <div
                  key={`empty-stat-${index}`}
                  className="flex w-full flex-col items-center justify-center"
                />
              );
            }

            return (
              <div
                key={`${stat.label}-${index}`}
                className="flex w-full flex-col items-center justify-center"
              >
                <p
                  className={`${styles.statLabel} whitespace-nowrap text-[9px] uppercase text-[var(--collection-ink-soft)]`}
                >
                  {stat.label}
                </p>
                <p
                  className={`${styles.statValue} whitespace-nowrap text-lg font-bold text-white`}
                >
                  {stat.value}
                </p>
              </div>
            );
          })}

          <div className="flex w-full flex-col items-center justify-center" />

          <div className="flex w-full flex-col items-center justify-center">
            <p
              className={`${styles.statLabel} whitespace-nowrap text-[9px] uppercase text-[var(--collection-ink-soft)]`}
            >
              LEVEL
            </p>
            <p
              className={`${styles.statValue} whitespace-nowrap text-lg font-bold text-white`}
            >
              {card.level}
            </p>
          </div>
        </div>

        <p
          className={`${styles.cardBody} relative z-10 mt-4 flex-grow text-xs leading-tight text-[var(--collection-ink-muted)] opacity-60`}
        >
          {card.effect}
        </p>
      </div>

      <footer className="relative z-10 mt-6 mt-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`${styles.luminaValue} text-sm text-secondary`}>
            {card.level}
          </span>
          <Image
            src={PICTO_PIN_ICON}
            alt=""
            width={16}
            height={16}
            className="h-4 w-4 object-contain"
          />
        </div>
        <div className="flex items-center gap-2">
          <TrackButton
            id={card.id}
            name={card.name}
            tracked={isTracked}
            onToggle={toggleTracked}
            found={isFound}
          />
          <label className="flex cursor-pointer select-none items-center gap-2">
            <Checkbox
              checked={isFound}
              onCheckedChange={() => onToggleFound(card.id)}
              aria-label={
                isFound
                  ? `Unmark ${card.name} as found`
                  : `Mark ${card.name} as found`
              }
            />
            <span
              aria-hidden="true"
              className={`font-meta text-[10px] uppercase tracking-[0.2em] transition-colors ${
                isFound ? "text-primary" : "text-[var(--collection-ink-soft)]"
              }`}
            >
              Found
            </span>
          </label>

          <MapLink id={card.id} name={card.name} />
        </div>
      </footer>
    </article>
  );
}

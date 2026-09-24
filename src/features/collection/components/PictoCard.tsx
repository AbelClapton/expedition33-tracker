import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { PICTO_PIN_ICON } from "@/engine/utils/pictoIcon";
import { CollectionCardModel, CollectionViewMode } from "../types";
import styles from "../collection.module.css";

interface PictoCardProps {
  card: CollectionCardModel;
  isFound: boolean;
  viewMode: CollectionViewMode;
  onToggleFound: (id: string) => void;
}

export function PictoCard({
  card,
  isFound,
  viewMode,
  onToggleFound,
}: PictoCardProps) {
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

          <Checkbox
            checked={isFound}
            onCheckedChange={() => onToggleFound(card.id)}
            aria-label={
              isFound
                ? `Unmark ${card.name} as found`
                : `Mark ${card.name} as found`
            }
          />
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
        <button
          type="button"
          onClick={() => onToggleFound(card.id)}
          aria-pressed={isFound}
          title={
            isFound
              ? `Found - click to unmark ${card.name}`
              : `Click once you find ${card.name}`
          }
          className={`${styles.foundButton} border px-4 py-1 text-[10px] transition-all ${
            isFound
              ? "border-secondary bg-secondary/5 text-secondary shadow-[0_0_15px_rgba(89,218,209,0.2)]"
              : "border-[var(--collection-ink-soft)] text-[var(--collection-ink-soft)] opacity-40"
          }`}
        >
          FOUND
        </button>
      </footer>
    </article>
  );
}

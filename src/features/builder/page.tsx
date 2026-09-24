"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { luminas, pictos, pictosGroupedByLumina } from "@/engine/data";
import { BuildSummary } from "./components/BuildSummary";
import { SlotCard } from "./components/SlotCard";
import { ViewToggle } from "./components/ViewToggle";
import { PictoListPanel } from "./components/PictoListPanel";
import { LuminaGraphView } from "./components/LuminaGraphView";
import { useSlots } from "./hooks/useSlots";
import { useSynergy } from "./hooks/useSynergy";

const MAX_SLOTS = 3;

export default function BuildCanvas() {
  const [catalogMode, setCatalogMode] = useState<"pictos" | "luminas">(
    "pictos",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const {
    slots,
    selectPicto,
    removePicto,
    toggleLumina,
    selectedPictos,
    providedLuminaIds,
    addedLuminaIds,
    usedLuminaIds,
    activeLuminas,
    totalLuminaCost,
    totalStats,
  } = useSlots(MAX_SLOTS, pictos, luminas);

  const { synergyMatrix, suggestions } = useSynergy(luminas, usedLuminaIds);

  const slotItems = useMemo(
    () =>
      slots.map((pictoId, index) => {
        const picto = pictoId
          ? (pictos.find((item) => item.id === pictoId) ?? null)
          : null;
        const lumina = picto
          ? (luminas.find((item) => item.id === picto.luminaId) ?? null)
          : null;
        return { index, picto, lumina };
      }),
    [slots],
  );

  // ---- Render ----
  return (
    <main className="builder-shell">
      {/* Wrapper is a plain element so styled-jsx scopes it; the link inside is fixed, so the grid keeps its three panels */}
      <div className="builder-back">
        <Link href="/collections" aria-label="Back to the Library">
          <span aria-hidden="true">←</span>
          Library
        </Link>
      </div>

      <section className="panel panel-left">
        <ViewToggle currentView={catalogMode} onChange={setCatalogMode} />
        <header className="panel-title-wrap">
          <p className="eyebrow">Catalog</p>
          <h2 className="panel-title">Picto and Lumina Catalog</h2>
        </header>
        <PictoListPanel
          mode={catalogMode}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          pictos={pictos}
          luminas={luminas}
          pictosGroupedByLumina={pictosGroupedByLumina}
          providedLuminaIds={providedLuminaIds}
          addedLuminaIds={addedLuminaIds}
          usedLuminaIds={usedLuminaIds}
          selectedPictos={selectedPictos}
          onSelectPicto={selectPicto}
          onToggleLumina={toggleLumina}
          suggestions={suggestions}
        />
      </section>

      <section className="panel panel-center">
        <header className="panel-title-wrap">
          <p className="eyebrow">Build Board</p>
          <h2 className="panel-title">Slots and Synergy</h2>
        </header>

        {catalogMode === "pictos" ? (
          <section className="slot-row">
            {slotItems.map((item) => (
              <SlotCard
                key={item.index}
                slotIndex={item.index}
                picto={item.picto}
                lumina={item.lumina}
                onRemove={() => removePicto(item.index)}
              />
            ))}
          </section>
        ) : (
          <LuminaGraphView
            activeLuminas={activeLuminas}
            allLuminas={luminas}
            providedLuminaIds={providedLuminaIds}
            synergyMatrix={synergyMatrix}
            totalLuminaCost={totalLuminaCost}
            usedLuminaIds={usedLuminaIds}
          />
        )}
      </section>

      <aside className="panel panel-right">
        <header className="panel-title-wrap">
          <p className="eyebrow">Readout</p>
          <h2 className="panel-title">Build Summary</h2>
        </header>
        <BuildSummary totalStats={totalStats} activeLuminas={activeLuminas} />
      </aside>

      <style jsx>{`
        .builder-shell {
          --bg: #ece7db;
          --ink: #16130f;
          --panel: rgba(255, 251, 242, 0.78);
          --panel-border: rgba(78, 58, 34, 0.3);
          --accent: #a13f1b;
          position: relative;
          min-height: 100vh;
          /* room for the back-link, which sits above the panels */
          padding: 4.25rem 1.5rem 1.5rem;
          color: var(--ink);
          background:
            radial-gradient(
              circle at 12% 9%,
              rgba(161, 63, 27, 0.22),
              transparent 32%
            ),
            radial-gradient(
              circle at 92% 16%,
              rgba(54, 90, 107, 0.16),
              transparent 28%
            ),
            linear-gradient(180deg, #f6f1e5 0%, var(--bg) 100%);
          display: grid;
          grid-template-columns: minmax(260px, 1fr) minmax(460px, 2fr) minmax(
              260px,
              1fr
            );
          gap: 1rem;
          align-items: start;
          font-family: "Palatino Linotype", "Book Antiqua", Palatino, serif;
        }

        .builder-back {
          position: fixed;
          top: 1.25rem;
          left: 1.5rem;
          z-index: 20;
        }

        /* next/link renders the anchor itself, so it never gets the styled-jsx scope class */
        .builder-back :global(a) {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          border: 1px solid var(--panel-border);
          border-radius: 999px;
          background: var(--panel);
          padding: 0.4rem 0.9rem;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--accent);
          text-decoration: none;
          backdrop-filter: blur(7px);
          box-shadow: 0 10px 20px rgba(29, 22, 15, 0.12);
          transition:
            border-color 160ms ease,
            background-color 160ms ease;
        }

        .builder-back :global(a:hover),
        .builder-back :global(a:focus-visible) {
          border-color: rgba(161, 63, 27, 0.55);
          background: #fffaf2;
          outline: none;
        }

        .panel {
          background: var(--panel);
          border: 1px solid var(--panel-border);
          border-radius: 16px;
          padding: 1rem;
          backdrop-filter: blur(7px);
          box-shadow: 0 16px 26px rgba(29, 22, 15, 0.08);
        }

        .panel-title-wrap {
          margin-bottom: 0.85rem;
        }

        .eyebrow {
          margin: 0;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          font-size: 0.67rem;
          color: rgba(22, 19, 15, 0.7);
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          font-weight: 700;
        }

        .panel-title {
          margin: 0.2rem 0 0;
          font-size: 1.15rem;
          color: var(--accent);
          line-height: 1.2;
        }

        .panel-left,
        .panel-right {
          position: sticky;
          top: 4.25rem;
          max-height: calc(100vh - 5.25rem);
          overflow: auto;
        }

        .slot-row {
          display: flex;
          gap: 0.85rem;
          flex-wrap: wrap;
          margin-bottom: 1rem;
        }

        @media (max-width: 1180px) {
          .builder-shell {
            grid-template-columns: 1fr;
          }

          .panel-left,
          .panel-right {
            position: static;
            max-height: none;
          }
        }
      `}</style>
    </main>
  );
}

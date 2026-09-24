"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  COLLECTION_LAYER_GROUPS,
  COLLECTION_LAYERS,
  collectionLayersInGroup,
  isCollectionLayerActive,
  type CollectionLayer,
} from "../collectionLayers";
import layerIndex from "../data/layers.json";
import { useTracking } from "@/hooks/useTracking";
import { LayerIcon } from "./LayerIcon";

/** Entries the fetch script wrote per layer, keyed by layer id. */
const LAYER_INDEX = layerIndex.layers as Record<string, { count: number }>;

/** found/total per layer, supplied by whichever screen knows the real numbers. */
export type CollectionLayerCounts = Partial<
  Record<string, { found: number; total: number }>
>;

interface CollectionLayerNavProps {
  counts?: CollectionLayerCounts;
}

function countLabel(layer: CollectionLayer, counts?: CollectionLayerCounts) {
  const count = counts?.[layer.id];

  if (count) return `${count.found}/${count.total}`;
  if (layer.available)
    return `${LAYER_INDEX[layer.id]?.count ?? layer.expectedMarkers}`;

  return `${layer.expectedMarkers} soon`;
}

/** Second line of a sidebar row: real progress, or how big the layer will be. */
function layerMeta(layer: CollectionLayer, counts?: CollectionLayerCounts) {
  const count = counts?.[layer.id];

  if (count) return `${count.found}/${count.total} found`;
  if (layer.available)
    return `${LAYER_INDEX[layer.id]?.count ?? layer.expectedMarkers} entries`;

  return `${layer.expectedMarkers} markers · coming soon`;
}

/** How many of a layer's entries are marked, as a compact mark on the row. */
function TrackedMark({ count }: { count: number }) {
  if (count <= 0) return null;

  return (
    <span
      title={`${count} tracked`}
      className="chamfer chamfer-square chamfer-gold flex h-5 min-w-5 shrink-0 items-center justify-center [--chamfer-h:1.25rem] px-1 font-meta text-[9px] tracking-[0.1em] text-primary"
    >
      {count}
    </span>
  );
}

function LayerRow({
  layer,
  counts,
}: {
  layer: CollectionLayer;
  counts?: CollectionLayerCounts;
}) {
  const pathname = usePathname();
  const active = isCollectionLayerActive(pathname, layer.id);
  const tracking = useTracking();

  return (
    <Link
      href={`/collections/${layer.id}`}
      aria-current={active ? "page" : undefined}
      className={`group flex items-center gap-3 py-2 pl-6 pr-4 transition-all duration-500 ${
        active ? "text-primary" : "text-[#99907c] hover:text-white"
      }`}
    >
      <LayerIcon
        layer={layer}
        size={20}
        filled={active}
        className={`transition-transform group-hover:scale-110 ${
          active ? "drop-shadow-[0_0_10px_rgba(242,202,80,0.35)]" : ""
        }`}
      />
      <span className="min-w-0 flex-1">
        <span className="block truncate font-meta text-[10px] uppercase tracking-[0.14em]">
          {layer.label}
        </span>
        <span
          className={`block truncate font-meta text-[9px] tracking-[0.1em] ${
            active ? "text-primary/70" : "text-[#99907c]/60"
          }`}
        >
          {layerMeta(layer, counts)}
        </span>
      </span>
      <TrackedMark count={tracking.trackedByLayer[layer.id] ?? 0} />
    </Link>
  );
}

/** Sidebar list of collectible layers. Sits in the tracker shell's sidebar slot. */
export function CollectionLayerNav({ counts }: CollectionLayerNavProps) {
  return (
    <nav aria-label="Collectible layers" className="flex flex-col pb-4">
      {COLLECTION_LAYER_GROUPS.map((group) => (
        <div key={group.id} className="mb-2">
          <p className="pl-6 pr-4 pb-1 pt-4 font-meta text-[9px] uppercase tracking-[0.28em] text-[#99907c]/70">
            {group.label}
          </p>
          {collectionLayersInGroup(group.id).map((layer) => (
            <LayerRow key={layer.id} layer={layer} counts={counts} />
          ))}
        </div>
      ))}
    </nav>
  );
}

/** Same list as a horizontal strip, for small screens where the sidebar is hidden. */
export function CollectionLayerTabs({ counts }: CollectionLayerNavProps) {
  const pathname = usePathname();
  const tracking = useTracking();
  const stripRef = useRef<HTMLUListElement>(null);

  // The strip is 15 tabs wide, so the layer you are on is usually off-screen.
  // Centre it after every navigation, measuring rectangles rather than offsetLeft
  // (the strip's offsetParent is the shell's positioned content wrapper).
  useEffect(() => {
    const strip = stripRef.current;
    const active = strip?.querySelector<HTMLElement>('[aria-current="page"]');

    if (!strip || !active) return;

    const stripRect = strip.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();

    strip.scrollLeft +=
      activeRect.left -
      stripRect.left -
      (stripRect.width - activeRect.width) / 2;
  }, [pathname]);

  return (
    <nav aria-label="Collectible layers" className="-mx-4 mb-6 md:hidden">
      <ul
        ref={stripRef}
        className="chroma-scroll flex gap-2 overflow-x-auto px-4 pb-1.5"
      >
        {COLLECTION_LAYERS.map((layer) => {
          const active = isCollectionLayerActive(pathname, layer.id);
          const label = countLabel(layer, counts);

          return (
            <li key={layer.id} className="shrink-0">
              <Link
                href={`/collections/${layer.id}`}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2 border px-3 py-2 font-meta text-[10px] uppercase tracking-[0.18em] transition-colors ${
                  active
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-white/10 text-[#99907c] hover:border-primary/30 hover:text-primary"
                }`}
              >
                <LayerIcon layer={layer} size={16} />
                {layer.label}
                {label ? (
                  <span className="text-[8px] tracking-[0.1em] opacity-70">
                    {label.toUpperCase()}
                  </span>
                ) : null}
                {(tracking.trackedByLayer[layer.id] ?? 0) > 0 ? (
                  <span className="flex items-center gap-0.5 text-primary">
                    <span className="text-[8px] tracking-[0.1em]">
                      {tracking.trackedByLayer[layer.id]}
                    </span>
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

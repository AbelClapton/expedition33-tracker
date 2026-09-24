import type { CollectionLayer } from "../collectionLayers";
import { LayerIcon } from "./LayerIcon";

interface CollectionLayerPendingProps {
  layer: CollectionLayer;
}

/**
 * Placeholder for a layer that exists in the registry but has no data yet.
 * Deliberately not a spinner: it states what the layer will hold and where the
 * data is coming from, so the fetch step knows what it is filling in.
 */
export function CollectionLayerPending({ layer }: CollectionLayerPendingProps) {
  return (
    <section className="rounded-[0.25rem] border border-white/8 bg-[linear-gradient(180deg,rgba(31,34,39,0.92),rgba(12,14,17,0.98))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-sm md:p-8">
      <p className="font-meta text-[0.6rem] uppercase tracking-[0.28em] text-[var(--collection-ink-soft)]">
        Layer not wired yet
      </p>

      <div className="mt-3 flex items-center gap-4">
        <LayerIcon
          layer={layer}
          size={30}
          filled
          className="text-[var(--collection-primary)]/80"
        />
        <h2 className="font-heading text-2xl tracking-[0.04em] text-[var(--collection-primary)]">
          {layer.label}
        </h2>
      </div>

      <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--collection-ink-muted)]">
        {layer.blurb}
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-white/8 bg-black/20 p-4">
          <p className="font-meta text-[0.58rem] uppercase tracking-[0.2em] text-[var(--collection-ink-soft)]">
            Markers on the reference map
          </p>
          <p className="mt-1 text-2xl text-white">{layer.expectedMarkers}</p>
          <p className="mt-1 text-[0.7rem] text-[var(--collection-ink-soft)]">
            category &ldquo;{layer.mapCategory}&rdquo;
          </p>
        </div>
        <div className="rounded-lg border border-white/8 bg-black/20 p-4">
          <p className="font-meta text-[0.58rem] uppercase tracking-[0.2em] text-[var(--collection-ink-soft)]">
            In this archive
          </p>
          <p className="mt-1 text-2xl text-[var(--collection-ink-soft)]">
            &mdash;
          </p>
          <p className="mt-1 text-[0.7rem] text-[var(--collection-ink-soft)]">
            waiting on the data pass
          </p>
        </div>
      </div>

      <p className="mt-6 text-[0.72rem] leading-5 text-[var(--collection-ink-soft)]">
        The layer is registered, routed and linked already, so filling it in
        means adding this layer&apos;s entries to{" "}
        <code className="text-[var(--collection-ink-muted)]">
          src/features/collection
        </code>{" "}
        and, when it also belongs on the atlas, a matching entry in{" "}
        <code className="text-[var(--collection-ink-muted)]">MAP_LAYERS</code>.
      </p>
    </section>
  );
}

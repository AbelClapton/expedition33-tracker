import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CollectionPage from "@/features/collection/page";
import {
  COLLECTION_LAYER_IDS,
  getCollectionLayer,
} from "@/features/collection/collectionLayers";
import { LAYER_ENTRIES } from "@/features/collection/data/index.generated";

/** Every layer is prerendered, so the static export has no dynamic params left. */
export const dynamicParams = false;

export function generateStaticParams() {
  return COLLECTION_LAYER_IDS.map((layer) => ({ layer }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ layer: string }>;
}): Promise<Metadata> {
  const { layer } = await params;
  const entry = getCollectionLayer(layer);

  return entry ? { title: `${entry.label} - Picto Tracker` } : {};
}

export default async function CollectionLayerRoute({
  params,
}: {
  params: Promise<{ layer: string }>;
}) {
  const { layer } = await params;

  if (!getCollectionLayer(layer)) {
    notFound();
  }

  return <CollectionPage layerId={layer} entries={LAYER_ENTRIES[layer]} />;
}

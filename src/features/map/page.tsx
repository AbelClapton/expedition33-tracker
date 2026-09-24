"use client";

import { useMemo, useState } from "react";
import { TrackerShell } from "@/components/layout/TrackerShell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { pictos } from "@/engine/data";

type RegionSummary = {
  name: string;
  count: number;
  highestLevel: number;
  lowestLevel: number;
  samples: string[];
};

const FALLBACK_REGION = "Uncharted Expanse";

function extractRegion(location: string): string {
  const cleaned = location.trim();
  const withinMatch = cleaned.match(/within\s+([^\u2013\-.,;]+)/i);
  if (withinMatch?.[1]) {
    return withinMatch[1].trim();
  }

  const leadMatch = cleaned.match(/^([^\u2013\-]{3,60})\s*[\u2013\-]/);
  if (leadMatch?.[1]) {
    return leadMatch[1].trim();
  }

  const inMatch =
    cleaned.match(/\bin\s+the\s+([^.,;]+)/i) ??
    cleaned.match(/\bin\s+([^.,;]+)/i);
  if (inMatch?.[1]) {
    return inMatch[1]
      .replace(/^ruined\s+/i, "")
      .replace(/^abandoned\s+/i, "")
      .trim();
  }

  return FALLBACK_REGION;
}

function buildRegionSummaries(
  query: string,
  minLevel: number,
): RegionSummary[] {
  const normalizedQuery = query.trim().toLowerCase();
  const bucket = new Map<string, RegionSummary>();

  for (const picto of pictos) {
    if (picto.level < minLevel) {
      continue;
    }

    if (
      normalizedQuery &&
      !`${picto.name} ${picto.location}`.toLowerCase().includes(normalizedQuery)
    ) {
      continue;
    }

    const regionName = extractRegion(picto.location);
    const existing = bucket.get(regionName);
    if (!existing) {
      bucket.set(regionName, {
        name: regionName,
        count: 1,
        highestLevel: picto.level,
        lowestLevel: picto.level,
        samples: [picto.location],
      });
      continue;
    }

    existing.count += 1;
    existing.highestLevel = Math.max(existing.highestLevel, picto.level);
    existing.lowestLevel = Math.min(existing.lowestLevel, picto.level);
    if (
      existing.samples.length < 3 &&
      !existing.samples.includes(picto.location)
    ) {
      existing.samples.push(picto.location);
    }
  }

  return Array.from(bucket.values()).sort(
    (a, b) => b.count - a.count || b.highestLevel - a.highestLevel,
  );
}

function getNodePosition(index: number, total: number) {
  const angle = (Math.PI * 2 * index) / Math.max(total, 1) - Math.PI / 2;
  const radius = 40;
  const x = 50 + Math.cos(angle) * radius;
  const y = 50 + Math.sin(angle) * radius;
  return { x, y };
}

export default function MapPage() {
  const [search, setSearch] = useState("");
  const [minLevelRaw, setMinLevelRaw] = useState("1");
  const minLevel = Number(minLevelRaw);

  const regions = useMemo(
    () => buildRegionSummaries(search, Number.isNaN(minLevel) ? 1 : minLevel),
    [search, minLevel],
  );
  const [selectedRegion, setSelectedRegion] = useState<string>("");

  // A region the filters removed falls back to the first row, so the selection
  // does not need to be corrected in an effect
  const focusedRegion =
    regions.find((region) => region.name === selectedRegion) ??
    regions[0] ??
    null;
  const activeRegion = focusedRegion?.name ?? "";
  const totalPins = regions.reduce((sum, region) => sum + region.count, 0);

  return (
    <TrackerShell>
      <div className="space-y-6 pb-12">
        <header className="space-y-3">
          <p className="font-meta text-[0.66rem] uppercase tracking-[0.22em] text-[var(--collection-ink-soft)]">
            World Atlas
          </p>
          <h1 className="font-heading text-3xl text-primary md:text-4xl">
            Expedition Map
          </h1>
          <p className="max-w-3xl text-sm text-[var(--collection-ink-muted)]">
            Survey every known region where pictos are discovered. Filter by
            level or search a location clue to narrow your route.
          </p>
        </header>

        <section className="grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)_340px]">
          <Card className="border border-border/80 bg-card/80 backdrop-blur-sm">
            <CardHeader className="space-y-3 pb-3">
              <CardTitle className="text-lg text-primary">
                Route Filters
              </CardTitle>
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by picto or clue"
                className="bg-[#121418]"
              />
              <Select
                value={minLevelRaw}
                onValueChange={(value) => setMinLevelRaw(value ?? "1")}
              >
                <SelectTrigger className="bg-[#121418]">
                  <SelectValue placeholder="Minimum level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Level 1+</SelectItem>
                  <SelectItem value="10">Level 10+</SelectItem>
                  <SelectItem value="20">Level 20+</SelectItem>
                  <SelectItem value="30">Level 30+</SelectItem>
                </SelectContent>
              </Select>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="rounded-md border border-border/70 bg-black/20 px-2 py-2">
                  <p className="font-meta text-[0.6rem] uppercase tracking-[0.16em] text-[var(--collection-ink-soft)]">
                    Regions
                  </p>
                  <p className="text-lg font-semibold text-primary">
                    {regions.length}
                  </p>
                </div>
                <div className="rounded-md border border-border/70 bg-black/20 px-2 py-2">
                  <p className="font-meta text-[0.6rem] uppercase tracking-[0.16em] text-[var(--collection-ink-soft)]">
                    Pictos
                  </p>
                  <p className="text-lg font-semibold text-primary">
                    {totalPins}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {regions.slice(0, 12).map((region) => (
                <button
                  key={region.name}
                  type="button"
                  onClick={() => setSelectedRegion(region.name)}
                  className={`w-full rounded-md border px-3 py-2 text-left transition-colors ${
                    activeRegion === region.name
                      ? "border-primary/70 bg-primary/10 text-primary"
                      : "border-border/70 bg-[#15181d] text-[var(--collection-ink-muted)] hover:border-primary/40 hover:text-primary"
                  }`}
                >
                  <p className="truncate text-sm font-medium">{region.name}</p>
                  <p className="font-meta text-[0.6rem] uppercase tracking-[0.15em]">
                    {region.count} sightings
                  </p>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border border-border/80 bg-[linear-gradient(180deg,#14181f_0%,#0e1117_100%)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(89,218,209,0.2),transparent_40%),radial-gradient(circle_at_80%_15%,rgba(242,202,80,0.24),transparent_45%),radial-gradient(circle_at_50%_100%,rgba(115,87,191,0.15),transparent_45%)]" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-lg text-primary">
                Regional Constellation
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 pb-6">
              <div className="relative mx-auto aspect-square w-full max-w-[620px] rounded-full border border-primary/25 bg-[#0a0d12]/85 shadow-[inset_0_0_80px_rgba(7,10,14,0.9)]">
                <div className="absolute inset-[14%] rounded-full border border-primary/20" />
                <div className="absolute inset-[30%] rounded-full border border-secondary/20" />
                {regions.slice(0, 12).map((region, index, source) => {
                  const position = getNodePosition(index, source.length);
                  return (
                    <button
                      key={region.name}
                      type="button"
                      onClick={() => setSelectedRegion(region.name)}
                      className="absolute -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${position.x}%`, top: `${position.y}%` }}
                    >
                      <span
                        className={`block rounded-full border px-3 py-1 text-[0.68rem] shadow-lg transition-colors ${
                          activeRegion === region.name
                            ? "border-primary bg-[#3d3110] text-primary"
                            : "border-border/80 bg-[#171c24]/95 text-[var(--collection-ink-muted)] hover:border-primary/50 hover:text-primary"
                        }`}
                      >
                        {region.name}
                      </span>
                    </button>
                  );
                })}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/70 bg-[#2b220d] px-4 py-2 text-center shadow-[0_0_30px_rgba(242,202,80,0.22)]">
                  <p className="font-meta text-[0.55rem] uppercase tracking-[0.2em] text-[var(--collection-ink-soft)]">
                    Navigator
                  </p>
                  <p className="font-heading text-sm text-primary">
                    Gustave Route
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/80 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-primary">
                Region Intel
              </CardTitle>
            </CardHeader>
            <CardContent>
              {focusedRegion ? (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">
                      {focusedRegion.name}
                    </h2>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="outline">
                        {focusedRegion.count} pictos
                      </Badge>
                      <Badge variant="outline">
                        Lv {focusedRegion.lowestLevel} -{" "}
                        {focusedRegion.highestLevel}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="font-meta text-[0.62rem] uppercase tracking-[0.18em] text-[var(--collection-ink-soft)]">
                      Sample Clues
                    </p>
                    {focusedRegion.samples.map((sample) => (
                      <p
                        key={sample}
                        className="rounded-md border border-border/70 bg-[#13171d] px-3 py-2 text-xs text-[var(--collection-ink-muted)]"
                      >
                        {sample}
                      </p>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-[var(--collection-ink-muted)]">
                  No mapped regions match the current filters.
                </p>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </TrackerShell>
  );
}

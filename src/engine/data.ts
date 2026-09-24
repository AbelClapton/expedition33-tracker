import luminasJson from './data/luminas.json';
import pictosJson from './data/pictos.json';
import { Lumina, Picto, Stats } from './types';

const EMPTY_STATS: Stats = {
    health: 0,
    defense: 0,
    speed: 0,
    critRate: 0
};

function normalizeStats(stats: unknown): Stats {
    if (!stats || typeof stats !== 'object') {
        return EMPTY_STATS;
    }

    const source = stats as Partial<Stats>;
    return {
        health: source.health ?? 0,
        defense: source.defense ?? 0,
        speed: source.speed ?? 0,
        critRate: source.critRate ?? 0
    };
}

function isValidLumina(candidate: unknown): candidate is { id: string; name: string; description?: string; rules: unknown[] } {
    if (!candidate || typeof candidate !== 'object') {
        return false;
    }

    const value = candidate as { id?: unknown; name?: unknown; description?: unknown; rules?: unknown };
    return typeof value.id === 'string' && typeof value.name === 'string' && Array.isArray(value.rules);
}

function isValidPicto(candidate: unknown): candidate is {
    id: string;
    name: string;
    location: string;
    luminaId: string;
    level: number;
    stats?: unknown;
} {
    if (!candidate || typeof candidate !== 'object') {
        return false;
    }

    const value = candidate as {
        id?: unknown;
        name?: unknown;
        location?: unknown;
        luminaId?: unknown;
        level?: unknown;
    };

    return (
        typeof value.id === 'string' &&
        typeof value.name === 'string' &&
        typeof value.location === 'string' &&
        typeof value.luminaId === 'string' &&
        typeof value.level === 'number'
    );
}

export const luminas: Lumina[] = (luminasJson as unknown[])
    .filter(isValidLumina)
    .map(item => ({
        id: item.id,
        name: item.name,
        description: typeof item.description === 'string' ? item.description : undefined,
        rules: item.rules as Lumina['rules']
    }));

export const pictos: Picto[] = (pictosJson as unknown[])
    .filter(isValidPicto)
    .map(item => ({
        id: item.id,
        name: item.name,
        location: item.location,
        luminaId: item.luminaId,
        level: item.level,
        stats: normalizeStats(item.stats)
    }));

export const getPictosByLumina = (luminaId: string) =>
    pictos.filter(p => p.luminaId === luminaId).sort((a, b) => b.level - a.level);

export const pictosGroupedByLumina = pictos.reduce((acc, p) => {
    if (!acc[p.luminaId]) acc[p.luminaId] = [];
    acc[p.luminaId].push(p);
    return acc;
}, {} as Record<string, Picto[]>);
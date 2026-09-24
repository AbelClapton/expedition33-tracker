import { useMemo } from 'react';
import { Lumina, SynergyDetail, SynergyPattern } from '@/engine/types';
import { buildSynergyMatrix, getSuggestions } from '@/engine/utils/synergy';

interface UseSynergyResult {
    synergyMatrix: Record<string, Record<string, SynergyDetail>>;
    suggestions: { lumina: Lumina; score: number; patterns: SynergyPattern[] }[];
}

export function useSynergy(allLuminas: Lumina[], selectedIds: string[]): UseSynergyResult {
    const synergyMatrix = useMemo(() => buildSynergyMatrix(allLuminas), [allLuminas]);

    const suggestions = useMemo(
        () => getSuggestions(selectedIds, allLuminas, synergyMatrix),
        [selectedIds, allLuminas, synergyMatrix]
    );

    return { synergyMatrix, suggestions };
}

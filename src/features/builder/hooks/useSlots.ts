import { useMemo, useState } from 'react';
import { Lumina, Picto, Stats } from '@/engine/types';

interface UseSlotsResult {
    slots: (string | null)[];
    selectPicto: (pictoId: string) => void;
    removePicto: (slotIndex: number) => void;
    toggleLumina: (luminaId: string) => void;
    selectedPictos: Picto[];
    providedLuminaIds: string[];
    addedLuminaIds: string[];
    usedLuminaIds: string[];
    activeLuminas: Lumina[];
    totalLuminaCost: number;
    totalStats: Stats;
}

const EMPTY_STATS: Stats = {
    health: 0,
    defense: 0,
    speed: 0,
    critRate: 0
};

export function useSlots(maxSlots: number, allPictos: Picto[], allLuminas: Lumina[]): UseSlotsResult {
    const [slots, setSlots] = useState<(string | null)[]>(Array(maxSlots).fill(null));
    const [addedLuminaIds, setAddedLuminaIds] = useState<string[]>([]);

    const selectedPictos = useMemo(
        () =>
            slots
                .map(id => allPictos.find(p => p.id === id))
                .filter((p): p is Picto => Boolean(p)),
        [slots, allPictos]
    );

    const providedLuminaIds = useMemo(
        () => [...new Set(selectedPictos.map(p => p.luminaId))],
        [selectedPictos]
    );

    const usedLuminaIds = useMemo(
        () => [
            ...providedLuminaIds,
            ...addedLuminaIds.filter(id => !providedLuminaIds.includes(id))
        ],
        [providedLuminaIds, addedLuminaIds]
    );

    const activeLuminas = useMemo(() => {
        return usedLuminaIds
            .map(id => allLuminas.find(l => l.id === id))
            .filter((l): l is Lumina => Boolean(l));
    }, [usedLuminaIds, allLuminas]);

    const totalLuminaCost = useMemo(() => {
        return addedLuminaIds.reduce((total, luminaId) => {
            const matchingPictos = allPictos.filter(p => p.luminaId === luminaId);
            if (matchingPictos.length === 0) {
                return total;
            }

            const luminaCost = Math.min(...matchingPictos.map(p => p.level));
            return total + luminaCost;
        }, 0);
    }, [addedLuminaIds, allPictos]);

    const totalStats = useMemo(() => {
        return selectedPictos.reduce<Stats>(
            (acc, picto) => ({
                health: acc.health + picto.stats.health,
                defense: acc.defense + picto.stats.defense,
                speed: acc.speed + picto.stats.speed,
                critRate: acc.critRate + picto.stats.critRate
            }),
            EMPTY_STATS
        );
    }, [selectedPictos]);

    const selectPicto = (pictoId: string) => {
        const incoming = allPictos.find(p => p.id === pictoId);
        if (!incoming) return;

        setAddedLuminaIds(prev => prev.filter(id => id !== incoming.luminaId));

        setSlots(prev => {
            const sameLuminaIndex = prev.findIndex(existingId => {
                if (!existingId) return false;
                const existingPicto = allPictos.find(p => p.id === existingId);
                return existingPicto?.luminaId === incoming.luminaId;
            });

            if (sameLuminaIndex !== -1) {
                const next = [...prev];
                next[sameLuminaIndex] = pictoId;
                return next;
            }

            const firstEmpty = prev.findIndex(slotId => slotId === null);
            if (firstEmpty !== -1) {
                const next = [...prev];
                next[firstEmpty] = pictoId;
                return next;
            }

            return prev;
        });
    };

    const toggleLumina = (luminaId: string) => {
        if (!allLuminas.some(lumina => lumina.id === luminaId)) {
            return;
        }

        if (providedLuminaIds.includes(luminaId)) {
            return;
        }

        setAddedLuminaIds(prev =>
            prev.includes(luminaId)
                ? prev.filter(id => id !== luminaId)
                : [...prev, luminaId]
        );
    };

    const removePicto = (slotIndex: number) => {
        setSlots(prev => {
            if (slotIndex < 0 || slotIndex >= prev.length) return prev;
            const next = [...prev];
            next[slotIndex] = null;
            return next;
        });
    };

    return {
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
        totalStats
    };
}

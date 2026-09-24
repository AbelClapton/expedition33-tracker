'use client';
import { useState } from 'react';
import { Lumina, Picto, SynergyPattern } from '@/engine/types';
import { describeRule } from '@/engine/utils/describeRule';
import { patternMatchesFilter, SynergyBadge } from './SynergyBadge';

interface Suggestion {
    lumina: Lumina;
    score: number;
    patterns: SynergyPattern[];
}

interface PictoListPanelProps {
    mode: 'pictos' | 'luminas';
    searchQuery: string;
    onSearchQueryChange: (value: string) => void;
    pictos: Picto[];
    luminas: Lumina[];
    pictosGroupedByLumina: Record<string, Picto[]>;
    providedLuminaIds: string[];
    addedLuminaIds: string[];
    usedLuminaIds: string[];
    selectedPictos: Picto[];
    onSelectPicto: (pictoId: string) => void;
    onToggleLumina: (luminaId: string) => void;
    suggestions: Suggestion[];
}

export function PictoListPanel({
    mode,
    searchQuery,
    onSearchQueryChange,
    pictos,
    luminas,
    pictosGroupedByLumina,
    providedLuminaIds,
    addedLuminaIds,
    usedLuminaIds,
    selectedPictos,
    onSelectPicto,
    onToggleLumina,
    suggestions
}: PictoListPanelProps) {
    const normalizedSearch = (searchQuery ?? '').trim().toLowerCase();
    const luminasById = new Map(luminas.map(lumina => [lumina.id, lumina]));
    const suggestionMap = new Map(suggestions.map(suggestion => [suggestion.lumina.id, suggestion]));

    const formatStats = (picto: Picto) => {
        const chunks: string[] = [];
        if (picto.stats.health > 0) chunks.push(`+${picto.stats.health} Health`);
        if (picto.stats.defense > 0) chunks.push(`+${picto.stats.defense} Defense`);
        if (picto.stats.speed > 0) chunks.push(`+${picto.stats.speed} Speed`);
        if (picto.stats.critRate > 0) chunks.push(`+${picto.stats.critRate} Crit Rate`);
        return chunks.length > 0 ? chunks.join(' • ') : 'No stat bonus listed';
    };

    const getLuminaEffectText = (lumina: Lumina | undefined) => {
        if (!lumina) return 'No lumina effect data available.';
        if (lumina.description) return lumina.description;
        if (lumina.rules.length > 0) return describeRule(lumina.rules[0]);
        return 'No lumina effect data available.';
    };

    const getLuminaCostText = (variants: Picto[]) => {
        if (variants.length === 0) return 'N/A';
        const levels = variants.map(variant => variant.level);
        const min = Math.min(...levels);
        const max = Math.max(...levels);
        return min === max ? `${min}` : `${min}-${max}`;
    };

    const [activeFilters, setActiveFilters] = useState<string[]>([]);

    const toggleFilter = (filter: string) => {
        setActiveFilters(prev =>
            prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
        );
    };

    const filterMatchesPattern = (filter: string, patterns: SynergyPattern[]): boolean =>
        patterns.some(pattern => {
            if (filter === 'Negative' && pattern.score < 0) {
                return true;
            }

            return patternMatchesFilter(pattern.name, filter as 'AP' | 'Status' | 'Buff' | 'Negative');
        });

    const filteredSuggestions = activeFilters.length === 0
        ? suggestions
        : suggestions.filter(s => activeFilters.every(f => filterMatchesPattern(f, s.patterns)));

    const filteredLuminas = luminas.filter(lumina => {
        if (!lumina.name.toLowerCase().includes(normalizedSearch)) {
            return false;
        }

        if (activeFilters.length === 0) {
            return true;
        }

        const suggestion = suggestionMap.get(lumina.id);
        if (!suggestion) {
            return false;
        }

        return activeFilters.every(filter => filterMatchesPattern(filter, suggestion.patterns));
    });
    const filteredPictos = pictos ?
        pictos.filter(picto => picto.name.toLowerCase().includes(normalizedSearch))
            .sort((a, b) => {
                const byName = a.name.localeCompare(b.name);
                if (byName !== 0) return byName;
                return b.level - a.level;
            }) : [];

    return (
        <section
            style={{
                maxHeight: '70vh',
                overflowY: 'auto',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '1rem',
                background: '#ffffff'
            }}
        >
            <input
                type="search"
                value={searchQuery}
                onChange={event => onSearchQueryChange(event.target.value)}
                placeholder={`Search ${mode === 'pictos' ? 'pictos' : 'luminas'} by name...`}
                aria-label="Search by name"
                style={{
                    width: '100%',
                    marginBottom: '0.9rem',
                    padding: '0.55rem 0.7rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    background: '#f8fafc',
                    color: '#111827'
                }}
            />

            {suggestions.length > 0 && (
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.9rem' }}>
                    <span style={{ fontSize: '0.78rem', color: '#6b7280', alignSelf: 'center', marginRight: '0.2rem' }}>
                        Filter by synergy pattern:
                    </span>
                    {(['AP', 'Status', 'Buff', 'Negative'] as const).map(filter => {
                        const active = activeFilters.includes(filter);
                        const color = filter === 'AP' ? '#4caf50' : filter === 'Status' ? '#2196f3' : filter === 'Buff' ? '#ff9800' : '#f44336';
                        return (
                            <button
                                key={filter}
                                onClick={() => toggleFilter(filter)}
                                style={{
                                    padding: '2px 10px',
                                    borderRadius: '12px',
                                    border: `1px solid ${color}`,
                                    background: active ? color : 'transparent',
                                    color: active ? '#fff' : color,
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                {filter}
                            </button>
                        );
                    })}
                </div>
            )}

            {mode === 'pictos' ? (
                <>
                    <h3 style={{ marginTop: 0, color: '#111827' }}>All Pictos ({filteredPictos.length})</h3>
                    {filteredPictos.map(picto => {
                        const selected = selectedPictos.some(p => p.id === picto.id);
                        const equipped = usedLuminaIds.includes(picto.luminaId);
                        const linkedLumina = luminasById.get(picto.luminaId);

                        return (
                            <div
                                key={picto.id}
                                style={{
                                    marginBottom: '0.75rem',
                                    padding: '0.7rem',
                                    borderRadius: '10px',
                                    background: selected ? '#e9f9ef' : '#f8fafc',
                                    border: selected ? '2px solid #16a34a' : '1px solid #d1d5db'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                                    <strong style={{ color: '#111827' }}>{picto.name}</strong>
                                    <span style={{ color: '#374151', fontWeight: 700 }}>Lv.{picto.level}</span>
                                </div>
                                <p style={{ margin: '0.35rem 0 0', fontSize: '0.82rem', color: '#4b5563' }}>
                                    <strong style={{ color: '#1f2937' }}>Stats:</strong> {formatStats(picto)}
                                </p>
                                <p style={{ margin: '0.28rem 0 0', fontSize: '0.82rem', color: '#4b5563' }}>
                                    <strong style={{ color: '#1f2937' }}>Lumina Effect:</strong> {getLuminaEffectText(linkedLumina)}
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.55rem', alignItems: 'center', gap: '0.6rem' }}>
                                    <span style={{ color: equipped ? '#15803d' : '#6b7280', fontSize: '0.8rem' }}>
                                        {equipped ? 'Lumina already equipped' : 'Available'}
                                    </span>
                                    <button
                                        onClick={() => onSelectPicto(picto.id)}
                                        style={{
                                            padding: '0.34rem 0.65rem',
                                            borderRadius: '6px',
                                            border: '1px solid #d1d5db',
                                            background: selected ? '#16a34a' : '#eef2f7',
                                            color: selected ? '#ffffff' : '#1f2937',
                                            fontWeight: selected ? 700 : 500,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {selected ? 'Selected' : 'Equip'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                    {filteredPictos.length === 0 && (
                        <p style={{ margin: 0, color: '#6b7280' }}>No pictos match your search.</p>
                    )}
                </>
            ) : (
                <>
                    <h3 style={{ marginTop: 0, color: '#111827' }}>All Luminas ({filteredLuminas.length})</h3>
                    {filteredLuminas.map(lumina => {
                        const variants = pictosGroupedByLumina[lumina.id] ?? [];
                        const equippedPicto = selectedPictos.find(p => p.luminaId === lumina.id);
                        const isProvidedByPicto = providedLuminaIds.includes(lumina.id);
                        const isAddedLumina = addedLuminaIds.includes(lumina.id);
                        const effectText = getLuminaEffectText(lumina);
                        const luminaCost = getLuminaCostText(variants);
                        const statusText = isProvidedByPicto
                            ? `Provided by selected picto${equippedPicto ? ` (Lv.${equippedPicto.level})` : ''}`
                            : isAddedLumina
                                ? 'Added to lumina loadout'
                                : 'Not active';

                        return (
                            <div
                                key={lumina.id}
                                style={{
                                    marginBottom: '0.75rem',
                                    padding: '0.75rem',
                                    borderRadius: '10px',
                                    background: isProvidedByPicto ? '#e9f9ef' : isAddedLumina ? '#eff6ff' : '#f8fafc',
                                    border: isProvidedByPicto ? '2px solid #16a34a' : isAddedLumina ? '2px solid #2563eb' : '1px solid #d1d5db'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                                    <strong style={{ color: '#111827' }}>{lumina.name}</strong>
                                    <span style={{ color: isProvidedByPicto ? '#15803d' : isAddedLumina ? '#1d4ed8' : '#6b7280', fontWeight: 700, fontSize: '0.8rem' }}>
                                        {statusText}
                                    </span>
                                </div>
                                <p style={{ margin: '0.38rem 0 0', fontSize: '0.82rem', color: '#4b5563' }}>
                                    <strong style={{ color: '#1f2937' }}>Effect:</strong> {effectText}
                                </p>
                                <p style={{ margin: '0.18rem 0 0', fontSize: '0.82rem', color: '#4b5563' }}>
                                    <strong style={{ color: '#1f2937' }}>Lumina Cost:</strong> {luminaCost}
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.55rem', alignItems: 'center', gap: '0.6rem' }}>
                                    <span style={{ color: '#6b7280', fontSize: '0.8rem' }}>
                                        {isProvidedByPicto ? 'Included in graph for free' : isAddedLumina ? 'Counts toward lumina cost' : 'Can be added to graph'}
                                    </span>
                                    <button
                                        type="button"
                                        disabled={isProvidedByPicto}
                                        onClick={() => onToggleLumina(lumina.id)}
                                        style={{
                                            padding: '0.34rem 0.65rem',
                                            borderRadius: '6px',
                                            border: '1px solid #d1d5db',
                                            background: isProvidedByPicto ? '#dcfce7' : isAddedLumina ? '#2563eb' : '#eef2f7',
                                            color: isProvidedByPicto ? '#166534' : isAddedLumina ? '#ffffff' : '#1f2937',
                                            fontWeight: isProvidedByPicto || isAddedLumina ? 700 : 500,
                                            cursor: isProvidedByPicto ? 'default' : 'pointer',
                                            opacity: isProvidedByPicto ? 0.9 : 1
                                        }}
                                    >
                                        {isProvidedByPicto ? 'Provided' : isAddedLumina ? 'Remove' : 'Add'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                    {filteredLuminas.length === 0 && (
                        <p style={{ margin: 0, color: '#6b7280' }}>No luminas match your search.</p>
                    )}
                </>
            )}

            {suggestions.length > 0 && (
                <div style={{ marginTop: '1.4rem' }}>
                    <h3 style={{ color: '#111827', marginBottom: '0.5rem' }}>Suggested Luminas (Synergy)</h3>

                    {filteredSuggestions.length === 0 && (
                        <p style={{ margin: 0, fontSize: '0.84rem', color: '#6b7280' }}>No suggestions match the active filters.</p>
                    )}

                    {filteredSuggestions.map(suggestion => {
                        const topPatterns = [...suggestion.patterns]
                            .sort((a, b) => Math.abs(b.score) - Math.abs(a.score))
                            .slice(0, 3);
                        const scoreLabel = suggestion.score > 0 ? `+${suggestion.score}` : `${suggestion.score}`;
                        return (
                            <div
                                key={suggestion.lumina.id}
                                style={{
                                    padding: '0.65rem 0.75rem',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '10px',
                                    marginBottom: '0.5rem',
                                    background: '#f8fafc',
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                                    <span style={{ fontWeight: 600, color: '#1f2937', fontSize: '0.92rem' }}>{suggestion.lumina.name}</span>
                                    <span
                                        style={{
                                            fontWeight: 700,
                                            fontSize: '0.88rem',
                                            color: suggestion.score >= 0 ? '#16a34a' : '#dc2626',
                                            background: suggestion.score >= 0 ? '#f0fdf4' : '#fef2f2',
                                            padding: '1px 8px',
                                            borderRadius: '8px',
                                            border: `1px solid ${suggestion.score >= 0 ? '#bbf7d0' : '#fecaca'}`,
                                        }}
                                    >
                                        {scoreLabel} pts
                                    </span>
                                </div>
                                {topPatterns.length > 0 && (
                                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                                        {topPatterns.map((pattern, i) => (
                                            <SynergyBadge
                                                key={i}
                                                patternName={pattern.name}
                                                score={pattern.score}
                                                title={`${pattern.name} (${pattern.score > 0 ? '+' : ''}${pattern.score})`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}

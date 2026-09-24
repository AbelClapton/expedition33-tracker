import { CSSProperties, useMemo, useState } from 'react';
import { Lumina, SynergyDetail } from '@/engine/types';
import { SynergyBadge, getPatternColor } from './SynergyBadge';
import { SynergyDetailPanel } from './SynergyDetailPanel';

interface LuminaGraphViewProps {
    activeLuminas: Lumina[];
    allLuminas: Lumina[];
    providedLuminaIds: string[];
    synergyMatrix: Record<string, Record<string, SynergyDetail>>;
    totalLuminaCost: number;
    usedLuminaIds: string[];
}

export function LuminaGraphView({
    activeLuminas,
    allLuminas,
    providedLuminaIds,
    synergyMatrix,
    totalLuminaCost,
    usedLuminaIds
}: LuminaGraphViewProps) {
    const [hoveredConnection, setHoveredConnection] = useState<{
        luminaA: Lumina;
        luminaB: Lumina;
        detail: SynergyDetail;
        x: number;
        y: number;
    } | null>(null);
    const [selectedConnection, setSelectedConnection] = useState<{
        luminaA: Lumina;
        luminaB: Lumina;
        detail: SynergyDetail;
    } | null>(null);

    const activeConnections = useMemo(() => {
        return activeLuminas.flatMap((lumina, index) =>
            activeLuminas.slice(index + 1).map(other => ({
                luminaA: lumina,
                luminaB: other,
                detail: synergyMatrix[lumina.id]?.[other.id] ?? { total: 0, patterns: [] }
            }))
        ).filter(connection => connection.detail.total !== 0);
    }, [activeLuminas, synergyMatrix]);

    const nodePositions = useMemo(() => {
        const positions = new Map<string, { x: number; y: number }>();
        const total = Math.max(activeLuminas.length, 1);
        const radius = 34;
        const centerX = 50;
        const centerY = 50;

        activeLuminas.forEach((lumina, index) => {
            const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
            positions.set(lumina.id, {
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius
            });
        });

        return positions;
    }, [activeLuminas]);

    const getConnectionStroke = (detail: SynergyDetail) => {
        const strongestPattern = [...detail.patterns].sort((a, b) => Math.abs(b.score) - Math.abs(a.score))[0];
        return strongestPattern ? getPatternColor(strongestPattern.name) : '#94a3b8';
    };

    const getConnectionWidth = (total: number) => {
        return Math.max(1, Math.min(4, Math.abs(total) / 3));
    };

    const getLineStyle = (detail: SynergyDetail): CSSProperties => ({
        stroke: getConnectionStroke(detail),
        strokeWidth: getConnectionWidth(detail.total),
        strokeDasharray: detail.total < 0 ? '8 6' : undefined,
        cursor: 'pointer'
    });

    return (
        <>
            <section
                style={{
                    background: '#f8fbff',
                    border: '1px solid #dbeafe',
                    borderRadius: '12px',
                    padding: '1rem'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: '0.9rem' }}>
                    <div>
                        <h3 style={{ margin: 0, color: '#1e3a8a' }}>Lumina Synergy Graph</h3>
                        <p style={{ margin: '0.35rem 0 0', color: '#64748b', fontSize: '0.86rem' }}>
                            Luminas from selected pictos are always included. Extra luminas can be added from the catalog.
                        </p>
                    </div>
                    <div
                        style={{
                            borderRadius: '12px',
                            border: '1px solid #bfdbfe',
                            background: '#ffffff',
                            padding: '0.65rem 0.85rem',
                            minWidth: '220px'
                        }}
                    >
                        <div style={{ fontSize: '0.74rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>
                            Lumina Cost
                        </div>
                        <div style={{ marginTop: '0.2rem', fontSize: '1.4rem', fontWeight: 700, color: '#1d4ed8' }}>
                            {totalLuminaCost}
                        </div>
                        <div style={{ marginTop: '0.2rem', color: '#64748b', fontSize: '0.8rem' }}>
                            Only added luminas count toward the total.
                        </div>
                    </div>
                </div>

                {activeLuminas.length === 0 ? (
                    <p style={{ margin: 0, color: '#6b7280' }}>Equip pictos to view synergy links.</p>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <div
                            style={{
                                position: 'relative',
                                minHeight: '460px',
                                borderRadius: '16px',
                                border: '1px solid #bfdbfe',
                                background:
                                    'radial-gradient(circle at 50% 50%, rgba(147, 197, 253, 0.18), transparent 38%), linear-gradient(180deg, #ffffff 0%, #eff6ff 100%)',
                                overflow: 'hidden'
                            }}
                        >
                            <svg
                                viewBox="0 0 100 100"
                                preserveAspectRatio="none"
                                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                                aria-hidden="true"
                            >
                                {activeConnections.map(connection => {
                                    const start = nodePositions.get(connection.luminaA.id);
                                    const end = nodePositions.get(connection.luminaB.id);

                                    if (!start || !end) {
                                        return null;
                                    }

                                    return (
                                        <line
                                            key={`${connection.luminaA.id}-${connection.luminaB.id}`}
                                            x1={start.x}
                                            y1={start.y}
                                            x2={end.x}
                                            y2={end.y}
                                            style={getLineStyle(connection.detail)}
                                            onMouseEnter={() => setHoveredConnection({
                                                ...connection,
                                                x: (start.x + end.x) / 2,
                                                y: (start.y + end.y) / 2
                                            })}
                                            onMouseLeave={() => setHoveredConnection(current => {
                                                if (
                                                    current
                                                    && current.luminaA.id === connection.luminaA.id
                                                    && current.luminaB.id === connection.luminaB.id
                                                ) {
                                                    return null;
                                                }

                                                return current;
                                            })}
                                            onClick={() => setSelectedConnection(connection)}
                                        >
                                            <title>
                                                {`${connection.luminaA.name} ↔ ${connection.luminaB.name} | Total ${connection.detail.total > 0 ? '+' : ''}${connection.detail.total}\n${connection.detail.patterns
                                                    .map(pattern => `${pattern.name} (${pattern.score > 0 ? '+' : ''}${pattern.score})`)
                                                    .join('\n')}`}
                                            </title>
                                        </line>
                                    );
                                })}
                            </svg>

                            {hoveredConnection && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        left: `${hoveredConnection.x}%`,
                                        top: `${hoveredConnection.y}%`,
                                        transform: 'translate(-50%, -115%)',
                                        minWidth: '220px',
                                        maxWidth: '280px',
                                        padding: '0.7rem',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(78, 58, 34, 0.18)',
                                        background: 'rgba(255, 253, 247, 0.97)',
                                        boxShadow: '0 18px 34px rgba(22, 19, 15, 0.16)',
                                        zIndex: 3,
                                        pointerEvents: 'none'
                                    }}
                                >
                                    <div style={{ fontWeight: 700, color: '#1f2937', fontSize: '0.84rem' }}>
                                        {hoveredConnection.luminaA.name} ↔ {hoveredConnection.luminaB.name}
                                    </div>
                                    <div style={{ marginTop: '0.2rem', color: hoveredConnection.detail.total >= 0 ? '#2563eb' : '#dc2626', fontWeight: 700, fontSize: '0.82rem' }}>
                                        Total {hoveredConnection.detail.total > 0 ? '+' : ''}
                                        {hoveredConnection.detail.total}
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.45rem' }}>
                                        {hoveredConnection.detail.patterns.slice(0, 4).map((pattern, index) => (
                                            <SynergyBadge
                                                key={`${pattern.name}-${index}`}
                                                patternName={pattern.name}
                                                score={pattern.score}
                                                title={`${pattern.name} (${pattern.score > 0 ? '+' : ''}${pattern.score})`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeLuminas.map(lumina => {
                                const position = nodePositions.get(lumina.id);
                                const links = activeLuminas
                                    .filter(other => other.id !== lumina.id)
                                    .map(other => ({
                                        lumina: other,
                                        detail: synergyMatrix[lumina.id]?.[other.id] ?? { total: 0, patterns: [] }
                                    }))
                                    .filter(item => item.detail.total !== 0)
                                    .sort((a, b) => Math.abs(b.detail.total) - Math.abs(a.detail.total));

                                if (!position) {
                                    return null;
                                }

                                return (
                                    <article
                                        key={lumina.id}
                                        style={{
                                            position: 'absolute',
                                            left: `${position.x}%`,
                                            top: `${position.y}%`,
                                            transform: 'translate(-50%, -50%)',
                                            width: '180px',
                                            border: `2px solid ${providedLuminaIds.includes(lumina.id) ? '#16a34a' : '#3b82f6'}`,
                                            borderRadius: '14px',
                                            background: providedLuminaIds.includes(lumina.id) ? 'rgba(233, 249, 239, 0.96)' : 'rgba(239, 246, 255, 0.96)',
                                            padding: '0.85rem',
                                            boxShadow: providedLuminaIds.includes(lumina.id)
                                                ? '0 12px 24px rgba(22, 163, 74, 0.12)'
                                                : '0 12px 24px rgba(37, 99, 235, 0.12)',
                                            zIndex: 1
                                        }}
                                    >
                                        <div style={{ fontWeight: 700, color: providedLuminaIds.includes(lumina.id) ? '#15803d' : '#1d4ed8' }}>{lumina.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.45rem' }}>
                                            {providedLuminaIds.includes(lumina.id) ? 'Provided by selected picto' : 'Added lumina'}
                                        </div>

                                        {links.length > 0 ? (
                                            <div style={{ display: 'grid', gap: '0.35rem' }}>
                                                {links.slice(0, 2).map(({ lumina: linkedLumina, detail }) => (
                                                    <button
                                                        key={linkedLumina.id}
                                                        type="button"
                                                        onClick={() => setSelectedConnection({ luminaA: lumina, luminaB: linkedLumina, detail })}
                                                        style={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            gap: '0.5rem',
                                                            width: '100%',
                                                            fontSize: '0.82rem',
                                                            padding: '0.35rem 0.45rem',
                                                            borderRadius: '8px',
                                                            border: '1px solid #bfdbfe',
                                                            background: '#ffffff',
                                                            cursor: 'pointer',
                                                            textAlign: 'left'
                                                        }}
                                                        title={detail.patterns.map(pattern => `${pattern.name} (${pattern.score > 0 ? '+' : ''}${pattern.score})`).join('\n')}
                                                    >
                                                        <span style={{ color: '#1f2937' }}>↔ {linkedLumina.name}</span>
                                                        <strong style={{ color: detail.total >= 0 ? '#2563eb' : '#dc2626' }}>
                                                            {detail.total > 0 ? '+' : ''}
                                                            {detail.total}
                                                        </strong>
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div style={{ color: '#94a3b8', fontSize: '0.84rem' }}>No active links</div>
                                        )}
                                    </article>
                                );
                            })}
                        </div>

                        {activeConnections.length > 0 && (
                            <div style={{ display: 'grid', gap: '0.6rem' }}>
                                <h4 style={{ margin: 0, color: '#1f2937' }}>Connection Legend</h4>
                                {activeConnections.map(connection => (
                                    <button
                                        key={`${connection.luminaA.id}-${connection.luminaB.id}-legend`}
                                        type="button"
                                        onClick={() => setSelectedConnection(connection)}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            gap: '0.75rem',
                                            alignItems: 'flex-start',
                                            width: '100%',
                                            border: '1px solid #dbeafe',
                                            borderRadius: '12px',
                                            padding: '0.7rem 0.8rem',
                                            background: '#ffffff',
                                            cursor: 'pointer',
                                            textAlign: 'left'
                                        }}
                                        title={connection.detail.patterns.map(pattern => `${pattern.name} (${pattern.score > 0 ? '+' : ''}${pattern.score})`).join('\n')}
                                    >
                                        <div style={{ minWidth: 0 }}>
                                            <div style={{ fontWeight: 700, color: '#1f2937' }}>
                                                {connection.luminaA.name} ↔ {connection.luminaB.name}
                                            </div>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.4rem' }}>
                                                {connection.detail.patterns.slice(0, 3).map((pattern, index) => (
                                                    <SynergyBadge
                                                        key={`${pattern.name}-${index}`}
                                                        patternName={pattern.name}
                                                        score={pattern.score}
                                                        title={`${pattern.name} (${pattern.score > 0 ? '+' : ''}${pattern.score})`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <strong style={{ color: connection.detail.total >= 0 ? '#2563eb' : '#dc2626', whiteSpace: 'nowrap' }}>
                                            {connection.detail.total > 0 ? '+' : ''}
                                            {connection.detail.total}
                                        </strong>
                                    </button>
                                ))}
                            </div>
                        )}

                        {allLuminas
                            .filter(lumina => !usedLuminaIds.includes(lumina.id))
                            .map(lumina => {
                                const total = usedLuminaIds.reduce(
                                    (sum, selectedId) => sum + (synergyMatrix[lumina.id]?.[selectedId]?.total ?? 0),
                                    0
                                );
                                if (total <= 0) return null;

                                const details = usedLuminaIds
                                    .map(selectedId => ({
                                        lumina: allLuminas.find(item => item.id === selectedId),
                                        detail: synergyMatrix[lumina.id]?.[selectedId] ?? { total: 0, patterns: [] }
                                    }))
                                    .filter(item => item.lumina && item.detail.total !== 0);

                                return (
                                    <article
                                        key={lumina.id}
                                        style={{
                                            border: '1px dashed #93c5fd',
                                            borderRadius: '12px',
                                            background: '#f8fafc',
                                            padding: '0.8rem'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', alignItems: 'baseline' }}>
                                            <div>
                                                <div style={{ fontWeight: 700, color: '#1f2937' }}>{lumina.name}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Not equipped</div>
                                            </div>
                                            <div style={{ color: '#1d4ed8', fontWeight: 700 }}>Total synergy: +{total}</div>
                                        </div>

                                        <div style={{ marginTop: '0.5rem', display: 'grid', gap: '0.4rem' }}>
                                            {details.map(item => (
                                                <div
                                                    key={item.lumina?.id}
                                                    style={{ fontSize: '0.78rem', color: '#334155' }}
                                                    title={
                                                        item.detail.patterns.length > 0
                                                            ? item.detail.patterns
                                                                .map(pattern => `${pattern.name} (${pattern.score > 0 ? '+' : ''}${pattern.score})`)
                                                                .join('\n')
                                                            : 'No pattern details'
                                                    }
                                                >
                                                    ↔ {item.lumina?.name}: {item.detail.total > 0 ? '+' : ''}
                                                    {item.detail.total}
                                                </div>
                                            ))}
                                        </div>
                                    </article>
                                );
                            })}
                    </div>
                )}
            </section>

            {selectedConnection && (
                <SynergyDetailPanel
                    luminaA={selectedConnection.luminaA}
                    luminaB={selectedConnection.luminaB}
                    detail={selectedConnection.detail}
                    onClose={() => setSelectedConnection(null)}
                />
            )}
        </>
    );
}

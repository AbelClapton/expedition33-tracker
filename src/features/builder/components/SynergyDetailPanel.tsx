'use client';

import { Lumina, SynergyDetail } from '@/engine/types';
import { SynergyBadge } from './SynergyBadge';

interface SynergyDetailPanelProps {
    luminaA: Lumina;
    luminaB: Lumina;
    detail: SynergyDetail;
    onClose: () => void;
}

function getScoreLabel(score: number) {
    return score > 0 ? `+${score}` : `${score}`;
}

export function SynergyDetailPanel({ luminaA, luminaB, detail, onClose }: SynergyDetailPanelProps) {
    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label={`Synergy details for ${luminaA.name} and ${luminaB.name}`}
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(22, 19, 15, 0.55)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '1.25rem',
                zIndex: 50
            }}
        >
            <div
                onClick={event => event.stopPropagation()}
                style={{
                    width: 'min(680px, 100%)',
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    background: '#fffdf7',
                    border: '1px solid rgba(78, 58, 34, 0.25)',
                    borderRadius: '18px',
                    boxShadow: '0 24px 48px rgba(22, 19, 15, 0.22)',
                    padding: '1rem 1rem 1.1rem'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <div>
                        <p style={{ margin: 0, fontSize: '0.74rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7c5a3c', fontWeight: 700 }}>
                            Synergy Detail
                        </p>
                        <h3 style={{ margin: '0.2rem 0 0', color: '#a13f1b', lineHeight: 1.25 }}>
                            {luminaA.name} <span style={{ color: '#7c5a3c' }}>→</span> {luminaB.name}
                        </h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            border: '1px solid #d1d5db',
                            background: '#ffffff',
                            borderRadius: '999px',
                            width: '2rem',
                            height: '2rem',
                            cursor: 'pointer',
                            color: '#4b5563',
                            fontSize: '1rem'
                        }}
                    >
                        ×
                    </button>
                </div>

                <div
                    style={{
                        marginTop: '0.85rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.4rem 0.7rem',
                        borderRadius: '999px',
                        background: detail.total >= 0 ? '#f0fdf4' : '#fef2f2',
                        border: `1px solid ${detail.total >= 0 ? '#bbf7d0' : '#fecaca'}`,
                        color: detail.total >= 0 ? '#166534' : '#b91c1c',
                        fontWeight: 700
                    }}
                >
                    Total synergy {getScoreLabel(detail.total)}
                </div>

                <div style={{ marginTop: '1rem', display: 'grid', gap: '0.75rem' }}>
                    {detail.patterns.length > 0 ? (
                        detail.patterns.map((pattern, index) => (
                            <article
                                key={`${pattern.name}-${index}`}
                                style={{
                                    padding: '0.8rem',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(78, 58, 34, 0.18)',
                                    background: 'rgba(255, 251, 242, 0.82)'
                                }}
                            >
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
                                    <SynergyBadge
                                        patternName={pattern.name}
                                        score={pattern.score}
                                        title={`${pattern.name} (${getScoreLabel(pattern.score)})`}
                                    />
                                </div>
                                <p style={{ margin: '0.55rem 0 0', color: '#3f3428', fontSize: '0.92rem' }}>
                                    {pattern.name}
                                </p>
                            </article>
                        ))
                    ) : (
                        <p style={{ margin: 0, color: '#6b7280' }}>No rule patterns found for this pair.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

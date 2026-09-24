import { Lumina, Stats } from '@/engine/types';
import { describeRule } from '@/engine/utils/describeRule';

interface BuildSummaryProps {
    totalStats: Stats;
    activeLuminas: Lumina[];
}

export function BuildSummary({ totalStats, activeLuminas }: BuildSummaryProps) {
    return (
        <section
            style={{
                background: '#f3f4f6',
                borderRadius: '14px',
                padding: '1.25rem',
                marginBottom: '1.25rem',
                boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
                border: '1px solid #e5e7eb'
            }}
        >
            <h1 style={{ margin: 0, color: '#111827' }}>Clair Obscur Build Tool</h1>
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                <div style={{ minWidth: '220px' }}>
                    <h3 style={{ marginTop: 0, color: '#1f2937' }}>Combined Stats</h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#111827' }}>
                        <li>Health: <strong>{totalStats.health}</strong></li>
                        <li>Defense: <strong>{totalStats.defense}</strong></li>
                        <li>Speed: <strong>{totalStats.speed}</strong></li>
                        <li>Crit Rate: <strong>{totalStats.critRate}%</strong></li>
                    </ul>
                </div>
                <div style={{ flex: 1, minWidth: '260px' }}>
                    <h3 style={{ marginTop: 0, color: '#1f2937' }}>Active Lumina Effects</h3>
                    {activeLuminas.length === 0 ? (
                        <p style={{ margin: 0, color: '#6b7280' }}>No luminas equipped.</p>
                    ) : (
                        <ul style={{ margin: 0, paddingLeft: '1.1rem', color: '#1f2937' }}>
                            {activeLuminas.map(lumina => (
                                <li key={lumina.id}>
                                    <strong>{lumina.name}</strong>
                                    <ul style={{ paddingLeft: '1.2rem', marginTop: '0.3rem' }}>
                                        {lumina.rules.map((rule, idx) => (
                                            <li key={`${lumina.id}-${idx}`}>{describeRule(rule)}</li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </section>
    );
}

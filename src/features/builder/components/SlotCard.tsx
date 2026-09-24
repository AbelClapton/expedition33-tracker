import { Lumina, Picto } from '@/engine/types';

interface SlotCardProps {
    slotIndex: number;
    picto: Picto | null;
    lumina: Lumina | null;
    onRemove: () => void;
}

export function SlotCard({ slotIndex, picto, lumina, onRemove }: SlotCardProps) {
    return (
        <article
            style={{
                border: '1px solid #d1d5db',
                borderRadius: '12px',
                padding: '1rem',
                width: '220px',
                background: picto ? '#ffffff' : '#f8fafc'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, color: '#111827' }}>Slot {slotIndex + 1}</span>
                {picto && (
                    <button
                        onClick={onRemove}
                        style={{
                            border: 'none',
                            background: '#ef4444',
                            color: '#ffffff',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            cursor: 'pointer'
                        }}
                        aria-label={`Remove slot ${slotIndex + 1}`}
                    >
                        x
                    </button>
                )}
            </div>

            {picto && lumina ? (
                <div style={{ color: '#1f2937' }}>
                    <div style={{ fontWeight: 700 }}>{lumina.name}</div>
                    <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>Lv.{picto.level}</div>
                    <div style={{ marginTop: '0.45rem', fontSize: '0.85rem' }}>
                        HP: {picto.stats.health} | Def: {picto.stats.defense}
                        <br />
                        Spd: {picto.stats.speed} | Crit: {picto.stats.critRate}%
                    </div>
                </div>
            ) : (
                <div style={{ minHeight: '76px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                    Empty
                </div>
            )}
        </article>
    );
}
